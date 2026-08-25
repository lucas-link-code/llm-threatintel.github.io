# GTIG: UNC7005 Deploys LLM-Generated CHERRYPIE Infostealer in Russia-Nexus Auth Phishing

**Date:** 2026-08-25
**Tags:** apt, nation-state, phishing, malware

## Executive Summary

Google Threat Intelligence Group reported on 2026-08-20 that suspected Russia-nexus cluster UNC7005, also tracked as STORM-2945, is running app-password, device-code, WhatsApp linking, and Google OAuth phishing against academia, diplomatic, and nonprofit targets, and that its CHERRYPIE PowerShell infostealer contains artifacts consistent with LLM generation. GTIG assesses with high confidence a Russian nexus for UNC7005, UNC6293, and UNC5976, and with moderate confidence that UNC7005 and UNC6293 relate to an ICE RELIC initial-access subcluster. Hunt the UNC7005 domains and CHERRYPIE hashes below, and treat personal Gmail and WhatsApp linking prompts as in-scope even when corporate mail is quiet.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | UNC7005 authentication-flow phishing with CHERRYPIE, VIDAR, ATOMIC, and ENGINELIGHT |
| Actor / Attribution | UNC7005, alias STORM-2945. GTIG: Russian nexus, confidence high; ICE RELIC initial-access link, confidence moderate |
| Target | Academia, diplomatic, and nonprofit personnel in Ukraine, Western Europe, and the United States; European defense-industry targets in August 2026 FOC-themed OAuth |
| Vector | App-password phishing, Microsoft and WhatsApp device-code and device-linking, Google OAuth via unverified cloud projects, MaaS infostealers, LLM-generated PowerShell |
| Status | Active. GTIG described OAuth phishing from early August 2026 and FOC-themed mail between 2026-08-06 and 2026-08-13 |
| First Observed | UNC7005 identified February 2026; CHERRYPIE hashes published 2026-08-20 |

## Detailed Findings

According to GTIG's 2026-08-20 report, three suspected Russian clusters abuse legitimate authentication flows rather than relying only on malware. UNC7005 is the cluster that combines those flows with malware. GTIG tracks it separately from UNC6293 because of lower sophistication, weaker OPSEC, different infrastructure, and malware use.

GTIG reported UNC7005 app-password phishing since at least February 2026, with per-target password names tied to the lure theme. Device-code phishing reused embassy-invite templates against GLOBSEC-themed sites in May 2026, including fingerprinting and headless-browser checks. In May and June 2026, GTIG said UNC7005 spoofed WhatsApp to induce device linking, then offered a fake voice call that recorded microphone and camera and posted the recording to /api/code/<session>/recording.

In late May 2026, GTIG reported a broader wave against mostly U.S. academics, diplomats, and Russia-focused researchers. Windows visitors received VIDAR with C2 107.189.18.7. macOS visitors received ATOMIC. GTIG also tied statistic-ms.live to ENGINELIGHT C2 and to earlier Microsoft-themed domains later reused in hospitality captive-portal redirects that ReliaQuest and Microsoft had described.

The GenAI finding is CHERRYPIE, also called ChocoShell. GTIG reported that samples contain prolific function comments naming an infostealer and noting function offsets, which GTIG treats as LLM-generation artifacts. GTIG suspects CHERRYPIE may be a customized MaaS infostealer because UNC7005 already buys VIDAR and ATOMIC and because collection targets overlap. That MaaS origin is assessed, not confirmed.

GTIG reported that in early August 2026 UNC7005 began Google OAuth phishing from cloud projects, registering Finnish Operations Center spoofs from 2026-07-31 and mailing European defense-industry targets from 2026-08-06 through 2026-08-13. Successful Google sign-in redirected to an unverified testing-mode cloud project used to steal tokens. TechNadu and SecurityAffairs summarized the same GTIG report.

UNC5976 and UNC6293 are sibling clusters in the same GTIG article. They are authentication-focused and are not the LLM-malware story; their IOCs are omitted here except as context that GTIG grouped the three clusters.

Do not add google.com, accounts.google.com, whatsapp.com, or globsec.org as indicators. globsec.net is the attacker domain GTIG listed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | UNC7005 sends conference, embassy, WhatsApp, and FOC-themed lures that abuse real auth flows. |
| Steal Application Access Token | T1528 | Google OAuth redirects into unverified cloud projects collect tokens after a legitimate login. |
| Command and Scripting Interpreter: PowerShell | T1059.001 | CHERRYPIE is a PowerShell infostealer GTIG associates with LLM-authored code. |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | GTIG cites LLM artifacts in CHERRYPIE and says MaaS plus LLMs shorten tooling time. |
| Steal Web Session Cookie | T1539 | CHERRYPIE is a PowerShell infostealer GTIG ties to UNC7005; TechNadu's summary of that report describes cookie, password, and M365 SSO theft. |
| Audio Capture | T1123 | Post-WhatsApp-link fake calls record microphone and camera then upload the recording. |

