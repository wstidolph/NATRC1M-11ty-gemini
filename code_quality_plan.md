# Code Quality Improvement Plan: `scripts/migrate-articles.js`

Based on the review of the `scripts/migrate-articles.js` file, here is a structured plan to improve its code quality, maintainability, and performance.

## Step 1: Standardize URL Parsing
**Current Issue:** The script manually manipulates image paths (e.g., `src.replace('../', '/')` and `if (!src.startsWith('/'))`) to resolve relative URLs. This is error-prone and brittle when encountering unexpected path structures.
**Action:** Replace manual string manipulation with the native `URL` object.
*   Use `new URL(src, BASE_URL).href` to reliably resolve any relative or absolute image path against the base URL.

## Step 2: Unify HTTP Request Mechanisms
**Current Issue:** The script mixes two different HTTP libraries: `fetch` for downloading HTML content, and the native `https.get` callback-based API for downloading images.
**Action:** Use `fetch` for both operations to maintain consistency and keep the code entirely Promise-based.
*   Refactor the `downloadImage` function to use `await fetch(url)`.
*   Stream the response body to the file system using native Node stream utilities (e.g., `Readable.fromWeb(res.body).pipe(...)`) or buffer the response and use file system methods.

## Step 3: Upgrade to Asynchronous File Operations
**Current Issue:** The script uses synchronous file operations (`fs.writeFileSync`, `fs.existsSync`, `fs.mkdirSync`) inside an otherwise asynchronous flow. While acceptable for simple CLI scripts, it blocks the Node.js event loop.
**Action:** Transition to `fs.promises` for non-blocking I/O.
*   Replace `fs.writeFileSync` with `await fs.promises.writeFile`.
*   Replace `fs.mkdirSync` with `await fs.promises.mkdir` (using `recursive: true`).

## Step 4: Remove Inline CSS Styling
**Current Issue:** The script injects inline styles using Cheerio (`img.css('max-width', '100%')`). Inline styles override external CSS, making the final HTML harder to style globally via the website's main stylesheets or tailwind/custom classes.
**Action:** Use CSS classes instead of inline styles.
*   Replace the `.css()` calls with `.addClass('responsive-img')` or simply rely on the parent wrapper's CSS (e.g., setting `.card img { max-width: 100%; height: auto; }` in your global CSS).

## Step 5: Enhance Concurrency (Optional but Recommended)
**Current Issue:** The script processes articles sequentially using a standard `for...of` loop. If the `ARTICLES` array grows large, the script will take a long time to finish.
**Action:** Introduce controlled concurrency.
*   Map the `ARTICLES` array to an array of promises and use `Promise.all()` to process them in parallel.
*   If rate-limiting is a concern, use batching or a concurrency-limiter (like the `p-limit` library) to restrict parallel requests (e.g., 5 at a time).

## Step 6: Improve Error Handling Context
**Current Issue:** Catch blocks log standard error messages, but if an image download fails abruptly, it might leave an incomplete empty file or simply skip it without breaking the pipeline.
**Action:** 
*   Ensure temporary/failed image files are properly unlinked/deleted in all exception cases.
*   Add more descriptive logs indicating exactly which article failed and on what specific asset.
