const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '../src/leadlines/index.md');
const content = fs.readFileSync(mdPath, 'utf8');

const regex = /<a href="\{\{\s*'\/assets\/leadlines\/([^']+)'\s*\|\s*url\s*\}\}"[^>]*>(.*?)<\/a>/g;
let match;
let leadlines = [];

while ((match = regex.exec(content)) !== null) {
  leadlines.push({
    filename: match[1],
    title: match[2].trim()
  });
}

const outPath = path.join(__dirname, '../src/_data/leadlines.json');
fs.writeFileSync(outPath, JSON.stringify(leadlines, null, 2));

console.log(`Extracted ${leadlines.length} leadlines to ${outPath}`);
