import contextlib
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "validate_site", REPO_ROOT / "scripts" / "validate_site.py"
)
validate_site = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = validate_site
SPEC.loader.exec_module(validate_site)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def base_repo(root, iocs=None, post=None, markdown=None):
    (root / "posts").mkdir(parents=True, exist_ok=True)
    (root / "validation").mkdir(parents=True, exist_ok=True)
    (root / "validation-reports").mkdir(parents=True, exist_ok=True)
    post = post or {
        "id": "2026-05-10-example-report",
        "title": "Example Report",
        "date": "2026-05-10",
        "author": "LLM ThreatIntel",
        "tags": ["malware"],
        "tlp": "TLP:CLEAR",
        "excerpt": "Example excerpt.",
        "file": "2026-05-10-example-report.md",
    }
    markdown = markdown or (
        "# Example Report\n\n"
        "**Date:** 2026-05-10\n"
        "**Tags:** malware\n\n"
        "## Executive Summary\n\n"
        "Example sourced report.\n\n"
        "## References\n\n"
        "- [Example] Example Source (2026-05-10) — https://example.com/report\n"
    )
    write_json(root / "data/posts-index.json", {"posts": [post]})
    write_json(root / "data/blog-index.json", {"posts": []})
    write_json(
        root / "data/actors.json",
        {
            "last_updated": "2026-05-10",
            "entries": [
                {
                    "id": "example-actor",
                    "names": ["Example Actor"],
                    "type": "malware",
                    "first_seen": "2026-05",
                    "status": "active",
                    "distribution": [],
                    "ttps": [],
                    "description": "Example actor.",
                }
            ],
        },
    )
    write_json(
        root / "data/iocs.json",
        {
            "last_updated": "2026-05-10",
            "iocs": iocs or [
                {
                    "value": "evil.example.com",
                    "type": "domain",
                    "context": "Example context",
                    "first_seen": "2026-05-10",
                    "source": "Example Source",
                    "campaign": "example-report",
                    "status": "active",
                }
            ],
        },
    )
    write_json(root / "validation/validated-reports.json", {"validation_version": "1.0.0", "reports": {}})
    write_json(root / "validation/manual-evidence-overrides.json", {"reports": {}})
    (root / "posts" / post["file"]).write_text(markdown)


def run_validator(root, *args):
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        code = validate_site.run_validation(list(args), root=root)
    return code, output.getvalue()


def report(root):
    return json.loads((root / "validation-reports/latest-validation-report.json").read_text())


