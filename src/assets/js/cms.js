window.cmsEditor = function () {
    return {
        articleTitle: "",
        articleSummary: "",
        authorName: localStorage.getItem("author_name") || "",
        authorEmail: localStorage.getItem("author_email") || "",
        availableDrafts: [],
        hasSavedDraft: false,
        loading: false,
        draftId: "",
        repo: "wstidolph/NATRC1M-11ty-gemini",
        // UPDATE THIS URL ONCE YOUR CLOUDFLARE WORKER IS DEPLOYED
        workerUrl: "https://natrc-cms-worker.natrc1.workers.dev",
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
                    // Extend the default Image blot to natively support 'width' and 'dataFilename'
                    // This prevents Quill's internal model from locking up when we add custom styles
                    const BaseImageFormat = Quill.import('formats/image');
                    class CustomImage extends BaseImageFormat {
                        static formats(domNode) {
                            return {
                                width: domNode.style.width || null,
                                dataFilename: domNode.getAttribute('data-filename') || null
                            };
                        }
                        format(name, value) {
                            if (name === 'width') {
                                if (value) this.domNode.style.width = value;
                                else this.domNode.style.width = '';
                            } else if (name === 'dataFilename') {
                                if (value) this.domNode.setAttribute('data-filename', value);
                                else this.domNode.removeAttribute('data-filename');
                            } else {
                                super.format(name, value);
                            }
                        }
                    }
                    Quill.register(CustomImage, true);

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

        async fetchDrafts() {
            this.loading = true;
            try {
                const res = await fetch(`${this.workerUrl}/api/drafts`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const drafts = await res.json();
                this.availableDrafts = drafts.map(d => ({ name: d.branch, content: d.content }));
                console.log("CMS Editor: Drafts synced", this.availableDrafts);
            } catch (err) {
                console.error("CMS Editor: Sync error", err);
            } finally {
                this.loading = false;
            }
        },

        async loadDraft(branchName) {
            if (!branchName) return;
            const draft = this.availableDrafts.find(d => d.name === branchName);
            if (!draft || !draft.content) {
                alert("Could not load draft content. Try refreshing drafts.");
                return;
            }
            this.loading = true;
            try {
                const slug = branchName.replace("draft/", "");
                this.parseMarkdown(draft.content, branchName);
                this.hasSavedDraft = true;
                alert(`Successfully loaded draft: ${slug}`);
            } catch (err) {
                console.error(err);
                alert("Load Failed: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        parseMarkdown(markdown, branchName = null) {
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
                    if (key === "draft_id") this.draftId = val;
                }
            }

            const body = lines.slice(bodyStartIndex).join("\n").trim();
            const imageStash = [];

            // Convert markdown images back to HTML for Quill and stash them
            // We handle the 11ty 'url' filter syntax and add the pathPrefix back for editor preview
            let htmlBody = body.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
                let cleanSrc = src;
                // De-nunjucks: {{ '/path' | url }} -> /path
                if (src.includes("{{") && src.includes("| url")) {
                    cleanSrc = src.replace(/\{\{\s*['"](.*?)['"]\s*\|\s*url\s*\}\}/, "$1");
                }

                let fullSrc;
                if (branchName && cleanSrc.startsWith("/")) {
                    fullSrc = `https://raw.githubusercontent.com/${this.repo}/${branchName}/src${cleanSrc}`;
                } else {
                    fullSrc = cleanSrc.startsWith("/") ? `/NATRC1M-11ty-gemini${cleanSrc}` : cleanSrc;
                }
                const imgHtml = `<img src="${fullSrc}" alt="${alt}">`;
                imageStash.push(imgHtml);
                return `[[[IMGSTASH${imageStash.length - 1}]]]`;
            });

            // Also convert any preserved HTML tags (which have custom widths) back for Quill and stash them
            htmlBody = htmlBody.replace(/<img[^>]*src=(["'])(.*?)\1[^>]*alt=(["'])(.*?)\3[^>]*style=(["'])[^"']*width:\s*(\d+)%[^"']*\5[^>]*>/g, (match, q1, src, q2, alt, q3, width) => {
                let cleanSrc = src;
                // De-nunjucks: {{ '/path' | url }} -> /path
                if (src.includes("{{") && src.includes("| url")) {
                    cleanSrc = src.replace(/\{\{\s*['"](.*?)['"]\s*\|\s*url\s*\}\}/, "$1");
                }

                let fullSrc;
                if (branchName && cleanSrc.startsWith("/")) {
                    fullSrc = `https://raw.githubusercontent.com/${this.repo}/${branchName}/src${cleanSrc}`;
                } else {
                    fullSrc = cleanSrc.startsWith("/") ? `/NATRC1M-11ty-gemini${cleanSrc}` : cleanSrc;
                }

                const imgHtml = `<img src="${fullSrc}" alt="${alt}" style="width: ${width}%;">`;
                imageStash.push(imgHtml);
                return `[[[IMGSTASH${imageStash.length - 1}]]]`;
            });

            // Also convert basic markdown formatting back to HTML
            htmlBody = htmlBody
                .replace(/^### (.*)$/gim, "<h3>$1</h3>")
                .replace(/^## (.*)$/gim, "<h2>$1</h2>")
                .replace(/^# (.*)$/gim, "<h1>$1</h1>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/_(.*?)_/g, "<em>$1</em>");

            // Restore images from stash
            imageStash.forEach((markdown, index) => {
                htmlBody = htmlBody.replace(`[[[IMGSTASH${index}]]]`, markdown);
            });

            // Generate clean HTML. Wrap standalone elements in paragraphs for Quill's expected block format
            let htmlContent = htmlBody.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
            if (!htmlContent.startsWith("<p>")) {
                htmlContent = `<p>${htmlContent}</p>`;
            }

            // Let Quill safely parse and insert the HTML
            this.quill.clipboard.dangerouslyPasteHTML(htmlContent);
        },

        async saveDraft() {
            if (!this.articleTitle) {
                alert("Required: Please enter an Article Title.");
                return;
            }
            this.loading = true;
            try {
                const slug = this.getSlug();
                const branchName = `draft/${slug}`;
                const markdown = this.prepareContent();

                const res = await fetch(`${this.workerUrl}/api/draft`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug, title: this.articleTitle, markdown })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Network response was not ok");
                }

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
                const slug = this.getSlug();
                
                const res = await fetch(`${this.workerUrl}/api/publish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug, title: this.articleTitle })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Network error requesting publish");
                }

                alert("Submitted! A review request has been sent to the site owner.");
            } catch (err) {
                console.error(err);
                alert("Submission Failed: " + err.message);
            } finally {
                this.loading = false;
            }
        },

        async deleteDraft() {
            if (!confirm("Are you sure you want to delete this draft branch?")) return;
            this.loading = true;
            try {
                const slug = this.getSlug();

                const res = await fetch(`${this.workerUrl}/api/draft`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Failed to delete branch");
                }

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
            // Use a temporary DOM element to parse HTML more reliably than regex
            const temp = document.createElement("div");
            temp.innerHTML = this.quill.root.innerHTML;

            // Use an array to stash image nodes so they aren't mangled by regex or innerHTML encoding
            const imageStash = [];

            // 1. Process images FIRST and explicitly
            const images = temp.querySelectorAll("img");
            images.forEach((img, index) => {
                let src = img.getAttribute("src") || "";
                const alt = img.getAttribute("alt") || "";
                const dataFilename = img.getAttribute("data-filename");

                let rootRelativeSrc;

                // If this was a newly inserted image with a base64 source, construct the true path
                if (dataFilename) {
                    rootRelativeSrc = `/assets/images/user-uploads/${dataFilename}`;
                } else if (src.startsWith("https://raw.githubusercontent.com/")) {
                    // Reverse the Github raw url back to the local relative src
                    const ghMatch = src.match(/\/src(\/assets\/.*)$/);
                    if (ghMatch) {
                        rootRelativeSrc = ghMatch[1];
                    } else {
                        rootRelativeSrc = src.replace("/NATRC1M-11ty-gemini/", "/");
                    }
                } else {
                    // Fallback to stripping any existing prefix if present to normalize to a root-relative path
                    rootRelativeSrc = src.replace("/NATRC1M-11ty-gemini/", "/");
                }

                const styleWidth = img.style.width;

                // If it has a custom width, preserve it as an HTML tag in the Markdown
                let finalMarkdown;
                if (styleWidth) {
                    finalMarkdown = `<img src="{{ '${rootRelativeSrc}' | url }}" alt="${alt}" style="width: ${styleWidth};">`;
                } else {
                    // Otherwise use standard Markdown
                    finalMarkdown = `![${alt}]({{ '${rootRelativeSrc}' | url }})`;
                }

                imageStash.push(finalMarkdown);
                const placeholder = document.createTextNode(`[[[IMG_STASH_${index}]]]`);
                img.parentNode.replaceChild(placeholder, img);
            });

            // 2. Now handle basic block formatting with regex on the partially cleaned HTML
            let body = temp.innerHTML
                .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
                .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
                .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
                .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
                .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
                .replace(/<em>(.*?)<\/em>/g, "_$1_")
                .replace(/<br\s*\/?>/g, "\n");

            // 3. Final strip of all remaining HTML tags
            body = body.replace(/<[^>]*>?/gm, "").trim();

            // 4. Restore the stashed images
            imageStash.forEach((markdown, index) => {
                body = body.replace(`[[[IMG_STASH_${index}]]]`, markdown);
            });

            return `---
title: "${this.articleTitle}"
layout: base.njk
summary: "${this.articleSummary}"
author: "${this.authorName}"
email: "${this.authorEmail}"
draft_id: "${this.draftId}"
date: ${new Date().toISOString()}
tags: ["articles", "contributions"]
---

${body}`;
        },

        imageHandler() {
            console.log("CMS Editor: Image handler triggered");
            if (!this.articleTitle) {
                alert("Please enter an Article Title before adding images.");
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
                const range = this.quill.getSelection();
                const index = range ? range.index : 0;

                try {
                    const slug = this.getSlug();

                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const base64 = e.target.result;
                        const fileName = `${Date.now()}-${this.slugify(file.name.split(".")[0])}.${file.name.split(".").pop()}`;

                        // Insert local preview immediately
                        this.quill.insertEmbed(index, "image", base64);

                        // We use Quill's formatting API so it tracks the custom attributes internally
                        this.quill.formatText(index, 1, 'dataFilename', fileName);

                        // Prompt user for image width
                        const widthInput = prompt("Enter image width percentage (e.g., 50 for 50%, 100 for full width):", "100");
                        const width = parseInt(widthInput, 10);
                        if (!isNaN(width) && width > 0 && width <= 100) {
                            this.quill.formatText(index, 1, 'width', `${width}%`);
                        } else {
                            this.quill.formatText(index, 1, 'width', '100%');
                        }

                        try {
                            const res = await fetch(`${this.workerUrl}/api/image`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ slug, filename: fileName, base64Data: base64 })
                            });

                            if (!res.ok) {
                                const data = await res.json().catch(() => ({}));
                                throw new Error(data.error || "Image upload failed");
                            }
                            console.log("Image synced via worker and meta attribute updated in editor");
                        } catch (uploadErr) {
                            console.error("Upload failed", uploadErr);
                            alert("Warning: Post saved locally in editor, but could not sync to Cloudflare Worker.");
                        }
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
        },

        getSlug() {
            let suffix = "";
            if (this.authorEmail) {
                // Strategy: Use a shortened, sanitized version of the email.
                // Example: wayne@example.com -> (wayn...at...exam...)
                const user = this.authorEmail.split("@")[0].slice(0, 4);
                const domain = (this.authorEmail.split("@")[1] || "").split(".")[0].slice(0, 4);
                suffix = `(${user}...at...${domain}...)`;
            } else {
                // If no email, use a persistent draftId (generated once per session/draft).
                if (!this.draftId) {
                    this.draftId = new Date().getTime().toString(36).slice(-6);
                }
                suffix = `(${this.draftId})`;
            }
            // Combining title and suffix ensures uniqueness even with identical titles.
            return this.slugify(`${this.articleTitle} ${suffix}`);
        }
    };
};
