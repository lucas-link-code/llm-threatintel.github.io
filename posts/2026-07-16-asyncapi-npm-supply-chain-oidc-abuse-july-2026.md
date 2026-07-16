# AsyncAPI npm Supply Chain Compromise via GitHub Actions OIDC Abuse — Five Malicious Packages Published (July 14, 2026)

**Date:** 2026-07-16
**Tags:** supply-chain

## Executive Summary

Upwind identified a critical supply chain compromise across five npm packages in the @asyncapi scope, published on July 14, 2026 via two separate branch compromises in two GitHub repositories. The attacker never touched an npm token; they abused each project's own CI pipeline through GitHub Actions OIDC to publish the malicious packages.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AsyncAPI GitHub Actions OIDC Abuse |
| Attribution | Unknown (confidence: none) |
| Target | @asyncapi npm packages; developers using AsyncAPI framework in CI/CD pipelines |
| Vector | GitHub Actions OIDC federated identity abuse to bypass npm token authentication |
| Status | active |
| First Observed | 2026-07-14 |

## Detailed Findings

The attack targeted multiple npm packages commonly used across developer tooling, frontend frameworks, CI/CD pipelines, and cloud-native application environments, with malicious payloads designed specifically to target CI/CD systems, cloud identities, GitHub credentials, npm publishing workflows, developer machines, and AI developer tooling. This represents a novel abuse vector: Rather than compromising npm tokens directly, the attacker abused each project's own CI pipeline through GitHub Actions OIDC to publish malicious packages. The attack demonstrates a sophisticated understanding of GitHub's federated identity trust model and represents a shift from direct credential theft to identity-based package publication.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Malicious code injected into npm packages via compromised CI/CD pipeline |
| Abuse of Functionality | T1648 | GitHub Actions OIDC tokens abused for unauthorized package publication |
| Lateral Movement | T1570 | Payload designed to target downstream CI/CD systems and cloud environments |

## IOCs

### Domains

_Upwind Security disclosure; specific package names and versions not fully detailed in public reporting_

### Full URL Paths

_Upwind Security disclosure; specific package names and versions not fully detailed in public reporting_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': '@asyncapi/*', 'registry': 'npm', 'note': 'Five packages in @asyncapi scope compromised; exact package names not disclosed in source'}
```

### Affected Platforms

```
npm
GitHub Actions
CI/CD pipelines
```

## Detection Recommendations

Monitor GitHub Actions OIDC token usage and validate that npm publish operations originate only from expected, authorized CI/CD workflows. Implement branch protection rules requiring code review for CI/CD configuration changes. Audit npm audit logs for unexpected package versions from known maintainers. Use npm provenance verification to validate that published packages match expected build artifacts. For organizations using @asyncapi packages, inspect CI build logs for unauthorized npm publish commands executed between July 13-15, 2026.

## References

- [Upwind Security] The New Face of Supply Chain Attacks: npm Malware Built for CI/CD and Cloud Compromise (2026-07-14) — https://www.upwind.io/feed/large-scale-npm-pypi-supply-chain-campaign-suspected-across-multiple-popular-packages
