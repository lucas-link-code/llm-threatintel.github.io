# Railway Incident Report Attributes October 21 Breach to Attacker Hunting AI Provider Credentials for Distillation

**Date:** 2026-11-11
**Tags:** llmjacking, supply-chain

## Executive Summary

Railway published its full incident report on 2026-11-10 for an attack that began 2026-10-20 and ran until the actor was evicted on 2026-10-21, concluding the attacker was specifically targeting AI provider credentials for sale to distributed transfer stations used in distillation. Railway stated at most 1.85 percent of workspaces, roughly 100,000, could have had environment variables decrypted, linked account tokens for 1,852 users were reset, and unauthorized spend on stolen keys was estimated at about 740,000 USD. Organizations hosting AI provider keys in PaaS build environments should rotate those credentials, audit for lateral movement, and move secrets out of build variable stores.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Railway October 2026 credential theft |
| Attribution | Unnamed financially motivated threat actor (confidence: low) |
| Target | Railway workspaces and customers storing AI provider and source control credentials |
| Vector | Chained exploits granting unauthorized access, lateral movement across Railway systems, and decryption of stored customer variables |
| Status | disrupted |
| First Observed | 2026-10-20 |

## Detailed Findings

According to Railway, engineers became aware of a threat actor with unauthorized access inside Railway systems at 13:58 UTC on 2026-10-20, and the actor chained exploits and moved laterally until it obtained and decrypted a subset of customer variables for at most 1.85 percent of workspaces, approximately 100,000 [blog.railway.com](https://blog.railway.com/p/incident-report-october-security-incident). Railway reported the campaign ran from an initial exploit at 07:28 UTC on 2026-10-20 through 09:24 UTC on 2026-10-21, when the attacker was fully evicted. Railway described the event as a contest of agent speed, with Railway defending against abliterated models and a harness similar to ARTEX, according to Wiz. Railway stated its forensic investigation suggests AI provider keys were the primary target of the attack, determined by parsing the attacker queries which were specifically for AI credentials, and that it believes the credentials were passed to distributed transfer stations for use in distillation. Railway reported the attacker read stored histories of 353 builds between 13:50 and 15:30 UTC on 2026-10-20, sealed variables included, and that decrypted data included linked account tokens such as BYOK agent keys and GitHub OAuth tokens for 1,852 users. Railway stated it reset every one of those tokens, notified each affected user, and identified no logins to Railway accounts using credentials taken in the incident, while unauthorized spend on the stolen keys was estimated to reach about 740,000 USD and it is working with providers to refund it and backstopping it from its own balances. Railway reported containment actions including halting builds twice, at 17:03 UTC on 2026-10-20 and 07:22 UTC on 2026-10-21, rotating internal credentials, invalidating every user session and token at 20:19 UTC on 2026-10-21, and restoring builds for all plans by 22:49 UTC on 2026-10-22 after hardening infrastructure. Railway also stated it contacted GitHub, GitLab, Anthropic, and OpenAI during the incident starting 09:25 UTC on 2026-10-21.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | Railway reported the actor decrypted stored customer environment variables and build histories containing credentials, including sealed variables and AI provider keys. |
| Valid Accounts | T1078 | Stolen AI provider keys and linked account tokens such as BYOK agent keys and GitHub OAuth tokens were usable as valid credentials, with unauthorized spend estimated at about 740,000 USD. |

## IOCs

### Domains

_No IOCs published by Railway. The report names no attacker infrastructure, domains, hashes, or IP addresses._

### Full URL Paths

_No IOCs published by Railway. The report names no attacker infrastructure, domains, hashes, or IP addresses._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Railway build and workspace environments
AI provider API credentials (BYOK agent keys)
GitHub OAuth tokens
```

## Detection Recommendations

Treat AI provider API keys and BYOK agent keys stored in PaaS build variables, sealed variables, and build histories as exposed if the platform reported impact, and rotate them immediately along with any linked source control OAuth tokens. Monitor AI provider billing for anomalous token consumption that would indicate resale or distillation use, and reconcile spend against expected workloads. Restrict lateral movement by separating build infrastructure from customer data stores, alert on decryption of sealed variables and bulk reads of build histories, and invalidate sessions and tokens at the first sign of credential decryption.

## References

- [Railway] Incident Report: October 21st Security Attack (2026-11-10) — https://blog.railway.com/p/incident-report-october-security-incident
