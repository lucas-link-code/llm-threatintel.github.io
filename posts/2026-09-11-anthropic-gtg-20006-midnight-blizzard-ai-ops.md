# Anthropic: GTG-20006 Used Claude to Rebuild Implant Tooling After Detections; Overlap With UNC7005 Infrastructure

**Date:** 2026-09-11
**Tags:** nation-state, apt, phishing, malware, llmjacking

## Executive Summary

Anthropic published on 2026-09-10 that GTG-20006 ran AI driven workflows covering recon, phishing, implant rebuilds, and mailbox theft against more than 20 government, diplomatic, defense, and drone supply organizations, mostly in Ukraine and Europe. Anthropic said its attribution is consistent with public reporting that links the actor to Midnight Blizzard. Many of the domains and hashes Anthropic listed were previously published by Google Threat Intelligence Group as UNC7005 / STORM-2945 infrastructure. Hunt the new Anthropic indicators that are not already in this feed, and treat overlapping hosts as shared or contested rather than a clean rename.

## Campaign Summary

| Field               | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Campaign / Malware  | GTG-20006 AI orchestrated espionage; implants PowerChrome, WUEngine, Shadow C2, MiniPlasma, CloudSyncSvc; Android GiftDrop; iOS DarkSword. Parallel GTG-50014 ShinyHunters smash and grab                                                                                                                                                                                                                                                                                    |
| Actor / Attribution | GTG-20006. Anthropic: consistent with public Midnight Blizzard reporting; operator handle JackPoterz; Russian speaker; tradecraft consistent with Russian state nexus espionage. Confidence medium for a Midnight Blizzard identity because Anthropic did not present independent overlap evidence in the report, and GTIG previously assigned much of the same infrastructure to UNC7005 with a high confidence Russian nexus. GTG-50014: suspected ShinyHunters affiliates |
| Target              | Ukrainian and European government, military, diplomatic, think tank, and defense industrial orgs; drone makers; hotel WiFi guests; a North African government technology authority                                                                                                                                                                                                                                                                                           |
| Vector              | Device code phishing branded Embassy Kit; hotel DNS hijack then ClickFix; WhatsApp companion device takeover; AI rebuilt Windows stealers                                                                                                                                                                                                                                                                                                                                    |
| Status              | Anthropic said it disrupted the Claude misuse, banned accounts, and notified partners. Underlying actor status not claimed as dismantled                                                                                                                                                                                                                                                                                                                                     |
| First Observed      | Cases in the report run December 2025 through August 2026. Report published 2026-09-10                                                                                                                                                                                                                                                                                                                                                                                       |

## Detailed Findings

