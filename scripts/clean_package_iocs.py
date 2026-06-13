#!/usr/bin/env python3
"""Audit and clean package IOC values. Run with --audit-only for Phase 0."""

from __future__ import annotations

import argparse
import json
import re
from copy import deepcopy
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
IOCS_PATH = REPO_ROOT / "data" / "iocs.json"
AUDIT_PATH = REPO_ROOT / "package-ioc-audit.md"
CHANGELOG_PATH = REPO_ROOT / "package-ioc-cleanup-changelog.json"

PAREN_RE = re.compile(r"\s*\(([^)]+)\)\s*$")
AGGREGATE_RE = re.compile(
    r"\d+\s+additional|additional packages|in @[\w-]+ namespace",
    re.I,
)
COMPARATOR_RE = re.compile(r"[<>=]{1,2}")
VERSION_RANGE_RE = re.compile(r"\bversions?\b|\bto\b", re.I)
HF_REPO_MARKERS = ("huggingface:", "open-oss/", "(hugging face")
KNOWN_HF_REPO_SLUGS = {"open-oss/privacy-filter"}
SPACE_COMPARATOR_RE = re.compile(r"\s[<>]=?\s")
OWNER_REPO_RE = re.compile(r"^@[^/]+/[^/]+$|^[^/@:]+/[^/@:]+$")
AFFECTED_CTX_RE = re.compile(
    r"\baffected\s*[<>=,]|versions?\s+[\d.]+\s+to\s+[\d.]+|\ball versions\b",
    re.I,
)
CVE_BARE_PRODUCTS = frozenset(
    {
        "flowise",
        "lmdeploy",
        "langflow",
        "semantic-kernel",
        "litellm",
        "nanobot",
        "vllm",
    }
)


def is_vulnerability_range_package(ioc: dict, value: str) -> tuple[bool, str]:
    ctx = str(ioc.get("context", ""))
    if AFFECTED_CTX_RE.search(ctx):
        return True, AFFECTED_CTX_RE.search(ctx).group(0).strip()

    campaign = str(ioc.get("campaign", ""))
    bare = re.sub(r"^(?:npm|pypi|nuget):", "", value, flags=re.I).lower()
    has_exact_pin = "@" in value and not re.search(r"@[<>=]", value)

    if has_exact_pin:
        return False, ""

    if bare in CVE_BARE_PRODUCTS and "cve-" in campaign:
        return True, f"CVE campaign bare product indicator ({bare})"

    return False, ""


def append_context(context: str, note: str) -> str:
    note = note.strip()
    if not note:
        return context
    base = (context or "").strip()
    if note.lower() in base.lower():
        return base
    return f"{base} | {note}" if base else note


def infer_registry(name: str, note: str = "") -> str:
    combined = f"{name} {note}".lower()
    bare = re.sub(r"^(?:npm|pypi|nuget):", "", name, flags=re.I)
    if bare.startswith("@"):
        return "npm"
    if ".net" in combined or "nuget" in combined:
        return "nuget"
    if "pypi" in combined or "python" in combined or bare in {
        "xinference", "scraper-npm", "nanobot", "vllm", "lmdeploy", "semantic-kernel"
    }:
        return "pypi"
    if bare in {"flowise", "langflow"} or "npm" in combined:
        return "npm"
    return ""


def is_hf_repo_package(value: str) -> bool:
    head = PAREN_RE.sub("", value).strip().lower()
    if head.startswith("huggingface:"):
        return True
    if head in KNOWN_HF_REPO_SLUGS:
        return True
    if "(hugging face" in value.lower():
        return True
    return False


def classify_package(value: str) -> str:
    if AGGREGATE_RE.search(value):
        return "aggregate_remove_or_expand"
    if is_hf_repo_package(value):
        return "convert_to_url_path"
    if PAREN_RE.search(value):
        note = PAREN_RE.search(value).group(1)
        if VERSION_RANGE_RE.search(note) or "all versions" in note.lower():
            return "affected_product_review"
        head = PAREN_RE.sub("", value).strip()
        if head and not COMPARATOR_RE.search(head) and " " not in head:
            return "clean_value_move_note_to_context"
        return "affected_product_review"
    if "==" in value:
        return "clean_value_move_note_to_context"
    if COMPARATOR_RE.search(value) or VERSION_RANGE_RE.search(value) or " " in value:
        return "affected_product_review"
    return "keep_clean"


