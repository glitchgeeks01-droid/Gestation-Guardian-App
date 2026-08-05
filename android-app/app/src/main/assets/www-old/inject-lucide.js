const fs = require('fs');

const dashboardHtml = fs.readFileSync('dashboard.html', 'utf8');

// Insert Lucide CDN right before closing head
let modified = dashboardHtml;
if (!modified.includes('unpkg.com/lucide')) {
  modified = modified.replace('</head>', '  <script src="https://unpkg.com/lucide@latest"></script>\n</head>');
}

// Add init script at the bottom
if (!modified.includes('lucide.createIcons();')) {
  modified = modified.replace('</body>', '  <script>lucide.createIcons();</script>\n</body>');
}

// Replace bento icons
modified = modified.replace('<div class="bento-icon"></div>\n          <span>Log BP</span>', '<div class="bento-icon"><i data-lucide="stethoscope"></i></div>\n          <span>Log BP</span>');
modified = modified.replace('<div class="bento-icon"></div>\n          <span>Kick Counter</span>', '<div class="bento-icon"><i data-lucide="baby"></i></div>\n          <span>Kick Counter</span>');
modified = modified.replace('<div class="bento-icon"></div>\n          <span>Log Vital Data</span>', '<div class="bento-icon"><i data-lucide="activity"></i></div>\n          <span>Log Vital Data</span>');
modified = modified.replace('<div class="bento-icon"></div>\n          <span>AI Assistant</span>', '<div class="bento-icon"><i data-lucide="bot"></i></div>\n          <span>AI Assistant</span>');
modified = modified.replace('<div class="bento-icon"></div>\n          <span>Reports</span>', '<div class="bento-icon"><i data-lucide="file-text"></i></div>\n          <span>Reports</span>');
modified = modified.replace('<div class="bento-icon"></div>\n          <span>Reminders</span>', '<div class="bento-icon"><i data-lucide="bell"></i></div>\n          <span>Reminders</span>');

// Replace vital icons
modified = modified.replace('<div class="vital-icon heart-icon"></div>', '<div class="vital-icon heart-icon"><i data-lucide="heart-pulse"></i></div>');
modified = modified.replace('<div class="vital-icon weight-icon"></div>', '<div class="vital-icon weight-icon"><i data-lucide="scale"></i></div>');
modified = modified.replace('<div class="vital-icon sleep-icon"></div>', '<div class="vital-icon sleep-icon"><i data-lucide="moon"></i></div>');

// Replace nav icons
modified = modified.replace('<div class="nav-icon"></div>\n        <span>HOME</span>', '<div class="nav-icon"><i data-lucide="home"></i></div>\n        <span>HOME</span>');
modified = modified.replace('<div class="nav-icon"></div>\n        <span>HEALTH</span>', '<div class="nav-icon"><i data-lucide="stethoscope"></i></div>\n        <span>HEALTH</span>');
modified = modified.replace('<div class="nav-icon"></div>\n        <span>LEARN</span>', '<div class="nav-icon"><i data-lucide="book-open"></i></div>\n        <span>LEARN</span>');
modified = modified.replace('<div class="nav-icon"></div>\n        <span>PROFILE</span>', '<div class="nav-icon"><i data-lucide="user"></i></div>\n        <span>PROFILE</span>');

fs.writeFileSync('dashboard.html', modified, 'utf8');
console.log('Injected Lucide SVGs into Dashboard.');
