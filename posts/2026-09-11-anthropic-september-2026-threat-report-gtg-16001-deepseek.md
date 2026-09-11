# Anthropic: GTG-16001 DeepSeek Relayed Customer Traffic to Claude Opus and Harvested Reasoning Traces

**Date:** 2026-09-11
**Tags:** nation-state

## Executive Summary

Anthropic published on 2026-09-10 that cluster GTG-16001 covers DeepSeek silently relaying selected customer requests to Claude Opus and extracting chain of thought transcripts for training. Anthropic said more than 12.1 million exchanges were attributed to DeepSeek over 14 days in July 2026, including internal documents from a PRC technology company, live credentials for a Russian government database, and a PRC police case management build. This feed already covered GTG-20006 from the same report. Treat GTG-16001 as a separate distillation cluster. No domain, IP, or hash was published.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GTG-16001 DeepSeek relay and chain of thought extraction against Claude Opus. Distillation, not a malware family |
| Actor / Attribution | DeepSeek per Anthropic, tracked as GTG-16001. Confidence high for Anthropic's own telemetry. This is a PRC lab distillation case, not the GTG-20006 cyber operations cluster |
| Target | DeepSeek customers whose traffic was selected for relay, including users of Claude Code, the Claude Agent SDK, and OpenCode. Observed content included a PRC technology company, a Russian government agency associated with its Ministry of Defense, and a PRC municipal Public Security Bureau build |
| Vector | String checks on inbound requests tagged third party or Anthropic coding harnesses, then silent relay to Claude Opus plus a cross session replay attack to recover full reasoning traces |
| Status | Anthropic said it identified and disrupted the misuse. Underlying distillation pressure is not claimed as ended |
| First Observed | 14 day window in July 2026. Report published 2026-09-10 |

## Detailed Findings

According to [Anthropic](https://www.anthropic.com/threat-intelligence-report-september-2026), GTG-16001 is the DeepSeek distillation case in the September 2026 threat intelligence report. Anthropic said DeepSeek used tactics similar to Moonshot: a chain of thought extraction pipeline and a cross session replay attack that recovered Opus reasoning traces Anthropic would otherwise have summarized.

Anthropic said DeepSeek also silently relayed customer exchanges to Claude without telling those customers. DeepSeek checked strings in inbound requests, tagged users of third party or Anthropic coding harnesses including Claude Code, the Claude Agent SDK, and OpenCode, and sent selected tagged requests to Claude Opus. Anthropic assessed that this data was likely routed to Anthropic without the knowledge or consent of DeepSeek's customers.

Anthropic listed three examples. An employee at a PRC technology company used what they believed was DeepSeek to analyze internal documentation, including specifications, organizational structure, and strategic objectives of a flagship AI program. DeepSeek relayed that traffic to Claude. An IT operator working with data from a Russian government agency associated with its Ministry of Defense had requests relayed, exposing live credentials for a Russian government database. Engineers building a case management system for a municipal Public Security Bureau in China used DeepSeek, which relayed those requests to Claude, including a tool that compares a person's movements against police records using national ID numbers.

Anthropic attributed more than 12.1 million exchanges to DeepSeek over 14 days in July 2026.

This feed already published the GTG-20006 cyber operations case from the same 2026-09-10 paper. Do not collapse GTG-16001 into GTG-20006. GTG-16001 is a distillation and silent relay cluster. GTG-20006 is the implant, phishing, and mailbox theft cluster.

No domain, IP, hash, or package indicator was published for GTG-16001.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Obtain Capabilities: Artificial Intelligence | T1588.007 | DeepSeek extracted Opus chain of thought traces for training |
| Masquerading | T1036 | Customers who thought they were using DeepSeek received Claude Opus responses |
| Unsecured Credentials: Credentials In Files | T1552.001 | Relayed traffic included live credentials for a Russian government database |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

On Claude and Anthropic API logs, hunt high volume Opus traffic from accounts that later rotate after a ban, especially sessions that look like coding harness traffic from Claude Code, the Claude Agent SDK, or OpenCode. Alert when a first party DeepSeek or other third party model product is the user facing brand but the backend request volume and tool traces match Opus. Treat unexpected appearance of another lab's customer data, government credentials, or police case content in your own model logs as a relay incident, not as organic use. This cluster has no network IOC list. Do not denylist DeepSeek, Claude, or OpenCode as product names.

## References

- [Anthropic] Detecting and countering misuse of AI: September 2026 (2026-09-10): https://www.anthropic.com/threat-intelligence-report-september-2026
