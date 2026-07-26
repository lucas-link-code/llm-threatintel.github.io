# FakeAgent Bing Malvertising Used a Claude Artifact to Deliver SectopRAT to 29 Organizations

**Date:** 2026-07-26
**Tags:** phishing, malware

## Executive Summary

Huntress observed at least 29 organizations hit on 2026-07-21 and 2026-07-22 after Bing advertisements sent users to a malicious Claude Artifact that delivered a fake Claude Desktop installer and SectopRAT. Defenders should block the published attacker infrastructure and hashes, hunt for JetBrains JCEF or IBM SPSS binaries executing beside untrusted DLLs, and investigate scheduled tasks launching DockerDesktop.exe from user-writable paths.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | FakeAgent / SectopRAT |
| Actor / Attribution | Unattributed operator; Huntress published historical infrastructure links without assigning a confidence level |
| Target | Organizations whose users searched Bing for the Claude desktop application |
| Vector | Paid Bing advertisement to a malicious public Claude Artifact, attacker-controlled redirects, fake ClaudeDesktop.exe, and DLL sideloading |
| Status | active infrastructure; malicious Claude Artifact removed |
| First Observed | 2026-07-21 |

## Detailed Findings

According to Huntress, its SOC observed unusual executable installations, Microsoft Defender exclusions, and persistence across at least 29 organizations between 2026-07-21 and 2026-07-22. Huntress reported that each victim searched Bing for “CLAUDE DESKTOP APP,” selected a sponsored result, and reached a malicious public Artifact hosted on the legitimate Claude platform.

Huntress reported that the malicious Artifact at `claude[.]ai/public/artifacts/ca456f1f-44c0-42af-b329-4f1c7534a877` accumulated 7,100 views before Anthropic removed it. Huntress stated that its download button redirected victims through `claude.ai.download-app[.]us`, registered on 2026-05-09, and `downloading-api.it[.]com/html/claude/win` before serving `ClaudeDesktop.exe`.

Huntress reported that the files named `ClaudeDesktop.exe` and `DockerDesktop.exe` were identical copies of the legitimate JetBrains JCEF helper, with the latter installed through a scheduled task for repeated reinfection. Huntress found a tampered `libcef.dll` beside the signed executable, producing DLL sideloading execution, and reported that the DLL was protected with VMProtect.

Huntress reported that the first sideloaded DLL referenced a BNB Smart Chain contract used as an EtherHiding dead-drop resolver for rotating command-and-control and retrieving an encrypted `cache.dat` payload. Huntress then identified a second sideloading chain under `%APPDATA%\Roaming\Microsoft\EdgeUpdate\Install\sslconf.exe`, where a signed IBM SPSS binary loaded the malicious `tempdir.dll`.

Huntress reported that `tempdir.dll` checked GPU vendor identifiers for QEMU and VMware, rejected systems with less than 1 GB of VRAM, and used shader timing as additional anti-analysis gates. Huntress stated that the malware stored its encrypted payload in `appcfg.dat` and used a DirectX shader implementing a modified AES-256-CTR routine to decrypt it.

Huntress attributed the embedded .NET payload to SectopRAT after finding browser login, cookie, autofill, credit-card, FTP, Discord, and messaging-client collection logic and correlating hidden virtual network computing behavior with command-and-control services recovered from blockchain transactions. Huntress reported the live C2 as `2.24.131[.]246` and published `5ca8758c-02d0-4a72-89c8-d468b66dda41[.]com` as a backup SectopRAT domain.

