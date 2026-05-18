# OpenAI Confirms Two Employee Devices Compromised in Mini Shai-Hulud TanStack Supply Chain Attack — Code-Signing Certificates Rotated

**Date:** 2026-05-17
**Tags:** supply-chain, malware

## Executive Summary

OpenAI disclosed on May 14, 2026 that two employee devices were breached during the Mini Shai-Hulud Wave 5 TanStack supply chain attack, with the malware's credential-stealer accessing internal source code repositories and forcing rotation of all code-signing certificates for OpenAI's iOS, macOS, Windows, and Android applications. OpenAI found no evidence that customer data, production systems, or intellectual property were accessed; however, macOS desktop app users must update before June 12, 2026, when OpenAI will revoke the compromised certificates. This confirms TeamPCP's supply chain reach extends beyond developer credential theft to enterprise breach of a major AI vendor's signing infrastructure.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud Wave 5 (TeamPCP) — victim disclosure |
| Actor / Attribution | TeamPCP (high confidence; per OpenAI's incident response and prior attribution by StepSecurity, ReversingLabs) |
| Target | OpenAI employees running TanStack-dependent developer tooling; broader developer ecosystem consuming @tanstack/* packages |
| Vector | npm preinstall hook in compromised @tanstack/* packages; Bun-executed router_init.js credential stealer |
| Status | Active (malicious packages removed; OpenAI conducting certificate rotation) |
| First Observed | May 11, 2026 (TanStack compromise); May 14, 2026 (OpenAI breach confirmed) |

## Detailed Findings

### OpenAI Incident Disclosure

According to OpenAI's official incident response post, two employees had installed or run npm packages from the @tanstack namespace between May 11 and May 12, 2026, during the window when malicious package versions were live. OpenAI observed activity consistent with the malware's publicly described behavior, including unauthorized access and credential-focused exfiltration activity, in a limited subset of internal source code repositories to which the two impacted employees had access.

The Register reported that the accessed repositories included code-signing material: signing certificates for OpenAI products covering iOS, macOS, Windows, and Android applications. OpenAI has re-signed and is releasing all affected applications with new certificates. As a consequence of the certificate rotation, Apple's notarization process will block macOS applications signed with the previous certificate from launching or receiving updates after June 12, 2026; macOS users must update before that date. Windows and iOS users are not required to take action.

### Scope Confirmation

OpenAI stated it found no evidence that: customer data was accessed; production systems were affected; intellectual property was compromised; or deployed software was altered. TechCrunch reported that OpenAI classified this as a "limited" breach. The Hacker News noted that the breach nonetheless required rotations across four application platforms, indicating the compromised repositories contained broadly shared signing material.

### TeamPCP Campaign Context

Per The Register's analysis, this makes OpenAI the highest-profile named victim of the Mini Shai-Hulud Wave 5 campaign, which compromised 170+ npm and PyPI packages with a cumulative download count exceeding 518 million. BleepingComputer reported that the attack "initially targeted packages from TanStack and Mistral AI before spreading to other projects," and that OpenAI's use of TanStack in its internal developer tooling placed employees in the direct blast radius.

The credential-exfiltration malware behavior documented in the OpenAI incident — unauthorized access to code repositories, credential harvesting from developer environments — is consistent with the mini Shai-Hulud payload behavior described by StepSecurity and Phoenix Security: a Bun-executed router_init.js sweeping GitHub tokens, cloud credentials, and signing keys from developer machines, with results exfiltrated via the typosquat domain `git-tanstack.com`, Session messenger, and GitHub API dead drops.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Dependencies and Development Tools | T1195.001 | @tanstack/* npm packages used in OpenAI internal tooling triggered malware on employee devices |
| Credentials In Files | T1552.001 | Malware harvested code-signing material and internal repository tokens from compromised employee developer environments |
| Exfiltration Over C2 Channel | T1041 | Stolen credentials exfiltrated via git-tanstack.com, Session messenger, and GitHub API dead drops |
| Valid Accounts | T1078 | Stolen employee tokens provided authenticated access to internal OpenAI source code repositories |
| Steal Application Access Token | T1528 | Code-signing certificates for iOS, macOS, Windows, and Android apps accessed; full certificate rotation required |

## IOCs

### Domains

```
git-tanstack.com
api.masscan.cloud
filev2.getsession.org
```

*(See 2026-05-16-mini-shai-hulud-tanstack-mistral-ai-teampcp-may-2026 for full IOC list)*

### Full URL Paths

```
git-tanstack.com/tmp/transformers.pyz
83.142.209.194
```

### Splunk Format

```
"git-tanstack.com" OR "api.masscan.cloud" OR "filev2.getsession.org" OR "83.142.209.194"
```

### File Hashes

```
No new file hash IOCs published by OpenAI as of 2026-05-17
```

## Detection Recommendations

**macOS update urgency:** All macOS users of OpenAI desktop applications must update before June 12, 2026 to avoid certificate revocation blocking app launches. Apply immediately.

**Developer machine audit:** Any developer who ran npm install within a project consuming `@tanstack/*` packages between May 11–12, 2026 should treat their entire developer environment as compromised: rotate GitHub tokens, npm tokens, cloud credentials, code-signing certificates, and any secrets accessible from that machine.

**Repository access audit:** Organizations should check GitHub audit logs for any repository access that originated from developer machines during May 11–12, 2026 using tokens that have since been rotated. Unusual access patterns to repositories containing signing material or CI secrets should be treated as indicators of compromise.

**CI/CD pipeline integrity check:** Verify that no code-signing workflows executed using keys that may have been exfiltrated during the exposure window. Any artifacts signed between May 11–12, 2026 by potentially compromised signing identities should be re-examined.

**Network detection:** Alert on outbound connections to `git-tanstack.com`, `api.masscan.cloud`, and `filev2.getsession.org` from developer machines or CI runners.

## References

- [OpenAI] Our response to the TanStack npm supply chain attack (2026-05-14) — https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/
- [BleepingComputer] OpenAI confirms security breach in TanStack supply chain attack (2026-05-15) — https://www.bleepingcomputer.com/news/security/openai-confirms-security-breach-in-tanstack-supply-chain-attack/
- [The Register] OpenAI caught in TanStack npm supply chain chaos after employee devices compromised (2026-05-15) — https://www.theregister.com/security/2026/05/15/openai-caught-in-tanstack-npm-supply-chain-chaos-after-employee-devices-compromised/5241019
- [SecurityWeek] OpenAI Hit by TanStack Supply Chain Attack (2026-05-14) — https://www.securityweek.com/openai-hit-by-tanstack-supply-chain-attack/
- [The Hacker News] TanStack Supply Chain Attack Hits Two OpenAI Employee Devices, Forces macOS Updates (2026-05-15) — https://thehackernews.com/2026/05/tanstack-supply-chain-attack-hits-two.html
- [TechCrunch] OpenAI says hackers stole some data after latest code security issue (2026-05-14) — https://techcrunch.com/2026/05/14/openai-says-hackers-stole-some-data-after-latest-code-security-issue/
