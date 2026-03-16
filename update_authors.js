const fs = require('fs');
const path = require('path');

const articlesDir = 'src/articles';
const authorsMap = {
  'ADayInTheLife.md': 'Laura Harvey',
  'CMDTRA_story.md': 'Brian Pepper',
  'CowboyCampInaugural.md': 'Donna Stidolph',
  'Differently-abledRider.md': 'Catherine de la Cruz',
  'FAQ.md': 'Anonymous',
  'JudgesQandA.md': 'Jamie Dieterich and Priscilla Lindsey',
  'Judging_Explained.md': 'Jamie K. Dieterich',
  'MtDiablo2012.md': 'Donna Stidolph',
  'NATRC_101.md': 'Laura Harvey',
  'Remembrances.md': 'Anonymous',
  'Ride_Your_Own_Ride.md': 'Jamie K. Dieterich',
  'taking_juniors_to_natrc_rides.md': 'Kay Lieberknecht and Angie Meroshnekoff'
};

Object.entries(authorsMap).forEach(([filename, author]) => {
  const filePath = path.join(articlesDir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        let frontMatter = parts[1];
        if (!frontMatter.includes('author:')) {
          frontMatter += `author: "${author}"\n`;
          parts[1] = frontMatter;
          const newContent = parts.join('---');
          fs.writeFileSync(filePath, newContent);
          console.log(`Updated ${filename} with author ${author}`);
        } else {
          console.log(`${filename} already has an author`);
        }
      }
    }
  }
});
