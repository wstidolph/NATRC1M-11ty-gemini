# NATRC Region 1 Migration - Project Walkthrough

## 1. Executive Summary

We have successfully rebuilt and modernized the NATRC Region 1 website, migrating it from its legacy static hosting at `https://natrcregion1.org/default.htm` to a modern, fast, and easily maintainable architecture. 

**Key Accomplishments:**
*   **Complete Content Migration:** All legacy textual content, links, and schedules have been successfully moved over to the new system.
*   **Modern Design:** The site now features a premium, responsive, mobile-first design leveraging a vibrant color palette, beautiful typography, and clean cards that automatically adapt to any screen size (desktop, tablet, or phone).
*   **New "Remembrances" Page:** We introduced an interactive, beautifully formatted memorial page dedicated to the legendary figures of Region 1 history.
*   **User-Contributed Stories (CMS):** We built a brand-new, in-browser writing experience! Users can now navigate to the "Write a Story" page, use a rich-text editor to write articles, upload photos (which can be customized by percentage width), and seamlessly save their drafts or request publication without ever needing to touch code or complex Markdown formatting.

---

## 2. Technical Architecture 

### The Role of Eleventy (11ty)
The heart of the new site is [Eleventy (11ty)](https://www.11ty.dev/), a blazing-fast Static Site Generator (SSG). 
*   **Why Eleventy?** Traditional CMS websites use complex active databases (like WordPress) which are slow, expensive to host, and vulnerable to security exploits. Eleventy takes simple, highly readable text files (Markdown) and automatically compiles them into lightning-fast, secure, raw HTML pages during the build process.
*   **How it works:** When a volunteer writes a new story or updates a schedule in Markdown, Eleventy pairs that content with our Nunjucks (`.njk`) layouts to cleanly stamp out the final web page. 

### Core Technologies
*   **Templating:** Nunjucks (`.njk`) is used for the site wrapper, navigation, and reusable layouts.
*   **Styling:** Pure, modern CSS (`style.css`) utilizing modern CSS variables. No heavy frameworks (like Bootstrap or Tailwind) were required, ensuring maximum speed and customizability.
*   **Content Editor (Anonymous CMS):** A comprehensive browser-based integration using Quill.js. It interfaces with an external Cloudflare Worker proxy (`cloudflare-worker/src/index.js`), completely circumventing the need for users to authenticate with GitHub.

### Directory Structure

```text
NATRC1M-11ty-gemini/
├── eleventy.config.js       # Core configuration for 11ty (plugins, filters)
├── package.json             # Project dependencies and build scripts
├── .github/workflows/       # Automated deployment scripts for GitHub Actions CI/CD
├── src/
│   ├── _data/               # Dynamic site data (e.g., navigation menu json)
│   ├── _includes/           # Nunjucks layout wrappers (base.njk)
│   ├── admin/               
│   │   └── add-article.njk  # The custom CMS editor application
│   ├── articles/            # Markdown files for stories and the Remembrances page
│   ├── assets/              
│   │   ├── css/style.css    # Unified global site styling
│   │   ├── images/          # Uploaded site images and user photos
│   │   └── js/cms.js        # The javascript engine behind the custom story editor
│   ├── news/                # Individual Markdown files for announcements
│   ├── index.njk            # The dynamic Homepage
│   └── [sections]/          # Folders for /contact, /gallery, /ride-schedule, etc.
├── cloudflare-worker/       # The serverless proxy application
│   ├── src/index.js         # API gateway handling GitHub authentication internally
│   └── wrangler.toml        # Cloudflare configuration file
└── _site/                   # The final compiled HTML (ignored by Git, published to the server)
```

---

## 3. Deployment Guide

Because this is a compiled static site consisting entirely of raw HTML, CSS, and JS, it can be hosted globally for free.

### Deploying to a New GitHub Account (GitHub Pages)
1.  Fork or clone this repository to the new GitHub account.
2.  In the new repository on GitHub, go to **Settings > Pages**.
3.  Under "Build and deployment", change the "Source" to **GitHub Actions**.
4.  The pre-existing `.github/workflows/deploy.yml` file will automatically detect future changes to the `main` branch, build the site using Eleventy, and publish it to the new `username.github.io/repo-name` URL. 
   *(Note: Remember to update the `pathPrefix` in `eleventy.config.js` if the repository name changes).*

### Deploying to Vercel or Netlify (Alternative Modern Hosting)
Platforms like Vercel or Netlify offer exceptional speed globally and automatic free SSL certificates for custom domains.
1.  Create an account on Vercel or Netlify and click "Add New Project".
2.  Connect your GitHub repository to the platform.
3.  The platform will automatically detect that you are using Eleventy. Verify the default settings:
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `_site`
4.  Click Deploy. Every push or merge to the `main` branch will automatically instantly update the live site.
   *(Note: If deploying to the root of a custom domain, remove the `pathPrefix` string in `eleventy.config.js` so links route cleanly to `/` instead of `/repo-name/`).*

---

## 4. Anonymous Submissions Integration

We successfully decoupled GitHub authentication from the frontend, drastically lowering the barrier to entry for community members submitting content. The "Write a Story" engine now functions entirely anonymously without requiring the visitor to login or hold a GitHub Personal Access Token.

**How it was implemented:**
1.  We deployed a lightweight serverless proxy to **Cloudflare Workers**. 
2.  The Cloudflare Worker securely holds a master GitHub Token within a locked, encrypted environment variable.
3.  When a user clicks "Submit Draft" or "Request Publish" on the web editor, `cms.js` bypasses GitHub entirely and transmits the article text and base64 images to our cloud proxy.
4.  The Worker acts as a secure middleman. It injects its hidden token, safely interfaces with the GitHub API, and creates pull requests and commits on the user's behalf using an automated "Bot Account".
5.  **Result:** Site administrators receive instantaneous email alerts when new user submissions arrive, and users experience a seamless, login-free writing experience.

*For a comprehensive technical breakdown and data-flow map, please refer to the [CMS Architecture Documentation](CMS_ARCHITECTURE.md).*
