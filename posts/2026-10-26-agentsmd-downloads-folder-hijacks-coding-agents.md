# AGENTS.md File in Downloads Folder Hijacks OpenAI Codex and Claude Code via Rogue npm Package

**Date:** 2026-10-26
**Tags:** prompt-injection, malicious-tool, supply-chain

## Executive Summary

A malicious AGENTS.md instruction file placed in a user's ~/Downloads folder tricked an AI coding agent into installing the rogue npm package function-color, according to Forever Security research reported by BleepingComputer on 2026-10-25. Because coding agents auto load instruction files from their working directory and Downloads is one of the few locations a web page can silently write to, an attacker can seed the file with a drive by download and no user interaction. Forever Security reproduced the chain against OpenAI Codex with a 90 percent success rate using a harmless payload, and separately leaked a Claude Code OAuth token by redirecting its API traffic through CLAUDE.md.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AGENTS.md Downloads Folder Hijack |
| Attribution | Unattributed (confidence: none) |
| Target | Developers running AI coding agents such as OpenAI Codex and Claude Code with a working directory pointed at ~/Downloads |
| Vector | Malicious AGENTS.md or CLAUDE.md instruction file silently dropped into the ~/Downloads folder, later auto loaded by the agent as configuration and interpreted as trusted instructions |
| Status | active |
| First Observed | 2026-10-25 |

## Detailed Findings

According to BleepingComputer, researchers at Forever Security discovered the tactic on a customer's computer after a coding agent attempted to install the malicious npm package function-color. The investigation traced that install to an AGENTS.md file sitting in the customer's ~/Downloads folder, which was also serving as the agent's working directory. Agents automatically load applicable instruction files from their working directory and use the contained text to guide actions, so the file doubled as an attacker controlled instruction stream. BleepingComputer reported that Forever Security could not determine how the file landed in ~/Downloads but noted that simply visiting a malicious page can drop a payload without user interaction because the folder is designed to accept automatic downloads. Forever Security described ~/Downloads as the one folder the web can write to on its own, meaning a page can download a file named AGENTS.md silently. In reproduction tests, Forever Security used a harmless payload that opened the calculator app against Codex and recorded a 90 percent success rate. In a separate test, the team used a malicious CLAUDE.md file to redirect Claude Code API traffic to a server they controlled, exposing the agent's OAuth token and allowing the server to impersonate the model and return tool calls that executed code in roughly 50 percent of tests. The disclosed activity is a distinct technique from previously reported AI supply chain incidents and does not involve a compromised package registry account; the abuse pivots on agent trust in working directory instruction files.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution: Malicious File | T1204.002 | The agent executes instructions from an attacker placed AGENTS.md or CLAUDE.md file it loads from its working directory. |
| Compromise Software Supply Chain: Compromise Software Dependencies and Development Tools | T1195.002 | The hijacked agent is steered into installing the rogue npm package function-color into the developer environment. |

## IOCs

### Domains

_No domains, IPs, or file hashes were published. Package name comes from BleepingComputer coverage of Forever Security research. The report does not provide a specific version or registry hash._

### Full URL Paths

_No domains, IPs, or file hashes were published. Package name comes from BleepingComputer coverage of Forever Security research. The report does not provide a specific version or registry hash._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
npm:function-color
```

### Affected Platforms

```
OpenAI Codex
Claude Code
Developer endpoints with ~/Downloads as an agent working directory
```

## Detection Recommendations

Treat AGENTS.md, CLAUDE.md, and similar agent instruction files in ~/Downloads and other web writable directories as untrusted content and block agents from adopting working directories that receive browser downloads. Alert on coding agents spawning package installs of unknown npm packages, especially function-color, and on agent processes opening outbound connections to unexpected hosts after loading a local markdown file. Audit agent OAuth tokens and rotate any credential exposed during a suspected instruction file load. Monitor for markdown files named AGENTS.md or CLAUDE.md appearing in Downloads without a matching user action.

## References

- [BleepingComputer] AI coding agents hijacked using AGENTS.md file in Downloads folder (2026-10-25) — https://www.bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder/