According to [Anthropic](https://www.anthropic.com/threat-intelligence-report-september-2026), GTG-20006 automated development, infrastructure acquisition, phishing, C2 persistence, and exfiltration through customized Claude workflows. Humans mainly edited Claude Code skills when the workflow needed a change. [The Register](https://www.theregister.com/ai-and-ml/2026/09/10/latest-anthropic-horror-story-chills-with-tales-of-kamikaze-drone-swarms-and-bioweapons-research/5295702) reported the same GTG-20006 case and identified Midnight Blizzard, APT29, and Cozy Bear as the public names Anthropic's linkage points at. Anthropic's own wording is narrower: consistent with public Midnight Blizzard reporting, not a standalone high confidence SVR attribution.

Anthropic said GTG-20006 used AI agents to watch whether security products flagged its implants. When a product caught a sample, agents modified and rebuilt the malware until it was undetected, then staged it on disposable hosts for phishing, ClickFix, and DNS hijack delivery. Anthropic described that loop as inverting defender cost: a new signature no longer buys lasting delay.

Anthropic said the actor scanned mail and remote access systems at more than two dozen Ukrainian government organizations, bulk exported mailboxes of at least two drone component manufacturers, and stole a drone vision SDK, including an unannounced product. It compromised at least three hospitality vendors, changed guest WiFi DNS to actor services, then served ClickFix lures for Windows, Android, and iOS malware. Anthropic noted Microsoft's July 2026 CaptiveCrunch write up as the public name for that hotel portal method. The actor also linked WhatsApp accounts as companion devices via WPPConnect, suppressed read receipts, and exported Russian and Ukrainian chats, including at least two former high level Ukrainian officials.

Anthropic said the same actor stole VPN credentials at a North African government technology authority, took over the central account server, and exfiltrated more than 300,000 national identity records plus commercial registry data for more than half a million companies. A cloud email platform using Embassy Kit for device code phishing produced mailbox theft from at least eight organizations, including a national prosecutor office and a military education institute.

### Infrastructure overlap with UNC7005

This feed already published many of Anthropic's GTG-20006 domains, IPs, and one SHA256 under GTIG's UNC7005 / STORM-2945 CHERRYPIE reporting from 2026-08-20. Overlap includes ms365-live.com, m365-owa.com, owa-ms365.com, ms365-device.com, my-invite.org, chamber-ua.org, statistic-ms.live, wa-connect.eu, wa-meeting.com, 31.57.243.154, 38.146.28.75, and hash be99857449d2856dd5a84e21c8a3d5e0e01456adb44062ddec5a6b4970d8d42c.

GTIG assessed UNC7005 as Russia nexus with high confidence and as STORM-2945 per Microsoft. Anthropic now places a matching IOC set under GTG-20006 and points at Midnight Blizzard public reporting. Those positions are not reconciled in either paper. Treat the infrastructure as Russia nexus and contested at the group name layer. Do not merge UNC7005 into Midnight Blizzard in detections without additional vendor overlap.

New Anthropic indicators not already in this feed are listed in the IOC blocks.

### GTG-50014 ShinyHunters

Anthropic also disrupted suspected ShinyHunters affiliates tracked as GTG-50014. One French speaking operator using handles MeowSHA, frkoo, and blazespider ran ten AWS EC2 workers that downloaded 1.8 million Android APKs, decompiled them, and scanned for secrets with TruffleHog, feeding verified hits to Telegram. Stolen AI API keys from victim environments were reused for about three weeks against other targets. Anthropic said Anthropic's own systems were not compromised; the keys came from customer environments. Affiliates used Claude for SaaS supply chain theft, including a session store dump of more than 2,100 Azure AD token sets across more than 40 tenants in about 34 hours. Anthropic published policenationale.cc as branding for a carding shop, not as a phishing lure. That apex impersonates a government brand; this feed records the autoshop hostname path in prose only: autoshop.policenationale.cc. Anthropic published no additional GTG-50014 network IOCs beyond that domain pattern.

Anthropic stated that Claude Haiku, Sonnet, and Opus were the models used in the cyber cases, and that Claude Fable and Mythos were not used for the malicious cyber activity. The report also covers influence, surveillance, scams, distillation, and other harm categories outside this feed's cyber IOC scope.

## MITRE ATT&CK Mapping

| Technique                                     | ID        | Context                                                             |
| --------------------------------------------- | --------- | ------------------------------------------------------------------- |
| Phishing                                      | T1566     | Device code and embassy themed mail via Embassy Kit                 |
| Steal Application Access Token                | T1528     | Microsoft 365 device code phishing and Azure AD session store theft |
| Drive-by Compromise                           | T1189     | Hotel captive portal DNS hijack then ClickFix                       |
| Command and Scripting Interpreter: PowerShell | T1059.001 | Windows stealers and rebuild loop                                   |
| Impair Defenses                               | T1562     | Security update freeze so new signatures never arrive               |
| Application Layer Protocol: Web Protocols     | T1071.001 | Disposable staging hosts and WhatsApp companion linking             |
| Obtain Capabilities: Artificial Intelligence  | T1588.007 | Claude workflows rebuilt implants after product detections          |

## IOCs

Display values are defanged. JSON feed stores clean values. Overlapping UNC7005 indicators stay in prose above and are not repeated here.

### Domains

```
teams.ms365-live[.]com
mslivetest.duckdns[.]org
chathamhouse[.]eu
ukrinform-share[.]net
static-ms[.]live
ad-g[.]org
docs-viewer[.]org
mygreatmarket[.]org
mygreatmarket[.]com
cdncounter[.]net
static.cdncounter[.]net
stuseamandesilt[.]org
api.stuseamandesilt[.]org
cdn.stuseamandesilt[.]org
update.stuseamandesilt[.]org
itechx[.]tel
pdfviewer2024.b-cdn[.]net
meridian-protocol[.]org
meridiangroup-corp[.]com
projectnightcrawler[.]dev
metricwave[.]org
mgsend[.]org
russianearabroad[.]com
russianearabroad[.]org
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"teams.ms365-live.com" OR "mslivetest.duckdns.org" OR "chathamhouse.eu" OR "ukrinform-share.net" OR "static-ms.live" OR "ad-g.org" OR "docs-viewer.org" OR "mygreatmarket.org" OR "mygreatmarket.com" OR "cdncounter.net" OR "static.cdncounter.net" OR "stuseamandesilt.org" OR "api.stuseamandesilt.org" OR "itechx.tel" OR "pdfviewer2024.b-cdn.net" OR "meridian-protocol.org" OR "meridiangroup-corp.com" OR "projectnightcrawler.dev" OR "metricwave.org" OR "mgsend.org" OR "russianearabroad.com" OR "russianearabroad.org" OR "104.145.210.184" OR "104.194.151.133" OR "104.194.159.55" OR "144.172.114.192" OR "213.145.86.112" OR "2.26.53.194" OR "148.135.195.111" OR "185.198.234.26" OR "185.198.234.101" OR "149.54.42.106" OR "104.194.149.228" OR "38.146.28.132" OR "918fa52ae45ed60ba7cc8bdc99c3cbe9ab92e0375ec31fc05d0d4513be11c593"
```

### IP Addresses

```
104.145.210[.]184
104.194.151[.]133
104.194.159[.]55
144.172.114[.]192
213.145.86[.]112
2.26.53[.]194
148.135.195[.]111
185.198.234[.]26
185.198.234[.]101
149.54.42[.]106
104.194.149[.]228
38.146.28[.]132
```

### File Hashes

```
918fa52ae45ed60ba7cc8bdc99c3cbe9ab92e0375ec31fc05d0d4513be11c593
```

## Detection Recommendations

Correlate device code Microsoft 365 sign ins with first seen domains matching ms365, owa, embassy, or invite themes, including hosts already tagged UNC7005. Hunt hotel and captive portal DNS changes that point guest traffic at actor nameservers, then ClickFix lures. Alert on WhatsApp companion device linking from headless browser farms and on WPPConnect style bulk chat export. On endpoints, hunt the implant names Anthropic listed as Windows families PowerChrome, WUEngine, Shadow C2, MiniPlasma, and CloudSyncSvc, and treat rapid rebuilds after an EDR block as the AI retooling loop. For GTG-50014, hunt TruffleHog against mass APK or GitHub PAT harvesting from new EC2 fleets, and stolen provider keys reused from unusual geos.

## References

- [Anthropic] Detecting and countering misuse of AI: September 2026 (2026-09-10): https://www.anthropic.com/threat-intelligence-report-september-2026
- [The Register] Latest Anthropic horror story chills with tales of kamikaze drone swarms and bioweapons research (2026-09-10): https://www.theregister.com/ai-and-ml/2026/09/10/latest-anthropic-horror-story-chills-with-tales-of-kamikaze-drone-swarms-and-bioweapons-research/5295702
- [Google Threat Intelligence Group] Going with the Flow(s): Distinct Clusters Target Individuals of Interest to Russia (2026-08-20): https://cloud.google.com/blog/topics/threat-intelligence/distinct-clusters-target-individuals-of-interest-to-russia
