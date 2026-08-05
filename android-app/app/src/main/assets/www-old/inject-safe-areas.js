const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const safeAreaCSS = `
/* =========================================
   SAFE AREA INSETS
   ========================================= */
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
}

.dashboard-screen,
.reminders-screen,
.log-bp-screen,
.kick-screen,
.log-vitals-screen,
.hub-screen,
.guide-screen,
.profile-screen,
.signin-screen,
.signup-wrapper,
.report-screen,
.medical-history-screen,
.q-screen {
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
}

/* Ensure fixed headers and footers adjust as well */
.app-header,
.dashboard-top-nav,
.reminders-header,
.log-header,
.report-header,
.q-header {
  padding-top: calc(var(--safe-top) + 16px) !important;
}

.bottom-nav,
.fixed-footer {
  padding-bottom: calc(var(--safe-bottom) + 16px) !important;
}
`;

fs.writeFileSync('style.css', css + '\n' + safeAreaCSS, 'utf8');
