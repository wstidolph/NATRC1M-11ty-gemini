---
title: "Content vs. Assets"
---
# Content vs. Assets: Understanding the Directory Structure

This document explains the technical difference between the two main directories used for articles and documents in this project.

## Summary Comparison

| Feature | `src/articles/*.md` | `src/assets/articles/*.pdf` |
| :--- | :--- | :--- |
| **File Type** | Markdown (`.md`) | Binary (`.pdf`, `.jpg`, etc.) |
| **Eleventy Action** | **Transformed**: Compiled into HTML | **Passthrough**: Copied exactly as-is |
| **Result** | A navigable "Web Page" | A downloadable "Document" |
| **Search Engine** | Content is fully indexed for search | File is "blind" to text search |
| **Management** | Editable via the browser CMS tool | Managed via manual file upload |

---

## 1. The "Source" Folder: `src/articles/`
The files in this directory are the **source code** for the website's content.

*   **Dynamic Rendering**: Eleventy reads these files and "injects" them into the site's layout templates (like `base.njk`).
*   **Searchability**: Because these are text-based Markdown files, our build scripts can open them and read their contents to create the search index used on the "Stories & Articles" page.
*   **CMS Integration**: The "Write a Story" tool is specifically configured to create and edit files in this directory.

## 2. The "Static" Folder: `src/assets/articles/`
The files here are **static assets** that the website links to but does not "manage."

*   **Passthrough Copy**: Eleventy is configured to "passthrough" the `assets` folder. This means it simply copies the files into the final `_site` output without trying to read or change them.
*   **Binary Content**: This is the correct home for PDFs, Word docs, or high-resolution images that are intended for download rather than for reading as a web page.
*   **Why the separation?**: If PDFs were placed in the source `articles` folder, Eleventy would attempt to process them as content files, which would lead to build errors.

---
*For more information on the overall project structure, see the [Project Walkthrough](../walkthrough/).*
