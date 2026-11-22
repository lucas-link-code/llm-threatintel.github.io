# Dragos Canary Experiment Exposes Prompt Theft and Data Leakage Across the AI Inference Supply Chain

**Date:** 2026-11-22
**Tags:** supply-chain, llmjacking

## Executive Summary

A Dragos researcher seeded nearly 2 million prompts with unique trackable secrets and found at least three AI providers compromised by attackers who siphoned prompts, multiple resellers that leaked prompts, and providers that ignored zero data retention flags. Stolen AWS keys were reused tens of thousands of times in AWS API calls, and a Chinese AI lab scraped secret URLs even from requests marked no data collection. Enterprises should treat any prompt sent to an external model provider as potentially disclosed and rotate every credential that has transited a third party inference endpoint.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI Inference Supply Chain Canary Experiment |
| Attribution | Unattributed attackers and an unidentified Chinese AI lab scraper, documented by HD Moore of Dragos (confidence: low) |
| Target | Users of AI inference providers, resellers, and model marketplaces that handle sensitive prompts |
| Vector | Prompts submitted to third party model providers and resellers, with secrets copied at the provider front door |
| Status | active |
| First Observed | 2026-07 |

## Detailed Findings

HD Moore, chief research officer at Dragos, seeded each of nearly 2 million prompts with exactly one unique trackable secret, including AWS access keys tied to empty accounts, SSH passwords, and unique URLs, DNS names, and private git repository references, according to [arstechnica.com](https://arstechnica.com/security/2026/11/a-leaky-ai-supply-chain-is-exposing-secret-user-data-at-an-alarming-rate/). He controlled the infrastructure that received any requests using those credentials, so any access revealed the responsible link in the chain. Moore reported that at least three AI providers were compromised by attackers who used their access to siphon prompts they received, that multiple inference marketplace resellers logged prompts and passed them to parties who used the credentials, and that multiple providers failed to honor zero data retention or no data collection flags. In the three provider breaches, every request sent during short windows in late October 2026 was stolen, and some stolen keys came from requests the provider rejected before a model ever ran, which Moore said shows the attacker was copying requests at the provider front door rather than deeper in the inference stack. Stolen bait keys were used tens of thousands of times in AWS API calls; the parties looked through S3 buckets, secrets managers, and parameter stores, tried to enable hosted models in AWS Bedrock, and added their own IAM users to maintain access. Secrets sent to two of the hacked providers were used together from the same rented server almost immediately. Moore also found that a Chinese AI lab fetched secret URLs from more than half of the prompts sent to its models between July and October 2026, including roughly two thirds of requests marked no data collection or zero data retention, with the scraper appearing two or three days after the request. Several United States hosting providers resell that lab models, and prompts sent through them triggered the same scraper because the prompts flowed back to the lab. Later, a git client on a different cloud tried to clone private repositories referenced in the prompts, but only for prompts that used that lab models. In a November 21 update, OpenRouter notified customers that some prompts may have been read, said the potential exposure involved prompts sent to MiniMax, and noted the planted URLs were accessed whether prompts went to MiniMax directly or through resellers AtlasCloud, Novita, and StreamLake; OpenRouter removed a zero data retention label from MiniMax model endpoints.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | AWS keys, SSH passwords, and private repository references were harvested from prompts sent to third party model providers. |
| Valid Accounts: Cloud Accounts | T1078.004 | Stolen AWS keys were reused tens of thousands of times against AWS APIs, including attempts to add IAM users and enable Bedrock models. |

## IOCs

### Domains

_No attacker IOCs published. Exposed entities named by the research and by the OpenRouter customer notice include MiniMax model endpoints and the resellers AtlasCloud, Novita, and StreamLake._

### Full URL Paths

_No attacker IOCs published. Exposed entities named by the research and by the OpenRouter customer notice include MiniMax model endpoints and the resellers AtlasCloud, Novita, and StreamLake._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
MiniMax model endpoints
AtlasCloud
Novita
StreamLake
AWS Bedrock
OpenRouter
```

## Detection Recommendations

Treat every prompt sent to an external model provider or reseller as potentially disclosed. Inventory and rotate any AWS keys, SSH credentials, database passwords, or private repository URLs that have transited third party inference endpoints. Do not treat zero data retention labels as a control when a reseller or upstream provider sits in the path. Monitor cloud audit logs for anomalous AWS API calls that reuse credentials, for new IAM users, and for Bedrock model enablement from unfamiliar principals. Prefer providers with contractual data handling and run egress monitoring for outbound requests generated from model responses.

## References

- [Ars Technica] Researcher plants 2m canaries into the AI supply chain. A privacy disaster surfaced. (2026-11-20) — https://arstechnica.com/security/2026/11/a-leaky-ai-supply-chain-is-exposing-secret-user-data-at-an-alarming-rate/
