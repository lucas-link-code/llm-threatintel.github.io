# CrowdStrike: PhantomRaven npm Stealer Was Likely LLM Generated and Used to Hunt Bug Bounties

**Date:** 2026-09-18
**Tags:** supply-chain, malware

## Executive Summary

CrowdStrike Counter Adversary Operations published on 2026-09-15 that PhantomRaven, a JavaScript infostealer delivered through npm remote dynamic dependencies, was almost certainly written with a large language model. The assessment rests on verbose comments, placeholder WebSocket URLs, and token analysis, with high confidence. Falcon Complete tied packages transform-jsbi-to-bigint and sort-imports-es6-autofix to npm users jpdhellonpm1 and jpd15. Hunt those package names, the storeartifact and jpartifacts C2 hosts, SHA256 hashes below, and CI variables in unexpected GET or POST bodies. Do not denylist npmjs.com or api64.ipify.org.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | PhantomRaven JavaScript infostealer via npm remote dynamic dependencies and preinstall |
| Actor / Attribution | Unnamed financially motivated operator who claims to be a bug bounty hunter. CrowdStrike tied npm aliases jpdhellonpm1 and jpd15 with high confidence, plus related handles jpd12, jpd13, npmhell, npmpackagejpd, npmtestdharsh, jpdhackerone11, and packagedharsh. No CrowdStrike actor cluster name |
| Target | Developers and CI runners. Stolen data is system fingerprint plus GitHub Actions, GitLab CI, Jenkins, and CircleCI environment variables |
| Vector | Typosquat or decoy npm packages with a Hello world payload and an HTTP URL dependency. npm fetches PhantomRaven, then a preinstall script runs |
| Status | Active family, ongoing since 2025. The Hacker News said the two named npm accounts were gone as of 2026-09-18 |
| First Observed | Koi Security and DCODX public disclosure late October 2025. CrowdStrike said the operator has been active since November 2022. This LLM generation analysis is 2026-09-15 |

## Detailed Findings

