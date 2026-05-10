# Brief and Trends Dashboard Implementation

Date: 2026-05-10

This note documents the `Brief` and `Trends` pages added to the static LLM ThreatIntel site so the implementation can be reviewed later without reverse engineering the code.

## Scope

The work added two read-only dashboard routes:

- `#brief`: concise leadership-level view.
- `#trends`: analyst-oriented trends dashboard.

The implementation did not change the data schema, collection flow, report generation flow, IOC ingestion flow, or external dependencies. Both pages compute their views in the browser from the existing loaded JSON data.

Primary files changed or added:

- `index.html`
- `js/app.js`
- `css/style.css`
- `tests/trends-dashboard.spec.js`
- `tests/executive-brief.spec.js`

Documentation added:

- `docs/BRIEF_AND_TRENDS_DASHBOARDS.md`

## Navigation and Routes

Navigation entries were added in `index.html`:

- `Brief`
- `Trends`

Route handling lives in `js/app.js`.

Routes:

- `#brief` renders `renderBrief(container)`.
- `#trends` renders `renderTrends(container)`.

Route metadata:

- Brief title: `Executive Brief | LLM ThreatIntel`
- Brief description: `Concise executive-level briefing generated from the current LLM ThreatIntel reports, threat actors, and IOCs.`
- Trends title: `Trends Dashboard | LLM ThreatIntel`
- Trends description: `Current trends across LLM ThreatIntel reports, threat actors, and IOCs, with analyst pivots into reports, actors, and indicators.`

## Data Sources

Both pages use the existing in-memory app data:

- Reports: `data/posts-index.json`, loaded into `App.postsIndex`
- Actors: `data/actors.json`, loaded into `App.actorsData`
- IOCs: `data/iocs.json`, loaded into `App.iocsData`

No data file schema was changed.

## Refresh Cadence

The pages do not have a separate refresh job. They update when the underlying data files update and the site is rebuilt or reloaded.

In practice:

1. The daily/manual collection flow updates reports, actors, and IOCs.
2. `scripts/build_meta.py` regenerates generated post HTML, RSS, and sitemap artifacts when report metadata changes.
3. The static site deploy publishes the changed files.
4. On page load, the app reads the current JSON files and computes Brief and Trends metrics from that data.

If a new report is added to `data/posts-index.json`, the Brief and Trends pages include it automatically. If new IOCs or actors are added to `data/iocs.json` or `data/actors.json`, the exact IOC and actor metrics update automatically.

## Trends Dashboard

Route: `#trends`

Page title:

- `// Trends Dashboard`

Purpose:

- Give analysts a situational-awareness dashboard across the tracked report, actor, and IOC data.
- Provide clickable pivots into existing Intel Feed, IOC Feed, and Threat Actors views.
- Show exact metrics separately from derived keyword-based metrics.

### Trends Sections

Top stat cards:

- Total Reports
- Active IOCs
- Total IOCs
- Active Actors

These cards are clickable:

- Total Reports opens Intel Feed.
- Active IOCs opens IOC Feed with active IOCs.
- Total IOCs opens IOC Feed with all IOC statuses.
- Active Actors opens Threat Actors.

Reports:

- Reports by Tag
- Reports by Month
- Report time-window selector:
  - Latest Month
  - Last 6 Months
  - All Time

The time-window tiles update the report-derived charts only. IOC and actor exact metrics remain dataset-wide.

IOCs:

- IOC Type Mix
- IOC Status Mix
- Top IOC Sources

Threat Actors:

- Actor Type Mix
- Actor Status Mix

Most Mentioned Actors:

- Keyword-based actor mentions across report metadata and campaign-linked IOC context.
- Counts at most one mention per report per actor.
- Uses actor names and aliases from `data/actors.json`.
- Excludes generic labels such as unknown actors and research-community placeholders.

Derived Intelligence Themes:

- Top Affected Platforms
- Attack Themes

These are explicitly labelled as directional keyword-based pivots, not definitive attribution.

### Trends Helper Layer

Key helpers in `js/app.js`:

