# Site Administrator: Maintenance & Operations Guide

This guide provides the necessary instructions and templates for the routine maintenance of the NATRC Region 1 website.

## 1. Managing Articles & Stories

Most articles are submitted via the online "Write a Story" tool, but sometimes the administrator needs to add or remove articles manually.

### Adding a Manual Article
1. Create a new `.md` (Markdown) file in the `src/articles/` directory.
2. Use the template below for the file content.
3. Save the file and push the changes to the `main` branch on GitHub.

#### Article Markdown Template
Use this template as a starting point. Copy and paste this into your text editor:

```markdown
---
layout: base.njk
title: "Your Article Title Here"
author: "Name of the Author"
date: 2026-03-16
tags: ["articles", "contributions"]
---

<div class="card" style="margin-top: 20px;">

## Your Article Title

Your article content goes here. You can use standard Markdown for bold, italics, and lists.

If you need to include an image that is already in `/assets/images/`, use this syntax:
<figure>
  <p class="centeredImage">
    <img src="{{ '/assets/images/your-image-filename.jpg' | url }}" alt="Description of image" style="max-width: 100%; height: auto;">
  </p>
  <figcaption style="text-align:center">Text appearing below the image</figcaption>
</figure>

</div>
```

### Removing an Article
Simply delete the corresponding `.md` file from the `src/articles/` directory and push the changes.

---

## 2. Managing Leadline Archives

Leadline PDF updates are partially automated to ensure they are correctly indexed for search.

1. **Upload Process**: Use the [Add Leadline Guide](leadlines_guide.md) to run the `node scripts/admin_add_leadline.js` script.
2. **Automated Steps**: This script uploads the PDF to `src/assets/leadlines/` and creates a Pull Request.
3. **Manual Review**: Approve the Pull Request on GitHub to go live.

---

## 3. Managing Other PDF Archives (Trail News, Hoof Beats, etc.)

Currently, updates to non-Leadline archives require a manual two-step process.

### Step 1: Upload the PDF
- **Trail News**: Put new PDFs in `src/assets/articles/Trail_News/`.
- **Hoof Beats North**: Put new PDFs in `src/assets/articles/`.
- **General Documents**: Put files like the Bylaws in `src/assets/articles/`.

### Step 2: Update the Stories & Articles UI
You must manually link the new file in `src/stories-articles/index.md`.

1. Open `src/stories-articles/index.md`.
2. Locate the appropriate card (e.g., `<h3>Trail News Archives</h3>`).
3. Add a new `<li>` entry pointing to your file:
    ```html
    <li style="margin-bottom: 8px;">
      <a href="{{ '/assets/articles/Trail_News/Your_New_File.pdf' | url }}" target="_blank">Title of Issue (PDF)</a>
    </li>
    ```

---

## 4. Deploying Changes

The website automatically redeploys whenever you push changes or merge a Pull Request into the `main` branch.

- **Build Time**: Usually takes 1-2 minutes.
- **Verification**: After deployment, check the live site to ensure your links and content appear as expected.
- **Search Re-indexing**: The site's deep-search engine is automatically updated during every build to include any new PDFs or articles you've added.
