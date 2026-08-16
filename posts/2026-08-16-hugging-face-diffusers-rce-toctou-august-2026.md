# Hugging Face Diffusers RCE via TOCTOU: Three CVEs Enable Silent Model Loading Exploits (CVE-2026-44827, CVE-2026-45804, CVE-2026-44513)

**Date:** 2026-08-16
**Tags:** model-poisoning, malicious-tool

## Executive Summary

Three tracked vulnerabilities were disclosed: CVE-2026-44827 (CVSS 8.8), a code-injection flaw exploiting how diffusers resolves a default 'None.py' file as custom pipeline code; CVE-2026-45804 (CVSS 7.5), a race condition exploiting the roughly 0.3-second window between the config fetch and the full repository download; and three related variants tracked under CVE-2026-44513 (CVSS 8.8), covering cross-repository pipeline loading, local snapshot bypasses, and malicious custom components. A set of high-severity vulnerabilities in Hugging Face's diffusers library allow a malicious model repository to silently execute arbitrary code on any machine that loads it.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Hugging Face Diffusers Model Loading RCE Exploitation Chain |
| Attribution | Unknown; potentially leveraged by model-poisoning campaigns (confidence: low) |
| Target | Organizations and developers loading AI models from Hugging Face using diffusers library |
| Vector | Malicious model configuration files; Time-of-Check-to-Time-of-Use (TOCTOU) race conditions in model loading |
| Status | active |
| First Observed | 2026-08-02 |

## Detailed Findings

The same underlying weakness, treating AI repository content as trusted rather than executable, extends to the model-loading path itself. Every variant identified traces back to a single root cause: a classic Time-of-Check to Time-of-Use (TOCTOU) flaw. A similar flaw was also disclosed in Hugging Face's transformers library, where failure to propagate a pinned commit hash allows attackers to swap in malicious code after trust_remote_code approval. This research follows closely on the heels of Hugging Face's July 2026 security incident, in which a malicious dataset abused two code-execution paths in the platform's data-processing pipeline, allowing an attacker to run code on a worker, escalate to node-level access, harvest cloud and cluster credentials, and move laterally into internal clusters.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Malicious Model Supply Chain | T1195.001 | Poisoned AI model repositories hosted on Hugging Face; crafted config.json files containing malicious code injection directives |
| Remote Code Execution | T1190 | Silent code execution triggered during standard from_pretrained() model loading with no user interaction required |
| Privilege Escalation | T1548 | TOCTOU race conditions allow attackers to escalate from model-loading context to arbitrary code execution |

## IOCs

### Domains

_Vulnerabilities affect any malicious model repository uploaded to Hugging Face; no specific package IOCs published_

### Full URL Paths

_Vulnerabilities affect any malicious model repository uploaded to Hugging Face; no specific package IOCs published_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Hugging Face Hub (models and datasets)
Python diffusers library
Hugging Face transformers library
```

## Detection Recommendations

For organizations using Hugging Face: immediately audit all model loading code for diffusers and transformers library versions affected by CVE-2026-44827, CVE-2026-45804, and CVE-2026-44513. Upgrade to patched versions immediately. Implement strict model source verification; maintain allowlists of trusted model repositories. Monitor for config.json and pipeline modifications in cloned model directories. Implement filesystem integrity monitoring on model cache directories. Restrict trust_remote_code to False unless explicitly required and vetted. Monitor cloud credential access patterns and implement IAM role restrictions. Screen for data exfiltration patterns in outbound traffic from model loading processes.

## References

- [Cybersecurity News] Hugging Face Diffusers Vulnerabilities Enable Remote Code Execution Through Malicious AI Models (2026-08-03) — https://cybersecuritynews.com/hugging-face-diffusers-vulnerabilities/
- [TechRepublic] Malicious Hugging Face Models Could Trigger Remote Code Execution (2026-06-05) — https://www.techrepublic.com/article/news-hugging-face-transformers-rce-flaw/
- [Hive Security] Poisoned AI: How Hugging Face Became a Malware Distribution Platform (2026-05-29) — https://hivesecurity.gitlab.io/blog/huggingface-ai-supply-chain-attacks-2026/
