const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const SRC_DIR = path.join(__dirname, '..', 'src');

function findMdFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findMdFiles(filePath, fileList);
        } else if (filePath.endsWith('.md') || filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Split frontmatter and body
    const parts = content.split('---');
    if (parts.length >= 3) {
        const frontmatter = parts[1];
        let body = parts.slice(2).join('---');

        // Extract title from frontmatter
        const titleMatch = frontmatter.match(/title:\s*"(.*?)"/);
        const frontmatterTitle = titleMatch ? titleMatch[1] : null;

        // Use cheerio on the body (which is HTML since the migration script extracted it as HTML)
        const $ = cheerio.load(body, null, false);
        let domModified = false;

        // 1. Fix `.htm` links
        $('a[href]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.endsWith('.htm')) {
                let newHref = href.replace(/\.htm$/, '/');
                if (newHref.startsWith('../Articles/')) {
                    newHref = newHref.replace('../Articles/', '/articles/');
                }
                $(el).attr('href', newHref);
                domModified = true;
            }
        });

        // 2. Remove Duplicate Headers
        if (frontmatterTitle) {
            const firstH2 = $('h2').first();
            if (firstH2.length > 0) {
                const h2Text = firstH2.text().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                const fmText = frontmatterTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                
                // If they are reasonably similar
                if (h2Text && fmText && (h2Text.includes(fmText) || fmText.includes(h2Text) || (h2Text.length > 10 && h2Text.substring(0, 10) === fmText.substring(0, 10)))) {
                    firstH2.remove();
                    domModified = true;
                }
            }
        }

        // 3. Replace inline styles with classes
        $('*[style]').each((i, el) => {
            const style = $(el).attr('style');
            let classes = $(el).attr('class') || '';
            let newStyle = style;

            const styleMap = [
                { match: /margin-top:\s*20px;?/i, replace: 'margin-top-20' },
                { match: /margin-bottom:\s*20px;?/i, replace: 'margin-bottom-20' },
                { match: /background-color:\s*var\(--color-secondary\);?/i, replace: 'card-secondary' },
                { match: /max-width:\s*100%;\s*height:\s*auto;?/i, replace: 'article-img' },
                { match: /text-align:\s*center;?/i, replace: 'text-center' },
                { match: /text-style:\s*italic;?/i, replace: 'text-italic' },
                { match: /text-style=italic;?/i, replace: 'text-italic' },
                { match: /padding-top:\s*30px;?/i, replace: 'padding-top-30' },
                { match: /padding-top:\s*20px;?/i, replace: 'padding-top-20' },
                { match: /color:\s*var\(--color-primary-dark\);\s*margin-bottom:\s*15px;?/i, replace: 'card-heading' },
                { match: /color:\s*var\(--color-primary-dark\);\s*margin-bottom:\s*10px;?/i, replace: 'card-heading' }
            ];

            for (const rule of styleMap) {
                if (rule.match.test(newStyle)) {
                    classes += ' ' + rule.replace;
                    newStyle = newStyle.replace(rule.match, '');
                }
            }

            // deduplicate and apply classes
            classes = [...new Set(classes.split(' ').map(c => c.trim()).filter(Boolean))].join(' ');
            if (classes) $(el).attr('class', classes);
            
            if (newStyle.trim() === '') {
                $(el).removeAttr('style');
            } else {
                $(el).attr('style', newStyle.trim());
            }
            domModified = true;
        });

        // 4. Deprecated layout attributes
        $('img[align="left"]').each((i, el) => {
            $(el).removeAttr('align');
            let c = $(el).attr('class') || '';
            $(el).attr('class', (c + ' img-float-left').trim());
            domModified = true;
        });
        $('img[align="right"]').each((i, el) => {
            $(el).removeAttr('align');
            let c = $(el).attr('class') || '';
            $(el).attr('class', (c + ' img-float-right').trim());
            domModified = true;
        });

        if (domModified) {
            body = $.html();
            content = `---${frontmatter}---\n${body}`;
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated content quality: ${filePath}`);
    }
}

const files = findMdFiles(SRC_DIR);
let count = 0;
for (const file of files) {
    processFile(file);
    count++;
}
console.log(`Content cleanup complete. Processed ${count} files.`);
