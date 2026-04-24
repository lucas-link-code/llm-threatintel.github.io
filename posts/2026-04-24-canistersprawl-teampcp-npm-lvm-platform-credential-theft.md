# CanisterSprawl: TeamPCP npm Supply Chain Campaign Targeting LLM Platforms with 22 Compromised Packages

**Date:** 2026-04-24
**Tags:** supply-chain, malware

## Executive Summary

The CanisterWorm campaign, first reported on March 20, 2026, affected 141 packages between March 20 and 23, according to Socket's research. The attack wave affecting Namastex, which Socket now tracks as "CanisterSprawl," has affected a total of 22 packages since April 8. Namastex's Automagik Genie is a command line interface (CLI) for using AI coding agents to create pull requests and pgserve is an embedded PostgreSQL server; the packages had about 8,000 weekly downloads combined as of April 21, 2026. The malicious postinstall script harvests secrets from the victim's environment by searching environment variables for names associated with tokens, credentials, cloud providers, CI/CD systems, registries, LLM platforms and other secrets. It also targets sensitive local system files including .npmrc, .git-credentials, .netrc, .env files, database password files, and files storing SSH keys and cloud credentials, as well as artifacts from browsers and cryptocurrency wallets.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | CanisterSprawl (part of broader TeamPCP campaign) |
| Attribution | TeamPCP (confidence: high) |
| Target | AI development teams; CI/CD pipelines with LLM credentials; cryptocurrency wallet holders |
| Vector | Malicious npm postinstall scripts in compromised packages; exfiltration via ICP canister and webhook |
| Status | active |
| First Observed | 2026-04-08 |

## Detailed Findings

While the ICP canister used in the Namastex attack is not the same canister seen in previous CanisterWorm attacks, Socket assessed it is likely part of the same campaign based on the pattern of broad credential theft, use of both a webhook and ICP canister for off-host exfiltration and cross-ecosystem targeting of both npm and PyPI. Wiz Research has stated that TeamPCP, the threat actor behind a recent supply chain attack affecting Aqua Security's Trivy vulnerability scanner and the popular AI middleware LiteLLM, was also behind the CanisterWorm campaign. This linkage establishes TeamPCP as a persistent threat actor targeting the AI infrastructure supply chain with multi-stage credential harvesting and lateral movement payloads.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromise of npm packages to inject credential-stealing malware |
| Credential Access | T1555 | Extraction of stored browser credentials, SSH keys, API tokens, LLM provider credentials |
| Lateral Movement | T1570 | Use of stolen CI/CD credentials to pivot into development and production environments |

## IOCs

### Domains

_22 packages total affected since April 8; specific package names for remaining 20 not disclosed in available sources. Exfiltration via ICP canister (distinct from CanisterWorm canister) and webhook endpoints._

### Full URL Paths

_22 packages total affected since April 8; specific package names for remaining 20 not disclosed in available sources. Exfiltration via ICP canister (distinct from CanisterWorm canister) and webhook endpoints._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
namastex/automagik-genie
namastex/pgserve
```

## Detection Recommendations

Monitor npm package installations for suspicious postinstall scripts that reference environment variables, credential files, or exfiltration endpoints. Implement strict package signing and registry pinning in CI/CD pipelines. Audit all environment variables and .env files for exposure of LLM provider API keys (OpenAI, Anthropic, etc.) and cloud credentials (AWS, Azure). Establish egress filtering to block unexpected outbound connections to ICP canister endpoints and unfamiliar webhook URLs. Rotate all LLM API keys and cloud credentials that were accessible on development machines during the compromise window.

## References

- [SC Media / Socket Research] Namastex npm packages compromised in 'CanisterWorm' supply chain attack (2026-04-23) — https://www.scworld.com/news/namastex-npm-packages-compromised-in-canisterworm-supply-chain-attack
- [Wiz Research] TeamPCP Attribution to CanisterWorm Campaign (2026-04-23) — https://wiz.io
