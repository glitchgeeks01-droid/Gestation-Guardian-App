// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const url = (route) => {
  const filePath = path.resolve(__dirname, '../android-app/app/src/main/assets/www/index.html').replace(/\\/g, '/');
  return `file:///${filePath}#/${route}`;
};

test.describe('Sign-in Error Messages & Authentication Security', () => {
  test('empty fields show "Please enter your email and password"', async ({ page }) => {
    await page.goto(url('signin'));
    await page.waitForLoadState('domcontentloaded');

    // Remove required attributes so form submission reaches JS handler
    await page.evaluate(() => {
      document.getElementById('signin-email')?.removeAttribute('required');
      document.getElementById('signin-password')?.removeAttribute('required');
      window.Auth?.handleSignIn();
    });

    const toast = page.locator('.toast.error');
    await expect(toast).toContainText('Please enter your email and password');
  });

  test('incorrect password for existing local user shows generic error', async ({ page }) => {
    await page.goto(url('signin'));

    // Seed local user profile
    await page.evaluate(() => {
      localStorage.setItem('gg_profile', JSON.stringify({
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'correctpassword123',
        lmp: '2025-09-01',
        edd: '2026-06-08'
      }));
    });

    await page.fill('#signin-email', 'sarah@example.com');
    await page.fill('#signin-password', 'wrongpassword');
    await page.click('button[type="submit"]');

    const toast = page.locator('.toast.error');
    await expect(toast).toContainText('Problem with email or password, please check again.', { timeout: 15000 });
  });

  test('non-existent account shows generic error without enumerating user', async ({ page }) => {
    await page.goto(url('signin'));

    // Clear any profile
    await page.evaluate(() => {
      localStorage.removeItem('gg_profile');
    });

    await page.fill('#signin-email', 'nonexistent_user@example.com');
    await page.fill('#signin-password', 'randompassword');
    await page.click('button[type="submit"]');

    const toast = page.locator('.toast.error');
    await expect(toast).toContainText('Problem with email or password, please check again.', { timeout: 15000 });
  });

  test('valid credentials log in successfully', async ({ page }) => {
    // Seed local user profile before navigating
    await page.addInitScript(() => {
      localStorage.setItem('gg_profile', JSON.stringify({
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'correctpassword123',
        lmp: '2025-09-01',
        edd: '2026-06-08'
      }));
    });

    await page.goto(url('signin'));

    await page.fill('#signin-email', 'sarah@example.com');
    await page.fill('#signin-password', 'correctpassword123');
    await page.click('button[type="submit"]');

    // Navigation to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
});
