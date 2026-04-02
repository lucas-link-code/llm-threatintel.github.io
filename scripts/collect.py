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
from datetime import datetime, timezone
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
MODEL = "claude-sonnet-4-6"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")
DRY_RUN = "--dry-run" in sys.argv
FORCE = "--force" in sys.argv

# ---- Load existing state for context injection ----
def load_json(path):
    """Load a JSON file, return empty dict if not found."""
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def get_existing_context():
    """Build a context string of what we already track so the LLM can avoid duplicates."""
    actors = load_json(DATA_DIR / "actors.json")
    iocs = load_json(DATA_DIR / "iocs.json")
    posts = load_json(DATA_DIR / "posts-index.json")

    actor_names = []
    for entry in actors.get("entries", []):
        actor_names.extend(entry.get("names", []))

    existing_ioc_values = [i["value"] for i in iocs.get("iocs", [])]

    recent_posts = []
    for p in posts.get("posts", [])[:20]:
        recent_posts.append(f"  - {p['date']}: {p['title']}")

    ctx = "## Existing Coverage (do NOT duplicate these)\n\n"
    ctx += f"### Tracked actors/malware ({len(actor_names)} names):\n"
    ctx += ", ".join(actor_names[:50]) + "\n\n"
    ctx += f"### Tracked IOCs ({len(existing_ioc_values)} values):\n"
    ctx += ", ".join(existing_ioc_values[:30]) + "\n\n"
    ctx += f"### Recent posts (last {len(recent_posts)}):\n"
    ctx += "\n".join(recent_posts) + "\n"

    return ctx


