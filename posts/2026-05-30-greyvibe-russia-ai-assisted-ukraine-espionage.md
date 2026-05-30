# GreyVibe: Russia-Nexus Cluster Uses ChatGPT, Gemini, and Ideogram AI Across Five Ukraine-Focused Campaigns to Build Lures, Obfuscators, and the LegionRelay RAT

**Date:** 2026-05-30
**Tags:** nation-state, apt, malware, phishing

## Executive Summary

WithSecure on May 28, 2026 disclosed GreyVibe (stylised GREYVIBE), a Russia-nexus threat cluster active since at least August 2025 that uses generative AI across the full intrusion lifecycle to target Ukrainian and Ukraine-related military, government, civilian, and business organisations. WithSecure assesses with moderate confidence that GreyVibe used ChatGPT, Google Gemini, and Ideogram AI to generate phishing lures and fake-site imagery, build the LOOKVALJS, LOOKVALPS, DAYLIGHT, and TEASOUP obfuscators and loaders, develop the LegionRelay PowerShell RAT and its backend, and produce post-compromise commands. Defenders should block the published C2 and lure infrastructure, hunt for the PhantomRelay and LegionRelay PowerShell RAT artifacts and scheduled tasks, and treat the FallSpy Android spyware indicators as active mobile surveillance threats.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GreyVibe (GREYVIBE); PhantomMail, PhantomClick, PrincessClub, DroneLink, Nebo campaigns; PhantomRelay (V1/V2/Lite) and LegionRelay PowerShell RATs; FallSpy Android spyware |
| Actor / Attribution | Russia-nexus, state-aligned interests (confidence: moderate, per WithSecure). Tooling overlaps with the TrickBot gang and UAC-0098. WithSecure notes the group lacks the operational discipline of a mature nation-state actor |
| Target | Ukrainian and Ukraine-related organisations: military, government, civilian, and business sectors; confirmed victims include Ukrainian combatants in Kharkiv |
| Vector | Spearphishing links (Google Drive, 4sync), fake CAPTCHA / ClickFix pages, fake Ukrainian adult-club websites, fake military-charity sites, fake Russian military login pages, Telegram personas, Microsoft Teams vishing |
| Status | active |
| First Observed | 2025-08 (FallSpy first observed); WithSecure discovered the activity in January 2026 and published May 28, 2026 |

## Detailed Findings

According to WithSecure, GreyVibe is distinguished less by technical sophistication than by the breadth of generative AI woven through its operations. WithSecure assesses with moderate confidence that the group used large language models and image generators for four classes of work: lure development, including the images used in the PrincessClub campaign and the fake-site content for PrincessClub and PhantomClick; resource development, including the LOOKVALJS, LOOKVALPS, DAYLIGHT, and TEASOUP obfuscation and loader scripts, full-stack development of the LegionRelay RAT, and backend infrastructure setup; and post-compromise activity, including the generation of commands, scripts, and tooling delivered through PhantomRelay and LegionRelay. WithSecure states that LegionRelay and the backend serving it show the strongest indicators of AI generation, and that the platforms used include Ideogram AI, ChatGPT, and Google Gemini.

According to WithSecure, design flaws in LegionRelay, a custom RAT WithSecure assesses was likely LLM-developed, exposed a limited subset of the malware's backend functionality. That exposure gave WithSecure extended research visibility into GreyVibe victimology, actions on objectives, and post-compromise tooling over an extended period. WithSecure deliberately omitted sensitive victim details from its public reporting.

### Five Campaigns

According to WithSecure and SecurityAffairs, WithSecure documented five distinct attack chains, each with its own lure and payload.

PhantomMail uses spearphishing emails carrying links to malicious ZIP and RAR archives hosted on Google Drive and the file-sharing service 4sync. The archives contain Python and JavaScript loaders that deliver PhantomRelay. Spearphishing activity ran from at least December 2025 through April 2026 using Gmail sender addresses impersonating Ukrainian government and emergency-service entities, with Ukrainian-language lure filenames referencing inspection acts and cyber-defence conference materials.

PhantomClick uses fake CAPTCHA pages impersonating Zoom and the Latvian Platform for Development Cooperation (LAPAS), styled as ClickFix attacks. According to WithSecure, the pages present a fake Cloudflare verification pretext and trick victims into running a command that initiates a PhantomRelay infection chain in the background while a decoy is shown.

PrincessClub is a persistent campaign using fake Ukrainian adult-club websites to deliver FallSpy on Android and PhantomRelayV1 or LegionRelay on Windows. According to WithSecure, confirmed victims included Ukrainian combatants, many located in Kharkiv. Operators used fake female Telegram personas, including via local dating channels, to build trust before directing victims to the lure sites. Later iterations added a WebRTC-based live-call feature, accessible only after infection, capable of capturing victim audio and video, which WithSecure assesses turns the lure into a potential human intelligence collection mechanism.

