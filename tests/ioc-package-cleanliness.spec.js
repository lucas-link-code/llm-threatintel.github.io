const { test, expect } = require('@playwright/test');

const FORBIDDEN_PATTERNS = [
  /\(/,
  /\)/,
  /additional packages/i,
  /all versions/i,
  /</,
  />/,
  />=/,
  /<=/,
];

function assertCleanPackageValue(value) {
  for (const pattern of FORBIDDEN_PATTERNS) {
    expect(value).not.toMatch(pattern);
  }
}

test.describe('IOC package cleanliness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#ioc-feed?type=package&status=all');
    await page.waitForSelector('.ioc-table');
    await page.selectOption('#ioc-type-filter', 'package');
    await page.selectOption('#ioc-status-filter', 'all');
    await page.waitForTimeout(300);
  });

  test('package table values are clean machine tokens', async ({ page }) => {
    const values = await page.locator('.ioc-table tbody tr .ioc-value').allTextContents();
    expect(values.length).toBeGreaterThan(0);
    for (const value of values) {
      assertCleanPackageValue(value.trim());
    }
  });

  test('SIEM export has no package comments', async ({ page }) => {
    const siem = await page.locator('#ioc-export-siem').textContent();
    expect(siem).toBeTruthy();
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(siem).not.toMatch(pattern);
    }
  });

  test('CSV export has no package comments', async ({ page }) => {
    const csv = await page.locator('#ioc-export-csv').textContent();
    expect(csv).toBeTruthy();
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(csv).not.toMatch(pattern);
    }
  });

  test('JSON export values are clean for package filter', async ({ page }) => {
    const jsonText = await page.locator('#ioc-export-json').textContent();
    const rows = JSON.parse(jsonText);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      if (row.type === 'package') assertCleanPackageValue(row.value);
    }
  });

  test('MISP export package attributes are clean', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const content = await download.createReadStream().then(stream => new Promise(resolve => {
      let data = '';
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => resolve(data));
    }));
    const parsed = JSON.parse(content);
    const packageAttrs = parsed.Event.Attribute.filter(attr => attr.type === 'text');
    expect(packageAttrs.length).toBeGreaterThan(0);
    for (const attr of packageAttrs) {
      assertCleanPackageValue(attr.value);
    }
  });

  test('known valid package IOCs still appear', async ({ page }) => {
    await expect(page.locator('.ioc-table')).toContainText('@validate-sdk/v2');
    await expect(page.locator('.ioc-table')).toContainText('npm:@redhat-cloud-services/compliance-client');
  });

  test('export safety warning is hidden for clean package data', async ({ page }) => {
    await expect(page.locator('.ioc-export-warning')).toHaveCount(0);
  });

  test('mobile package layout has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#ioc-feed?type=package&status=all');
    await page.waitForSelector('.ioc-table');
    const overflow = await page.evaluate(() => {
      const el = document.querySelector('.ioc-workbench') || document.body;
      return el.scrollWidth > window.innerWidth + 2;
    });
    expect(overflow).toBe(false);
  });
});
