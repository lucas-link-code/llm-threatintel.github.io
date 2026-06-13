# Massive Exposure of 1 Million AI Services—Intruder Security Scan Reveals Critical Misconfigurations and Authentication Gaps in Self-Hosted LLM Infrastructure

**Date:** 2026-05-12
**Tags:** shadow-ai, supply-chain

## Executive Summary

Using certificate transparency logs to pull just over 2 million hosts with 1 million exposed services, the Intruder team found that the AI infrastructure they scanned was more vulnerable, exposed, and misconfigured than any other software they had ever investigated. A significant number of hosts had been deployed straight out of the box, with no authentication in place. Authentication simply isn't enabled by default in many of these projects, and real user data and company tooling were sitting exposed to anyone who looked.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Large-Scale AI Infrastructure Exposure Survey |
| Attribution | Security research initiative; no malicious campaign (confidence: none) |
| Target | Unpatched self-hosted LLM services, chatbots, agent management platforms across internet |
| Vector | Default configurations, missing authentication, exposed APIs, unsafe serialization in AI frameworks |
| Status | active |
| First Observed | 2026-05-05 |

## Detailed Findings

A number of instances involved chatbots that left user conversations exposed. One example, based on OpenUI, exposed a user's full LLM conversation history. More concerning were generic chatbots hosting a wide range of models—including multimodal LLMs—freely available to use. Malicious users can jailbreak most models to bypass safety guardrails for nefarious purposes—like generating illegal imagery, or soliciting advice with intent to commit a crime—and do so without fear of repercussion, since they're using someone else's infrastructure. They also discovered exposed instances of agent management platforms, including n8n and Flowise. Some instances that users clearly thought were internal had been exposed to the internet without authentication. One of the most egregious examples was a Flowise instance that exposed the entire business logic of an LLM chatbot service. Their credential list was exposed too. There's a distinct absence of proper access management controls in AI tooling, meaning access to a bot that's integrated with a third-party system often means access to everything it touches.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Default Configuration | T1028 | Self-hosted AI services deployed with authentication disabled by default |
| Exposed Service | T1526 | 1 million internet-facing AI services with missing or insufficient access controls |

## IOCs

### Domains

_Specific vulnerable instances not disclosed; research focused on systematic security posture assessment_

### Full URL Paths

_Specific vulnerable instances not disclosed; research focused on systematic security posture assessment_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
n8n
Flowise
OpenUI
```

## Detection Recommendations

Conduct external asset inventory using certificate transparency logs to identify all internet-facing AI services in your environment. Implement mandatory authentication on all AI infrastructure—no deployment should be live without MFA/API key validation. Scan Shodan/Censys regularly for instances of known AI frameworks (Flowise, n8n, LLM gateways) with 'LLM', 'chat', 'agent' in the title. Monitor for default credentials in logs. Enforce network segmentation for AI services and restrict them to private networks unless business requirement demands external access. Implement continuous scanning for exposed conversation histories and credential lists.

## References

- [The Hacker News] We Scanned 1 Million Exposed AI Services. Here's How Bad the Security Actually Is (2026-05-05) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
- [Intruder Security Research] Massive Exposure of 1 Million AI Services Reveals Critical Misconfiguration (2026-05-05) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
