const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/#/signin');
  await page.waitForTimeout(1000);
  const pwInput = await page.locator('#signin-password');
  const box = await pwInput.boundingBox();
  const containerBox = await page.locator('#signin-password').locator('..').boundingBox();
  const eyeIcon = await page.locator('.input-icon-right').first();
  const eyeBox = await eyeIcon.boundingBox();
  console.log('Input Box:', box);
  console.log('Container Box:', containerBox);
  console.log('Eye Icon Box:', eyeBox);
  await browser.close();
})();
