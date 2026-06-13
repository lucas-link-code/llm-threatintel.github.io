const { test, expect } = require('@playwright/test');

const FALSE_POSITIVE_PACKAGES = ['ollama', 'grok', 'bankrbot', 'grok-bankr-integration'];
const REFERENCE_URL_PATTERNS = [
  /thehackernews\.com/i,
  /docs\.litellm\.ai\/blog/i,
  /adversa-ai\/research/i,
];
const VALID_PACKAGES = [
  'npm:@bankr/agent',
  'pypi:xinference@2.6.0',
  'npm:namastex/automagik-genie',
  'litellm@1.82.7',
];

test.describe('IOC semantic cleanliness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#ioc-feed?type=package&status=all');
    await page.waitForSelector('.ioc-table');
  });

  test('false-positive platforms absent from package IOC feed', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'package');
    await page.selectOption('#ioc-status-filter', 'all');
    await page.waitForTimeout(300);
    const values = await page.locator('.ioc-table tbody tr .ioc-value').allTextContents();
    const joined = values.join('\n').toLowerCase();
    for (const item of FALSE_POSITIVE_PACKAGES) {
      expect(joined).not.toContain(item.toLowerCase());
    }
  });

  test('false-positive platforms absent from package exports', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'package');
    const siem = (await page.locator('#ioc-export-siem').textContent()) || '';
    const csv = (await page.locator('#ioc-export-csv').textContent()) || '';
    const combined = `${siem}\n${csv}`.toLowerCase();
    for (const item of FALSE_POSITIVE_PACKAGES) {
      expect(combined).not.toContain(item.toLowerCase());
    }
  });

  test('reference article URLs absent from URL exports', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'url_path');
    await page.waitForTimeout(300);
    const siem = (await page.locator('#ioc-export-siem').textContent()) || '';
    for (const pattern of REFERENCE_URL_PATTERNS) {
      expect(siem).not.toMatch(pattern);
    }
  });

  test('known malicious packages still appear', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'package');
    const values = await page.locator('.ioc-table tbody tr .ioc-value').allTextContents();
    const joined = values.join('\n');
    for (const pkg of VALID_PACKAGES) {
      expect(joined).toContain(pkg);
    }
  });

  test('ollama and grok remain searchable in report content', async ({ page }) => {
    await page.goto('/');
    await page.locator('#header-search-input').fill('ollama');
    await page.waitForTimeout(400);
    const ollamaText = await page.locator('#search-results, .search-results, main').textContent();
    expect((ollamaText || '').toLowerCase()).toContain('ollama');

    await page.locator('#header-search-input').fill('grok');
    await page.waitForTimeout(400);
    const grokText = await page.locator('#search-results, .search-results, main').textContent();
    expect((grokText || '').toLowerCase()).toContain('grok');
  });

  test('mobile package layout has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/#ioc-feed?type=package');
    await page.waitForSelector('.ioc-table');
    const overflow = await page.evaluate(() => {
      const table = document.querySelector('.ioc-table');
      if (!table) return false;
      return table.scrollWidth > table.clientWidth + 2;
    });
    expect(overflow).toBe(false);
  });
});
