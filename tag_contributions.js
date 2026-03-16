const fs = require('fs');
const path = require('path');

const dir = 'src/articles';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  // Skip if it's not a real article or already tagged
  if (content.includes('tags: ["articles", "contributions"]') || content.includes('tags: ["contributions"]')) {
    return;
  }

  // Add contributions tag to existing tags or add tags block
  if (content.includes('tags:')) {
    content = content.replace(/tags:\s*\[([^\]]*)\]/, (match, p1) => {
      if (p1.includes('contributions')) return match;
      return `tags: [${p1.trim()}, "contributions"]`;
    });
  } else {
    content = content.replace('---', '---\ntags: ["articles", "contributions"]');
  }
  
  fs.writeFileSync(p, content);
  console.log(`Tagged ${f}`);
});
