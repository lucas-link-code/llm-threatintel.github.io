# LLM ThreatIntel — Manual post update procedure

This document is the canonical checklist for adding or changing content that appears on the LLM ThreatIntel static site. It reflects the actual behavior of `js/app.js`, `scripts/build_meta.py`, `scripts/collect.py`, and `.github/workflows/deploy.yml`.

There are two separate content paths. Follow the section that matches what you are publishing.

---

## 1. Two kinds of posts

**Intel Feed reports** — Automated-style threat intelligence reports. They appear on the home Intel Feed, use `data/posts-index.json`, and are included in static HTML generation, `sitemap.xml`, and `rss.xml`.

**Blog posts** — Commentary and research notes. They appear only under the Blog tab, use `data/blog-index.json`, and load Markdown through the single-page app. The build script `scripts/build_meta.py` does **not** read `blog-index.json`; sitemap and RSS are built **only** from `posts-index.json`. Blog entries are therefore not added to `sitemap.xml` or `rss.xml` by the current pipeline unless you change that script.

---

## 2. Intel Feed report — full procedure

### 2.1 Deduplication

Before writing anything new:

- Read `data/posts-index.json` and list filenames in `posts/`.
- Do not reuse an existing `id` or the same `YYYY-MM-DD-{slug}` base name.
- If the campaign was already covered, add a new post only when there is a material update; otherwise extend or supersede per editorial rules.

### 2.2 Create the Markdown file

- Path: `posts/YYYY-MM-DD-{slug}.md`
- The `{slug}` is URL-safe: lowercase, hyphens, no spaces. The stem must match the `id` in the index (see below).
- Structure and quality expectations match `automation/claude-code-task.md`: executive summary, campaign summary table, detailed findings with named sources and URLs, MITRE ATT&CK table, IOC sections, detection recommendations, references. Do not invent IOCs; if sources publish none, say so.
- **Tags in the Markdown body** must align with the index. The site uses a fixed tag set for Intel Feed styling and automation. Valid slugs are exactly: `supply-chain`, `malicious-tool`, `nation-state`, `shadow-ai`, `llmjacking`, `malware`, `apt`. Use these in `**Tags:**` and in `data/posts-index.json` (see `scripts/collect.py` `VALID_TAGS`).

Example front matter style used in repo:

```markdown
# Title

**Date:** YYYY-MM-DD
**Tags:** malware, supply-chain
```

Optional: `**TLP:** TLP:CLEAR` in the body if you mirror existing posts.

### 2.3 Add metadata to `data/posts-index.json`

- Open `data/posts-index.json`. The root object has a `posts` array.
- Insert a **new object at the beginning** of `posts` so the newest report sorts first in the feed.
- Required fields used by the app and `build_meta.py`:

| Field     | Purpose |
|----------|---------|
| `id`     | Must equal `YYYY-MM-DD-{slug}` and match the Markdown filename without `.md`. |
| `title`  | Display title. |
| `date`   | ISO date `YYYY-MM-DD`. |
| `author` | Typically `LLM ThreatIntel` for intel reports. |
| `tags`   | Array of allowed slugs only. |
| `tlp`    | e.g. `TLP:CLEAR`. |
| `excerpt`| Short plain-text summary for cards, Open Graph, and RSS description. |
| `file`   | Filename only, e.g. `2026-04-13-example-slug.md`. |

- Validate JSON after editing, for example: `python3 -m json.tool data/posts-index.json > /dev/null`

### 2.4 Update `data/actors.json` when applicable

- For each named threat actor, malware family, or campaign entity that should appear in the Threat Actors section, merge or add entries. Match existing names or aliases before inserting duplicates.
- Preserve and merge existing fields; update `last_updated` when the schema requires it.

### 2.5 Update `data/iocs.json` when applicable

- Every IOC that appears in the Intel report body should exist in `iocs.json` with consistent `value`, `type` (`domain`, `url_path`, `sha256`, `md5`, `ip`, etc.), `context`, `first_seen`, `source`, `campaign`, and `status` as used elsewhere in the file.
- Skip duplicates by matching on `value`.
- Raw values in JSON are not defanged; Markdown display may use defanged form per site conventions.
- Update `last_updated` when required by the file schema.

### 2.6 Generate static HTML, sitemap, and RSS

From the repository root:

```bash
python3 scripts/build_meta.py
```

This script:

- Reads `data/posts-index.json` only (not `blog-index.json`).
- For each post, reads `posts/{file}` Markdown, renders HTML, and writes `posts/{same-stem}.html` with full document markup: title, meta description, canonical URL, Open Graph and Twitter tags, JSON-LD `BlogPosting`, site header, and article body.
- Writes root `sitemap.xml` and `rss.xml` (RSS includes up to 20 newest intel posts by date sort inside the script).

Site URL for absolute links comes from `CNAME` if present, else defaults in `build_meta.py`.

**Optional per-post Open Graph image:** place `assets/og/{slug}.png` (or `.jpg`, `.jpeg`, `.webp`). If present, `build_meta.py` uses it; otherwise it uses the default homepage OG image.

