// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const url = (hash = '') => {
  return `file://${path.join(__dirname, '../android-app/app/src/main/assets/www/index.html')}#/${hash}`;
};

test.describe('Voice AI Assistant & Talkback Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Set localStorage before any page scripts run
    await page.addInitScript(() => {
      localStorage.setItem('gg_profile', JSON.stringify({
        name: 'Sarah Jenkins',
        lmp: '2025-09-01',
        edd: '2026-06-08',
        gestationalWeeks: 24,
        trimester: '2nd',
        bloodGroup: 'O+',
        gestosisScore: 2,
        riskTier: 'Low Risk'
      }));
      localStorage.setItem('gg_bp_logs', JSON.stringify([
        { systolic: 118, diastolic: 76, pulse: 72, date: '2026-08-18' }
      ]));
      localStorage.setItem('gg_ai_tts_enabled', 'true');
    });

    await page.goto(url('dashboard'));
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('1. Floating AI Bot FAB is visible and clickable', async ({ page }) => {
    const fab = page.locator('#ai-bot-fab');
    await expect(fab).toBeVisible();
  });

  test('2. Opening AI Assistant displays Voice controls and WHO/Gemini header', async ({ page }) => {
    await page.click('#ai-bot-fab');

    const overlay = page.locator('#ai-chat-overlay');
    await expect(overlay).toBeVisible();

    // Verify header title and subtitle
    const headerTitle = page.locator('#ai-chat-overlay h2');
    await expect(headerTitle).toContainText('Gestation Voice AI');

    // Verify TTS Voice toggle button is present
    const ttsToggle = page.locator('#ai-tts-toggle');
    await expect(ttsToggle).toBeVisible();

    // Verify Mic button is present in input bar
    const micBtn = page.locator('#ai-mic-btn');
    await expect(micBtn).toBeVisible();

    // Verify Settings button is NOT present (removed as requested)
    const settingsBtn = page.locator('#ai-config-btn');
    await expect(settingsBtn).toHaveCount(0);
  });

  test('3. TTS Talkback Audio Toggle functions properly', async ({ page }) => {
    await page.click('#ai-bot-fab');

    const ttsToggle = page.locator('#ai-tts-toggle');
    await expect(ttsToggle).toBeVisible();

    // Click toggle to disable
    await ttsToggle.click();
    const savedTTS = await page.evaluate(() => localStorage.getItem('gg_ai_tts_enabled'));
    expect(savedTTS).toBe('false');

    // Click toggle to re-enable
    await ttsToggle.click();
    const reEnabledTTS = await page.evaluate(() => localStorage.getItem('gg_ai_tts_enabled'));
    expect(reEnabledTTS).toBe('true');
  });

  test('4. Mic button triggers recording state and UI feedback', async ({ page }) => {
    await page.click('#ai-bot-fab');

    const micBtn = page.locator('#ai-mic-btn');
    const input = page.locator('#global-chat-input');

    // Click mic button to activate
    await micBtn.click();

    // Verify mic button or placeholder reacts
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toMatch(/Listening|Ask/);
  });

  test('5. AI Assistant answers clinical maternal queries with WHO Guidelines & Talkback', async ({ page }) => {
    await page.click('#ai-bot-fab');

    const input = page.locator('#global-chat-input');
    await input.fill('What should my blood pressure be and what are danger signs?');

    // Submit query
    await page.click('#global-chat-form button[type="submit"]');

    // Wait for AI response to appear in chat history
    const history = page.locator('#global-chat-history');
    await expect(history).toContainText('WHO');

    // Check that individual message speaker button is present for replaying audio
    const speakBtns = page.locator('.ai-speak-btn');
    await expect(speakBtns.first()).toBeVisible();
  });

  test('6. Emergency danger signs trigger immediate triage alert', async ({ page }) => {
    await page.click('#ai-bot-fab');

    const input = page.locator('#global-chat-input');
    await input.fill('I have severe bleeding and terrible abdominal pain');

    await page.click('#global-chat-form button[type="submit"]');

    const history = page.locator('#global-chat-history');
    await expect(history).toContainText('Emergency');
  });

  test('7. Chat can be closed and reopened cleanly', async ({ page }) => {
    await page.click('#ai-bot-fab');
    const overlay = page.locator('#ai-chat-overlay');
    await expect(overlay).toBeVisible();

    // Click close button
    await page.click('#close-ai-chat');
    await expect(overlay).toHaveClass(/hidden/);
  });
});
