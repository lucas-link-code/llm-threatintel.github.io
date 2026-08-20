# Shai-Hulud npm Worm: Keyv and 400+ Packages Compromised via GitHub Maintainer Account Takeover on August 4, 2026

**Date:** 2026-08-20
**Tags:** supply-chain, malware

## Executive Summary

A credential-stealing npm worm compromised over 1,300 package versions on the npm registry on August 4, 2026, affecting widely used caching libraries such as keyv, cacheable, flat-cache, and file-entry-cache. The malicious releases add a preinstall hook that runs an obfuscated loader before application code starts, then launches a much larger second-stage payload. The campaign represents a combined 2 billion monthly downloads.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Shai-Hulud npm worm family (Mini Shai-Hulud variant) |
| Attribution | Unknown; TTPs consistent with TeamPCP but source code publicly released (confidence: low) |
| Target | npm developers and CI/CD pipelines using keyv, cacheable, flat-cache, file-entry-cache, and 400+ downstream packages |
| Vector | Compromised GitHub maintainer account; direct commit and release to npm registry with valid GitHub Actions provenance |
| Status | active |
| First Observed | 2026-08-04 |

## Detailed Findings

On August 4, 2026, attackers compromised the GitHub account of the maintainer behind keyv, a key-value storage library with roughly 127 million weekly npm downloads, and used that access to inject a credential-stealing worm across the entire package family. The same maintainer owns cacheable (29M downloads/month), flat-cache (565M downloads/month), file-entry-cache (557M downloads/month), and several other widely-used caching utilities, all of which were swept up in the same attack. The compromise was carried out by pushing malicious files directly to the main branch and then immediately cutting a new release, meaning the poisoned versions were published to npm with valid provenance signed by GitHub Actions. Anyone who ran npm install against an affected version would have had setup.mjs execute automatically before their install completed; setup.mjs is a heavily obfuscated dropper. Semgrep documented the same Claude Code and VS Code hooks, setup.mjs filename and Bun 1.3.13 download in an April compromise of the lightning PyPI package, linking this to the broader Shai-Hulud malware family. The worm moved between organizations every two to seven minutes and completed the cross-organization publishing burst in roughly half an hour. A credential-stealing npm worm that first appeared in keyv@6.0.0 spread beyond the Keyv and Cacheable namespaces into hundreds of packages across multiple organizations on August 4, 2026.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromised npm maintainer account to inject malware into widely-used packages |
| Credential Access | T1556 | Preinstall script exfiltrates developer and CI/CD credentials |
| Persistence | T1547.013 | npm preinstall lifecycle hook executes obfuscated loader on package installation |

## IOCs

### Domains

_Over 1,300 package versions compromised across 400+ distinct npm packages. Valid GitHub Actions provenance signatures used. Bun 1.3.13 user-agent observed in malware C2 communications._

### Full URL Paths

_Over 1,300 package versions compromised across 400+ distinct npm packages. Valid GitHub Actions provenance signatures used. Bun 1.3.13 user-agent observed in malware C2 communications._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'keyv', 'registry': 'npm', 'version': '6.0.0', 'note': 'Initial compromise; preinstall hook with setup.mjs dropper'}
{'name': 'cacheable', 'registry': 'npm', 'version': 'affected', 'note': 'Part of same maintainer ecosystem'}
{'name': 'flat-cache', 'registry': 'npm', 'version': 'affected', 'note': '565M monthly downloads; same family'}
{'name': 'file-entry-cache', 'registry': 'npm', 'version': 'affected', 'note': '557M monthly downloads; same family'}
{'name': '@cacheable/utils', 'registry': 'npm', 'version': 'affected', 'note': 'Downstream propagation'}
{'name': 'cache-manager', 'registry': 'npm', 'version': 'affected', 'note': 'Downstream propagation'}
```

### Affected Platforms

```
Node.js
npm registry
CI/CD pipelines
Developer workstations
```

## Detection Recommendations

Monitor npm package installations for preinstall script execution and setup.mjs files. Implement npm lifecycle script disabling via `--ignore-scripts` during installation and maintain narrow allowlist for legitimate scripts. Review GitHub commit history for all keyv-family packages and downstream dependents. Scan for setup.mjs and Math_Symbol.js files in node_modules. Monitor for Bun/1.3.13 user-agent requests to non-standard domains. Audit all developer and CI/CD credential stores (AWS, GCP, Azure, GitHub tokens) on affected systems. Implement supply chain controls: pin package versions, verify GitHub Actions provenance, enforce code review on all releases, and monitor for unusual GitHub account activity on maintainer accounts.

## References

- [Cyber Security Agency of Singapore] Ongoing npm Supply Chain Attack Affecting Keyv and Related Packages ('Shai-Hulud' Worm) (2026-08-06) — https://www.csa.gov.sg/alerts-and-advisories/advisories/ad-2026-009/
- [Snyk] Inside the keyv npm Supply Chain Compromise (2026-08-04) — https://snyk.io/blog/inside-keyv-npm-compromise-preinstall-malware-trusted-provenance-ide-hooks/
- [Datadog Security Labs] Worm compromises hundreds of popular npm packages (2026-08-04) — https://securitylabs.datadoghq.com/articles/npm-worm-compromises-popular-npm-packages/
- [Aikido] Keyv and friends compromised in npm supply chain attack (2026-08-05) — https://www.aikido.dev/blog/keyv-and-friends-compromised-in-npm-supply-chain-attack
- [The Hacker News] Keyv-Linked npm Worm Poisons Hundreds of Packages, Plants Claude Code and VS Code Hooks (2026-08-04) — https://thehackernews.com/2026/08/keyv-linked-npm-worm-poisons-hundreds.html
- [Wiz Research] keyv and cacheable npm Package Hijacked in Supply Chain Attack (2026-08-04) — https://www.wiz.io/blog/keyv-and-cacheable-npm-supply-chain-attack
- [Palo Alto Networks Unit 42] The npm Threat Landscape: Attack Surface and Mitigations (2026-07-15) — https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/