According to [CrowdStrike](https://www.crowdstrike.com/en-us/blog/phantomraven-llm-generated-information-stealer-for-bug-bounty-hunting/), Falcon Complete handled multiple PhantomRaven incidents and found PhantomRaven scripts in npm packages transform-jsbi-to-bigint published by jpdhellonpm1 and sort-imports-es6-autofix published by jpd15. Both usernames include JPD, matching a contact mailbox used to tell a victim organization that a device was compromised. Package files include the operator name and initials. CrowdStrike has not seen PhantomRaven logs for sale on stealer shops and assesses the operator uses the theft to find bug bounty submissions across Bugcrowd, Intigriti, YesWeHack, HackenProof, and HackerOne.

CrowdStrike said the benign looking package declares a dependency as an HTTP URL rather than a registry name. At install, npm pulls that remote dynamic dependency from attacker infrastructure. The returned package runs a preinstall script. npm 12 and later block install scripts unless the developer approves them. Older npm still auto executes preinstall.

The stealer collects OS, architecture, hostname, local and external IP, cwd, PID, Node version, argv, environment variables, Git and npm user identity, timestamps, and a long list of CI keys including GITHUB_TOKEN adjacent fields, GITLAB_CI, JENKINS_URL, CIRCLECI, and npm_package_name. External IP is resolved via api64.ipify.org, which is shared infrastructure and is not an IOC. Data is sent twice, as a GET query string and as a JSON POST with User-Agent Mozilla/5.0 (Windows NT 10.0; Win64; x64). An unfinished WebSocket fallback uses wss://yourserver.com/socket, which CrowdStrike treats as an LLM leftover, not live C2.

CrowdStrike assessed LLM authorship with high confidence from comment density before every function, placeholder C2, dual GET and POST exfil, and statistical token patterns. In December 2025 CrowdStrike found a GitHub account that had opened a PyPI issue in February 2025 after an upload was rejected as a dependency confusion attempt. Remaining Python files resembled PhantomRaven and contained jpdtester01@gmail.com.

[The Hacker News](https://thehackernews.com/2026/09/claimed-bug-bounty-hunter-likely-used.html) summarized the same CrowdStrike paper on 2026-09-18, restated the October 2025 Koi and DCODX wave of more than 100 packages, and said both named npm accounts were inaccessible at publication. Earlier waves from Endor Labs, Sonatype, and Mend are older than this 14 day window and are not re listed here. This post is the LLM generation and bug bounty operator update plus the CrowdStrike IOC set.

C2 domains published by CrowdStrike: packages.storeartifact.com, registry.storageartifact.com, packages.storageartifact.com, npm.jpartifacts.com. C2 IP 54.173.15.59. Three SHA256 hashes below. npm.jpartifacts.com was used in November 2025 incidents.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | npm packages fetch PhantomRaven as an HTTP URL dependency then run preinstall |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Stealer runs in Node |
| Software Deployment Tools | T1072 | npm preinstall as the execution hook |
| Masquerading: Match Legitimate Name or Location | T1036.005 | Package names that look like transform or sort utilities |
| Unsecured Credentials: Credentials In Files | T1552.001 | Git and npm config identity collection |
| System Information Discovery | T1082 | OS, hostname, Node version, cwd, PID |
| Application Layer Protocol: Web Protocols | T1071.001 | HTTP GET and POST exfil |
| Exfiltration Over C2 Channel | T1041 | Same hosts used for RDD fetch and data theft |
| Develop Capabilities: Malware | T1587.001 | CrowdStrike: malware likely generated with an LLM |
| Acquire Infrastructure: Domains | T1583.001 | storeartifact, storageartifact, and jpartifacts hosts |

## IOCs

Display values are defanged. JSON feed stores clean values.

### Domains

```
packages.storeartifact[.]com
registry.storageartifact[.]com
packages.storageartifact[.]com
npm.jpartifacts[.]com
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"packages.storeartifact.com" OR "registry.storageartifact.com" OR "packages.storageartifact.com" OR "npm.jpartifacts.com" OR "54.173.15.59" OR "npm:transform-jsbi-to-bigint" OR "npm:sort-imports-es6-autofix"
```

### File Hashes

```
c31831d47fcbf52ff1f4e61838611916a4276d005a564e69946d5dac04235eed
95a7dcc6de46826b22c43bee7fc550f3b5e2e6cbc5f33b0c241faf523641cf63
db3fe46df0a65fe9f8c99d2e11126a032a72e9814e354ce017448ce088a01e02
```

### Package Indicators

```
npm:transform-jsbi-to-bigint
npm:sort-imports-es6-autofix
```

## Detection Recommendations

On npm and developer workstations, alert when package.json or lockfiles contain http:// or https:// dependency specifiers instead of registry names. On npm 12 or later, treat unexpected install-scripts approve prompts as a suspected RDD. Block and hunt DNS or TLS SNI for packages.storeartifact.com, registry.storageartifact.com, packages.storageartifact.com, and npm.jpartifacts.com. Alert on 54.173.15.59.

On CI, hunt Node processes that POST JSON containing GITHUB_ACTIONS, GITLAB_CI, JENKINS_URL, or CIRCLECI keys to unknown hosts, especially with the short User-Agent Mozilla/5.0 (Windows NT 10.0; Win64; x64). Inventory packages transform-jsbi-to-bigint and sort-imports-es6-autofix. Hash match the three SHA256 values. Do not denylist npmjs.com, GitHub, or ipify.

## References

- [CrowdStrike] PhantomRaven: An LLM-Generated Information Stealer Developed for Bug Bounty Hunting (2026-09-15): https://www.crowdstrike.com/en-us/blog/phantomraven-llm-generated-information-stealer-for-bug-bounty-hunting/
- [The Hacker News] Claimed Bug Bounty Hunter Likely Used LLM to Build PhantomRaven npm Stealer (2026-09-18): https://thehackernews.com/2026/09/claimed-bug-bounty-hunter-likely-used.html
