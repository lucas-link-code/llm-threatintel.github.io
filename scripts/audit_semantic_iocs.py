#!/usr/bin/env python3
"""Semantic IOC audit and conservative cleanup. Run without --apply for Phase 0 only."""

from __future__ import annotations

import argparse
import json
import re
import urllib.parse
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
IOCS_PATH = REPO_ROOT / "data" / "iocs.json"
POLICY_PATH = REPO_ROOT / "validation" / "policy.json"
AUDIT_PATH = REPO_ROOT / "ioc-semantic-audit.md"
CHANGELOG_PATH = REPO_ROOT / "ioc-semantic-cleanup-changelog.json"

DEFINITE_REMOVE_PACKAGES = frozenset(
    {
        "ollama",
        "grok",
        "bankrbot",
        "grok-bankr-integration",
        "n8n",
        "LangFlow",
        "gpt-researcher",
        "upsonic",
        "mcp-inspector",
        "librechat",
        "weknora",
        "cursor-mcp",
        "sub2api",
        "new-api",
        "one-api",
    }
)

NEEDS_REVIEW_VALUES = frozenset()

TIER2_REMOVE_VALUES = frozenset(
    {
        "praisonai",
        "praisonaiagents",
        "nginx-ui",
        "marimo",
        "openclaw",
        "doris-mcp-server",
        "alibabacloud-rds-openapi-mcp-server",
        "huggingface-hub",
        "Microsoft.SemanticKernel.Core",
        "npm:@akoskm/create-mcp-server-stdio",
        "github.com/startreedata/mcp-pinot",
    }
)

DEFINITE_REMOVE_URLS = frozenset(
    {
        "https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html",
        "https://thehackernews.com/2026/04/litellm-cve-2026-42208-sql-injection.html",
        "https://docs.litellm.ai/blog/security-update-march-2026",
        "github.com/adversa-ai/research/tree/main/artifacts/trustfall-mcp-settings-rce/poc",
        "github.com/adversa-ai/research/tree/main/artifacts/trustfall-mcp-settings-rce/poc-ci-pipeline",
        "https://twitter.com/bankrbot",
        "https://base.blockscout.com/tx/0x6fc7eb7da9379383efda4253e4f599bbc3a99afed0468eabfe18484ec525739a",
        "base.blockscout.com",
        "x.com",
    }
)

MALICIOUS_PACKAGE_PATTERNS = (
    re.compile(r"trojan|compromis|malicious|poison|stealer|infostealer|payload", re.I),
    re.compile(r"teampcp|shai-hulud|supply.?chain", re.I),
)

