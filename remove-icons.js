const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Broadly match any known emoji containers and clear their contents
  content = content.replace(/<div class="bento-icon">[\s\S]*?<\/div>/g, '<div class="bento-icon"></div>');
  content = content.replace(/<div class="nav-icon">[\s\S]*?<\/div>/g, '<div class="nav-icon"></div>');
  content = content.replace(/<div class="vital-icon(.*?)">[\s\S]*?<\/div>/g, '<div class="vital-icon$1"></div>');
  content = content.replace(/<div class="icon-circle">[\s\S]*?<\/div>/g, '<div class="icon-circle"></div>');
  content = content.replace(/<div class="profile-icon">[\s\S]*?<\/div>/g, '<div class="profile-icon"></div>');
  content = content.replace(/<div class="icon">[\s\S]*?<\/div>/g, '<div class="icon"></div>');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned icons/emojis in ${file}`);
  }
});
