# Fake Payment SDK Supply Chain Attack — 17 Malicious npm/PyPI Packages Targeting Payment Developers (July 7, 2026)

**Date:** 2026-07-16
**Tags:** supply-chain

## Executive Summary

On July 7, 2026, automated security scanners detected a cluster of 17 malicious packages published nearly simultaneously across the npm and PyPI registries. These packages were designed to mimic legitimate software development kits (SDKs) for major payment platforms, specifically PaySafe, Skrill, and Neteller, leveraging typosquatting and deceptive naming conventions to trick developers into integrating malicious code.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Fake Payment SDK Typosquatting Campaign |
| Attribution | Unknown (confidence: none) |
| Target | Payment platform developers; financial software engineers; development environments integrating payment processing |
| Vector | Typosquatted npm and PyPI packages impersonating legitimate payment SDKs |
| Status | active |
| First Observed | 2026-07-07 |

## Detailed Findings

On July 7, 2026, automated security scanners detected a cluster of 17 malicious packages published nearly simultaneously across the npm and PyPI registries. Once installed, the malware's primary goal is to steal credentials and tokens, silently harvesting sensitive information from developer machines and continuous integration (CI) runners, ultimately exfiltrating it to external infrastructure. The campaign represents a targeted attack against a high-value vertical: payment processing developers, where compromised credentials provide access to payment gateway accounts, transaction data, and financial APIs. The use of simultaneous publishing suggests automated tooling or coordinated team deployment.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Malicious packages in npm and PyPI package registries |
| Credential Dumping | T1110.004 | Harvesting and exfiltration of developer credentials and payment API tokens |
| Execution | T1204.001 | Code execution via npm install / pip install during dependency resolution |

## IOCs

### Domains

_17 malicious packages total; specific package names and versions not disclosed in Cyberpress source; Skrill, PaySafe, Neteller SDKs were impersonated_

### Full URL Paths

_17 malicious packages total; specific package names and versions not disclosed in Cyberpress source; Skrill, PaySafe, Neteller SDKs were impersonated_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
npm
PyPI
```

## Detection Recommendations

For payment software developers: audit all recently installed dependencies from npm and PyPI, particularly those matching payment platform names (PaySafe, Skrill, Neteller). Compare installed package names against official package registry links from legitimate payment vendors. Implement package integrity verification using npm/PyPI provenance checksums. Monitor for unexpected network connections from development machines to unfamiliar exfiltration endpoints. For package registry maintainers: implement enhanced typosquatting detection algorithms comparing package names against established brands using edit-distance and levenshtein metrics.

## References

- [Cyberpress] Malicious npm and PyPI Packages Target Payment Developers With Fake SDK Facades (2026-07-07) — https://cyberpress.org/fake-sdks-target-developers/
