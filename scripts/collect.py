#!/usr/bin/env python3
"""
LLM ThreatIntel — Automated Intelligence Collection Script

Calls the Anthropic Claude API with web search to find new GenAI threat intelligence,
then generates structured blog posts and updates IOC/actor databases.

Usage:
  python scripts/collect.py                  # Standard run
  python scripts/collect.py --dry-run        # Search and display results without writing files
  python scripts/collect.py --force          # Run even if a post already exists for today

Requires: ANTHROPIC_API_KEY environment variable
Install:  pip install anthropic
"""

import os
import sys
import json
import re
import subprocess
import urllib.parse
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("ERROR: anthropic package not installed. Run: pip install anthropic")
    sys.exit(1)

# ---- Configuration ----
REPO_ROOT = Path(__file__).parent.parent
DATA_DIR = REPO_ROOT / "data"
POSTS_DIR = REPO_ROOT / "posts"
LOGS_DIR = REPO_ROOT / "logs"
MODEL = "claude-haiku-4-5-20251001"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")
DRY_RUN = "--dry-run" in sys.argv
FORCE = "--force" in sys.argv

# How far back to look for qualifying stories (wider than 7 days reduces empty runs).
INTEL_LOOKBACK_DAYS = 14
MITRE_POST_ROW_CAP = 2
MIN_DUPLICATE_SENTENCE_CHARS = 40
PROSE_COLLAPSE_FIELDS = (
    "executive_summary",
    "detailed_findings",
    "detection_recommendations",
)
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")

VALID_TAGS = {
    "supply-chain",
    "malicious-tool",
    "nation-state",
    "shadow-ai",
    "llmjacking",
    "malware",
    "apt",
    "phishing",
    "model-poisoning",
    "prompt-injection",
    "mcp-security"
}

# ---- Load existing state for context injection ----
def load_json(path):
    """Load a JSON file, return empty dict if not found."""
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def get_existing_context():
    """Build a compact list of recent post titles so the LLM avoids duplicates."""
    posts = load_json(DATA_DIR / "posts-index.json")
    recent = [f"  - {p['date']}: {p['title']}" for p in posts.get("posts", [])[:15]]
    if not recent:
        return ""
    return "## Already Covered (do NOT duplicate)\n" + "\n".join(recent) + "\n"


