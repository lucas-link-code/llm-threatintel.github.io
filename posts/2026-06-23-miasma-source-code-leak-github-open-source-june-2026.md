# Miasma Source Code Leak: Open-Source Release of Supply Chain Worm Framework via Compromised GitHub Accounts (June 8+, 2026)

**Date:** 2026-06-23
**Tags:** supply-chain, malicious-tool

## Executive Summary

The Miasma credential-stealing attack framework was briefly made available for free on GitHub, after multiple repositories with the name "Miasma-Open-Source-Release" began appearing since June 8, 2026. According to SafeDep, the source code has been published through compromised developer accounts. The Miasma codebase appears to be larger than a supply chain worm. This represents a significant operational security failure and toolkit proliferation risk.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Miasma Source Code Leak / Open-Source Release |
| Attribution | Threat actor behind Miasma (June 1 npm compromise); attacker access to compromised developer accounts (confidence: medium) |
| Target | Development community; potential copycat attackers; organizations using compromised npm packages |
| Vector | Leaked source code via GitHub repositories created using compromised developer credentials |
| Status | active |
| First Observed | 2026-06-08 |

## Detailed Findings

The source code leak represents tactical escalation. Unlike previous incidents where worm code was published by researchers post-mortem (e.g., Shai-Hulud in May 2026), this leak appears to be an operational decision by the threat actor or their infrastructure being compromised. The leak timing (8+ days after June 1 original Miasma compromise) suggests either: (1) intentional publication to accelerate ecosystem-wide infection; (2) attacker infrastructure compromise by rival threat actor; (3) disgruntled insider or affiliate releasing code. The availability of the full Miasma codebase significantly lowers the barrier to entry for derivative supply chain attacks. Organizations affected by the June 1 Red Hat compromise or Wave 2 targeting should assume the attacking infrastructure and playbooks are now partially or fully exposed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Original Miasma attack on npm and RedHat ecosystem; follow-on source code leak |
| Credential Dumping | T1110.001 | 4.2 MB obfuscated payload executing via preinstall hook; exfiltrating cloud/CI/CD credentials |
| Malware Distribution | T1204.002 | Self-propagating npm worm using stolen credentials for further publishing |

## IOCs

### Domains

_Original Miasma attack (June 1) already documented. This finding focuses on the source code leak and Wave 2 variant published in June 9-23 window._

### Full URL Paths

_Original Miasma attack (June 1) already documented. This finding focuses on the source code leak and Wave 2 variant published in June 9-23 window._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'miasma-open-source-release', 'registry': 'github', 'note': 'Source code repositories appeared on GitHub starting June 8, 2026, using compromised developer accounts'}
{'name': '@redhat-cloud-services/* (Wave 2)', 'registry': 'npm', 'note': 'Second wave of Miasma targeting 57 packages with 647,204 monthly downloads; uses binding.gyp for execution'}
```

### Affected Platforms

```
npm registry
GitHub
CI/CD pipelines dependent on @redhat-cloud-services packages
```

## Detection Recommendations

Monitor GitHub for new repositories matching 'Miasma-Open-Source-Release' or similar patterns; audit npm packages from @redhat-cloud-services scope for binding.gyp modifications or lifecycle hooks; implement supply chain scanning that detects both preinstall and binding.gyp execution vectors; scan for the 4.2 MB obfuscated payload signature; review CI/CD logs for unusual AWS service calls and exfiltration patterns (Wave 1 used AWS Data Perimeter bypass); rotate all credentials for accounts that installed compromised packages between June 1-23, 2026.

## References

- [Phoenix Security] Supply Chain Attacks 2026: npm, PyPI, VS Code, AI Agents — 0 CVEs (2026-06-09) — https://phoenix.security/accelerating-supply-chain-attacks-npm-pypi-vsx-ai-enabled-2026/
- [The Hacker News] ThreatsDay Bulletin: Worm Code Leaked, AI Agent Phished, Claude Code Patch + 28 New Stories (2026-06-12) — https://thehackernews.com/2026/06/threatsday-bulletin-worm-code-leaked-ai.html
- [Unit42 Palo Alto Networks] The npm Threat Landscape: Attack Surface and Mitigations (Updated June 2) (2026-06-02) — https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/
