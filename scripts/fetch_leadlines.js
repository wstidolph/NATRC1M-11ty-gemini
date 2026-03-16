const https = require('https');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const url = 'https://www.natrcregion1.org/newRiders/newRiders.htm';
const pdfsDir = path.join(__dirname, '../src/assets/leadlines');

// ensure dir exists
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
}

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error('Failed to get ' + url + ' Status: ' + res.statusCode));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    console.log('Fetching HTML...');
    let html = await fetchHTML(url);
    
    // find all <a href="../Articles/leadlines/xyz.pdf">Link Text</a>
    let regex = /<a[^>]*href=["']([^"']*leadlines\/[^"']*\.pdf)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    let links = [];
    while ((match = regex.exec(html)) !== null) {
        let pdfPath = match[1];
        let text = match[2].replace(/<[^>]+>/g, '').replace(/[\r\n]/g, ' ').trim();
        // Resolve URL relative to the pages
        let absoluteUrl = pdfPath.replace('../', 'https://www.natrcregion1.org/').replace(/[\r\n]/g, '');
        let filename = pdfPath.split('/').pop().replace(/%20/g, ' ').replace(/[\r\n]/g, '');
        links.push({
            text,
            url: absoluteUrl,
            filename
        });
    }

    // eliminate duplicates by URL
    links = links.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    console.log(`Found ${links.length} Leadline PDFs.`);

    let mdList = [];
    mdList.push('---');
    mdList.push('layout: base.njk');
    mdList.push('title: The Leadline Archives');
    mdList.push('---');
    mdList.push('');
    mdList.push('<div class="hero">');
    mdList.push('  <h2>The Leadline Archives</h2>');
    mdList.push('  <p>Historical newsletters and breaking news for Region 1.</p>');
    mdList.push('</div>');
    mdList.push('');
    mdList.push('<div class="card">');
    mdList.push('  <input type="text" id="searchInput" placeholder="Search archives by name or date..." style="padding: 12px; width: 100%; max-width: 400px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ddd; font-size: 1rem;">');
    mdList.push('  <div class="table-responsive">');
    mdList.push('  <table id="leadlineTable" style="width: 100%; border-collapse: collapse;">');
    mdList.push('    <thead>');
    mdList.push('      <tr style="border-bottom: 2px solid var(--color-primary); background-color: var(--color-background-alt);">');
    mdList.push('        <th style="padding: 12px; text-align: left;">Issue / Title</th>');
    mdList.push('        <th style="padding: 12px; text-align: right;">Format</th>');
    mdList.push('      </tr>');
    mdList.push('    </thead>');
    mdList.push('    <tbody>');

    for (const link of links) {
        let dest = path.join(pdfsDir, link.filename);
        if (!fs.existsSync(dest)) {
            console.log(`Downloading ${link.filename}...`);
            try {
                await downloadFile(link.url, dest);
            } catch (err) {
                console.error(`Error downloading ${link.filename}: ${err}`);
            }
        }
        
        // Add to markdown list
        let fileUrl = `{{ '/assets/leadlines/${link.filename.replace(/ /g, '%20')}' | url }}`;
        mdList.push(`      <tr>`);
        mdList.push(`        <td style="padding: 12px; border-bottom: 1px solid #ddd;">`);
        mdList.push(`          <a href="${fileUrl}" target="_blank" style="font-weight: 600;">${link.text || link.filename}</a>`);
        mdList.push(`        </td>`);
        mdList.push(`        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">`);
        mdList.push(`          <span style="background: var(--color-primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">PDF</span>`);
        mdList.push(`        </td>`);
        mdList.push(`      </tr>`);
    }

    mdList.push('    </tbody>');
    mdList.push('  </table>');
    mdList.push('  </div>');
    mdList.push('</div>');
    mdList.push('');
    mdList.push('<script>');
    mdList.push('document.getElementById("searchInput").addEventListener("keyup", function() {');
    mdList.push('  var filter = this.value.toUpperCase();');
    mdList.push('  var table = document.getElementById("leadlineTable");');
    mdList.push('  var tr = table.getElementsByTagName("tr");');
    mdList.push('  for (var i = 1; i < tr.length; i++) {');
    mdList.push('    var td = tr[i].getElementsByTagName("td")[0];');
    mdList.push('    if (td) {');
    mdList.push('      var txtValue = td.textContent || td.innerText;');
    mdList.push('      if (txtValue.toUpperCase().indexOf(filter) > -1) {');
    mdList.push('        tr[i].style.display = "";');
    mdList.push('      } else {');
    mdList.push('        tr[i].style.display = "none";');
    mdList.push('      }');
    mdList.push('    }');
    mdList.push('  }');
    mdList.push('});');
    mdList.push('</script>');

    let destMd = path.join(__dirname, '../src/leadlines/index.md');
    if (!fs.existsSync(path.dirname(destMd))) {
        fs.mkdirSync(path.dirname(destMd), { recursive: true });
    }
    fs.writeFileSync(destMd, mdList.join('\n'));
    console.log('Generated markdown at ' + destMd);
}

run();