REVIEW_EVIDENCE = {
    "praisonai": {
        "source_report": "posts/2026-05-19-cve-2026-44338-praisonai-auth-bypass-rapid-exploitation.md",
        "registry_package": "yes (PyPI praisonai)",
        "malicious_or_vulnerable": "vulnerable product; CVE auth bypass version range",
        "recommendation": "Detection Recommendations or Affected Product prose; not IOC Feed unless exact trojanized pin",
    },
    "praisonaiagents": {
        "source_report": "posts/2026-04-13-praisonaiagents-ssrf-cloud-metadata.md",
        "registry_package": "yes (PyPI praisonaiagents)",
        "malicious_or_vulnerable": "vulnerable product; CVE SSRF",
        "recommendation": "Detection Recommendations; not IOC Feed without exact malicious version",
    },
    "nginx-ui": {
        "source_report": "posts/2026-05-01-cve-2026-33032-mcpwn-nginx-ui-mcp-auth-bypass.md",
        "registry_package": "yes",
        "malicious_or_vulnerable": "vulnerable MCP server product",
        "recommendation": "Affected product prose; not IOC Feed",
    },
    "marimo": {
        "source_report": "posts/2026-04-13-marimo-preauth-rce-ai-dev-infrastructure.md",
        "registry_package": "yes",
        "malicious_or_vulnerable": "vulnerable product; report says no specific IOCs published",
        "recommendation": "Affected product prose; not IOC Feed",
    },
    "openclaw": {
        "source_report": "posts/2026-04-24-cve-2026-41349-openclaw-consent-bypass-agentic-rce.md",
        "registry_package": "uncertain (product name)",
        "malicious_or_vulnerable": "vulnerable product CVE",
        "recommendation": "Affected product prose; review before IOC Feed",
    },
    "doris-mcp-server": {
        "source_report": "posts/2026-05-19-akamai-mcp-back-end-vulnerabilities-doris-pinot-alibaba-rds.md",
        "registry_package": "yes (npm/pypi MCP server)",
        "malicious_or_vulnerable": "vulnerable MCP server; version range in context",
        "recommendation": "Dependency-hunting pivot or Detection Recommendations; review",
    },
    "alibabacloud-rds-openapi-mcp-server": {
        "source_report": "posts/2026-05-19-akamai-mcp-back-end-vulnerabilities-doris-pinot-alibaba-rds.md",
        "registry_package": "yes",
        "malicious_or_vulnerable": "vulnerable/disclosed MCP server; not trojanized",
        "recommendation": "Detection Recommendations; review",
    },
    "huggingface-hub": {
        "source_report": "posts/2026-06-11-cve-2026-4372-hugging-face-transformers-rce.md",
        "registry_package": "yes (PyPI huggingface-hub)",
        "malicious_or_vulnerable": "vulnerable library; CVE affected product",
        "recommendation": "Affected product prose; not IOC Feed without trojanized pin",
    },
    "Microsoft.SemanticKernel.Core": {
        "source_report": "posts/2026-05-18-microsoft-semantic-kernel-cve-2026-25592-26030-rce.md",
        "registry_package": "yes (NuGet)",
        "malicious_or_vulnerable": "vulnerable NuGet package; CVE",
        "recommendation": "Affected product prose; not IOC Feed",
    },
    "npm:@akoskm/create-mcp-server-stdio": {
        "source_report": "posts/2026-04-22-anthropic-mcp-stdio-rce-7k-servers.md",
        "registry_package": "yes (npm @akoskm/create-mcp-server-stdio)",
        "malicious_or_vulnerable": "vulnerable MCP server package CVE-2025-54994; not trojanized",
        "recommendation": "Affected MCP Platforms section or Detection Recommendations; not IOC Feed unless malicious publish confirmed",
    },
    "github.com/startreedata/mcp-pinot": {
        "source_report": "posts/2026-05-19-akamai-mcp-back-end-vulnerabilities-doris-pinot-alibaba-rds.md",
        "registry_package": "vendor GitHub repo path",
        "malicious_or_vulnerable": "vulnerable MCP server repo; not attacker-controlled",
        "recommendation": "Detection Recommendations or prose; review before url_path IOC",
    },
}


def load_policy() -> dict:
    return json.loads(POLICY_PATH.read_text())


def normalize_bare_package(value: str) -> str:
    return re.sub(r"^(?:npm|pypi|nuget|chrome-extension):", "", value, flags=re.I).lower()


def is_malicious_package_ioc(ioc: dict) -> bool:
    ctx = str(ioc.get("context", ""))
    value = str(ioc.get("value", ""))
    if "@" in value and not re.search(r"@[<>=]", value):
        if any(p.search(ctx) for p in MALICIOUS_PACKAGE_PATTERNS):
            return True
        if value.startswith(("npm:@", "pypi:", "npm:@redhat", "pypi:xinference")):
            return True
    return False


