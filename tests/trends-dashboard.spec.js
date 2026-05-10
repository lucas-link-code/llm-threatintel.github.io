const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const postsIndex = require('../data/posts-index.json');
const actorsData = require('../data/actors.json');
const iocsData = require('../data/iocs.json');

async function openTrends(page) {
  await page.goto('/index.html#trends');
  await page.waitForSelector('text=Trends Dashboard', { timeout: 20000 });
}

function countBy(values) {
  const counts = new Map();
  for (const value of values) {
    const key = String(value ?? '').trim() || 'Unknown';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function reportWindowCounts() {
  const validMonths = postsIndex.posts
    .map(post => String(post.date || '').match(/^\d{4}-\d{2}/)?.[0])
    .filter(Boolean);
  const latestMonth = [...validMonths].sort().at(-1);
  const monthIndex = month => {
    const match = String(month || '').match(/^(\d{4})-(\d{2})$/);
    return match ? Number(match[1]) * 12 + Number(match[2]) : null;
  };
  const latestIndex = monthIndex(latestMonth);
  return {
    latestMonth,
    latestMonthReports: postsIndex.posts.filter(post => String(post.date || '').slice(0, 7) === latestMonth).length,
    lastSixMonthReports: postsIndex.posts.filter(post => {
      const idx = monthIndex(String(post.date || '').slice(0, 7));
      return idx !== null && idx >= latestIndex - 5 && idx <= latestIndex;
    }).length,
    totalReports: postsIndex.posts.length
  };
}

async function chartCounts(page, section) {
  return page.locator(`[data-trend-section="${section}"] .trend-bar-row`).evaluateAll(rows => {
    return rows.map(row => ({
      key: row.getAttribute('data-trend-key'),
      count: Number(row.getAttribute('data-trend-count'))
    }));
  });
}

function outputScreenshotPath(fileName) {
  const dir = path.join(__dirname, '..', 'output', 'playwright', 'trends-dashboard-final');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, fileName);
}

test.describe('Trends dashboard route', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders the Trends route and activates the nav item', async ({ page }) => {
    await openTrends(page);
    await expect(page.locator('h1')).toContainText('Trends Dashboard');
    await expect(page.locator('.page-subtitle')).toContainText('Trends across current reports');
    await expect(page.locator('.page-subtitle')).not.toContainText('Corpus-level');
    await expect(page.locator('.site-nav a[href="#trends"]')).toHaveClass(/active/);
    await expect(page.locator('[data-trend-stat="total-reports"]')).toContainText(String(postsIndex.posts.length));
    await expect(page.locator('[data-trend-section="reports-by-tag"]')).toBeVisible();
    await expect(page.locator('[data-trend-section="ioc-types"]')).toBeVisible();
    await expect(page.locator('[data-trend-section="actor-types"]')).toBeVisible();
  });

  test('renders without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await openTrends(page);
    expect(errors).toEqual([]);
  });

  test('report tag and month metrics match posts-index data', async ({ page }) => {
    await openTrends(page);
    const windows = reportWindowCounts();
    await expect(page.locator('[data-trend-period="latest-month"]')).toContainText(String(windows.latestMonthReports));
    await expect(page.locator('[data-trend-period="latest-month"]')).toContainText(windows.latestMonth);
    await expect(page.locator('[data-trend-period="last-six-months"]')).toContainText(String(windows.lastSixMonthReports));
    await expect(page.locator('[data-trend-period="all-time"]')).toContainText(String(windows.totalReports));

    const expectedTags = countBy(postsIndex.posts.flatMap(post => post.tags || []));
    const actualTags = await chartCounts(page, 'reports-by-tag');
    for (const [key, count] of expectedTags.entries()) {
      expect(actualTags).toContainEqual({ key, count });
    }

    const expectedMonths = [...countBy(postsIndex.posts
      .map(post => String(post.date || '').match(/^\d{4}-\d{2}/)?.[0])
      .filter(Boolean)).entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => a.key.localeCompare(b.key));
    expect(await chartCounts(page, 'reports-by-month')).toEqual(expectedMonths);
  });

  test('IOC exact metrics match iocs.json data', async ({ page }) => {
    await openTrends(page);

    const expectedTypes = countBy(iocsData.iocs.map(ioc => ioc.type));
    const actualTypes = await chartCounts(page, 'ioc-types');
    for (const [key, count] of expectedTypes.entries()) {
      expect(actualTypes).toContainEqual({ key, count });
    }

    const expectedStatuses = countBy(iocsData.iocs.map(ioc => ioc.status));
    const actualStatuses = await chartCounts(page, 'ioc-statuses');
    for (const [key, count] of expectedStatuses.entries()) {
      expect(actualStatuses).toContainEqual({ key, count });
    }

    const sourceRows = await chartCounts(page, 'ioc-sources');
    expect(sourceRows.length).toBeGreaterThan(0);
    expect(sourceRows.length).toBeLessThanOrEqual(10);
  });

  test('actor exact metrics match actors.json data', async ({ page }) => {
    await openTrends(page);

    const expectedTypes = countBy(actorsData.entries.map(actor => actor.type));
    const actualTypes = await chartCounts(page, 'actor-types');
    for (const [key, count] of expectedTypes.entries()) {
      expect(actualTypes).toContainEqual({ key, count });
    }

    const expectedStatuses = countBy(actorsData.entries.map(actor => actor.status));
    const actualStatuses = await chartCounts(page, 'actor-statuses');
    for (const [key, count] of expectedStatuses.entries()) {
      expect(actualStatuses).toContainEqual({ key, count });
    }
  });

  test('derived sections render with methodology note and avoid generic actor labels', async ({ page }) => {
    await openTrends(page);

    await expect(page.locator('text=Derived sections are based on current public-source reports')).toBeVisible();
    await expect(page.locator('[data-trend-section="affected-platforms"]')).toBeVisible();
    await expect(page.locator('[data-trend-section="attack-themes"]')).toBeVisible();
    await expect(page.locator('[data-trend-section="actor-mentions"]')).toBeVisible();

    const platforms = await chartCounts(page, 'affected-platforms');
    const themes = await chartCounts(page, 'attack-themes');
    expect(platforms.length).toBeGreaterThan(0);
    expect(themes.length).toBeGreaterThan(0);

    const actorMentions = await chartCounts(page, 'actor-mentions');
    const genericPattern = /unknown|potential threat actors|research community|unattributed threat actors/i;
    for (const row of actorMentions) {
      expect(row.key).not.toMatch(genericPattern);
    }
  });

  test('report pivots route to Intel Feed filters and search', async ({ page }) => {
    await openTrends(page);
    const tag = postsIndex.posts.find(post => post.tags?.length)?.tags[0];
    await page.locator(`[data-trend-section="reports-by-tag"] [data-trend-key="${tag}"]`).click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator(`.filter-btn[data-filter="${tag}"]`)).toHaveClass(/active/);

    await openTrends(page);
    const month = postsIndex.posts.find(post => /^\d{4}-\d{2}/.test(post.date))?.date.slice(0, 7);
    await page.locator(`[data-trend-section="reports-by-month"] [data-trend-key="${month}"]`).click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#header-search-input')).toHaveValue(month);
  });

  test('IOC pivots route to IOC Workbench filters', async ({ page }) => {
    await openTrends(page);
    await page.locator('[data-trend-section="ioc-types"] [data-trend-key="domain"]').click();
    await expect(page).toHaveURL(/#ioc-feed$/);
    await expect(page.locator('#ioc-type-filter')).toHaveValue('domain');
    await expect(page.locator('#ioc-status-filter')).toHaveValue('all');

    await openTrends(page);
    const sourceButton = page.locator('[data-trend-section="ioc-sources"] .trend-bar-button').first();
    const source = await sourceButton.getAttribute('data-trend-key');
    await sourceButton.click();
    await expect(page).toHaveURL(/#ioc-feed$/);
    await expect(page.locator('#ioc-source-filter')).toHaveValue(source);

    await page.evaluate(() => App.openTrendPivot('ioc-status', 'removed'));
    await expect(page.locator('#ioc-status-filter')).toHaveValue('removed');
  });

  test('actor mention pivot routes to Threat Actors search', async ({ page }) => {
    await openTrends(page);
    const actorButton = page.locator('[data-trend-section="actor-mentions"] .trend-bar-button').first();
    const actorName = await actorButton.getAttribute('data-trend-key');
    await actorButton.click();
    await expect(page).toHaveURL(/#actors$/);
    await expect(page.locator('#search-actors')).toHaveValue(actorName);
  });

  test('clickable chart bars are keyboard focusable with accessible names', async ({ page }) => {
    await openTrends(page);
    const firstButton = page.locator('.trend-bar-button').first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
    await expect(firstButton).toHaveAttribute('aria-label', /Open .+ trend pivot/);
  });

  test('desktop, tablet, and mobile layouts avoid document-level horizontal overflow', async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 }
    ]) {
      await page.setViewportSize(viewport);
      await openTrends(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow).toBe(false);
      await expect(page.locator('[data-trend-section="reports-by-tag"]')).toBeVisible();
      await expect(page.locator('[data-trend-section="attack-themes"]')).toBeVisible();
    }
  });

  test('captures Trends dashboard screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openTrends(page);
    await page.screenshot({ path: outputScreenshotPath('desktop-trends-top.png'), fullPage: false });
    await page.locator('[data-trend-section="affected-platforms"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: outputScreenshotPath('desktop-trends-lower.png'), fullPage: false });

    await page.setViewportSize({ width: 768, height: 1024 });
    await openTrends(page);
    await page.screenshot({ path: outputScreenshotPath('tablet-trends.png'), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await openTrends(page);
    await page.screenshot({ path: outputScreenshotPath('mobile-trends.png'), fullPage: false });
    await page.locator('.nav-toggle').click();
    await page.screenshot({ path: outputScreenshotPath('mobile-nav-trends.png'), fullPage: false });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await openTrends(page);
    await page.locator('[data-trend-section="reports-by-month"] .trend-bar-button').first().click();
    await page.screenshot({ path: outputScreenshotPath('pivot-intel-feed.png'), fullPage: false });

    await openTrends(page);
    await page.locator('[data-trend-section="ioc-types"] [data-trend-key="domain"]').click();
    await page.screenshot({ path: outputScreenshotPath('pivot-ioc-feed.png'), fullPage: false });

    await openTrends(page);
    await page.locator('[data-trend-section="actor-mentions"] .trend-bar-button').first().click();
    await page.screenshot({ path: outputScreenshotPath('pivot-threat-actors.png'), fullPage: false });
  });
});
