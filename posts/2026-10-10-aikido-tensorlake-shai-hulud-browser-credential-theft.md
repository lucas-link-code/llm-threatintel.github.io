# Aikido Analysis Shows Tensorlake 0.5.144 Shai-Hulud Worm Targeting Browser Credential Stores

**Date:** 2026-10-10
**Tags:** supply-chain, malware

## Executive Summary

Aikido published a technical analysis of the compromised npm package tensorlake 0.5.144, detailing how the Shai-Hulud worm variant escalates from prior waves by reading browser credential stores for 14 cryptocurrency extensions and pulling a remote HackBrowserData binary from its command and control server. The malicious version was introduced through a verified commit under a maintainer identity on 2026-10-07 and published to npm on 2026-10-08. Developers who installed the version should rotate credentials and secrets across local files, CI, Kubernetes, and Vault.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ChainDrop Shai-Hulud Tensorlake compromise |
| Attribution | Unknown (confidence: none) |
| Target | developers and CI environments using the tensorlake npm SDK |
| Vector | compromised npm package 0.5.144 delivered through a maintainer account commit and preinstall hook |
| Status | active |
| First Observed | 2026-10-08 |

## Detailed Findings

According to Aikido, a threat actor published a compromised version 0.5.144 of the tensorlake npm package on 2026-10-08, containing a variant of the Shai-Hulud worm that exfiltrates secrets and attempts to self replicate through connected supply chains. Aikido reported that the malware differs from prior Shai-Hulud waves by attempting to read more sensitive data from web browser stores, targeting hardcoded file paths related to 14 cryptocurrency browser extensions and exfiltrating extension IndexedDB and LevelDB files. Aikido also stated the malware sources a remote HackBrowserData binary appropriate for the infected system from its command and control address and invokes it to obtain additional credentials from browser stores. According to Aikido, the operator appears focused on quickly monetizing infected developer endpoints rather than proliferating through the supply chain. Aikido reported the malware originated from the tensorlake GitHub repository where, on 2026-10-07, the threat actor made verified commits under a maintainer identity, introducing the malware in commit 41b38f0 via direct file upload and then attempting to bump versions and trigger publishing. According to Socket, the malicious package was flagged roughly 11 minutes after publication and receives approximately 12K weekly downloads, while Aikido notes a lifetime install count of over 100,000. Socket identified the loader at package/lib/setup.mjs invoked by the preinstall hook and the credential stealing payload at package/lib/Math_Symbol.js, and assessed credential harvesting across local files, CI environments, Kubernetes, and Vault sources.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious version published to npm after verified maintainer account commits |
| Credentials from Web Browsers | T1555.003 | Worm reads browser extension IndexedDB and LevelDB stores and runs HackBrowserData |

## IOCs

### Domains

_Package version from Aikido and Socket. Aikido names commit 41b38f0; no C2 domains, IPs, or file hashes were published in the provided summaries_

### Full URL Paths

_Package version from Aikido and Socket. Aikido names commit 41b38f0; no C2 domains, IPs, or file hashes were published in the provided summaries_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
npm:tensorlake@0.5.144
```

### Affected Platforms

```
npm
developer endpoints
CI environments
Kubernetes
Vault
```

## Detection Recommendations

Block or remove tensorlake 0.5.144 from npm caches, lockfiles, and CI runners, and audit for the preinstall hook loading package/lib/setup.mjs plus the payload file package/lib/Math_Symbol.js. Rotate all credentials that may have been present on any host that installed the version, including CI tokens, Kubernetes secrets, and Vault tokens, and inspect browser extension IndexedDB and LevelDB paths for unexpected reads. Monitor for outbound requests fetching a HackBrowserData binary and treat maintainer account commit activity that bypasses review as a supply chain signal.

## References

- [Aikido] tensorlake NPM package compromised with Shai Hulud worm (2026-10-08) — https://www.aikido.dev/blog/tensorlake-npm-package-compromised
- [Socket] TensorLake npm SDK Compromised in ChainDrop Shai-Hulud Credential-Stealing Attack (2026-10-08) — https://www.socket.dev/blog/tensorlake-compromise