def transform_package(ioc: dict, existing: list[dict]) -> tuple[dict | None, str, str | None]:
    value = str(ioc.get("value", "")).strip()
    classification = classify_package(value)
    ctx = str(ioc.get("context", ""))

    if classification == "aggregate_remove_or_expand":
        return None, "removed", "aggregate description is not an exact package indicator"

    if classification == "convert_to_url_path":
        head = PAREN_RE.sub("", value).strip()
        if head.startswith("huggingface:"):
            url = head.replace("huggingface:", "huggingface.co/", 1)
        elif head.startswith("http"):
            url = re.sub(r"^https?://(www\.)?", "", head).rstrip("/")
        else:
            url = f"huggingface.co/{head}"
        note = PAREN_RE.search(value)
        new_ctx = append_context(ctx, note.group(1)) if note else ctx
        for other in existing:
            if other is ioc:
                continue
            if other.get("type") == "url_path" and other.get("value") == url:
                if other.get("campaign") == ioc.get("campaign"):
                    return None, "removed", f"duplicate url_path already exists: {url}"
        return {**ioc, "type": "url_path", "value": url, "context": new_ctx}, "converted_to_url_path", None

    if classification == "clean_value_move_note_to_context":
        if "==" in value:
            name, ver = value.split("==", 1)
            clean = f"pypi:{name.strip()}@{ver.strip()}"
            updated = {**ioc, "value": clean}
            return updated, "converted_pin", None
        m = PAREN_RE.search(value)
        if m:
            clean = value[: m.start()].strip()
            note = m.group(1)
            if "pypi variant" in note.lower() and not clean.startswith("pypi:"):
                clean = f"pypi:{clean}"
            updated = {**ioc, "value": clean, "context": append_context(ctx, note)}
            is_range, detail = is_vulnerability_range_package(updated, clean)
            if is_range:
                reason = "affected product version range is not an exact package IOC; retain in report prose"
                if detail:
                    reason = f"{reason}: {detail}"
                return None, "removed", reason
            return updated, "clean_value_move_note_to_context", None

    if classification == "affected_product_review":
        note_parts = []
        clean = value

        m = PAREN_RE.search(value)
        if m:
            note_parts.append(m.group(1))
            clean = value[: m.start()].strip()

        if SPACE_COMPARATOR_RE.search(clean):
            parts = SPACE_COMPARATOR_RE.split(clean, maxsplit=1)
            note_parts.append(f"affected {parts[1].strip()}" if len(parts) > 1 else "")
        elif "@<" in clean or "@>" in clean or "@<=" in clean or "@>=" in clean:
            _, ver = re.split(r"@(?=[<>])", clean, maxsplit=1)
            note_parts.append(f"affected {ver.strip()}")
        elif COMPARATOR_RE.search(clean):
            m2 = re.match(r"^([^<>=,]+)(.+)$", clean)
            if m2:
                note_parts.append(f"affected {m2.group(2).strip()}")

        if VERSION_RANGE_RE.search(value):
            note_parts.append(value)

        detail = "; ".join(p for p in note_parts if p)
        reason = "affected product version range is not an exact package IOC; retain in report prose"
        if detail:
            reason = f"{reason}: {detail}"
        return None, "removed", reason

    head = value
    if (
        OWNER_REPO_RE.match(head)
        and not re.match(r"^(?:npm|pypi|nuget|chrome-extension):", head, re.I)
        and not is_hf_repo_package(value)
    ):
        return {**ioc, "value": f"npm:{head}"}, "prefixed_registry", None

    is_range, detail = is_vulnerability_range_package(ioc, value)
    if is_range:
        reason = "affected product version range is not an exact package IOC; retain in report prose"
        if detail:
            reason = f"{reason}: {detail}"
        return None, "removed", reason

    return ioc, "keep_clean", None