If a Markdown file listed in `posts-index.json` is missing, the script prints a warning and skips that HTML file.

### 2.7 How the live site uses these files

- **Intel Feed and in-app report view:** `js/app.js` loads `posts/{file}` as **Markdown** and renders it in the SPA. The parallel `.html` file is not fetched for the main reader path.
- **Meta URLs for sharing:** route meta uses the `.html` URL pattern: same stem as the Markdown file with `.html` extension (`postMeta.file.replace(/\.md$/i, '.html')`).
- **Crawlers and direct links:** `/posts/{slug}.html` serves the static page produced by `build_meta.py`.

### 2.8 Pre-commit checklist

1. Every factual claim in the report ties to a named source with a URL in References.
2. IOCs in the body are reflected in `data/iocs.json` where applicable; no fabricated indicators.
3. MITRE technique IDs are valid (`T####` or `T####.###`).
4. `id`, filename stem, and `posts-index.json` `file` field are consistent.
5. Tags are only from the allowed slug set.
6. `data/posts-index.json` is valid JSON.
7. `python3 scripts/build_meta.py` completed without unexpected errors; new `posts/*.html`, `sitemap.xml`, and `rss.xml` are updated.

### 2.9 Git and deployment

```bash
git add -A
git status   # confirm posts/*.md, posts/*.html, data/*.json, sitemap.xml, rss.xml as intended
git commit -m "intel: YYYY-MM-DD — short summary"
git push -u origin main
```

`.github/workflows/deploy.yml` runs `python scripts/build_meta.py` again on the server before upload, so deploy regenerates the same artifacts. Committing the generated files keeps the repository consistent with what ships and avoids confusion in local diffs.

---

## 3. Blog post — procedure

Use this for the Blog tab only, not for Intel Feed reports.

### 3.1 Create or edit Markdown

- Store files under `posts/` with a clear name, e.g. `YYYY-MM-DD-{slug}.md`.
- Metadata for the Blog UI comes from `data/blog-index.json`, not only from the Markdown header.

### 3.2 Update `data/blog-index.json`

- Add or edit an object in the `posts` array. Fields used by `js/app.js` include: `id`, `title`, `date`, `author`, `category`, `tags`, `excerpt`, `file` (Markdown filename under `posts/`), `readTime`.
- `id` is used in the hash route `blog/{id}`; keep it unique and stable.
- Ordering in the array controls display order; newest-first is conventional.

### 3.3 Footer handling

`renderBlogPost` in `js/app.js` strips a trailing `---` section followed by certain headings via `stripBlogPostFooterMarkdown`. Follow patterns in existing blog Markdown if you use that footer pattern.

### 3.4 Static HTML and feeds for Blog-only posts

`scripts/build_meta.py` does **not** consume `blog-index.json`. Blog-only posts do not automatically get `posts/{slug}.html` from this script unless you add custom automation or extend the script. If you need static URLs or sitemap entries for a blog article, you must either extend `build_meta.py` or maintain static pages manually. This is an intentional gap to document for operators.

### 3.5 Validate and ship

- Validate `data/blog-index.json`: `python3 -m json.tool data/blog-index.json > /dev/null`
- Commit Markdown and `blog-index.json`, push to `main`; deploy runs as above.

---

## 4. Editing an existing post

- Edit the `posts/*.md` file.
- If title, date, excerpt, or tags change, update the corresponding entry in `data/posts-index.json` or `data/blog-index.json`.
- If IOC or actor content changed, sync `data/iocs.json` and `data/actors.json`.
- For Intel posts, rerun `python3 scripts/build_meta.py` and commit changed `posts/*.html`, `sitemap.xml`, and `rss.xml` if applicable.

---

## 5. Parity with automated collection

`scripts/collect.py`, after writing new intel posts and JSON updates, runs `scripts/build_meta.py` in a subprocess when any new post was created. Manual work should follow the same order: Markdown and JSON first, then `build_meta.py`, then commit.

---

## 6. Quick reference — files touched by Intel report

| Action | Files |
|--------|--------|
| New Intel report | `posts/YYYY-MM-DD-{slug}.md`, `data/posts-index.json`, often `data/actors.json`, `data/iocs.json`, then run `scripts/build_meta.py` → `posts/YYYY-MM-DD-{slug}.html`, `sitemap.xml`, `rss.xml` |
| New Blog article | `posts/....md`, `data/blog-index.json` |
| Deploy | Push to `main`; workflow runs `scripts/build_meta.py` and deploys GitHub Pages |

---

## 7. Authoritative references in repo

- Full Intel Markdown template and quality gates: `automation/claude-code-task.md`
- Cowork-oriented summary: `automation/cowork-workflow.md`
- Static page generation implementation: `scripts/build_meta.py`
- SPA routing and Markdown fetch paths: `js/app.js`
- Deploy step order: `.github/workflows/deploy.yml`

End of procedure.
