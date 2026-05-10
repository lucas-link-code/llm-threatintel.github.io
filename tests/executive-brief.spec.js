const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const postsIndex = require('../data/posts-index.json');
const actorsData = require('../data/actors.json');
const iocsData = require('../data/iocs.json');

async function openBrief(page) {
  await page.goto('/index.html#brief');
  await page.waitForSelector('text=Executive Brief', { timeout: 20000 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
  await page.waitForFunction(() => window.scrollY === 0);
}

function outputScreenshotPath(fileName) {
  const dir = path.join(__dirname, '..', 'output', 'playwright', 'executive-brief-final');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, fileName);
}

test.describe('Executive Brief route', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders the Brief route and activates the nav item', async ({ page }) => {
    await openBrief(page);
    await expect(page.locator('h1')).toContainText('Executive Brief');
    await expect(page.locator('.page-subtitle')).toContainText('Concise leadership view');
    await expect(page.locator('.brief-methodology-note')).toContainText('current LLM ThreatIntel reporting');
    await expect(page.locator('[data-brief-summary]')).toBeVisible();
    await expect(page.locator('.site-nav a[href="#brief"]')).toHaveClass(/active/);
  });

  test('data-driven exact stats and tracking-data posture render', async ({ page }) => {
    await openBrief(page);

    const latestReportDate = postsIndex.posts
      .map(post => String(post.date || '').match(/^\d{4}-\d{2}-\d{2}/)?.[0])
      .filter(Boolean)
      .sort()
      .at(-1);
    const lastUpdated = [
      latestReportDate,
      iocsData.last_updated,
      actorsData.last_updated
    ]
      .map(value => String(value || '').match(/^\d{4}-\d{2}-\d{2}/)?.[0])
      .filter(Boolean)
      .sort()
      .at(-1);
    const activeIocs = iocsData.iocs.filter(ioc => ioc.status === 'active').length;
    const activeActors = actorsData.entries.filter(actor => actor.status === 'active').length;

    await expect(page.locator('[data-brief-stat="total-reports"]')).toContainText(String(postsIndex.posts.length));
    await expect(page.locator('[data-brief-stat="active-iocs"]')).toContainText(String(activeIocs));
    await expect(page.locator('[data-brief-stat="active-actors"]')).toContainText(String(activeActors));
    await expect(page.locator('[data-brief-stat="recent-reports"]')).toBeVisible();
    await expect(page.locator('[data-brief-stat="top-theme"]')).toHaveCount(0);
    await expect(page.locator('[data-brief-window]')).toContainText('Window: Last 30 days');
    await expect(page.locator('[data-brief-updated]')).toContainText(lastUpdated);
    await expect(page.locator('.brief-posture-card')).toHaveAttribute('data-brief-posture', /^(Elevated|Active|Watch|Stable)$/);
    await expect(page.locator('.brief-posture-card')).toContainText('Leading threat theme');
    await expect(page.locator('.brief-posture-card')).toContainText('tracking-data posture indicator');
  });

  test('theme chart renders as directional keyword-based bars', async ({ page }) => {
    await openBrief(page);
    const chart = page.locator('[data-trend-section="brief-theme-mix"]');
    await expect(chart).toBeVisible();
    await expect(chart).toContainText('Threat Theme Mix, Last 30 Days');
    await expect(chart.locator('.trend-bar-row')).not.toHaveCount(0);
    await expect(page.locator('.brief-methodology-note')).toContainText('keyword-based and directional');
  });

  test('renders without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await openBrief(page);
    expect(errors).toEqual([]);
  });

  test('executive summary, signals, and focus sections stay concise and safe', async ({ page }) => {
    await openBrief(page);
    const summary = page.locator('[data-brief-summary] p');
    await expect(summary).toContainText(/current tracking data|tracked reports/i);
    await expect(summary).not.toContainText(/a elevated/i);
    await expect(summary).not.toContainText(/global threat landscape|organization-specific risk scoring/i);
    await expect(page.locator('.brief-dashboard')).not.toContainText(/\bcorpus\b/i);
    await expect(page.locator('.brief-dashboard')).not.toContainText(/This brief/i);
    await expect(page.locator('.brief-signal-grid .brief-mini-card')).toHaveCount(3);
    await expect(page.locator('[data-brief-signal="ioc-sources"]')).toContainText('Top IOC Sources');
    await expect(page.locator('[data-brief-signal="ioc-sources"]')).not.toContainText('Most Common IOC Source');
    await expect(page.locator('.brief-meaning-grid .brief-mini-card')).toHaveCount(3);
    await expect(page.locator('[data-brief-focus]')).toHaveCount(3);
    await expect(page.locator('text=Recommended Focus')).toBeVisible();
  });

  test('pivots route to detailed pages with clean destination state', async ({ page }) => {
    await openBrief(page);
    await page.locator('[data-brief-stat="recent-reports"]').click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#header-search-input')).toHaveValue('');

    await openBrief(page);
    await page.locator('[data-brief-stat="total-reports"]').click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#header-search-input')).toHaveValue('');

    await openBrief(page);
    await page.locator('[data-brief-stat="active-iocs"]').click();
    await expect(page).toHaveURL(/#ioc-feed$/);
    await expect(page.locator('#ioc-status-filter')).toHaveValue('active');

    await openBrief(page);
    await page.locator('[data-brief-stat="active-actors"]').click();
    await expect(page).toHaveURL(/#actors$/);
    await expect(page.locator('#search-actors')).toHaveValue('');

    await openBrief(page);
    const themeButton = page.locator('[data-trend-section="brief-theme-mix"] .trend-bar-button').first();
    const themeSearch = await themeButton.getAttribute('data-trend-pivot-value');
    await themeButton.click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#header-search-input')).toHaveValue(themeSearch);

    await openBrief(page);
    await page.locator('[data-brief-pivot="trends"]').click();
    await expect(page).toHaveURL(/#trends$/);
    await expect(page.locator('h1')).toContainText('Trends Dashboard');

    await openBrief(page);
    await page.locator('[data-brief-pivot="ioc-feed"]').click();
    await expect(page).toHaveURL(/#ioc-feed$/);
    await expect(page.locator('#ioc-status-filter')).toHaveValue('active');
    await expect(page.locator('#ioc-type-filter')).toHaveValue('all');

    await openBrief(page);
    await page.locator('[data-brief-pivot="actors"]').click();
    await expect(page).toHaveURL(/#actors$/);
    await expect(page.locator('#search-actors')).toHaveValue('');

    await openBrief(page);
    await page.locator('[data-brief-pivot="home"]').click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('#header-search-input')).toHaveValue('');

    await page.locator('#header-search-input').fill('api key');
    await page.evaluate(() => App.openBriefPivot('route', 'home'));
    await expect(page.locator('#header-search-input')).toHaveValue('');
  });

  test('interactive controls are keyboard reachable with accessible names', async ({ page }) => {
    await openBrief(page);
    const firstThemeButton = page.locator('[data-trend-section="brief-theme-mix"] .trend-bar-button').first();
    await firstThemeButton.focus();
    await expect(firstThemeButton).toBeFocused();
    await expect(firstThemeButton).toHaveAttribute('aria-label', /Open .+ trend pivot/);

    const trendsButton = page.locator('[data-brief-pivot="trends"]');
    await trendsButton.focus();
    await expect(trendsButton).toBeFocused();
    await expect(trendsButton).toHaveAttribute('aria-label', 'Open Trends');
  });

  test('desktop, tablet, and mobile layouts avoid document-level horizontal overflow', async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 }
    ]) {
      await page.setViewportSize(viewport);
      await openBrief(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow).toBe(false);
      await expect(page.locator('[data-brief-summary]')).toBeVisible();
      await expect(page.locator('[data-trend-section="brief-theme-mix"]')).toBeVisible();
      await expect(page.locator('.brief-pivot-actions')).toBeVisible();
    }
  });

  test('core existing routes still render after adding the Brief route', async ({ page }) => {
    for (const [hash, selector] of [
      ['#home', '#posts-grid .post-card'],
      ['#trends', 'text=Trends Dashboard'],
      ['#actors', '#actor-table tbody tr'],
      ['#ioc-feed', '#ioc-result-status']
    ]) {
      await page.goto(`/index.html${hash}`);
      await page.waitForSelector(selector, { timeout: 20000 });
    }
  });

  test('captures Executive Brief screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openBrief(page);
    await page.screenshot({ path: outputScreenshotPath('desktop-brief-top.png'), fullPage: false });
    await page.locator('.brief-pivot-section').scrollIntoViewIfNeeded();
    await page.screenshot({ path: outputScreenshotPath('desktop-brief-lower.png'), fullPage: false });

    await page.setViewportSize({ width: 768, height: 1024 });
    await openBrief(page);
    await page.screenshot({ path: outputScreenshotPath('tablet-brief.png'), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await openBrief(page);
    await page.screenshot({ path: outputScreenshotPath('mobile-brief.png'), fullPage: false });
    await page.locator('.nav-toggle').click();
    await page.screenshot({ path: outputScreenshotPath('mobile-nav-brief.png'), fullPage: false });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await openBrief(page);
    await page.locator('[data-trend-section="brief-theme-mix"] .trend-bar-button').first().click();
    await page.screenshot({ path: outputScreenshotPath('theme-pivot-intel-feed.png'), fullPage: false });
  });
});
