# Intruder Security Scans Reveal 1 Million Exposed AI Services with Critical Misconfigurations—Authentication Bypass and Unauthenticated Access Across Flowise, n8n, and Chatbot Infrastructure

**Date:** 2026-05-21
**Tags:** shadow-ai, malware

## Executive Summary

The Intruder team scanned 1 million exposed AI services using certificate transparency logs and found that the AI infrastructure they investigated was more vulnerable, exposed, and misconfigured than any other software they have ever analyzed. Instances of agent management platforms including n8n and Flowise were exposed without authentication, with one Flowise instance exposing the entire business logic of an LLM chatbot service along with credential lists.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Intruder AI Infrastructure Exposure Audit |
| Attribution | Unknown (discovered via public scanning) (confidence: none) |
| Target | Self-hosted LLM infrastructure operators, AI service deployments across enterprises |
| Vector | Public internet exposure, misconfigured authentication, unprotected agent platforms |
| Status | active |
| First Observed | 2026-05-14 (publication date) |

## Detailed Findings

One Flowise instance exposed the entire business logic of an LLM chatbot service with credential list exposed; Flowise was hardened enough not to reveal stored values to unauthenticated users, but an attacker could still use the tools connected to those credentials to exfiltrate sensitive information. Chatbots left user conversations exposed, with examples including OpenUI-based platforms exposing full LLM conversation history. Generic chatbots hosted multiple models freely available; malicious users can jailbreak models to bypass safety guardrails and people are finding creative ways to abuse company chatbots to access more capable models without paying or having requests logged to their own accounts.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Reconnaissance | T1592 | Scanning and enumeration of exposed AI services and infrastructure |
| Exploitation of Vulnerability | T1190 | Targeting misconfigured authentication and access control on AI agent platforms |
| Abuse of Functionality | T1078 | Unauthorized use of exposed chatbot services for jailbreaking and model misuse |

## IOCs

### Domains

_No specific IOCs published; vulnerability patterns across multiple deployment types._

### Full URL Paths

```
https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
```

### Splunk Format

```
"https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html"
```

### Package Indicators

```
flowise
n8n
```

## Detection Recommendations

Monitor for unauthenticated access to AI platforms (Flowise, n8n, OpenUI instances); enforce authentication and network segmentation for all agent management platforms; disable public internet exposure for LLM chatbots unless explicitly required; implement WAF rules to block common jailbreak patterns; track outbound API calls from user-controlled chatbots for anomalous token generation; scan certificate transparency logs for internal domain exposures; implement rate limiting on model invocation endpoints.

## References

- [The Hacker News] We Scanned 1 Million Exposed AI Services. Here's How Bad the Security Actually Is (2026-05-14) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
- [Intruder Security Blog (via Dark Reading)] AI Infrastructure Security Assessment (2026-05-13) — https://www.darkreading.com/cyber-risk/industrialized-exploitation-agentic-offensive-security-existential-threat
