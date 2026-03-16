# NATRC Region 1 Migration - Project Walkthrough

## 1. Executive Summary

We have successfully rebuilt and modernized the NATRC Region 1 website, migrating it from its legacy static hosting to a modern, fast, and easily maintainable architecture. 

**Key Accomplishments:**
*   **Complete Content Migration:** All legacy textual content, links, and schedules have been successfully moved over to the new system.
*   **Modern Design:** The site features a responsive, mobile-first design leveraging a vibrant color palette, beautiful typography, and clean cards that automatically adapt to any screen size.
*   **Unified Search Engine**: Implemented deep-search functionality for both the **Leadline Archives** (searching decades of PDFs) and **Member Contributions**, allowing users to find content by topic, author, or keyword.
*   **Anonymous Community CMS**: A custom, in-browser writing experience using a secure Cloudflare Worker proxy. Members can submit stories and upload photos without needing GitHub accounts or technical knowledge.
*   **Centralized Documentation**: All technical specs, guides, and architectural maps are now organized within a dedicated `docs/` directory for long-term maintainability.

---

## 2. Technical Architecture 

### The Role of Eleventy (11ty)
The heart of the new site is [Eleventy (11ty)](https://www.11ty.dev/), a blazing-fast Static Site Generator (SSG). 
*   **Static Rendering**: Unlike WordPress, Eleventy generates raw HTML files during the build process. This makes the site incredibly fast, highly secure, and cheap to host.
*   **Templating**: We use **Nunjucks (`.njk`)** for layouts and **Markdown (`.md`)** for content. This separates the design from the data, making it easy to update text without touching code.

### Scripts & Automation
The build process is enhanced by custom Node.js scripts located in the `scripts/` directory:
*   **`build_search_index.js`**: Scans the Leadline PDF archives and generates a massive full-text JSON index.
*   **`build_contributions_index.js`**: Extracts content from all ride stories and articles to provide real-time search on the "Stories & Articles" page.

### Core Technologies
*   **Styling**: Pure, modern CSS (`src/assets/css/style.css`) using CSS variables.
*   **CMS Engine**: A browser-based editor using `Quill.js`. It communicates with a **Cloudflare Worker** proxy to handle GitHub commits anonymously.
*   **Search Frontend**: A custom vanilla JavaScript engine that performs real-time filtering and term highlighting against pre-generated JSON indices.

---

## 3. Directory Structure

> [!NOTE]
> Understanding the technical difference between content files (Markdown) and static assets (PDFs) is crucial for correct site updates. See the [Content vs. Assets Guide](content_vs_assets.md) for a detailed comparison.

```text
NATRC1M-11ty-gemini/
├── docs/                    # Centralized technical and administrative documentation
│   ├── CMS_ARCHITECTURE.md  # Detailed data-flow map for the story editor
│   ├── PRD.md               # Product Requirements and Project Scope
│   ├── walkthrough.md       # This document
│   ├── leadlines_guide.md   # Admin guide for updating PDF archives
│   └── member_contributions_search_walkthrough.md
├── scripts/                 # Automation tools for search indexing and data processing
├── cloudflare-worker/       # Serverless proxy for anonymous GitHub submissions
├── eleventy.config.js       # Core 11ty configuration and path prefixing
├── src/                     # The content and design source
│   ├── _data/               # Dynamic data like site-wide navigation
│   ├── _includes/           # Layout templates (base.njk)
│   ├── admin/               # CMS editor interface: /admin/add-article/
│   ├── articles/            # Member stories, informational articles, and memorial content
│   ├── assets/              
│   │   ├── css/style.css    # Unified site styling
│   │   ├── images/          # Site graphics and user-uploaded photos
│   │   └── js/              # Search engine scripts and generated JSON indices
│   ├── leadlines/           # Static hosting for the Leadline newsletter PDF collection
│   ├── stories-articles/    # The index and search page for community content
│   └── [sections]/          # /contact, /ride-schedule, /judges-corner, etc.
└── _site/                   # The compiled website (generated during build)
```

---

## 4. Maintenance & Operations

For detailed information on how the site is deployed, hosted, and how to migrate ownership, please refer to the [Deployment & Infrastructure Guide](deployment.md).

### Ongoing Maintenance
*   **Adding Articles**: New stories are added via the `/admin/add-article/` page or by placing a Markdown file in `src/articles/` with the `contributions` tag.
*   **PDF Archives**: 
    *   **Leadlines**: New issues go in `src/assets/leadlines/`. Run `npm run build` to re-index.
    *   **Trail News**: New issues go in `src/assets/articles/Trail_News/`.
    *   **Hoof Beats North**: New issues go in `src/assets/articles/`.

For more details on specific components, please refer to the following:
*   [CMS Architecture](CMS_ARCHITECTURE.md)
*   [Leadline Update Guide](leadlines_guide.md)
*   [Member Contributions Search Guide](member_contributions_search_walkthrough.md)
*   [Deployment & Infrastructure](deployment.md)
