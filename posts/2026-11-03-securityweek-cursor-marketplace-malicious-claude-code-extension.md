# SecurityWeek Reports Cursor Marketplace Served Malicious Claude Code Extension Versions 2.1.312 and 2.1.313

**Date:** 2026-11-03
**Tags:** supply-chain, malware

## Executive Summary

SecurityWeek reported that malicious versions 2.1.312 and 2.1.313 of the anthropic.claude-code extension were published to the Cursor VS Code Extension Marketplace on 29 October 2026 and stayed available for about 11 hours, potentially reaching roughly 5,000 developer systems. The extension ran JavaScript at module load to gather host reconnaissance and then attempted an SSH key install, reverse tunnel and persistence, though Cursor says the SSH step failed on most systems because it requires admin rights. Cursor users should remove the affected versions, run the Cursor detection script, and rotate credentials from any host that loaded the extension.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Cursor marketplace Claude Code extension compromise |
| Attribution | Unattributed actor with access to Cursor marketplace publishing (confidence: low) |
| Target | Cursor developers on macOS and Windows |
| Vector | Tampered extension versions published to the Cursor VS Code Extension Marketplace |
| Status | removed |
| First Observed | 2026-10-29 |

## Detailed Findings

SecurityWeek reported on 2 November 2026 that Cursor users were targeted with malicious versions of Anthropic Claude Code extension in a supply chain attack that occurred on 29 October 2026, involving versions 2.1.312 and 2.1.313 of the anthropic.claude-code extension, which were live in the Cursor VS Code Extension Marketplace for roughly 11 hours. The report states the extension targeted both macOS and Windows users and contained JavaScript code designed to run when modules were loaded to establish a reverse SSH tunnel, and that researcher Kevin Beaumont notes roughly 5,000 developer systems might have downloaded the malicious versions. According to SecurityWeek, the modified versions were not developed by Anthropic and were not pushed to the Microsoft Visual Studio Marketplace, Open VSX, or the NPM registry. Anthropic Felix Rieseberg said a malicious actor used access to Cursor marketplace to publish a tampered copy of the Claude Code extension, that the versions on official channels are not affected, and that only Cursor users are impacted; Anthropic updated its legitimate extension directly to version 2.1.314. The report states Cursor removed the modified extension immediately, suspended the marketplace to investigate, found no other malicious extensions, rotated all keys, rebuilt and reopened the marketplace, and worked with the cloud provider hosting the attacker server to take it offline. The modified versions contained a JavaScript function executed during module loading to collect host information, modify files, and run OS commands; Microsoft notes the loader first collects host reconnaissance, then attempts to install an SSH key, enable SSH, create a reverse tunnel, and configure persistence, with a delayed callback that attempts to send host details. The code was observed collecting hostname, username, OS, system architecture, working directory, and global Git email, and deploying platform specific scripts and startup configurations for persistence. According to Cursor, because enabling the local SSH service requires admin rights and the extension does not have them on most macOS and Windows systems, the step failed, preventing the attackers from logging in through the tunnel.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Tampered extension versions were published through the Cursor marketplace |
| Remote Services: SSH | T1021.004 | Loader attempted to install an SSH key, enable SSH, and create a reverse tunnel |

## IOCs

### Domains

_No IOCs published. Malicious extension versions 2.1.312 and 2.1.313 documented in affected_platforms; these are not a covered package registry format._

### Full URL Paths

_No IOCs published. Malicious extension versions 2.1.312 and 2.1.313 documented in affected_platforms; these are not a covered package registry format._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cursor VS Code Extension Marketplace
macOS
Windows
```

## Detection Recommendations

Verify the installed anthropic.claude-code extension version in Cursor and remove 2.1.312 and 2.1.313 immediately. Run the Cursor published detection script and review its indicators of compromise. Look for unexpected authorized_keys entries, enabled SSH services, reverse SSH tunnels, and persistence items such as launch agents or startup scripts on macOS and Windows developer hosts, and rotate credentials and keys from any host that loaded the affected versions.

## References

- [SecurityWeek] Malicious Claude Code Extension Served in Cursor Supply Chain Attack (2026-11-02) — https://www.securityweek.com/malicious-claude-code-extension-served-in-cursor-supply-chain-attack/
