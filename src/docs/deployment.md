---
title: "Deployment & Infrastructure Guide"
---
# Deployment & Infrastructure Guide

This document centralizes the information regarding the hosting, generation, and automated workflows that power the NATRC Region 1 website.

## 1. Core Hosting Architecture
The website is a **Static Site** that is compiled from source code and hosted on a global Content Delivery Network (CDN).

*   **Source Code**: Managed in a [GitHub Repository](https://github.com/wstidolph/NATRC1M-11ty-gemini).
*   **Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/) compiles Markdown and Nunjucks into static HTML.
*   **Hosting**: [GitHub Pages](https://pages.github.com/) serves the compiled files from the `gh-pages` internal artifact.

## 2. Automated Build & Deployment (CI/CD)
The site uses a **GitHub Actions Workflow** located at `.github/workflows/deploy.yml`.

### The Deployment Process:
1.  **Trigger**: Every push or merge to the `main` branch triggers the workflow.
2.  **Environment Setup**: A Linux container installs Node.js and project dependencies.
3.  **Site Generation**: The command `npm run build` is executed.
    *   This generates the deep-search indices for both PDFs and Member Contributions.
    *   Eleventy compiles the final `_site/` directory.
4.  **Publishing**: The `_site/` directory is securely uploaded and deployed live to GitHub Pages.

## 3. Anonymous CMS Infrastructure
The "Write a Story" feature uses a serverless backend to allow community members to submit content without GitHub accounts.

### Components:
*   **Cloudflare Worker**: A serverless application named `natrc-cms-worker` acts as a secure proxy.
*   **Bot Account (`@natrc1-cms-bot`)**: A dedicated GitHub account used by the Worker to perform commits and open Pull Requests.
*   **Quill.js Frontend**: The editor in the browser communicates with the Cloudflare Worker via authenticated API calls.

### Updating the Worker:
1.  Navigate to the `cloudflare-worker/` directory.
2.  Follow the instructions in the `package.json` to deploy changes using `npm run deploy` (requires Wrangler/Cloudflare CLI).
3.  **Secrets**: The `GITHUB_TOKEN` is NOT stored in code. It must be set as a Cloudflare secret:
    ```bash
    npx wrangler secret put GITHUB_TOKEN
    ```

## 4. Ownership Migration Guide
If the site needs to be moved to a new GitHub owner or organization, follow these steps:

### Phase A: GitHub Repository
1.  Transfer or fork the repository to the new owner.
2.  Under **Settings > Pages**, set the Build source to **GitHub Actions**.
3.  **Path Prefix**: If the repository name changes, update the `pathPrefix` string in `eleventy.config.js` to match the new URL path (e.g., `"/new-repo-name/"`).

### Phase B: Cloudflare Worker
1.  Update the `GITHUB_REPO` variable in `cloudflare-worker/wrangler.toml` to point to the new `"owner/repo"`.
2.  Create a new **Fine-grained Personal Access Token (PAT)** on the new owner's GitHub account (or the Bot account) with `Contents: Read & Write` and `Pull Requests: Read & Write` permissions.
3.  Update the `GITHUB_TOKEN` secret in the Cloudflare Worker dashboard or via CLI.

## 5. Environment Variables & Secrets Reference

| Secret | Location | Purpose |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | Cloudflare Secrets | Allows the Bot to commit drafts and open PRs. |
| `GITHUB_REPO` | `wrangler.toml` | Defines which repository the CMS manages. |
| `pathPrefix` | `eleventy.config.js` | Ensures links route correctly in subdirectories. |
