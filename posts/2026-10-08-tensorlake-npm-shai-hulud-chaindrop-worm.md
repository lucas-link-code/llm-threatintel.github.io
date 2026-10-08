# Tensorlake npm SDK 0.5.144 Compromised in ChainDrop Shai-Hulud Credential Stealing Worm

**Date:** 2026-10-08
**Tags:** supply-chain, malware

## Executive Summary

The npm SDK tensorlake version 0.5.144 shipped credential stealing malware on October 8, 2026 at 01:12:07 UTC, and Socket flagged it about 11 minutes later. Any developer who installed it on a non CI machine should treat GitHub, npm, cloud, Kubernetes, Vault, SSH, and browser credentials as stolen, and should not simply revoke the stolen GitHub token because the malware runs rm -rf ~/ when the token stops working. Rotate credentials only after removing the gh-token-monitor persistence service and the .claude and .vscode files the worm writes into repositories.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Shai-Hulud: Here We Go Again (ChainDrop) |
| Attribution | Unattributed; tracked as a Shai-Hulud style self propagating worm (confidence: low) |
| Target | Developers and CI environments installing the tensorlake npm SDK |
| Vector | Malicious npm release with a preinstall hook that runs an obfuscated loader via Bun |
| Status | active |
| First Observed | 2026-10-07 |

## Detailed Findings

According to [socket.dev](https://socket.dev/blog/tensorlake-compromise), the npm SDK for Tensorlake, version 0.5.144, contained obfuscated malware published on October 8, 2026 at 01:12:07 UTC and flagged by Socket at 01:23:10 UTC, roughly 11 minutes later. The package receives about 12K weekly downloads. Socket reported the payload in package/lib/Math_Symbol.js, a credential stealing and self propagating worm, launched by an obfuscated loader in package/lib/setup.mjs through the preinstall hook using Bun. [stepsecurity.io](https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm) reported the first malicious commit landed on main at 01:20 UTC on October 7 under a maintainer identity, seven more commits followed over the next hours, and none went through a pull request before the release workflow published 0.5.144. StepSecurity stated the loader skips CI so developer machines are the target, and it decoded an 856 KB obfuscated payload without running it. Both sources report credential harvesting across local files, CI environments, Kubernetes and Vault sources, plus GitHub and npm tokens, cloud keys, SSH keys, saved browser logins, and config files for AI tools such as Claude, Cursor and Windsurf. Data is encrypted and exfiltrated to a public GitHub repo the malware creates in the victim account or to iseekaigogo.com. StepSecurity reported the malware installs a gh-token-monitor service that checks the stolen GitHub token every 60 seconds for up to 24 hours and runs rm -rf ~/ or a PowerShell profile delete if GitHub rejects it. The worm also writes .claude/settings.json and .vscode/tasks.json into reachable repos using a fake claude@users.noreply.github.com author and the message chore: update dependencies, so it runs again when a project is opened in Claude Code or VS Code. StepSecurity reported the release to the maintainers in GitHub issue #1014.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Software Supply Chain | T1195.002 | Malicious version published to npm through the package release workflow |
| Unsecured Credentials: Credentials In Files | T1552.001 | Harvesting of tokens, cloud keys, Kubernetes, Vault, SSH, browser and AI tool configs |

## IOCs

### Domains

```
iseekaigogo.com
```

### Full URL Paths

_No hashes or IPs published in the cited sources. Package identifier from Socket and StepSecurity._

### Splunk Format

```
"iseekaigogo.com"
```

### Package Indicators

```
npm:tensorlake@0.5.144
```

### Affected Platforms

```
npm
Bun
GitHub Actions
Claude Code
Visual Studio Code
```

## Detection Recommendations

Hunt for the preinstall execution of package/lib/setup.mjs and for downloaded Bun runtimes on developer endpoints. Search repositories and developer home paths for .claude/settings.json and .vscode/tasks.json with the fake claude@users.noreply.github.com author and the message chore: update dependencies. Look for the gh-token-monitor service or scheduled task and for connections to iseekaigogo.com. Before revoking any stolen GitHub token, remove the monitor persistence first, since revocation triggers home directory deletion. Rotate npm, cloud, Kubernetes, Vault, SSH, and browser credentials from a clean host.

## References

- [Socket] TensorLake npm SDK Compromised in ChainDrop Shai-Hulud Credential-Stealing Attack (2026-10-08) — https://socket.dev/blog/tensorlake-compromise
- [StepSecurity] Tensorlake npm Package Compromised: A Worm With a Hostage Token That Wipes Your Machine If You Revoke It (2026-10-08) — https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm
