# Trojaned AsyncAPI npm Packages via GitHub Actions OIDC Token Theft and MCP Reconnaissance Evolution

**Date:** 2026-07-20
**Tags:** supply-chain

## Executive Summary

Upwind identified a critical supply chain compromise across five npm packages in the @asyncapi scope, published on July 14, 2026 via two separate branch compromises in two GitHub repositories. The attacker never touched an npm token. They abused each project's own CI pipeline through GitHub Actions OIDC to publish the malicious packages. By late January 2026, 60% of LLMjacking attack traffic had shifted from compute theft toward MCP (Model Context Protocol) reconnaissance, probing file systems, databases, shell access, API integrations, and Kubernetes clusters. LLMjacking is increasingly a staging ground for deeper compromise, not just a billing attack.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AsyncAPI GitHub Actions OIDC Supply Chain Attack |
| Attribution | Unknown; matches TeamPCP operational patterns from earlier campaigns (confidence: medium) |
| Target | AsyncAPI npm packages (@asyncapi scope), npm registry, developer CI/CD pipelines |
| Vector | GitHub Actions OIDC misconfiguration in pull_request_target workflows |
| Status | disrupted |
| First Observed | 2026-07-14 |

## Detailed Findings

An attacker exploited a misconfigured pull_request_target GitHub Actions workflow in the AsyncAPI org to steal a privileged token, opened dozens of decoy pull requests to bury the malicious one, and on July 14 published five trojanized versions across four @asyncapi npm packages (generator, generator-helpers, generator-components, specs) that together see millions of weekly downloads. The payload is a credential-stealing remote access trojan that fires on import rather than install, hides behind whitespace in a validator file, and keeps four command-and-control channels open, including Nostr and Ethereum smart contracts.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Trusted Relationship | T1199 | Abuse of GitHub Actions OIDC as trusted CI/CD identity |
| Supply Chain Compromise | T1195.001 | Trojanized npm packages with multi-channel C2 |
| Credential Access | T1110 | Credential-stealing RAT payload on import |

## IOCs

### Domains

_Credential-stealing RAT with four C2 channels including Nostr and Ethereum smart contracts. Published by SafeDep; full teardown by Chainguard._

### Full URL Paths

_Credential-stealing RAT with four C2 channels including Nostr and Ethereum smart contracts. Published by SafeDep; full teardown by Chainguard._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': '@asyncapi/generator', 'registry': 'npm', 'version': 'trojanized versions published July 14 2026', 'note': 'Payload fires on import; hide behind whitespace'}
{'name': '@asyncapi/generator-helpers', 'registry': 'npm', 'version': 'trojanized versions published July 14 2026', 'note': ''}
{'name': '@asyncapi/generator-components', 'registry': 'npm', 'version': 'trojanized versions published July 14 2026', 'note': ''}
{'name': '@asyncapi/specs', 'registry': 'npm', 'version': 'trojanized versions published July 14 2026', 'note': ''}
```

### Affected Platforms

```
npm registry
GitHub Actions CI/CD
Developer machines running AsyncAPI packages
```

## Detection Recommendations

Audit all AsyncAPI package versions; pin to last clean versions prior to July 14. Rotate npm, GitHub, SSH, and cloud credentials immediately. Review GitHub Actions CI/CD logs from compromised AsyncAPI repositories for suspicious token usage and publish events. Implement Dependabot delays (3+ days) and require approve-before-publish for public package updates. Monitor for execution of AsyncAPI generator packages; watch for unusual child process spawning or network outbound connections to Nostr/Ethereum endpoints. Scan npm dependency trees for presence of trojanized versions using tools like SafeDep or Snyk.

## References

- [Unit 42 Palo Alto Networks] The npm Threat Landscape: Attack Surface and Mitigations (Updated July 15) (2026-07-15) — https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/
- [Saiyam Pathak (Substack)] Kimi K3 and Inkling: The Frontier Got Crowded (2026-07-16) — https://saiyampathak.substack.com/p/kimi-k3-and-inkling-the-frontier
- [Adversa AI] Top MCP security resources & CVEs July 2026 (2026-07-02) — https://adversa.ai/blog/top-mcp-security-resources-july-2026/
