# Product Requirements Document (PRD): NATRC Region 1 Website Migration

## 1. Project Overview

The objective is to migrate the existing NATRC Region 1 website (https://www.natrcregion1.org) to a modern, fully mobile-friendly architecture while preserving 100% of the existing content. The new site will utilize Eleventy (11ty), a popular Static Site Generator, to simplify long-term maintenance and content updates. Additionally, a new dedicated "News" or "Blog" section will be integrated to handle recent updates, announcements, and notes that currently clutter the homepage.

## 2. Goals & Objectives

1. **Mobile-First Design:** Ensure the website is fully responsive and accessible on all devices (mobile, tablet, desktop).
2. **Content Preservation & Migration:** Migrate all existing content seamlessly, including the ride schedule, articles, judge's corner, galleries, and contact information, ensuring no data loss.
3. **Simplified Maintenance:** Transition the legacy site to an Eleventy static architecture. By separating content (Markdown) from presentation (Nunjucks/Liquid templates), future updates can be made by non-technical volunteers easily.
4. **New Functionality (News/Blog):** Introduce a dedicated "News" section to organize timely updates (e.g., conventions, scholarships, newsletters) efficiently in a reverse-chronological view.

## 3. Current State vs. Proposed State

| Feature                | Current State                       | Proposed State                                 |
| :--------------------- | :---------------------------------- | :--------------------------------------------- |
| **Architecture**       | Legacy static HTML pages            | Modern Static Site Generator (Eleventy)        |
| **Responsiveness**     | Not mobile-friendly                 | Fully responsive CSS (Mobile, Tablet, Desktop) |
| **Content Management** | Hardcoded HTML content              | Markdown files with Frontmatter                |
| **News Updates**       | Appended manually to the Homepage   | Dedicated, paginated Blog/News section         |
| **Templating**         | Duplicated headers/footers per page | Centralized Layouts & Partials (`_includes`)   |

## 4. Scope of Work

### 4.1 Content Migration

The following existing sections will be mapped and migrated from HTML to Markdown/11ty templates:

- **Home:** Cleaned up, with timely news moved to the new blog section.
- **Ride Schedule:** Migrated over, maintaining formatting or utilizing structured data (YAML/JSON) for easier yearly updates.
- **Stories & Articles:** Ported as individual Markdown pages or a collection.
- **Judge's Corner:** Ported as individual pages or a collection.
- **Gallery:** Image assets will be optimized and carried over into a responsive gallery grid.
- **Links:** Ported as a Markdown list.
- **Contacts:** Ported as a simple Markdown page.

### 4.2 New Feature: News / Blog Section

- **Implementation:** Create an 11ty Collection for "news" (`/news/`).
- **Content:** Support for Markdown posts with frontmatter (title, date, author, tags).
- **Migration:** Move current homepage news (e.g., "2026 Region 1 Convention", "Catherine de la Cruz Scholarship", "Leadline updates") into their own individual news posts.
- **Index Page:** A centralized reverse-chronological list of the most recent notes and announcements.

### 4.3 Technical Implementation

- **Static Site Generator:** Eleventy (11ty) v3.x.
- **Templating Language:** Nunjucks or Liquid.
- **Styling:** A lightweight, custom responsive CSS framework (or clean utility classes like Tailwind CSS, if preferred) to avoid bloated page loads.
- **Content Format:** Markdown (`.md`) for all pages and posts.
- **Deployment & Hosting:** The site is hosted on GitHub Pages and automatically deployed via GitHub Actions. See the [Deployment & Infrastructure Guide](deployment.md) for technical details and migration instructions.

## 5. Proposed Sitemap & Information Architecture

- `/` - Home
- `/news/` - News & Announcements **[NEW]**
    - `/news/[post-slug]/` - Individual News/Blog Posts
- `/ride-schedule/` - Ride Schedule
- `/stories-articles/` - Stories & Articles
- `/judges-corner/` - Judge's Corner
- `/gallery/` - Photo Gallery
- `/links/` - Information Links
- `/contact/` - Contacts

## 6. Design Requirements

- **Responsiveness:** Fluid grid layouts and CSS media queries to ensure 100% compatibility across varying screen sizes. Target a mobile-first design philosophy.
- **Performance:** Optimize image assets (especially in the Gallery) to ensure fast page loads. Aim for a Lighthouse score > 90 across all metrics.
- **Accessibility (a11y):** High contrast text, semantic HTML5 tags (`<nav>`, `<main>`, `<article>`, `<section>`), ARIA labels for navigation, and `alt` tags for all gallery images.

## 7. Future Considerations (Out of Scope for Phase 1)

- **Online Memberships/Payments**: Current membership forms are linked to the National site. Future iterations could bring custom form integrations if needed.
- **Enhanced Gallery**: Moving beyond static images to include video or community-contributed albums.

---

**Note**: The **"Anonymous CMS Integration"** originally listed as Out of Scope has been successfully implemented as a core feature using a custom Cloudflare Worker proxy and Quill.js editor.
