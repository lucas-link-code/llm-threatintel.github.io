# CrowdStrike Links South Korean Bank Breaches to ARTEX AI Pentest Tool, Claude Code and Multiple LLMs

**Date:** 2026-10-11
**Tags:** malicious-tool, shadow-ai

## Executive Summary

CrowdStrike reported that the operator behind late September and early October 2026 breaches of South Korean banks and savings banks chained ARTEX, a Chinese open source AI penetration testing tool, with Anthropic's Claude Code and several large language models including DeepSeek v4.1-flash, GLM-5.3 and Grok 4.6. Seven Korean financial firms and about 66,000 customers were affected. Defenders should treat exposed AI agent session logs, configuration files and memory files as operational artifacts and watch for unauthorized LLM API use inside intrusion activity.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | South Korean Bank AI Agent Intrusion Campaign |
| Attribution | Chinese speaking financially motivated individual (moderate confidence, per CrowdStrike) (confidence: medium) |
| Target | South Korean banks and savings banks; seven financial firms and about 66,000 customers |
| Vector | Intrusion run with AI penetration testing agent ARTEX plus Anthropic Claude Code and third party LLM APIs, staged through a Hong Kong server and a nine address proxy list |
| Status | active |
| First Observed | 2026-09-27 |

## Detailed Findings

CrowdStrike's threat intelligence unit, in a report released on October 7 2026, analyzed the wave of breaches that hit South Korean banks and savings banks from late September into early October 2026 [tenbrief.com](https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/). Korean regulators and the affected companies reported that seven financial firms and about 66,000 customers were impacted [tenbrief.com](https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/). CrowdStrike assessed with moderate confidence that a single Chinese speaking operator motivated by money ran the campaign, and did not name a group [tenbrief.com](https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/). The toolkit combined ARTEX, an open source AI penetration testing tool built in China that autonomously hunts for and exploits weaknesses in specific services, with Anthropic's Claude Code coding agent [tenbrief.com](https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/). ARTEX ran mainly on DeepSeek v4.1-flash accessed through a reseller, with Zhipu AI's GLM-5.3 and xAI's Grok 4.6 used as helper models in additional sessions [tenbrief.com](https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/). The evidence came from the attacker's own infrastructure: a publicly browsable directory on one server held Claude Code conversation logs, ARTEX configuration files, AI memory files carried between sessions and a Chinese language prompt document instructing LLMs how to run a penetration test; a pointer led to a second Hong Kong server that acted as the main hub holding the record of the operation, plus a proxy list of nine IP addresses used to hide the real location [tenbrief.com](https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/).

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | ARTEX autonomously hunts for and exploits weaknesses in specific exposed services during the intrusion |
| Valid Accounts | T1078 | Credential harvesting and lateral movement inside the targeted financial firms per the reported attack chain |

## IOCs

### Domains

_No CVEs, hashes, domains or IPs published in the available reporting. The proxy list of nine IP addresses was described but not enumerated by the source._

### Full URL Paths

_No CVEs, hashes, domains or IPs published in the available reporting. The proxy list of nine IP addresses was described but not enumerated by the source._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
South Korean banking and savings bank systems
Anthropic Claude Code
DeepSeek v4.1-flash
Zhipu AI GLM-5.3
xAI Grok 4.6
ARTEX
```

## Detection Recommendations

Monitor authentication and process telemetry on internet facing financial services for autonomous scanning and exploitation patterns consistent with an AI pentest agent. Hunt for unexpected outbound API traffic to third party LLM and AI coding agent endpoints from server and administrative hosts. Treat exposed or unexpected AI agent artifacts (Claude Code session logs, agent memory files, pentest tool configuration) on internal or internet facing systems as incident indicators, and restrict who can install or run AI coding agents on production and administrative hosts. Baseline and alert on proxy use from administrative segments that masks origin location.

## References

- [tenbrief.com (relaying CrowdStrike)] CrowdStrike: Korean bank hacker used Claude Code and DeepSeek and left the AI logs on an open server (2026-10-11) — https://tenbrief.com/en/2026/10/11/crowdstrike-korean-bank-hacker-claude-code-deepseek/
