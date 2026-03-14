import { Octokit } from "octokit";

window.cmsEditor = function () {
    return {
        title: "",
        summary: "",
        token: localStorage.getItem("gh_token") || "",
        showAuth: !localStorage.getItem("gh_token"),
        loading: false,
        repo: "wstidloff/NATRC1M-11ty-gemini",
        quill: null,

        init() {
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
                            image: () => this.imageHandler()
                        }
                    }
                }
            });
        },

        imageHandler() {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (!file) return;

                this.loading = true;
                try {
                    const octokit = await this.getOctokit();
                    const [owner, repo] = this.repo.split("/");
                    const slug = this.slugify(this.title || "untitled");
                    const branchName = `draft/${slug}`;
                    const fileName = `${Date.now()}-${file.name}`;
                    const path = `src/assets/images/drafts/${fileName}`;

                    // Convert file to base64
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const content = e.target.result.split(",")[1];
                        
                        await octokit.rest.repos.createOrUpdateFileContents({
                            owner,
                            repo,
                            path,
                            message: `Upload image: ${fileName}`,
                            content,
                            branch: branchName
                        });

                        const range = this.quill.getSelection();
                        const url = `https://raw.githubusercontent.com/${this.repo}/${branchName}/${path}`;
                        this.quill.insertEmbed(range.index, "image", url);
                    };
                    reader.readAsDataURL(file);
                } catch (err) {
                    console.error(err);
                    alert("Image upload failed: " + err.message);
                } finally {
                    this.loading = false;
                }
            };
        },

        saveToken() {
            if (this.token) {
                localStorage.setItem("gh_token", this.token);
                this.showAuth = false;
            }
        },

        async getOctokit() {
            if (!this.token) {
                this.showAuth = true;
                throw new Error("No token");
            }
            return new Octokit({ auth: this.token });
        },

        slugify(text) {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-");
        },

        async saveDraft() {
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.title || "untitled");
                const branchName = `draft/${slug}`;
                const path = `src/articles/${slug}.md`;

                // 1. Get main branch SHA
                const { data: mainBranch } = await octokit.rest.repos.getBranch({
                    owner,
                    repo,
                    branch: "main"
                });

                // 2. Try to create branch (ignore if exists)
                try {
                    await octokit.rest.git.createRef({
                        owner,
                        repo,
                        ref: `refs/heads/${branchName}`,
                        sha: mainBranch.commit.sha
                    });
                } catch (e) {
                    console.log("Branch might already exist", e);
                }

                // 3. Prepare content (Minimal Markdown conversion for now)
                const markdown = this.prepareContent();

                // 4. Get file if exists to get SHA
                let sha;
                try {
                    const { data: existing } = await octokit.rest.repos.getContent({
                        owner,
                        repo,
                        path,
                        ref: branchName
                    });
                    sha = existing.sha;
                } catch (e) {}

                // 5. Commit file
                await octokit.rest.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path,
                    message: `Draft: ${this.title}`,
                    content: btoa(unescape(encodeURIComponent(markdown))),
                    branch: branchName,
                    sha
                });

                alert(`Draft saved to branch: ${branchName}`);
            } catch (err) {
                console.error(err);
                alert("Failed to save draft: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        async requestPublish() {
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.title);
                const branchName = `draft/${slug}`;

                await octokit.rest.pulls.create({
                    owner,
                    repo,
                    title: `Article Submission: ${this.title}`,
                    head: branchName,
                    base: "main",
                    body: `Please review my article: ${this.title}\n\nSummary: ${this.summary}`
                });

                alert("Publication requested! A Pull Request has been created.");
            } catch (err) {
                console.error(err);
                alert("Failed to create PR: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        async deleteDraft() {
            if (!confirm("Are you sure you want to delete this draft branch?")) return;
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.title);
                const branchName = `draft/${slug}`;

                await octokit.rest.git.deleteRef({
                    owner,
                    repo,
                    ref: `heads/${branchName}`
                });

                alert("Draft branch deleted.");
            } catch (err) {
                console.error(err);
                alert("Failed to delete draft: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        prepareContent() {
            const html = this.quill.root.innerHTML;
            // Native-ish basic HTML to MD conversion
            let body = html
                .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
                .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
                .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
                .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
                .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
                .replace(/<em>(.*?)<\/em>/g, "_$1_")
                .replace(/<br>/g, "\n");

            // Strip any remaining HTML
            body = body.replace(/<[^>]*>?/gm, "");

            return `---
title: "${this.title}"
summary: "${this.summary}"
date: ${new Date().toISOString().split("T")[0]}
---

${body}`;
        }
    };
};
