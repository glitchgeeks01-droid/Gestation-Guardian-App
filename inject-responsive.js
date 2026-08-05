const fs = require('fs');

let css = fs.readFileSync('style-skeuomorphic.css', 'utf8');

// The marker we want to slice at
const marker = '/* =========================================\r\n   RESPONSIVE TABLET & DESKTOP BEZEL';
const marker2 = '/* =========================================\n   RESPONSIVE TABLET & DESKTOP BEZEL';

let idx = css.indexOf(marker);
if (idx === -1) idx = css.indexOf(marker2);

if (idx !== -1) {
  // Strip old block
  css = css.substring(0, idx);
}

// Append new responsive block
const newResponsive = fs.readFileSync('responsive.css', 'utf8');
css += newResponsive;

fs.writeFileSync('style-skeuomorphic.css', css, 'utf8');
console.log('Successfully injected Native Sidebar Layout into style-skeuomorphic.css!');
