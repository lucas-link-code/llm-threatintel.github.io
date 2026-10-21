# Checkmarx Details Token Monitor in Tensorlake 0.5.144 Mini Shai-Hulud Worm That Deletes Home Directory When GitHub Tokens Are Revoked

**Date:** 2026-10-21
**Tags:** supply-chain, malware

## Executive Summary

Checkmarx published a first party technical analysis of the Mini Shai-Hulud worm in tensorlake@0.5.144, adding a destructive detail: a fallback token monitor polls GitHub every 60 seconds and deletes the victim home directory when GitHub returns HTTP 400 through 409, which includes the 401 that follows token revocation. Responders must remove the monitor before revoking any GitHub token, then rotate all secrets the host could reach and rebuild from a trusted image. The malicious release was published to npm on October 8, 2026 and removed about three hours later.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud |
| Attribution | Unknown, tagged WORMTAG tensrlake (confidence: low) |
| Target | Developers and CI systems installing the tensorlake AI agent sandbox SDK from npm |
| Vector | Compromised repository administrator account pushing directly to main branch, then manual trigger of the npm release workflow |
| Status | removed |
| First Observed | 2026-10-07 |

## Detailed Findings

Checkmarx published a first party analysis of the Mini Shai-Hulud campaign against tensorlake, confirming that on October 7, 2026 at about 01:20 UTC an attacker used a compromised repository administrator account to push 13 malicious commits (e90c47b through 6386121) directly to the main branch of tensorlakeai/tensorlake [checkmarx.com](https://checkmarx.com/zero-post/mini-shai-hulud-in-tensorlake-a-token-monitor-that-can-wipe-your-home-directory/). The commits added a preinstall hook, a loader at lib/setup.mjs, and a payload at lib/Math_Symbol.js that steals credentials and spreads itself. According to Checkmarx, the attacker manually triggered the project release workflow on October 8 and published tensorlake@0.5.144 at 01:12:07 UTC; npm removed the version about three hours later and maintainers reverted the commits in pull request #1016, releasing clean 0.5.145 at 20:24:05 UTC on October 8. The maintainers also blocked install scripts in CI, blocked direct pushes to main, required signed commits, and required a second reviewer for every npm publish. Checkmarx reports the payload targets GitHub, npm, cloud, Kubernetes, and Vault secrets along with browser passwords and wallet extension data, and can run operator supplied JavaScript, plant a workflow that dumps GitHub Actions secrets, and republish npm packages with Sigstore provenance attached. The operationally critical new detail is a fallback path in which the payload installs a token monitor that checks GitHub every 60 seconds for up to 24 hours; if GitHub returns an HTTP status from 400 to 409, including the 401 that follows token revocation, the monitor deletes the victim home directory. Checkmarx instructs responders to isolate affected hosts, remove the monitor before revoking any GitHub token, then rotate everything the host could reach and rebuild from a trusted image. Checkmarx notes approximately 15,664 tensorlake downloads across 100 versions from October 1 to 8 but states the figures cannot show how many times the malicious version was installed, and that no malicious PyPI or Cargo release was identified.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | Attacker used a compromised repository administrator account to push malicious commits and publish tensorlake@0.5.144 to npm |
| Data Destruction | T1485 | Fallback token monitor deletes the victim home directory when it detects a GitHub token revocation response |

## IOCs

### Domains

_IOCs sourced from Checkmarx analysis; commit SHAs are repository commit identifiers, not file hashes._

### Full URL Paths

_IOCs sourced from Checkmarx analysis; commit SHAs are repository commit identifiers, not file hashes._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
npm:tensorlake@0.5.144
```

### Affected Platforms

```
npm
GitHub Actions
Kubernetes
HashiCorp Vault
```

## Detection Recommendations

Hunt for tensorlake@0.5.144 installs and the presence of lib/setup.mjs and lib/Math_Symbol.js in node_modules. Before revoking any GitHub token on an affected host, locate and remove the persistent token monitor process to avoid triggering home directory deletion. Monitor npm install hooks and CI release workflow runs for unauthorized publish actions. Enforce signed commits and a second reviewer for package publishes. After cleanup, rotate GitHub, npm, cloud, Kubernetes, and Vault credentials reachable from the host and rebuild from a trusted image.

## References

- [Checkmarx] Mini Shai-Hulud in Tensorlake: A Token Monitor That Can Wipe Your Home Directory (2026-10-08) — https://checkmarx.com/zero-post/mini-shai-hulud-in-tensorlake-a-token-monitor-that-can-wipe-your-home-directory/
