# LLM Router Infrastructure Compromise: 26 Malicious Services Intercepting AI Credentials and Draining Crypto Wallets

**Date:** 2026-04-15
**Tags:** shadow-ai, malicious-tool

## Executive Summary

26 LLM routers are secretly injecting malicious tool calls and stealing credentials, with one draining a client's $500k wallet. "LLM routers"—services that sit between users and AI models—are emerging as powerful attack points that can intercept and alter sensitive data, with routers designed to forward requests to models but having full access to everything passing through them.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LLM Router Credential Interception Campaign |
| Attribution | Unknown (confidence: none) |
| Target | Cryptocurrency users, AI service subscribers relying on router intermediaries |
| Vector | Malicious LLM routing infrastructure intercepting API requests and credentials |
| Status | active |
| First Observed | 2026-04-13 |

## Detailed Findings

Researchers documented that 26 LLM routers are secretly injecting malicious tool calls and stealing credentials, with one router draining a $500k crypto wallet; attackers also managed to poison routers to forward traffic to their own infrastructure, taking over approximately 400 hosts within hours. Because AI systems can operate autonomously and frequently approve actions without human review, a single altered instruction can immediately compromise systems or funds, with private keys, API credentials, and wallet access tokens often passing through these systems in plain text.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Credential Access | T1589 | Theft of API keys and cloud credentials via intercepted LLM API calls |
| Man in the Middle | T1557 | Malicious routers positioned between users and AI service endpoints |
| Exfiltration Over Alternative Protocol | T1048 | Stolen credentials transmitted to attacker-controlled infrastructure |

## IOCs

### Domains

_No specific IOCs published by researchers; attack identified through infrastructure analysis_

### Full URL Paths

_No specific IOCs published by researchers; attack identified through infrastructure analysis_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor for unusual LLM API request patterns, implement end-to-end encryption for LLM API communications, enforce certificate pinning for AI model endpoints, audit router configurations for credential access logging, deploy anomaly detection on credential usage patterns, and implement rate-limiting on suspicious tool invocation sequences.

## References

- [CoinDesk] As AI agents scale in crypto, researchers warn of a critical security gap (2026-04-13) — https://www.coindesk.com/tech/2026/04/13/ai-agents-are-set-to-power-crypto-payments-but-a-hidden-flaw-could-expose-wallets
