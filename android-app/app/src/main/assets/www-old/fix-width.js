const fs = require('fs');

let css = fs.readFileSync('style-skeuomorphic.css', 'utf8');

// The issue: CSS Grid items shrink-to-fit if margin: 0 auto is applied without width: 100%.
// Let's add a global fix block at the very end of style-skeuomorphic.css
const fixCss = `
/* --- LAYOUT FIX FOR GRID ITEM SHRINKING --- */
@media (min-width: 768px) {
  .dashboard-main, .log-bp-main, .kick-main, .log-vitals-main, .hub-main, .profile-main, .q-main, .report-main {
    width: 100% !important;
    justify-self: center !important;
  }
  
  .dashboard-top-nav, .app-header {
    width: 100% !important;
  }

  .nav-container {
    width: 100% !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
  }
}
`;

fs.appendFileSync('style-skeuomorphic.css', fixCss);
console.log('Appended width fixes to style-skeuomorphic.css');
