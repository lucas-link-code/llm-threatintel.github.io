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


if __name__ == "__main__":
    unittest.main()
