const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

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

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Helper to download an image
function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                fs.unlink(dest, () => {
                    reject(new Error(`Failed to download image: ${response.statusCode}`));
                });
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

// Ensure the page's HTML can be safely enclosed inside Eleventy layout
function sanitizeHTML(html) {
    // Basic cleanup; we'll rely on the markdown extension treating it as raw HTML
    return html.replace(/<!--.*?-->/gs, '');
}

async function processArticle(articlePath) {
    const fullUrl = `${BASE_URL}${articlePath}`;
    console.log(`Processing: ${fullUrl}`);

    try {
        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const html = await res.text();
        const $ = cheerio.load(html);

        // Find the main content
        const contentDiv = $('#articleContent');
        if (contentDiv.length === 0) {
            console.error(`  Warning: No #articleContent found in ${articlePath}. Skipping...`);
            return;
        }

        // Process images
        const images = contentDiv.find('img');
        for (let i = 0; i < images.length; i++) {
            const img = $(images[i]);
            let src = img.attr('src');

            if (src) {
                // Handle relative paths from the old site structure
                if (src.startsWith('../')) {
                    src = src.replace('../', '/');
                }
                if (!src.startsWith('/')) {
                    src = '/' + src; // assume it's relative to root
                }

                const absImgUrl = `${BASE_URL}${src}`;
                const filename = path.basename(src);
                const localImgPath = path.join(IMAGES_DIR, filename);

                // Download the image
                try {
                    console.log(`  Downloading image: ${filename}`);
                    await downloadImage(absImgUrl, localImgPath);
                    // Rewrite src to use relative 11ty asset path
                    img.attr('src', `/assets/images/${filename}`);
                    // Ensure the image fits within the new responsive design
                    img.css('max-width', '100%');
                    img.css('height', 'auto');
                } catch (e) {
                    console.error(`  Failed to download image ${absImgUrl}:`, e.message);
                }
            }
        }

        // Extract Title from h1, h2, or document title
        let title = contentDiv.find('h1').first().text().trim() ||
            contentDiv.find('h2').first().text().trim() ||
            $('title').text().trim() ||
            path.basename(articlePath, '.htm');

        // Remove the old inline headings if they exist to prevent duplication if we put it in frontmatter
        // (Optional: for now we'll keep the DOM intact inside the div except we'll wrap it in standard frontmatter)

        let extractedContent = sanitizeHTML(contentDiv.html());

        // Construct 11ty Markdown File
        const frontmatter = `---
layout: base.njk
title: "${title.replace(/"/g, '\\"')}"
---

<div class="card" style="margin-top: 20px;">
${extractedContent}
</div>
`;

        const outFilename = path.basename(articlePath, '.htm') + '.md';
        const outPath = path.join(OUTPUT_DIR, outFilename);

        fs.writeFileSync(outPath, frontmatter, 'utf8');
        console.log(`  Saved: ${outPath}`);

    } catch (error) {
        console.error(`  Error processing ${articlePath}:`, error.message);
    }
}

async function run() {
    for (const article of ARTICLES) {
        await processArticle(article);
    }
    console.log("Migration Complete!");
}

run();