DroneLink uses websites posing as charitable foundations supporting the Ukrainian military with FPV drones and UAVs to deliver WireGuard VPN software alongside the lightweight LegionRelay RAT. Nebo uses a FallSpy sample designed to mimic a Russian military login screen, apparently to convince Ukrainian military personnel they are accessing a Russian terminal.

### Malware

According to BleepingComputer and CSO Online, PhantomRelay is a PowerShell RAT supporting system fingerprinting, dynamic script loading, and PowerShell and Windows command execution. WithSecure tracks three variants: PhantomRelayLite, PhantomRelayV1, and PhantomRelayV2, distinguished by obfuscation, persistence artifacts, and C2 infrastructure. PhantomRelay variants also appeared in a Microsoft Teams voice-phishing intrusion set and a separate KongTuke (ClickFix) delivery chain between February and March 2026 that WithSecure could not definitively tie to the Ukraine targeting.

According to WithSecure and CSO Online, LegionRelay is a lightweight PowerShell RAT that communicates with its C2 over REST API methods and supports file enumeration, file exfiltration, screenshot capture, browser credential theft, Telegram and WhatsApp data exfiltration, and RDP access setup. It uses a Telegram channel as a dead-drop resolver for C2 addressing.

According to WithSecure, FallSpy is an Android spyware family first observed in August 2025 across the PrincessClub and Nebo campaigns. It presents decoy content while covertly collecting contacts, call logs, installed-application lists, SIM-linked phone numbers, device and network information, Wi-Fi SSID, last-known location, public IP, and media files.

### Attribution

According to SecurityAffairs and CSO Online, WithSecure identified connections between GreyVibe tooling and both the TrickBot gang and UAC-0098, a group previously linked to Russian cybercriminal networks. WithSecure assesses the activity is consistent with Russian intelligence-gathering interests but states the actor lacked the sophistication and operational discipline typically associated with mature nation-state actors. WithSecure notes that GreyVibe's extensive, frequent AI-driven changes to tooling and lures likely help the group compensate for capability gaps, accelerate development cycles, and reduce historical backlinks to prior activity, which WithSecure expects will increase the difficulty of continuous detection, tracking, and attribution.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Obtain Capabilities: Artificial Intelligence | T1588.007 | ChatGPT, Google Gemini, and Ideogram AI used to generate lures, fake-site imagery, obfuscators, and loaders |
| Develop Capabilities: Malware | T1587.001 | LLM-assisted full-stack development of the LegionRelay RAT and supporting backend |
| Phishing: Spearphishing Link | T1566.002 | PhantomMail emails linking to ZIP/RAR archives on Google Drive and 4sync |
| Drive-by Compromise | T1189 | PrincessClub adult-club sites and DroneLink charity sites delivering malware |
| User Execution: Malicious File | T1204.002 | PhantomClick fake CAPTCHA/ClickFix pages trick victims into running infection commands |
| Command and Scripting Interpreter: PowerShell | T1059.001 | PhantomRelay and LegionRelay are PowerShell RATs |
| Command and Scripting Interpreter: JavaScript | T1059.007 | LOOKVALJS and TEASOUP JavaScript loaders |
| Obfuscated Files or Information | T1027 | DAYLIGHT obfuscator applied to PhantomRelay and LegionRelay scripts |
| Scheduled Task/Job: Scheduled Task | T1053.005 | Persistence via scheduled tasks including "Adobe working", "System Health Service", and "Razer Synapse Service Helper" |
| Web Service: Dead Drop Resolver | T1102.001 | LegionRelay resolves C2 addressing via a Telegram channel |
| Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | LegionRelay browser credential theft |
| Replication Through Removable Media | T1091 | PhantomRelayV1 USB propagation script (WUDFHost.ps1) |
| Application Layer Protocol: Web Protocols | T1071.001 | PhantomRelay and LegionRelay C2 over REST/HTTP |

## IOCs

### Domains

