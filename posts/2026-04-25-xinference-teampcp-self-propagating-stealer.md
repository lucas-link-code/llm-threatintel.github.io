# Xinference PyPI Poisoning: Self-Propagating Credential Stealer via TeamPCP Supply Chain Campaign

**Date:** 2026-04-25
**Tags:** supply-chain, malware

## Executive Summary

Versions 2.6.0, 2.6.1, and 2.6.2 of the legitimate Python package xinference were compromised to include a Base64-encoded payload that fetches a second-stage collector module responsible for harvesting a wide range of credentials and secrets from the infected host, with the decoded payload opening with the comment '# hacked by teampcp'. This represents escalation of the TeamPCP campaign beyond single-shot credential theft to include self-propagating PyPI upload capability.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TeamPCP Supply Chain Escalation (LiteLLM → Xinference) |
| Attribution | TeamPCP (confidence: high) |
| Target | Python developers building AI/ML applications; downstream LLM platforms |
| Vector | Malicious PyPI package with embedded second-stage payload and PyPI propagation logic |
| Status | active |
| First Observed | 2026-04-22 |

## Detailed Findings

The campaign features PyPI propagation logic: the script generates a Python .pth-based payload designed to execute when Python starts, then prepares and uploads malicious Python packages with Twine if the required credentials are present, turning one compromised developer environment into additional package compromises. This self-propagating mechanism distinguishes xinference from earlier LiteLLM attacks and indicates TeamPCP has operationalized PyPI credential theft as a force-multiplier tactic. The same threat actor used Trivy scanner compromise to steal LiteLLM maintainer credentials in late March; xinference poisoning represents operational continuity and capability maturation.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Malicious PyPI package distribution to compromise downstream users |
| Credential Access | T1110.001 | Credential stealer payload harvests environment variables, SSH keys, and cloud tokens |
| Lateral Movement | T1570 | Self-propagating mechanism targets developer credentials to upload additional malicious packages |

## IOCs

### Domains

_Source: JFrog/Hacker News analysis (Apr 24, 2026)_

### Full URL Paths

_Source: JFrog/Hacker News analysis (Apr 24, 2026)_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
xinference==2.6.0
xinference==2.6.1
xinference==2.6.2
```

## Detection Recommendations

Monitor PyPI for uploads from known-compromised maintainer accounts; implement pip-audit or Software Composition Analysis scanning for xinference 2.6.0–2.6.2; check CI/CD logs for unexpected Twine invocations or .pth file execution; audit Kubernetes clusters and cloud credential stores (AWS Secrets Manager, GCP Secret Manager) for evidence of large-scale secret enumeration between April 22–25, 2026.

## References

- [The Hacker News] Self-Propagating Supply Chain Worm Hijacks npm Packages to Steal Developer Tokens (2026-04-24) — https://thehackernews.com/2026/04/self-propagating-supply-chain-worm.html
- [Adversa AI] Top GenAI security resources — April 2026 (2026-04-25) — https://adversa.ai/blog/top-genai-security-resources-april-2026/
