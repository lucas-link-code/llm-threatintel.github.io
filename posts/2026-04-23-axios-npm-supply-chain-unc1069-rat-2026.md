# Axios npm Supply Chain Attack: Cross-Platform RAT Delivery via North Korea-Nexus Actor UNC1069

**Date:** 2026-04-23
**Tags:** supply-chain, malware

## Executive Summary

On March 30, 2026, Elastic Security Labs detected a supply chain compromise targeting the axios npm package through automated supply-chain monitoring. The attacker gained control of the npm account belonging to jasonsaayman, one of the project's primary maintainers, and published two backdoored versions within a 39-minute window. The axios package is one of the most widely depended-upon HTTP client libraries in the JavaScript ecosystem. At the time of discovery, both the latest and legacy dist-tags pointed to compromised versions, ensuring that the majority of fresh installations pulled a backdoored release.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Axios npm Supply Chain Compromise (MAL-2026-2307) |
| Attribution | UNC1069, a North Korea-nexus, financially motivated threat actor; also tracked as Sapphire Sleet, a North Korean state actor (confidence: high) |
| Target | All organizations installing axios versions 1.14.1 or 0.30.4 across Windows, macOS, and Linux; one of the most widely depended-upon HTTP client libraries in the JavaScript ecosystem |
| Vector | Compromised npm maintainer account used to directly publish malicious versions; plain-crypto-js postinstall hook silently downloaded and executed platform-specific stage-2 RAT implants |
| Status | active |
| First Observed | 2026-03-30 |

## Detailed Findings

On April 20, 2026, the Cybersecurity and Infrastructure Security Agency (CISA) issued an alert on the compromise of the axios package in the npm ecosystem. This incident is being tracked as MAL-2026-2307 and highlights a growing class of npm supply chain attacks that propagate through automated CI/CD systems. The attacker compromised a maintainer account and published backdoored versions that delivered a cross-platform Remote Access Trojan to macOS, Windows, and Linux systems through a malicious postinstall hook. The attacker deployed three parallel implementations of the same RAT — one each for Windows, macOS, and Linux — all sharing an identical C2 protocol, command structure, and beacon behavior. This isn't three different tools; it's a single cross-platform implant framework with platform-native implementations. Axios lead maintainer Jason Saayman published a post-mortem explaining that the npm supply chain attack began with a targeted social engineering operation. In a follow-up explanation, he said the attackers built a highly convincing setup that closely resembled the tactics Google recently described in its report on UNC1069 social engineering activity. Both the latest and legacy dist-tags pointed to compromised versions, ensuring that the majority of fresh installations pulled a backdoored release.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Direct compromise of npm package maintainer credentials to publish malicious versions to official registry |
| Social Engineering | T1598 | Targeted social engineering of package maintainer to capture credentials |
| Execution: Command and Scripting Interpreter | T1059 | Postinstall script execution during package installation |
| Remote Access Trojan | T1219 | Delivery and execution of cross-platform RAT implant |

## IOCs

### Domains

```
sfrclak[.]com
```

### Full URL Paths

```
sfrclak[.]com:8000
```

### Splunk Format

```
"sfrclak[.]com" OR "sfrclak[.]com:8000"
```

### Package Indicators

```
axios@1.14.1
axios@0.30.4
plain-crypto-js@4.2.1
```

## Detection Recommendations

Legitimate Axios releases always include OIDC provenance metadata and SLSA build attestations linking the npm package back to a specific GitHub Actions run. The malicious versions had none of this – they were published directly, leaving no verifiable build trail. For security teams: Require npm publish provenance checks (–provenance flag) and SLSA level 2+ for all internal and critical third-party packages. Absence of OIDC provenance on a new version of a major package should trigger an automatic alert. Monitor for npm package installations of versions 1.14.1 or 0.30.4; audit npm install/ci output logs for presence of plain-crypto-js dependency; check for outbound connections to sfrclak[.]com or 142.11.206[.]72 on port 8000; scan node_modules directories for plain-crypto-js or affected axios versions; implement package manager cache cleanup and dependency version pinning policies.

## References

- [Elastic Security Labs] Inside the Axios supply chain compromise - one RAT to rule them all (2026-03-31) — https://www.elastic.co/security-labs/axios-one-rat-to-rule-them-all
- [CISA] CISA Alert: Axios NPM Supply Chain Compromise (April 2026) (2026-04-20) — https://info.varnish-software.com/blog/cisa-alert-axios-npm-supply-chain-compromise-april-2026-how-to-protect-your-ci/cd-pipelines
- [Microsoft Security Blog] Mitigating the Axios npm supply chain compromise (2026-04-01) — https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/
- [The Hacker News] Self-Propagating Supply Chain Worm Hijacks npm Packages to Steal Developer Tokens (2026-04-22) — https://thehackernews.com/2026/04/self-propagating-supply-chain-worm.html
- [SocrAdar] Axios npm Hijack 2026: Everything You Need to Know (2026-04-08) — https://socradar.io/blog/axios-npm-supply-chain-attack-2026-ciso-guide/
