# Quality Upgrade - 2026-05-03

## Overview
This upgrade focused on improving the code quality of the migration scripts and standardizing the HTML structure and CSS usage of the migrated content files.

## 1. Code Quality Improvements
**File Updated:** `scripts/migrate-articles.js`

*   **Standardized URL Parsing:** Replaced manual string manipulation with the native `URL` API (`new URL()`) to accurately resolve relative image paths against the base URL.
*   **Unified HTTP Requests:** Replaced `https.get` callbacks with `fetch` and native Node Streams for cleaner, robust image downloading.
*   **Asynchronous File I/O:** Converted synchronous file operations (`fs.writeFileSync`, `fs.mkdirSync`) to non-blocking asynchronous operations (`fs.promises`).
*   **CSS Classes over Inline Styles:** Refactored the script to inject responsive CSS classes (like `article-img`) instead of embedding inline styles during image extraction.
*   **Controlled Concurrency:** Implemented a queue system to process up to 3 articles simultaneously, speeding up the migration.
*   **Error Handling:** Enhanced error logging and added automated file cleanup for failed image downloads.

## 2. Content Quality Improvements
**File Created:** `scripts/cleanup-content.js`
**Files Modified:** `src/**/*.md`

A new cleanup script was introduced and run across all `.md` and `.njk` files in the `src/` directory to resolve lingering structural and styling issues:
*   **Removed Inline Styles:** Stripped out legacy inline styles (e.g., `margin-bottom: 20px`, `text-align: center`) and replaced them with pre-existing utility classes from `style.css` (e.g., `.margin-bottom-20`, `.text-center`).
*   **Fixed Broken Links:** Parsed and updated local relative links pointing to old `.htm` files (e.g., `../Articles/taking_juniors_to_natrc_rides.htm`) to map to Eleventy's relative paths.
*   **Removed Duplicate Headers:** Intelligently removed redundant `<h2>` and `<h3>` tags in the page bodies when they duplicated the page's main frontmatter `title`.
*   **Modernized Layout Attributes:** Swapped deprecated HTML attributes like `align="left"` on images with modern CSS float classes (`.img-float-left`).
