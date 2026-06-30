# Leo Platform npm Supply Chain Attack: Phantom Gyp Worm Steals Multi-Cloud Credentials via Compromised Maintainer (June 24, 2026)

**Date:** 2026-06-30
**Tags:** supply-chain, malware

## Executive Summary

On June 24, 2026, an attacker published malicious versions of 20 npm packages belonging to the Leo Platform ecosystem in a coordinated burst spanning less than three seconds, with all packages carrying an identical CI/CD attack toolkit that steals secrets from GitHub Actions runners, cloud credential stores, package registries, and password managers, then exfiltrating them via the victim's own GitHub token. The attack uses the same 'Phantom Gyp' toolkit as the earlier Miasma campaign (June 3, 2026), employing a binding.gyp install hook, three-layer obfuscation (ROT-N, AES-128-GCM, obfuscator.io), and Bun runtime evasion.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Miasma/Shai-Hulud/Mini Shai-Hulud (Leo Platform Wave) |
| Attribution | Miasma threat actor (possibly TeamPCP/UNC6780 variant) (confidence: medium) |
| Target | Leo Platform/RStreams npm ecosystem developers; AI coding workflows; cloud-native and serverless workloads |
| Vector | Compromised npm maintainer account (czirker) abused to publish trojanized package versions |
| Status | active |
| First Observed | 2026-06-24T23:04:55Z |

## Detailed Findings

All 20 packages were published within a 3-second window at 2026-06-24T23:04:55Z, confirming a single automated operation against the Leo Platform maintainer accounts, with the payload being structurally identical to the Miasma campaign published June 3, 2026, sharing the same binding.gyp hook syntax, the same three-layer obfuscation chain, and the same Bun v1.3.13 download URL. The payload steals secrets from GitHub Actions runners, multi-cloud credential stores (AWS, GCP, Azure), package registries, HashiCorp Vault, Kubernetes, and password managers, then exfiltrates them via the victim's own GitHub token to avoid external C2 domains. It also functions as a supply chain worm, publishing malicious versions of any package the victim has publish rights to by bypassing 2FA. Together these packages receive approximately 13,600 downloads per week. The malware targets developer workstations and CI runners, hunting for AWS, Azure, and Google Cloud credentials alongside GitHub personal access tokens, Kubernetes secrets, HashiCorp Vault credentials, 1Password data, npm publishing credentials, and other sensitive information.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromised npm maintainer account used to publish trojanized package versions |
| Credential Harvesting | T1555.005 | Malicious payload extracts cloud credentials, tokens, and SSH keys from developer machines and CI runners |
| Lateral Movement via Environment Variables | T1021 | Stolen GitHub Actions secrets and cloud credentials enable pivoting to cloud infrastructure |

## IOCs

### Domains

_IOCs per StepSecurity, Microsoft Threat Intelligence, and Sonatype technical writeups; 20+ confirmed malicious versions; npm account 'czirker' vector of compromise_

### Full URL Paths

```
https://www.stepsecurity.io/blog/mass-npm-supply-chain-attack-20-leo-platform-packages-compromised
https://www.sonatype.com/blog/miasma-returns-leo-platform-compromise-in-npm
```

### Splunk Format

```
"https://www.stepsecurity.io/blog/mass-npm-supply-chain-attack-20-leo-platform-packages-compromised" OR "https://www.sonatype.com/blog/miasma-returns-leo-platform-compromise-in-npm"
```

### Package Indicators

```
{'name': '@leo-sdk/sdk', 'registry': 'npm', 'version': 'varies', 'note': 'All versions published 2026-06-24T23:04:55Z affected; high-traffic targets include leo-logger, leo-sdk, leo-aws, leo-config, leo-streams'}
{'name': '@rstreams/core', 'registry': 'npm', 'version': 'varies', 'note': 'RStreams ecosystem packages also targeted'}
```

### Affected Platforms

```
npm registry
GitHub Actions
AWS
GCP
Azure
Kubernetes
```

## Detection Recommendations

Monitor npm package installations for unexpected binding.gyp files in legitimate packages; implement 2FA enforcement and API token rotation for all npm maintainer accounts; audit GitHub Actions runner memory and environment variables for exfiltration indicators; scan for Bun runtime invocations outside normal development workflows; block or restrict node-gyp execution in CI/CD pipelines where not explicitly required; implement supply-chain attestation via SLSA provenance checks; use socket.dev or similar real-time malicious package feeds to detect poisoned releases within minutes of publication.

## References

- [StepSecurity] Mass npm Supply Chain Attack: 20 Leo Platform Packages Compromised (2026-06-25) — https://www.stepsecurity.io/blog/mass-npm-supply-chain-attack-20-leo-platform-packages-compromised
- [Sonatype] Miasma Returns: Leo Platform Compromise in npm (2026-06-25) — https://www.sonatype.com/blog/miasma-returns-leo-platform-compromise-in-npm
- [Microsoft Threat Intelligence (X/Twitter)] Microsoft Threat Intelligence on Leo Platform/RStreams npm attack (2026-06-25) — https://x.com/MsftSecIntel/status/2070225815803949436
- [The Register] Miasma campaign poisons 20-plus npm packages (2026-06-26) — https://www.theregister.com/security/2026/06/26/miasma-campaign-poisons-20-plus-npm-packages-hunts-for-developer-secrets/5262886
