const { test, expect } = require('@playwright/test');

test.describe('IOC enrichment links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table, .ioc-empty-state');
  });

  test('domain IOCs show VT, urlscan, AbuseIPDB links', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'domain');
    await page.waitForTimeout(300);
    const firstRow = page.locator('.ioc-table tbody tr').first();
    const links = firstRow.locator('.ioc-enrich-link');
    await expect(links).toHaveCount(3);
    const labels = await links.evaluateAll(els => els.map(e => e.getAttribute('aria-label')));
    expect(labels).toContain('Look up IOC in VirusTotal');
    expect(labels).toContain('Look up IOC in urlscan.io');
    expect(labels).toContain('Look up IOC in AbuseIPDB');
  });

  test('IP IOCs show VT, AbuseIPDB, Shodan links', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'ip');
    await page.waitForTimeout(300);
    const firstRow = page.locator('.ioc-table tbody tr').first();
    const links = firstRow.locator('.ioc-enrich-link');
    await expect(links).toHaveCount(3);
    const labels = await links.evaluateAll(els => els.map(e => e.getAttribute('aria-label')));
    expect(labels).toContain('Look up IOC in VirusTotal');
    expect(labels).toContain('Look up IOC in AbuseIPDB');
    expect(labels).toContain('Look up IOC in Shodan');
  });

  test('hash IOCs show VT, MalwareBazaar, Hybrid Analysis links', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'hash');
    await page.waitForTimeout(300);
    const firstRow = page.locator('.ioc-table tbody tr').first();
    const links = firstRow.locator('.ioc-enrich-link');
    await expect(links).toHaveCount(3);
    const labels = await links.evaluateAll(els => els.map(e => e.getAttribute('aria-label')));
    expect(labels).toContain('Look up IOC in VirusTotal');
    expect(labels).toContain('Look up IOC in MalwareBazaar');
    expect(labels).toContain('Look up IOC in Hybrid Analysis');
  });

  test('package IOCs with npm: prefix show npm, Socket, Snyk links', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'package');
    await page.selectOption('#ioc-status-filter', 'all');
    await page.waitForTimeout(300);
    const rows = page.locator('.ioc-table tbody tr');
    const count = await rows.count();
    let foundNpm = false;
    for (let i = 0; i < Math.min(count, 80); i++) {
      const indicator = await rows.nth(i).locator('.ioc-value').textContent();
      if (indicator && indicator.includes('npm:')) {
        const links = rows.nth(i).locator('.ioc-enrich-link');
        const labels = await links.evaluateAll(els => els.map(e => e.textContent));
        expect(labels).toContain('npm');
        expect(labels).toContain('Socket');
        expect(labels).toContain('Snyk');
        foundNpm = true;
        break;
      }
    }
    expect(foundNpm).toBe(true);
  });

  test('package IOCs with pypi: prefix show PyPI, Socket, Snyk links', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'package');
    await page.selectOption('#ioc-status-filter', 'all');
    await page.waitForTimeout(300);
    const rows = page.locator('.ioc-table tbody tr');
    const count = await rows.count();
    let foundPypi = false;
    for (let i = 0; i < Math.min(count, 80); i++) {
      const indicator = await rows.nth(i).locator('.ioc-value').textContent();
      if (indicator && indicator.includes('pypi:')) {
        const links = rows.nth(i).locator('.ioc-enrich-link');
        const labels = await links.evaluateAll(els => els.map(e => e.textContent));
        expect(labels).toContain('PyPI');
        expect(labels).toContain('Socket');
        expect(labels).toContain('Snyk');
        foundPypi = true;
        break;
      }
    }
    expect(foundPypi).toBe(true);
  });

  test('url_path IOCs show urlscan and VT search links', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'url_path');
    await page.waitForTimeout(300);
    const firstRow = page.locator('.ioc-table tbody tr').first();
    const links = firstRow.locator('.ioc-enrich-link');
    await expect(links).toHaveCount(2);
    const labels = await links.evaluateAll(els => els.map(e => e.getAttribute('aria-label')));
    expect(labels).toContain('Look up IOC in urlscan.io');
    expect(labels).toContain('Look up IOC in VirusTotal');
  });

  test('enrichment links use raw values and are URL-encoded', async ({ page }) => {
    await page.selectOption('#ioc-type-filter', 'domain');
    await page.waitForTimeout(300);
    const firstLink = page.locator('.ioc-enrich-link').first();
    const href = await firstLink.getAttribute('href');
    expect(href).not.toContain('[.]');
    expect(href).toMatch(/^https:\/\//);
  });

  test('all enrichment links open in new tab', async ({ page }) => {
    const links = page.locator('.ioc-enrich-link');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 10); i++) {
      const target = await links.nth(i).getAttribute('target');
      expect(target).toBe('_blank');
    }
  });

  test('all enrichment links have aria-label', async ({ page }) => {
    const links = page.locator('.ioc-enrich-link');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 10); i++) {
      const label = await links.nth(i).getAttribute('aria-label');
      expect(label).toMatch(/^Look up IOC in /);
    }
  });
});

test.describe('IOC age badges', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table');
  });

  test('age badges appear with correct classes', async ({ page }) => {
    const badges = page.locator('.ioc-age-badge');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 10); i++) {
      const cls = await badges.nth(i).getAttribute('class');
      expect(cls).toMatch(/age-new|age-recent|age-older/);
    }
  });

  test('age badge tooltip shows days since first seen', async ({ page }) => {
    const badge = page.locator('.ioc-age-badge').first();
    const title = await badge.getAttribute('title');
    expect(title).toMatch(/^First seen \d+ days? ago$/);
  });

  test('age badge labels are New, Recent, or Older', async ({ page }) => {
    const badges = page.locator('.ioc-age-badge');
    const count = await badges.count();
    for (let i = 0; i < Math.min(count, 15); i++) {
      const text = await badges.nth(i).textContent();
      expect(['New', 'Recent', 'Older']).toContain(text.trim());
    }
  });

  test('IOCs without valid first_seen show no badge', async ({ page }) => {
    const rows = page.locator('.ioc-table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const firstSeenCell = rows.nth(i).locator('td[data-label="First Seen"]');
      const text = await firstSeenCell.locator('.ioc-mono').textContent();
      if (text.trim() === 'Unknown') {
        const badge = firstSeenCell.locator('.ioc-age-badge');
        await expect(badge).toHaveCount(0);
      }
    }
  });
});

test.describe('IOC modal enrichment links', () => {
  test('IOC modal detail table includes enrichment links', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.stat-card');
    const statCards = page.locator('.stat-card');
    const count = await statCards.count();
    for (let i = 0; i < count; i++) {
      const label = await statCards.nth(i).locator('.stat-label').textContent();
      if (label.trim() === 'Active IOCs') {
        await statCards.nth(i).click();
        break;
      }
    }
    await page.waitForSelector('#modal-overlay.open');
    const modalLinks = page.locator('#modal-content .ioc-enrich-link');
    const linkCount = await modalLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Responsive layout - no overflow', () => {
  test('desktop IOC feed has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('tablet IOC feed has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('mobile IOC feed has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
