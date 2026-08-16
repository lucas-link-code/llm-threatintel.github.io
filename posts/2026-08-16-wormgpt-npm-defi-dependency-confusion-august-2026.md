# WormGPT-Branded npm Campaign and DeFi Dependency Confusion: 114 Malicious Packages in 7 Days

**Date:** 2026-08-16
**Tags:** supply-chain, malicious-tool

## Executive Summary

Between August 7 and August 14, 2026, 114 malicious packages were confirmed on npm, led by an npm package cluster openly branded after a real dark-LLM attacker tool, with wormgpt-cli and gpt-terminal-cli published on August 7 in nine rapid versions. A separate dependency-confusion cluster targeted DeFi protocol infrastructure with ten package names impersonating real DeFi libraries (ethereum-vault-connector, boring-vault, camelot-ammv2-core, aerodrome-finance, openzeppelin contracts, and others), sixteen confirmed versions published within hours on August 11, targeting developers building on Camelot, Aerodrome Finance, and OpenZeppelin.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | WormGPT npm Campaign + DeFi Dependency Confusion Cluster |
| Attribution | Unknown (confidence: low) |
| Target | npm developers; DeFi protocol developers (Camelot, Aerodrome, OpenZeppelin ecosystems) |
| Vector | Malicious npm packages; brand-squatting and dependency confusion |
| Status | active |
| First Observed | 2026-08-07 |

## Detailed Findings

This week's digest shows attackers leaning on brand recognition rather than hiding from it, with wormgpt-cli going from zero to nine versions on npm in a single day, brazenly named after a real dark-LLM tool sold to cybercriminals, alongside a companion package gpt-terminal-cli published the same day. The WormGPT branding references a known malicious LLM tool, indicating either direct tool distribution attempts or copycat services capitalizing on brand recognition. The DeFi cluster targeted decentralized finance infrastructure directly with ten package names on npm impersonating real DeFi protocol and standards libraries, confirmed versions published within hours of each other on August 11. This represents a coordinated dependency-confusion attack designed to compromise downstream DeFi development environments.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious packages published to public registries (npm) to compromise developer environments |
| Masquerading | T1036 | Package names imitating legitimate DeFi libraries and branded after known attack tools to evade detection |
| Execution | T1204 | User-triggered execution when developers import or install the malicious packages |

## IOCs

### Domains

_IOCs sourced from Xygeni Malicious Code Digest #83 (August 14, 2026)_

### Full URL Paths

_IOCs sourced from Xygeni Malicious Code Digest #83 (August 14, 2026)_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'wormgpt-cli', 'registry': 'npm', 'note': 'Nine versions published August 7, 2026, branded after dark-LLM tool'}
{'name': 'gpt-terminal-cli', 'registry': 'npm', 'note': 'Companion package published August 7, 2026'}
{'name': 'ethereum-vault-connector', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': 'boring-vault', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': 'camelot-ammv2-core', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': 'camelot-ammv2-periphery', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': '@aerodrome-finance/contracts', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': '@aerodrome-finance/slipstream', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': 'permit2', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': '@openzeppelin-4/contracts', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': '@openzeppelin-5/contracts', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
{'name': 'passkeys-react', 'registry': 'npm', 'note': 'DeFi dependency confusion package, August 11, 2026'}
```

### Affected Platforms

```
npm ecosystem
DeFi development environment
```

## Detection Recommendations

Monitor npm package registries for newly published packages matching known malicious tool names (WormGPT, DarkBARD, etc.) and DeFi protocol library names. Flag packages published in rapid succession or clustering (multiple versions in hours). Implement strict dependency pinning and version locking in package.json files. Scan imports for packages with suspiciously close names to legitimate libraries. Use npm audit and Snyk to identify known malicious packages. For DeFi projects, maintain an allowlist of legitimate @openzeppelin, @aerodrome-finance, and other protocol-specific package scopes. Require developer verification of package author identity before installation in high-trust environments.

## References

- [Xygeni] Xygeni Malicious Code Digest 83 (2026-08-14) — https://xygeni.io/blog/xygeni-malicious-code-digest-83/
- [Xygeni] Xygeni Malicious Code Digest 82 (2026-08-07) — https://xygeni.io/blog/xygeni-malicious-code-digest-82/
