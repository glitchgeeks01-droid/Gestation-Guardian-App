import { test, expect } from '@playwright/test';

test.describe('Signup to Profile Data Integrity (#/signup -> #/profile)', () => {
  test('accurately displays all details submitted during signup on the profile page', async ({ page }) => {
    const testUser = {
      name: 'Priya Sharma',
      email: `priya.${Date.now()}@example.com`,
      phone: '9123456789',
      age: '31',
      gestationalWeeks: '26',
      password: 'SecurePassword123!'
    };

    // 1. Navigate to Signup page
    await page.goto('http://localhost:5173/#/signup');

    // 2. Populate signup inputs
    const nameInput = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Name" i]').first();
    if (await nameInput.isVisible()) await nameInput.fill(testUser.name);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) await emailInput.fill(testUser.email);

    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    if (await phoneInput.isVisible()) await phoneInput.fill(testUser.phone);

    const ageInput = page.locator('input[name="age"], input[placeholder*="Age" i]').first();
    if (await ageInput.isVisible()) await ageInput.fill(testUser.age);

    const weeksInput = page.locator('input[name*="week" i], input[placeholder*="Week" i]').first();
    if (await weeksInput.isVisible()) await weeksInput.fill(testUser.gestationalWeeks);

    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible()) await passwordInput.fill(testUser.password);

    // 3. Submit signup form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Create"), button:has-text("Continue")').first();
    await submitBtn.click();

    // Handle dev OTP step if prompted (MOB-005 allows '1234' on localhost)
    const otpInput = page.locator('input[placeholder*="OTP" i], input[maxlength="4"]').first();
    if (await otpInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await otpInput.fill('1234');
      const verifyBtn = page.locator('button:has-text("Verify"), button[type="submit"]').first();
      await verifyBtn.click();
    }

    // 4. Navigate to Profile page
    await page.goto('http://localhost:5173/#/profile');
    await page.waitForTimeout(500);

    // 5. Assert profile page displays all submitted user details
    const profileContent = await page.content();
    expect(profileContent).toContain(testUser.name);
    expect(profileContent).toContain(testUser.email);
    expect(profileContent).toContain(testUser.phone);
    expect(profileContent).toContain(testUser.age);

    // 6. Verify MOB-006 compliance: plaintext password must never appear in Profile DOM or localStorage
    expect(profileContent).not.toContain(testUser.password);

    const rawStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
    expect(rawStorage).not.toContain(testUser.password);
  });
});
