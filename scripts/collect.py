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

VALID_TAGS = {
    "supply-chain",
    "malicious-tool",
    "nation-state",
    "shadow-ai",
    "llmjacking",
    "malware",
    "apt"
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

Valid tags: supply-chain, malicious-tool, nation-state, shadow-ai, llmjacking, malware, apt.
Choose ONLY from these 7 tags. Do not create new tags or use variations.
Only items in the window above. No duplicate incident plus same primary source as listed under Already Covered. Max 3 findings. Real URLs only. Valid MITRE ATT&CK IDs (T + 4 digits)."""


# ---- File Writers ----
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
    if mitre:
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
            lines.append(d)
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
            lines.append(u)
        lines.append("```")
        lines.append("")
    else:
        lines.append("### Full URL Paths")
        lines.append("")
        lines.append(f"_{iocs.get('note', 'No URL IOCs published by source')}_")
        lines.append("")

    # Splunk format
    all_indicators = iocs.get('domains', []) + iocs.get('urls', [])
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
            lines.append(h)
        lines.append("```")
        lines.append("")

    if iocs.get('packages'):
        lines.append("### Package Indicators")
        lines.append("")
        lines.append("```")
        for p in iocs['packages']:
            lines.append(p)
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


def update_iocs(finding):
    """Update iocs.json with new IOC entries."""
    iocs_path = DATA_DIR / "iocs.json"
    iocs = load_json(iocs_path)
    if 'iocs' not in iocs:
        iocs['iocs'] = []

    existing_values = {i['value'] for i in iocs['iocs']}
    finding_iocs = finding.get('iocs', {})
    campaign = finding.get('slug', 'unknown')
    added = 0

    def add_ioc(value, ioc_type):
        nonlocal added
        if value and value not in existing_values:
            iocs['iocs'].append({
                "value": value,
                "type": ioc_type,
                "context": finding['title'],
                "first_seen": TODAY,
                "source": finding.get('references', [{}])[0].get('source', 'LLM ThreatIntel'),
                "campaign": campaign,
                "status": "active"
            })
            existing_values.add(value)
            added += 1

    for domain in finding_iocs.get('domains', []):
        add_ioc(domain, 'domain')

    for url in finding_iocs.get('urls', []):
        add_ioc(url, 'url_path')

    for hash_val in finding_iocs.get('hashes', []):
        hash_type = "sha256" if len(hash_val) == 64 else "md5" if len(hash_val) == 32 else "hash"
        add_ioc(hash_val, hash_type)

    for ip in finding_iocs.get('ips', []):
        add_ioc(ip, 'ip')

    for pkg in finding_iocs.get('packages', []):
        add_ioc(pkg, 'package')

    if added > 0:
        iocs['last_updated'] = TODAY
        save_json(iocs_path, iocs)
        print(f"  Added {added} new IOC(s)")
    else:
        print("  No new IOCs to add")


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
            tools=[{"type": "web_search", "name": "web_search"}],
            messages=[{"role": "user", "content": prompt}]
        ) as stream:
            response = stream.get_final_message()
    except anthropic.APIError as e:
        print(f"ERROR: Anthropic API error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")
        sys.exit(1)

    # Extract text response (skip tool_use blocks)
    response_text = ""
    for block in response.content:
        if hasattr(block, 'text'):
            response_text += block.text

    if not response_text.strip():
        print("WARNING: No text response received. The model may have only returned tool calls.")
        print(f"Response content types: {[b.type for b in response.content]}")
        print("This may require a follow-up API call. Exiting.")
        sys.exit(0)

    # Log raw response for debugging
    log_path = LOGS_DIR / f"{TODAY}-raw-response.txt"
    log_path.write_text(response_text)
    print(f"Raw response logged to: {log_path}")

    # Parse JSON
    result = None
    cleaned = response_text.strip()
    cleaned = re.sub(r'^```(?:json)?\s*\n?', '', cleaned)
    cleaned = re.sub(r'\n?\s*```\s*$', '', cleaned)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    if result is None:
        # Find the first top-level { and its matching }
        start = response_text.find('{')
        if start != -1:
            depth = 0
            end = -1
            for i in range(start, len(response_text)):
                if response_text[i] == '{':
                    depth += 1
                elif response_text[i] == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break
            if end > start:
                try:
                    result = json.loads(response_text[start:end])
                    print("Recovered JSON from mixed response content")
                except json.JSONDecodeError:
                    pass

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
