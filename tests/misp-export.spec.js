const { test, expect } = require('@playwright/test');

test.describe('MISP export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table');
  });

  test('export button appears in workbench', async ({ page }) => {
    const btn = page.locator('#misp-export-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Export MISP');
  });

  test('export button disabled when no matching IOCs', async ({ page }) => {
    await page.locator('#ioc-search').fill('nonexistent-xyz-123-no-match');
    await page.waitForTimeout(300);
    const btn = page.locator('#misp-export-btn');
    await expect(btn).toBeDisabled();
  });

  test('export generates valid MISP JSON structure', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const content = await download.createReadStream().then(stream => {
      return new Promise(resolve => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
      });
    });
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty('Event');
    expect(parsed.Event).toHaveProperty('info');
    expect(parsed.Event).toHaveProperty('Attribute');
    expect(parsed.Event).toHaveProperty('Tag');
    expect(parsed.Event.Tag[0].name).toBe('tlp:clear');
    expect(parsed.Event.threat_level_id).toBe('2');
    expect(parsed.Event.analysis).toBe('2');
    expect(parsed.Event.distribution).toBe('0');
    expect(Array.isArray(parsed.Event.Attribute)).toBe(true);
    expect(parsed.Event.Attribute.length).toBeGreaterThan(0);
  });

  test('domain IOCs map to MISP domain type', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'domain');
    await page.waitForTimeout(300);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const content = await download.createReadStream().then(stream => {
      return new Promise(resolve => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
      });
    });
    const parsed = JSON.parse(content);
    for (const attr of parsed.Event.Attribute) {
      expect(attr.type).toBe('domain');
      expect(attr.category).toBe('Network activity');
      expect(attr.to_ids).toBe(true);
      expect(attr.value).not.toContain('[.]');
    }
  });

  test('hash IOCs map to correct MISP hash type', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'hash');
    await page.selectOption('#ioc-status-filter', 'all');
    await page.waitForTimeout(300);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const content = await download.createReadStream().then(stream => {
      return new Promise(resolve => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
      });
    });
    const parsed = JSON.parse(content);
    for (const attr of parsed.Event.Attribute) {
      expect(['sha256', 'sha1', 'md5']).toContain(attr.type);
      expect(attr.category).toBe('Payload delivery');
    }
  });

  test('package IOCs export as text type with comment', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'package');
    await page.waitForTimeout(300);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const content = await download.createReadStream().then(stream => {
      return new Promise(resolve => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
      });
    });
    const parsed = JSON.parse(content);
    const pkgAttrs = parsed.Event.Attribute.filter(a => a.type === 'text');
    expect(pkgAttrs.length).toBeGreaterThan(0);
    for (const attr of pkgAttrs) {
      expect(attr.comment).toContain('Package indicator');
    }
  });

  test('filtered export only includes visible IOCs', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'domain');
    await page.waitForTimeout(300);
    const rows = await page.locator('.ioc-table tbody tr').count();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const content = await download.createReadStream().then(stream => {
      return new Promise(resolve => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
      });
    });
    const parsed = JSON.parse(content);
    expect(parsed.Event.Attribute.length).toBe(rows);
  });

  test('export filename includes date and filter context', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'domain');
    await page.waitForTimeout(300);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/^llm-threatintel-misp-export-\d{4}-\d{2}-\d{2}-.+\.json$/);
    expect(filename).toContain('domain');
  });

  test('skipped IOCs show count in status message', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#misp-export-btn').click()
    ]);
    const status = page.locator('#misp-export-status');
    const text = await status.textContent();
    expect(text).toMatch(/Exported \d+ IOCs/);
  });
});
