# Malicious LLM Router Infrastructure Compromise: 26 Routers Stealing Credentials and Draining Crypto Wallets via AI Intermediaries

**Date:** 2026-04-17
**Tags:** shadow-ai, llmjacking, supply-chain

## Executive Summary

26 LLM routers are secretly injecting malicious tool calls and stealing credentials, with one draining a client's $500,000 crypto wallet. The team documented real-world abuses including routers secretly injecting malicious tool calls, stealing credentials and draining a client's crypto wallet of $500,000.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI Router Infrastructure Exploitation Campaign |
| Attribution | Unknown (confidence: none) |
| Target | AI service users relying on LLM router intermediaries; cryptocurrency accounts |
| Vector | Malicious LLM router services intercepting and modifying AI model requests |
| Status | active |
| First Observed | 2026-04-13 |

## Detailed Findings

Security researchers warn that "LLM routers"—services that sit between users and AI models—are emerging as powerful attack points that can intercept and alter sensitive data. These routers are designed to forward requests to models like OpenAI or Anthropic, but they also have full access to everything passing through them, including sensitive data. Users assume they are interacting directly with a reputable AI model such as OpenAI, Grok or otherwise, when in reality many requests pass through intermediary services that can see and modify that data. A malicious router can replace a benign command with an attacker-controlled one or silently exfiltrate every credential that passes through it.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Man-in-the-Middle Attack | T1557 | Malicious routers intercept and modify traffic between users and LLM providers |
| Credential Access | T1110 | Credentials and API keys stolen from requests routed through compromised routers |
| Exfiltration Over C2 Channel | T1041 | Stolen credentials and sensitive data exfiltrated via compromised router infrastructure |

## IOCs

### Domains

_No IOCs published in source material; incident documented via researcher disclosure_

### Full URL Paths

_No IOCs published in source material; incident documented via researcher disclosure_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor for unusual tool invocations or command modifications in AI agent logs. Inspect API request/response patterns for evidence of MITM manipulation. Implement request signing and validation to detect tampering. Use rate limiting and anomaly detection on LLM provider APIs to identify credential abuse. Audit router service endpoints and verify TLS certificates. Implement network segmentation to restrict AI traffic routing through untrusted proxies.

## References

- [CoinDesk] As AI agents scale in crypto, researchers warn of a critical security gap (2026-04-13) — https://www.coindesk.com/tech/2026/04/13/ai-agents-are-set-to-power-crypto-payments-but-a-hidden-flaw-could-expose-wallets
- [KDnuggets] Are AI Agents Your Next Security Nightmare? (2026-04-13) — https://www.kdnuggets.com/are-ai-agents-your-next-security-nightmare