def classify_ioc(ioc: dict, policy: dict) -> tuple[str, str, str]:
    value = str(ioc.get("value", "")).strip()
    ioc_type = str(ioc.get("type", "")).strip()
    ctx = str(ioc.get("context", ""))

    if value in TIER2_REMOVE_VALUES:
        ev = REVIEW_EVIDENCE.get(value, {})
        reason = "Affected/vulnerable product or vendor repo; not attacker-controlled IOC"
        if ev:
            reason = f"{reason}. Source: {ev.get('source_report', '')}. Registry: {ev.get('registry_package', '')}. {ev.get('malicious_or_vulnerable', '')}. {ev.get('recommendation', '')}"
        return "affected_product_not_ioc", reason, "remove"

    if value in NEEDS_REVIEW_VALUES:
        reason = "Tier 2 item; requires explicit review before removal"
        if value in REVIEW_EVIDENCE:
            ev = REVIEW_EVIDENCE[value]
            reason = (
                f"{reason}. Source: {ev['source_report']}. "
                f"Registry: {ev['registry_package']}. "
                f"Status: {ev['malicious_or_vulnerable']}. "
                f"Recommendation: {ev['recommendation']}"
            )
        return "needs_my_review", reason, "keep_pending_review"

    if ioc_type == "package" and value in DEFINITE_REMOVE_PACKAGES:
        if value == "grok-bankr-integration":
            return "conceptual_label_not_ioc", "Conceptual integration label, not registry artifact", "remove"
        if value in {"grok", "bankrbot", "ollama"}:
            cls = "legitimate_platform_not_ioc" if value in {"grok", "ollama"} else "affected_product_not_ioc"
            return cls, f"Affected/abused platform or agent, not malicious package IOC", "remove"
        return "affected_product_not_ioc", "Exposed/affected platform or template, not malicious package IOC", "remove"

    if value in DEFINITE_REMOVE_URLS or (
        ioc_type == "url_path" and value in DEFINITE_REMOVE_URLS
    ):
        if "adversa-ai" in value and "/poc" in value:
            return "safe_poc_not_ioc", "Researcher safe PoC path, not attacker infrastructure", "remove"
        if "thehackernews.com" in value or "docs.litellm.ai" in value:
            return "reference_url_not_ioc", "Source article or vendor advisory URL", "remove"
        if "twitter.com" in value or "blockscout.com" in value:
            return "evidence_url_not_ioc", "Victim profile or blockchain explorer evidence link", "remove"
        if value == "x.com":
            return "legitimate_platform_not_ioc", "Major platform delivery channel, not attacker infra", "remove"
        return "reference_url_not_ioc", "Reference or evidence URL misclassified as IOC", "remove"

    if ioc_type == "domain" and value in DEFINITE_REMOVE_URLS:
        if value == "x.com":
            return "legitimate_platform_not_ioc", "Major platform delivery channel", "remove"
        if value == "base.blockscout.com":
            return "evidence_url_not_ioc", "Blockchain explorer host, not C2", "remove"

    if ioc_type == "package":
        if is_malicious_package_ioc(ioc):
            return "malicious_package", "Confirmed trojanized or compromised package pin", "keep"
        if "huggingface.co/" in value.lower() or value.lower().startswith("open-oss/"):
            return "malicious_repo_or_model_url", "Malicious model/repo indicator", "keep"

    if ioc_type == "url_path":
        low = value.lower()
        if "huggingface.co/open-oss" in low or "open-oss/privacy-filter" in low:
            return "malicious_repo_or_model_url", "Malicious Hugging Face repo path", "keep"
        if "github.com" in low and "adversa-ai" not in low:
            if any(p.search(ctx) for p in MALICIOUS_PACKAGE_PATTERNS):
                return "malicious_repo_or_model_url", "Potentially malicious repo in campaign context", "keep"

    deny = {n.lower() for n in policy.get("affected_product_package_denylist", [])}
    if ioc_type == "package" and normalize_bare_package(value) in deny and "@" not in value:
        return "affected_product_not_ioc", "Bare affected product on denylist", "keep"

    return "true_indicator", "Actionable indicator or no semantic issue detected", "keep"


