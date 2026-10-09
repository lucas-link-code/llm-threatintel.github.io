# Warden Stealer Harvests Claude, Codex, Grok and Cursor Agent Data

**Date:** 2026-10-09
**Tags:** malware, llmjacking

## Executive Summary

A Rust based infostealer marketed as Warden Stealer is systematically harvesting AI agent data from Claude, Codex, Grok, and Cursor, according to a GBHackers report published October 9, 2026. Warden 1.9, announced September 29, added officially advertised support for stealing tokens from AI coding agents, and the operation is described as a rapidly growing malware as a service. Defenders should inventory and rotate credentials stored by local AI tools and monitor for reads of agent configuration directories.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Warden Stealer |
| Attribution | Warden operators, linked to CallbackBeaver (confidence: low) |
| Target | Developers and organizations using AI coding assistants and agents |
| Vector | Infostealer malware distributed as a data theft platform |
| Status | active |
| First Observed | 2026-09-29 |

## Detailed Findings

According to [gbhackers.com](https://gbhackers.com/warden-stealer-malware/), Warden Stealer is among the first malware families observed systematically harvesting AI agent configuration files, local tokens, prompt histories, conversation databases, and Model Context Protocol (MCP) settings. The report states the Rust based infostealer targets data stored by AI assistants and coding agents including Claude, Codex, Grok, and Cursor, expanding the infostealer threat model beyond browser passwords, cryptocurrency wallets, and session cookies. GBHackers reported that local AI agent data can expose access and refresh tokens, API keys, MCP connection details, project names, internal source code context, and historical prompts. The report states the malware supports Windows 8 through Windows 11 and collects from Chromium and Gecko based browsers, cryptocurrency wallet extensions, password managers, messaging apps, 2FA tools, and VPN clients, and that version 1.9, announced September 29, added officially advertised support for stealing tokens from AI coding agents. GBHackers attributed CallbackBeaver to Warden based on technical overlap including Rust development, highly distinctive code morphing, a dedicated loader, and matching cryptocurrency clipper configurations.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | Harvests AI agent config files, local tokens, and MCP settings stored on disk |
| Credentials from Web Browsers | T1555.003 | Collects saved logins and data from Chromium and Gecko based browsers |

## IOCs

### Domains

_No IOCs published in the summarized GBHackers report_

### Full URL Paths

_No IOCs published in the summarized GBHackers report_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows 8
Windows 10
Windows 11
Claude
Codex
Grok
Cursor
```

## Detection Recommendations

Monitor for unexpected reads or archives of AI agent directories such as ~/.claude, ~/.codex, ~/.cursor, and MCP configuration paths. Alert on processes spawning from user temp or AppData locations that touch these paths. Shorten credential lifetime for API keys and access tokens used by local agents, and rotate tokens stored on developer endpoints where an infostealer is suspected.

## References

- [GBHackers] Warden Stealer Malware Targets Claude, Codex, Grok and Cursor to Steal AI Agent Data (2026-10-09) — https://gbhackers.com/warden-stealer-malware/
