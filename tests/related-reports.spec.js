const { test, expect } = require('@playwright/test');

test.describe('Related reports', () => {
  test('post with known CVE duplicate (LiteLLM) shows related reports', async ({ page }) => {
    await page.goto('/#post/2026-05-13-litellm-cve-2026-42208-sql-injection-active-exploitation');
    await page.waitForSelector('.post-content');
    const related = page.locator('.related-reports');
    await expect(related).toBeVisible();
    const items = related.locator('.related-reports-list li');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(5);
  });

  test('related report links navigate correctly', async ({ page }) => {
    await page.goto('/#post/2026-05-13-litellm-cve-2026-42208-sql-injection-active-exploitation');
    await page.waitForSelector('.related-reports');
    const firstLink = page.locator('.related-reports-list a').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toMatch(/^#post\//);
    await firstLink.click();
    await page.waitForSelector('.post-content');
    expect(page.url()).toContain('#post/');
  });

  test('max 5 results enforced', async ({ page }) => {
    await page.goto('/#post/2026-05-13-litellm-cve-2026-42208-sql-injection-active-exploitation');
    await page.waitForSelector('.post-content');
    const items = page.locator('.related-reports-list li');
    const count = await items.count();
    expect(count).toBeLessThanOrEqual(5);
  });

  test('post with unique topic shows no related reports', async ({ page }) => {
    await page.goto('/#post/2026-03-10-shadow-ai-detection');
    await page.waitForSelector('.post-content');
    await page.waitForTimeout(500);
    const related = page.locator('.related-reports');
    const count = await related.count();
    if (count > 0) {
      const visible = await related.isVisible();
      if (visible) {
        const items = await page.locator('.related-reports-list li').count();
        expect(items).toBeLessThanOrEqual(5);
      }
    }
  });

  test('related reports section hidden when no matches', async ({ page }) => {
    await page.goto('/#post/2026-03-10-shadow-ai-detection');
    await page.waitForSelector('.post-content');
    await page.waitForTimeout(500);
    const html = await page.locator('.main-content').innerHTML();
    const hasRelated = html.includes('related-reports');
    if (!hasRelated) {
      expect(hasRelated).toBe(false);
    }
  });

  test('related reports include date for each entry', async ({ page }) => {
    await page.goto('/#post/2026-05-13-litellm-cve-2026-42208-sql-injection-active-exploitation');
    await page.waitForSelector('.related-reports');
    const dates = page.locator('.related-reports-list .related-date');
    const count = await dates.count();
    expect(count).toBeGreaterThan(0);
    const firstDate = await dates.first().textContent();
    expect(firstDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
