import importlib.util
import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "audit_semantic_iocs",
    REPO_ROOT / "scripts" / "audit_semantic_iocs.py",
)
audit = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = audit
SPEC.loader.exec_module(audit)


class SemanticIocAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.policy = audit.load_policy()

    def test_publisher_articles_are_reference_urls(self):
        values = [
            "https://openai.com/index/hugging-face-model-evaluation-security-incident/",
            "https://huggingface.co/blog/security-incident-july-2026",
            "https://www.stepsecurity.io/blog/mass-npm-supply-chain-attack-20-leo-platform-packages-compromised",
            "https://www.sonatype.com/blog/miasma-returns-leo-platform-compromise-in-npm",
            "https://novee.security/blog/cordyceps/",
        ]
        for value in values:
            with self.subTest(value=value):
                classification, _, action = audit.classify_ioc(
                    {"value": value, "type": "url_path", "context": "Source article"},
                    self.policy,
                )
                self.assertEqual(classification, "reference_url_not_ioc")
                self.assertEqual(action, "remove")

    def test_policy_is_host_scoped_and_keeps_malicious_paths(self):
        cases = [
            "huggingface.co/Open-OSS/privacy-filter",
            "malicious.example/blog/payload.js",
        ]
        for value in cases:
            with self.subTest(value=value):
                classification, _, action = audit.classify_ioc(
                    {
                        "value": value,
                        "type": "url_path",
                        "context": "Confirmed malicious payload",
                    },
                    self.policy,
                )
                self.assertNotEqual(classification, "reference_url_not_ioc")
                self.assertEqual(action, "keep")

    def test_normalized_url_duplicates_include_www_scheme_and_trailing_slash(self):
        records = [
            {
                "value": "huggingface.co/Open-OSS/privacy-filter",
                "type": "url_path",
                "campaign": "first",
                "status": "removed",
            },
            {
                "value": "https://www.huggingface.co/Open-OSS/privacy-filter/",
                "type": "url_path",
                "campaign": "second",
                "status": "active",
            },
        ]
        groups = audit.find_normalized_url_duplicates(records)
        self.assertEqual(len(groups), 1)
        self.assertEqual(
            groups[0]["normalized"],
            "huggingface.co/Open-OSS/privacy-filter",
        )
        self.assertEqual(groups[0]["classification"], "duplicate_status_conflict")
        self.assertEqual(groups[0]["statuses"], ["active", "removed"])
        self.assertEqual(groups[0]["proposed_action"], "review_and_consolidate")

    def test_audit_does_not_auto_remove_duplicate_records(self):
        records = [
            {
                "value": "https://www.example.test/path/",
                "type": "url_path",
                "context": "Confirmed malicious path",
                "campaign": "one",
                "status": "active",
            },
            {
                "value": "example.test/path",
                "type": "url_path",
                "context": "Confirmed malicious path",
                "campaign": "two",
                "status": "removed",
            },
        ]
        _, changelog = audit.audit_iocs({"iocs": records}, self.policy)
        self.assertEqual(len(changelog["duplicate_groups"]), 1)
        self.assertEqual(changelog["remove"], [])


if __name__ == "__main__":
    unittest.main()