# ---- The Collection Prompt ----
def build_prompt():
    """Construct the full collection prompt with dynamic context."""

    existing_context = get_existing_context()

    return f"""You are a senior threat intelligence analyst specializing in GenAI, LLM, and AI supply chain threats.

Your priority order is:
1. Correctness and truthfulness: every claim must be traceable to a specific published source with a URL
2. Completeness: cover all significant new findings within the last 7 days
3. Actionable detail: IOCs must be exact values from source reports, TTPs must use valid MITRE ATT&CK IDs
4. Zero fabrication: if a source does not publish IOCs, report "No IOCs published by source" rather than inventing them

Today's date is {TODAY}.

OPERATING RULES:
- Do not guess. If uncertain, state "Unknown" or "Insufficient evidence" and explain what would confirm it.
- Prefer verifiable statements over plausible-sounding statements.
- Use web search to verify any claim that is time-sensitive, numerical, or high-impact.
- Mark any statement not directly supported by a retrieved source as [Unverified] or [Inference].
- If sources disagree, represent both positions, state which is better supported, and why.
- Before finalizing, run a self-check for: contradictions, missing edge cases, and ungrounded claims.
- When you cite a source, include the full URL. Every critical claim must be supported by a retrieved source.

{existing_context}

SEARCH TASK — Execute these searches using web search:

Phase 1 — Broad scan (run ALL of these searches):
1. GenAI LLM malware 2026
2. malicious PyPI npm AI package supply chain 2026
3. LLMjacking AI API key theft cloud abuse
4. malicious LLM model Hugging Face poisoned
5. WormGPT FraudGPT GhostGPT DarkGPT update
6. AI phishing deepfake social engineering BEC
7. shadow AI enterprise unauthorized LLM data leak
8. prompt injection jailbreak as a service LLM attack
9. MCP server vulnerability AI agent security exploit
10. nation state APT generative AI offensive cyber
11. malware using LLM for C2 or command generation
12. GenAI vibe coding tools abuse or compromise
13. Latest trojanised LLM models or GenAI packages


Phase 2 — Source-specific checks (search for recent posts from each):
ReversingLabs AI, Socket.dev AI, Phylum AI, Mandiant GenAI, Unit 42 AI,
Microsoft Security AI, CrowdStrike AI, Sysdig LLM, BleepingComputer AI malware,
The Hacker News AI security, Recorded Future AI threat, Abnormal Security AI

Phase 3 — Verification:
For each finding, search once more to corroborate it with a second source.
If no corroboration exists, include the finding but mark it [Single source].

OUTPUT FORMAT:
Respond with a single JSON object. No markdown fencing, no preamble, no explanation outside the JSON.

If new intelligence is found:
{{
  "status": "new_intel",
  "collection_date": "{TODAY}",
  "search_summary": "Brief description of what was searched and what was found",
  "findings": [
    {{
      "title": "Specific descriptive title of the finding",
      "slug": "kebab-case-slug-for-filename",
      "tags": ["supply-chain"],
      "tlp": "TLP:CLEAR",
      "confidence": "high|medium|low",
      "executive_summary": "2-3 sentences. Front-load the operationally relevant fact. State what happened, who is affected, what defenders should do.",
      "campaign_summary": {{
        "campaign_name": "Name of campaign or malware",
        "attribution": "Actor name or Unknown",
        "attribution_confidence": "high|medium|low|none",
        "target": "Who is targeted",
        "vector": "Delivery mechanism",
        "status": "active|disrupted|removed",
        "first_observed": "Date or month"
      }},
      "detailed_findings": "Multiple paragraphs. Attribute every claim: 'According to [Source]...' or '[Source] reported...'. No filler. Every sentence contributes information. If multi-phase campaign, describe each phase.",
      "mitre_attack": [
        {{
          "technique": "Full Technique Name",
          "id": "T1234.001",
          "context": "How this technique applies in this specific campaign"
        }}
      ],
      "iocs": {{
        "domains": ["exact.domain.com"],
        "urls": ["exact.domain.com/path/to/resource"],
        "hashes": ["sha256_hash_value"],
        "ips": ["1.2.3.4"],
        "packages": ["pypi:package-name", "npm:package-name"],
        "note": "Source of these IOCs or 'No IOCs published by source'"
      }},
      "actors": [
        {{
          "name": "Primary Name",
          "aliases": ["Alias1", "Alias2"],
          "type": "malicious_llm_tool|malware|threat_group|supply_chain_campaign|nation_state_campaign|nation_state_program",
          "status": "active|disrupted|inactive",
          "distribution": ["channel1", "channel2"],
          "ttps": ["T1234 - Technique Name", "T1235 - Technique Name"],
          "attribution": "Attributed to X (confidence: high/medium/low) or Unattributed",
          "description": "One paragraph description of the actor/malware"
        }}
      ],
      "detection_recommendations": "Specific detection guidance referencing log sources: web proxy, DNS, EDR, cloud audit logs. Include field names or search patterns where possible. No generic filler.",
      "references": [
        {{
          "source": "Publisher Name",
          "title": "Exact Article Title",
          "url": "https://full-url-to-article",
          "date": "YYYY-MM-DD or YYYY-MM"
        }}
      ]
    }}
  ]
}}

If NO new intelligence is found:
{{
  "status": "no_new_intel",
  "collection_date": "{TODAY}",
  "search_summary": "Searched N sources across M queries. No new GenAI/LLM threat intelligence published since last collection."
}}

CRITICAL REMINDERS:
- Only include findings genuinely published within the last 7 days
- Do not duplicate campaigns already listed in the existing coverage section above
- Every IOC must come from a source, not from inference
- Every reference URL must be a real URL you actually retrieved during search
- MITRE ATT&CK IDs must be valid: T followed by 4 digits, optionally .3 digits
- Respond ONLY with the JSON object, nothing else"""


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
    lines.append(f"**TLP:** {finding.get('tlp', 'TLP:CLEAR')}")
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
        "tags": finding.get('tags', []),
        "tlp": finding.get('tlp', 'TLP:CLEAR'),
        "excerpt": finding['executive_summary'],
        "file": filename
    }

    index['posts'].insert(0, entry)
    save_json(index_path, index)
    return filename


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
            if new_actor.get('attribution') and not existing.get('attribution'):
                existing['attribution'] = new_actor['attribution']
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
                "description": new_actor.get('description', '')
            }
            if new_actor.get('attribution'):
                entry['attribution'] = new_actor['attribution']
            actors['entries'].append(entry)
            print(f"  Added new actor: {new_actor['name']}")

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
        response = client.messages.create(
            model=MODEL,
            max_tokens=16000,
            tools=[{"type": "web_search_20250305", "name": "web_search"}],
            messages=[{"role": "user", "content": prompt}]
        )
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
    try:
        cleaned = response_text.strip()
        # Remove markdown fencing if present
        cleaned = re.sub(r'^```(?:json)?\s*\n?', '', cleaned)
        cleaned = re.sub(r'\n?\s*```\s*$', '', cleaned)
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"ERROR: Failed to parse API response as JSON: {e}")
        print(f"First 500 chars of response:\n{response_text[:500]}")
        # Try to extract JSON from mixed content
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            try:
                result = json.loads(json_match.group())
                print("Recovered JSON from mixed response content")
            except json.JSONDecodeError:
                print("Could not recover JSON. Exiting.")
                sys.exit(1)
        else:
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

        update_actors(finding)
        update_iocs(finding)

    print(f"\n{'='*60}")
    print(f"Collection complete. {len(findings)} report(s) generated.")
    print(f"Run: git add -A && git commit -m 'intel: {TODAY}' && git push")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
