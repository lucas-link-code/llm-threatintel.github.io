import contextlib
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from unittest import mock
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
    policy_src = REPO_ROOT / "validation" / "policy.json"
    if policy_src.exists():
        (root / "validation" / "policy.json").write_text(policy_src.read_text())
    (root / "posts" / post["file"]).write_text(markdown)


def run_validator(root, *args):
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        code = validate_site.run_validation(list(args), root=root)
    return code, output.getvalue()


def report(root):
    return json.loads((root / "validation-reports/latest-validation-report.json").read_text())


def add_blog_post(root, *, author="Lucas L.", markdown=None):
    blog_post = {
        "id": "2026-05-11-example-blog",
        "title": "Example Blog",
        "date": "2026-05-11",
        "author": author,
        "category": "GenAI Security",
        "tags": ["prompt-engineering"],
        "excerpt": "Example blog excerpt.",
        "file": "2026-05-11-example-blog.md",
        "readTime": "5 min",
    }
    markdown = markdown or (
        "# Example Blog\n\n"
        "Example blog content.\n\n"
        '<p class="blog-post-byline">Author: Lucas L.</p>\n'
    )
    write_json(root / "data/blog-index.json", {"posts": [blog_post]})
    (root / "posts" / blog_post["file"]).write_text(markdown)
    return blog_post


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

    def test_blog_author_contract_passes(self):
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)
            add_blog_post(root)

            code, _ = run_validator(root, "--mode", "strict", "--write-report")

            self.assertEqual(
                code,
                0,
                msg=(root / "validation-reports/latest-validation-report.json").read_text(),
            )

    def test_blog_author_metadata_must_match_exactly(self):
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)
            add_blog_post(root, author="Lucas L")

            code, _ = run_validator(root, "--mode", "structural", "--write-report")

            self.assertEqual(code, 1)
            issues = report(root)["issues"]
            mismatch = [
                issue for issue in issues if issue["code"] == "blog-author-metadata-mismatch"
            ]
            self.assertEqual(len(mismatch), 1)
            self.assertEqual(mismatch[0]["record_id"], "2026-05-11-example-blog")

    def test_blog_author_signoff_failures(self):
        signoff = '<p class="blog-post-byline">Author: Lucas L.</p>'
        cases = [
            (
                "missing",
                "# Example Blog\n\nExample blog content.\n",
                "blog-author-signoff-count",
            ),
            (
                "wrong punctuation",
                '# Example Blog\n\n<p class="blog-post-byline">Author: Lucas L</p>\n',
                "blog-author-signoff-mismatch",
            ),
            (
                "duplicate",
                f"# Example Blog\n\n{signoff}\n\n{signoff}\n",
                "blog-author-signoff-count",
            ),
            (
                "conflicting extra byline",
                "# Example Blog\n\n"
                '<p class="note blog-post-byline extra">Author: Another Person.</p>\n\n'
                f"{signoff}\n",
                "blog-author-signoff-count",
            ),
            (
                "not final",
                f"# Example Blog\n\n{signoff}\n\nTrailing content.\n",
                "blog-author-signoff-not-final",
            ),
            (
                "stripped after project notes footer",
                "# Example Blog\n\n"
                "---\n\n"
                "## Project Notes\n\n"
                "Legacy footer content.\n\n"
                f"{signoff}\n",
                "blog-author-signoff-stripped-by-legacy-footer",
            ),
            (
                "stripped after support footer",
                "# Example Blog\n\n"
                "---\n\n"
                "## Support LLM ThreatIntel\n\n"
                "Legacy footer content.\n\n"
                f"{signoff}\n",
                "blog-author-signoff-stripped-by-legacy-footer",
            ),
        ]

        for name, markdown, expected_code in cases:
            with self.subTest(name=name):
                with self.with_repo() as tmp:
                    root = Path(tmp)
                    base_repo(root)
                    blog_post = add_blog_post(root, markdown=markdown)

                    code, _ = run_validator(root, "--mode", "strict", "--write-report")

                    self.assertEqual(code, 1)
                    issues = report(root)["issues"]
                    matching = [issue for issue in issues if issue["code"] == expected_code]
                    self.assertEqual(len(matching), 1)
                    self.assertEqual(matching[0]["file"], f'posts/{blog_post["file"]}')
                    self.assertEqual(matching[0]["record_id"], blog_post["id"])

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
                    {"value": "evil.example.com", "type": "domain"},
                    {"value": "evil.example.com", "type": "domain"},
                ],
                "ioc-duplicate-review",
                0,
            ),
            (
                "normalized URL duplicate warning",
                [
                    {
                        "value": "huggingface.co/Open-OSS/privacy-filter",
                        "type": "url_path",
                    },
                    {
                        "value": "https://www.huggingface.co/Open-OSS/privacy-filter/",
                        "type": "url_path",
                    },
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

    def test_hard_failure_queue_includes_ioc_details(self):
        iocs = [
            {
                "value": "not a package value",
                "type": "package",
                "context": "Example context for invalid package",
                "first_seen": "2026-05-10",
                "source": "Example Source",
                "campaign": "example-report",
                "status": "active",
            }
        ]
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root, iocs=iocs)
            code, _ = run_validator(root, "--mode", "strict", "--write-report")
            self.assertEqual(code, 1)
            markdown = (root / "validation-reports/latest-validation-report.md").read_text()
            self.assertIn("## Hard Failure Queue", markdown)
            self.assertIn("IOC value: not a package value", markdown)
            self.assertIn("IOC type: package", markdown)
            self.assertIn("Campaign: example-report", markdown)
            self.assertIn("Source: Example Source", markdown)

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

    def test_ioc_semantic_validation_failures(self):
        cases = [
            (
                "prose parenthetical domain",
                [{"value": "chatgpt.com (legitimate domain abused for sharing malicious prompts)", "type": "domain"}],
                "ioc-prose-parenthetical",
            ),
            (
                "wildcard url_path",
                [{"value": "chatgpt.com/s/* (attacker-controlled share links)", "type": "url_path"}],
                "ioc-wildcard-value",
            ),
            (
                "generic platform path",
                [{"value": "chatgpt.com/s/", "type": "url_path"}],
                "ioc-legitimate-platform",
            ),
            (
                "huggingface platform prose",
                [{"value": "https://huggingface.co/ (legitimate platform; malicious models can be hosted here)", "type": "url_path"}],
                "ioc-prose-parenthetical",
            ),
            (
                "arxiv reference prose",
                [{"value": "https://arxiv.org/abs/2406 (expected publication on arXiv)", "type": "url_path"}],
                "ioc-prose-parenthetical",
            ),
            (
                "prose url path",
                [
                    {
                        "value": "PoC available at GitHub - researchers did not disclose specific malicious URLs",
                        "type": "url_path",
                    }
                ],
                "ioc-url-path-format",
            ),
            (
                "bracketed prose url path",
                [
                    {
                        "value": "[PoC available at GitHub - researchers did not disclose specific malicious URLs]",
                        "type": "url_path",
                    }
                ],
                "ioc-url-path-format",
            ),
            (
                "malformed bracketed url path",
                [{"value": "[not-an-ipv6]", "type": "url_path"}],
                "ioc-url-path-format",
            ),
            (
                "geographic ip description",
                [{"value": "Kowloon Bay, Hong Kong-based attacker IPs", "type": "ip"}],
                "ioc-ip-format",
            ),
            (
                "cve as package",
                [{"value": "CVE-2026-30615 (Windsurf)", "type": "package"}],
                "ioc-cve-as-value",
            ),
            (
                "aggregate cve package",
                [{"value": "10 CVEs in MCP STDIO configurations (OX Security full advisory)", "type": "package"}],
                "ioc-aggregate-description",
            ),
            (
                "aggregate models package",
                [{"value": "Hugging Face malicious models (100+ identified by JFrog)", "type": "package"}],
                "ioc-aggregate-description",
            ),
            (
                "aggregate uploads package 1",
                [{"value": "hightower6eu malicious skills (334 uploads)", "type": "package"}],
                "ioc-aggregate-description",
            ),
            (
                "aggregate uploads package 2",
                [{"value": "sakaen736jih malicious skills (199 uploads)", "type": "package"}],
                "ioc-aggregate-description",
            ),
            (
                "aggregate without parentheses",
                [{"value": "575+ trojanized OpenClaw agent skills", "type": "package"}],
                "ioc-aggregate-description",
            ),
            (
                "malware family package",
                [{"value": "Odyssey Stealer", "type": "package"}],
                "ioc-malware-name-as-package",
            ),
            (
                "malware family prose package",
                [{"value": "AMOS (Atomic macOS Stealer)", "type": "package"}],
                "ioc-package-format",
            ),
            (
                "affected product fastapi",
                [{"value": "FastAPI", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "affected product litellm",
                [{"value": "LiteLLM", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "affected product ollama",
                [{"value": "ollama", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "affected product grok",
                [{"value": "grok", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "affected product bankrbot",
                [{"value": "bankrbot", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "conceptual package grok-bankr-integration",
                [{"value": "grok-bankr-integration", "type": "package"}],
                "ioc-conceptual-package-label",
            ),
            (
                "affected product n8n",
                [{"value": "n8n", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "affected product langflow",
                [{"value": "LangFlow", "type": "package"}],
                "ioc-affected-product-as-package",
            ),
            (
                "reference url thehackernews",
                [{"value": "thehackernews.com/2026/04/litellm-cve-2026-42208-sql-injection.html", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "reference url docs litellm",
                [{"value": "docs.litellm.ai/blog/security-update-march-2026", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "safe poc adversa github",
                [{"value": "github.com/adversa-ai/research/tree/main/artifacts/trustfall-mcp-settings-rce/poc", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "OpenAI source article",
                [{"value": "https://openai.com/index/hugging-face-model-evaluation-security-incident/", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "Hugging Face source article",
                [{"value": "https://huggingface.co/blog/security-incident-july-2026", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "StepSecurity source article",
                [{"value": "https://www.stepsecurity.io/blog/mass-npm-supply-chain-attack-20-leo-platform-packages-compromised", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "Sonatype source article",
                [{"value": "https://www.sonatype.com/blog/miasma-returns-leo-platform-compromise-in-npm", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "Novee source article",
                [{"value": "https://novee.security/blog/cordyceps/", "type": "url_path"}],
                "ioc-reference-url",
            ),
            (
                "evidence domain x.com",
                [{"value": "x.com", "type": "domain"}],
                "ioc-evidence-domain",
            ),
            (
                "defanged domain",
                [{"value": "openew[.]app (fake download portal)", "type": "domain"}],
                "ioc-defanged-json",
            ),
            (
                "parenthetical package",
                [{"value": "@validate-sdk/v2 (payload, infostealer)", "type": "package"}],
                "ioc-package-format",
            ),
            (
                "package with space",
                [{"value": "litellm (versions 1.81.16 to 1.83.6)", "type": "package"}],
                "ioc-package-format",
            ),
            (
                "package with comparator",
                [{"value": "litellm>=1.83.7", "type": "package"}],
                "ioc-package-format",
            ),
            (
                "aggregate namespace package",
                [{"value": "29 additional packages in @redhat-cloud-services namespace", "type": "package"}],
                "ioc-package-format",
            ),
            (
                "huggingface repo as package",
                [{"value": "Open-OSS/privacy-filter", "type": "package"}],
                "ioc-package-hf-repo-slug",
            ),
        ]

        for name, ioc_values, expected_code in cases:
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
                    self.assertEqual(code, 1)
                    codes = {issue["code"] for issue in report(root)["issues"]}
                    self.assertIn(expected_code, codes)

    def test_ioc_semantic_validation_passes(self):
        cases = [
            ("openew.app", "domain"),
            ("npm:@scope/package@1.2.3", "package"),
            ("pypi:package@1.2.3", "package"),
            ("@validate-sdk/v2", "package"),
            ("npm:@bankr/agent", "package"),
            ("pypi:xinference@2.6.0", "package"),
            ("npm:namastex/automagik-genie", "package"),
            ("huggingface.co/Open-OSS/privacy-filter", "url_path"),
            ("malicious.example/blog/payload.js", "url_path"),
            ("litellm@1.82.7", "package"),
            ("192.168.1.1", "ip"),
            ("a" * 64, "sha256"),
            ("claude.ai/share/Xy7AbC9KqM", "url_path"),
        ]

        for value, ioc_type in cases:
            with self.subTest(value=value, ioc_type=ioc_type):
                iocs = [
                    {
                        "value": value,
                        "type": ioc_type,
                        "context": "Example context",
                        "first_seen": "2026-05-10",
                        "source": "Example Source",
                        "campaign": "example-report",
                        "status": "active",
                    }
                ]
                with self.with_repo() as tmp:
                    root = Path(tmp)
                    base_repo(root, iocs=iocs)
                    code, _ = run_validator(root, "--mode", "strict", "--write-report")
                    self.assertEqual(code, 0, msg=(root / "validation-reports/latest-validation-report.json").read_text())

    def test_url_check_builds_ssl_handler_without_open_context_kwarg(self):
        class FakeResponse:
            def __enter__(self):
                return self

            def __exit__(self, exc_type, exc, tb):
                return False

            def getcode(self):
                return 200

            def geturl(self):
                return "https://example.com/report"

        class FakeOpener:
            def open(self, request, **kwargs):
                self.request = request
                self.kwargs = kwargs
                if "context" in kwargs:
                    raise AssertionError("context must be configured on HTTPSHandler, not opener.open")
                return FakeResponse()

        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)
            args = validate_site.build_arg_parser().parse_args(["--mode", "evidence"])
            validator = validate_site.Validator(root, args)
            fake_opener = FakeOpener()
            with mock.patch.object(validate_site.urllib.request, "build_opener", return_value=fake_opener):
                result = validator.check_url("https://example.com/report")

            self.assertEqual(result.status, "accessible")
            self.assertEqual(fake_opener.kwargs["timeout"], 10)
            self.assertNotIn("context", fake_opener.kwargs)

    def test_markdown_fence_bare_huggingface_fails(self):
        markdown = (
            "# Example Report\n\n"
            "**Date:** 2026-05-10\n"
            "**Tags:** malware\n\n"
            "## Executive Summary\n\n"
            "Example sourced report.\n\n"
            "## IOCs\n\n"
            "### Domains\n\n"
            "```\n"
            "huggingface.co\n"
            "```\n\n"
            "## References\n\n"
            "- [Example] Example Source (2026-05-10) — https://example.com/report\n"
        )
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root, markdown=markdown)
            code, _ = run_validator(root, "--mode", "strict", "--write-report")
            self.assertEqual(code, 1)
            codes = {issue["code"] for issue in report(root)["issues"]}
            self.assertIn("ioc-legitimate-platform", codes)

    def test_markdown_fence_hf_repo_path_passes(self):
        markdown = (
            "# Example Report\n\n"
            "**Date:** 2026-05-10\n"
            "**Tags:** malware\n\n"
            "## Executive Summary\n\n"
            "Example sourced report.\n\n"
            "## IOCs\n\n"
            "### Full URL Paths\n\n"
            "```\n"
            "huggingface.co/Open-OSS/privacy-filter\n"
            "```\n\n"
            "## References\n\n"
            "- [Example] Example Source (2026-05-10) — https://example.com/report\n"
        )
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root, markdown=markdown)
            code, _ = run_validator(root, "--mode", "strict", "--write-report")
            self.assertEqual(code, 0)

    def test_check_url_maps_connection_reset(self):
        class FakeOpener:
            def open(self, request, **kwargs):
                raise ConnectionResetError("connection reset")

        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)
            args = validate_site.build_arg_parser().parse_args(["--mode", "evidence"])
            validator = validate_site.Validator(root, args)
            with mock.patch.object(validate_site.urllib.request, "build_opener", return_value=FakeOpener()):
                result = validator.check_url("https://example.com/report")
            self.assertEqual(result.status, "unknown_error")
            self.assertIn("connection reset", result.error)

    def test_internal_error_writes_crash_report(self):
        with self.with_repo() as tmp:
            root = Path(tmp)
            base_repo(root)
            with mock.patch.object(
                validate_site.Validator,
                "validate_requested_mode",
                side_effect=RuntimeError("boom"),
            ):
                code, _ = run_validator(root, "--mode", "strict", "--write-report")
            self.assertEqual(code, 3)
            payload = report(root)
            codes = {issue["code"] for issue in payload["issues"]}
            self.assertIn("validator-internal-error", codes)


if __name__ == "__main__":
    unittest.main()
