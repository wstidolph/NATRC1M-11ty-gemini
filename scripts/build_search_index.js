const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfsDir = path.join(__dirname, '../src/assets/leadlines');
const outPath = path.join(__dirname, '../src/assets/js/leadlines_search_index.json');

async function buildIndex() {
  console.log('Building deep search index for Leadline PDFs...');
  
  if (!fs.existsSync(pdfsDir)) {
    console.log('No leadlines directory found. Skipping.');
    return;
  }
  
  const files = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));
  const searchIndex = [];

  for (const filename of files) {
    const filePath = path.join(pdfsDir, filename);
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
      // pdf-parse extracts the text content
      const data = await pdf(dataBuffer);
      // Clean up whitespace to reduce file size
      const cleanContent = data.text.replace(/\s+/g, ' ').trim();
      
      searchIndex.push({
        filename: filename,
        content: cleanContent
      });
      console.log(`Indexed ${filename}`);
    } catch (err) {
      console.error(`Failed to parse ${filename}:`, err);
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(searchIndex));
  console.log(`Successfully built index to ${outPath}`);
}

buildIndex();
