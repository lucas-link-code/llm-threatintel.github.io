# Massive Exposure of 1 Million AI Services Reveals Critical Misconfiguration and Security Debt in Production AI Infrastructure

**Date:** 2026-05-08
**Tags:** shadow-ai

## Executive Summary

The AI infrastructure scanned was more vulnerable, exposed, and misconfigured than any other software the researchers have investigated, with businesses moving fast to self-host LLM infrastructure at the expense of security, and in the wake of the ClawdBot fiasco the Intruder team investigated how bad the security of AI infrastructure actually is, finding the AI infrastructure scanned was more vulnerable, exposed, and misconfigured than any other software they've ever investigated. Researchers discovered exposed instances of agent management platforms, including n8n and Flowise, with some instances that users clearly thought were internal exposed to the internet without authentication, including one egregious example where a Flowise instance exposed the entire business logic of an LLM chatbot service with its credential list, hardened enough not to reveal stored values to unauthenticated visitors but allowing attackers to still use tools connected to those credentials to exfiltrate sensitive information.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Widespread AI Infrastructure Misconfiguration and Shadow AI Exposure (Ongoing) |
| Attribution | Systemic risk from rapid AI adoption without security controls; attackers actively scanning and exploiting exposed instances (confidence: medium) |
| Target | Organizations self-hosting LLM applications, chat interfaces, agent platforms (n8n, Flowise, LangFlow); enterprises with unmanaged AI deployments |
| Vector | Exposed endpoints on internet without authentication; misconfigured MCP servers; unprotected agent management platforms; chatbots with exposed conversation history |
| Status | active |
| First Observed | 2026-05-05 |

## Detailed Findings

Using certificate transparency logs researchers pulled just over 2 million hosts with 1 million exposed services, finding AI infrastructure was more vulnerable, exposed, and misconfigured than any other software they've investigated. A number of instances involved chatbots that left user conversations exposed, with one example based on OpenUI exposing a user's full LLM conversation history, and more concerning were generic chatbots hosting a wide range of models—including multimodal LLMs—freely available to use, with malicious users able to jailbreak most models to bypass safety guardrails for nefarious purposes without fear of repercussion since they're using someone else's infrastructure, with people finding creative ways to abuse company chatbots to access more capable models without paying or having requests logged to their own accounts. These platforms are particularly dangerous because there's a distinct absence of proper access management controls in AI tooling, meaning access to a bot that's integrated with a third-party system often means access to everything it touches.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exposed Services and Misconfiguration | T1592 | 1 million AI services exposed on internet without authentication controls |
| Unauthorized Access | T1021 | Direct access to LLM chat interfaces, agent platforms, and backend systems through exposed endpoints |
| Jailbreak / Prompt Injection | T1598 | Attackers bypass model safety guardrails on freely exposed chatbots to generate malicious content or extract data |
| Lateral Movement via Integrated Tools | T1570 | Access to exposed AI platform credentials enables abuse of connected third-party systems and APIs |

## IOCs

### Domains

_Research based on certificate transparency logs identifying 2M+ hosts, 1M exposed services. Specific vulnerable instances not enumerated in public disclosure to prevent coordinated attack._

### Full URL Paths

_Research based on certificate transparency logs identifying 2M+ hosts, 1M exposed services. Specific vulnerable instances not enumerated in public disclosure to prevent coordinated attack._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
n8n
Flowise
LangFlow
OpenUI
```

## Detection Recommendations

Defenders should: (1) Inventory all internet-facing LLM services and agent platforms using certificate transparency or network scanning; (2) Enforce network authentication (OAuth, API key, mTLS) on all AI endpoints; (3) Disable or restrict jailbreak-prone features on public-facing chatbots; (4) Implement conversation logging and audit trails; (5) Restrict agent and tool access using least-privilege IAM; (6) Monitor for unusual inference patterns (high volume, unusual prompt content, repeated failed jailbreak attempts); (7) Segment AI infrastructure from core business systems to contain lateral movement; (8) Regularly scan public AI models and endpoints for credential leakage in model contexts or conversation history.

## References

- [The Hacker News] We Scanned 1 Million Exposed AI Services. Here's How Bad the Security Actually Is (2026-05-05) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
