# Malicious LLM Router Infrastructure Compromise: 26 Routers Injecting Malicious Code and Stealing Credentials via AI Agent Intermediaries

**Date:** 2026-04-16
**Tags:** shadow-ai, malware

## Executive Summary

26 LLM routers are secretly injecting malicious tool calls and stealing credentials, with at least one documented case draining a $500K crypto wallet. LLM routers sit between users and AI models as intermediaries and have full access to everything passing through them, including sensitive data, while these routers are designed to forward requests to models like OpenAI or Anthropic. Leaked OpenAI keys and weakly configured routers processed 2.1B tokens, exposing 99 credentials across 440 Codex sessions.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Malicious Intermediary Attacks on LLM Supply Chain |
| Attribution | Unknown; commodity router ecosystem abuse (confidence: none) |
| Target | AI agent users, developers using Claude Code and other AI coding assistants, cryptocurrency users, enterprises using LLM routing infrastructure |
| Vector | Malicious or compromised third-party API router services that sit between AI agents and LLM providers (OpenAI, Anthropic, Google); MITM access to plaintext JSON payloads |
| Status | active |
| First Observed | 2026-04-08 |

## Detailed Findings

Third-party services used to route requests between AI agents and large language models could expose users to credential theft and crypto losses. API routers drop TLS sessions and therefore have access to all plaintext data, including API keys or secret credentials, being transferred between the agent and the models, and routers stand at the trust boundary because they are capable of altering or stealing information without compromising cryptographic integrity. Analysis of 28 paid routers and 400 free routers found that 1 paid and 8 free routers inject malicious code into returned tool calls, two routers deploy adaptive evasion (e.g., waiting for 50 prior calls or restricting payload delivery to autonomous YOLO mode sessions), 17 routers touch researcher-owned AWS canary credentials, and 1 drains ETH from a researcher-owned Ethereum private key. Two poisoning studies show ostensibly benign routers can be pulled into attack surface as they process end-user requests using leaked credentials and weakly configured peers, with 401 sessions already running in autonomous YOLO mode allowing direct payload injection. A malicious router can replace benign commands with attacker-controlled ones or silently exfiltrate every credential that passes through it, and because these systems operate autonomously with frequent approving and executing of actions without human review, a single altered instruction can immediately compromise systems or funds, with crypto users at severe risk as private keys, API credentials, and wallet access tokens often pass through these systems in plain text.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Man-in-the-Middle | T1557 | Malicious routers intercept and modify plaintext payloads between AI agents and model providers |
| Credential Access | T1110 | Exfiltration of API keys, wallet private keys, and authentication tokens passing through compromised routing infrastructure |
| Execution | T1059 | Payload injection into tool calls to execute attacker-controlled commands in autonomous AI agent workflows |
| Persistence | T1098 | Adaptive evasion techniques hiding malicious rewrites after warm-up periods or in autonomous YOLO mode |

## IOCs

### Domains

_Research identified commodity open-source router templates (sub2api, new-api, one-api) as basis for malicious deployments; no specific IOCs disclosed for active routers by researchers to protect ongoing investigation_

### Full URL Paths

_Research identified commodity open-source router templates (sub2api, new-api, one-api) as basis for malicious deployments; no specific IOCs disclosed for active routers by researchers to protect ongoing investigation_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
sub2api
new-api
one-api
```

## Detection Recommendations

Deploy fail-closed policy gates, response-side anomaly screening, and append-only transparency logging; these attacks occur in the JSON/tool layer before the model sees the request or after it emits a response, outside the model's reasoning loop, and therefore compose with model-side safeguards rather than replacing them. Monitor for unexpected outbound requests from AI agent processes to non-standard hosts. Audit router configuration and credentials rotation logs. Implement mTLS or cryptographic signing for LLM API responses. Never allow private keys or seed phrases to pass through an AI agent session. For developers: isolate AI agent execution in sandboxed environments; restrict router to trusted providers only (AWS Bedrock, Azure OpenAI); disable YOLO mode in production.

## References

- [arXiv] Your Agent Is Mine: Measuring Malicious Intermediary Attacks on the LLM Supply Chain (2026-04-08) — https://arxiv.org/abs/2604.08407
- [CoinDesk] As AI agents scale in crypto, researchers warn of a critical security gap (2026-04-13) — https://www.coindesk.com/tech/2026/04/13/ai-agents-are-set-to-power-crypto-payments-but-a-hidden-flaw-could-expose-wallets
- [Yahoo Finance] Will AI Steal Your Bitcoin? New Research Reveals 26 Malicious LLM Routers Linked to Crypto Theft (2026-04-14) — https://tech.yahoo.com/cybersecurity/articles/ai-steal-bitcoin-research-reveals-101523573.html
- [OECD.AI] Malicious AI Routers Enable Cryptocurrency and Credential Theft (2026-04-13) — https://oecd.ai/en/incidents/2026-04-10-d6e2
- [Risky.biz] Malicious LLM proxy routers found in the wild (2026-04-15) — https://news.risky.biz/risky-bulletin-malicious-llm-proxy-routers-found-in-the-wild/
- [Xcitium Threat Labs] Malicious LLM Routers: A Hidden Threat to AI Supply Chains (2026-04-15) — https://threatlabsnews.xcitium.com/blog/malicious-llm-routers-a-hidden-threat-to-ai-supply-chains/
