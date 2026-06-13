# Intruder Scans 1 Million Exposed AI Services: Finds Critical Misconfiguration, No Authentication, and Direct RCE Paths Across Self-Hosted LLM Infrastructure

**Date:** 2026-05-09
**Tags:** shadow-ai, malicious-tool

## Executive Summary

AI infrastructure scanned was more vulnerable, exposed, and misconfigured than any other software investigated. In the wake of the ClawdBot fiasco—a viral self-hosted AI assistant averaging 2.6 CVEs per day—the Intruder team investigated how bad AI infrastructure security actually is. Using certificate transparency logs, researchers pulled just over 2 million hosts with 1 million exposed services.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mass AI Infrastructure Exposure Survey |
| Attribution | Intruder Security Research (confidence: high) |
| Target | Organizations self-hosting LLM services, AI chatbots, agent platforms (n8n, Flowise) |
| Vector | Misconfigured, unauthenticated endpoints exposed via public internet; certificate transparency log scanning |
| Status | active |
| First Observed | 2026-05-05 |

## Detailed Findings

Chatbots left user conversations exposed, including full LLM conversation history on OpenUI instances. Generic chatbots hosted multimodal LLMs freely available without authentication. Malicious users can jailbreak models to bypass safety guardrails and use compromised infrastructure without fear of repercussion. Exposed instances of agent management platforms (n8n and Flowise) were discovered. Some Flowise instances users thought were internal had been exposed to the internet without authentication. One Flowise instance exposed the entire business logic of an LLM chatbot service and credential list, though values were not revealed to unauthenticated visitors. There is a distinct absence of proper access management controls in AI tooling, meaning access to a bot integrated with a third-party system often means access to everything it touches.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exposed Credentials | T1552 | Exposed API keys, cloud credentials in Flowise configurations |
| Lateral Tool Transfer | T1570 | Compromised AI agents with access to integrated third-party systems |
| Abuse of Functionality | T1648 | Jailbreaking exposed models to bypass safety controls |

## IOCs

### Domains

_No specific IOCs published; vulnerability class is misconfiguration and lack of authentication controls on self-hosted AI infrastructure_

### Full URL Paths

_No specific IOCs published; vulnerability class is misconfiguration and lack of authentication controls on self-hosted AI infrastructure_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
n8n
Flowise
OpenUI
```

## Detection Recommendations

Monitor certificate transparency logs for new AI service domains. Implement mandatory authentication and access controls on all self-hosted AI infrastructure (Flowise, n8n, LangChain). Audit Flowise configurations for exposed credential references. Implement egress filtering to prevent compromised AI agents from exfiltrating data or communicating with attacker-controlled systems. Deploy rate limiting on LLM API endpoints to detect abuse. Establish baseline behavior profiles for chatbot and agent systems and alert on anomalous usage patterns.

## References

- [The Hacker News] We Scanned 1 Million Exposed AI Services. Here's How Bad the Security Actually Is (2026-05-05) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
- [Intruder Security] AI Infrastructure Security Report (2026-05-05) — https://www.intruder.io/