```
lapas.live
zoomconference.click
zoomconference.app
strip-mens.tilda.ws
princess-mens.fun
princess-mens-club.com
princess-mens.click
princessclub.click
princessclub.best
princessclub.online
princessclub.cyou
clubprincess.click
frontforce.org
ukrguard.org
ukrbezpeka.online
ironbrave.online
ukrvarta.online
edbo.linkpc.net
edbo.publicvm.com
edbo.work.gd
dsszzi.linkpc.net
declaration.linkpc.net
goodhillsenterprise.com
ny-car-dealership.it.com
doct0rsim.com
routinesyscheckup.com
serotoninenterprise.com
newstarcommunity.com
jackscommunications.com
fasterscommunications.com
bsnowcommunications.com
highfleetenterprise.com
flyskyenterprise.com
newsolutionsxsenterprise.icu
neuromancersolutionsenterprise.icu
nycpartnersenterprise.com
chiselworksenterprise.com
newrentalsenterprise.com
bluelagoonaenterprise.com
heltaskeltahenterprise.com
newequipmentsolutions.com
j4jobspk.com
aerobionix.com
prosearium.net
saidozdemir.com
tucsonanimalallergy.com
halungroup.com
khanvas.com
maxolutions243.com
thirdmetrics.com
resutato.com
red-viper.com
emballeplus.com
meadowsantiques.com
seahorsemethod.com
intrawld.com
emovietheater.com
robotic-toys.com
kentfiresafe.com
artsselection.com
zeftasarim.com
xpertlearninghub.com
```

### Full URL Paths

```
t.me/s/sdgsersergser
```

### Splunk Format

```
"lapas.live" OR "zoomconference.click" OR "zoomconference.app" OR "strip-mens.tilda.ws" OR "princess-mens.fun" OR "princess-mens-club.com" OR "princess-mens.click" OR "princessclub.click" OR "princessclub.best" OR "princessclub.online" OR "princessclub.cyou" OR "clubprincess.click" OR "frontforce.org" OR "ukrguard.org" OR "ukrbezpeka.online" OR "ironbrave.online" OR "ukrvarta.online" OR "edbo.linkpc.net" OR "edbo.publicvm.com" OR "edbo.work.gd" OR "dsszzi.linkpc.net" OR "declaration.linkpc.net" OR "goodhillsenterprise.com" OR "ny-car-dealership.it.com" OR "doct0rsim.com" OR "routinesyscheckup.com" OR "serotoninenterprise.com" OR "newstarcommunity.com" OR "jackscommunications.com" OR "fasterscommunications.com" OR "bsnowcommunications.com" OR "highfleetenterprise.com" OR "flyskyenterprise.com" OR "newsolutionsxsenterprise.icu" OR "neuromancersolutionsenterprise.icu" OR "nycpartnersenterprise.com" OR "chiselworksenterprise.com" OR "newrentalsenterprise.com" OR "bluelagoonaenterprise.com" OR "heltaskeltahenterprise.com" OR "newequipmentsolutions.com" OR "j4jobspk.com" OR "aerobionix.com" OR "prosearium.net" OR "saidozdemir.com" OR "tucsonanimalallergy.com" OR "halungroup.com" OR "khanvas.com" OR "maxolutions243.com" OR "thirdmetrics.com" OR "resutato.com" OR "red-viper.com" OR "emballeplus.com" OR "meadowsantiques.com" OR "seahorsemethod.com" OR "intrawld.com" OR "emovietheater.com" OR "robotic-toys.com" OR "kentfiresafe.com" OR "artsselection.com" OR "zeftasarim.com" OR "xpertlearninghub.com" OR "t.me/s/sdgsersergser"
```

### File Hashes

```
920e8a8e06a1559ba0b4a1be5f6c290ed8e305fd130675ceadc655c79c1cb369
db05db462a0e8ba40c656dd0b8bd11f6fdc85895b54904df1dc83bb0609e2ff2
286de17c2e8017241bee12b0935ed5e1e5d5216f4311be781ca1a69ad81188b3
ee144c883784c635ef84e0ae6a12b03553c1fd65646621f22d08511bd3e6d42a
03beb07ce116a2a69f360dd3fab8c3aa55bb42ce580d43f1924642874e388efe
c716dabe228f89e58835d2c93dbaa5719dc77f62c9e84f3e3d54ef82ded621e1
d814564ab8b905c3b9b7a42e757228d9d30f8ffd4fa6b3c48f4aa7e2b1e44594
b0c07b265c9d9046038ffa48d5b8e17b8ba0791503beba85196cdbe0ac2fcb27
63047083db26ec6a8aa2d0d008ca4c067855a952a89f9e3e878b2215e26841cf
ee87fae14e3cc64d894f0a677af8832f8669f11853374c18b7110df1fc52f4e5
cbaf6cdb2acbd293d7e58cabe41449027a28b84223ba88f19e4463ec4176dad0
bcb9e99021f88b9720a667d737a3ddd7d5b9f963ac3cae6d26e74701e406dcdc
87b8abb05c7ee5642a5e801e7825dfa5ee4c1393ac998e87470ab53cc75e1842
a695a70c2efd11e1daa93997c1aaf976a205476839f553f2c8e64fb73123b853
40f9399ea067d69c0985aecdc54beddbcb585d7f660606e5bb4be981811c28ba
e9634032df81334e9e960ab8b88ff05a0f7ec9c034dc012f816f09e23c18d41b
```

