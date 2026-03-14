import { Octokit } from "octokit";

window.cmsEditor = function () {
    return {
        articleTitle: "",
        articleSummary: "",
        authorName: localStorage.getItem("author_name") || "",
        authorEmail: localStorage.getItem("author_email") || "",
        availableDrafts: [],
        token: localStorage.getItem("gh_token") || "",
        showAuth: !localStorage.getItem("gh_token"),
        loading: false,
        repo: "wstidloff/NATRC1M-11ty-gemini",
        quill: null,

        async init() {
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

            if (this.token) {
                await this.fetchDrafts();
            }

            // Watch for metadata changes and save to local storage
            this.$watch("authorName", (val) => localStorage.setItem("author_name", val));
            this.$watch("authorEmail", (val) => localStorage.setItem("author_email", val));
        },

        async imageHandler() {
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
                    const slug = this.slugify(this.articleTitle || "untitled");
                    const branchName = `draft/${slug}`;
                    const fileName = `${Date.now()}-${file.name}`;
                    const path = `src/assets/images/drafts/${fileName}`;

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
                this.fetchDrafts();
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

        async fetchDrafts() {
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const { data: branches } = await octokit.rest.repos.listBranches({
                    owner,
                    repo
                });
                this.availableDrafts = branches.filter(b => b.name.startsWith("draft/"));
            } catch (err) {
                console.error("Failed to fetch drafts", err);
            }
        },

        async loadDraft(branchName) {
            if (!branchName) return;
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                
                // We assume there's one .md file in src/articles matching the slug
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
                alert(`Loaded draft: ${slug}`);
            } catch (err) {
                console.error(err);
                alert("Failed to load draft: " + err.message);
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
                    const [key, ...rest] = lines[i].split(":");
                    const val = rest.join(":").trim().replace(/^"(.*)"$/, "$1");
                    if (key.trim() === "title") this.articleTitle = val;
                    if (key.trim() === "summary") this.articleSummary = val;
                    if (key.trim() === "author") this.authorName = val;
                    if (key.trim() === "email") this.authorEmail = val;
                }
            }

            const body = lines.slice(bodyStartIndex).join("\n").trim();
            this.quill.root.innerHTML = body.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
            if (!this.quill.root.innerHTML.startsWith("<p>")) {
                this.quill.root.innerHTML = `<p>${this.quill.root.innerHTML}</p>`;
            }
        },

        async saveDraft() {
            this.loading = true;
            try {
                const octokit = await this.getOctokit();
                const [owner, repo] = this.repo.split("/");
                const slug = this.slugify(this.articleTitle || "untitled");
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
                } catch (e) {}

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
                } catch (e) {}

                await octokit.rest.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path,
                    message: `Draft update: ${this.articleTitle}`,
                    content: btoa(unescape(encodeURIComponent(markdown))),
                    branch: branchName,
                    sha
                });

                await this.fetchDrafts();
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
                const slug = this.slugify(this.articleTitle);
                const branchName = `draft/${slug}`;

                await octokit.rest.pulls.create({
                    owner,
                    repo,
                    title: `Article Submission: ${this.articleTitle}`,
                    head: branchName,
                    base: "main",
                    body: `Please review this article from ${this.authorName} (${this.authorEmail})\n\nSummary: ${this.articleSummary}`
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
                const slug = this.slugify(this.articleTitle);
                const branchName = `draft/${slug}`;

                await octokit.rest.git.deleteRef({
                    owner,
                    repo,
                    ref: `heads/${branchName}`
                });

                await this.fetchDrafts();
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
---

${body}`;
        }
    };
};
