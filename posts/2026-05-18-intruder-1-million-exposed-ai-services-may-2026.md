# Massive Exposure of 1 Million AI Services—Intruder Security Scan Reveals Critical Misconfigurations and Authentication Gaps in Self-Hosted LLM Infrastructure

**Date:** 2026-05-18
**Tags:** shadow-ai

## Executive Summary

Intruder researchers scanned 1 million exposed AI services across 2+ million hosts and found AI infrastructure more vulnerable, exposed, and misconfigured than any other software they have investigated. Generic chatbots hosting multimodal LLMs were freely available for jailbreaking, allowing attackers to bypass safety guardrails and access models without logging to their own accounts.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Exposed AI Infrastructure Discovery |
| Attribution | Unknown (confidence: none) |
| Target | Organizations deploying self-hosted LLM infrastructure (Ollama, Flowise, n8n, OpenUI, Claude-powered services) |
| Vector | Weak default configurations, disabled authentication, public internet exposure |
| Status | active |
| First Observed | 2026-05-05 |

## Detailed Findings

AI infrastructure scanned was more vulnerable, exposed, and misconfigured than any other software previously investigated. Generic chatbots hosting multimodal LLMs—including Anthropic, Deepseek, Moonshot, Google, and OpenAI models—were freely accessible; malicious users can jailbreak them without fear of repercussion since requests are not logged to attacker accounts. Some Claude-powered services exposed API keys in plaintext; exposed instances of agent management platforms (n8n, Flowise) were found with zero authentication. 518 servers were wrapping frontier models from major providers. A significant number of hosts had been deployed with no authentication because authentication is not enabled by default in many projects.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploitation of Public-Facing Application | T1190 | Attackers accessing unauthenticated LLM endpoints |
| Default Credentials | T1110.001 | Weak or absent authentication on self-hosted AI infrastructure |
| Abuse of Functionality | T1648 | Jailbreaking exposed models to bypass safety guardrails |

## IOCs

### Domains

_Intruder researchers identified specific deployment platforms via CT logs; no specific IOCs published due to responsible disclosure_

### Full URL Paths

_Intruder researchers identified specific deployment platforms via CT logs; no specific IOCs published due to responsible disclosure_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
ollama
flowise
n8n
openui
```

## Detection Recommendations

Inventory all self-hosted AI infrastructure with authentication audits; enable mandatory authentication on Ollama, Flowise, n8n, and similar services by default; implement network segmentation to restrict AI service access to trusted internal IPs only; scan for exposed LLM endpoints using certificate transparency logs; monitor CloudTrail/GCP logs for unauthorized API calls to frontier models from unexpected regions; flag jailbreak attempts in model logs via token pattern anomaly detection.

## References

- [Intruder Security] We Scanned 1 Million Exposed AI Services. Here's How Bad the Security Actually Is (2026-05-05) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
- [GuardianMSSP] We Scanned 1 Million Exposed AI Services (2026-05-05) — https://www.guardianmssp.com/2026/05/05/we-scanned-1-million-exposed-ai-services-heres-how-bad-the-security-actually-is/
- [TechJuice] New AI Infrastructure Could Expose Sensitive Enterprise Data (2026-05-05) — https://www.techjuice.pk/ai-infrastructure-cybersecurity-risks-exposed-systems/
