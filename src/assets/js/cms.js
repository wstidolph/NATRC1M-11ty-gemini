window.cmsEditor = function () {
    return {
        articleTitle: "",
        articleSummary: "",
        authorName: localStorage.getItem("author_name") || "",
        authorEmail: localStorage.getItem("author_email") || "",
        availableDrafts: [],
        hasSavedDraft: false,
        token: localStorage.getItem("gh_token") || "",
        showAuth: !localStorage.getItem("gh_token"),
        loading: false,
        repo: "wstidolph/NATRC1M-11ty-gemini",
        quill: null,

        async init() {
            if (this.quill) {
                console.log("CMS Editor: already initialized");
                return;
            }
            console.log("CMS Editor: init starting");

            // Explicitly reset variables to empty strings to avoid browser [object] conflicts
            this.articleTitle = "";
            this.articleSummary = "";

            try {
                if (typeof Quill !== "undefined") {
                    // Initialize once
                    this.quill = new Quill("#editor", {
                        theme: "snow",
                        modules: {
                            toolbar: {
                                container: [
                                    [{ header: [1, 2, 3, false] }],
                                    ["bold", "italic", "underline", "link"],
                                    ["image", "blockquote", "code-block"],
                                    [{ list: "ordered" }, { list: "bullet" }]
                                ],
                                handlers: {
                                    image: this.imageHandler.bind(this)
                                }
                            }
                        }
                    });
                    console.log("CMS Editor: Quill initialized");
                } else {
                    console.error("CMS Editor: Quill is missing from window");
                }
            } catch (err) {
                console.error("CMS Editor: Initialization failed", err);
            }

            if (this.token) {
                await this.fetchDrafts();
            }

            this.$watch("authorName", (val) => localStorage.setItem("author_name", val));
            this.$watch("authorEmail", (val) => localStorage.setItem("author_email", val));
        },

        async getOctokit() {
            if (!this.token) {
                this.showAuth = true;
                throw new Error("GitHub Token Missing. Please click 'GitHub Settings' to enter a token.");
            }
            try {
                // Check if already loaded on window (via the module script in the HTML)
                if (window.Octokit) {
                    console.log("CMS Editor: Using Octokit from window");
                    return new window.Octokit({ auth: this.token });
                }
                
                console.log("CMS Editor: Fallback to dynamic import via esm.run");
                const { Octokit } = await import("https://esm.run/octokit");
                return new Octokit({ auth: this.token });
            } catch (err) {
                console.error("CMS Editor: Failed to load Octokit library", err);
                throw new Error(`Initialization Failed: Could not load GitHub library. Error: ${err.message}. Please check your internet connection or browser security settings.`);
            }
        },

        async fetchDrafts() {
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const { data: branches } = await octokit.rest.repos.listBranches({
                    owner,
                    repo
                });
                this.availableDrafts = branches.filter(b => b.name.startsWith("draft/"));
                console.log("CMS Editor: Drafts synced", this.availableDrafts);
            } catch (err) {
                console.error("CMS Editor: Sync error", err);
            } finally {
                this.loading = false;
            }
        },

        async loadDraft(branchName) {
            if (!branchName) return;
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = branchName.replace("draft/", "");
                const path = `src/articles/${slug}.md`;

                const { data: file } = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path,
                    ref: branchName
                });

                const content = decodeURIComponent(escape(atob(file.content)));
                this.parseMarkdown(content);
                this.hasSavedDraft = true;
                alert(`Successfully loaded draft: ${slug}`);
            } catch (err) {
                console.error(err);
                alert("Load Failed: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        parseMarkdown(markdown) {
            const lines = markdown.split("\n");
            let inFrontmatter = false;
            let bodyStartIndex = 0;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim() === "---") {
                    if (!inFrontmatter) {
                        inFrontmatter = true;
                    } else {
                        inFrontmatter = false;
                        bodyStartIndex = i + 1;
                        break;
                    }
                    continue;
                }

                if (inFrontmatter) {
                    const parts = lines[i].split(":");
                    if (parts.length < 2) continue;
                    const key = parts[0].trim().toLowerCase();
                    const val = parts.slice(1).join(":").trim().replace(/^"(.*)"$/, "$1");

                    if (key === "title") this.articleTitle = val;
                    if (key === "summary") this.articleSummary = val;
                    if (key === "author") this.authorName = val;
                    if (key === "email") this.authorEmail = val;
                }
            }

            const body = lines.slice(bodyStartIndex).join("\n").trim();
            this.quill.root.innerHTML = body.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
            if (!this.quill.root.innerHTML.startsWith("<p>")) {
                this.quill.root.innerHTML = `<p>${this.quill.root.innerHTML}</p>`;
            }
        },

        async saveDraft() {
            if (!this.articleTitle) {
                alert("Required: Please enter an Article Title.");
                return;
            }
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.articleTitle);
                const branchName = `draft/${slug}`;
                const path = `src/articles/${slug}.md`;

                const { data: mainBranch } = await octokit.rest.repos.getBranch({
                    owner,
                    repo,
                    branch: "main"
                });

                try {
                    await octokit.rest.git.createRef({
                        owner,
                        repo,
                        ref: `refs/heads/${branchName}`,
                        sha: mainBranch.commit.sha
                    });
                } catch (e) { }

                const markdown = this.prepareContent();

                let sha;
                try {
                    const { data: existing } = await octokit.rest.repos.getContent({
                        owner,
                        repo,
                        path,
                        ref: branchName
                    });
                    sha = existing.sha;
                } catch (e) { }

                await octokit.rest.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path,
                    message: `Update Article: ${this.articleTitle}`,
                    content: btoa(unescape(encodeURIComponent(markdown))),
                    branch: branchName,
                    sha
                });

                this.hasSavedDraft = true;
                await this.fetchDrafts();
                alert(`Success! Draft saved to branch: ${branchName}`);
            } catch (err) {
                console.error(err);
                alert("Save Failed: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        async requestPublish() {
            if (!this.articleTitle) {
                alert("Required: Article Title");
                return;
            }
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.articleTitle);
                const branchName = `draft/${slug}`;

                await octokit.rest.pulls.create({
                    owner,
                    repo,
                    title: `Article Submission: ${this.articleTitle}`,
                    head: branchName,
                    base: "main",
                    body: `Submission from: ${this.authorName} (${this.authorEmail})\n\nSummary: ${this.articleSummary}`
                });

                alert("Submitted! A review request has been sent to the site owner.");
            } catch (err) {
                console.error(err);
                alert("Submission Failed: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        async deleteDraft() {
            if (!confirm("Are you sure you want to delete this draft branch from GitHub?")) return;
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.articleTitle);
                const branchName = `draft/${slug}`;

                await octokit.rest.git.deleteRef({
                    owner,
                    repo,
                    ref: `heads/${branchName}`
                });

                await this.fetchDrafts();
                alert("Branch deleted successfully.");
            } catch (err) {
                console.error(err);
                alert("Delete Failed: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        prepareContent() {
            const html = this.quill.root.innerHTML;
            let body = html
                .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
                .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
                .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
                .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
                .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
                .replace(/<em>(.*?)<\/em>/g, "_$1_")
                .replace(/<br>/g, "\n");

            body = body.replace(/<[^>]*>?/gm, "");

            return `---
title: "${this.articleTitle}"
summary: "${this.articleSummary}"
author: "${this.authorName}"
email: "${this.authorEmail}"
date: ${new Date().toISOString().split("T")[0]}
tags: ["articles", "contributions"]
---

${body}`;
        },

        saveToken() {
            if (this.token) {
                localStorage.setItem("gh_token", this.token);
                this.showAuth = false;
                this.fetchDrafts();
            }
        },

        imageHandler() {
            console.log("CMS Editor: Image handler triggered");
            if (!this.articleTitle) {
                alert("Please enter an Article Title before adding images. We use the title to organize your draft folder.");
                return;
            }

            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.style.display = "none";
            document.body.appendChild(input);
            
            input.click();

            input.onchange = async () => {
                document.body.removeChild(input);
                const file = input.files[0];
                if (!file) return;

                this.loading = true;
                try {
                    const octokit = await this.getOctokit();
                    const [owner, repo] = this.repo.split("/");
                    const slug = this.slugify(this.articleTitle);
                    const branchName = `draft/${slug}`;

                    // Ensure branch exists (try to create from main if it doesn't)
                    try {
                        const { data: mainBranch } = await octokit.rest.repos.getBranch({ owner, repo, branch: "main" });
                        await octokit.rest.git.createRef({
                            owner,
                            repo,
                            ref: `refs/heads/${branchName}`,
                            sha: mainBranch.commit.sha
                        });
                    } catch (e) {
                        // Branch likely already exists or we can't create it yet
                    }

                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const content = e.target.result.split(",")[1];
                        const fileName = `${Date.now()}-${this.slugify(file.name.split(".")[0])}.${file.name.split(".").pop()}`;
                        const path = `src/assets/images/user-uploads/${fileName}`;

                        await octokit.rest.repos.createOrUpdateFileContents({
                            owner,
                            repo,
                            path,
                            message: `Upload Image: ${fileName} for ${this.articleTitle}`,
                            content,
                            branch: branchName
                        });

                        const range = this.quill.getSelection();
                        // Use relative path for local preview and absolute-ish for Github Pages
                        const url = `/NATRC1M-11ty-gemini/assets/images/user-uploads/${fileName}`;
                        this.quill.insertEmbed(range ? range.index : 0, "image", url);
                        alert("Image uploaded and inserted! (Note: It may take a minute for the link to 'wake up' on GitHub, but it is saved in your draft)");
                    };
                    reader.readAsDataURL(file);
                } catch (err) {
                    console.error("Image Upload Error:", err);
                    alert("Image Upload Failed: " + err.message);
                } finally {
                    this.loading = false;
                }
            };
        },

        slugify(text) {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-");
        }
    };
};
