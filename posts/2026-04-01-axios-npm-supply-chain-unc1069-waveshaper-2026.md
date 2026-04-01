# Axios npm Supply Chain Attack: North Korean UNC1069 Deploys Cross-Platform WAVESHAPER.V2 RAT

**Date:** 2026-04-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, npm, malware, nation-state, attribution

## Executive Summary

Google Threat Intelligence Group attributes the Axios npm package compromise to UNC1069, a North Korea-nexus financially motivated threat actor, based on infrastructure overlaps and use of WAVESHAPER.V2 backdoor. The malicious versions were live for approximately 2-3 hours on March 31, 2026, with both latest and legacy tags compromised to maximize blast radius. Organizations must immediately audit for affected versions and treat any system with exposure as fully compromised.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Axios npm Supply Chain Attack |
| Attribution | UNC1069 (North Korea-nexus) (confidence: high) |
| Target | JavaScript developers and CI/CD infrastructure globally |
| Vector | Compromised npm maintainer account |
| Status | disrupted |
| First Observed | March 31, 2026 |

## Detailed Findings

On March 31, 2026, attackers compromised the npm account of the lead Axios maintainer and published two malicious versions (1.14.1 and 0.30.4) that introduced a hidden dependency delivering a cross-platform Remote Access Trojan. The malicious versions introduced plain-crypto-js as a dependency whose postinstall hook downloaded platform-specific RAT implants from sfrclak[.]com:8000, deploying three parallel implementations sharing identical C2 protocol and command structure. Google Threat Intelligence Group publicly attributed the compromise to UNC1069, a North Korea-nexus threat actor, based on use of WAVESHAPER.V2 backdoor and infrastructure overlaps with previous UNC1069 operations. The compromise was evident from npm metadata showing the maintainer email changed from jasonsaayman@gmail.com to ifstap@proton.me and publishing method shifted from trusted OIDC flow to direct CLI publish. The second-stage payloads function as lightweight RATs beaconing every 60 seconds with capabilities including remote shell execution, binary injection, directory browsing, process listing, and system reconnaissance.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.002 | Compromise of software supply chain through hijacking of npm maintainer account and publication of malicious package versions |
| Command and Scripting Interpreter | T1059.007 | JavaScript-based dropper executing postinstall hooks to download and execute platform-specific RAT payloads |
| Ingress Tool Transfer | T1105 | Download of platform-specific RAT implants from C2 server during postinstall execution |
| Application Layer Protocol | T1071.001 | HTTP-based C2 communication with 60-second beacon intervals for command and control |
| System Information Discovery | T1082 | RAT performs immediate system reconnaissance including user directories, filesystem enumeration, and process listing |

## IOCs

### Domains

```
sfrclak.com
```

### Full URL Paths

```
sfrclak.com:8000
```

### Splunk Format

```
"sfrclak.com" OR "sfrclak.com:8000"
```

### File Hashes

```
2553649f232204966871cea80a5d0d6adc700ca
d6f3f62fd3b9f5432f5782b62d8cfd5247d5ee71
07d889e2dadce6f3910dcbc253317d28ca61c766
e10b1fa84f1d6481625f741b69892780140d4e0e7769e7491e5f4d894c2e0e09
```

### Package Indicators

```
npm:axios@1.14.1
npm:axios@0.30.4
npm:plain-crypto-js@4.2.1
```

## Detection Recommendations

Monitor web proxy logs for outbound connections to sfrclak.com:8000. Search EDR logs for npm postinstall script execution with network connectivity during March 31, 2026 timeframe. Check CI/CD pipeline logs for axios package installations between 00:21-03:15 UTC March 31. Monitor for Registry Run key modifications on Windows systems and persistent batch file creation in %PROGRAMDATA%. Use YARA rule G_Backdoor_WAVESHAPER.V2_PS_1 for PowerShell variant detection. Audit package-lock.json and yarn.lock files for axios versions 1.14.1/0.30.4 and plain-crypto-js dependency presence.

## References

- [Google Cloud Security] North Korea-Nexus Threat Actor Compromises Widely Used Axios NPM Package in Supply Chain Attack (2026-04-01) — https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package
- [Elastic Security Labs] Inside the Axios supply chain compromise - one RAT to rule them all (2026-04-01) — https://www.elastic.co/security-labs/axios-one-rat-to-rule-them-all
- [SOCRadar] Axios npm Hijack 2026: Everything You Need to Know – IOCs, Impact & Remediation (2026-04-01) — https://socradar.io/blog/axios-npm-supply-chain-attack-2026-ciso-guide/
- [SANS Institute] Axios NPM Supply Chain Compromise: Malicious Packages Deliver Remote Access Trojan (2026-03-31) — https://www.sans.org/blog/axios-npm-supply-chain-compromise-malicious-packages-remote-access-trojan
