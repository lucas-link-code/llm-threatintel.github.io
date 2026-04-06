# Axios npm Supply Chain Attack: North Korea-Linked UNC1069 Deploys Cross-Platform RAT via Hijacked Maintainer Account

**Date:** 2026-04-06
**Tags:** supply-chain, malware

## Executive Summary

On March 31, 2026, an attacker introduced malicious dependencies into axios npm package releases 1.14.1 and 0.30.4 between 00:21 and 03:20 UTC. Axios, the JavaScript ecosystem's most popular HTTP client with over 100 million weekly npm downloads, was weaponized as a delivery vehicle for a cross-platform remote access trojan (RAT). Google Threat Intelligence Group publicly attributed the compromise to UNC1069, a North Korea-nexus, financially motivated threat actor.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Axios npm Supply Chain Compromise (UNC1069 / Sapphire Sleet) |
| Attribution | UNC1069 (North Korea-nexus) / Sapphire Sleet (Microsoft attribution) (confidence: high) |
| Target | JavaScript developers globally; organizations with CI/CD pipelines pulling axios via npm |
| Vector | Hijacked npm maintainer account; malicious dependency injection (plain-crypto-js); postinstall hook execution |
| Status | active |
| First Observed | 2026-03-31 |

## Detailed Findings

An attacker hijacked an axios npm maintainer account and published two malicious releases: axios@1.14.1 and axios@0.30.4, with malicious releases adding a trojanized dependency, plain-crypto-js (a typosquat of crypto-js), which downloads and executes a cross-platform RAT (remote access trojan) on install. The threat actor used the postinstall hook within the package.json file to achieve silent execution, and upon installation of the compromised axios package, npm automatically executes an obfuscated JavaScript dropper named setup.js in the background. The attacker hijacked the lead maintainer's npm account, published two poisoned versions across both the 1.x and legacy 0.x release branches within 39 minutes of each other, and injected a phantom dependency whose sole purpose was to deploy persistent malware on macOS, Windows, and Linux. The operation behind the compromise was pre-staged across ~18 hours, with the malicious dependency seeded on npm before the Axios releases to avoid brand-new package alarms. The malicious dependency is an obfuscated dropper that deploys the WAVESHAPER.V2 backdoor across Windows, macOS, and Linux, and GTIG attributes this activity to UNC1069, a financially motivated North Korea-nexus threat actor active since at least 2018, based on the use of WAVESHAPER.V2, an updated version of WAVESHAPER previously used by this threat actor. Microsoft Threat Intelligence has attributed this infrastructure and the Axios npm compromise to Sapphire Sleet, a North Korean state actor.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromise of legitimate npm package via hijacked maintainer credentials |
| Trusted Relationship | T1199 | Exploitation of developer trust in widely-used axios library |
| Remote Access Trojan | T1021.005 | Deployment of WAVESHAPER.V2 backdoor for persistent access |
| Execution via postinstall Hook | T1547.015 | Code execution via npm postinstall lifecycle script |

## IOCs

### Domains

```
sfrclak.com
```

### Full URL Paths

_IOCs from Google Threat Intelligence Group, Microsoft, Datadog Security Labs, StepSecurity, Trend Micro, and Huntress security analyses_

### Splunk Format

```
"sfrclak.com"
```

### File Hashes

```
e10b1fa84f1d6481625f741b69892780140d4e0e7769e7491e5f4d894c2e0e09
7658962ae060a222c0058cd4e979bfa1
```

### Package Indicators

```
axios@1.14.1
axios@0.30.4
plain-crypto-js@4.2.1
```

## Detection Recommendations

Review CI/CD pipeline logs for any npm install executions that may have pulled axios@1.14.1 or axios@0.30.4 during the window the malicious versions were live (approximately 2026-03-31 00:21 UTC to 03:15 UTC), and search for axios@1.14.1, axios@0.30.4, or plain-crypto-js in npm install/npm ci output; if you have network monitoring on CI runners, look for outbound connections to sfrclak.com or 142.11.206.73 on port 8000. Check for the presence of a directory where setup.js ran—if package.json inside has been replaced with a clean stub reporting version 4.2.0, the dropper executed. Review CI/CD pipeline logs for any npm install executions that might have updated to axios@1.14.1 or axios@0.30.4 or presence of plain-crypto-js in npm install/npm ci outputs. Organizations that had lockfiles pinning Axios to a specific version, or CI/CD policies that suppress automatic install scripts, were protected; organizations that did not had a window of exposure measured in hours.

## References

- [Google Threat Intelligence Group] North Korea-Nexus Threat Actor Compromises Widely Used Axios NPM Package in Supply Chain Attack (2026-04-01) — https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package
- [Microsoft Threat Intelligence] Mitigating the Axios npm supply chain compromise (2026-04-01) — https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/
- [Datadog Security Labs] Compromised axios npm package delivers cross-platform RAT (2026-04-03) — https://securitylabs.datadoghq.com/articles/axios-npm-supply-chain-compromise/
- [StepSecurity] axios Compromised on npm - Malicious Versions Drop Remote Access Trojan (2026-03-31) — https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan
- [Trend Micro] Axios NPM Package Compromised: Supply Chain Attack Hits JavaScript HTTP Client (2026-03-31) — https://www.trendmicro.com/en_us/research/26/c/axios-npm-package-compromised.html
- [Huntress] Supply Chain Compromise of axios npm Package (2026-03-31) — https://www.huntress.com/blog/supply-chain-compromise-axios-npm-package
- [SOCRadar] Axios npm Hijack 2026: Everything You Need to Know (2026-04-01) — https://socradar.io/blog/axios-npm-supply-chain-attack-2026-ciso-guide/