def audit_iocs(iocs_data: dict, policy: dict) -> tuple[list[dict], dict]:
    rows = []
    changelog = {"remove": [], "keep": [], "needs_review": []}

    for ioc in iocs_data.get("iocs", []):
        value = str(ioc.get("value", "")).strip()
        classification, reason, action = classify_ioc(ioc, policy)
        row = {
            "value": value,
            "type": ioc.get("type", ""),
            "campaign": ioc.get("campaign", ""),
            "source": ioc.get("source", ""),
            "status": ioc.get("status", ""),
            "first_seen": ioc.get("first_seen", ""),
            "context": ioc.get("context", ""),
            "classification": classification,
            "reason": reason,
            "proposed_action": action,
        }
        rows.append(row)
        entry = {k: row[k] for k in ("value", "type", "campaign", "classification", "reason", "proposed_action")}
        if action == "remove":
            changelog["remove"].append(entry)
        elif classification == "needs_my_review":
            changelog["needs_review"].append(entry)
        else:
            changelog["keep"].append(entry)

    return rows, changelog


def write_audit(rows: list[dict]) -> None:
    lines = [
        "# Semantic IOC Audit",
        "",
        f"Generated: {date.today().isoformat()}",
        f"IOCs reviewed: {len(rows)}",
        "",
    ]
    review_rows = [r for r in rows if r["classification"] == "needs_my_review"]
    remove_rows = [r for r in rows if r["proposed_action"] == "remove"]

    lines.extend(
        [
            "## Summary",
            f"- Proposed removals: {len(remove_rows)}",
            f"- Needs review: {len(review_rows)}",
            f"- Keep: {len(rows) - len(remove_rows) - len(review_rows)}",
            "",
            "## Needs Lucas Review",
            "",
        ]
    )
    for row in review_rows:
        lines.extend(_format_row(row))

    lines.extend(["## Proposed Removals", ""])
    for row in remove_rows:
        lines.extend(_format_row(row))

    lines.extend(["## All IOCs", ""])
    for row in rows:
        lines.extend(_format_row(row))

    AUDIT_PATH.write_text("\n".join(lines))


def _format_row(row: dict) -> list[str]:
    return [
        f"### {row['value']}",
        f"- type: {row['type']}",
        f"- campaign: {row['campaign']}",
        f"- source: {row['source']}",
        f"- status: {row['status']}",
        f"- first_seen: {row['first_seen']}",
        f"- classification: {row['classification']}",
        f"- reason: {row['reason']}",
        f"- proposed_action: {row['proposed_action']}",
        f"- context: {str(row['context'])[:300]}",
        "",
    ]


def apply_removals(iocs_data: dict, changelog: dict) -> dict:
    remove_values = {e["value"] for e in changelog["remove"]}
    kept = [ioc for ioc in iocs_data.get("iocs", []) if str(ioc.get("value", "")).strip() not in remove_values]
    return {**iocs_data, "iocs": kept, "last_updated": date.today().isoformat()}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Remove only definite false positives from data/iocs.json")
    args = parser.parse_args()

    policy = load_policy()
    data = json.loads(IOCS_PATH.read_text())
    rows, changelog = audit_iocs(data, policy)
    write_audit(rows)
    CHANGELOG_PATH.write_text(json.dumps(changelog, indent=2) + "\n")
    print(f"Wrote {AUDIT_PATH} ({len(rows)} IOCs)")
    print(f"Wrote {CHANGELOG_PATH}: {len(changelog['remove'])} remove, {len(changelog['needs_review'])} review")

    if args.apply:
        cleaned = apply_removals(data, changelog)
        IOCS_PATH.write_text(json.dumps(cleaned, indent=2) + "\n")
        print(f"Removed {len(data['iocs']) - len(cleaned['iocs'])} IOCs from {IOCS_PATH}")


if __name__ == "__main__":
    main()
