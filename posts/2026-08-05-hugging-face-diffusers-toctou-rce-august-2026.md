# Hugging Face Diffusers TOCTOU RCE: Malicious Models Execute Arbitrary Code via Time-of-Check-to-Time-of-Use Flaws

**Date:** 2026-08-05
**Tags:** supply-chain, malicious-tool, model-poisoning

## Executive Summary

A set of high-severity vulnerabilities in Hugging Face's diffusers library allow a malicious model repository to silently execute arbitrary code on any machine that loads it. Three tracked vulnerabilities include CVE-2026-44827 (CVSS 8.8), a code-injection flaw exploiting how diffusers resolves a default "None.py" file as custom pipeline code; CVE-2026-45804 (CVSS 7.5), a race condition exploiting the roughly 0.3-second window between the config fetch and the full repository download; and three related variants tracked under CVE-2026-44513 (CVSS 8.8).

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Project DarkSide: Hugging Face Model Trojanization |
| Attribution | Unknown attackers; potentially financially motivated (confidence: low) |
| Target | Machine learning engineers and organizations using Hugging Face diffusers and transformers libraries |
| Vector | Malicious model repositories uploaded to Hugging Face; Time-of-Check-to-Time-of-Use (TOCTOU) race conditions in model loading |
| Status | active |
| First Observed | 2026-08-03 |

## Detailed Findings

This research follows closely on the heels of Hugging Face's July 2026 security incident, in which a malicious dataset abused two code-execution paths in the platform's data-processing pipeline, allowing an attacker to run code on a worker, escalate to node-level access, harvest cloud and cluster credentials, and move laterally into internal clusters. While Hugging Face found no evidence that public models, datasets, or container images were altered, Zafran's findings show that the same underlying weakness, treating AI repository content as trusted rather than executable, extends to the model-loading path itself. Every variant Zafran identified traces back to a single root cause: a classic Time-of-Check to Time-of-Use (TOCTOU) flaw. Zafran also disclosed a similar flaw in Hugging Face's transformers library, where failure to propagate a pinned commit hash allows attackers to swap in malicious code after trust_remote_code approval.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Attacker delivers trojanized model through public Hugging Face repository |
| Abuse Elevation Control Mechanism | T1548 | Malicious model code executes during load with trust_remote_code=True |
| Execution via Module Load | T1129 | Python module loading mechanism exploited for arbitrary code execution |

## IOCs

### Domains

_CVE-2026-44827 (CVSS 8.8), CVE-2026-45804 (CVSS 7.5), CVE-2026-44513 (CVSS 8.8)_

### Full URL Paths

```
https://huggingface.co
```

### Splunk Format

```
"https://huggingface.co"
```

### Package Indicators

```
{'name': 'diffusers', 'registry': 'pypi', 'version': '<0.38.0', 'note': 'Versions prior to 0.38.0 vulnerable to CVE-2026-44827, CVE-2026-45804, CVE-2026-44513'}
{'name': 'transformers', 'registry': 'pypi', 'version': 'affected', 'note': 'Similar commit hash validation flaw affecting trust_remote_code handling'}
```

### Affected Platforms

```
Hugging Face Hub
PyTorch-based ML training pipelines
```

## Detection Recommendations

Monitor Hugging Face model downloads and Git repository interactions for suspicious model files (especially .py files and config.json patterns). Implement model integrity verification before load. Block trust_remote_code=True in production pipelines. Use SafeTensors format as mandatory for model ingestion. Monitor for unusual outbound network activity from model loading processes. Implement code signing and hash verification for critical model files.

## References

- [The Hacker News] Hugging Face Diffusers Flaws Could Let Model Repositories Execute Arbitrary Code (2026-08-03) — https://thehackernews.com/2026/08/hugging-face-diffusers-flaws-could-let.html
- [Cybersecurity News] Hugging Face Diffusers Vulnerabilities Enable Remote Code Execution Through Malicious AI Models (2026-08-03) — https://cybersecuritynews.com/hugging-face-diffusers-vulnerabilities/
