# Symantec Reports Aoki Infostealer Now Harvests AI Coding Assistant Credentials

**Date:** 2026-10-17
**Tags:** malware, malicious-tool

## Executive Summary

Symantec's Threat Hunter Team reported that newer samples of the Aoki infostealer now collect credentials and session files from AI coding assistants, a target set earlier versions did not touch. Aoki is a collector rather than a backdoor and posts stolen data to a /gate endpoint on its command and control server. Defenders should rotate AI assistant keys and tokens and revoke browser and desktop sessions on any machine that may have run Aoki.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Aoki Infostealer |
| Attribution | Unknown (confidence: none) |
| Target | Developer machines with AI coding assistants installed |
| Vector | Infostealer delivered to an already compromised endpoint that collects configuration, token, and cookie files |
| Status | active |
| First Observed | 2026-10-15 |

## Detailed Findings

Symantec's Threat Hunter Team published its analysis of Aoki on October 15, 2026, reporting that newer samples target AI related files while earlier versions did not. According to Symantec, Aoki collects .claude.json and Claude desktop cookies as well as Codex config.toml and tokens for GitHub Copilot, Cursor, Gemini, JetBrains AI Assistant, and Kiro, plus Cursor's local state database that can cache chat context and code snippets. Symantec reported that Aoki is a collector with no command list, takes whatever data is available on the machine, and posts it to a /gate endpoint on its command and control server. The same report states the family first appeared earlier in 2026, the operators are unknown, and the team found no links to existing malware families, and that exposure follows endpoint compromise with no breach at any AI provider and no victim count published. Symantec advised rotating the API keys and tokens of every AI assistant used on a possibly affected machine, revoking its browser and desktop sessions, and checking endpoints against 17 published file hashes and three command and control addresses.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | Aoki reads AI assistant configuration and token files such as .claude.json and Codex config.toml from disk |
| Steal Web Session Cookie | T1539 | Aoki collects Claude desktop cookies and other browser session data |

## IOCs

### Domains

_Symantec published 17 file hashes and three command and control addresses, which are not reproduced here. The command and control path observed is /gate. Detection name is Infostealer.Aoki._

### Full URL Paths

_Symantec published 17 file hashes and three command and control addresses, which are not reproduced here. The command and control path observed is /gate. Detection name is Infostealer.Aoki._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude
Codex
GitHub Copilot
Cursor
Gemini
JetBrains AI Assistant
Kiro
Bitwarden
1Password
```

## Detection Recommendations

Hunt for the 17 file hashes and three command and control addresses Symantec published, and for outbound traffic to a /gate endpoint. Monitor for processes reading .claude.json, Codex config.toml, Cursor local state, and AI assistant token and cookie files. Rotate AI assistant API keys and tokens and revoke browser and desktop sessions on any affected endpoint, and rotate AWS credentials. Symantec Endpoint products detect the family as Infostealer.Aoki.

## References

- [Symantec, via The Injection] Aoki: an infostealer now takes AI coding assistant credentials (2026-10-15) — https://theinjection.dev/items/symantec-aoki-ai-coding-credentials/
