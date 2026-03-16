const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node scripts/add_leadline.js <path/to/pdf> \"Issue Title\"");
  process.exit(1);
}

const sourcePdfPath = path.resolve(args[0]);
const title = args[1];

if (!fs.existsSync(sourcePdfPath)) {
  console.error(`Error: File not found at ${sourcePdfPath}`);
  process.exit(1);
}

const filename = path.basename(sourcePdfPath).replace(/\s+/g, '_');
const destPdfPath = path.join(__dirname, '../src/assets/leadlines/', filename);

// Copy PDF
fs.copyFileSync(sourcePdfPath, destPdfPath);
console.log(`Copied ${filename} to src/assets/leadlines/`);

// Update json
const jsonPath = path.join(__dirname, '../src/_data/leadlines.json');
let leadlines = [];
if (fs.existsSync(jsonPath)) {
  leadlines = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

// Add to beginning of array
leadlines.unshift({
  filename,
  title
});

fs.writeFileSync(jsonPath, JSON.stringify(leadlines, null, 2));
console.log(`Updated leadlines.json with "${title}"`);

// Rebuild search index
console.log("Rebuilding search index...");
try {
  execSync('node scripts/build_search_index.js', { stdio: 'inherit' });
} catch (e) {
  console.error("Failed to rebuild search index:", e);
}

console.log(`\nSuccess! ${title} has been added to the archives.`);
