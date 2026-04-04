# llm-threatintel project context (compressed)

## Conversation thread history and outcomes

Initial goal was GitHub Pages for the static site with custom domain llm-threatintel.com, DNS on the provider side, and a daily automated intelligence collection at 05:00 UK time with Anthropic API in Actions. Outcome: repo wired to Pages, CNAME and `.nojekyll`, `collect.yml` runs collect then conditionally deploys when content changes so the token cannot block deploy after automated pushes.

Frontend work in thread: replaced heavy animated neural background with static layered gradient and pattern so desktop and other apps stay responsive; swapped favicon from thunder icon to purple LLM logo; capped post preview text length in the feed; fixed mobile horizontal overscroll with `overflow-x: hidden`; restored sticky header flush on mobile; adjusted stat tiles layout on small screens.

Operational questions in thread included whether the scheduled workflow ran and how to read GitHub Actions logs; answer path is Actions tab and `gh run` style inspection, with the caveat that failures or no new posts tie to API errors or billing.

Cost work in thread: analyzed what drives token spend (model tier, web search tool usage, prompt size, output cap, retries). Outcome: `collect.py` tuned with cheaper model where configured, fewer bundled searches in the prompt, capped findings and tokens, streaming and strict JSON parsing to reduce waste and parse failures.

Category UI in thread: preview tiles lost colored pills when generated tags did not match CSS class slugs. Outcome: enforced a fixed set of seven tag slugs in `collect.py` with `filter_tags`, prompt instructions to only use those tags, and a one-time normalization of `data/posts-index.json`; CSS tag classes already matched the canonical set.

Documentation in thread: requested compressed handoff file; this `summary.md` is that artifact plus the manual prompt file and optional Cursor skill path below.

## State now

Repository should reflect static background, favicon, excerpt truncation, overflow fix, sticky header behavior, merged collect-plus-deploy workflow, strict tags on new posts and cleaned index, and cost-oriented collect settings. Live site behavior depends on the latest push to the default branch and Pages build.

Automated daily collection requires a valid Anthropic secret in the repo and sufficient account credits; if billing is low, runs can fail or produce nothing new despite cron firing. After credits are healthy, confirm with a manual workflow run or the next scheduled window.

## Site and hosting
- Static site for llm-threatintel; GitHub Pages with custom domain llm-threatintel.com via CNAME and DNS A/CNAME.
- `.nojekyll` present. Deploy via GitHub Actions.
- Daily collection workflow `collect.yml`: cron 04:00 UTC for 05:00 UK BST; collect job outputs `changed`; deploy job runs when `changed == true` so pushes from collect trigger Pages deploy without relying on cross-workflow token limits.

## Automated collection (`scripts/collect.py`)
- Anthropic API with web search; streaming for long responses; strict JSON system prompt; brace-depth JSON parse; strip `<cite>` from outputs.
- Cost tuning: fewer consolidated web queries in prompt, cap findings, cheaper model (e.g. Haiku variant as configured), bounded `max_tokens`.
- Tag pipeline: only seven allowed slugs in index and new posts: `supply-chain`, `malicious-tool`, `nation-state`, `shadow-ai`, `llmjacking`, `malware`, `apt`. `filter_tags` drops unknown tags; default `malware` if empty. Prompt tells model to use only these tags.
- Historical `data/posts-index.json` was bulk-normalized to those tags via one-off script since removed.

## Frontend (index, css, js)
- Animated neural canvas removed; `#neural-bg` is static CSS gradient and subtle pattern for performance.
- Favicon: LLM purple logo SVG, not thunder.
- Post card excerpts truncated in `js/app.js` (e.g. ~220 chars) for feed previews.
- `html, body { overflow-x: hidden }` to stop mobile horizontal rubber-band drift.
- Mobile header: sticky flush top; stat tiles responsive grid adjusted earlier.

## Ops note
- If daily collect shows no new content, check Actions logs and Anthropic billing; low credits caused failed runs until topped up.

## Artifacts
- `CLAUDE_CODE_PROMPT.txt`: manual collection prompt.
- Cursor skill `llm-threatintel-site` at user `.cursor/skills/` for agent workflows.