## IOCs

### Domains

```
chamber-ua[.]org
wa-connect[.]eu
wa-connect[.]net
wa-invite[.]com
wa-device[.]com
wa-meeting[.]com
shopinvite[.]org
my-invite[.]org
globsec[.]net
statistic-ms[.]live
owa-ms365[.]com
m365-owa[.]com
ms365-device[.]com
ms365-live[.]com
finishoperations[.]com
finishoperations[.]org
foc-share[.]com
share-foc[.]com
internal-share[.]com
foc-share[.]org
fewfwfwfwfwf[.]info
miov2iaiaoubqosiqoiajwowiwjso[.]online
mioisiskwowiwjowuwjwolab[.]club
```

### Full URL Paths

```
No URL IOCs published by source
```

GTIG described /api/code/<session>/recording and /fingerprint on attacker sites. Those paths are relative to rotating hosts and are not published here as standalone URL IOCs.

### Splunk Format

```
"chamber-ua.org" OR "wa-connect.eu" OR "wa-connect.net" OR "wa-invite.com" OR "wa-device.com" OR "wa-meeting.com" OR "shopinvite.org" OR "my-invite.org" OR "globsec.net" OR "statistic-ms.live" OR "owa-ms365.com" OR "m365-owa.com" OR "ms365-device.com" OR "ms365-live.com" OR "finishoperations.com" OR "finishoperations.org" OR "foc-share.com" OR "share-foc.com" OR "internal-share.com" OR "foc-share.org" OR "107.189.18.7" OR "196.251.107.171" OR "31.57.243.154" OR "38.146.28.75" OR "104.194.159.150"
```

### File Hashes

```
403b624e35777cbc07dbe66398b21bba70396a20b859c880732338ce1dd1f41f
28f622028e690c943f7fa9aca426c07cab52b5aaba757ef8a3328609c0b3bec3
be99857449d2856dd5a84e21c8a3d5e0e01456adb44062ddec5a6b4970d8d42c
1e3ee845fde739fcd3ca9ce62c7f142a7c501d11db4c4fb294d4939f12d0f916
6f7090895c1c3dee30de6b3f098ca3a788dc198646e5293a8b1210430b0add97
20e20b074967ed6f6e04d609ccec5ff7492665ef25f894c90c2ddc92fa47ac38
ca3be5885afb3eb3bb19341e2653212200c568f3f900e0b2f04de9ba209aed25
1d9299799a7b8da67c44ebec064d64542c27645f8e84de4a22ca3f6cbc843e3c
c5826032207d623a7f6caec8465af7364eccc355f9a48897da2a54f3e4420265
125752ad7c20d715920a3b2fb0fdde660f07b3f2b053665cf38c2d6d9de86e1e
5b8d50c2e8cc3038b7c6e6dbf1219f6e814930a1e3c0053143a1191ae67f8ffc
a06a8fd1b6fa1924199a4540cf16d089217ce8f78c617739946f145fd1fc88c1
```

## Detection Recommendations

In email and web proxy logs, alert on the UNC7005 domains above, especially globsec.net versus the legitimate globsec.org, FOC-themed finishoperations and foc-share hosts, and Microsoft-lookalike owa-ms365.com, m365-owa.com, ms365-device.com, and ms365-live.com.

On endpoints, hunt PowerShell with verbose infostealer-style comments and offset notes, VIDAR and ATOMIC hashes above, and ENGINELIGHT hash 125752ad7c20d715920a3b2fb0fdde660f07b3f2b053665cf38c2d6d9de86e1e. Alert on Chrome cookie theft that touches app-bound encryption artifacts.

In identity logs, alert on new app passwords, Microsoft device-code grants, WhatsApp linked-device additions, and OAuth grants to unverified testing-mode Google Cloud projects after FOC, embassy, or conference lures. GTIG notes many targets are personal accounts, so enterprise mail filtering alone will miss the campaign.

Network: alert on 107.189.18.7, 196.251.107.171, 31.57.243.154, 38.146.28.75, and 104.194.159.150.

## References

- [Google Threat Intelligence Group] Going with the Flow(s): Distinct Clusters Target Individuals of Interest to Russia (2026-08-20) — https://cloud.google.com/blog/topics/threat-intelligence/distinct-clusters-target-individuals-of-interest-to-russia
- [SecurityAffairs] Fake Conferences, OAuth and WhatsApp: Inside Russia's New Espionage Tactics (2026-08-20) — https://securityaffairs.com/197630/apt/fake-conferences-oauth-and-whatsapp-inside-russias-new-espionage-tactics.html
- [TechNadu] GTIG Tracks Three Russian Espionage Clusters Abusing Auth Flows (2026-08-20) — https://www.technadu.com/suspected-russian-hackers-are-weaponizing-app-passwords-oauth-logins-and-even-whatsapps-own-linking-feature-to-deliver-vidar-malware-and-more/633625/
