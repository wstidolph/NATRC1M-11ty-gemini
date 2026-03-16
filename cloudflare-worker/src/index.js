import { Octokit } from "@octokit/rest";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
        return errorResponse("Server misconfiguration. Missing GITHUB_TOKEN or GITHUB_REPO.");
      }

      const octokit = new Octokit({ auth: env.GITHUB_TOKEN });
      const [owner, repo] = env.GITHUB_REPO.split("/");

      // Route: GET /api/drafts
      // Returns a list of draft branches and their parsed frontmatter
      if (request.method === "GET" && path === "/api/drafts") {
        const { data: branches } = await octokit.rest.repos.listBranches({
          owner,
          repo,
          per_page: 100
        });

        const draftBranches = branches.filter(b => b.name.startsWith("draft/"));
        const drafts = [];

        for (const branch of draftBranches) {
          const slug = branch.name.replace("draft/", "");
          try {
            const { data: file } = await octokit.rest.repos.getContent({
              owner,
              repo,
              path: `src/articles/${slug}.md`,
              ref: branch.name
            });
            const content = atob(file.content);
            // Quick frontmatter parse
            let title = slug;
            let summary = "";
            let author = "";
            
            const lines = content.split("\n");
            if (lines[0] === "---") {
              for (let i = 1; i < lines.length; i++) {
                if (lines[i] === "---") break;
                if (lines[i].startsWith("title:")) {
                  title = lines[i].replace("title:", "").replace(/"/g, "").trim();
                }
                if (lines[i].startsWith("summary:")) {
                  summary = lines[i].replace("summary:", "").replace(/"/g, "").trim();
                }
                if (lines[i].startsWith("author:")) {
                  author = lines[i].replace("author:", "").replace(/"/g, "").trim();
                }
              }
            }

            drafts.push({
              branch: branch.name,
              slug,
              title,
              summary,
              author,
              content
            });
          } catch (e) {
            drafts.push({
              branch: branch.name,
              slug,
              title: slug,
              summary: "Could not load content",
              content: ""
            });
          }
        }

        return jsonResponse(drafts);
      }

      // Route: POST /api/draft
      // Creates or updates a draft article markdown file
      if (request.method === "POST" && path === "/api/draft") {
        const payload = await request.json();
        const { slug, title, markdown } = payload;
        
        if (!slug || !title || !markdown) {
          return errorResponse("Missing required fields: slug, title, markdown", 400);
        }

        const branchName = `draft/${slug}`;
        const filePath = `src/articles/${slug}.md`;

        // 1. Check if branch exists, if not, create off main
        try {
          await octokit.rest.repos.getBranch({ owner, repo, branch: branchName });
        } catch (e) {
          if (e.status === 404) {
            // Branch doesn't exist, create it
            const { data: mainBranch } = await octokit.rest.repos.getBranch({
              owner, repo, branch: "main"
            });
            await octokit.rest.git.createRef({
              owner, repo, ref: `refs/heads/${branchName}`, sha: mainBranch.commit.sha
            });
          } else {
             throw e;
          }
        }

        // 2. See if file exists to get SHA (for updates)
        let sha;
        try {
          const { data: existing } = await octokit.rest.repos.getContent({
            owner, repo, path: filePath, ref: branchName
          });
          sha = existing.sha;
        } catch (e) {}

        // 3. Create or update the file
        // btoa works reliably for utf-8 if encoded properly
        const base64Content = btoa(unescape(encodeURIComponent(markdown)));
        
        await octokit.rest.repos.createOrUpdateFileContents({
          owner, repo,
          path: filePath,
          message: `Update Article Draft: ${title}`,
          content: base64Content,
          branch: branchName,
          sha
        });

        return jsonResponse({ success: true, branch: branchName, slug });
      }

      // Route: POST /api/image
      // Uploads an image to the draft branch
      if (request.method === "POST" && path === "/api/image") {
         const payload = await request.json();
         const { slug, filename, base64Data } = payload;

         if (!slug || !filename || !base64Data) {
            return errorResponse("Missing fields", 400);
         }

         const branchName = `draft/${slug}`;
         const filePath = `src/assets/images/user-uploads/${filename}`;

         // Extract base64 without the data block prefix
         const content = base64Data.replace(/^data:image\/\w+;base64,/, "");

         try {
            await octokit.rest.repos.createOrUpdateFileContents({
              owner, repo,
              path: filePath,
              message: `Upload image for draft ${slug}`,
              content, // GitHub API expects raw base64 string for image files
              branch: branchName,
            });
            return jsonResponse({ success: true, filePath: `/assets/images/user-uploads/${filename}` });
         } catch (e) {
            return errorResponse(e.message, 500);
         }
      }

      // Route: POST /api/publish
      // Creates a PR and then merges it? Or just creates a PR
      if (request.method === "POST" && path === "/api/publish") {
         const payload = await request.json();
         const { slug, title } = payload;
         const branchName = `draft/${slug}`;

         // Create PR
         const { data: pr } = await octokit.rest.pulls.create({
            owner, repo,
            title: `Publish Article: ${title || slug}`,
            head: branchName,
            base: "main",
            body: "This article was submitted via the CMS form and is ready for publishing.\n\nReview the content and merge if approved!"
         });

         // Optional: Auto-merge the PR if we trust user contributions implicitly,
         // but PR is usually safer for CMS review!
         // await octokit.rest.pulls.merge({ owner, repo, pull_number: pr.number });

         return jsonResponse({ success: true, prUrl: pr.html_url });
      }

      // Route: POST /api/leadline
      // Specialized handler to upload PDF and update leadlines.json
      if (request.method === "POST" && path === "/api/leadline") {
        const payload = await request.json();
        const { title, filename, base64Data } = payload;

        if (!title || !filename || !base64Data) {
          return errorResponse("Missing fields", 400);
        }

        const slug = filename.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]/g, "-");
        const branchName = `leadline/${slug}`;

        // 1. Create branch off main
        try {
          const { data: mainBranch } = await octokit.rest.repos.getBranch({
            owner, repo, branch: "main"
          });
          await octokit.rest.git.createRef({
            owner, repo, ref: `refs/heads/${branchName}`, sha: mainBranch.commit.sha
          });
        } catch (e) {
          // If branch exists, we can continue or error. Let's error for safety.
          if (e.status !== 422) throw e; 
        }

        // 2. Upload PDF
        const pdfContent = base64Data.replace(/^data:application\/pdf;base64,/, "");
        await octokit.rest.repos.createOrUpdateFileContents({
          owner, repo,
          path: `src/assets/leadlines/${filename}`,
          message: `Add Leadline PDF: ${title}`,
          content: pdfContent,
          branch: branchName
        });

        // 3. Update src/_data/leadlines.json
        const jsonPath = "src/_data/leadlines.json";
        let leadlines = [];
        let jsonSha;
        try {
          const { data: existingJson } = await octokit.rest.repos.getContent({
            owner, repo, path: jsonPath, ref: branchName
          });
          jsonSha = existingJson.sha;
          leadlines = JSON.parse(atob(existingJson.content));
        } catch (e) {}

        // Prepend new leadline
        leadlines.unshift({ filename, title });
        
        const updatedJsonContent = btoa(JSON.stringify(leadlines, null, 2));
        await octokit.rest.repos.createOrUpdateFileContents({
          owner, repo,
          path: jsonPath,
          message: `Update leadlines.json for ${title}`,
          content: updatedJsonContent,
          branch: branchName,
          sha: jsonSha
        });

        // 4. Create PR
        const { data: pr } = await octokit.rest.pulls.create({
          owner, repo,
          title: `New Leadline: ${title}`,
          head: branchName,
          base: "main",
          body: `This leadline was uploaded via the admin script.\n\nFile: ${filename}\nTitle: ${title}`
        });

        return jsonResponse({ success: true, prUrl: pr.html_url });
      }

      return errorResponse("Not found", 404);

    } catch (err) {
      return errorResponse(err.message, 500);
    }
  }
};
