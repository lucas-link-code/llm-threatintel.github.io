const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const iocData = require('../data/iocs.json');
const postsIndex = require('../data/posts-index.json');

const iocs = iocData.iocs;

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function dateStrippedPostMap() {
  const map = new Map();
  for (const post of postsIndex.posts) {
    const stripped = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    if (!map.has(stripped)) map.set(stripped, []);
    map.get(stripped).push(post.id);
  }
  return map;
}

const activeHash = iocs.find(i => i.status === 'active' && ['sha256', 'sha1', 'md5'].includes(i.type));
const activeDomain = iocs.find(i => i.status === 'active' && i.type === 'domain');
const activeIP = iocs.find(i => i.status === 'active' && i.type === 'ip');
const activeSource = iocs.find(i => i.status === 'active' && i.source)?.source;
const activeCampaign = iocs.find(i => i.status === 'active' && i.campaign)?.campaign;
const removedPackage = iocs.find(i => i.status === 'removed' && i.type === 'package');
const campaignMap = dateStrippedPostMap();
const linkedCampaign = unique(iocs.map(i => i.campaign)).find(c => campaignMap.get(c)?.length === 1);
const unmatchedCampaign = unique(iocs.map(i => i.campaign)).find(c => !postsIndex.posts.some(p => p.id === c) && !campaignMap.has(c));

async function openIOCFeed(page) {
  await page.goto('/index.html#ioc-feed');
  await page.waitForSelector('#ioc-result-status', { timeout: 20000 });
}

async function visibleRowCount(page) {
  return page.locator('.ioc-table tbody tr').count();
}

function outputScreenshotPath(fileName) {
  const dir = path.join(__dirname, '..', 'output', 'playwright', 'ioc-workbench-final');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, fileName);
}

test.describe('IOC workbench helper behavior', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('default filtered set is active only and removed IOCs are excluded', async ({ page }) => {
    await openIOCFeed(page);
    const result = await page.evaluate(() => {
      const filtered = App.getFilteredIOCs();
      return {
        count: filtered.length,
        statuses: [...new Set(filtered.map(i => i.status))],
        removedInSource: App.getIOCRecords().some(i => i.status === 'removed')
      };
    });
    expect(result.count).toBeGreaterThan(0);
    expect(result.statuses).toEqual(['active']);
    expect(result.removedInSource).toBe(true);
  });

  test('type grouping uses explicit IOC types and export escaping is stable', async ({ page }) => {
    await openIOCFeed(page);
    const result = await page.evaluate(() => {
      const hash = { value: 'a'.repeat(64), type: 'sha256', status: 'active' };
      const quoted = { value: 'evil"domain\\path', type: 'domain', status: 'active' };
      return {
        hashBucket: App.getIOCTypeBucket(hash),
        hashDefanged: App.buildIOCExports([hash]).defanged,
        siem: App.buildIOCExports([quoted]).siem,
        emptyCount: App.buildIOCExports([{ value: '', type: 'domain' }, { value: null, type: 'ip' }]).count
      };
    });
    expect(result.hashBucket).toBe('hash');
    expect(result.hashDefanged).toBe('a'.repeat(64));
    expect(result.siem).toBe('"*evil\\"domain\\\\path*"');
    expect(result.emptyCount).toBe(0);
  });
});

