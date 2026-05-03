# Content Files Quality Improvement Plan

Based on a review of the migrated content files in `src/` (mostly in `src/articles/` and `src/links/`), here is a list of quality issues found and a plan for how we can efficiently fix them.

## 1. Inline Styles
Many files contain inline CSS styles that were carried over from the old website or added during the migration script. These should be moved to a stylesheet (e.g., your main CSS file) to keep the HTML clean and make it easier to theme the site globally.

**Examples found:**
*   `style="margin-bottom: 20px;"` on `<div class="card">` elements.
*   `style="max-width: 100%; height: auto;"` on `<img ...>` elements.
*   `style="text-align:center"` on `<figcaption>` elements.
*   `style="text-style:italic"` on `<p>` elements (Note: `text-style` is invalid CSS, it should be `font-style: italic`).
*   `style="padding-top:30px"` on `<h2>` elements.
*   `style="color: var(--color-primary-dark); ..."` on `<h2>` elements.

**How to fix efficiently:**
1. Define equivalent utility or component classes in your main CSS file:
    ```css
    .card { margin-bottom: 20px; }
    .card-secondary { background-color: var(--color-secondary); }
    .responsive-img { max-width: 100%; height: auto; }
    .text-center { text-align: center; }
    .text-italic { font-style: italic; }
    .title-primary { color: var(--color-primary-dark); margin-bottom: 15px; }
    ```
2. We can run a series of search-and-replace operations (using `sed` or a Node script) across all `.md` files to replace these inline `style="..."` attributes with the appropriate `class="..."`.

## 2. Broken or Outdated Local Links
Some markdown files still contain relative links pointing to the old `.htm` file structure.

**Examples found:**
*   In `src/articles/FAQ.md`: `<a href="../Articles/taking_juniors_to_natrc_rides.htm">`
*   In `src/articles/NATRC_101.md`: Links pointing to old gallery systems like `http://www.stidolph.biz/NATRC/region_1_gallery/main.php?g2_itemId=621`

**How to fix efficiently:**
1. Use a regex search-and-replace to update `.htm` links to Eleventy-style URL paths: 
   * Find: `href="../Articles/(.*?)\.htm"`
   * Replace: `href="/articles/$1/"` (or according to how your Eleventy permalinks are configured).
2. Manually review and update the `.biz` gallery links, or decide if those galleries will be migrated.

## 3. Duplicated Headers
The migration script extracted the `title` into the frontmatter, but it looks like the original `<h2>` or `<h3>` tags containing the title were also left inside the body content. If your `base.njk` layout automatically renders an `<h1>` for the page title, you will end up with duplicated titles on the page.

**Examples found:**
*   `src/articles/CMDTRA_story.md`: Frontmatter `title` is "The First Concord Mt. Diablo...", and line 7 has `<h2 style="color: var(--color-primary-dark); margin-bottom: 15px;">The First CMDTRA Ride - 1941</h2>`.
*   `src/articles/CowboyCampInaugural.md`: Contains `<h2 style="padding-top:30px">Sunny Cowgirls Up at Cowboy Camp</h2>`.

**How to fix efficiently:**
1. We can write a script using Cheerio (similar to the migration script) to read each generated `.md` file, look for the first `<h2...>` inside the `<div class="card">`, and if its text closely matches the frontmatter `title` (or simply as a blanket rule for the first heading), remove it.

## 4. Deprecated HTML Attributes
Some tags use old HTML attributes for layout rather than CSS.

**Examples found:**
*   `<img align="left" ...>` and `<img align="right" ...>` in `src/articles/Differently-abledRider.md`.

**How to fix efficiently:**
1. Replace `align="left"` and `align="right"` with CSS classes (e.g., `class="float-left"` and `class="float-right"`), and define those utility classes in your stylesheet.

---

**Next Steps:**
If you agree with this plan, let me know. The most efficient way to proceed is for me to create a quick Node script (e.g., `scripts/cleanup-content.js`) that automatically applies all these structural fixes (removing inline styles, fixing `.htm` links, and removing duplicate headers) across all the `src/articles/*.md` files at once.
