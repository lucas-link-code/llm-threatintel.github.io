import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("collect", REPO_ROOT / "scripts" / "collect.py")
collect = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = collect
SPEC.loader.exec_module(collect)


class CollectIocNormalizationTests(unittest.TestCase):
    def setUp(self):
        collect._POLICY_CACHE = None

    def assertRejected(self, value, ioc_type):
        cleaned, cleaned_type, reason, note = collect.normalize_ioc_value(value, ioc_type)
        self.assertIsNone(cleaned)
        self.assertIsNone(cleaned_type)
        self.assertIsNotNone(reason)

    def assertAccepted(self, value, ioc_type, expected_value, expected_type=None, expected_note=None):
        cleaned, cleaned_type, reason, note = collect.normalize_ioc_value(value, ioc_type)
        self.assertIsNone(reason)
        self.assertEqual(cleaned, expected_value)
        self.assertEqual(cleaned_type, expected_type or ioc_type)
        if expected_note is not None:
            self.assertEqual(note, expected_note)

    def test_rejects_cve_as_package(self):
        self.assertRejected("CVE-2026-30615 (Windsurf)", "package")

    def test_rejects_wildcard_url_path(self):
        self.assertRejected("chatgpt.com/s/*", "url_path")

    def test_rejects_prose_url_path_without_crashing(self):
        self.assertRejected(
            "PoC available at GitHub - researchers did not disclose specific malicious URLs",
            "url_path",
        )
        self.assertRejected(
            "[PoC available at GitHub - researchers did not disclose specific malicious URLs]",
            "url_path",
        )
        self.assertRejected("[not-an-ipv6]", "url_path")

    def test_rejects_malware_family_package(self):
        self.assertRejected("Odyssey Stealer", "package")

    def test_rejects_affected_product_package(self):
        self.assertRejected("FastAPI", "package")

    def test_rejects_aggregate_description(self):
        self.assertRejected("100+ malicious models", "package")

    def test_normalizes_npm_package_prefix(self):
        self.assertAccepted("npm:@scope/package@1.2.3", "package", "npm:@scope/package@1.2.3")

    def test_relocates_package_parenthetical_note(self):
        cleaned, typ, reason, note = collect.normalize_ioc_value(
            "@validate-sdk/v2 (payload, infostealer)", "package"
        )
        self.assertIsNone(reason)
        self.assertEqual(cleaned, "@validate-sdk/v2")
        self.assertEqual(note, "payload, infostealer")

    def test_rejects_version_range_package(self):
        self.assertRejected("litellm>=1.83.7", "package")

    def test_rejects_aggregate_namespace_package(self):
        self.assertRejected("29 additional packages in @redhat-cloud-services namespace", "package")

    def test_accepts_pypi_package(self):
        self.assertAccepted("pypi:package@1.2.3", "package", "pypi:package@1.2.3")

    def test_accepts_versioned_package(self):
        self.assertAccepted("litellm@1.82.7", "package", "litellm@1.82.7")

    def test_rejects_semantic_false_positive_packages(self):
        for value in ("ollama", "grok", "bankrbot", "grok-bankr-integration", "n8n", "LangFlow"):
            with self.subTest(value=value):
                self.assertRejected(value, "package")

    def test_rejects_reference_urls(self):
        values = [
            "https://thehackernews.com/2026/04/litellm-cve-2026-42208-sql-injection.html",
            "docs.litellm.ai/blog/security-update-march-2026",
            "github.com/adversa-ai/research/tree/main/artifacts/trustfall-mcp-settings-rce/poc",
            "https://openai.com/index/hugging-face-model-evaluation-security-incident/",
            "https://huggingface.co/blog/security-incident-july-2026",
            "https://www.stepsecurity.io/blog/mass-npm-supply-chain-attack-20-leo-platform-packages-compromised",
            "https://www.sonatype.com/blog/miasma-returns-leo-platform-compromise-in-npm",
            "https://novee.security/blog/cordyceps/",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertRejected(value, "url_path")

    def test_accepts_malicious_packages_and_hf_repo(self):
        self.assertAccepted("npm:@bankr/agent", "package", "npm:@bankr/agent")
        self.assertAccepted("pypi:xinference@2.6.0", "package", "pypi:xinference@2.6.0")
        self.assertAccepted("npm:namastex/automagik-genie", "package", "npm:namastex/automagik-genie")
        self.assertAccepted(
            "huggingface.co/Open-OSS/privacy-filter",
            "url_path",
            "huggingface.co/Open-OSS/privacy-filter",
        )
        self.assertAccepted(
            "malicious.example/blog/payload.js",
            "url_path",
            "malicious.example/blog/payload.js",
        )

    def test_removes_ioc_url_that_duplicates_a_reference(self):
        finding = {
            "references": [
                {
                    "source": "Example",
                    "url": "https://www.security.example/advisories/incident/",
                }
            ],
            "iocs": {
                "urls": [
                    "security.example/advisories/incident",
                    "malicious.example/payload.exe",
                ]
            },
        }
        removed = collect.remove_reference_urls_from_finding_iocs(finding)
        self.assertEqual(removed, 1)
        self.assertEqual(finding["iocs"]["urls"], ["malicious.example/payload.exe"])

    def test_suppresses_packages_when_no_iocs_published(self):
        finding = {
            "slug": "intruder-example",
            "title": "Intruder example",
            "references": [{"source": "Intruder"}],
            "iocs": {
                "note": "No specific IOCs published due to responsible disclosure",
                "packages": ["ollama", "n8n"],
            },
        }
        with tempfile.TemporaryDirectory() as tmp:
            data_dir = Path(tmp) / "data"
            data_dir.mkdir(parents=True)
            (data_dir / "iocs.json").write_text(
                json.dumps({"last_updated": "2026-06-09", "iocs": []}, indent=2) + "\n"
            )
            with mock.patch.object(collect, "DATA_DIR", data_dir), mock.patch.object(
                collect, "save_json"
            ) as save_json_mock:
                collect.update_iocs(finding)
                self.assertFalse(save_json_mock.called)

    def test_undefangs_domain(self):
        self.assertAccepted("openew[.]app", "domain", "openew.app")

    def test_duplicate_not_readded(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            data_dir = root / "data"
            data_dir.mkdir(parents=True)
            iocs_path = data_dir / "iocs.json"
            iocs_path.write_text(
                json.dumps(
                    {
                        "last_updated": "2026-06-09",
                        "iocs": [
                            {
                                "value": "evil.example.com",
                                "type": "domain",
                                "context": "Existing",
                                "first_seen": "2026-06-01",
                                "source": "Example",
                                "campaign": "existing",
                                "status": "active",
                            }
                        ],
                    },
                    indent=2,
                )
                + "\n"
            )

            finding = {
                "slug": "example-campaign",
                "title": "Example finding",
                "references": [{"source": "Example Source"}],
                "iocs": {"domains": ["evil.example.com"]},
            }

            with mock.patch.object(collect, "DATA_DIR", data_dir), mock.patch.object(
                collect, "save_json"
            ) as save_json_mock:
                collect.update_iocs(finding)
                self.assertFalse(save_json_mock.called)

    def test_normalized_url_duplicate_not_readded(self):
        with tempfile.TemporaryDirectory() as tmp:
            data_dir = Path(tmp) / "data"
            data_dir.mkdir(parents=True)
            (data_dir / "iocs.json").write_text(
                json.dumps(
                    {
                        "last_updated": "2026-06-09",
                        "iocs": [
                            {
                                "value": "huggingface.co/Open-OSS/privacy-filter",
                                "type": "url_path",
                                "context": "Existing",
                                "first_seen": "2026-05-07",
                                "source": "HiddenLayer",
                                "campaign": "existing",
                                "status": "removed",
                            }
                        ],
                    },
                    indent=2,
                )
                + "\n"
            )
            finding = {
                "slug": "duplicate-campaign",
                "title": "Duplicate finding",
                "references": [{"source": "Example Source"}],
                "iocs": {
                    "urls": [
                        "https://www.huggingface.co/Open-OSS/privacy-filter/"
                    ]
                },
            }
            with mock.patch.object(collect, "DATA_DIR", data_dir), mock.patch.object(
                collect, "save_json"
            ) as save_json_mock:
                collect.update_iocs(finding)
                self.assertFalse(save_json_mock.called)

    def test_exact_value_duplicate_with_conflicting_type_not_readded(self):
        with tempfile.TemporaryDirectory() as tmp:
            data_dir = Path(tmp) / "data"
            data_dir.mkdir(parents=True)
            (data_dir / "iocs.json").write_text(
                json.dumps(
                    {
                        "last_updated": "2026-06-09",
                        "iocs": [
                            {
                                "value": "evil.example/path",
                                "type": "url_path",
                                "context": "Existing",
                                "first_seen": "2026-06-01",
                                "source": "Example",
                                "campaign": "existing",
                                "status": "active",
                            }
                        ],
                    },
                    indent=2,
                )
                + "\n"
            )
            finding = {
                "slug": "conflicting-type",
                "title": "Conflicting type",
                "references": [{"source": "Example Source"}],
                "iocs": {"packages": ["evil.example/path"]},
            }
            with mock.patch.object(collect, "DATA_DIR", data_dir), mock.patch.object(
                collect, "save_json"
            ) as save_json_mock:
                collect.update_iocs(finding)
                self.assertFalse(save_json_mock.called)

    def test_update_iocs_rejects_reference_url_overlap_defense_in_depth(self):
        with tempfile.TemporaryDirectory() as tmp:
            data_dir = Path(tmp) / "data"
            data_dir.mkdir(parents=True)
            (data_dir / "iocs.json").write_text(
                json.dumps({"last_updated": "2026-06-09", "iocs": []}, indent=2)
                + "\n"
            )
            finding = {
                "slug": "reference-overlap",
                "title": "Reference overlap",
                "references": [
                    {
                        "source": "Example Source",
                        "url": "https://www.security.example/advisories/incident/",
                    }
                ],
                "iocs": {"urls": ["security.example/advisories/incident"]},
            }
            with mock.patch.object(collect, "DATA_DIR", data_dir), mock.patch.object(
                collect, "save_json"
            ) as save_json_mock:
                collect.update_iocs(finding)
                self.assertFalse(save_json_mock.called)

    def test_rejection_logs_reason(self):
        with mock.patch("builtins.print") as print_mock:
            cleaned, cleaned_type, reason, note = collect.normalize_ioc_value(
                "CVE-2026-30615 (Windsurf)", "package"
            )
            self.assertIsNone(cleaned)
            self.assertEqual(reason, "CVE ID is not an IOC value")

            finding = {
                "slug": "example-campaign",
                "title": "Example finding",
                "references": [{"source": "Example Source"}],
                "iocs": {"domains": ["CVE-2026-30615 (Windsurf)"]},
            }

            with tempfile.TemporaryDirectory() as tmp:
                data_dir = Path(tmp) / "data"
                data_dir.mkdir(parents=True)
                (data_dir / "iocs.json").write_text(
                    json.dumps({"last_updated": "2026-06-09", "iocs": []}, indent=2) + "\n"
                )
                with mock.patch.object(collect, "DATA_DIR", data_dir), mock.patch.object(
                    collect, "save_json"
                ):
                    collect.update_iocs(finding)

            printed = " ".join(str(call.args[0]) for call in print_mock.call_args_list)
            self.assertIn("Skipped malformed IOC", printed)
            self.assertIn("reason: CVE ID is not an IOC value", printed)


class CollectJsonExtractionTests(unittest.TestCase):
    def test_parses_jul11_prose_plus_fenced_json(self):
        payload = {
            "status": "new_intel",
            "collection_date": "2026-07-11",
            "search_summary": "Three findings",
            "findings": [{"title": "Example", "slug": "example"}],
        }
        text = (
            "I'll search for new GenAI and LLM security threats published in the last 14 days.\n"
            "Based on my comprehensive search I have identified three high-severity findings.\n\n"
            "```json\n"
            f"{json.dumps(payload, indent=2)}\n"
            "```\n"
        )
        result, path = collect.extract_collection_json(text, log=False)
        self.assertIsNotNone(result)
        self.assertEqual(path, "fenced")
        self.assertEqual(result["status"], "new_intel")
        self.assertEqual(result["findings"][0]["slug"], "example")

    def test_recovers_mixed_json_without_fence(self):
        payload = {
            "status": "no_new_intel",
            "collection_date": "2026-07-12",
            "search_summary": "Quiet day",
            "findings": [],
        }
        text = (
            "Continuing searches across remaining queries.\n"
            f"{json.dumps(payload)}\n"
            "End of notes."
        )
        result, path = collect.extract_collection_json(text, log=False)
        self.assertIsNotNone(result)
        self.assertEqual(path, "raw_decode")
        self.assertEqual(result["status"], "no_new_intel")

    def test_rejects_object_without_status(self):
        text = '{"findings": [], "search_summary": "missing status"}'
        result, path = collect.extract_collection_json(text, log=False)
        self.assertIsNone(result)
        self.assertIsNone(path)

    def test_rejects_prose_curly_blob_without_status(self):
        text = 'Notes about config {"foo": 1, "bar": 2} then more prose.'
        result, path = collect.extract_collection_json(text, log=False)
        self.assertIsNone(result)
        self.assertIsNone(path)

    def test_strips_citation_markers_before_parse(self):
        # Unescaped cite attributes break JSON until markers are stripped.
        text = (
            "Prefix\n"
            '{"status": "no_new_intel", '
            '"collection_date": "2026-07-12", '
            '"search_summary": "Source <cite index="1-2">Vendor</cite> confirmed quiet day.", '
            '"findings": []}'
        )
        result, path = collect.extract_collection_json(text, log=False)
        self.assertIsNotNone(result)
        self.assertIn(path, {"raw_decode", "direct"})
        self.assertEqual(result["status"], "no_new_intel")
        self.assertNotIn("<cite", result["search_summary"])
        self.assertIn("Vendor", result["search_summary"])

    def test_direct_clean_json(self):
        payload = {
            "status": "no_new_intel",
            "collection_date": "2026-07-08",
            "search_summary": "clean",
            "findings": [],
        }
        result, path = collect.extract_collection_json(json.dumps(payload), log=False)
        self.assertEqual(path, "direct")
        self.assertEqual(result["status"], "no_new_intel")


if __name__ == "__main__":
    unittest.main()
