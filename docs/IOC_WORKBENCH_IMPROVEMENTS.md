# IOC Workbench Improvements

Date: 2026-05-04

This note documents the IOC Feed enhancements added to the static site so the changes can be reviewed later without reverse engineering the implementation.

## Scope

The work was scoped to the existing IOC Feed page. It did not redesign the site and did not change the report feed, threat actor search, routing, existing IOC stat modal behavior, report posts, actor data, or IOC data schema.

Primary files changed or added:

- `js/app.js`
- `css/style.css`
- `tests/ioc-workbench.spec.js`
- `output/playwright/ioc-workbench-baseline/`
- `output/playwright/ioc-workbench-final/`

Documentation added:

- `docs/IOC_WORKBENCH_IMPROVEMENTS.md`

## Data Shape Used

The workbench reads the existing `data/iocs.json` structure:

```json
{
  "last_updated": "YYYY-MM-DD",
  "iocs": []
}
```

Each IOC record is expected to use the existing fields:

- `value`: raw IOC value used for raw exports, search, and defanging input.
- `type`: explicit IOC type. Current supported values include `package`, `domain`, `sha256`, `url_path`, `ip`, `sha1`, and `md5`.
- `status`: IOC status, currently `active` or `removed`.
- `campaign`: campaign slug.
- `source`: source or vendor label.
- `context`: analyst context string.
- `first_seen`: first observed date string.

No data files were changed and no schema migration was introduced.

## UI Added

The IOC Feed page now includes a compact IOC workbench below the existing IOC stat tiles.

Added controls:

- Search input for IOC value, type, status, campaign, source, context, and first seen.
- Type filter:
  - All Types
  - Domains
  - URLs
  - IPs
  - Hashes
  - Packages
- Status filter:
  - Active
  - Removed
  - All Statuses
- Campaign dropdown generated dynamically from `data/iocs.json`.
- Source dropdown generated dynamically from `data/iocs.json`.
- Sort dropdown:
  - Newest
  - Type
  - Campaign
  - Source
  - Value
- Clear button to reset the workbench to defaults.
- Result count line:
  - `Showing X of Y IOCs`

Default behavior was preserved for normal users:

- Status defaults to `active`.
- Type, campaign, and source default to `all`.
- Sort defaults to `newest`.
- Search defaults to empty.

## Results Table

A structured Matching Indicators table was added below the export cards.

Columns:

- Indicator
- Type
- Status
- First Seen
- Campaign
- Source
- Context

Indicator display uses defanged values for domains, URL paths, and IPs. Hashes and package names remain raw.

Campaign values link to reports only when there is a reliable match in `data/posts-index.json`:

1. First, exact `campaign === post.id`.
2. If no exact match, unique match after removing a leading `YYYY-MM-DD-` prefix from post IDs.
3. If neither rule produces a single reliable match, the campaign renders as plain text.

Responsive behavior:

- Desktop and tablet use an internal table scroll container if needed.
- Mobile uses stacked row/card-style table rendering.
- The implementation avoids document-level horizontal overflow.

## Export Behavior

The export cards now update from the current filtered visible IOC set.

Added/rewired export cards:

- Defanged Indicators
- SIEM Wildcard OR
- Comma-Separated Quoted
- JSON

Important export rules:

- Empty or null IOC values are excluded from all exports.
- Defanged export defangs domains, URLs, and IPs.
- Hashes and package names are not defanged.
- CSV and JSON exports use raw IOC values.
- SIEM output escapes backslashes and double quotes.
- SIEM output uses raw values.
- SIEM output wildcard behavior:
  - Domains, URLs, packages, and mixed/default result sets use wildcard wrapping: `"*value*"`.
  - IP-only filter output does not use wildcards: `"1.2.3.4"`.
  - Hash-only filter output does not use wildcards: `"hashvalue"`.

Empty-state behavior:

- If filters return no exportable IOCs, export cards show `No matching IOCs`.
- Copy buttons are disabled.
- Stale export text is not left visible.

## JavaScript Helpers Added

IOC-only helper logic was added in `js/app.js`.

Key helpers:

- `getIOCRecords()`
- `getIOCValue(ioc)`
- `getIOCTypeBucket(ioc)`
- `getIOCSearchBlob(ioc)`
- `sortIOCs(iocs)`
- `getFilteredIOCs()`
- `escapeExportValue(value)`
- `csvEscapeValue(value)`
- `getExportableIOCs(iocs)`
- `shouldWildcardSIEMExport()`
- `buildIOCExports(iocs, options)`
- `getCampaignPostId(campaign)`
- `getIOCDisplayValue(ioc)`
- `getIOCFilterOptions(field)`
- `renderSelectOptions(values, selected, labeler)`
- `resetIOCWorkbench()`
- `bindIOCWorkbenchControls(container)`
- `renderIOCExportCard(config)`
- `renderIOCCampaignCell(campaign)`
- `renderIOCTable(iocs)`

