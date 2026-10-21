# OpenCode Breach Response Blocked by Frontier Model Safety Refusals, Defenders Switched to OpenAI Daybreak Blue

**Date:** 2026-10-21
**Tags:** llmjacking

## Executive Summary

New reporting adds operational detail to the OpenCode Console breach: attackers ran a large scale distillation attack and stole stored API keys for users who linked external providers, and OpenCode incident response stalled because frontier AI models began refusing investigation requests as the work turned to potentially malicious code. OpenCode stabilized the response only after gaining access to OpenAI Daybreak Blue, a program giving vetted defenders models with fewer restrictions. The breach affected 1.4 percent of OpenCode Console users, with some reporting more than $1,700 in unauthorized charges overnight.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | OpenCode API Key Distillation Attack |
| Attribution | Unknown (confidence: none) |
| Target | OpenCode Console users who linked external providers including OpenAI, Anthropic, and Google |
| Vector | Large scale distillation attack against OpenCode systems using AI agents over at least 48 hours |
| Status | disrupted |
| First Observed | 2026-10-17 |

## Detailed Findings

OpenCode, an open source AI coding agent, disclosed that its systems were compromised in what it described as a large scale distillation attack that exposed stored API keys belonging to users who linked external providers including OpenAI, Anthropic, and Google [bleepingcomputer.com](https://www.bleepingcomputer.com/news/security/opencode-hack-exposes-api-keys-amid-ai-distillation-attacks/). According to OpenCode, the breach affected 1.4 percent of OpenCode Console users and the project notified them by email; users who received no email were not affected. Multiple users reported unauthorized API charges and suspended projects in Google Cloud, with some reporting more than $1,700 in unauthorized charges overnight. The vendor email states the earliest possible key exposure was October 17, 2026 at 00:30 UTC and that no data appears to have been exposed. OpenCode co-founder Dax Raad said attackers targeted the company systems for at least 48 hours using AI agents and that the investigation was blocked when the AI models being used began refusing requests due to built in safety safeguards as the work turned to potentially malicious code [axios.com](https://www.axios.com/2026/10/21/when-ai-models-refuse-to-fight-hackers). Raad said the situation stabilized after OpenCode began using OpenAI Daybreak Blue, a cybersecurity program that gives vetted defenders access to models with fewer restrictions. OpenAI, Google, and Anthropic said they worked with affected customers to revoke exposed API keys and address unauthorized usage charges. OpenCode said it was working with the three providers but could not share further details at the time.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials | T1552 | Stored provider API keys held by OpenCode Console were exposed in the breach |
| Financial Theft | T1657 | Exposed keys were used to generate unauthorized API charges reported by victims |

## IOCs

### Domains

_No attacker infrastructure IOCs published; exposed artifacts are third party API keys. Revoke and rotate linked provider keys._

### Full URL Paths

_No attacker infrastructure IOCs published; exposed artifacts are third party API keys. Revoke and rotate linked provider keys._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
OpenCode Console
OpenAI API
Anthropic API
Google Cloud
```

## Detection Recommendations

Revoke and rotate all provider API keys linked to OpenCode Console accounts, then review Google Cloud, OpenAI, and Anthropic billing for unexpected usage or suspended projects. Monitor for anomalous spend spikes tied to leaked keys and set hard budget caps and alerts on AI provider accounts. For incident responders, confirm that the AI models used for defensive analysis permit work on potentially malicious code so that response is not blocked mid investigation, and track access to restricted defender programs for such cases.

## References

- [BleepingComputer] OpenCode hack exposes API keys amid AI distillation attacks (2026-10-21) — https://www.bleepingcomputer.com/news/security/opencode-hack-exposes-api-keys-amid-ai-distillation-attacks/
- [Axios] OpenCode breach exposes AI's cyber defense dilemma (2026-10-21) — https://www.axios.com/2026/10/21/when-ai-models-refuse-to-fight-hackers
