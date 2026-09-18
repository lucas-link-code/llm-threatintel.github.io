# RatHat: Android RAT Sends Live Accessibility Trees to a Generative AI Assistant for Click and Scroll Control

**Date:** 2026-09-18
**Tags:** malware, phishing

## Executive Summary

Zimperium zLabs published on 2026-09-16 that RatHat, an Android remote access trojan assessed as China linked, serializes the live Accessibility tree to XML and asks a popular generative AI assistant for click coordinates, on screen text, and SCROLL_DOWN commands. The implant pairs Accessibility abuse with local wireless debugging self pairing, then stages Go daemons that keep a shell after the user uninstalls the visible app. Hunt the Zimperium C2 and phishing hosts below, block sideloaded APKs from smishing and malvertising, and treat Wireless Debugging enablement plus loopback ADB pairing as a high severity mobile event.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | RatHat Android RAT with generative AI UI automation, Go agent liblocal-service.so, and FRP client libmedia_codec.so |
| Actor / Attribution | Zimperium said operators appear to be in China, based on Mandarin prompts. Confidence low to medium. Infosecurity Magazine said a figure suggested Google Gemini. Zimperium did not name the model |
| Target | Banking, crypto, WeChat, and Alipay users. Overlay templates are fetched from C2 and can be restyled as a streaming app or Chrome |
| Vector | Smishing, malvertising, and third party forums leading to sideloaded APKs. Dropper unpacks an encrypted in memory DEX |
| Status | Active. Zimperium published C2, phishing, and APK hashes on 2026-09-16. The Hacker News summarized the same research on 2026-09-18 |
| First Observed | Public analysis 2026-09-16. Zimperium did not publish a first seen month for the family |

## Detailed Findings

According to [Zimperium](https://zimperium.com/blog/rathat-ai-powered-mobile-threat-is-here-for-your-credentials-bank-accounts), RatHat is delivered as a dropper that hides two encrypted assets, skips a 24 byte header, XOR and subtracts a fixed transform, then gunzips stage two. The dropper uses SessionInstaller APIs to install the payload. Anti analysis includes ZIP container tampering, a 61 MB AndroidManifest.xml with undocumented 0x9999 chunks, DEX pseudo instructions that break disassemblers, StringFog plus a StringCrypto scheme, and six anti debug checks covering JDWP, TracerPid, FLAG_DEBUGGABLE, ro.debuggable, Frida on port 27042, and Xposed, root, or emulator artefacts.

Zimperium said the Android app obtains Accessibility, then uses SystemHelperService to tap Build Number seven times, enable Wireless Debugging, scrape the six digit ADB pairing code, and pair against the local ADB daemon with an embedded libadb-android library. That shell lets the app stage liblocal-service.so and libmedia_codec.so to /data/local/tmp. The Go agent binds HTTP on 127.0.0.1:7910, grants WRITE_SECURE_SETTINGS, exempts the app from Doze, and fetches FRP address, port, and token from C2. The FRP client, derived from fatedier/frp, opens a reverse tunnel so the operator reaches ADB independently of the app feature set.

Zimperium said the generative AI loop is used for navigation, not for writing malware: the client sends Accessibility XML and receives JSON centre coordinates, on screen text without translation, and scroll commands. Prompts in Figure 4 of the Zimperium post are the China attribution signal. Infosecurity Magazine reported on 2026-09-17 that a graph in that research suggested Gemini. Treat the model identity as [Unverified] until Zimperium names an API host, key, or SDK.

Persistence survives uninstall. The local service runs outside the package lifecycle, checks whether the APK is present, then runs pm install -r -g and rewrites enabled_accessibility_services. The app intercepts the uninstall dialog with a fake Google Play failure overlay. Credential theft uses HTML overlays for banks and crypto, hardcoded WeChat and Alipay PIN overlays, Accessibility text event reconstruction, browser URL bar scraping, and a hardware getevent keylogger that maps touch points through locateValues.json keypad layouts. C2 uses HTTP registration plus a WebSocket with HMAC-SHA256, plus agent endpoints under /api/v2/dev/.

[The Hacker News](https://thehackernews.com/2026/09/rathat-android-malware-abuses-adb-to.html) repeated the Zimperium architecture, the uninstall surviving shell, and the Accessibility XML to generative AI loop on 2026-09-18. No second vendor published an independent sample teardown in this window.

Zimperium published C2, phishing, and 162 SHA256 hashes in github.com/Zimperium/IOC/tree/master/2026-09-RatHat. This feed keeps the network indicators and one sample APK hash. Import the remaining hashes from that folder. Do not treat api.ipify.org as an indicator.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1566.002 | Smishing and malvertising to sideload APKs |
| Input Capture: Keylogging | T1056.001 | Accessibility text events and /dev/input getevent mapping |
| Screen Capture | T1113 | MediaProjection plus agent screen monitor without the consent dialog |
| Masquerading | T1036 | Streaming app or Chrome aliases, liblocal-service.so and libmedia_codec.so names, fake Google Play uninstall overlay |
| Obfuscated Files or Information | T1027 | Encrypted dropper assets, StringFog, StringCrypto, ZIP and DEX poisoning |
| Debugger Evasion | T1622 | JDWP, TracerPid, Frida, Xposed, emulator, and FLAG_DEBUGGABLE checks |
| Proxy | T1090 | FRP reverse tunnel to expose local ADB and loopback HTTP |
| Application Layer Protocol: Web Protocols | T1071.001 | HTTP register, WebSocket heartbeats, HMAC authenticated API paths |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | Live Accessibility XML sent to a generative AI assistant for click and scroll decisions |

## IOCs

Display values are defanged. JSON feed stores clean values.

### Domains

```
fegrs.adidasabc[.]com
admin.xiongmaocs[.]help
oop.uuokxx[.]com
andxxxo[.]com
blackcat880[.]shop
cheng770[.]cyou
admin.xiongmaocs[.]mom
admin.xiongmaocs[.]pics
admin.fjbjwgyuyftg[.]qpon
admin.niaotong2[.]top
heilongyk[.]top
cz.gpgmk[.]com
cunzhang.krgdef[.]cn
bc.etlva[.]cn
jiaozhu.etlva[.]cn
mao.terh5[.]cn
kingbss[.]com
app.tmgg01[.]top
x14hidgz0ez.s3.ap-south-1.amazonaws[.]com
sel6bu6eft06.primevoria[.]com
```

### Full URL Paths

```
x14hidgz0ez.s3.ap-south-1.amazonaws[.]com/Xr9HBk23fX.apk
sel6bu6eft06.primevoria[.]com/Xr9HBk23fX
```

### Splunk Format

```
"fegrs.adidasabc.com" OR "admin.xiongmaocs.help" OR "oop.uuokxx.com" OR "andxxxo.com" OR "blackcat880.shop" OR "cheng770.cyou" OR "admin.xiongmaocs.mom" OR "admin.xiongmaocs.pics" OR "admin.fjbjwgyuyftg.qpon" OR "admin.niaotong2.top" OR "heilongyk.top" OR "cz.gpgmk.com" OR "cunzhang.krgdef.cn" OR "bc.etlva.cn" OR "jiaozhu.etlva.cn" OR "mao.terh5.cn" OR "kingbss.com" OR "app.tmgg01.top" OR "x14hidgz0ez.s3.ap-south-1.amazonaws.com" OR "sel6bu6eft06.primevoria.com" OR "x14hidgz0ez.s3.ap-south-1.amazonaws.com/Xr9HBk23fX.apk" OR "sel6bu6eft06.primevoria.com/Xr9HBk23fX"
```

### File Hashes

```
00ba0d5aea129f098b5a609633ac77cd642fddba8b64f6332e49e6d33294992e
```

## Detection Recommendations

On MDM and Android enterprise logs, alert when Wireless Debugging or Developer Options is enabled, when ADB pairing occurs with no desktop host, or when processes listen on 127.0.0.1:7910. Hunt files named liblocal-service.so, libmedia_codec.so, frpc, app.apk, or local-service.update under /data/local/tmp. EDR and mobile threat defense should flag dumpsys deviceidle whitelist additions, am set-standby-bucket active, and pm disable-user against security packages.

On DNS and TLS SNI, denylist the C2 and phishing hosts above. Do not denylist amazonaws.com. The S3 object is the bucket host x14hidgz0ez.s3.ap-south-1.amazonaws.com plus path Xr9HBk23fX.apk. Proxy logs for that object, kingbss.com, app.tmgg01.top, and sel6bu6eft06.primevoria.com are delivery hunts.

On banking and wallet apps, treat overlay HTML, Accessibility scraping, and FLAG_SECURE bypass via /dev/input as the theft path. Use the sample SHA256 above for a first lookup. Import the remaining hashes from Zimperium apks.csv. Do not block Gemini, Chrome, WeChat, or Alipay as products.

## References

- [Zimperium] RatHat: AI-Powered Mobile Threat is Here for Your Credentials & Bank Accounts (2026-09-16): https://zimperium.com/blog/rathat-ai-powered-mobile-threat-is-here-for-your-credentials-bank-accounts
- [Zimperium] IOC repository folder 2026-09-RatHat (2026-09-16): https://github.com/Zimperium/IOC/tree/master/2026-09-RatHat
- [The Hacker News] RatHat Android Malware Abuses ADB to Retain Shell Access After Uninstall (2026-09-18): https://thehackernews.com/2026/09/rathat-android-malware-abuses-adb-to.html
- [Infosecurity Magazine] New Chinese-Made RatHat Android Malware Leverages AI to Steal Financial Data (2026-09-17): https://www.infosecurity-magazine.com/news/rathat-android-malware-ai-steal/
