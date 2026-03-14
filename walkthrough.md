# NATRC Region 1 Migration - Walkthrough

## 1. Overview

The old static NATRC Region 1 website has been successfully modernized using Eleventy (11ty). The site is now entirely generated from Markdown and Nunjucks templates, making maintenance significantly simpler for volunteers. The site is styled using a modern, custom CSS framework that prioritizes responsiveness and aesthetics, without relying on heavy frameworks.

## 2. Work Completed

### 2.1 Technical Architecture

- **Static Site Generator:** Implemented `eleventy` to manage the build pipeline.
- **Templating:** Switched to Nunjucks (`.njk`) for layout wrappers and partials.
- **Styling:** Generated a beautiful, responsive, and mobile-first CSS architecture inside `src/assets/css/style.css` which leverages CSS variables, a vibrant color theme, card-based layouts, and smooth micro-animations.
- **Dynamic Navigation:** Implemented a data-driven navigation system using `src/_data/navigation.json`. This allows for easy menu updates and automatic "active page" highlighting using the `aria-current="page"` attribute.
- **Build Output:** Running `npm run build` cleanly outputs the compiled site to `_site/`.

### 2.2 Content Migration

- **Home Page:** Transformed `index.njk` to use dynamic calls and removed cluttered legacy hardcoding.
- **Full Section Migration:** Thoroughly migrated all legacy textual and link content into markdown files for the core navigation paths (`/ride-schedule/`, `/gallery/`, `/stories-articles/`, `/judges-corner/`, `/contact/`, `/links/`).
- **Remembrances Page:** Implemented a dedicated and interactive Remembrances page (`/articles/Remembrances/`) featuring a mobile-responsive "card" design with expandable details for various legendary figures in Region 1 history.

### 2.3 New Feature: News Section

- **Collection Setup:** Introduced an Eleventy Collection for News.
- **Content:** Extracted legacy news announcements (The Leadline, 2026 Convention, Scholarship, Membership) into their own distinct Markdown files within the `/src/news/` directory.
- **Dynamic Homepage:** The Home Page now dynamically fetches and previews the 3 most recently published News files.

## 3. Directory Structure

```text
NATRC1M-11ty-gemini/
├── package.json
├── eleventy.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD for Pages
├── scripts/
│   └── migrate-articles.js   # Script for migrating legacy content
├── src/
│   ├── _data/
│   │   └── navigation.json   # Global site navigation items
│   ├── _includes/
│   │   └── base.njk          # Master HTML wrapper with dynamic nav
│   ├── articles/
│   │   ├── Remembrances.md   # Detailed memorials
│   │   └── [...].md          # Other migrated articles and stories
│   ├── assets/
│   │   ├── css/style.css     # Premium responsive styles
│   │   └── images/           # Site images
│   ├── news/
│   │   ├── index.njk         # Automated News Feed
│   │   ├── news.json         # News section metadata
│   │   └── [...].md          # Individual news posts
│   ├── contact/index.md      # Contact information
│   ├── gallery/index.md      # Photo galleries
│   ├── judges-corner/index.md # Judges resources
│   ├── links/index.md        # External resources
│   ├── ride-schedule/index.md # Annual ride schedule
│   ├── stories-articles/index.md # Migrated stories index
│   └── index.njk             # Dynamic Homepage
└── _site/                    # Compiled Output
```

## 4. How to Develop & Deploy

### Local Development

To work on the site locally and see changes live:

```bash
npm start
```

### Building for Production

To build the site for production deployment:

```bash
npm run build
```

The output will be generated inside the `_site/` directory.

### Continuous Deployment (GitHub Pages)

The project is configured with a GitHub Actions workflow that automatically builds and deploys the site to GitHub Pages whenever changes are pushed to the `main` branch.

- **Workflow file:** `.github/workflows/deploy.yml`
- **Permissions:** Requires `pages: write` and `id-token: write` permissions.
- **Environment:** Deploys to the `github-pages` environment.

## 5. Verification

- The Eleventy build was executed via `npm run build` and succeeded with zero errors.
- 24 individual HTML files were flawlessly rendered from Nunjucks and Markdown processing.
- The `dateFilter` custom logic was verified, successfully replacing un-renderable javascript expressions in Markdown files.
- Dynamic navigation was confirmed working, with correct "active" state classes applied to links.
