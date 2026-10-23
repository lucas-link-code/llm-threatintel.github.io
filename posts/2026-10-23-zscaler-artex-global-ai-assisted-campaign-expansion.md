# Zscaler ThreatLabz Expands ARTEX Investigation to a Global AI Assisted Campaign Spanning Multiple Industries

**Date:** 2026-10-23
**Tags:** malicious-tool, prompt-injection

## Executive Summary

Zscaler ThreatLabz expanded its ARTEX investigation beyond South Korean financial firms, documenting a global AI assisted campaign that chains Claude Code, Codex, and Grok workspaces with a customized ARTEX deployment and custom handoff scripts. Prompt histories show cross model task splitting and peer review, with GLM reviewing work produced by DeepSeek and its subagents, and requests for bulk personal and transaction data plus questions about selling stolen data that point to a financial motive. Defenders should treat exposed AI coding assistant workspaces and sync scripts as intrusion infrastructure, not developer tooling.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX global AI assisted campaign |
| Attribution | Unattributed (confidence: none) |
| Target | Organizations across multiple industries and geographic regions, initially identified as South Korean financial institutions |
| Vector | Customized ARTEX penetration testing framework combined with AI coding assistants and custom automation and synchronization scripts |
| Status | active |
| First Observed | 2026-08-04 |

## Detailed Findings

According to Zscaler ThreatLabz, an October 2026 investigation found AI assisted attacks that combined a customized ARTEX deployment with Claude Code, Codex, and Grok workspaces, where custom scripts shared instructions and supported handoffs between AI sessions. ThreatLabz reported that ARTEX was configured to use a DeepSeek model through an OpenAI compatible gateway, and that other configurations specified DeepSeek, GLM, and Grok. ThreatLabz stated that prompts directed AI models to divide investigation tasks and review one another's findings, including instructions for GLM to review work performed by DeepSeek and its subagents. Saved project records and synchronization scripts were designed to preserve investigation context and progress across accounts, servers, and AI sessions. ThreatLabz reported that the recorded prompts spanned August 4 through October 4, 2026 (UTC), and that prompt histories revealed targeting across multiple industries and geographic regions, with requests for bulk personal and transaction data and questions about selling stolen data suggesting a financial motive. Zscaler noted that CrowdStrike separately reported on related ARTEX infrastructure and the targeting of South Korean financial organizations on October 7, 2026.

## IOCs

### Domains

_No IOCs published in the cited reporting_

### Full URL Paths

_No IOCs published in the cited reporting_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
ARTEX
Claude Code
Codex
Grok
DeepSeek
GLM
```

## Detection Recommendations

Monitor for outbound traffic from developer workstations to OpenAI compatible model gateways that do not match approved provider allowlists, particularly combined with concurrent Claude Code, Codex, or Grok session activity. Hunt for synchronization scripts and saved project records that shuttle task context between servers and AI sessions, and for process trees where a penetration testing harness spawns AI CLI sessions. Alert on bulk queries against personal and transaction databases originating from hosts that also show AI session artifacts.

## References

- [Zscaler ThreatLabz] Inside a Global AI-Assisted Hacking Campaign (2026-10-23) — https://www.zscaler.com/blogs/security-research/inside-global-ai-assisted-hacking-campaign