The IOC page render path remains `renderIOCFeed(container)`.

## CSS Added

IOC-specific styling was added in `css/style.css`.

Main style areas:

- IOC workbench control layout.
- Result count/status line.
- Export card grid behavior.
- IOC table and responsive table wrapper.
- Mobile stacked table rows.
- Disabled copy button state.
- Removed and unknown status styling.

The styles preserve the existing dark theme, spacing language, and typography.

## Tests Added

New Playwright coverage was added in:

- `tests/ioc-workbench.spec.js`

Covered behavior:

- Default filtered set contains active IOCs only.
- Removed IOCs are excluded by default.
- Type grouping uses explicit IOC types.
- Hash values are not defanged.
- Empty/null values are excluded from exports.
- SIEM export escapes quotes and backslashes.
- Search matches value, context, campaign, and source.
- Type filter works for domains, URLs, IPs, hashes, and packages.
- Status filter can show active, removed, and all statuses.
- Campaign and source dropdowns populate from actual IOC data.
- Clear resets filters to defaults.
- Sort changes row order without changing count.
- Domain SIEM export keeps wildcards.
- IP SIEM export removes wildcards.
- Hash SIEM export removes wildcards.
- Removed package filtering is represented in CSV and JSON exports.
- Empty state disables copy buttons and avoids stale export text.
- Clipboard behavior is tested with a mocked clipboard.
- Campaign links are created only for reliable post matches.
- Unmatched campaign values render as plain text.
- Desktop, tablet, and mobile avoid document-level horizontal overflow.
- Desktop, tablet, and mobile screenshots are captured.

## Screenshot Artifacts

Baseline screenshots:

- `output/playwright/ioc-workbench-baseline/desktop-ioc-feed.png`
- `output/playwright/ioc-workbench-baseline/tablet-ioc-feed.png`
- `output/playwright/ioc-workbench-baseline/mobile-ioc-feed.png`

Final screenshots:

- `output/playwright/ioc-workbench-final/desktop-default.png`
- `output/playwright/ioc-workbench-final/desktop-filtered-hashes.png`
- `output/playwright/ioc-workbench-final/desktop-empty-state.png`
- `output/playwright/ioc-workbench-final/tablet-default.png`
- `output/playwright/ioc-workbench-final/mobile-default.png`
- `output/playwright/ioc-workbench-final/mobile-filtered-hashes.png`

## Validation Performed

Commands used during implementation:

```bash
python3 -m http.server 8877
npx playwright test tests/ioc-workbench.spec.js --workers=1
npx playwright test
node --check js/app.js
node --check tests/ioc-workbench.spec.js
```

Observed result:

- Targeted IOC workbench test suite passed.
- JavaScript syntax checks passed.
- Full Playwright suite had one known pre-existing failure in `tests/scroll-smoothness.spec.js` for the back-to-top scroll assertion. The same failure existed before the IOC workbench changes.

Data integrity check:

```bash
git diff -- data posts
```

No changes were made to `data/` or `posts/` by the IOC Workbench implementation.

## Compatibility With Daily IOC Ingestion

The IOC Workbench is compatible with the current daily collection flow because it reads the existing `data/iocs.json` fields produced by `scripts/collect.py`.

Current ingestion path:

- `.github/workflows/collect.yml` runs `python scripts/collect.py`.
- `scripts/collect.py` adds new IOC entries to `data/iocs.json`.
- New IOC entries use the fields consumed by the workbench:
  - `value`
  - `type`
  - `context`
  - `first_seen`
  - `source`
  - `campaign`
  - `status`

New IOCs added by the daily process should automatically appear in:

- Search results.
- Type/status/campaign/source filters.
- Dynamic export cards.
- Matching Indicators table.
- Campaign pivots, when the campaign slug reliably maps to a post ID.

No changes are required to the daily report creation or IOC ingestion flow for the workbench to consume new entries.

## Known Follow-Up Candidates

These are optional future improvements and were not required for the current implementation:

- Update `automation/claude-code-task.md` to explicitly list `package` and `sha1` as supported IOC types.
- Teach `scripts/collect.py` to mark disrupted or removed package indicators as `removed` when the source data supports that status.
- Align report-body Splunk/SIEM blocks with the IOC Workbench export behavior if report posts should use the same exact/wildcard logic.