- `normalizeTrendText(value)`
- `countBy(items, keyFn)`
- `sortCounts(counts, options)`
- `getCampaignSlugFromPost(post)`
- `getPostCampaignLookup()`
- `getPostTrendBlob(post)`
- `trendTermMatches(blob, term)`
- `getTrendKeywordMaps()`
- `getTrendRepresentativeSearch(kind, label)`
- `getTrendPostBlobs(posts, iocs)`
- `countKeywordMap(postBlobs, keywordMap)`
- `isGenericActorTrendName(name)`
- `getActorMentionCounts(posts, actors, iocs)`
- `getReportWindowContext(posts)`
- `getTrendWindowDescription(data)`
- `getTrendsData()`
- `renderTrendStatCards(data)`
- `renderTrendReportWindows(data)`
- `renderTrendBarList(config)`
- `setTrendReportWindow(windowKey)`
- `openTrendStatPivot(key)`
- `openTrendPivot(type, value)`
- `renderTrends(container)`

### Trends Keyword Maps

Platform map:

- `npm`
- `PyPI`
- `GitHub`
- `VS Code / Open VSX`
- `MCP`
- `Kubernetes`
- `Cloud AI APIs`
- `AI Coding Assistants`
- `Browser Extensions`

Attack theme map:

- `Supply Chain`
- `Credential Theft / LLMjacking`
- `Prompt Injection`
- `MCP / Agent Abuse`
- `RCE / Exploitation`
- `Malware / Backdoor`
- `Nation-State / APT`
- `Phishing / Social Engineering`

Counting rule:

- Keyword-derived counts are one count per matching report, not one count per keyword occurrence.

### Trends Pivots

Supported pivots:

- Report tag opens `#home` with the matching Intel Feed tag selected.
- Report month opens `#home` with feed search set to the month.
- Platform opens `#home` with a representative search term.
- Theme opens `#home` with a representative search term.
- IOC type opens `#ioc-feed` with the matching IOC type filter.
- IOC source opens `#ioc-feed` with the matching source filter.
- IOC status opens `#ioc-feed` with the matching status filter.
- Actor mention opens `#actors` with actor search populated.

If the destination route is already active, the implementation re-renders the current route instead of relying on a hash-change event.

## Executive Brief

Route: `#brief`

Page title:

- `// Executive Brief`

Purpose:

- Provide a concise leadership-level summary of current GenAI and LLM threat activity across tracked reporting.
- Keep the page shorter and less detailed than Trends.
- Surface one main theme chart, a posture indicator, key stats, short signal cards, and action pivots.

### Brief Sections

Header:

- Page title
- Subtitle
- Window label: `Window: Last 30 days`
- Updated date

Methodology note:

- States that the page is generated from current LLM ThreatIntel reporting.
- States that derived themes are keyword-based and directional.
- States that it is not definitive attribution or organization-specific risk scoring.

Executive Summary:

- Deterministic text generated from current data.
- No external LLM or API call.
- Uses cautious language and avoids global threat-landscape claims.

Current Threat Posture:

- Displays one of:
  - `Elevated`
  - `Active`
  - `Watch`
  - `Stable`
- Shows the leading recent theme in the same posture card.
- Includes a caveat that this is a tracking-data posture indicator, not an enterprise risk rating.

Compact stat cards:

- Reports, Last 30 Days
- Total Reports
- Active IOCs
- Active Actors

Main chart:

- `Threat Theme Mix, Last 30 Days`
- Native HTML/CSS bars
- Same visual language as Trends

Recent Signals:

- Most Active Theme
- Top IOC Type
- Top IOC Sources

Top IOC Sources intentionally shows a top-three mix instead of presenting one source as a single headline source.

What This Means:

- Leadership
- SOC / Threat Hunting
- Engineering

Recommended Focus:

- Credential Exposure
- Agent Permissions
- Supply Chain Indicators

Analyst Pivots:

- Open Trends
- Open Intel Feed
- Open IOC Feed
- Open Threat Actors

### Brief Helper Layer

Key helpers in `js/app.js`:

- `getBriefThemeKeywords()`
- `getRecentPosts(days)`
- `getBriefThemeMix(posts)`
- `getLatestDateLabel(...values)`
- `getBriefThemeSearchTerm(theme)`
- `getBriefPosture(data)`
- `getBriefData()`
- `generateExecutiveSummary(data)`
- `generateRecommendedFocus()`
- `renderBriefStatTiles(data)`
- `renderBriefThemeChart(data)`
- `getBriefThemeSignal(theme)`
- `renderBriefSignalCards(data)`
- `renderBriefActionCards(data)`
- `renderBriefPivotActions()`
- `openBriefStatPivot(key)`
- `openBriefPivot(type, value)`
- `renderBrief(container)`

