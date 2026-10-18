# SneakPeek Zero Click Flaw in Claude Code Desktop Exfiltrates Developer Credentials

**Date:** 2026-10-18
**Tags:** malicious-tool

## Executive Summary

Noma Security found a zero click data theft flaw, dubbed SneakPeek, in Anthropic's Claude Code Desktop preview pane that silently steals SSH private keys, AWS credentials and Claude OAuth tokens from developer machines. Three chained architectural gaps let malicious HTML padded past 256KB load as file:// URLs, skip the content security policy and run embedded JavaScript with no user interaction. Anthropic fixed the issue in version 1.30096.1 after its first patch was bypassed.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | SneakPeek |
| Attribution | Unknown (confidence: none) |
| Target | Developers using Anthropic Claude Code Desktop |
| Vector | Malicious HTML file over 256KB rendered automatically in the desktop preview pane |
| Status | disrupted |
| First Observed | 2026-07-04 |

## Detailed Findings

According to [darkreading.com](https://www.darkreading.com/threat-intelligence/new-anthropic-sneakpeek-silent-zero-click-threat), a high severity bug named SneakPeek in the Claude Code Desktop preview pane let an adversary steal sensitive files from developer machines with no prompt, no click and no sandbox defense. Noma Security researchers said three architectural flaws chained together bypassed built in sandbox protections: a missing content security policy, unrestricted origin access and inactive request filtering. Eli Ainhorn, senior AI vulnerability researcher at Noma, wrote that an attacker could deploy a standard looking public code repository containing an HTML file padded past 256KB with an embedded malicious script, and that when a developer asked Claude Code to review or edit the file the preview pane rendered it automatically and triggered silent background exfiltration of credentials. The script could steal AWS and GitHub credentials, API keys and Claude's own OAuth tokens. According to [theinjection.dev](https://theinjection.dev/week/2026-w42/), HTML files over 256KB loaded as file:// URLs, skipping the content security policy, so embedded JavaScript read SSH and cloud keys; Anthropic fixed this in version 1.30096.1. Dark Reading reported that Noma first reported the flaw to Anthropic on July 4, Anthropic pushed a first fix on July 9, Noma found a bypass on a July 24 re-test, and a final patch was deployed on August 17 ahead of the October advisory.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | Embedded JavaScript read SSH private keys, AWS credentials, API keys and Claude OAuth tokens from files on the developer host. |

## IOCs

### Domains

_No IOCs published. Affected product is Claude Code Desktop, fixed in version 1.30096.1._

### Full URL Paths

_No IOCs published. Affected product is Claude Code Desktop, fixed in version 1.30096.1._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Anthropic Claude Code Desktop (fixed in 1.30096.1)
```

## Detection Recommendations

Update Claude Code Desktop to version 1.30096.1 or later. Treat HTML files larger than 256KB from untrusted repositories as dangerous and avoid opening untrusted HTML in any AI assistant preview pane. Monitor for unexpected outbound connections from developer workstations and alert on JavaScript execution from file:// origins. Rotate SSH keys, cloud credentials and Claude OAuth tokens on any host that ran a vulnerable version.

## References

- [Dark Reading] Anthropic 'SneakPeek' Flaw Is a Silent Zero-Click Threat (2026-10-14) — https://www.darkreading.com/threat-intelligence/new-anthropic-sneakpeek-silent-zero-click-threat
- [The Injection] AI security news, week 42 of 2026 (2026-10-18) — https://theinjection.dev/week/2026-w42/