Huntress decrypted 21 historical C2 addresses from BNB Smart Chain transactions dated from 2025-05-30 through 2026-06-12. Huntress cautioned that the older addresses may belong to other campaigns operated by the same infrastructure owner and differ from the immediate FakeAgent scope; they are retained below as historical pivots with that limitation.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Drive-by Compromise | T1189 | Paid Bing results sent users through a malicious web artifact to the payload |
| User Execution: Malicious File | T1204.002 | Victims downloaded and executed the fake ClaudeDesktop.exe |
| Masquerading | T1036 | Signed components and filenames impersonated Claude Desktop and Docker Desktop |
| Hijack Execution Flow: DLL | T1574.001 | Tampered libcef.dll and tempdir.dll were sideloaded by signed executables |
| Scheduled Task/Job: Scheduled Task | T1053.005 | DockerDesktop.exe was installed for repeated reinfection |
| Impair Defenses: Disable or Modify Tools | T1562.001 | Huntress observed Microsoft Defender exclusions during infections |
| Obfuscated Files or Information: Software Packing | T1027.002 | The libcef.dll stager used VMProtect |
| Virtualization/Sandbox Evasion: System Checks | T1497.001 | GPU identifiers, VRAM size, and shader timing gated execution |
| Web Service: Dead Drop Resolver | T1102.001 | BNB Smart Chain transactions resolved rotating C2 infrastructure |
| Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | SectopRAT targeted browser logins, cookies, autofill data, and payment cards |

## IOCs

### Domains

```
download-app[.]us
claude.ai.download-app[.]us
downloading-api.it[.]com
5ca8758c-02d0-4a72-89c8-d468b66dda41[.]com
```

### Full URL Paths

```
claude[.]ai/public/artifacts/ca456f1f-44c0-42af-b329-4f1c7534a877
downloading-api.it[.]com/html/claude/win
```

### IP Addresses

```
2.24.131[.]246
107.189.24[.]67
104.194.133[.]210
107.189.26[.]86
107.189.21[.]86
45.59.124[.]17
45.59.125[.]228
45.59.122[.]82
107.189.17[.]143
45.59.122[.]134
45.59.122[.]235
107.189.22[.]118
107.189.20[.]32
107.189.20[.]95
107.189.24[.]255
45.59.117[.]145
45.59.114[.]190
45.59.123[.]122
45.59.117[.]67
195.110.58[.]222
191.101.80[.]211
```

### Splunk Format

```
"*download-app.us*" OR "*claude.ai.download-app.us*" OR "*downloading-api.it.com/html/claude/win*" OR "*5ca8758c-02d0-4a72-89c8-d468b66dda41.com*" OR "*claude.ai/public/artifacts/ca456f1f-44c0-42af-b329-4f1c7534a877*" OR "2.24.131.246"
```

### File Hashes

```
1cd58cfba596da296ab1878d74023e00c399345a1b6c2a0e5446c53563f4e3bb
26bae4d7012bf59847ab4036a065419c3d4ca47e020479f55b3b2c6d0d21394a
1fe3646d27d286db8123297e06ae7badf3e26f352a04f91b6d82c28869a91664
```

## Detection Recommendations

Block the attacker-controlled domains, URL path, active C2, and malicious hashes while allowing the legitimate Claude platform except for the exact removed Artifact identifier. In web proxy logs, alert when a visit to the exact Artifact path is followed by `download-app.us` or `downloading-api.it.com` and a Windows executable download. In EDR process and file telemetry, hunt for `ClaudeDesktop.exe` or `DockerDesktop.exe` in user-writable directories beside `libcef.dll`, and for `%APPDATA%\Roaming\Microsoft\EdgeUpdate\Install\sslconf.exe` beside `tempdir.dll` or `appcfg.dat`. Review scheduled-task creation that launches DockerDesktop.exe outside the legitimate Docker installation path, Defender exclusion changes near that event, signed JetBrains or IBM SPSS binaries loading unsigned DLLs, and outbound connections to the active C2. Treat the older IPs as correlation pivots because Huntress stated that they may belong to other campaigns from the same operator.

## References

- [Huntress] Inside FakeAgent: How a Claude Desktop Malvertising Campaign Hit 29 Organizations with SectopRAT (2026-07-22) — https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat
- [BleepingComputer] Fake Claude app promoted by Bing ads pushes SectopRAT malware (2026-07-23) — https://www.bleepingcomputer.com/news/security/fake-claude-app-promoted-by-bing-ads-pushes-sectoprat-malware/
- [Help Net Security] Malicious Claude Artifacts used to distribute malware (2026-07-23) — https://www.helpnetsecurity.com/2026/07/23/anthropic-claude-artifacts-download-malware/
