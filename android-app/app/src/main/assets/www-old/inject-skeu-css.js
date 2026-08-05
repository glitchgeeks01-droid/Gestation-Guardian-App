// inject-skeu-css.js
// Injects <link rel="stylesheet" href="style-skeuomorphic.css"> into all HTML files
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('style-skeuomorphic.css')) {
    console.log(`Already linked: ${file}`);
    return;
  }
  
  // Insert after the style.css link
  content = content.replace(
    /<link rel="stylesheet" href="style\.css">/,
    '<link rel="stylesheet" href="style.css">\n  <link rel="stylesheet" href="style-skeuomorphic.css">'
  );
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated: ${file}`);
});

console.log('\nDone!');