# ---- The Collection Prompt ----
def build_prompt():
    """Construct the full collection prompt with dynamic context."""

    existing_context = get_existing_context()

    year = TODAY[:4]
    end_dt = datetime.strptime(TODAY, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    start_dt = end_dt - timedelta(days=INTEL_LOOKBACK_DAYS)
    window_label = f"{start_dt.strftime('%Y-%m-%d')} through {TODAY}"
    month_name = end_dt.strftime("%B")

    return f"""GenAI threat intelligence analyst. Find NEW intelligence with first publication or major update in the last {INTEL_LOOKBACK_DAYS} days (window: {window_label}). Today UTC: {TODAY}.

Rules: Every claim cites at least one real source URL. Never fabricate IOCs. Max 3 highest-severity findings.

Duplicate policy: Do not re-report the same incident already listed below with the same primary source and headline. It IS new intel if: a different vendor or outlet published analysis; a new CVE, advisory, or technical detail appeared; the story is a distinct campaign or tool even if the theme overlaps shadow AI, supply chain, or malware.

Check for duplicates against the existing posts/ directory to ensure they are not duplicates.

Use status "no_new_intel" ONLY after you have run the web searches below and found no qualifying items in the window above. If searches return any credible GenAI or LLM-related security story in that window, return status "new_intel" with at least one finding and real URLs (use confidence "low" if attribution is thin).

{existing_context}

SEARCHES — Execute these web searches (read multiple results per query when useful):
1. GenAI LLM malware supply chain PyPI npm malicious package {year}
2. LLMjacking shadow AI API key theft cloud abuse LLM {year}
3. AI agent MCP server vulnerability prompt injection security {year}
4. APT nation state generative AI malicious LLM tool campaign {year}
5. AI security news LLM threat {month_name} {year}
6. AI coding assistant trojanized model Hugging Face malicious model {year}
7. ChatGPT OpenAI Anthropic Claude abuse malware phishing enterprise {year}
8. GenAI deepfake voice fraud BEC ransomware {year}
9. machine learning model poisoning supply chain ML security advisory {year}
10. CVE LLM AI vulnerability disclosure {year}
11. AI phishing campaign OR deepfake social engineering OR GenAI BEC {year}
12. shadow AI risk OR unauthorized AI enterprise OR AI data leak corporate {year}
13. prompt injection attack OR jailbreak as a service OR LLM jailbreak {year}
14. MCP server vulnerability OR AI agent exploit OR agentic AI security {year}
15. nation state AI cyber OR APT generative AI OR DPRK AI OR Russia AI offensive {year}

OUTPUT: Single JSON object. No prose, no markdown fencing, nothing outside the JSON.

{{
  "status": "new_intel",
  "collection_date": "{TODAY}",
  "search_summary": "Brief summary of searches and results",
  "findings": [
    {{
      "title": "Descriptive title",
      "slug": "kebab-case-slug",
      "tags": ["supply-chain"],
      "tlp": "TLP:CLEAR",
      "confidence": "high|medium|low",
      "executive_summary": "2-3 sentences. Key fact first.",
      "campaign_summary": {{
        "campaign_name": "Name",
        "attribution": "Actor or Unknown",
        "attribution_confidence": "high|medium|low|none",
        "target": "Who is targeted",
        "vector": "Delivery mechanism",
        "status": "active|disrupted|removed",
        "first_observed": "Date"
      }},
      "detailed_findings": "Concise paragraphs with source attribution. No filler.",
      "mitre_attack": [{{"technique": "Name", "id": "T1234.001", "context": "How it applies"}}],
      "iocs": {{
        "domains": [], "urls": [], "hashes": [], "ips": [], "packages": [],
        "affected_platforms": [],
        "note": "Source of IOCs or 'No IOCs published'"
      }},
      "actors": [{{
        "name": "Name", "aliases": [],
        "type": "malicious_llm_tool|malware|threat_group|supply_chain_campaign|nation_state_campaign",
        "status": "active|disrupted|inactive",
        "distribution": [],
        "ttps": ["T1234 - Technique"],
        "attribution": "Attribution or Unattributed",
        "description": "One paragraph"
      }}],
      "detection_recommendations": "Specific detection guidance for defenders",
      "references": [{{"source": "Publisher", "title": "Title", "url": "https://...", "date": "YYYY-MM-DD"}}]
    }}
  ]
}}

If no new intel: {{"status": "no_new_intel", "collection_date": "{TODAY}", "search_summary": "Summary"}}

Valid tags: supply-chain, malicious-tool, nation-state, shadow-ai, llmjacking, malware, apt, phishing, model-poisoning, prompt-injection, mcp-security.
Choose ONLY from these 11 lowercase-hyphenated tags. Do not create new tags, use Title Case, use spaces, or use variations.
Package IOC rules: value must be a clean machine-actionable package identifier only. Valid: @scope/name, name@1.2.3, npm:@scope/name@1.2.3, pypi:name, pypi:name@1.2.3, nuget:name@1.2.3. Invalid: parenthetical comments, version ranges, comparators, aggregate counts, bare product names, affected platforms, conceptual labels, Hugging Face repo slugs as packages. Put affected or exposed platforms in iocs.affected_platforms, not packages. Put notes and version ranges in package objects as note field, not in value. Package object format: {{"name": "@scope/package", "registry": "npm", "version": "1.2.3", "note": "rotated payload"}}. Hugging Face model/repo URLs belong in urls, not packages. Reference, advisory, evidence, and safe PoC URLs belong in references, not urls.
Shared infrastructure IOC rules: never emit bare shared cloud, CDN, registry, code-hosting, PaaS, tunnel, messaging, paste, or shortener apex domains as domain IOCs. Reject examples: storage.googleapis.com, googleapis.com, s3.amazonaws.com, amazonaws.com, github.com, pypi.org, npmjs.com, vercel.app, workers.dev, hf.space, t.me, pastebin.com, bit.ly. Specific attacker-controlled subdomains and paths remain valid: grok-code-session-traces.storage.googleapis.com, maliciousapp.vercel.app, evil.workers.dev, storage.googleapis.com/bucket-name/, t.me/malicious_channel. Document bare shared-host abuse in Detection Recommendations instead.
Only items in the window above. No duplicate incident plus same primary source as listed under Already Covered. Max 3 findings. Real URLs only. Valid MITRE ATT&CK IDs (T + 4 digits).

Writing: No filler, no generic background paragraphs, no restating what the reader already knows. executive_summary: 2 to 3 sentences, under 900 characters. Front-load the most operationally relevant fact. State what happened, who is affected, and what defenders should do. detailed_findings: attribute every factual claim. Use According to [Source Name]... or [Source Name] reported that... Every sentence contributes new information. Do not paste the same sentence twice. If a source cites an older campaign, state that original date. Do not imply it happened in the lookback window. One finding is one incident. Do not glue a recap lede onto a different campaign. Keep first-party technical reports. Skip only when the sole source is a weekly recap of incidents already listed under Already Covered. The disclosing vendor is not the threat actor. Name the publisher in attribution lines and in references. mitre_attack: at most two techniques, and only when the source describes that behavior. Prefer empty [] over generic padding such as T1059 or T1105 with no campaign-specific context. Do not invent mappings."""


# ---- File Writers ----
VALID_COLLECTION_STATUSES = frozenset({"new_intel", "no_new_intel"})
FENCED_JSON_RE = re.compile(r"```(?:json)?\s*\n?(.*?)```", re.DOTALL | re.IGNORECASE)


def strip_citation_markers(text):
    """Remove Anthropic API citation markers from text."""
    if not isinstance(text, str):
        return text
    # Remove <cite index="..."> and </cite> tags
    text = re.sub(r'<cite[^>]*>', '', text)
    text = re.sub(r'</cite>', '', text)
    return text


def clean_finding_citations(finding):
    """Recursively clean citation markers from all text fields in a finding."""
    if isinstance(finding, dict):
        return {k: clean_finding_citations(v) for k, v in finding.items()}
    elif isinstance(finding, list):
        return [clean_finding_citations(item) for item in finding]
    elif isinstance(finding, str):
        return strip_citation_markers(finding)
    return finding


def _normalize_sentence_unit(text):
    return " ".join(text.split())


def collapse_consecutive_duplicate_sentences(text):
    """Drop exact consecutive duplicate sentences. Returns (text, collapsed_count)."""
    if not isinstance(text, str) or not text:
        return text, 0

    collapsed_count = 0
    out_paragraphs = []
    for paragraph in text.split("\n"):
        if not paragraph.strip():
            out_paragraphs.append(paragraph)
            continue
        units = SENTENCE_SPLIT_RE.split(paragraph)
        collapsed = []
        for unit in units:
            previous = collapsed[-1] if collapsed else None
            if (
                previous is not None
                and len(_normalize_sentence_unit(unit)) >= MIN_DUPLICATE_SENTENCE_CHARS
                and len(_normalize_sentence_unit(previous)) >= MIN_DUPLICATE_SENTENCE_CHARS
                and _normalize_sentence_unit(unit) == _normalize_sentence_unit(previous)
            ):
                collapsed_count += 1
                continue
            collapsed.append(unit)
        out_paragraphs.append(" ".join(collapsed))
    return "\n".join(out_paragraphs), collapsed_count


def collapse_duplicate_sentences_in_finding(finding):
    """Collapse exact consecutive duplicate sentences in post prose fields."""
    if not isinstance(finding, dict):
        return finding
    total = 0
    for field in PROSE_COLLAPSE_FIELDS:
        if field not in finding:
            continue
        cleaned, count = collapse_consecutive_duplicate_sentences(finding[field])
        finding[field] = cleaned
        total += count
    if total:
        print(f"  Collapsed {total} consecutive duplicate sentence(s)")
    return finding


def _accepted_collection_payload(obj):
    """Return obj if it is a collection dict with a known status, else None."""
    if not isinstance(obj, dict):
        return None
    status = obj.get("status")
    if status in VALID_COLLECTION_STATUSES:
        return obj
    return None


def extract_collection_json(response_text, log=True):
    """
    Extract the collection JSON object from model output.

    Handles prose prefixes, mid-body markdown fences, and mixed content.
    Accepts only objects with status new_intel or no_new_intel.
    Returns (payload_dict, path_label) or (None, None).
    """
    if not isinstance(response_text, str) or not response_text.strip():
        return None, None

    sanitized = strip_citation_markers(response_text).strip()

    # 1. Direct parse of whole sanitized text
    try:
        accepted = _accepted_collection_payload(json.loads(sanitized))
        if accepted is not None:
            if log:
                print("Parsed collection JSON via direct loads")
            return accepted, "direct"
    except json.JSONDecodeError:
        pass

    # 2. Fenced ```json / ``` blocks anywhere in the text
    for match in FENCED_JSON_RE.finditer(sanitized):
        block = match.group(1).strip()
        try:
            accepted = _accepted_collection_payload(json.loads(block))
            if accepted is not None:
                if log:
                    print("Parsed collection JSON via fenced block")
                return accepted, "fenced"
        except json.JSONDecodeError:
            continue

    # 3. JSONDecoder.raw_decode from each '{' candidate (string-aware)
    decoder = json.JSONDecoder()
    search_from = 0
    while True:
        start = sanitized.find("{", search_from)
        if start == -1:
            break
        try:
            obj, _end = decoder.raw_decode(sanitized, start)
            accepted = _accepted_collection_payload(obj)
            if accepted is not None:
                if log:
                    print("Recovered JSON from mixed response content")
                return accepted, "raw_decode"
        except json.JSONDecodeError:
            pass
        search_from = start + 1

    return None, None


def extract_response_text(response):
    """Concatenate text blocks from an Anthropic message, skipping tool blocks."""
    response_text = ""
    for block in response.content:
        if hasattr(block, "text"):
            response_text += block.text
    return response_text


def reformat_collection_json(client, prior_text):
    """
    One tool-less follow-up that asks the model to return only valid JSON
    for the prior assistant text. Does not enable web_search.
    """
    truncated = prior_text if len(prior_text) <= 120000 else prior_text[:120000]
    follow_up = client.messages.create(
        model=MODEL,
        max_tokens=16000,
        system=(
            "You repair threat intelligence JSON. Return only a single valid JSON object. "
            "No prose, no markdown fences, no reasoning. Preserve status as new_intel or "
            "no_new_intel and keep existing findings and URLs unchanged."
        ),
        messages=[
            {
                "role": "user",
                "content": (
                    "The previous model output below was not valid parseable collection JSON. "
                    "Return only the corrected JSON object with status new_intel or no_new_intel.\n\n"
                    f"{truncated}"
                ),
            }
        ],
    )
    return extract_response_text(follow_up)


def filter_tags(tags):
    """Filter tags to only include valid main categories."""
    if not isinstance(tags, list):
        return []
    filtered = [tag for tag in tags if tag in VALID_TAGS]
    if not filtered:
        filtered = ["malware"]
    return filtered


def save_json(path, data):
    """Save data to JSON file with consistent formatting."""
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {path}")


def generate_post_markdown(finding):
    """Generate a Markdown blog post from a finding object."""
    lines = []
    lines.append(f"# {finding['title']}")
    lines.append("")
    lines.append(f"**Date:** {TODAY}")
    lines.append(f"**Tags:** {', '.join(finding.get('tags', []))}")
    lines.append("")

    # Executive Summary
    lines.append("## Executive Summary")
    lines.append("")
    lines.append(finding['executive_summary'])
    lines.append("")

    # Campaign Summary table
    cs = finding.get('campaign_summary', {})
    if cs:
        lines.append("## Campaign Summary")
        lines.append("")
        lines.append("| Field | Detail |")
        lines.append("|-------|--------|")
        lines.append(f"| Campaign / Malware | {cs.get('campaign_name', 'Unknown')} |")
        lines.append(f"| Attribution | {cs.get('attribution', 'Unknown')} (confidence: {cs.get('attribution_confidence', 'none')}) |")
        lines.append(f"| Target | {cs.get('target', 'Unknown')} |")
        lines.append(f"| Vector | {cs.get('vector', 'Unknown')} |")
        lines.append(f"| Status | {cs.get('status', 'Unknown')} |")
        lines.append(f"| First Observed | {cs.get('first_observed', 'Unknown')} |")
        lines.append("")

    # Detailed Findings
    lines.append("## Detailed Findings")
    lines.append("")
    lines.append(finding['detailed_findings'])
    lines.append("")

    # MITRE ATT&CK
    mitre = finding.get('mitre_attack', [])
    if isinstance(mitre, list) and mitre:
        mitre = mitre[:MITRE_POST_ROW_CAP]
        lines.append("## MITRE ATT&CK Mapping")
        lines.append("")
        lines.append("| Technique | ID | Context |")
        lines.append("|-----------|-----|---------|")
        for m in mitre:
            lines.append(f"| {m['technique']} | {m['id']} | {m['context']} |")
        lines.append("")

    # IOCs
    iocs = finding.get('iocs', {})
    has_iocs = any(iocs.get(k) for k in ['domains', 'urls', 'hashes', 'ips', 'packages'])

    lines.append("## IOCs")
    lines.append("")

    if iocs.get('domains'):
        lines.append("### Domains")
        lines.append("")
        lines.append("```")
        for d in iocs['domains']:
            lines.append(str(d) if not isinstance(d, dict) else d.get('domain', str(d)))
        lines.append("```")
        lines.append("")
    else:
        lines.append("### Domains")
        lines.append("")
        lines.append(f"_{iocs.get('note', 'No domain IOCs published by source')}_")
        lines.append("")

    if iocs.get('urls'):
        lines.append("### Full URL Paths")
        lines.append("")
        lines.append("```")
        for u in iocs['urls']:
            lines.append(str(u) if not isinstance(u, dict) else u.get('url', str(u)))
        lines.append("```")
        lines.append("")
    else:
        lines.append("### Full URL Paths")
        lines.append("")
        lines.append(f"_{iocs.get('note', 'No URL IOCs published by source')}_")
        lines.append("")

    # Splunk format
    domains_list = iocs.get('domains', [])
    urls_list = iocs.get('urls', [])
    # Ensure all items are strings
    domains_str = [str(d) if not isinstance(d, dict) else d.get('domain', str(d)) for d in domains_list]
    urls_str = [str(u) if not isinstance(u, dict) else u.get('url', str(u)) for u in urls_list]
    all_indicators = domains_str + urls_str
    
    if all_indicators:
        lines.append("### Splunk Format")
        lines.append("")
        lines.append("```")
        lines.append(' OR '.join(f'"{item}"' for item in all_indicators))
        lines.append("```")
        lines.append("")
    else:
        lines.append("### Splunk Format")
        lines.append("")
        lines.append("_No IOCs available for Splunk query_")
        lines.append("")

    if iocs.get('hashes'):
        lines.append("### File Hashes")
        lines.append("")
        lines.append("```")
        for h in iocs['hashes']:
            lines.append(str(h) if not isinstance(h, dict) else h.get('hash', str(h)))
        lines.append("```")
        lines.append("")

    if iocs.get('packages'):
        lines.append("### Package Indicators")
        lines.append("")
        lines.append("```")
        for p in iocs['packages']:
            lines.append(str(p) if not isinstance(p, dict) else p.get('package', str(p)))
        lines.append("```")
        lines.append("")

    affected = iocs.get('affected_platforms') or []
    if affected:
        heading = iocs.get('affected_platforms_heading', 'Affected Platforms')
        lines.append(f"### {heading}")
        lines.append("")
        lines.append("```")
        for item in affected:
            lines.append(str(item))
        lines.append("```")
        lines.append("")

    # Detection
    if finding.get('detection_recommendations'):
        lines.append("## Detection Recommendations")
        lines.append("")
        lines.append(finding['detection_recommendations'])
        lines.append("")

    # References
    refs = finding.get('references', [])
    if refs:
        lines.append("## References")
        lines.append("")
        for ref in refs:
            date_str = f" ({ref['date']})" if ref.get('date') else ""
            lines.append(f"- [{ref['source']}] {ref['title']}{date_str} — {ref['url']}")
        lines.append("")

    return '\n'.join(lines)


def update_posts_index(finding):
    """Add new post entry to posts-index.json."""
    index_path = DATA_DIR / "posts-index.json"
    index = load_json(index_path)
    if 'posts' not in index:
        index['posts'] = []

    post_id = f"{TODAY}-{finding['slug']}"
    filename = f"{post_id}.md"

    if any(p['id'] == post_id for p in index['posts']):
        if not FORCE:
            print(f"  Skipping duplicate post: {post_id}")
            return None
        else:
            index['posts'] = [p for p in index['posts'] if p['id'] != post_id]

    entry = {
        "id": post_id,
        "title": finding['title'],
        "date": TODAY,
        "author": "LLM ThreatIntel",
        "tags": filter_tags(finding.get('tags', [])),
        "tlp": finding.get('tlp', 'TLP:CLEAR'),
        "excerpt": finding['executive_summary'],
        "file": filename
    }

    index['posts'].insert(0, entry)
    save_json(index_path, index)
    return filename


def pick_better_text(old, new):
    """Choose the better text between old and new, preferring longer content."""
    old = strip_citation_markers((old or '').strip())
    new = strip_citation_markers((new or '').strip())

    if not old:
        return new
    if not new:
        return old

    return new if len(new) > len(old) else old


def update_actors(finding):
    """Update actors.json with new or updated actor entries."""
    actors_path = DATA_DIR / "actors.json"
    actors = load_json(actors_path)
    if 'entries' not in actors:
        actors['entries'] = []

    for new_actor in finding.get('actors', []):
        existing = None
        all_new_names = [new_actor['name']] + new_actor.get('aliases', [])

        for entry in actors['entries']:
            existing_names_lower = [n.lower() for n in entry['names']]
            if any(n.lower() in existing_names_lower for n in all_new_names):
                existing = entry
                break

        if existing:
            for name in all_new_names:
                if name not in existing['names']:
                    existing['names'].append(name)

            for ttp in new_actor.get('ttps', []):
                if ttp not in existing['ttps']:
                    existing['ttps'].append(ttp)

            for dist in new_actor.get('distribution', []):
                if dist not in existing.get('distribution', []):
                    existing.setdefault('distribution', []).append(dist)

            existing['description'] = pick_better_text(
                existing.get('description', ''),
                new_actor.get('description', '')
            )

            if new_actor.get('status'):
                existing['status'] = new_actor['status']

            if new_actor.get('type') and not existing.get('type'):
                existing['type'] = new_actor['type']

            if new_actor.get('first_observed'):
                old_first = existing.get('first_seen')
                new_first = new_actor['first_observed']
                if not old_first or new_first < old_first:
                    existing['first_seen'] = new_first

            new_attr = strip_citation_markers((new_actor.get('attribution') or '').strip())
            old_attr = strip_citation_markers((existing.get('attribution') or '').strip())
            if new_attr and (not old_attr or old_attr.lower() in {'unattributed', 'unknown'}):
                existing['attribution'] = new_attr

            print(f"  Updated actor: {existing['names'][0]}")
        else:
            entry = {
                "id": re.sub(r'[^a-z0-9]+', '-', new_actor['name'].lower()).strip('-'),
                "names": all_new_names,
                "type": new_actor.get('type', 'malware'),
                "first_seen": new_actor.get('first_observed', TODAY[:7]),
                "status": new_actor.get('status', 'active'),
                "distribution": new_actor.get('distribution', []),
                "ttps": new_actor.get('ttps', []),
                "description": strip_citation_markers((new_actor.get('description') or '').strip())
            }
            if new_actor.get('attribution'):
                entry['attribution'] = new_actor['attribution']
            actors['entries'].append(entry)
            print(f"  Added new actor: {new_actor['name']}")

    for entry in actors['entries']:
        entry['description'] = strip_citation_markers((entry.get('description') or '').strip())
        if entry.get('attribution'):
            entry['attribution'] = strip_citation_markers(entry['attribution']).strip()

    actors['last_updated'] = TODAY
    save_json(actors_path, actors)


# Markers indicating prose rather than a real IOC. Entries containing any of
# these are skipped at insertion time so the daily run cannot re-pollute the feed.
PROSE_REJECT_MARKERS = (
    "poc available",
    "did not disclose",
    "researchers did not",
    "no specific",
    "(compromised)",
    "(multiple vendors)",
    "masquerading",
    "potentially affected endpoints",
    "affected installations",
    "trojanized versions",
    "(version info not specified",
    "(observed in exploitation)",
    "(exploitation detected",
    "(affected versions)",
    "(affected version in commit",
    "(npm package, sourcemap exposed)",
    "vulnerable versions affected by",
    "(imposter package)",
    " versions ",
    " range ",
)

# Reject space-then-comparator forms like "vLLM < 0.14.1" while allowing
# packed comparator forms like "vllm@<0.14.1".
SPACE_COMPARATOR_RE = re.compile(r'\s[<>]=?\s')
HEX_RE = re.compile(r'^[a-fA-F0-9]+$')
CVE_RE = re.compile(r'CVE-\d{4}-\d+', re.I)
AGGREGATE_DESC_RE = re.compile(
    r'\d+\+?\s+(identified|uploads|models|skills|affected|trojanized|'
    r'suspicious|unsafe|advisories|CVEs|compromised|malicious|packages)|'
    r'additional packages|in @[\w-]+ namespace',
    re.I,
)
PACKAGE_RE = re.compile(
    r'^(?:(?:npm|pypi|nuget|chrome-extension):)?'
    r'(?:@[A-Za-z0-9._-]+/[A-Za-z0-9._-]+|[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)?)'
    r'(?:@[A-Za-z0-9._+-]+)?$'
)
PACKAGE_COMPARATOR_RE = re.compile(r'[<>=]{1,2}|==')
PACKAGE_VERSION_RANGE_RE = re.compile(r'\bversions?\b.*\bto\b|\bto\b.*\bversions?\b', re.I)
HF_REPO_PACKAGE_SLUGS = {'open-oss/privacy-filter'}
PARENTHETICAL_PROSE_RE = re.compile(r'\s*\([^)]{3,}\)\s*$')
PARENTHETICAL_NOTE_RE = re.compile(r'\s*\(([^)]{3,})\)\s*$')
DOMAIN_RE = re.compile(
    r'^(?=.{1,253}$)(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z0-9-]{2,63}$'
)
POLICY_PATH = REPO_ROOT / "validation" / "policy.json"
_POLICY_CACHE = None
NO_IOCS_PUBLISHED_RE = re.compile(r"no specific ioc|no iocs published", re.I)


def safe_urlparse(value: str):
    try:
        return urllib.parse.urlparse(value if '://' in value else f'//{value}', scheme='')
    except ValueError:
        return None


def load_policy():
    global _POLICY_CACHE
    if _POLICY_CACHE is None:
        if POLICY_PATH.exists():
            _POLICY_CACHE = json.loads(POLICY_PATH.read_text())
        else:
            _POLICY_CACHE = {}
    return _POLICY_CACHE


def extract_url_host(value):
    parsed = safe_urlparse(value)
    if not parsed:
        return ''
    if parsed.netloc:
        host = parsed.netloc.split('@')[-1].split(':')[0]
        return host.lower() if host else ''
    if '/' in value:
        return value.split('/')[0].lower()
    return value.lower()


def normalize_url_host_path(value: str) -> tuple[str, str]:
    parsed = safe_urlparse(value)
    if not parsed:
        return '', '/'
    host = parsed.netloc.split('@')[-1].split(':')[0].lower() if parsed.netloc else ''
    path = parsed.path or '/'
    return host, path


def normalize_url_identity(value: str) -> str:
    """Normalize URL syntax differences without changing path semantics."""
    cleaned = str(value).strip().replace('[.]', '.')
    cleaned = re.sub(
        r'^hxxps?://',
        lambda match: 'https://' if 's' in match.group(0).lower() else 'http://',
        cleaned,
        flags=re.I,
    )
    parsed = safe_urlparse(cleaned)
    if not parsed or not parsed.netloc:
        return ''
    try:
        host = (parsed.hostname or '').lower()
        port = parsed.port
    except ValueError:
        return ''
    if host.startswith('www.'):
        host = host[4:]
    if not host:
        return ''
    authority = f'{host}:{port}' if port is not None else host
    path = (parsed.path or '/').rstrip('/') or '/'
    query = f'?{parsed.query}' if parsed.query else ''
    return f'{authority}{path}{query}'


def normalize_ioc_identity(value: str, ioc_type: str) -> str:
    """Build a stable identity key used only for duplicate comparisons."""
    if ioc_type == 'url_path':
        normalized = normalize_url_identity(value)
    elif ioc_type == 'domain':
        normalized = str(value).strip().replace('[.]', '.').lower().rstrip('/')
    else:
        normalized = str(value).strip()
    return f'{ioc_type}:{normalized}' if normalized else ''


def reference_url_identities(finding: dict) -> set[str]:
    identities = set()
    for reference in finding.get('references', []) or []:
        if not isinstance(reference, dict):
            continue
        identity = normalize_url_identity(reference.get('url', ''))
        if identity:
            identities.add(identity)
    return identities


def remove_reference_urls_from_finding_iocs(finding: dict) -> int:
    """Remove source/reference URLs accidentally returned as IOC URLs."""
    finding_iocs = finding.get('iocs')
    if not isinstance(finding_iocs, dict):
        return 0
    urls = finding_iocs.get('urls')
    if not isinstance(urls, list):
        return 0

    references = reference_url_identities(finding)
    if not references:
        return 0

    kept = []
    removed = 0
    for item in urls:
        value = item.get('url', '') if isinstance(item, dict) else item
        identity = normalize_url_identity(value)
        if identity and identity in references:
            removed += 1
            continue
        kept.append(item)
    if removed:
        finding_iocs['urls'] = kept
    return removed


def matches_reference_url_path(value: str, policy: dict) -> bool:
    host, path = normalize_url_host_path(value)
    if not host:
        return False
    for entry in policy.get('reference_url_path_denylist', []):
        entry_host = str(entry.get('host', '')).lower()
        prefix = str(entry.get('path_prefix', '/'))
        if host == entry_host or host.endswith('.' + entry_host):
            if path.startswith(prefix):
                return True
    return False


def bare_package_name(value: str) -> str:
    return re.sub(r'^(?:npm|pypi|nuget|chrome-extension):', '', value, flags=re.I)


def iocs_publication_suppressed(finding_iocs: dict) -> bool:
    note = str(finding_iocs.get('note', ''))
    return bool(NO_IOCS_PUBLISHED_RE.search(note))


def normalize_for_platform_check(value):
    v = PARENTHETICAL_PROSE_RE.sub('', value).strip()
    v = v.lower()
    v = re.sub(r'^https?://', '', v)
    v = re.sub(r'^www\.', '', v)
    return v.rstrip('/')


def matches_platform_denylist(value, ioc_type, policy):
    deny = policy.get('legitimate_platform_iocs_deny_list', {}) or {}
    deny_domains = {str(d).lower() for d in deny.get('domains', [])}
    deny_url_paths = {str(p).lower() for p in deny.get('url_paths', [])}
    overrides = {str(o).lower() for o in policy.get('legitimate_platform_ioc_overrides', [])}
    normalised = normalize_for_platform_check(value)
    if not normalised or normalised in overrides:
        return False
    if ioc_type == 'domain':
        return normalised in deny_domains
    if ioc_type == 'url_path':
        return normalised in deny_domains or normalised in deny_url_paths
    return False


def matches_shared_infrastructure(value, ioc_type, policy):
    """Exact-match bare shared infrastructure hosts. Subdomains and paths pass."""
    if ioc_type not in ('domain', 'url_path'):
        return False
    deny = {str(d).lower() for d in policy.get('shared_infrastructure_domain_denylist', [])}
    if not deny:
        return False
    overrides = {str(o).lower() for o in policy.get('legitimate_platform_ioc_overrides', [])}
    normalised = normalize_for_platform_check(value)
    if not normalised or normalised in overrides:
        return False
    return normalised in deny


def is_valid_domain(value):
    return bool(DOMAIN_RE.match(value))


def classify_hash(value):
    """Return precise hash type by hex length, or 'hash' if unrecognized."""
    if not HEX_RE.match(value):
        return 'hash'
    length = len(value)
    if length == 64:
        return 'sha256'
    if length == 40:
        return 'sha1'
    if length == 32:
        return 'md5'
    return 'hash'


def package_candidate_reason(value: str) -> str | None:
    if any(ch.isspace() for ch in value):
        return 'package value must not contain whitespace'
    if PARENTHETICAL_PROSE_RE.search(value):
        return 'package value must not contain parenthetical prose'
    if ',' in value:
        return 'package value must not contain commas'
    if PACKAGE_COMPARATOR_RE.search(value):
        return 'package value must not contain version comparators or ranges'
    if PACKAGE_VERSION_RANGE_RE.search(value):
        return 'package value must not contain version range prose'
    if AGGREGATE_DESC_RE.search(value):
        return 'aggregate or statistical description is not an IOC value'
    bare = re.sub(r'^(?:npm|pypi|nuget|chrome-extension):', '', value, flags=re.I)
    if value.lower().startswith('huggingface:') or bare.lower() in HF_REPO_PACKAGE_SLUGS:
        return 'Hugging Face repository identifiers must use url_path, not package'
    if not PACKAGE_RE.match(value):
        return 'invalid package IOC format'
    return None


def package_dict_to_value(pkg: dict) -> tuple[str, str]:
    name = str(pkg.get('name') or pkg.get('package') or '').strip()
    registry = str(pkg.get('registry') or '').strip().lower()
    version = str(pkg.get('version') or '').strip()
    note = str(pkg.get('note') or '').strip()
    if not name:
        return '', note
    value = name
    if registry and version:
        value = f'{registry}:{name}@{version}'
    elif registry:
        value = f'{registry}:{name}'
    elif version:
        value = f'{name}@{version}'
    return value, note


def normalize_ioc_value(value, ioc_type):
    """Clean an IOC value before insertion.

    Returns (cleaned_value, cleaned_type, reject_reason, context_note).
  On success reject_reason is None.
    """
    if not isinstance(value, str):
        value = str(value)

    cleaned = value.strip()
    context_note = None
    if not cleaned:
        return None, None, 'empty value', None

    policy = load_policy()
    malware_names = policy.get('malware_family_denylist', [])
    malware_lower = {n.lower() for n in malware_names}
    affected_products = {n.lower() for n in policy.get('affected_product_package_denylist', [])}
    conceptual = {n.lower() for n in policy.get('conceptual_package_denylist', [])}
    ref_domains = policy.get('reference_url_domain_denylist', [])
    evidence_domains = {d.lower() for d in policy.get('evidence_domain_denylist', [])}

    if '*' in cleaned:
        return None, None, 'wildcard values are not valid IOCs', None

    if CVE_RE.match(cleaned):
        return None, None, 'CVE ID is not an IOC value', None

    if AGGREGATE_DESC_RE.search(cleaned):
        return None, None, 'aggregate or statistical description is not an IOC value', None

    if ioc_type == 'package' and '==' in cleaned:
        name, ver = cleaned.split('==', 1)
        cleaned = f'pypi:{name.strip()}@{ver.strip()}'

    paren_match = PARENTHETICAL_NOTE_RE.search(cleaned)
    if paren_match:
        stripped = cleaned[:paren_match.start()].strip()
        note = paren_match.group(1).strip()
        if not stripped:
            return None, None, 'value is only editorial prose in parentheses', None
        if ioc_type == 'package':
            reason = package_candidate_reason(stripped)
            if reason:
                return None, None, reason, None
            cleaned = stripped
            context_note = note
        else:
            if stripped.lower() in affected_products or stripped in malware_names or stripped.lower() in malware_lower:
                return None, None, 'stripped value is not a valid IOC', None
            if ioc_type == 'domain' and not is_valid_domain(stripped):
                return None, None, 'stripped value is not a valid domain', None
            cleaned = stripped

    if ioc_type != 'url_path':
        cleaned = cleaned.replace('[.]', '.')

    lowered = cleaned.lower()
    if any(marker in lowered for marker in PROSE_REJECT_MARKERS):
        return None, None, 'value contains narrative prose markers', None
    if ioc_type in {'domain', 'url_path', 'ip', 'hash', 'sha256', 'sha1', 'md5'}:
        if any(ch.isspace() for ch in cleaned):
            return None, None, 'value contains whitespace; narrative prose is not an IOC', None
    if SPACE_COMPARATOR_RE.search(cleaned):
        return None, None, 'space-separated version comparators are not valid package IOCs', None

    if ioc_type == 'package':
        if cleaned in malware_names or cleaned.lower() in malware_lower:
            return None, None, 'malware family name is not a package IOC', None
        bare = bare_package_name(cleaned)
        bare_lower = bare.lower()
        if bare_lower in conceptual:
            return None, None, 'conceptual label is not a package IOC', None
        if '@' not in bare and bare_lower in affected_products:
            return None, None, 'bare affected product name without registry/version context', None
        reason = package_candidate_reason(cleaned)
        if reason:
            return None, None, reason, None

    if ioc_type == 'url_path':
        host = extract_url_host(cleaned)
        if not host:
            return None, None, 'malformed URL value', None
        if host and ref_domains:
            for ref_domain in ref_domains:
                ref = ref_domain.lower()
                if host == ref or host.endswith('.' + ref):
                    return None, None, 'reference or documentation URL is not an IOC', None
        if matches_reference_url_path(cleaned, policy):
            return None, None, 'reference, advisory, evidence, or safe PoC URL is not an IOC', None

    if ioc_type == 'domain' and cleaned.lower() in evidence_domains:
        return None, None, 'evidence or delivery-channel domain is not an IOC', None

    if ioc_type in ('domain', 'url_path'):
        if matches_shared_infrastructure(cleaned, ioc_type, policy):
            return None, None, 'bare shared infrastructure host is not an IOC', None
        if matches_platform_denylist(cleaned, ioc_type, policy):
            return None, None, 'legitimate platform domain or generic path is not an IOC', None

    new_type = ioc_type
    if ioc_type in ('hash', 'sha256', 'sha1', 'md5'):
        new_type = classify_hash(cleaned)

    return cleaned, new_type, None, context_note


def update_iocs(finding):
    """Update iocs.json with new IOC entries."""
    iocs_path = DATA_DIR / "iocs.json"
    iocs = load_json(iocs_path)
    if 'iocs' not in iocs:
        iocs['iocs'] = []

    existing_raw_values = {
        str(ioc.get('value', ''))
        for ioc in iocs['iocs']
        if isinstance(ioc, dict) and ioc.get('value') is not None
    }
    existing_identities = {
        identity
        for ioc in iocs['iocs']
        if isinstance(ioc, dict)
        for identity in [
            normalize_ioc_identity(
                str(ioc.get('value', '')),
                str(ioc.get('type', '')),
            )
        ]
        if identity
    }
    reference_urls = reference_url_identities(finding)
    finding_iocs = finding.get('iocs', {})
    campaign = finding.get('slug', 'unknown')
    added = 0
    skipped = 0
    suppress_packages = iocs_publication_suppressed(finding_iocs)

    def add_ioc(value, ioc_type, note=''):
        nonlocal added, skipped
        cleaned, cleaned_type, reject_reason, relocated_note = normalize_ioc_value(value, ioc_type)
        if cleaned is None:
            skipped += 1
            reason = reject_reason or 'malformed value'
            print(f"  Skipped malformed IOC: {value!r} (reason: {reason})")
            return
        identity = normalize_ioc_identity(cleaned, cleaned_type)
        if cleaned_type == 'url_path' and normalize_url_identity(cleaned) in reference_urls:
            skipped += 1
            print(f"  Skipped reference URL misclassified as IOC: {value!r}")
            return
        if cleaned in existing_raw_values or (
            identity and identity in existing_identities
        ):
            return
        context = finding['title']
        extra_note = note or relocated_note
        if extra_note:
            context = f"{context} | {extra_note}"
        iocs['iocs'].append({
            "value": cleaned,
            "type": cleaned_type,
            "context": context,
            "first_seen": TODAY,
            "source": finding.get('references', [{}])[0].get('source', 'LLM ThreatIntel'),
            "campaign": campaign,
            "status": "active"
        })
        existing_raw_values.add(cleaned)
        if identity:
            existing_identities.add(identity)
        added += 1

    for domain in finding_iocs.get('domains', []):
        domain_str = str(domain) if not isinstance(domain, dict) else domain.get('domain', str(domain))
        add_ioc(domain_str, 'domain')

    for url in finding_iocs.get('urls', []):
        url_str = str(url) if not isinstance(url, dict) else url.get('url', str(url))
        add_ioc(url_str, 'url_path')

    for hash_val in finding_iocs.get('hashes', []):
        hash_str = str(hash_val) if not isinstance(hash_val, dict) else hash_val.get('hash', str(hash_val))
        add_ioc(hash_str, 'hash')

    for ip in finding_iocs.get('ips', []):
        ip_str = str(ip) if not isinstance(ip, dict) else ip.get('ip', str(ip))
        add_ioc(ip_str, 'ip')

    packages = finding_iocs.get('packages', [])
    if suppress_packages and packages:
        skipped += len(packages)
        print(
            f"  Skipped {len(packages)} package IOC(s): source reported no specific IOCs published"
        )
    else:
        for pkg in packages:
            if isinstance(pkg, dict):
                pkg_str, pkg_note = package_dict_to_value(pkg)
                add_ioc(pkg_str, 'package', note=pkg_note)
            else:
                add_ioc(str(pkg), 'package')

    if added > 0:
        iocs['last_updated'] = TODAY
        save_json(iocs_path, iocs)
        print(f"  Added {added} new IOC(s)" + (f", skipped {skipped} malformed" if skipped else ""))
    else:
        print(f"  No new IOCs to add" + (f" ({skipped} skipped as malformed)" if skipped else ""))


# ---- Main ----
def main():
    print(f"{'='*60}")
    print(f"LLM ThreatIntel — Collection Run: {TODAY}")
    print(f"Mode: {'DRY RUN' if DRY_RUN else 'LIVE'}")
    print(f"{'='*60}")

    # Ensure directories exist
    POSTS_DIR.mkdir(exist_ok=True)
    LOGS_DIR.mkdir(exist_ok=True)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    prompt = build_prompt()

    print(f"\nPrompt length: {len(prompt)} chars")
    print("Searching for new GenAI threat intelligence...\n")

    try:
        with client.messages.stream(
            model=MODEL,
            max_tokens=16000,
            system="You are a threat intelligence JSON API. After completing web searches, your entire text response must be a single valid JSON object. Never include reasoning, prose, analysis, markdown, or any text outside the JSON structure.",
            tools=[{"type": "web_search_20260209", "name": "web_search", "allowed_callers": ["direct"]}],
            messages=[{"role": "user", "content": prompt}]
        ) as stream:
            response = stream.get_final_message()
    except anthropic.APIError as e:
        print(f"ERROR: Anthropic API error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")
        sys.exit(1)

    stop_reason = getattr(response, "stop_reason", None)
    usage = getattr(response, "usage", None)
    print(f"stop_reason: {stop_reason}")
    if usage is not None:
        input_tokens = getattr(usage, "input_tokens", None)
        output_tokens = getattr(usage, "output_tokens", None)
        print(f"usage: input_tokens={input_tokens} output_tokens={output_tokens}")

    # Extract text response (skip tool_use blocks)
    response_text = extract_response_text(response)

    # Log raw response for debugging (before parse / truncation checks)
    log_path = LOGS_DIR / f"{TODAY}-raw-response.txt"
    log_path.write_text(response_text)
    print(f"Raw response logged to: {log_path}")

    if stop_reason == "max_tokens":
        print("ERROR: Model response truncated (stop_reason=max_tokens). Refusing partial JSON.")
        print(f"First 500 chars of response:\n{response_text[:500]}")
        sys.exit(1)

    if not response_text.strip():
        print("WARNING: No text response received. The model may have only returned tool calls.")
        print(f"Response content types: {[b.type for b in response.content]}")
        print("This may require a follow-up API call. Exiting.")
        sys.exit(0)

    result, parse_path = extract_collection_json(response_text)

    if result is None:
        print("WARNING: Initial JSON parse failed. Attempting one tool-less JSON reformat retry...")
        try:
            reformatted = reformat_collection_json(client, response_text)
            retry_log = LOGS_DIR / f"{TODAY}-raw-response-reformat.txt"
            retry_log.write_text(reformatted)
            print(f"Reformat response logged to: {retry_log}")
            result, parse_path = extract_collection_json(reformatted)
            if result is not None:
                print(f"Recovered collection JSON via reformat retry ({parse_path})")
        except anthropic.APIError as e:
            print(f"ERROR: Anthropic API error during JSON reformat retry: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"ERROR: Unexpected error during JSON reformat retry: {e}")
            sys.exit(1)

    if result is None:
        print(f"ERROR: Failed to parse API response as JSON")
        print(f"First 500 chars of response:\n{response_text[:500]}")
        print("Could not recover JSON. Exiting.")
        sys.exit(1)

    # Handle results
    print(f"\nSearch summary: {result.get('search_summary', 'N/A')}")

    if result.get('status') == 'no_new_intel':
        print(f"\nLLM ThreatIntel — No new intelligence found for {TODAY}")
        sys.exit(0)

    findings = result.get('findings', [])
    if not findings:
        print("No findings in response")
        sys.exit(0)

    print(f"\nFound {len(findings)} new intelligence item(s)")
    print("-" * 60)

    if DRY_RUN:
        print("\n[DRY RUN] Would create the following posts:\n")
        for i, finding in enumerate(findings, 1):
            print(f"  {i}. {finding.get('title', 'Untitled')}")
            print(f"     Tags: {', '.join(finding.get('tags', []))}")
            print(f"     Confidence: {finding.get('confidence', 'N/A')}")
            print(f"     IOCs: {sum(len(finding.get('iocs', {}).get(k, [])) for k in ['domains', 'urls', 'hashes', 'ips', 'packages'])} indicators")
            print(f"     Sources: {len(finding.get('references', []))} references")
            print()
        print("[DRY RUN] No files written. Remove --dry-run to execute.")
        sys.exit(0)

    # Process findings
    any_new_post = False
    for i, finding in enumerate(findings, 1):
        print(f"\nProcessing {i}/{len(findings)}: {finding.get('title', 'Untitled')}")
        
        # Clean citation markers from all text fields
        finding = clean_finding_citations(finding)
        finding = collapse_duplicate_sentences_in_finding(finding)
        removed_reference_urls = remove_reference_urls_from_finding_iocs(finding)
        if removed_reference_urls:
            print(
                f"  Removed {removed_reference_urls} reference URL(s) "
                "misclassified as IOC URLs"
            )

        markdown = generate_post_markdown(finding)
        filename = update_posts_index(finding)
        if filename:
            post_path = POSTS_DIR / filename
            post_path.write_text(markdown)
            print(f"  Created post: {post_path}")
            any_new_post = True

        update_actors(finding)
        update_iocs(finding)

    if any_new_post:
        print("\nGenerating static post pages, sitemap.xml, rss.xml...")
        subprocess.run(
            [sys.executable, str(REPO_ROOT / "scripts" / "build_meta.py")],
            cwd=str(REPO_ROOT),
            check=True,
        )

    print(f"\n{'='*60}")
    print(f"Collection complete. {len(findings)} report(s) generated.")
    print(f"Run: git add -A && git commit -m 'intel: {TODAY}' && git push")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