test.describe('IOC workbench controls and exports', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('search matches value, context, campaign, and source fields', async ({ page }) => {
    await openIOCFeed(page);

    await page.locator('#ioc-search').fill(activeHash.value);
    await expect(page.locator('#ioc-result-status')).toContainText(/Showing [1-9]/);
    await expect(page.locator('.ioc-value').first()).toContainText(activeHash.value);

    await page.locator('#ioc-clear-filters').click();
    await page.locator('#ioc-search').fill(activeHash.context.slice(0, 18));
    expect(await visibleRowCount(page)).toBeGreaterThan(0);

    await page.locator('#ioc-clear-filters').click();
    await page.locator('#ioc-search').fill(activeCampaign);
    expect(await visibleRowCount(page)).toBeGreaterThan(0);

    await page.locator('#ioc-clear-filters').click();
    await page.locator('#ioc-search').fill(activeSource);
    expect(await visibleRowCount(page)).toBeGreaterThan(0);
  });

  test('type, status, campaign, source, sort, and clear controls update the result set', async ({ page }) => {
    await openIOCFeed(page);

    await page.locator('#ioc-type-filter').selectOption('hash');
    await expect(page.locator('.ioc-table tbody tr').first()).toContainText(/sha/i);
    const hashRows = await visibleRowCount(page);
    expect(hashRows).toBeGreaterThan(0);

    await page.locator('#ioc-status-filter').selectOption('removed');
    await page.locator('#ioc-type-filter').selectOption('package');
    await expect(page.locator('.ioc-table tbody tr').first()).toContainText(/REMOVED/);
    await expect(page.locator('.ioc-value').filter({ hasText: removedPackage.value }).first()).toBeVisible();

    await page.locator('#ioc-clear-filters').click();
    await page.locator('#ioc-campaign-filter').selectOption(activeCampaign);
    expect(await visibleRowCount(page)).toBeGreaterThan(0);

    await page.locator('#ioc-clear-filters').click();
    await page.locator('#ioc-source-filter').selectOption(activeSource);
    expect(await visibleRowCount(page)).toBeGreaterThan(0);

    const before = await page.evaluate(() => App.getFilteredIOCs().length);
    await page.locator('#ioc-sort').selectOption('value');
    const sortedValues = await page.evaluate(() => App.getFilteredIOCs().map(i => i.value));
    expect(sortedValues).toEqual([...sortedValues].sort((a, b) => String(a).toLowerCase().localeCompare(String(b).toLowerCase())));
    expect(await page.evaluate(() => App.getFilteredIOCs().length)).toBe(before);

    await page.locator('#ioc-clear-filters').click();
    await expect(page.locator('#ioc-search')).toHaveValue('');
    await expect(page.locator('#ioc-status-filter')).toHaveValue('active');
    await expect(page.locator('#ioc-type-filter')).toHaveValue('all');
  });

  test('filtered exports match the visible filtered set and preserve raw values where required', async ({ page }) => {
    await openIOCFeed(page);

    await page.locator('#ioc-type-filter').selectOption('domain');
    await expect(page.locator('#ioc-export-defanged')).toContainText('[.]');
    await expect(page.locator('#ioc-export-siem')).toContainText(`"*${activeDomain.value}*"`);
    expect(await visibleRowCount(page)).toBeGreaterThan(0);

    await page.locator('#ioc-type-filter').selectOption('hash');
    await expect(page.locator('#ioc-export-defanged')).toContainText(activeHash.value);
    await expect(page.locator('#ioc-export-siem')).toContainText(`"${activeHash.value}"`);
    await expect(page.locator('#ioc-export-siem')).not.toContainText(`"*${activeHash.value}*"`);

    await page.locator('#ioc-type-filter').selectOption('ip');
    await expect(page.locator('#ioc-export-siem')).toContainText(`"${activeIP.value}"`);
    await expect(page.locator('#ioc-export-siem')).not.toContainText(`"*${activeIP.value}*"`);

    await page.locator('#ioc-status-filter').selectOption('removed');
    await page.locator('#ioc-type-filter').selectOption('package');
    await expect(page.locator('#ioc-export-csv')).toContainText(`"${removedPackage.value}"`);
    await expect(page.locator('#ioc-export-json')).toContainText(removedPackage.value);
  });

  test('empty state disables copy buttons and avoids stale export text', async ({ page }) => {
    await openIOCFeed(page);
    await page.locator('#ioc-search').fill('no-such-ioc-value-xyz');
    await expect(page.locator('.ioc-empty-state')).toBeVisible();
    await expect(page.locator('#ioc-export-defanged')).toHaveText('No matching IOCs');
    await expect(page.locator('.ioc-export-card button')).toHaveCount(4);
    for (const btn of await page.locator('.ioc-export-card button').all()) {
      await expect(btn).toBeDisabled();
    }
  });

  test('copy uses navigator.clipboard for non-empty export output', async ({ page }) => {
    await page.addInitScript(() => {
      const mockClipboard = {
        writeText: async text => {
          window.__copiedText = text;
        }
      };
      Object.defineProperty(Navigator.prototype, 'clipboard', {
        configurable: true,
        get: () => mockClipboard
      });
    });
    await openIOCFeed(page);
    await page.evaluate(() => {
      const mockClipboard = {
        writeText: async text => {
          window.__copiedText = text;
        }
      };
      Object.defineProperty(Navigator.prototype, 'clipboard', {
        configurable: true,
        get: () => mockClipboard
      });
    });
    await page.locator('#ioc-type-filter').selectOption('hash');
    const copyButton = page.locator('.ioc-export-card').filter({ hasText: 'SIEM Wildcard OR' }).locator('button');
    await copyButton.evaluate(btn => App.copyFeedById('ioc-export-siem', btn));
    await page.waitForFunction(() => Boolean(window.__copiedText));
    await expect(copyButton).toHaveText('Copied!');
    const copied = await page.evaluate(() => window.__copiedText);
    expect(copied).toContain(`"${activeHash.value}"`);
    expect(copied).not.toContain(`"*${activeHash.value}*"`);
  });
});

