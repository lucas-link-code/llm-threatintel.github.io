#!/usr/bin/env python3
"""
LLM ThreatIntel site validator.

Read-only validation for repository data quality. The validator reports and
blocks unsafe publication; it never edits, deletes, merges, or rewrites
intelligence content.
"""

from __future__ import annotations

import argparse
import hashlib
import ipaddress
import json
import os
import re
import socket
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


VALIDATION_VERSION = "1.0.0"
STATE_FILE = Path("validation/validated-reports.json")
OVERRIDES_FILE = Path("validation/manual-evidence-overrides.json")
POLICY_FILE = Path("validation/policy.json")

ACCEPTABLE_URL_STATUSES = {200, 203}
REDIRECT_URL_STATUSES = {301, 302, 307, 308}
BLOCKED_URL_STATUSES = {403, 405}
RATE_LIMIT_URL_STATUSES = {429}
STRONG_REVIEW_URL_STATUSES = {404, 410}

URL_RE = re.compile(r"https?://[^\s\]\)<>\"']+")
H1_RE = re.compile(r"^#\s+\S+", re.MULTILINE)
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
MONTH_RE = re.compile(r"^\d{4}-\d{2}$")
YEAR_RE = re.compile(r"^\d{4}$")
HEX_RE = re.compile(r"^[A-Fa-f0-9]+$")
DOMAIN_RE = re.compile(
    r"^(?=.{1,253}$)(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z0-9-]{2,63}$"
)
PACKAGE_RE = re.compile(
    r"^(?:(?:npm|pypi):)?(?:@[A-Za-z0-9._-]+/)?[A-Za-z0-9._-]+"
    r"(?:@[A-Za-z0-9._<>=~!+\-]+)?$"
)
CVE_RE = re.compile(r"CVE-\d{4}-\d+", re.I)
AGGREGATE_DESC_RE = re.compile(
    r"\d+\+?\s+(identified|uploads|models|skills|affected|trojanized|"
    r"suspicious|unsafe|advisories|CVEs|compromised|malicious)",
    re.I,
)
PARENTHETICAL_PROSE_RE = re.compile(r"\([^)]{3,}\)")


DEFAULT_POLICY = {
    "validation_version": VALIDATION_VERSION,
    "allowed_tags": [
        "supply-chain",
        "malware",
        "malicious-tool",
        "nation-state",
        "shadow-ai",
        "llmjacking",
        "apt",
        "phishing",
        "model-poisoning",
        "prompt-injection",
        "mcp-security",
    ],
    "allowed_tlp": [
        "TLP:CLEAR",
        "TLP:GREEN",
        "TLP:AMBER",
        "TLP:AMBER+STRICT",
        "TLP:RED",
    ],
    "public_tlp": "TLP:CLEAR",
    "allowed_ioc_types": [
        "domain",
        "url_path",
        "ip",
        "sha256",
        "sha1",
        "md5",
        "hash",
        "package",
    ],
    "allowed_ioc_statuses": ["active", "removed", "inactive", "sinkholed", "unknown"],
    "accepted_source_headings": [
        "Sources",
        "Source",
        "References",
        "Reference",
        "Evidence",
        "External reporting",
        "Further reading",
    ],
    "placeholder_patterns": [
        r"\bTODO\b",
        r"\bFIXME\b",
        r"\bTBD\b",
        "INSERT SOURCE",
        "SOURCE NEEDED",
        r"\[SOURCE\]",
        "<TODO>",
        "lorem ipsum",
    ],
    "weak_source_labels": ["OSINT", "Unknown", "Community", "Reddit", "Twitter"],
    "excerpt_warning_length": 900,
    "url_timeout_seconds": 10,
    "url_redirect_limit": 5,
    "allow_url_path_scheme": True,
    "legacy_ioc_format_exceptions": {},
    "legitimate_platform_iocs_deny_list": {"domains": [], "url_paths": []},
    "legitimate_platform_ioc_overrides": [],
}


@dataclass
class Issue:
    severity: str
    code: str
    message: str
    file: str = ""
    record_id: str = ""
    recommendation: str = ""


@dataclass
class UrlCheckResult:
    url: str
    status: str
    http_status: int | None = None
    final_url: str | None = None
    error: str = ""


class LimitedRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self, limit: int):
        self.limit = limit
        self.count = 0
        super().__init__()

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: N802
        self.count += 1
        if self.count > self.limit:
            raise urllib.error.HTTPError(
                req.full_url,
                code,
                "redirect limit exceeded",
                headers,
                fp,
            )
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class Validator:
    def __init__(self, root: Path, args: argparse.Namespace):
        self.root = root
        self.args = args
        self.policy = self.load_policy()
        self.issues: list[Issue] = []
        self.url_results: list[UrlCheckResult] = []
        self.parsed: dict[str, Any] = {}
        self.report_hashes: dict[str, dict[str, str]] = {}
        self.reports_checked = 0
        self.reports_skipped = 0
        self.reports_newly_validated = 0
        self.state_updates = 0
        self.duplicate_iocs: dict[str, list[dict[str, str]]] = {}
        self.orphan_markdown: list[str] = []
        self.state = self.load_state()
        self.manual_overrides = self.load_overrides()

    def load_policy(self) -> dict[str, Any]:
        policy_path = self.root / POLICY_FILE
        if not policy_path.exists():
            return dict(DEFAULT_POLICY)
        try:
            loaded = json.loads(policy_path.read_text())
        except json.JSONDecodeError as exc:
            self.issues.append(
                Issue(
                    "fail",
                    "policy-json-parse",
                    f"validation policy is not valid JSON: {exc}",
                    str(POLICY_FILE),
                )
            )
            return dict(DEFAULT_POLICY)
        policy = dict(DEFAULT_POLICY)
        policy.update(loaded)
        return policy

    def load_state(self) -> dict[str, Any]:
        path = self.root / STATE_FILE
        if not path.exists():
            return {"validation_version": VALIDATION_VERSION, "reports": {}}
        try:
            state = json.loads(path.read_text())
        except json.JSONDecodeError as exc:
            self.add_issue(
                "fail",
                "state-json-parse",
                f"validated report state is not valid JSON: {exc}",
                str(STATE_FILE),
            )
            return {"validation_version": VALIDATION_VERSION, "reports": {}}
        if not isinstance(state.get("reports"), dict):
            self.add_issue(
                "fail",
                "state-contract",
                "validated report state must contain a reports object",
                str(STATE_FILE),
            )
            state["reports"] = {}
        return state

    def load_overrides(self) -> dict[str, Any]:
        path = self.root / OVERRIDES_FILE
        if not path.exists():
            return {"reports": {}}
        try:
            overrides = json.loads(path.read_text())
        except json.JSONDecodeError as exc:
            self.add_issue(
                "fail",
                "override-json-parse",
                f"manual evidence override file is not valid JSON: {exc}",
                str(OVERRIDES_FILE),
            )
            return {"reports": {}}
        if not isinstance(overrides.get("reports"), dict):
            self.add_issue(
                "fail",
                "override-contract",
                "manual evidence override file must contain a reports object",
                str(OVERRIDES_FILE),
            )
            overrides["reports"] = {}
        return overrides

    def rel(self, path: Path | str) -> str:
        path_obj = Path(path)
        if path_obj.is_absolute():
            try:
                return str(path_obj.relative_to(self.root))
            except ValueError:
                return str(path_obj)
        return str(path_obj)

    def add_issue(
        self,
        severity: str,
        code: str,
        message: str,
        file: str = "",
        record_id: str = "",
        recommendation: str = "",
    ) -> None:
        self.issues.append(Issue(severity, code, message, file, record_id, recommendation))

    def fail(self, code: str, message: str, file: str = "", record_id: str = "") -> None:
        self.add_issue("fail", code, message, file, record_id)

    def warn(self, code: str, message: str, file: str = "", record_id: str = "") -> None:
        self.add_issue("warn", code, message, file, record_id)

    def review(self, code: str, message: str, file: str = "", record_id: str = "") -> None:
        self.add_issue("review", code, message, file, record_id)

    def run(self) -> int:
        try:
            self.validate_requested_mode()
            if self.args.update_validation_state:
                self.write_state_if_changed()
            if self.args.write_report:
                self.write_reports()
            self.print_console_summary()
            return self.exit_code()
        except Exception as exc:  # noqa: BLE001 - validator errors should be explicit.
            print(f"Internal validator error: {exc}", file=sys.stderr)
            if self.args.verbose:
                raise
            return 3

    def validate_requested_mode(self) -> None:
        mode = self.args.mode
        if mode in {"audit", "structural", "strict", "full"}:
            self.run_structural_checks()
        if mode in {"audit", "strict", "full"}:
            self.run_strict_checks()
        if mode == "audit":
            self.mark_baseline_state()
        if mode in {"evidence", "full"}:
            if "posts" not in self.parsed:
                self.run_structural_checks()
            self.run_evidence_checks()

    def exit_code(self) -> int:
        if self.args.mode == "audit":
            return 0
        if self.count("fail"):
            return 1
        if self.args.fail_on_review_required and self.count("review"):
            return 2
        return 0

    def read_json(self, rel_path: str) -> Any | None:
        path = self.root / rel_path
        try:
            return json.loads(path.read_text())
        except FileNotFoundError:
            self.fail("json-missing", f"required JSON file is missing: {rel_path}", rel_path)
        except json.JSONDecodeError as exc:
            self.fail("json-parse", f"JSON parse failure: {exc}", rel_path)
        return None

    def run_structural_checks(self) -> None:
        posts_index = self.read_json("data/posts-index.json")
        blog_index = self.read_json("data/blog-index.json")
        iocs_data = self.read_json("data/iocs.json")
        actors_data = self.read_json("data/actors.json")

        self.parsed["posts"] = posts_index.get("posts", []) if isinstance(posts_index, dict) else []
        self.parsed["blog_posts"] = (
            blog_index.get("posts", []) if isinstance(blog_index, dict) else []
        )
        self.parsed["iocs"] = iocs_data.get("iocs", []) if isinstance(iocs_data, dict) else []
        self.parsed["actors"] = actors_data.get("entries", []) if isinstance(actors_data, dict) else []

        self.validate_posts_index(posts_index)
        self.validate_blog_index(blog_index)
        self.validate_iocs(iocs_data)
        self.validate_actors(actors_data)

    def run_strict_checks(self) -> None:
        self.validate_markdown_files()
        self.validate_duplicate_iocs()

    def validate_posts_index(self, data: Any | None) -> None:
        rel_path = "data/posts-index.json"
        if not isinstance(data, dict):
            self.fail("posts-index-contract", "posts-index.json must be an object", rel_path)
            return
        posts = data.get("posts")
        if not isinstance(posts, list):
            self.fail("posts-index-contract", "posts-index.json must contain a posts array", rel_path)
            return

        required = ["id", "title", "date", "author", "tags", "tlp", "excerpt", "file"]
        seen_ids: set[str] = set()
        seen_files: set[str] = set()
        dates: list[str] = []
        allowed_tags = set(self.policy["allowed_tags"])
        allowed_tlp = set(self.policy["allowed_tlp"])

        for idx, post in enumerate(posts):
            record = self.safe_record_id(post, idx)
            if not isinstance(post, dict):
                self.fail("post-entry-contract", "post entry must be an object", rel_path, record)
                continue
            for field in required:
                if field not in post:
                    self.fail("post-missing-field", f"post is missing required field: {field}", rel_path, record)

            post_id = str(post.get("id", "")).strip()
            file_name = str(post.get("file", "")).strip()
            title = str(post.get("title", "")).strip()
            excerpt = str(post.get("excerpt", "")).strip()
            date = str(post.get("date", "")).strip()

            if not post_id:
                self.fail("post-empty-id", "post id must be a non-empty string", rel_path, record)
            elif post_id in seen_ids:
                self.fail("post-duplicate-id", f"duplicate post id: {post_id}", rel_path, record)
            seen_ids.add(post_id)

            if not file_name.endswith(".md"):
                self.fail("post-file-extension", "post file must end with .md", rel_path, record)
            elif file_name in seen_files:
                self.fail("post-duplicate-file", f"duplicate post file reference: {file_name}", rel_path, record)
            seen_files.add(file_name)

            if post_id and file_name and Path(file_name).stem != post_id:
                self.fail(
                    "post-id-file-mismatch",
                    f"post id {post_id} does not match file stem {Path(file_name).stem}",
                    rel_path,
                    record,
                )

            if file_name and not (self.root / "posts" / file_name).exists():
                self.fail("post-missing-markdown", f"referenced Markdown file missing: posts/{file_name}", rel_path, record)

            if not title:
                self.fail("post-empty-title", "post title must be non-empty", rel_path, record)
            if not excerpt:
                self.fail("post-empty-excerpt", "post excerpt must be non-empty", rel_path, record)
            if self.has_placeholder(title):
                self.fail("post-title-placeholder", "post title contains unresolved placeholder text", rel_path, record)
            if self.has_placeholder(excerpt):
                self.fail("post-excerpt-placeholder", "post excerpt contains unresolved placeholder text", rel_path, record)

            if len(excerpt) > int(self.policy["excerpt_warning_length"]):
                self.warn("post-excerpt-long", f"post excerpt is long ({len(excerpt)} characters)", rel_path, record)

            if not self.valid_date(date):
                self.fail("post-date-invalid", f"invalid post date: {date}", rel_path, record)
            else:
                dates.append(date)

            tags = post.get("tags")
            if not isinstance(tags, list) or not tags:
                self.fail("post-tags-invalid", "post tags must be a non-empty array", rel_path, record)
            else:
                for tag in tags:
                    if tag not in allowed_tags:
                        self.fail("post-unknown-tag", f"unknown Intel Feed tag: {tag}", rel_path, record)

            tlp = post.get("tlp")
            if tlp not in allowed_tlp:
                self.fail("post-tlp-invalid", f"invalid TLP value: {tlp}", rel_path, record)
            elif tlp != self.policy["public_tlp"]:
                self.warn("post-tlp-public-warning", f"public feed post uses non-clear TLP: {tlp}", rel_path, record)

        if dates and dates != sorted(dates, reverse=True):
            self.warn("posts-not-reverse-chronological", "posts-index.json is not reverse chronological", rel_path)

    def validate_blog_index(self, data: Any | None) -> None:
        rel_path = "data/blog-index.json"
        if not isinstance(data, dict):
            self.fail("blog-index-contract", "blog-index.json must be an object", rel_path)
            return
        posts = data.get("posts")
        if not isinstance(posts, list):
            self.fail("blog-index-contract", "blog-index.json must contain a posts array", rel_path)
            return

        required = ["id", "title", "date", "author", "category", "tags", "excerpt", "file", "readTime"]
        seen_ids: set[str] = set()
        seen_files: set[str] = set()
        for idx, post in enumerate(posts):
            record = self.safe_record_id(post, idx)
            if not isinstance(post, dict):
                self.fail("blog-entry-contract", "blog entry must be an object", rel_path, record)
                continue
            for field in required:
                if field not in post:
                    self.fail("blog-missing-field", f"blog entry is missing required field: {field}", rel_path, record)

            post_id = str(post.get("id", "")).strip()
            file_name = str(post.get("file", "")).strip()
            date = str(post.get("date", "")).strip()

            if not post_id:
                self.fail("blog-empty-id", "blog id must be non-empty", rel_path, record)
            elif post_id in seen_ids:
                self.fail("blog-duplicate-id", f"duplicate blog id: {post_id}", rel_path, record)
            seen_ids.add(post_id)

            if not file_name.endswith(".md"):
                self.fail("blog-file-extension", "blog file must end with .md", rel_path, record)
            elif file_name in seen_files:
                self.fail("blog-duplicate-file", f"duplicate blog file reference: {file_name}", rel_path, record)
            seen_files.add(file_name)

            if file_name and not (self.root / "posts" / file_name).exists():
                self.fail("blog-missing-markdown", f"referenced Markdown file missing: posts/{file_name}", rel_path, record)

            if not self.valid_date(date):
                self.fail("blog-date-invalid", f"invalid blog date: {date}", rel_path, record)

            for field in ["title", "author", "category", "excerpt", "readTime"]:
                value = str(post.get(field, "")).strip()
                if not value:
                    self.fail("blog-empty-field", f"blog field must be non-empty: {field}", rel_path, record)
                if self.has_placeholder(value):
                    self.fail("blog-placeholder", f"blog field contains placeholder text: {field}", rel_path, record)

            if not isinstance(post.get("tags"), list):
                self.fail("blog-tags-invalid", "blog tags must be an array", rel_path, record)

    def validate_iocs(self, data: Any | None) -> None:
        rel_path = "data/iocs.json"
        if not isinstance(data, dict):
            self.fail("iocs-contract", "iocs.json must be an object", rel_path)
            return
        if not self.valid_date(str(data.get("last_updated", ""))):
            self.fail("iocs-last-updated-invalid", "iocs.json last_updated must be YYYY-MM-DD", rel_path)
        iocs = data.get("iocs")
        if not isinstance(iocs, list):
            self.fail("iocs-contract", "iocs.json must contain an iocs array", rel_path)
            return

        required = ["value", "type", "context", "first_seen", "source", "campaign", "status"]
        allowed_types = set(self.policy["allowed_ioc_types"])
        allowed_statuses = set(self.policy["allowed_ioc_statuses"])

        for idx, ioc in enumerate(iocs):
            record = str(idx)
            if not isinstance(ioc, dict):
                self.fail("ioc-entry-contract", "IOC entry must be an object", rel_path, record)
                continue
            for field in required:
                if field not in ioc:
                    self.fail("ioc-missing-field", f"IOC is missing required field: {field}", rel_path, record)

            value = str(ioc.get("value", "")).strip()
            ioc_type = str(ioc.get("type", "")).strip()
            status = str(ioc.get("status", "")).strip()

            if not value:
                self.fail("ioc-empty-value", "IOC value must be non-empty", rel_path, record)
            if ioc_type not in allowed_types:
                self.fail("ioc-type-invalid", f"invalid IOC type: {ioc_type}", rel_path, record)
            if status not in allowed_statuses:
                self.fail("ioc-status-invalid", f"invalid IOC status: {status}", rel_path, record)
            if not self.valid_date(str(ioc.get("first_seen", ""))):
                self.fail("ioc-date-invalid", f"invalid IOC first_seen date: {ioc.get('first_seen')}", rel_path, record)

            for field in ["context", "source", "campaign"]:
                if not str(ioc.get(field, "")).strip():
                    self.fail("ioc-empty-field", f"IOC field must be non-empty: {field}", rel_path, record)
                if self.has_placeholder(str(ioc.get(field, ""))):
                    self.fail("ioc-placeholder", f"IOC field contains placeholder text: {field}", rel_path, record)

            if value and ioc_type in allowed_types:
                self.validate_ioc_value(value, ioc_type, rel_path, record)
                self.validate_ioc_not_legitimate_platform(value, ioc_type, rel_path, record)

            source = str(ioc.get("source", "")).strip()
            if source in set(self.policy.get("weak_source_labels", [])):
                self.warn("ioc-weak-source", f"IOC has weak source label: {source}", rel_path, record)

    def validate_actors(self, data: Any | None) -> None:
        rel_path = "data/actors.json"
        if not isinstance(data, dict):
            self.fail("actors-contract", "actors.json must be an object", rel_path)
            return
        if "last_updated" in data and not self.valid_date(str(data.get("last_updated", ""))):
            self.fail("actors-last-updated-invalid", "actors.json last_updated must be YYYY-MM-DD", rel_path)
        entries = data.get("entries")
        if not isinstance(entries, list):
            self.fail("actors-contract", "actors.json must contain an entries array", rel_path)
            return

        seen_ids: set[str] = set()
        required = ["id", "names", "type", "first_seen", "status", "distribution", "ttps", "description"]
        for idx, actor in enumerate(entries):
            record = self.safe_record_id(actor, idx)
            if not isinstance(actor, dict):
                self.fail("actor-entry-contract", "actor entry must be an object", rel_path, record)
                continue
            for field in required:
                if field not in actor:
                    self.fail("actor-missing-field", f"actor is missing required field: {field}", rel_path, record)

            actor_id = str(actor.get("id", "")).strip()
            if not actor_id:
                self.fail("actor-empty-id", "actor id must be non-empty", rel_path, record)
            elif actor_id in seen_ids:
                self.fail("actor-duplicate-id", f"duplicate actor id: {actor_id}", rel_path, record)
            seen_ids.add(actor_id)

            names = actor.get("names")
            if not isinstance(names, list) or not any(str(name).strip() for name in names):
                self.fail("actor-names-invalid", "actor names must be a non-empty array", rel_path, record)
            else:
                for name in names:
                    if self.has_placeholder(str(name)):
                        self.fail("actor-placeholder", "actor name contains placeholder text", rel_path, record)

            for field in ["distribution", "ttps"]:
                if field in actor and not isinstance(actor.get(field), list):
                    self.fail("actor-array-invalid", f"actor field must be an array: {field}", rel_path, record)

            first_seen = str(actor.get("first_seen", "")).strip()
            if first_seen and not (
                self.valid_date(first_seen) or MONTH_RE.match(first_seen) or YEAR_RE.match(first_seen)
            ):
                self.fail("actor-first-seen-invalid", f"invalid actor first_seen: {first_seen}", rel_path, record)

            for field in ["type", "status", "description", "attribution"]:
                if field in actor and self.has_placeholder(str(actor.get(field, ""))):
                    self.fail("actor-placeholder", f"actor field contains placeholder text: {field}", rel_path, record)

    def validate_ioc_value(self, value: str, ioc_type: str, file: str, record: str) -> None:
        exceptions = self.policy.get("legacy_ioc_format_exceptions", {}).get(ioc_type, [])
        if value in exceptions:
            self.warn(
                "ioc-legacy-format-exception",
                f"legacy IOC format exception retained without modifying data: {value}",
                file,
                record,
            )
            return

        lowered = value.lower()
        if "[.]" in value or "hxxp://" in lowered or "hxxps://" in lowered:
            self.fail("ioc-defanged-json", f"IOC JSON value must be clean, not defanged: {value}", file, record)
            return

        if "*" in value:
            self.fail("ioc-wildcard-value", f"IOC value must not contain wildcards: {value}", file, record)
            return

        if CVE_RE.match(value):
            self.fail(
                "ioc-cve-as-value",
                f"CVE IDs are vulnerability identifiers, not IOC values: {value}",
                file,
                record,
            )
            return

        if AGGREGATE_DESC_RE.search(value):
            self.fail(
                "ioc-aggregate-description",
                f"IOC value is an aggregate description, not a specific indicator: {value}",
                file,
                record,
            )
            return

        paren_overrides = self.policy.get("parenthetical_value_overrides", [])
        if PARENTHETICAL_PROSE_RE.search(value) and value not in paren_overrides:
            self.fail(
                "ioc-prose-parenthetical",
                f"IOC value contains editorial prose in parentheses (move context to the context field): {value}",
                file,
                record,
            )
            return

        if ioc_type == "package":
            malware_names = self.policy.get("malware_family_denylist", [])
            malware_lower = {n.lower() for n in malware_names}
            if value in malware_names or value.lower() in malware_lower:
                self.fail(
                    "ioc-malware-name-as-package",
                    f"malware family name is not a package IOC (track in actors.json instead): {value}",
                    file,
                    record,
                )
                return

            affected = {n.lower() for n in self.policy.get("affected_product_package_denylist", [])}
            bare_name = re.sub(r"^(?:npm|pypi):", "", value, flags=re.I)
            if "@" not in bare_name and bare_name.lower() in affected:
                self.fail(
                    "ioc-affected-product-as-package",
                    f"bare affected product name is not a package IOC without registry/version context "
                    f"(use registry:name@version for specific compromised versions): {value}",
                    file,
                    record,
                )
                return

        if ioc_type == "domain":
            if "://" in value or "/" in value or any(ch.isspace() for ch in value):
                self.fail("ioc-domain-format", f"domain IOC must not contain scheme, path, or spaces: {value}", file, record)
            elif not self.valid_domain(value):
                self.fail("ioc-domain-format", f"invalid domain IOC: {value}", file, record)
        elif ioc_type == "url_path":
            self.validate_url_path_ioc(value, file, record)
        elif ioc_type == "ip":
            try:
                ipaddress.ip_address(value)
            except ValueError:
                self.fail("ioc-ip-format", f"invalid IP IOC: {value}", file, record)
        elif ioc_type in {"sha256", "sha1", "md5", "hash"}:
            self.validate_hash_ioc(value, ioc_type, file, record)
        elif ioc_type == "package":
            if any(ch.isspace() for ch in value) or not PACKAGE_RE.match(value):
                self.fail("ioc-package-format", f"invalid package IOC: {value}", file, record)

    def normalize_for_platform_check(self, value: str) -> str:
        """Normalize an IOC value for matching against the legitimate-platform deny list.

        Strips: descriptive parentheticals, scheme, www., query strings whose
        value contains a [PLACEHOLDER]-style token, and trailing slashes.
        Returns the lowercased remainder.
        """
        if not value:
            return ""
        v = re.sub(r"\s*\([^)]*\)\s*$", "", value).strip()
        v = v.lower()
        v = re.sub(r"^https?://", "", v)
        v = re.sub(r"^www\.", "", v)
        v = re.sub(r"\?[^=&]*=\[[^\]]*\].*$", "", v)
        v = v.rstrip("/")
        return v

    def validate_ioc_not_legitimate_platform(self, value: str, ioc_type: str, file: str, record: str) -> None:
        """Hard-fail if an IOC names a legitimate AI vendor platform.

        The match is exact (after normalisation), not prefix. A specific
        malicious URL containing an attacker-controlled identifier — e.g.
        claude.ai/share/Xy7AbC9KqM — will normalise to itself, not match
        the bare 'claude.ai/share' entry in the deny list, and pass.
        To allow a genuine compromise of one of these platforms, add the
        normalised value to legitimate_platform_ioc_overrides in
        validation/policy.json.
        """
        if ioc_type not in {"domain", "url_path"}:
            return
        deny = self.policy.get("legitimate_platform_iocs_deny_list", {}) or {}
        deny_domains = {str(d).lower() for d in deny.get("domains", [])}
        deny_url_paths = {str(p).lower() for p in deny.get("url_paths", [])}
        overrides = {str(o).lower() for o in self.policy.get("legitimate_platform_ioc_overrides", [])}

        normalised = self.normalize_for_platform_check(value)
        if not normalised or normalised in overrides:
            return

        if ioc_type == "domain":
            if normalised in deny_domains:
                self.fail(
                    "ioc-legitimate-platform",
                    f"IOC names a legitimate AI vendor platform domain (bare domains are not indicators; "
                    f"document the abuse in prose / Detection Recommendations instead, or add an explicit "
                    f"entry to legitimate_platform_ioc_overrides if this is a confirmed compromise of the "
                    f"platform itself): {value}",
                    file,
                    record,
                )
        elif ioc_type == "url_path":
            if normalised in deny_domains or normalised in deny_url_paths:
                self.fail(
                    "ioc-legitimate-platform",
                    f"IOC names a legitimate AI vendor platform endpoint or generic feature path (only "
                    f"URLs containing a specific attacker-controlled identifier qualify as indicators; "
                    f"add an explicit entry to legitimate_platform_ioc_overrides if this is a confirmed "
                    f"compromise of the platform itself): {value}",
                    file,
                    record,
                )

    def validate_url_path_ioc(self, value: str, file: str, record: str) -> None:
        if any(ch.isspace() for ch in value):
            self.fail("ioc-url-path-format", f"url_path IOC must not contain spaces: {value}", file, record)
            return
        parsed = urllib.parse.urlparse(value if "://" in value else f"//{value}", scheme="")
        if parsed.scheme and parsed.scheme not in {"http", "https"}:
            self.fail("ioc-url-path-format", f"url_path IOC has unsupported scheme: {value}", file, record)
            return
        if parsed.scheme and not self.policy.get("allow_url_path_scheme", False):
            self.fail("ioc-url-path-format", f"url_path IOC must not contain a scheme: {value}", file, record)
            return

        host = parsed.netloc.split("@")[-1].split(":")[0] if parsed.netloc else ""
        if not host or not self.valid_domain(host):
            self.fail("ioc-url-path-format", f"url_path IOC must start with a valid domain: {value}", file, record)
            return

        has_path_or_query = bool(parsed.path and parsed.path != "/") or bool(parsed.query)
        has_port = ":" in parsed.netloc
        if not has_path_or_query and not has_port:
            self.fail("ioc-url-path-format", f"url_path IOC must include a path, query, or port: {value}", file, record)
            return

        ref_domains = self.policy.get("reference_url_domain_denylist", [])
        if host and ref_domains:
            host_lower = host.lower()
            for ref_domain in ref_domains:
                if host_lower == ref_domain.lower() or host_lower.endswith("." + ref_domain.lower()):
                    self.fail(
                        "ioc-reference-url",
                        f"reference/documentation URL is not an IOC (cite in post References section instead): {value}",
                        file,
                        record,
                    )
                    return

    def validate_hash_ioc(self, value: str, ioc_type: str, file: str, record: str) -> None:
        expected = {"md5": 32, "sha1": 40, "sha256": 64}.get(ioc_type)
        if not HEX_RE.match(value):
            self.fail("ioc-hash-format", f"hash IOC must be hex: {value}", file, record)
            return
        if expected and len(value) != expected:
            self.fail("ioc-hash-format", f"{ioc_type} IOC has invalid length: {value}", file, record)
        elif ioc_type == "hash" and len(value) not in {32, 40, 64}:
            self.fail("ioc-hash-format", f"generic hash IOC must be 32, 40, or 64 hex chars: {value}", file, record)

    def validate_duplicate_iocs(self) -> None:
        values: dict[str, list[dict[str, str]]] = defaultdict(list)
        for ioc in self.parsed.get("iocs", []):
            if not isinstance(ioc, dict):
                continue
            value = str(ioc.get("value", "")).strip()
            ioc_type = str(ioc.get("type", "")).strip()
            normalized = self.normalize_ioc_for_comparison(value, ioc_type)
            if not normalized:
                continue
            values[normalized].append(
                {
                    "value": value,
                    "type": ioc_type,
                    "campaign": str(ioc.get("campaign", "")),
                    "source": str(ioc.get("source", "")),
                }
            )

        for normalized, records in sorted(values.items()):
            if len(records) < 2:
                continue
            types = {record["type"] for record in records}
            self.duplicate_iocs[normalized] = records
            if len(types) > 1:
                self.fail(
                    "ioc-conflicting-types",
                    f"normalized IOC appears under conflicting declared types: {normalized} ({', '.join(sorted(types))})",
                    "data/iocs.json",
                )
            else:
                self.warn(
                    "ioc-duplicate-review",
                    f"duplicate IOC review required: {normalized} appears {len(records)} times",
                    "data/iocs.json",
                )

    def validate_markdown_files(self) -> None:
        post_files = {post.get("file") for post in self.parsed.get("posts", []) if isinstance(post, dict)}
        blog_files = {post.get("file") for post in self.parsed.get("blog_posts", []) if isinstance(post, dict)}
        referenced = {f for f in post_files | blog_files if isinstance(f, str)}
        md_files = {p.name for p in (self.root / "posts").glob("*.md")}

        for file_name in sorted(referenced):
            path = self.root / "posts" / file_name
            if not path.exists():
                continue
            text = path.read_text(errors="replace")
            rel_path = f"posts/{file_name}"
            if not text.strip():
                self.fail("markdown-empty", "Markdown file is empty", rel_path)
            if not H1_RE.search(text):
                self.fail("markdown-missing-h1", "Markdown file has no H1 heading", rel_path)
            if self.has_placeholder(text):
                self.fail("markdown-placeholder", "Markdown file contains unresolved placeholder text", rel_path)

        intel_by_file = {
            post.get("file"): post for post in self.parsed.get("posts", []) if isinstance(post, dict)
        }
        for file_name, post in sorted(intel_by_file.items()):
            path = self.root / "posts" / str(file_name)
            if not path.exists():
                continue
            text = path.read_text(errors="replace")
            if not self.has_source_section(text):
                post_id = str(post.get("id", ""))
                if self.valid_manual_override(post_id) or self.unchanged_cached_report(post):
                    self.warn(
                        "markdown-source-section-covered",
                        "Intel report has no source section but is covered by cache or manual override",
                        f"posts/{file_name}",
                        post_id,
                    )
                else:
                    self.fail(
                        "markdown-source-section-missing",
                        "Intel report has no recognizable source/reference/evidence section",
                        f"posts/{file_name}",
                        post_id,
                    )

        for file_name in sorted(md_files - referenced):
            rel_path = f"posts/{file_name}"
            self.orphan_markdown.append(rel_path)
            self.warn("markdown-orphan", f"orphan Markdown file exists: {rel_path}", rel_path)

    def run_evidence_checks(self) -> None:
        for post in self.parsed.get("posts", []):
            if not isinstance(post, dict):
                continue
            if self.args.changed_only_evidence and not self.report_needs_evidence(post):
                self.reports_skipped += 1
                continue
            self.reports_checked += 1
            self.validate_report_evidence(post)

    def validate_report_evidence(self, post: dict[str, Any]) -> None:
        report_id = str(post.get("id", ""))
        file_name = str(post.get("file", ""))
        rel_path = f"posts/{file_name}"
        path = self.root / rel_path
        if not path.exists():
            return

        text = path.read_text(errors="replace")
        section = self.extract_source_section(text)
        urls = self.extract_urls(section or text)
        override = self.valid_manual_override(report_id)
        hashes = self.compute_report_hashes(post)

        if override:
            self.add_state_entry(
                post,
                hashes,
                "validated",
                "validated_with_alternate_sources",
                urls,
                warnings=["manual evidence override accepted"],
                reviews=[],
            )
            return

        if not self.has_source_section(text) or not urls:
            self.fail(
                "evidence-missing",
                "new or changed Intel report has no recognizable source section or source URLs",
                rel_path,
                report_id,
            )
            return

        if self.args.no_network:
            self.review(
                "evidence-network-disabled",
                "network evidence validation was requested but network checks are disabled",
                rel_path,
                report_id,
            )
            return

        results = [self.check_url(url) for url in urls]
        self.url_results.extend(results)
        statuses = Counter(result.status for result in results)
        accessible = statuses["accessible"] + statuses["redirected"]
        review_count = sum(
            statuses[key]
            for key in [
                "blocked",
                "rate_limited",
                "not_found",
                "timeout",
                "dns_error",
                "tls_error",
                "unknown_error",
            ]
        )

        warnings: list[str] = []
        reviews: list[str] = []
        if statuses["redirected"]:
            warnings.append(f"{statuses['redirected']} source URL(s) redirected")
        if review_count:
            reviews.append(f"{review_count} source URL(s) require review")

        if accessible:
            evidence_status = "validated_with_warnings" if warnings or reviews else "validated"
            if warnings:
                self.warn("evidence-url-warning", "; ".join(warnings), rel_path, report_id)
            if reviews:
                self.review("evidence-url-review", "; ".join(reviews), rel_path, report_id)
            self.add_state_entry(post, hashes, "validated", evidence_status, urls, warnings, reviews)
        else:
            self.review(
                "evidence-source-review-required",
                "no source URL was accessible; manual review or alternate evidence is required",
                rel_path,
                report_id,
            )

    def check_url(self, url: str) -> UrlCheckResult:
        for method in ["HEAD", "GET"]:
            try:
                headers = {
                    "User-Agent": "LLM-ThreatIntel-Validator/1.0 (+https://llm-threatintel.com)"
                }
                if method == "GET":
                    headers["Range"] = "bytes=0-2048"
                request = urllib.request.Request(url, method=method, headers=headers)
                redirect_handler = LimitedRedirectHandler(int(self.policy["url_redirect_limit"]))
                https_handler = urllib.request.HTTPSHandler(context=ssl.create_default_context())
                opener = urllib.request.build_opener(redirect_handler, https_handler)
                with opener.open(
                    request,
                    timeout=int(self.policy["url_timeout_seconds"]),
                ) as response:
                    code = response.getcode()
                    final_url = response.geturl()
                    return self.classify_http_result(url, code, final_url)
            except urllib.error.HTTPError as exc:
                if method == "HEAD" and exc.code in {405, 403, 429}:
                    continue
                return self.classify_http_result(url, exc.code, exc.geturl(), str(exc))
            except urllib.error.URLError as exc:
                if method == "HEAD":
                    continue
                return self.classify_url_error(url, exc)
            except TimeoutError as exc:
                if method == "HEAD":
                    continue
                return UrlCheckResult(url, "timeout", error=str(exc))
            except socket.timeout as exc:
                if method == "HEAD":
                    continue
                return UrlCheckResult(url, "timeout", error=str(exc))
            except ssl.SSLError as exc:
                return UrlCheckResult(url, "tls_error", error=str(exc))
        return UrlCheckResult(url, "unknown_error", error="URL check did not complete")

    def classify_http_result(
        self,
        url: str,
        code: int,
        final_url: str | None = None,
        error: str = "",
    ) -> UrlCheckResult:
        if code in ACCEPTABLE_URL_STATUSES:
            status = "accessible"
        elif code in REDIRECT_URL_STATUSES or (final_url and final_url != url and code < 400):
            status = "redirected"
        elif code in BLOCKED_URL_STATUSES:
            status = "blocked"
        elif code in RATE_LIMIT_URL_STATUSES:
            status = "rate_limited"
        elif code in STRONG_REVIEW_URL_STATUSES:
            status = "not_found"
        else:
            status = "unknown_error"
        return UrlCheckResult(url, status, code, final_url, error)

    def classify_url_error(self, url: str, exc: urllib.error.URLError) -> UrlCheckResult:
        reason = exc.reason
        if isinstance(reason, socket.timeout):
            return UrlCheckResult(url, "timeout", error=str(exc))
        if isinstance(reason, ssl.SSLError):
            return UrlCheckResult(url, "tls_error", error=str(exc))
        if isinstance(reason, socket.gaierror):
            return UrlCheckResult(url, "dns_error", error=str(exc))
        return UrlCheckResult(url, "unknown_error", error=str(exc))

    def report_needs_evidence(self, post: dict[str, Any]) -> bool:
        report_id = str(post.get("id", ""))
        hashes = self.compute_report_hashes(post)
        cached = self.state.get("reports", {}).get(report_id)
        if not isinstance(cached, dict):
            return True
        return not (
            cached.get("content_hash") == hashes["content_hash"]
            and cached.get("validation_version") == VALIDATION_VERSION
        )

    def unchanged_cached_report(self, post: dict[str, Any]) -> bool:
        return not self.report_needs_evidence(post)

    def mark_baseline_state(self) -> None:
        if not self.args.update_validation_state:
            return
        for post in self.parsed.get("posts", []):
            if not isinstance(post, dict):
                continue
            if not self.report_needs_evidence(post):
                continue
            hashes = self.compute_report_hashes(post)
            file_name = str(post.get("file", ""))
            text = (self.root / "posts" / file_name).read_text(errors="replace")
            urls = self.extract_urls(self.extract_source_section(text) or text)
            self.add_state_entry(
                post,
                hashes,
                "baseline_audit",
                "baseline_audit_no_network",
                urls,
                warnings=["baseline audit entry; source URLs were not network checked"],
                reviews=[],
                count_newly_validated=False,
            )

    def add_state_entry(
        self,
        post: dict[str, Any],
        hashes: dict[str, str],
        structure_status: str,
        evidence_status: str,
        urls: list[str],
        warnings: list[str],
        reviews: list[str],
        count_newly_validated: bool = True,
    ) -> None:
        report_id = str(post.get("id", ""))
        if not report_id:
            return
        self.state.setdefault("reports", {})[report_id] = {
            "report_id": report_id,
            "file": str(post.get("file", "")),
            "content_hash": hashes["content_hash"],
            "posts_index_hash": hashes["posts_index_hash"],
            "validated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            "validation_version": VALIDATION_VERSION,
            "structure_status": structure_status,
            "evidence_status": evidence_status,
            "source_urls": urls,
            "warnings": warnings,
            "review_required": reviews,
        }
        self.state_updates += 1
        if count_newly_validated:
            self.reports_newly_validated += 1

    def write_state_if_changed(self) -> None:
        if not self.state_updates:
            return
        path = self.root / STATE_FILE
        path.parent.mkdir(parents=True, exist_ok=True)
        self.state["validation_version"] = VALIDATION_VERSION
        self.state["generated_by"] = "scripts/validate_site.py"
        new_text = json.dumps(self.state, indent=2, sort_keys=True) + "\n"
        old_text = path.read_text() if path.exists() else ""
        if new_text != old_text:
            path.write_text(new_text)

    def compute_report_hashes(self, post: dict[str, Any]) -> dict[str, str]:
        report_id = str(post.get("id", ""))
        file_name = str(post.get("file", ""))
        md_path = self.root / "posts" / file_name
        markdown = md_path.read_text(errors="replace") if md_path.exists() else ""
        metadata_text = json.dumps(post, sort_keys=True, separators=(",", ":"))
        related_iocs = self.related_iocs_for_post(report_id)
        related_iocs_text = json.dumps(related_iocs, sort_keys=True, separators=(",", ":"))
        content_hash = self.sha256_text(
            "\n".join(["markdown:", markdown, "metadata:", metadata_text, "iocs:", related_iocs_text])
        )
        return {
            "content_hash": content_hash,
            "posts_index_hash": self.sha256_text(metadata_text),
        }

    def related_iocs_for_post(self, report_id: str) -> list[dict[str, Any]]:
        stripped = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", report_id)
        related = []
        for ioc in self.parsed.get("iocs", []):
            if not isinstance(ioc, dict):
                continue
            campaign = str(ioc.get("campaign", ""))
            if campaign in {report_id, stripped}:
                related.append(ioc)
        return sorted(related, key=lambda item: (str(item.get("type", "")), str(item.get("value", ""))))

    def valid_manual_override(self, report_id: str) -> bool:
        override = self.manual_overrides.get("reports", {}).get(report_id)
        if not isinstance(override, dict):
            return False
        approved_by = str(override.get("approved_by", "")).strip()
        approved_at = str(override.get("approved_at", "")).strip()
        reason = str(override.get("reason", "")).strip()
        supporting = override.get("supporting_sources", [])
        if not approved_by or not self.valid_date(approved_at) or not reason:
            self.warn("override-invalid", f"manual override is incomplete for {report_id}", str(OVERRIDES_FILE), report_id)
            return False
        if supporting and not all(self.valid_url_syntax(str(url)) for url in supporting):
            self.warn("override-invalid-url", f"manual override has invalid supporting source URL for {report_id}", str(OVERRIDES_FILE), report_id)
            return False
        if supporting or "manual" in reason.lower() or "loads manually" in reason.lower():
            return True
        self.warn("override-weak", f"manual override lacks supporting URL or explicit manual validation reason for {report_id}", str(OVERRIDES_FILE), report_id)
        return False

    def extract_source_section(self, text: str) -> str:
        headings = "|".join(re.escape(h) for h in self.policy["accepted_source_headings"])
        match = re.search(rf"^##\s+(?:{headings})\s*$", text, re.IGNORECASE | re.MULTILINE)
        if not match:
            return ""
        next_heading = re.search(r"^##\s+\S.*$", text[match.end() :], re.MULTILINE)
        if not next_heading:
            return text[match.start() :]
        return text[match.start() : match.end() + next_heading.start()]

    def has_source_section(self, text: str) -> bool:
        return bool(self.extract_source_section(text))

    def extract_urls(self, text: str) -> list[str]:
        urls = []
        seen = set()
        for match in URL_RE.finditer(text):
            url = match.group(0).rstrip(".,;:")
            if url not in seen:
                urls.append(url)
                seen.add(url)
        return urls

    def has_placeholder(self, text: str) -> bool:
        for pattern in self.policy["placeholder_patterns"]:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    def valid_date(self, value: str) -> bool:
        if not DATE_RE.match(value):
            return False
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return True
        except ValueError:
            return False

    def valid_url_syntax(self, value: str) -> bool:
        parsed = urllib.parse.urlparse(value)
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)

    def valid_domain(self, value: str) -> bool:
        if not DOMAIN_RE.match(value):
            return False
        labels = value.rstrip(".").split(".")
        return all(label and not label.startswith("-") and not label.endswith("-") for label in labels)

    def normalize_ioc_for_comparison(self, value: str, ioc_type: str) -> str:
        if not value:
            return ""
        normalized = value.strip().replace("[.]", ".")
        normalized = re.sub(r"^hxxps?://", lambda m: "https://" if "s" in m.group(0) else "http://", normalized, flags=re.I)
        normalized = normalized.lower()
        if ioc_type == "url_path":
            normalized = re.sub(r"^https?://", "", normalized)
            return normalized.rstrip("/")
        if ioc_type == "domain":
            return normalized.rstrip("/")
        if ioc_type == "package":
            return re.sub(r"^(npm|pypi):", lambda m: m.group(1).lower() + ":", normalized, flags=re.I)
        if ioc_type in {"sha256", "sha1", "md5", "hash"}:
            return normalized
        return normalized

    def safe_record_id(self, item: Any, idx: int) -> str:
        if isinstance(item, dict):
            for key in ["id", "file", "value"]:
                value = item.get(key)
                if value:
                    return str(value)
        return str(idx)

    def sha256_text(self, value: str) -> str:
        return hashlib.sha256(value.encode("utf-8")).hexdigest()

    def count(self, severity: str) -> int:
        return sum(1 for issue in self.issues if issue.severity == severity)

    def report_payload(self) -> dict[str, Any]:
        return {
            "generated_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            "commit_sha": os.environ.get("GITHUB_SHA") or self.current_git_sha(),
            "mode": self.args.mode,
            "validation_version": VALIDATION_VERSION,
            "overall_result": "audit" if self.args.mode == "audit" else ("fail" if self.count("fail") else "pass"),
            "hard_failures": self.count("fail"),
            "warnings": self.count("warn"),
            "review_required": self.count("review"),
            "reports_checked": self.reports_checked,
            "reports_skipped": self.reports_skipped,
            "reports_newly_validated": self.reports_newly_validated,
            "state_updates": self.state_updates,
            "duplicate_iocs": self.duplicate_iocs,
            "source_urls_checked": len(self.url_results),
            "url_results": [asdict(result) for result in self.url_results],
            "orphan_markdown": self.orphan_markdown,
            "issues": [asdict(issue) for issue in self.issues],
            "non_destructive_statement": "No files were removed or destructively modified.",
        }

    def current_git_sha(self) -> str:
        head = self.root / ".git" / "HEAD"
        try:
            value = head.read_text().strip()
            if value.startswith("ref: "):
                ref_path = self.root / ".git" / value[5:]
                return ref_path.read_text().strip()[:12] if ref_path.exists() else ""
            return value[:12]
        except OSError:
            return ""

    def write_reports(self) -> None:
        report_dir = self.root / self.args.report_dir
        report_dir.mkdir(parents=True, exist_ok=True)
        payload = self.report_payload()
        (report_dir / "latest-validation-report.json").write_text(
            json.dumps(payload, indent=2, sort_keys=True) + "\n"
        )
        (report_dir / "latest-validation-report.md").write_text(self.render_markdown_report(payload))

    def render_markdown_report(self, payload: dict[str, Any]) -> str:
        lines = [
            "# LLM ThreatIntel Validation Report",
            "",
            f"- Run time UTC: `{payload['generated_at_utc']}`",
            f"- Commit SHA: `{payload['commit_sha'] or 'unknown'}`",
            f"- Mode: `{payload['mode']}`",
            f"- Validation version: `{payload['validation_version']}`",
            f"- Overall result: `{payload['overall_result']}`",
            f"- Hard failures: `{payload['hard_failures']}`",
            f"- Warnings: `{payload['warnings']}`",
            f"- Review required: `{payload['review_required']}`",
            f"- Reports checked: `{payload['reports_checked']}`",
            f"- Reports skipped: `{payload['reports_skipped']}`",
            f"- Reports newly validated: `{payload['reports_newly_validated']}`",
            f"- IOC duplicates found: `{len(payload['duplicate_iocs'])}`",
            f"- Source URLs checked: `{payload['source_urls_checked']}`",
            "",
            "No files were removed or destructively modified.",
            "",
        ]

        if payload["issues"]:
            lines.extend(["## Findings", ""])
            for issue in payload["issues"]:
                location = f" `{issue['file']}`" if issue.get("file") else ""
                record = f" `{issue['record_id']}`" if issue.get("record_id") else ""
                lines.append(f"- **{issue['severity'].upper()}** `{issue['code']}`{location}{record}: {issue['message']}")
            lines.append("")

        failure_items = [issue for issue in payload["issues"] if issue["severity"] == "fail"]
        if failure_items:
            lines.extend(["## Hard Failure Queue", ""])
            for issue in failure_items:
                lines.extend(self.render_failure_queue_item(issue))

        if payload["duplicate_iocs"]:
            lines.extend(["## Duplicate IOC Review", ""])
            for normalized, records in payload["duplicate_iocs"].items():
                lines.append(f"### `{normalized}`")
                for record in records:
                    lines.append(
                        f"- `{record['value']}` type `{record['type']}` campaign `{record['campaign']}` source `{record['source']}`"
                    )
                lines.append("")

        review_items = [issue for issue in payload["issues"] if issue["severity"] == "review"]
        if review_items:
            lines.extend(["## Human Review Queue", ""])
            for issue in review_items:
                lines.extend(
                    [
                        "```text",
                        f"Report: {issue.get('record_id') or issue.get('file') or 'Repository'}",
                        f"Problem: {issue['code']}",
                        f"Validator finding: {issue['message']}",
                        "Recommended options:",
                        "[ ] Keep report and add/confirm valid source",
                        "[ ] Add manual evidence override",
                        "[ ] Rewrite report with supported claims only",
                        "[ ] Mark report as unverified",
                        "[ ] Remove report from feed after Lucas approval",
                        "```",
                        "",
                    ]
                )

        return "\n".join(lines).rstrip() + "\n"

    def render_failure_queue_item(self, issue: dict[str, Any]) -> list[str]:
        lines = [
            "```text",
            f"File: {issue.get('file') or 'Repository'}",
            f"Record: {issue.get('record_id') or 'n/a'}",
            f"Problem: {issue['code']}",
            f"Validator finding: {issue['message']}",
        ]

        if issue.get("file") == "data/iocs.json" and str(issue.get("record_id", "")).isdigit():
            idx = int(issue["record_id"])
            iocs = self.parsed.get("iocs", [])
            if 0 <= idx < len(iocs) and isinstance(iocs[idx], dict):
                ioc = iocs[idx]
                lines.extend(
                    [
                        f"IOC value: {ioc.get('value', '')}",
                        f"IOC type: {ioc.get('type', '')}",
                        f"Status: {ioc.get('status', '')}",
                        f"Campaign: {ioc.get('campaign', '')}",
                        f"Source: {ioc.get('source', '')}",
                        f"Context: {ioc.get('context', '')}",
                    ]
                )

        lines.extend(
            [
                "Recommended action:",
                "[ ] Correct the structured value/type",
                "[ ] Remove non-actionable narrative labels from IOC data",
                "[ ] Add a policy exception only if Lucas explicitly approves it",
                "```",
                "",
            ]
        )
        return lines

    def print_console_summary(self) -> None:
        print("LLM ThreatIntel validation")
        print(f"Mode: {self.args.mode}")
        print(f"Validation version: {VALIDATION_VERSION}")
        print()
        for issue in self.issues:
            marker = {"fail": "FAIL", "warn": "WARN", "review": "REVIEW"}[issue.severity]
            location = f" {issue.file}" if issue.file else ""
            record = f" [{issue.record_id}]" if issue.record_id else ""
            print(f"[{marker}] {issue.code}:{location}{record} {issue.message}")
            if os.environ.get("GITHUB_ACTIONS"):
                level = "error" if issue.severity == "fail" else "warning"
                file_part = f" file={issue.file}" if issue.file else ""
                print(f"::{level}{file_part}::{issue.code}: {issue.message}")
        print()
        print("Summary:")
        print(f"Hard failures: {self.count('fail')}")
        print(f"Warnings: {self.count('warn')}")
        print(f"Review required: {self.count('review')}")
        print(f"Reports checked: {self.reports_checked}")
        print(f"Reports skipped: {self.reports_skipped}")
        print(f"Reports newly validated: {self.reports_newly_validated}")
        print("No files were removed or destructively modified.")


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate LLM ThreatIntel site data quality.")
    parser.add_argument(
        "--mode",
        choices=["audit", "structural", "strict", "evidence", "full"],
        default="strict",
    )
    parser.add_argument("--changed-only-evidence", action="store_true")
    parser.add_argument("--write-report", action="store_true")
    parser.add_argument("--update-validation-state", action="store_true")
    parser.add_argument("--report-dir", default="validation-reports")
    parser.add_argument("--fail-on-review-required", action="store_true")
    parser.add_argument("--no-network", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--root", default=None, help=argparse.SUPPRESS)
    return parser


def run_validation(argv: list[str] | None = None, root: Path | None = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)
    repo_root = root or (Path(args.root).resolve() if args.root else Path(__file__).resolve().parents[1])
    validator = Validator(repo_root, args)
    return validator.run()


def main() -> None:
    sys.exit(run_validation())


if __name__ == "__main__":
    main()
