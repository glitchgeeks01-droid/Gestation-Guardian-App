const fs = require('fs');

let css = fs.readFileSync('style-skeuomorphic.css', 'utf8');

const safeAreaCss = `
/* =========================================
   IOS & ANDROID SAFE AREA ADJUSTMENTS (NOTCH / HOME INDICATOR)
   ========================================= */

@media (max-width: 767px) {
  /* Only apply heavy safe-area padding on mobile devices */
  
  /* Top App Bars (prevent notch overlap) */
  .dashboard-top-nav, .app-header {
    padding-top: calc(16px + env(safe-area-inset-top, 24px)) !important;
    height: auto !important;
    min-height: calc(70px + env(safe-area-inset-top, 24px)) !important;
  }

  /* Bottom Navigation (prevent home indicator overlap) */
  .bottom-nav, .fixed-footer {
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 24px)) !important;
    height: auto !important;
    min-height: calc(80px + env(safe-area-inset-bottom, 24px)) !important;
  }

  /* Main content padding (prevent getting hidden behind the taller header/footer) */
  .dashboard-main, .log-bp-main, .kick-main, .log-vitals-main, .hub-main, .profile-main, .q-main, .report-main {
    padding-top: calc(80px + env(safe-area-inset-top, 24px)) !important;
    padding-bottom: calc(120px + env(safe-area-inset-bottom, 24px)) !important;
  }

  /* Fix absolute positioned floating action buttons (FABs) */
  .floating-action-btn, .fab {
    bottom: calc(24px + env(safe-area-inset-bottom, 24px)) !important;
  }

  /* Smooth scrolling specifically for mobile hardware */
  body, .dashboard-screen {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: none; /* Prevents "pull-to-refresh" bounce tearing on PWA */
  }
}
`;

if (!css.includes('env(safe-area-inset-top')) {
  fs.appendFileSync('style-skeuomorphic.css', safeAreaCss);
  console.log('Appended iOS/Android Safe Area CSS to style-skeuomorphic.css');
}

// Let's also make sure all HTML files have viewport-fit=cover
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (html.includes('viewport-fit=cover')) {
    // Already good
  } else if (html.includes('<meta name="viewport"')) {
    html = html.replace(/<meta name="viewport" content="(.*?)">/, '<meta name="viewport" content="$1, viewport-fit=cover">');
    changed = true;
    console.log('Updated viewport meta in ' + file);
  }
  
  // Add theme-color meta tag so the status bar color matches the app header
  if (!html.includes('<meta name="theme-color"')) {
    html = html.replace('</head>', '  <meta name="theme-color" content="#FAF9F6">\n</head>');
    changed = true;
    console.log('Added theme-color to ' + file);
  }
  
  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
  }
});