### Brief Theme Map

The Brief page uses a smaller leadership-level theme map:

- `Supply Chain`
- `Credential Theft / LLMjacking`
- `MCP / Agent Abuse`
- `Prompt Injection`
- `AI Coding Tools`
- `Nation-State / APT`
- `Phishing / Social Engineering`

Counting rule:

- Count once per report per theme.
- Use reports from the last 30 days based on the latest report date.
- If fewer than two recent reports exist, fall back to all tracked reports and label that fallback in the chart description.

### Brief Posture Logic

Posture is calculated conservatively:

- `Elevated`: recent reports >= 5 and active IOCs >= 20
- `Active`: recent reports >= 2 or active IOCs >= 10
- `Watch`: active actors or active IOCs exist but recent report volume is low
- `Stable`: otherwise

The posture is not an enterprise risk score.

### Brief Pivots

Supported pivots:

- Recent Reports card opens Intel Feed.
- Total Reports card opens Intel Feed.
- Active IOCs card opens IOC Feed with active IOCs.
- Active Actors card opens Threat Actors.
- Theme chart bars open Intel Feed with a representative search term.
- Open Trends opens `#trends`.
- Open Intel Feed opens `#home`.
- Open IOC Feed opens `#ioc-feed`.
- Open Threat Actors opens `#actors`.

Destination state is reset intentionally so pivots do not inherit stale filters.

## Styling

Page-specific CSS was added in `css/style.css`.

Main class families:

- `.trends-*`
- `.trend-*`
- `.brief-*`

Design decisions:

- Reuse the existing dark theme.
- Reuse existing stat-card and card language.
- Use native HTML/CSS bar charts.
- Avoid external chart libraries.
- Avoid tables on the Brief page.
- Keep the Trends page analytical and the Brief page concise.
- Avoid document-level horizontal overflow on desktop, tablet, and mobile.

## Tests

Trend tests:

- `tests/trends-dashboard.spec.js`

Brief tests:

- `tests/executive-brief.spec.js`

Coverage includes:

- Route rendering.
- Active nav state.
- Exact report, IOC, and actor metric checks against source JSON.
- Keyword-derived sections rendering safely.
- Methodology notes.
- Pivot behavior.
- Keyboard reachability for clickable chart rows.
- Console-error checks.
- Desktop, tablet, and mobile horizontal-overflow checks.
- Screenshot capture into `output/playwright/...`.
- Regression smoke coverage for existing routes and features.

Related existing regression coverage remains in:

- `tests/intel-feed-search.spec.js`
- `tests/ioc-workbench.spec.js`
- `tests/mobile-search-ui.spec.js`
- `tests/scroll-smoothness.spec.js`

## Verification Commands

Commands used during implementation and regression:

```bash
python3 -m http.server 8877
npx playwright test tests/trends-dashboard.spec.js --workers=1
npx playwright test tests/executive-brief.spec.js --workers=1
npx playwright test
```

The latest full suite result at the time this document was added was:

- `100 passed`

## Guardrails Preserved

The implementation preserves these constraints:

- No changes to `data/posts-index.json` schema.
- No changes to `data/actors.json` schema.
- No changes to `data/iocs.json` schema.
- No changes to report generation logic.
- No changes to IOC ingestion logic.
- No external charting libraries.
- No CDN scripts.
- No frontend framework migration.
- No backend requirement.
- Existing Intel Feed search remains the source of report pivots.
- Existing IOC Workbench state remains the source of IOC pivots.
- Existing Threat Actors search remains the source of actor pivots.

## Known Limitations

- Derived theme metrics are keyword-based and directional.
- Actor mention counts depend on actor names and aliases present in `data/actors.json`.
- Brief summary text is deterministic template text, not a generated natural-language analysis from an external model.
- The update timestamp uses the latest available date from report, IOC, or actor data; it is not an independent build timestamp.
- Charts are intentionally simple native HTML/CSS bars, not interactive chart-library visualizations.