class ValidateSiteTests(unittest.TestCase):
    def with_repo(self):
        return tempfile.TemporaryDirectory()

    def test_structural_hard_failures(self):
        cases = []

        def malformed_json(root):
            (root / "data/posts-index.json").write_text("{bad json")

        cases.append(("malformed JSON", malformed_json, "json-parse"))

        def missing_required(root):
            data = json.loads((root / "data/posts-index.json").read_text())
            del data["posts"][0]["title"]
            write_json(root / "data/posts-index.json", data)

        cases.append(("missing required post field", missing_required, "post-missing-field"))

        def unknown_tag(root):
            data = json.loads((root / "data/posts-index.json").read_text())
            data["posts"][0]["tags"] = ["unknown-tag"]
            write_json(root / "data/posts-index.json", data)

        cases.append(("unknown tag", unknown_tag, "post-unknown-tag"))

        def invalid_date(root):
            data = json.loads((root / "data/posts-index.json").read_text())
            data["posts"][0]["date"] = "2026-99-99"
            write_json(root / "data/posts-index.json", data)

        cases.append(("invalid date", invalid_date, "post-date-invalid"))

        def missing_markdown(root):
            (root / "posts/2026-05-10-example-report.md").unlink()

        cases.append(("missing Markdown file", missing_markdown, "post-missing-markdown"))

        def duplicate_post_id(root):
            data = json.loads((root / "data/posts-index.json").read_text())
            data["posts"].append(dict(data["posts"][0], file="2026-05-10-second.md"))
            (root / "posts/2026-05-10-second.md").write_text("# Second\n\n## References\n\nhttps://example.com\n")
            write_json(root / "data/posts-index.json", data)

        cases.append(("duplicate post ID", duplicate_post_id, "post-duplicate-id"))

        for name, mutate, expected_code in cases:
            with self.subTest(name=name):
                with self.with_repo() as tmp:
                    root = Path(tmp)
                    base_repo(root)
                    mutate(root)
                    code, _ = run_validator(root, "--mode", "structural", "--write-report")
                    self.assertEqual(code, 1)
                    codes = {issue["code"] for issue in report(root)["issues"]}
                    self.assertIn(expected_code, codes)

    def test_ioc_validation_failures_and_duplicates(self):
        cases = [
            (
                "invalid SHA256",
                [{"value": "abcd", "type": "sha256"}],
                "ioc-hash-format",
                1,
            ),
            (
                "invalid IP",
                [{"value": "999.1.1.1", "type": "ip"}],
                "ioc-ip-format",
                1,
            ),
            (
                "defanged IOC",
                [{"value": "evil[.]example.com", "type": "domain"}],
                "ioc-defanged-json",
                1,
            ),
            (
                "conflicting IOC type",
                [
                    {"value": "evil.example.com", "type": "domain"},
                    {"value": "evil.example.com", "type": "url_path"},
                ],
                "ioc-conflicting-types",
                1,
            ),
            (
                "duplicate IOC warning",
                [
                    {"value": "Flowise", "type": "package"},
                    {"value": "flowise", "type": "package"},
                ],
                "ioc-duplicate-review",
                0,
            ),
        ]

        for name, ioc_values, expected_code, expected_exit in cases:
            with self.subTest(name=name):
                iocs = []
                for item in ioc_values:
                    iocs.append(
                        {
                            "value": item["value"],
                            "type": item["type"],
                            "context": "Example context",
                            "first_seen": "2026-05-10",
                            "source": "Example Source",
                            "campaign": "example-report",
                            "status": "active",
                        }
                    )
                with self.with_repo() as tmp:
                    root = Path(tmp)
                    base_repo(root, iocs=iocs)
                    code, _ = run_validator(root, "--mode", "strict", "--write-report")
                    self.assertEqual(code, expected_exit)
                    codes = {issue["code"] for issue in report(root)["issues"]}
                    self.assertIn(expected_code, codes)

    def test_url_path_is_not_over_normalized_into_domain(self):
        iocs = [
            {
                "value": "audit.checkmarx.cx",
                "type": "domain",
                "context": "Example context",
                "first_seen": "2026-05-10",
                "source": "Example Source",
                "campaign": "example-report",
                "status": "active",
            },
            {
                "value": "audit.checkmarx.cx/v1/telemetry",
                "type": "url_path",
                "context": "Example context",
                "first_seen": "2026-05-10",
                "source": "Example Source",
                "campaign": "example-report",
                "status": "active",
            },
        ]
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root, iocs=iocs)
            code, _ = run_validator(root, "--mode", "strict", "--write-report")
            self.assertEqual(code, 0)
            codes = {issue["code"] for issue in report(root)["issues"]}
            self.assertNotIn("ioc-conflicting-types", codes)

    def test_markdown_placeholder_and_missing_evidence(self):
        cases = [
            ("# Example\n\nTODO\n\n## References\n\nhttps://example.com\n", "markdown-placeholder"),
            ("# Example\n\nNo evidence section.\n", "markdown-source-section-missing"),
        ]
        for markdown, expected_code in cases:
            with self.subTest(expected_code=expected_code):
                with self.with_repo() as tmp:
                    root = Path(tmp)
                    base_repo(root, markdown=markdown)
                    code, _ = run_validator(root, "--mode", "strict", "--write-report")
                    self.assertEqual(code, 1)
                    codes = {issue["code"] for issue in report(root)["issues"]}
                    self.assertIn(expected_code, codes)

    def test_manual_override_covers_missing_evidence_section(self):
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root, markdown="# Example\n\nNo evidence section.\n")
            write_json(
                root / "validation/manual-evidence-overrides.json",
                {
                    "reports": {
                        "2026-05-10-example-report": {
                            "approved_by": "Lucas",
                            "approved_at": "2026-05-11",
                            "reason": "Primary source was validated manually.",
                            "supporting_sources": [],
                        }
                    }
                },
            )
            code, _ = run_validator(root, "--mode", "strict", "--write-report")
            self.assertEqual(code, 0)

    def test_cache_skip_and_changed_hash_triggers_evidence(self):
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)

            code, _ = run_validator(
                root,
                "--mode",
                "audit",
                "--write-report",
                "--update-validation-state",
            )
            self.assertEqual(code, 0)

            code, _ = run_validator(
                root,
                "--mode",
                "evidence",
                "--changed-only-evidence",
                "--write-report",
                "--no-network",
            )
            self.assertEqual(code, 0)
            payload = report(root)
            self.assertEqual(payload["reports_skipped"], 1)
            self.assertEqual(payload["reports_checked"], 0)

            post_path = root / "posts/2026-05-10-example-report.md"
            post_path.write_text(post_path.read_text() + "\nChanged sentence.\n")
            code, _ = run_validator(
                root,
                "--mode",
                "evidence",
                "--changed-only-evidence",
                "--write-report",
                "--no-network",
            )
            self.assertEqual(code, 0)
            payload = report(root)
            self.assertEqual(payload["reports_checked"], 1)
            codes = {issue["code"] for issue in payload["issues"]}
            self.assertIn("evidence-network-disabled", codes)

    def test_404_410_classification_is_review_not_destructive_failure(self):
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)
            args = validate_site.build_arg_parser().parse_args(["--mode", "evidence"])
            validator = validate_site.Validator(root, args)
            result_404 = validator.classify_http_result("https://example.com/missing", 404)
            result_410 = validator.classify_http_result("https://example.com/gone", 410)
            self.assertEqual(result_404.status, "not_found")
            self.assertEqual(result_410.status, "not_found")


if __name__ == "__main__":
    unittest.main()
