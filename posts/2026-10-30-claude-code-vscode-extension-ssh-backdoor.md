# Official Claude Code for VS Code Extension Compromised to Install Persistent SSH Backdoor

**Date:** 2026-10-30
**Tags:** supply-chain, malware, shadow-ai

## Executive Summary

The official Claude Code for VS Code extension (anthropic.claude-code) was compromised and shipped a malicious loader that adds an attacker SSH key, installs persistence, and beacons host data to an external server. Cursor says at most 5,000 users installed the malicious version 2.1.313 between about 2:27 a.m. and 1:35 p.m. PT on October 29, 2026. Defenders whose developers used the extension should isolate affected hosts, remove the unauthorized key, delete persistence, and rotate credentials and sessions.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Claude Code VS Code Extension Supply Chain Compromise |
| Attribution | Unattributed (confidence: low) |
| Target | Developers who installed the Claude Code for VS Code extension from Open VSX or the Microsoft VS Code Marketplace |
| Vector | Compromised official VS Code extension update delivering a malicious JavaScript loader |
| Status | disrupted |
| First Observed | 2026-10-29 |

## Detailed Findings

According to The Hacker News, the official Claude Code for VS Code extension (anthropic.claude-code) was compromised to install a persistent SSH backdoor on infected hosts. OpenSourceMalware reported that the package identified itself as version 2.1.313 but its main JavaScript bundle contained a malicious 66 line loader inserted ahead of the legitimate extension code. The Hacker News reported that as of October 30, 2026 the malicious version had been removed and Anthropic published version 2.1.314, and that it is not known how the compromise happened. Per The Hacker News, the extension activates after VS Code startup and when its webview opens, then adds an attacker controlled key labeled svc-telemetry to ~/.ssh/authorized_keys. It then attempts to make the victim reachable over SSH across Windows, Linux, and macOS, establishes a reverse tunnel to 134.209.82[.]225, installs platform specific persistence as a scheduled task, crontab, and LaunchAgent, and sends host reconnaissance to 134.209.82[.]225:8099/beacon over unencrypted HTTP. Cursor published its own analysis stating that turning on the local SSH service requires admin rights that the extension does not have on most macOS and Windows hosts, so the SSH step fails there while the key, persistence, and host details are still installed and sent. The data collected, per The Hacker News, includes the public IP from api.ipify[.]org, hostname and local username, operating system and CPU architecture, home and current working directory, the global Git email from git config --global user.email, and names of up to 40 environment variables containing KEY, TOKEN, SECRET, PASS, AWS, or GCP. Security researcher Paul McCarty noted that environment variable values are not placed directly in the initial beacon but their names can still reveal configured cloud providers, CI systems, and credential types. No follow on payloads have been observed. Cursor stated the incident affected at most 5,000 users and that it will contact them directly.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious loader inserted into the legitimate Claude Code VS Code extension bundle |
| Account Manipulation: SSH Authorized Keys | T1098.004 | Loader adds an attacker controlled key labeled svc-telemetry to ~/.ssh/authorized_keys |

## IOCs

### Domains

_IOCs from The Hacker News reporting OpenSourceMalware and Cursor analysis. C2 IP 134.209.82[.]225 with beacon path /beacon on port 8099. Persistence artifacts: scheduled task, crontab, LaunchAgent. SSH key label svc-telemetry._

### Full URL Paths

_IOCs from The Hacker News reporting OpenSourceMalware and Cursor analysis. C2 IP 134.209.82[.]225 with beacon path /beacon on port 8099. Persistence artifacts: scheduled task, crontab, LaunchAgent. SSH key label svc-telemetry._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
VS Code
Open VSX
Microsoft VS Code Marketplace
Windows
Linux
macOS
```

## Detection Recommendations

Check extension versions: flag hosts that installed anthropic.claude-code 2.1.313 between 2:27 a.m. and 1:35 p.m. PT on October 29, 2026 and confirm upgrade to 2.1.314. Hunt for the key labeled svc-telemetry in ~/.ssh/authorized_keys and remove it, and remove any added scheduled task, crontab, or LaunchAgent persistence. Look for outbound HTTP connections to 134.209.82[.]225:8099 and path /beacon, and for reverse SSH tunnels to that host. Rotate credentials and sessions on any affected host, and treat environment variable names and Git email as exposed metadata. Isolate affected hosts before investigation.

## References

- [The Hacker News] Official Claude Code VS Code Extension Compromised to Install Persistent SSH Backdoor (2026-10-30) — https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html