test.describe('IOC workbench table, pivots, and responsive design', () => {
  test('campaign links are created only for reliable post matches', async ({ page }) => {
    await openIOCFeed(page);

    await page.locator('#ioc-status-filter').selectOption('all');
    await page.locator('#ioc-campaign-filter').selectOption(unmatchedCampaign);
    await expect(page.locator('.ioc-table td[data-label="Campaign"] a')).toHaveCount(0);
    await expect(page.locator('.ioc-table td[data-label="Campaign"]').first()).toContainText(unmatchedCampaign);

    await page.locator('#ioc-clear-filters').click();
    await page.locator('#ioc-campaign-filter').selectOption(linkedCampaign);
    const link = page.locator('.ioc-table td[data-label="Campaign"] a').first();
    await expect(link).toHaveAttribute('href', new RegExp(`#post/${campaignMap.get(linkedCampaign)[0]}$`));
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#post/${campaignMap.get(linkedCampaign)[0]}`));
  });

  test('desktop and tablet avoid document-level horizontal overflow', async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 768, height: 1024 }]) {
      await page.setViewportSize(viewport);
      await openIOCFeed(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow).toBe(false);
    }
  });
});

test.describe('IOC workbench mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile renders controls and IOC rows without page overflow', async ({ page }) => {
    await openIOCFeed(page);
    await expect(page.locator('#ioc-search')).toBeVisible();
    await page.locator('#ioc-type-filter').selectOption('hash');
    await expect(page.locator('.ioc-table tbody tr').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
});

test.describe('IOC workbench visual captures', () => {
  test('captures desktop default, filtered, and empty states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openIOCFeed(page);
    await page.screenshot({ path: outputScreenshotPath('desktop-default.png'), fullPage: false });

    await page.locator('#ioc-type-filter').selectOption('hash');
    await page.screenshot({ path: outputScreenshotPath('desktop-filtered-hashes.png'), fullPage: false });

    await page.locator('#ioc-search').fill('no-such-ioc-value-xyz');
    await page.screenshot({ path: outputScreenshotPath('desktop-empty-state.png'), fullPage: false });
  });

  test('captures tablet default state', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openIOCFeed(page);
    await page.screenshot({ path: outputScreenshotPath('tablet-default.png'), fullPage: false });
  });

  test('captures mobile default and filtered states', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openIOCFeed(page);
    await page.screenshot({ path: outputScreenshotPath('mobile-default.png'), fullPage: false });

    await page.locator('#ioc-type-filter').selectOption('hash');
    await page.locator('.ioc-section-title').scrollIntoViewIfNeeded();
    await page.screenshot({ path: outputScreenshotPath('mobile-filtered-hashes.png'), fullPage: false });
  });
});
