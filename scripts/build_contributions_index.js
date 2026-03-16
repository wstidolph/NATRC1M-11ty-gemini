const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '../src/articles');
const outPath = path.join(__dirname, '../src/assets/js/contributions_search_index.json');

function buildIndex() {
  console.log('Building search index for Member Contributions...');
  
  if (!fs.existsSync(articlesDir)) {
    console.log('No articles directory found. Skipping.');
    return;
  }
  
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  const searchIndex = [];

  for (const filename of files) {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Only include if it has the 'contributions' tag
    if (data.tags && data.tags.includes('contributions')) {
      searchIndex.push({
        url: `articles/${filename.replace('.md', '/')}`,
        title: data.title || filename,
        author: data.author || 'Anonymous',
        summary: data.summary || '',
        content: content.replace(/\s+/g, ' ').trim()
      });
      console.log(`Indexed ${filename}`);
    }
  }

  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(searchIndex));
  console.log(`Successfully built contributions index to ${outPath}`);
}

buildIndex();
