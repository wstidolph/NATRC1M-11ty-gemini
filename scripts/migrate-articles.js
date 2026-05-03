const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const cheerio = require('cheerio');
const { Readable } = require('stream');

const BASE_URL = 'https://www.natrcregion1.org';
const ARTICLES = [
    '/Articles/ADayInTheLife.htm',
    '/Articles/Ride_Your_Own_Ride.htm',
    '/Articles/Judging_Explained.htm',
    '/Articles/taking_juniors_to_natrc_rides.htm',
    '/Articles/NATRC_101.htm',
    '/Articles/FAQ.htm',
    '/Articles/Differently-abledRider.htm',
    '/Articles/MtDiablo2012.htm',
    '/Articles/CowboyCampInaugural.htm',
    '/Articles/CMDTRA_story.htm',
    '/Articles/JudgesQandA.htm'
];

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'articles');
const IMAGES_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');

// Helper to download an image using fetch and async streams
async function downloadImage(url, dest) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const fileStream = fs.createWriteStream(dest);
        
        // Node 18+ fetch body can be piped using stream.Readable.fromWeb
        if (response.body.pipe) {
            // Some polyfills might have a pipe method
            response.body.pipe(fileStream);
        } else if (Readable.fromWeb) {
            // Native web streams
            const readable = Readable.fromWeb(response.body);
            readable.pipe(fileStream);
        } else {
            // Fallback for array buffers if streams aren't perfectly mapped
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fsPromises.writeFile(dest, buffer);
            return;
        }

        return new Promise((resolve, reject) => {
            fileStream.on('finish', () => resolve());
            fileStream.on('error', reject);
        });
    } catch (err) {
        // Clean up the file if download failed
        try {
            if (fs.existsSync(dest)) await fsPromises.unlink(dest);
        } catch (e) { /* ignore cleanup error */ }
        throw err;
    }
}

// Ensure the page's HTML can be safely enclosed inside Eleventy layout
function sanitizeHTML(html) {
    return html.replace(/<!--.*?-->/gs, '');
}

async function processArticle(articlePath) {
    const fullUrl = new URL(articlePath, BASE_URL).href;
    console.log(`Processing: ${fullUrl}`);

    try {
        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const html = await res.text();
        const $ = cheerio.load(html);

        // Find the main content
        const contentDiv = $('#articleContent');
        if (contentDiv.length === 0) {
            console.error(`  [WARN] No #articleContent found in ${articlePath}. Skipping...`);
            return;
        }

        // Process images
        const images = contentDiv.find('img');
        const imagePromises = [];

        for (let i = 0; i < images.length; i++) {
            const img = $(images[i]);
            let src = img.attr('src');

            if (src) {
                try {
                    // Reliably resolve any relative or absolute image path against the base URL
                    const absImgUrl = new URL(src, fullUrl).href;
                    const filename = path.basename(new URL(absImgUrl).pathname);
                    const localImgPath = path.join(IMAGES_DIR, filename);

                    console.log(`  Downloading image: ${filename}`);
                    
                    // Queue image download
                    imagePromises.push(
                        downloadImage(absImgUrl, localImgPath)
                        .catch(e => console.error(`  [ERROR] Failed to download image ${absImgUrl}:`, e.message))
                    );

                    // Rewrite src to use relative 11ty asset path
                    img.attr('src', `/assets/images/${filename}`);
                    
                    // Apply CSS classes instead of inline styles for responsive images
                    let classes = img.attr('class') || '';
                    img.attr('class', (classes + ' article-img').trim());
                    
                    // Also convert old align attributes to classes if needed
                    const align = img.attr('align');
                    if (align === 'left') {
                        img.removeAttr('align');
                        img.attr('class', (img.attr('class') + ' img-float-left').trim());
                    } else if (align === 'right') {
                        img.removeAttr('align');
                        img.attr('class', (img.attr('class') + ' img-float-right').trim());
                    }
                } catch (e) {
                    console.error(`  [ERROR] Image processing failed for ${src}:`, e.message);
                }
            }
        }

        // Wait for all images in this article to download
        await Promise.all(imagePromises);

        // Extract Title from h1, h2, or document title
        let title = contentDiv.find('h1').first().text().trim() ||
            contentDiv.find('h2').first().text().trim() ||
            $('title').text().trim() ||
            path.basename(articlePath, '.htm');

        // Optional: Remove duplicate title heading from body to prevent duplicate headers
        const firstH2 = contentDiv.find('h2').first();
        if (firstH2.length > 0 && title) {
            const h2Text = firstH2.text().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const fmText = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (h2Text && fmText && (h2Text.includes(fmText) || fmText.includes(h2Text) || (h2Text.length > 10 && h2Text.substring(0, 10) === fmText.substring(0, 10)))) {
                firstH2.remove();
            }
        }

        // Replace any inline styles that crept in with classes (e.g. caption center)
        contentDiv.find('figcaption[style*="text-align:center"]').removeAttr('style').addClass('figcaption-center');

        let extractedContent = sanitizeHTML(contentDiv.html());

        // Construct 11ty Markdown File
        const frontmatter = `---
layout: base.njk
title: "${title.replace(/"/g, '\\"')}"
---

<div class="card card-article">
${extractedContent}
</div>
`;

        const outFilename = path.basename(articlePath, '.htm') + '.md';
        const outPath = path.join(OUTPUT_DIR, outFilename);

        await fsPromises.writeFile(outPath, frontmatter, 'utf8');
        console.log(`  Saved: ${outPath}`);

    } catch (error) {
        console.error(`  [ERROR] Failed processing ${articlePath}:`, error.message);
    }
}

async function run() {
    console.log("Starting migration...");
    
    // Ensure output directories exist using fsPromises
    await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });
    await fsPromises.mkdir(IMAGES_DIR, { recursive: true });

    // Process articles with limited concurrency (e.g. 3 at a time)
    const concurrencyLimit = 3;
    const queue = [...ARTICLES];
    const workers = [];

    async function worker() {
        while (queue.length > 0) {
            const article = queue.shift();
            await processArticle(article);
        }
    }

    // Spin up workers
    for (let i = 0; i < concurrencyLimit; i++) {
        workers.push(worker());
    }

    await Promise.all(workers);
    console.log("Migration Complete!");
}

run();
