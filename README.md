# LLM ThreatIntel

Defensive GenAI and LLM threat intelligence site. Live at [llm-threatintel.com](https://llm-threatintel.com). Repository: [lucas-link-code/llm-threatintel.github.io](https://github.com/lucas-link-code/llm-threatintel.github.io). Owner: Lucas.

This README is the onboarding brief for a new agent thread. Read it before editing. Canonical detail lives in the files listed under [Canonical documents](#canonical-documents). Do not invent a parallel process.

## Start here in a new thread

1. You are on a production GitHub Pages site. Push to `main` deploys.
2. Identify the task: intel collection, one intel report, a Blog-tab post, UI or dashboard work, or validator or workflow changes. Those are different pipelines.
3. Pull current `origin/main` before writing intel or data files. Scheduled collection often lands posts while a local session is open.
4. Use `python3` locally. GitHub Actions uses `python`.
5. After intel or data edits, run the validator. Treat review-required as a stop, not a warning you can ignore.
6. Stage explicitly. Do not `git add -A` if leftover dirs such as `quality-artifacts/` are sitting untracked.
7. Commit only when Lucas asked, or when the daily collection spec requires commit after a passing gate.

If the user says "run collection" or "process intel", execute `automation/claude-code-task.md`. If the user says "add a Blog post", use Blog-tab voice and `data/blog-index.json`, not the Intel Feed template.

## What this site is

Static HTML, CSS, and JavaScript. No frontend build step. No framework. GitHub Pages hosts the root of `main`. Cloudflare sits in front of the custom domain.

Tabs, all hash routes in `index.html` and `js/app.js`:

| Tab | Route | Data |
|-----|--------|------|
| Intel Feed | `#home` | `data/posts-index.json` plus `posts/*.md` |
| Brief | `#brief` | Computed in the browser from posts, actors, IOCs |
| Trends | `#trends` | Same in-browser computation |
| Threat Actors | `#actors` | `data/actors.json` |
| IOC Feed | `#ioc-feed` | `data/iocs.json` |
| Blog | `#blog` | `data/blog-index.json` plus Markdown |
| About | `#about` | Static copy in the app |

Intel Feed reports are the operational product. Brief and Trends are derived views. They update when the JSON files update. They have no separate collection job.

## Hard rules

These are the mistakes that damage the feed or break deploy.

- Do not fabricate IOCs. If the source published none, write that in the post and do not invent domains, hashes, packages, or IPs.
- Do not add bare shared infrastructure or legitimate AI vendor platforms as IOCs. `github.com`, `npmjs.com`, `claude.ai`, `grok.com`, `huggingface.co`, `openrouter.ai`, `openrouter.com`, and similar hosts are deny-listed. Attacker-controlled subdomains and specific malicious paths can still be valid. Policy: `validation/policy.json`.
- Do not treat a legitimate product name as a package IOC. `npm:mastra@affected` is wrong. A pinned malicious package such as `npm:easy-day-js@1.11.22` is right.
- Do not invent Intel Feed tags. The only valid slugs are: `supply-chain`, `malware`, `malicious-tool`, `nation-state`, `shadow-ai`, `llmjacking`, `apt`, `phishing`, `model-poisoning`, `prompt-injection`, `mcp-security`. Title Case or a new tag splits the filter bar.
- Do not delete reports or IOCs to make validation pass. Fix the source, add an alternate live URL, ask Lucas for an override, or wait for approval to remove.
- Do not paste exploit PoCs, full malicious MCP server code, or operational jailbreak payloads into the feed. Describe behaviour. Point to the research repo in References.
- Do not mix Intel Feed format with Blog-tab voice. Intel posts are internal-note threat reports. Blog posts are commentary.
- Do not skip `scripts/build_meta.py` after Intel Feed Markdown or `posts-index.json` changes. It writes parallel `.html`, `sitemap.xml`, `rss.xml`, and `data/search-index.json`.
- Do not assume local `main` is current. Rebase or pull before merging intel into indexes.
- Do not force-push `main`. Do not skip hooks unless Lucas asked.
- Do not rewrite `scripts/validate_site.py`, `.github/workflows/*`, or `validation/policy.json` unless that is the task. UI and intel work should not "fix" the gate.

## Two publication modes

This split is the highest-risk workflow detail.

| Who | Mode | Meaning |
|-----|------|---------|
| Local Cursor, Claude Code, Cowork, or any interactive agent | Gate-first | Validation failure or review-required: stop. Do not commit. Do not push. Do not delete content to clear the gate. |
| `.github/workflows/collect.yml` | Report-only | Collection still runs the full validator, then commits the validation report and may publish even when findings exist, so Lucas can review later. |

Report-only is scheduled automation only. It does not apply to a local agent run unless Lucas explicitly says so for that run.

`validate.yml` is separate. It runs `--mode strict --no-network` on push and pull request. It can fail CI even when collection used report-only.

## Git and deploy

- Default branch: `main`.
- Push to `main` triggers `.github/workflows/deploy.yml`. That job runs `scripts/build_meta.py` again, then uploads the repo root to GitHub Pages.
- A feature-branch push does not deploy. If the change is large, risky, or unreviewed, say so up front, use a branch and pull request, and wait for Lucas. Do not silently switch a session from `main` to a branch.
- Routine intel that Lucas asked for, and that passed the local gate, commits and pushes to `main`.
- Commit style for intel: `intel: YYYY-MM-DD — short summary of key findings`.
- Pull `origin/main` before writing posts-index, actors, or IOCs. If you already wrote files, stash only the new Markdown, pull, then re-insert into the updated JSON. Do not restore stale copies of `data/posts-index.json`.
- Parked work on other branches is not this site's live process. Do not mix it into an intel run.

## Content model

### Intel Feed report

Source of truth for procedure: `docs/POST_UPDATE_SKILL.md` and `automation/claude-code-task.md`.

Files for one new report:

- `posts/YYYY-MM-DD-slug.md`
- matching `posts/YYYY-MM-DD-slug.html` from `build_meta.py`
- new object at the start of `data/posts-index.json`
- merge or add in `data/actors.json` when an actor or family is named
- add in `data/iocs.json` only for indicators the source actually published
- regenerated `sitemap.xml`, `rss.xml`, `data/search-index.json`

`id`, filename stem, and `file` must match. `excerpt` must match the Executive Summary. IOC `campaign` should be the full post `id` so evidence hashing ties IOCs to the report.

The live reader loads Markdown through the SPA. The `.html` file is for crawlers, sharing, sitemap, and RSS. Deploy regenerates HTML, but commit the generated files anyway so local diffs match what shipped.

### Blog tab

- Index: `data/blog-index.json`.
- `build_meta.py` does not read the blog index. Blog-only posts are not added to sitemap or RSS unless you change that script.
- Do not put Blog commentary on the Intel Feed.

### Brief and Trends

Client-side dashboards. Implementation note: `docs/BRIEF_AND_TRENDS_DASHBOARDS.md`. Do not add a second data schema for them. Fix the underlying posts, actors, or IOCs.

## Daily intelligence collection

Canonical prompt: `automation/claude-code-task.md`. Follow it. Do not improvise a shorter search.

Practical sequence that matches this repo:

1. `git pull origin main` and list recent `posts/` plus the top of `data/posts-index.json`.
2. Search in three phases as specified. Dedup against existing posts, actors, and IOCs. Skip recaps and items already in the feed unless there is a material update. Default window is 14 days.
3. Write only new findings. One Markdown file per finding. Valid tags only.
4. Update indexes and data files. Run `python3 scripts/build_meta.py`.
5. Run:

```bash
python3 scripts/validate_site.py --mode full --changed-only-evidence --write-report --update-validation-state
```

6. If the overall result is pass and review-required is 0 for the new work, commit and `git push origin main`.
7. If validation fails or returns review-required, stop. Print `validation-reports/latest-validation-report.md`. Ask Lucas: confirm sources, add a manual evidence override, rewrite supported claims, keep for review, or remove only with approval.

Scheduled GitHub collection: `.github/workflows/collect.yml`, cron `0 3 * * *` (03:00 UTC), runs `scripts/collect.py`. Local Claude cron in the task file is a different schedule. Do not "correct" one to match the other unless that is the task.

If nothing new is found, do not create empty posts. Log that and exit.

## IOC rules, short form

Full deny lists and examples: `automation/claude-code-task.md` and `validation/policy.json`.

- JSON values are raw, never defanged. Markdown bodies defang for display, last dot only, such as `kriminal[.]ai`.
- Types: `domain`, `url_path`, `ip`, `sha256`, `sha1`, `md5`, `hash`, `package`.
- Package values need a registry prefix and a real name, optionally a pinned version: `npm:easy-day-js@1.11.22`. No `affected`, no version ranges, no aggregate counts in the value field.
- IP C2 belongs in type `ip`. A host:port/path on a raw IP is not a valid `url_path` because url_path requires a domain.
- CVE IDs, malware family names, and research article URLs are not IOC values.
- Every IOC in the post body must exist in `data/iocs.json`. Every named actor should exist in `data/actors.json`.
- Actor `type` values used by collection: `malicious_llm_tool`, `malware`, `threat_group`, `supply_chain_campaign`, `nation_state_campaign`. Match on name or alias and merge. Do not duplicate.

## Validation gate

Script: `scripts/validate_site.py`. Policy: `validation/policy.json`. State: `validation/validated-reports.json`. Overrides: `validation/manual-evidence-overrides.json`. Explainer: `automation/VALIDATION.md`.

Run after intel or data edits:

```bash
python3 scripts/validate_site.py --mode full --changed-only-evidence --write-report --update-validation-state
```

`--changed-only-evidence` still runs structural checks across the repo. It only skips expensive URL fetches for reports whose content hash is unchanged.

Evidence checks HEAD then GET with User-Agent `LLM-ThreatIntel-Validator/1.0 (+https://llm-threatintel.com)`. Investor-relations and some vendor sites time out. A timeout with no other live source is `evidence-source-review-required`. Fix by replacing the dead URL with a page that returns HTTP 200, and keep every remaining listed URL reachable. One surviving URL plus one timing-out URL still creates a review finding.

Overrides can clear evidence review. They do not clear bad JSON, illegal tags, or deny-listed IOCs. Do not add an override unless Lucas approved it.

The validator is read-only for intelligence content. It never deletes posts or IOCs.

## Site architecture

```
index.html                 App shell and nav
css/style.css              Theme and layout
js/app.js                  Hash routing, Markdown render, IOC defang, Brief, Trends, search
js/neural-bg.js            Background canvas
data/posts-index.json      Intel Feed metadata
data/blog-index.json       Blog tab metadata
data/actors.json           Actor tracker
data/iocs.json             IOC database
data/search-index.json     Generated search corpus
posts/*.md                 Intel and blog Markdown
posts/*.html               Generated Intel static pages
scripts/collect.py         GitHub Actions collection
scripts/build_meta.py      HTML, sitemap, RSS, search index
scripts/validate_site.py   Quality gate
validation/                Policy, state, overrides
validation-reports/        Latest and historical validator output
tests/                     Playwright and pytest
```

`data/search-index.json` is generated. Edit Markdown and indexes, then rebuild. Do not hand-edit it as the source of truth.

## Tests

After UI, routing, search, IOC workbench, Brief, or Trends changes:

```bash
npx playwright test
```

Playwright config: `playwright.config.cjs`, base URL `http://127.0.0.1:8877`. Specs live in `tests/*.spec.js`.

Collection and validator unit tests:

```bash
python3 -m pytest tests/test_collect.py tests/test_validate_site.py
```

Keep blast radius small on an existing feature. Additive changes. Do not rewrite unrelated functions. Smoke-test the tab you touched.

## Canonical documents

Read the file that matches the work. This README does not replace them.

| Work | Read |
|------|------|
| Daily intel collection | `automation/claude-code-task.md` |
| Manual Intel Feed or Blog publish steps | `docs/POST_UPDATE_SKILL.md` |
| Validator behaviour and agent git rules | `automation/VALIDATION.md` |
| IOC and platform deny lists | `validation/policy.json` |
| Brief and Trends behaviour | `docs/BRIEF_AND_TRENDS_DASHBOARDS.md` |
| Cowork-oriented collection notes | `automation/cowork-workflow.md` |

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Hash routes work. Clipboard copy prefers HTTPS; local HTTP has a fallback.

## Files you will usually edit

Intel: `posts/*.md`, `data/posts-index.json`, `data/actors.json`, `data/iocs.json`, then generated HTML, sitemap, RSS, search index.

Blog: `posts/*.md`, `data/blog-index.json`.

UI: `index.html`, `js/app.js`, `css/style.css`, plus the matching Playwright spec.

Collection prompt: `automation/claude-code-task.md` only when the task is to change collection behaviour.

## Files to treat as high risk

- `.github/workflows/deploy.yml`, `collect.yml`, `validate.yml`
- `scripts/validate_site.py`, `validation/policy.json`
- `js/neural-bg.js` unless the task is that animation
- `CNAME`

UI theme work may edit `css/style.css`. Run the visual and interaction tests afterwards.

## Operator facts

- Domain: `llm-threatintel.com` via Cloudflare. `CNAME` file contains that hostname.
- GitHub Pages source: GitHub Actions, not branch deploy.
- Secret for scheduled collection: `ANTHROPIC_API_KEY`.
- Actions needs read and write for collection commits.

This repository is already live. Do not re-init git or create a second GitHub repo unless Lucas is forking the project.

## Troubleshooting

**Blank page or hung feed.** Check the browser console. Invalid JSON in `data/posts-index.json`, `data/actors.json`, `data/iocs.json`, or `data/blog-index.json` is the usual cause. Parse with `python3 -m json.tool FILE`.

**Push or PR check red.** `validate.yml` ran strict non-network validation. Open `validation-reports/latest-validation-report.md`.

**Collection found nothing new.** Normal on a quiet day. Do not invent a post.

**Intel missing from sitemap or RSS.** The post must be in `data/posts-index.json` and you must run `build_meta.py`. Blog-only entries will not appear there.

**Custom domain.** Confirm `CNAME` and Cloudflare DNS. GitHub Pages A records for apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
