# Autonomous Open Source Agents Breached 100+ E-Commerce Sites and Exfiltrated 600,000 Card Records

**Date:** 2026-10-01
**Tags:** malicious-tool, phishing, malware

## Executive Summary

A financially motivated operator chained three open source agent tools, Strix, Cairn, and Hermes, to autonomously breach more than 100 e-commerce sites and exfiltrate over 600,000 payment card records between July and September 2026 at roughly $25 per target. Gambit Security reconstructed the campaign after gaining access to the operator staging server, showing a single human issued fewer than 2,000 prompts across 260 sessions to drive 105 attack waves in a week. Agent cleanup routines destroyed database tables at one victim, so defenders should monitor for autonomous post exploitation damage, not only data theft.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Autonomous Agent Retail Skimming Campaign |
| Attribution | Financially motivated unattributed operator (confidence: medium) |
| Target | E-commerce websites and their payment card data |
| Vector | Open source LLM driven agent pipeline performing reconnaissance, exploitation, and orchestration |
| Status | active |
| First Observed | 2026-07 |

## Detailed Findings

The Cloud Security Alliance reported that a financially motivated operator used three open source, LLM driven tools to autonomously breach more than 100 e-commerce sites and exfiltrate over 600,000 payment card records between July and September 2026, at an average cost of roughly $25 per target, per [labs.cloudsecurityalliance.org](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/09/CSA_research_note_ai_agent_retail_skimming_campaign_20260924-csa-styled.pdf). Gambit Security reconstructed the campaign after obtaining access to the operator staging server, giving an unusually detailed view of how the agents were tasked. A single human operator issued fewer than 2,000 short prompts across 260 sessions to sustain 105 distinct attack waves against dozens of organizations in the space of a week. The operator relied on three tools chained into an offensive pipeline: Strix for reconnaissance and vulnerability scanning, run in deep mode 146 times across 138 hosts with more than 600 hours of scanning in late August 2026; Cairn, an autonomous exploitation engine that operated independently for hours at a time; and Hermes, the orchestration layer coordinating the campaign through a persistent SOUL Red Team Operator persona built from 121 self editing skills, 78 of which were attack focused. For decision making the operator used Anthropic Claude Opus 4.6 through OpenRouter. The agents' own cleanup routines destroyed database tables at one victim, illustrating that autonomous post exploitation behavior can produce collateral damage not deliberately intended by the operator.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public Facing Application | T1190 | Agents autonomously exploited common web application flaws across more than 100 e-commerce targets |
| Data from Information Repositories | T1213 | Over 600,000 payment card records were exfiltrated from victim e-commerce sites |

## IOCs

### Domains

_No IOCs published; the CSA research note names the tooling Strix, Cairn, and Hermes but does not publish attacker infrastructure._

### Full URL Paths

_No IOCs published; the CSA research note names the tooling Strix, Cairn, and Hermes but does not publish attacker infrastructure._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
E-commerce web applications
Open source agent frameworks
```

## Detection Recommendations

Hunt for automated scanning bursts and repeated exploitation attempts against web application endpoints, since the campaign combined deep mode scanning across many hosts in short windows. Monitor database operations for table drops or destructive cleanup activity during intrusion response, as agent cleanup routines caused collateral damage at one victim. Review egress for LLM provider API calls originating from server or CI infrastructure and correlate with exploitation events. Prioritize patching of common web application flaws where machine speed exploitation is feasible.

## References

- [Cloud Security Alliance] Autonomous AI Agents Breach 100+ Sites (2026-09-24) — https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/09/CSA_research_note_ai_agent_retail_skimming_campaign_20260924-csa-styled.pdf
