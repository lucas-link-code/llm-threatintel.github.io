# Microsoft Threat Intelligence Analyzes Cursor Marketplace Claude Code Extension That Installs a Persistent SSH Backdoor

**Date:** 2026-10-31
**Tags:** supply-chain, malware

## Executive Summary

Microsoft Threat Intelligence published a first party analysis of the tampered anthropic.claude-code extension (versions 2.1.312 and 2.1.313) that was served through the Cursor extension marketplace for roughly eleven hours on 2026-10-29. The injected loader adds an attacker controlled SSH key, enables local SSH, opens reverse SSH forwarding, writes persistence, and posts host details, with success depending on host privilege and SSH configuration. Defenders should inventory any host that installed or auto updated the extension from the Cursor marketplace, preserve evidence, remove artifacts, and rotate credentials where exposure is indicated.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Cursor marketplace Claude Code extension SSH backdoor |
| Attribution | Unattributed (confidence: none) |
| Target | Cursor users who installed or auto updated the anthropic.claude-code extension on Windows and macOS |
| Vector | Malicious tampered extension package published to the Cursor extension marketplace for a few hours |
| Status | disrupted |
| First Observed | 2026-10-29 |

## Detailed Findings

According to the Microsoft Security Blog, Cursor reported on 2026-10-29 that a tampered copy of the Claude Code extension (anthropic.claude-code, versions 2.1.313 and 2.1.312) was served through the Cursor extension marketplace for a few hours as a supply chain attempt against Cursor users, live from about 2:27 AM to 1:35 PM Pacific Daylight Time. Microsoft Threat Intelligence analyzed the injected JavaScript embedded in the malicious package. According to Microsoft, the injected loader runs when the extension module loads and attempts to add an attacker controlled Secure Shell key, enable the local SSH service, establish reverse SSH forwarding, configure persistence, and report host details. Microsoft noted that successful remote access depends on host privileges, SSH configuration, and the attacker server configuration, but the loader may still write keys and persistence artifacts even when tunnel access fails. Microsoft confirmed the malicious packages were never published or distributed from the Microsoft Visual Studio Marketplace or from the npm @anthropic-ai/claude-code package, neither of which was affected. Microsoft stated that Anthropic confirmed its systems were not compromised and that Anthropic did not develop the malicious package; at this time all evidence suggests the incident is limited to the Cursor marketplace. Microsoft recommended identifying systems that installed or automatically updated to the affected version from the Cursor marketplace, preserving evidence, removing confirmed malicious artifacts, reviewing endpoint and network telemetry, and rotating credentials or revoking sessions where investigation indicates exposure. In parallel, Cursor reported that host and user information collected included hostname, username, OS, architecture, home directory path, environment variable names, working directories, configured Git email, and public IP, and that the attacker server no longer functions after being taken offline with its hosting provider.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | A tampered build of a legitimate extension was published to the Cursor marketplace and delivered to users through normal install and auto update |
| Account Manipulation: SSH Authorized Keys | T1098.004 | The injected loader attempted to write an attacker controlled SSH key into authorized_keys to establish persistent remote access |

## IOCs

### Domains

_No attacker domains, IPs, or hashes were published by Microsoft or Cursor; the attacker server was taken offline. Values above are the tampered extension identifiers named in the sources._

### Full URL Paths

_No attacker domains, IPs, or hashes were published by Microsoft or Cursor; the attacker server was taken offline. Values above are the tampered extension identifiers named in the sources._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
macOS
```

## Detection Recommendations

Inventory Cursor instances and extension caches for anthropic.claude-code version 2.1.312 or 2.1.313 obtained from the Cursor marketplace and check install timestamps against the 2026-10-29 2:27 AM to 1:35 PM PDT exposure window. Hunt for unexpected entries added to authorized_keys, newly enabled local SSH services, reverse SSH forwarding processes, and persistence created as a macOS LaunchAgent or a Windows scheduled task attempting to run as SYSTEM with a startup script fallback. Review endpoint and network telemetry for repeated outbound tunnel retries roughly every 60 seconds and for POST requests carrying host and user metadata. Because successful tunnel access depends on privileges and SSH configuration, treat any affected host as potentially exposed, preserve evidence before removal, remove confirmed malicious artifacts, and rotate credentials or revoke sessions where investigation indicates exposure. Note that the attacker server is no longer functional, so blocking the original tunnel endpoint has limited value; focus on host side artifacts and key rotation.

## References

- [Microsoft Security Blog] Inside a malicious Claude Code-branded extension and its persistent SSH backdoor (2026-10-30) — https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/
- [Cursor] Security notice - malicious version of Anthropic.claude-code (2.1.312 and 2.1.313) identified in the Cursor VS Code Extension Marketplace (2026-10-29) — https://cursor.com/blog/claude-code-extension-security-notice
