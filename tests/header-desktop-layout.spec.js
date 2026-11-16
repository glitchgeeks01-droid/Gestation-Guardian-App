import { test, expect } from '@playwright/test';

test.describe('Desktop Header Layout Integrity & Clipping Prevention', () => {
  const viewports = [
    { width: 1280, height: 720, label: '720p Laptop' },
    { width: 1366, height: 768, label: '1366x768 Desktop' },
    { width: 1024, height: 600, label: 'Compact Height Desktop' }
  ];

  for (const vp of viewports) {
    test(`header is 100% visible and unclipped at scroll position 0 on ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Seed mock profile so protected routes mount cleanly
      await page.goto('http://localhost:5173/#/dashboard');
      await page.evaluate(() => {
        localStorage.setItem('gg_profile', JSON.stringify({
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '9876543210',
          age: 28,
          weeks: 24,
          bloodGroup: 'O+'
        }));
      });

      const routes = ['#/dashboard', '#/profile', '#/health-hub', '#/care-guide'];

      for (const route of routes) {
        await page.goto(`http://localhost:5173/${route}`);
        await page.waitForTimeout(600);

        const headerMetrics = await page.evaluate(() => {
          const activePage = document.querySelector('.page.active');
          if (!activePage) return null;

          // Find the active page header
          const header = activePage.querySelector('header, .glass-header, .dashboard-header, [class*="header"]');
          if (!header) return null;

          const rect = header.getBoundingClientRect();
          const root = document.getElementById('app-root');
          const rootRect = root ? root.getBoundingClientRect() : null;

          return {
            pageId: activePage.id,
            headerTag: header.tagName,
            headerClass: header.className,
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
            rootTop: rootRect ? rootRect.top : null,
            pageScrollTop: activePage.scrollTop,
            windowScrollY: window.scrollY
          };
        });

        expect(headerMetrics).not.toBeNull();
        // Assert header is not pushed into negative space (clipping bug)
        expect(headerMetrics.top).toBeGreaterThanOrEqual(0);
        expect(headerMetrics.height).toBeGreaterThan(0);
        // Assert app root is flush with the top of the browser viewport
        expect(headerMetrics.rootTop).toBe(0);
      }
    });
  }
});
