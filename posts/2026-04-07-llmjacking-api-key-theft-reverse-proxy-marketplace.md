# LLMjacking Industrializes: 376% Surge in AI Credential Theft, Underground Marketplaces, and Reverse Proxy Operations

**Date:** 2026-04-07
**TLP:** TLP:CLEAR
**Tags:** llmjacking, shadow-ai

## Executive Summary

Sysdig documented a 376% increase in credential theft targeting AI services between Q4 2025 and Q1 2026, with daily victim costs exceeding $100,000 when flagship models are abused. Underground marketplaces now sell stolen LLM API keys on a structured pricing tier from $50 for GPT-3.5 access to $5,000 for whitelisted enterprise keys with no rate limits. Attackers deploy OpenAI Reverse Proxies containing dozens of stolen keys to resell access at scale. Defenders should implement API key rotation policies, monitor for anomalous token consumption patterns, and restrict cloud credential exposure in container environments.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LLMjacking Reverse Proxy Operations |
| Attribution | Multiple financially motivated actors including Storm-2139 (confidence: medium) |
| Target | Enterprise cloud environments with AI API credentials, LLM service providers |
| Vector | Misconfigured container environments, exposed credentials, credential theft |
| Status | active |
| First Observed | 2024-04 |

## Detailed Findings

According to Sysdig Threat Research Team, which coined the term "LLMjacking" in 2024, credential theft targeting AI services increased 376% between Q4 2025 and Q1 2026. The attack pattern has evolved from opportunistic key harvesting to an industrialized cybercrime marketplace with structured pricing, dedicated resale infrastructure, and professional service tiers.

Sysdig documented that attackers deploy OpenAI Reverse Proxies (ORPs) containing dozens of stolen API keys that serve as storefronts to resell unauthorized access to enterprise LLM models. Researchers discovered ORPs with total token usage exceeding two billion tokens, demonstrating the scale at which stolen credentials are monetized. A single stolen OpenAI API key sells for as little as $30 on the dark web, while daily compute costs to the victim can exceed $46,000.

Oracle-42 Intelligence reported structured underground marketplace pricing for stolen credentials in 2026: $50 to $200 for basic GPT-3.5 access, $500 to $2,000 for enterprise-tier keys (GPT-4, Claude-3), and $3,000 to $5,000 for whitelisted keys with no rate limits. Keys are distributed via Telegram bots, Discord channels, underground forums including LLMHub and TokenBazaar, and decentralized cryptocurrency exchanges.

According to Upwind Security, threat actors exploit misconfigured container environments to locate hardcoded API keys or weakly scoped IAM roles. They deploy OAI reverse proxy techniques to mask unauthorized access and route external traffic through the compromised organization's billing account. The activity produces anomalous API volume spikes and irregular prompt behaviors without triggering traditional SIEM exfiltration alerts because no data leaves the environment in a conventional sense.

Pillar Security and BleepingComputer documented Operation Bizarre Bazaar, the first attributed large-scale LLMjacking campaign with commercial marketplace monetization, which executed 35,000 attack sessions in 40 days between December 2025 and January 2026, averaging 972 attacks per day. Notably, 60% of attack traffic shifted from compute theft to Model Context Protocol (MCP) reconnaissance, mapping lateral movement pathways into internal systems rather than just stealing inference cycles. The operation runs silver.inc as a commercial marketplace reselling unauthorized access to over 30 LLM providers at 40-60% discounts.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Application Access Token | T1528 | Harvesting LLM API keys from container environments and cloud configurations |
| Resource Hijacking | T1496 | Running inference workloads at victim expense via stolen credentials |
| Valid Accounts: Cloud Accounts | T1078.003 | Using legitimate API keys to access enterprise LLM services |
| Credentials from Password Stores | T1555 | Extracting API keys from environment variables, config files, and secrets managers |
| Proxy | T1090 | OpenAI Reverse Proxy infrastructure reselling stolen access |
| Exploit Public-Facing Application | T1190 | Targeting misconfigured container environments for credential access |

## IOCs

### Domains

```
silver.inc
llmjacking.services
api-proxy.ai-services.cloud
```

### Full URL Paths

*No specific URL paths published beyond previously documented infrastructure.*

### Splunk Format

```
"silver.inc" OR "llmjacking.services" OR "api-proxy.ai-services.cloud"
```

### File Hashes

*No file hashes published. Attack relies on credential theft and proxy infrastructure rather than malware deployment.*

### Package Indicators

*No package indicators. Attack vector is credential compromise, not supply chain.*

## Detection Recommendations

Monitor cloud API usage dashboards for anomalous token consumption spikes: sudden increases in API call volume, requests during off-hours, or model usage patterns inconsistent with authorized workloads. In AWS CloudTrail or GCP audit logs, query for API key usage from unexpected IP ranges or geographic locations. Implement API key rotation on a schedule no longer than 90 days for all LLM service credentials. Search container orchestration logs for exposed environment variables containing API key patterns matching sk-ant-, sk-, or OPENAI_API_KEY. Monitor network egress for connections to known ORP infrastructure including silver.inc. Set billing alerts at thresholds significantly below monthly budgets to catch LLMjacking before costs escalate. Audit IAM role scope for any service account with access to AI/ML APIs to ensure least privilege.

## References

- [Sysdig] LLMjacking: From Emerging Threat to Black Market Reality (2026) — https://sysdig.com/blog/llmjacking-from-emerging-threat-to-black-market-reality
- [Upwind Security] LLMjacking: What Is It and Why Is It a Concern (2026-03) — https://www.upwind.io/glossary/llmjacking-what-is-it-and-why-is-it-a-concern
- [Oracle-42 Intelligence] LLMjacking Stolen API Credentials Underground Marketplace 2026 (2026) — https://app.eno.cx.ua/intel/llmjacking-stolen-api-credentials-underground-marketplace-2026.html
- [Prompt Guardrails] LLMjacking: The $100K-Per-Day Attack Draining Enterprise AI Budgets (2026) — https://promptguardrails.com/blog/llmjacking-stolen-credentials-ai-budget-attack
