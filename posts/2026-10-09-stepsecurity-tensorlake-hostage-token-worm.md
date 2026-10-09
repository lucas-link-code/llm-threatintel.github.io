# StepSecurity Details Destructive Hostage Token in Tensorlake 0.5.144 Worm

**Date:** 2026-10-09
**Tags:** supply-chain, malware

## Executive Summary

StepSecurity published new technical analysis on October 8, 2026 showing the compromised tensorlake npm package version 0.5.144 installs a background service named gh-token-monitor that checks a stolen GitHub token every 60 seconds for up to 24 hours and runs rm -rf ~/ (or a PowerShell delete of the user profile on Windows) if GitHub rejects the token. This means revoking the stolen token is what triggers destructive action, so defenders must isolate the host before revoking. The package also self propagates by republishing stolen npm packages and by committing to victim GitHub repositories.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ChainDrop Shai-Hulud tensorlake worm |
| Attribution | Unknown, Shai-Hulud linked supply chain operator (confidence: medium) |
| Target | Developers and CI systems installing the tensorlake npm SDK |
| Vector | Malicious npm release with a preinstall hook |
| Status | active |
| First Observed | 2026-10-08 |

## Detailed Findings

According to [stepsecurity.io](https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm), the malicious commit landed on main at 01:20 UTC on October 7, 2026 under a maintainer identity, followed by seven more commits over the next hours that tweaked the payload and added a preinstall line to package.json, with none going through a pull request. The repo release workflow published 0.5.144 to npm at 01:12 UTC on October 8, and the npm package files match main. StepSecurity reported that the payload targets GitHub and npm tokens, cloud keys, Kubernetes and Vault secrets, SSH keys, saved browser logins, and config files for AI tools including Claude, Cursor, and Windsurf, encrypts the data, and sends it to a public GitHub repo it creates in the victim account with the description 'Shai-Hulud: Here We Go Again' or to iseekaigogo.com. The report states that with a stolen npm token it downloads the victim's packages, adds itself, bumps the version, and republishes, and with a stolen GitHub token it commits .claude and .vscode files to victim repos using a fake claude@users.noreply.github.com author and the message 'chore: update dependencies'. StepSecurity further reported that when the malware has a GitHub token it installs a service named gh-token-monitor that checks the token against the GitHub API every 60 seconds for up to 24 hours and, if GitHub rejects it, runs rm -rf ~/ or a PowerShell delete of the user profile on Windows. StepSecurity's AI Package Analyst detected the release and reported it to maintainers in GitHub issue #1014. Socket separately reported the same release as a ChainDrop Shai-Hulud event.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious npm release and republishing of stolen packages spreads the worm |
| Data Destruction | T1485 | gh-token-monitor runs rm -rf ~/ or deletes the user profile when the stolen token is revoked |

## IOCs

### Domains

```
iseekaigogo.com
```

### Full URL Paths

_IOCs condensed from the StepSecurity writeup; malicious files in the package are lib/setup.mjs (obfuscated preinstall loader) and lib/Math_Symbol.js (worm payload) per Socket's writeup_

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
Node.js
Windows
Linux
macOS
```

## Detection Recommendations

If tensorlake 0.5.144 was installed, do not simply revoke the stolen GitHub token first: isolate the host from the network and kill any gh-token-monitor scheduled task, launch agent, or service before revoking, then uninstall the package version. Hunt for the exfil domain iseekaigogo.com, for GitHub repos described as 'Shai-Hulud: Here We Go Again' in victim accounts, for commits authored as claude@users.noreply.github.com with the message 'chore: update dependencies', and for reads of .claude and .vscode directories. Rotate npm, GitHub, cloud, Kubernetes, Vault, and SSH credentials from a clean host.

## References

- [StepSecurity] Tensorlake npm Package Compromised: A Worm With a Hostage Token That Wipes Your Machine If You Revoke It (2026-10-08) — https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm
- [Socket] TensorLake npm SDK Compromised in ChainDrop Shai-Hulud Credential-Stealing Attack (2026-10-08) — https://www.socket.dev/blog/tensorlake-compromise