### Network Indicators

```
194.87.128.243
194.87.108.110
89.125.189.118
89.125.189.85
91.149.221.124
188.124.59.120
193.233.23.81
89.37.185.60
74.112.102.120
```

LegionRelay C2 operates on TCP port 8000 (194.87.128.243, 194.87.108.110, 89.125.189.118, 89.125.189.85, 91.149.221.124). Nebo fake-login infrastructure operates on TCP port 14000 (89.37.185.60, 74.112.102.120). 188.124.59.120 hosts lapas[.]live; 193.233.23.81 hosts the PhantomClick zoomconference domains and PrincessClub princess-mens[.]click. The complete IOC set, including PhantomMail staging URLs and YARA rules, is published in WithSecure's GitHub IOC repository linked in References.

## Detection Recommendations

On web proxy and DNS, alert on resolution of or outbound HTTP/S traffic to the domains above. The C2 domains cluster on the *enterprise[.]com and *enterprise[.]icu naming pattern (goodhillsenterprise[.]com, serotoninenterprise[.]com, neuromancersolutionsenterprise[.]icu) and on Ukrainian-themed charity and government lures (ukrguard[.]org, ukrbezpeka[.]online, dsszzi.linkpc[.]net, declaration.linkpc[.]net); baseline DNS for newly observed domains matching these patterns. Block the dynamic-DNS staging hosts on linkpc[.]net, publicvm[.]com, and work[.]gd subdomains where there is no business need.

On network telemetry, block or alert on outbound connections to the LegionRelay C2 IPs on TCP/8000 (194.87.128.243, 194.87.108.110, 89.125.189.118, 89.125.189.85, 91.149.221.124) and the Nebo hosts on TCP/14000 (89.37.185.60, 74.112.102.120). Hunt for outbound HTTPS requests to t[.]me/s/sdgsersergser, which LegionRelay uses as a Telegram dead-drop to resolve its live C2 address; legitimate enterprise endpoints rarely fetch Telegram channel preview pages programmatically.

On EDR, hunt for PowerShell scripts and scheduled tasks matching the PhantomRelay and LegionRelay artifacts: scheduled task names "Adobe working", "BackUp checker", "AMD Checker", "System Health Service", "Microsoft System Health Service", and "Razer Synapse Service Helper"; file paths C:\ProgramData\AMD\amd.ps1, C:\ProgramData\BackUp\backup.ps1, and C:\ProgramData\Adobe\dfDgrr3.ps1; staging directories %ProgramData%\WindowSystem, %ProgramData%\Microsoft Windows, and %LOCALAPPDATA%\Razer Update; and script filenames SysCheckupService.ps1, SystemHealthSvc.ps1, Configuration.ps1, Configurate.ps1, RzUpdateManager.ps1, RzTelemetry.ps1, and the USB propagation script WUDFHost.ps1. Alert on PowerShell processes performing browser-credential, Telegram, or WhatsApp data access followed by outbound REST traffic.

On email gateways, block the PhantomMail spearphishing senders (Gmail addresses impersonating Ukrainian government and emergency-service entities such as centrenergo.ukr@gmail[.]com, office.dsns.dp@gmail[.]com, and office.cip.ua.gov@gmail[.]com) and quarantine ZIP/RAR attachments or Google Drive and 4sync links carrying Ukrainian-language filenames referencing inspection acts or conference materials. For Android fleets under MDM, treat the FallSpy APK hashes as active spyware and alert on sideloaded applications requesting contacts, call-log, location, and SIM data alongside network access.

## References

- [WithSecure Labs] GREYVIBE: A Russia-nexus group leveraging AI across state-aligned operations (2026-05-28) — https://labs.withsecure.com/publications/greyvibe
- [WithSecure Labs] GREYVIBE indicators of compromise and YARA rules (2026-05) — https://github.com/WithSecureLabs/iocs/blob/master/GREYVIBE/greyvibe_iocs.csv
- [BleepingComputer] GreyVibe hackers use ChatGPT, Gemini to power cyberattacks (2026-05-28) — https://www.bleepingcomputer.com/news/security/greyvibe-hackers-use-chatgpt-gemini-to-power-cyberattacks/
- [CSO Online] Russia-aligned crime group Greyvibe extensively uses AI in attacks (2026-05-28) — https://www.csoonline.com/article/4178879/russia-aligned-crime-group-greyvibe-extensively-uses-ai-in-attacks.html
- [Security Affairs] Meet GREYVIBE, the Russian-linked hacking group using AI to target Ukraine and still making rookie mistakes (2026-05) — https://securityaffairs.com/192877/apt/meet-greyvibe-the-russian-linked-hacking-group-using-ai-to-target-ukraine-and-still-making-rookie-mistakes.html
