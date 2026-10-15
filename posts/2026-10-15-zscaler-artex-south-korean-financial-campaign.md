# Zscaler Details ARTEX AI Pentest Campaign Against South Korean Financial Firms, 67,000 Records Stolen

**Date:** 2026-10-15
**Tags:** malicious-tool, nation-state

## Executive Summary

Zscaler ThreatLabz analyzed a campaign in which a threat actor abused the open source ARTEX agentic penetration testing framework to breach multiple South Korean financial institutions, exfiltrating PII belonging to about 67,000 individuals. The actor used Claude Code sessions to seek advice on selling the stolen financial PII and to locate Korean language Telegram channels used to sell stolen data. ThreatLabz assesses with moderate confidence that the work is that of a financially motivated Chinese speaking actor.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX South Korean financial campaign |
| Attribution | Financially motivated Chinese speaking actor, moderate confidence per Zscaler ThreatLabz (confidence: medium) |
| Target | South Korean financial institutions, including customer facing inquiry portals and employee facing mobile application backends |
| Vector | ARTEX LLM driven reconnaissance and exploitation of peripheral internet facing web applications using SQL injection and authentication bypass |
| Status | active |
| First Observed | 2026-09 |

## Detailed Findings

According to [zscaler.com](https://www.zscaler.com/blogs/security-research/threat-actor-abuses-agentic-ai-pentesting-framework-target-south-korean), Zscaler ThreatLabz analyzed a recently active exploitation campaign in which a threat actor abused ARTEX to target South Korean financial institutions, affecting multiple firms and resulting in exfiltration of PII belonging to approximately 67,000 individuals. ARTEX is an open source agentic penetration testing framework developed in China and released on GitHub by the developer Autumn-27, and it orchestrates multiple LLM backends to autonomously perform reconnaissance, vulnerability identification and exploitation, lowering the technical barrier for complex intrusion campaigns. ThreatLabz reported the campaign unfolds in four phases: reconnaissance, where ARTEX agents probed peripheral internet facing web applications such as customer facing inquiry portals and employee facing mobile application backends; exploitation, where LLM agents found and used SQL injection and authentication bypass; data exfiltration of full names, phone numbers, annual income figures and loan limits; and monetization planning, where the actor used Claude Code sessions to seek advice on selling the stolen South Korean financial PII and to find Korean language Telegram channels that sell stolen data. ThreatLabz assesses with moderate confidence that this is a financially motivated Chinese speaking actor, and the campaign was first observed in late September 2026. CrowdStrike independently linked the same South Korean bank breaches to the ARTEX AI pentest tool, Claude Code and multiple LLMs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | ARTEX agents exploited SQL injection and authentication bypass in customer facing inquiry portals and mobile application backends. |
| Exfiltration Over Web Service | T1567 | Stolen financial PII was staged for sale through Korean language Telegram channels according to Zscaler. |

## IOCs

### Domains

_No IOCs published. Zscaler described the ARTEX framework and campaign phases without releasing domains, hashes, IPs or package identifiers._

### Full URL Paths

_No IOCs published. Zscaler described the ARTEX framework and campaign phases without releasing domains, hashes, IPs or package identifiers._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Customer facing inquiry portals
Employee facing mobile application backends
```

## Detection Recommendations

Harden and monitor peripheral internet facing web applications, including inquiry portals and mobile backend APIs, for SQL injection and authentication bypass attempts independent of core banking. Watch for anomalous automated reconnaissance patterns such as rapid sequential probing across many endpoints. Restrict outbound access from build and analyst workstations to AI coding tools where policy does not require it, and monitor for large transfers of customer PII toward messaging platforms.

## References

- [Zscaler ThreatLabz] Threat Actor Abuses AI Pentesting Framework to Target South Korean Financial Institutions (2026-10-14) — https://www.zscaler.com/blogs/security-research/threat-actor-abuses-agentic-ai-pentesting-framework-target-south-korean
