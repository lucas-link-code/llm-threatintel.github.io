# CrowdStrike 2026 Threat Hunting Report: STARDUST CHOLLIMA DPRK Supply Chain Campaign Targets Mastra AI Framework via npm Poisoning

**Date:** 2026-08-05
**Tags:** supply-chain, nation-state, malware

## Executive Summary

CrowdStrike's 2026 Threat Hunting Report, published 2026-08-03, attributes a June 2026 npm dependency injection against the Mastra AI framework to DPRK-nexus STARDUST CHOLLIMA, the same actor CrowdStrike tied to the March 2026 Axios npm compromise. Independent June 17 reporting by Aikido and StepSecurity identified the injected dependency as easy-day-js@1.11.22, a dayjs typosquat whose postinstall hook fetched a second-stage payload from 23.254.164.92. Block easy-day-js, hunt those C2 addresses, and do not treat the Mastra framework name itself as an indicator.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | STARDUST CHOLLIMA Mastra npm dependency injection via easy-day-js |
| Actor / Attribution | STARDUST CHOLLIMA, DPRK-nexus, CrowdStrike attribution, confidence high. Aikido and StepSecurity documented the package and C2 without naming the actor. |
| Target | Developers and CI installing Mastra AI framework npm packages |
| Vector | Compromised @mastra npm publishing; caret dependency on easy-day-js resolving to a postinstall dropper |
| Status | June 2026 compromise as reported; CrowdStrike did not publish current registry status |
| First Observed | 2026-06-16 bait package; 2026-06-17 mass republish of Mastra packages |

## Detailed Findings

According to CrowdStrike's 2026-08-03 blog on the Threat Hunting Report, STARDUST CHOLLIMA used stolen maintainer credentials in March 2026 to compromise the Axios npm package and deliver platform-specific ZshBucket malware. In June 2026, CrowdStrike reported, the same adversary injected a malicious npm package as a dependency into at least 131 Mastra AI framework packages. CrowdStrike's press release on the same day used the same 131-package figure and said 87 percent of identified software registry threats in the first half of 2026 involved malicious npm packages.

CrowdStrike's public blog and press release do not name the injected package, publish hashes, or list C2. Those details come from Aikido Security and StepSecurity, who published technical write-ups on 2026-06-17, the day of the Mastra republish. Aikido counted 141 republished packages between 01:15 and 02:00 UTC, including mastra@1.13.1, create-mastra@1.13.1, and @mastra/core@1.42.1. StepSecurity counted 140-plus packages over an 88-minute window starting 01:12 UTC. The CrowdStrike 131 figure and the Aikido 141 figure are not reconciled in public reporting; treat them as separate snapshots of the same incident class.

According to Aikido and StepSecurity, npm user sergey2016 published easy-day-js@1.11.21 on 2026-06-16 as a clean copy of dayjs, then published easy-day-js@1.11.22 on 2026-06-17 with a postinstall hook running obfuscated setup.cjs. Compromised Mastra package.json files depended on easy-day-js at caret 1.11.21, so a fresh npm install resolved to 1.11.22. Aikido noted the same staging pattern as the March Axios campaign, where plain-crypto-js played the equivalent role.

StepSecurity reported that setup.cjs disabled TLS certificate validation, fetched a second-stage script from 23.254.164.92 on port 8000 at path /update/49890878, spawned it as a detached Node process, passed 23.254.164.123:443 as an argument, then deleted itself. Aikido reported the second stage collected system information and targeted more than 160 browser crypto-wallet extensions, with persistence disguised as node-related tooling. StepSecurity's controlled install of @mastra/core@1.42.1 blocked the first-stage fetch before the second stage ran.

Aikido compared Hostwinds VPS infrastructure and the port-8000 first-stage pattern with the Axios dropper. That technical overlap supports CrowdStrike's later grouping of Axios and Mastra under STARDUST CHOLLIMA; it is not independent name-level attribution by Aikido.

Do not add mastra, @mastra/core, npmjs.com, or dayjs as campaign indicators. Those are legitimate packages and registries. The attacker-controlled package published by Aikido and StepSecurity is easy-day-js@1.11.22.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | STARDUST CHOLLIMA injected a malicious npm dependency into Mastra framework packages; Aikido and StepSecurity identified that dependency as easy-day-js. |
| Command and Scripting Interpreter: JavaScript | T1059.007 | easy-day-js@1.11.22 ran obfuscated setup.cjs through an npm postinstall hook. |
| Ingress Tool Transfer | T1105 | setup.cjs fetched a second-stage payload from 23.254.164.92:8000. |
| Application Layer Protocol: Web Protocols | T1071.001 | First-stage HTTP fetch on port 8000; second-stage callback to 23.254.164.123:443. |
| Indicator Removal: File Deletion | T1070.004 | The dropper deleted setup.cjs after execution. |
| Valid Accounts | T1078 | CrowdStrike reported stolen maintainer credentials for the March Axios compromise; StepSecurity reported compromised @mastra organization credentials for the June republish. |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

Aikido and StepSecurity published the first-stage fetch as an IP and port, not a domain. Those addresses are in Detection Recommendations and in data/iocs.json as IP indicators. They are not url_path values.

### Splunk Format

```
"easy-day-js" OR "23.254.164.92" OR "23.254.164.123"
```

### File Hashes

```
No hash IOCs published by source
```

### Package Indicators

```
npm:easy-day-js@1.11.22
```

easy-day-js@1.11.21 is the clean bait version. It is not listed as a malware package. Aikido listed 141 compromised Mastra versions from 2026-06-17, including mastra@1.13.1 and @mastra/core@1.42.1. Those are temporarily poisoned releases of a legitimate framework, not a malware family name. Hunt lockfiles for easy-day-js rather than denylisting mastra.

## Detection Recommendations

Query npm lockfiles, node_modules, and package-lock.json for easy-day-js. Alert on any resolution of easy-day-js@1.11.22. Treat a caret pin of easy-day-js@^1.11.21 as the same risk because npm will pull 1.11.22.

On DNS, proxy, and EDR network telemetry, alert on 23.254.164.92 port 8000 and 23.254.164.123 port 443. Hunt Node processes spawned from tmp with a 24-hex filename plus those destinations. Hunt temp files named .pkg_history and .pkg_logs written at install time.

In CI, fail builds that add a new production dependency named easy-day-js, or that republish @mastra packages with an unexpected dependency diff. Review npm publish events for the @mastra org around 2026-06-17 01:12 to 02:39 UTC.

Do not block npmjs.com, mastra.ai, or current Mastra package names as campaign IOCs.

## References

- [CrowdStrike] CrowdStrike 2026 Threat Hunting Report: Exploitation Window Closes as AI Use Accelerates (2026-08-03) — https://www.crowdstrike.com/en-us/blog/crowdstrike-2026-threat-hunting-report/
- [CrowdStrike] CrowdStrike 2026 Threat Hunting Report: AI is Now Embedded Across Modern Adversary Operations (2026-08-03) — https://www.crowdstrike.com/en-us/press-releases/crowdstrike-2026-threat-hunting-report/
- [Aikido Security] Over 140 popular Mastra npm Packages Hit by Supply Chain Attack (2026-06-17) — https://www.aikido.dev/blog/over-140-popular-mastra-npm-packages-hit-by-supply-chain-attack
- [StepSecurity] Mastra npm Supply Chain Attack: 140+ Packages Backdoored via easy-day-js Typosquat (2026-06-17) — https://www.stepsecurity.io/blog/mastra-npm-packages-compromised-using-easy-day-js