def audit_packages(iocs: list[dict]) -> list[dict]:
    rows = []
    for ioc in iocs:
        if ioc.get("type") != "package":
            continue
        value = str(ioc.get("value", ""))
        cls = classify_package(value)
        _, action, reason = transform_package(ioc, iocs)
        proposed = action
        if action == "removed":
            proposed = f"remove: {reason}"
        elif action not in ("keep_clean", "unchanged"):
            proposed = action
        rows.append(
            {
                "value": value,
                "campaign": ioc.get("campaign", ""),
                "source": ioc.get("source", ""),
                "status": ioc.get("status", ""),
                "first_seen": ioc.get("first_seen", ""),
                "context": ioc.get("context", ""),
                "classification": cls,
                "proposed_action": proposed,
            }
        )
    return rows


def write_audit(rows: list[dict]) -> None:
    lines = [
        "# Package IOC Audit",
        "",
        f"Generated: {date.today().isoformat()}",
        f"Package IOCs reviewed: {len(rows)}",
        "",
    ]
    for row in rows:
        lines.extend(
            [
                f"## {row['value']}",
                f"- campaign: {row['campaign']}",
                f"- source: {row['source']}",
                f"- status: {row['status']}",
                f"- first_seen: {row['first_seen']}",
                f"- classification: {row['classification']}",
                f"- proposed_action: {row['proposed_action']}",
                f"- context: {row['context'][:200]}",
                "",
            ]
        )
    AUDIT_PATH.write_text("\n".join(lines))


def clean_iocs(iocs_data: dict) -> tuple[dict, dict]:
    iocs = iocs_data.get("iocs", [])
    changelog = {"changed": [], "removed": [], "converted_type": []}
    new_iocs = []

    for ioc in iocs:
        if ioc.get("type") != "package":
            new_iocs.append(ioc)
            continue

        updated, action, reason = transform_package(ioc, iocs)
        old_value = ioc.get("value")

        if updated is None:
            changelog["removed"].append(
                {"value": old_value, "campaign": ioc.get("campaign"), "reason": reason}
            )
            continue

        if action != "keep_clean":
            entry = {
                "old_value": old_value,
                "new_value": updated.get("value"),
                "old_type": ioc.get("type"),
                "new_type": updated.get("type"),
                "action": action,
                "campaign": ioc.get("campaign"),
            }
            if action == "converted_to_url_path":
                changelog["converted_type"].append(entry)
            else:
                changelog["changed"].append(entry)

        new_iocs.append(updated)

    return {**iocs_data, "iocs": new_iocs, "last_updated": date.today().isoformat()}, changelog


def regenerate_changelog_from_baseline() -> dict:
    import subprocess

    baseline_json = subprocess.check_output(
        ["git", "show", "origin/main:data/iocs.json"],
        cwd=REPO_ROOT,
    )
    data = json.loads(baseline_json)
    _, changelog = clean_iocs(data)
    CHANGELOG_PATH.write_text(json.dumps(changelog, indent=2) + "\n")
    return changelog


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audit-only", action="store_true")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument(
        "--regenerate-changelog",
        action="store_true",
        help="Rebuild package-ioc-cleanup-changelog.json from origin/main baseline",
    )
    args = parser.parse_args()

    if args.regenerate_changelog:
        changelog = regenerate_changelog_from_baseline()
        print(
            "Regenerated changelog from origin/main baseline: "
            f"{len(changelog['changed'])} changed, "
            f"{len(changelog['removed'])} removed, "
            f"{len(changelog['converted_type'])} converted"
        )
        return

    data = json.loads(IOCS_PATH.read_text())
    rows = audit_packages(data.get("iocs", []))
    write_audit(rows)
    print(f"Wrote audit: {AUDIT_PATH} ({len(rows)} package IOCs)")

    if args.audit_only:
        return

    if not args.apply:
        print("Use --apply to modify data/iocs.json")
        return

    cleaned, changelog = clean_iocs(data)
    IOCS_PATH.write_text(json.dumps(cleaned, indent=2) + "\n")
    CHANGELOG_PATH.write_text(json.dumps(changelog, indent=2) + "\n")
    print(f"Cleaned {len(changelog['changed'])} values, removed {len(changelog['removed'])}, converted {len(changelog['converted_type'])}")


if __name__ == "__main__":
    main()
