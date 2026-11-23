# OX Security Finds Agent Skills and MCP Servers Weaponized for Instruction Based Supply Chain Attacks

**Date:** 2026-11-23
**Tags:** supply-chain, mcp-security, prompt-injection

## Executive Summary

OX Security analyzed 542,207 open source components across npm, PyPI, MCP servers and Agent Skills between July and October 2026 and found that attackers can now hijack agents through malicious instructions rather than executable code. Prompt injection and tool poisoning appeared in 22 percent of flagged MCP servers, and 44 percent of flagged Agent Skills contained instructions directing agents to send data out without executing code at install time. Defenders should treat MCP server and Skill trust signals as broken and verify component provenance and runtime behavior before agents connect.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Agent Instruction Supply Chain Abuse |
| Attribution | Unattributed (confidence: none) |
| Target | Organizations deploying AI agents that connect to MCP servers and Agent Skills |
| Vector | Malicious instructions in MCP servers and Agent Skills that manipulate agents into abusing existing permissions |
| Status | active |
| First Observed | 2026-07 |

## Detailed Findings

According to OX Security, the research team analyzed 542,207 open source components between July and October 2026 using its OX.Radar early warning system and tracked four ecosystems: npm, PyPI, MCP servers and Agent Skills. OX Security reported that prompt injection and tool poisoning appeared in 22 percent of flagged MCP servers while install or import time execution appeared in 16 percent, and that in flagged npm packages execution techniques were six times more common than prompt injection and tool poisoning. OX Security stated that none of the 179 flagged Agent Skills executed code at install time, yet 44 percent contained instructions directing agents to send data out, illustrating a shift from code that runs to instructions that agents follow. OX Security identified a source owner for only 69.8 percent of MCP servers compared with 92.8 percent of npm packages, leaving nearly one in three MCP servers without a traceable owner. Of 834 flagged MCP servers, 67 percent ran on publisher controlled infrastructure where researchers could not independently verify the deployed code and another 16 percent served files that differed from what publishers declared, so more than 80 percent presented a code verification problem. OX Security also found that 82 percent of researcher confirmed malicious components were malicious in their first observed version, so monitoring updates alone would miss them, and that two publisher accounts were responsible for 44 percent of flagged MCP servers with one account publishing 2,364 servers in 17 days. OX Security research lead Moshe Siman Tov Bustan said the agent already has the permissions it needs and attackers just have to convince it to use them.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Malicious MCP servers and Agent Skills distributed through public ecosystems that agents load and act upon |
| Phishing: Spearphishing via Service | T1566.003 | Tool poisoning and prompt injection instructions embedded in agent tooling that direct the agent to exfiltrate data |

## IOCs

### Domains

_No specific package, domain, or file IOCs published in the OX Security report; the report conveys aggregate findings only._

### Full URL Paths

_No specific package, domain, or file IOCs published in the OX Security report; the report conveys aggregate findings only._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
MCP servers
Agent Skills
npm
PyPI
```

## Detection Recommendations

Inventory every MCP server and Agent Skill your agents load and map each to a verifiable source owner; flag components with no traceable owner. Where a server runs on publisher controlled infrastructure, pull and diff the served content against the publisher declared code before allowing agent access. Treat Skill and MCP instruction text as an attack surface and review it for outbound data directives, since install time code scanning will not catch instruction only abuse. Monitor agent actions against the permissions those agents already hold instead of relying solely on payload detection.

## References

- [OX Security] Plug and Pray: Your AI Agents Are Taking Orders From Strangers (2026-11-23) — https://www.ox.security/blog/plug-and-pray-your-ai-agents-are-taking-orders-from-strangers/
