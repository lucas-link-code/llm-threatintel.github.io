# Fake Claude AI Site Drops Beagle Backdoor: claude-pro[.]com Distributes G Data DLL Sideload Chain Loading DonutLoader Since February 2026

**Date:** 2026-05-10
**Tags:** malware, malicious-tool, phishing

## Executive Summary

Sophos and BleepingComputer disclosed on May 7, 2026 that the fake Anthropic lookalike claude-pro[.]com has been distributing a previously undocumented Windows backdoor named Beagle for months, delivered through a 505 MB Claude-Pro-windows-x64.zip MSI that installs a legitimate functioning Claude UI on top of a DLL sideload chain abusing a signed G Data antivirus updater. Beagle communicates with license.claude-pro[.]com over TCP/443 and UDP/8080 to an Alibaba Cloud-hosted C2 at 8.217.190.58 and supports eight commands (cmd, upload, download, mkdir, rename, ls, rm, uninstall) via a hardcoded AES key. This campaign is distinct from the April 22, 2026 Malwarebytes Fake-Claude-installer-PlugX cluster covered separately and represents a coordinated brand-impersonation operation: Sophos identified VirusTotal samples reusing the same XOR key dating to February 2026 with sibling lures impersonating CrowdStrike, SentinelOne, Trellix, and Microsoft Defender update binaries.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Beagle backdoor / fake Claude AI installer (claude-pro[.]com) |
| Attribution | Unknown (confidence: none); reuses tradecraft historically associated with PlugX-style operators but Sophos analysis shows DonutLoader/Beagle stack is distinct from PlugX |
| Target | Windows users searching for or deceived into downloading a "Claude Pro" desktop client; impersonations also seeded under names mimicking CrowdStrike, SentinelOne, Trellix, and Microsoft Defender updaters |
| Vector | Lookalike domain claude-pro[.]com → Claude-Pro-windows-x64.zip (505 MB) → MSI installer → DLL sideload of avk.dll into signed G Data NOVupdate.exe → encrypted NOVupdate.exe.dat → DonutLoader → Beagle |
| Status | active |
| First Observed | 2026-02 (earliest VirusTotal samples sharing the XOR key); Malwarebytes initial discovery 2026-04; Sophos detailed analysis 2026-05-07 |

## Detailed Findings

According to BleepingComputer (2026-05-07), the fake Claude AI website claude-pro[.]com closely mimics Anthropic's legitimate site and offers a "Claude-Pro Relay" Windows download. The 505 MB ZIP archive contains an MSI installer. After execution the installer drops three files into the Windows Startup folder: NOVupdate.exe (a legitimate, code-signed G Data antivirus updater), avk.dll (the malicious sideload component), and NOVupdate.exe.dat (the encrypted DonutLoader payload). To reduce victim suspicion the MSI also installs a working Claude desktop UI that launches normally.

According to Sophos (2026-05-07), the malicious avk.dll is loaded by NOVupdate.exe through standard DLL search-order sideloading (MITRE T1574.002). The DLL reads NOVupdate.exe.dat from disk, applies a hardcoded XOR key to decrypt it into a DonutLoader stage, then injects DonutLoader into memory. DonutLoader in turn loads Beagle directly into the running process without writing the final payload to disk.

According to Sophos, Beagle is a previously undocumented backdoor with a compact command set: uninstall, cmd (arbitrary command execution), upload, download, mkdir, rename, ls, and rm. Communications use a hardcoded AES key and target license.claude-pro[.]com on TCP/443 and UDP/8080. The C2 hostname resolves to 8.217.190.58 on Alibaba Cloud.

According to Sophos, pivoting on the hardcoded XOR key on VirusTotal surfaced related samples dating to February 2026 with lures impersonating updater binaries from CrowdStrike, SentinelOne, Trellix, and Microsoft Defender. The naming pattern indicates the operator deliberately rotates the abused signed binary across security-vendor brands. According to Malwarebytes (2026-04), the campaign is part of a wider trend of cybercriminals exploiting the Claude brand, similar to the earlier April 22, 2026 fake Claude PlugX campaign already documented but using a distinct stack (DonutLoader and Beagle here, PlugX in the earlier cluster).

According to Security Affairs (2026-05-07), some early commentary characterized the payload as PlugX before Sophos's detailed reverse engineering reclassified it as Beagle on the basis of the differing C2 protocol, command set, and AES key handling. Defenders should treat the two clusters as separate.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1566.002 | claude-pro[.]com lookalike domain advertising fake Claude-Pro Relay Windows client |
| User Execution: Malicious File | T1204.002 | Victim runs Claude-Pro-windows-x64 MSI installer |
| Hijack Execution Flow: DLL Side-Loading | T1574.002 | avk.dll sideloaded by signed G Data NOVupdate.exe from the Startup folder |
| Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder | T1547.001 | Three files dropped into Windows Startup folder for persistence |
| Deobfuscate/Decode Files or Information | T1140 | Hardcoded XOR key decrypts NOVupdate.exe.dat into DonutLoader stage |
| Reflective Code Loading | T1620 | DonutLoader reflectively loads Beagle into memory without writing final payload to disk |
| Masquerading: Match Legitimate Name or Location | T1036.005 | Use of legitimate signed G Data updater binary; impersonation of CrowdStrike, SentinelOne, Trellix, Microsoft Defender updaters in sibling samples |
| Application Layer Protocol: Web Protocols | T1071.001 | Beagle C2 over TCP/443 to license.claude-pro[.]com |
| Non-Application Layer Protocol | T1095 | Beagle fallback C2 channel over UDP/8080 |
| Encrypted Channel: Symmetric Cryptography | T1573.001 | Hardcoded AES key protects Beagle C2 traffic |
| Command and Scripting Interpreter | T1059 | Beagle cmd command executes arbitrary shell commands on victim |
| Ingress Tool Transfer | T1105 | Beagle download and upload commands move files in and out of the victim |

## IOCs

### Domains

```
claude-pro.com
license.claude-pro.com
```

### Full URL Paths

```
claude-pro.com/Claude-Pro-windows-x64.zip
```

### Splunk Format

```
"claude-pro.com" OR "license.claude-pro.com" OR "claude-pro.com/Claude-Pro-windows-x64.zip"
```

### File Hashes

```
No hash IOCs published by source at time of writing
```

### Network Indicators

```
8.217.190.58
```

## Detection Recommendations

On web proxy and DNS, alert on outbound resolution or HTTP traffic to claude-pro[.]com, license.claude-pro[.]com, or any subdomain of claude-pro[.]com; legitimate Anthropic infrastructure is anthropic.com and claude.ai. Block 8.217.190.58 at the perimeter for environments without a business need to reach this Alibaba Cloud /32. Add the URL claude-pro[.]com/Claude-Pro-windows-x64.zip to web download blocklists and treat any 505 MB ZIP with the basename Claude-Pro-windows-x64 as malicious by signature.

On EDR, hunt for NOVupdate.exe executing from `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\` or any non-standard path outside the legitimate G Data installation directory under `C:\Program Files (x86)\G Data\`; legitimate G Data NOVupdate runs only under that path tree. Alert on NOVupdate.exe loading avk.dll from a non-G Data directory (DLL sideload pattern). Hunt for any process loading a sibling .dat file via filename pattern `<process>.exe.dat` from the Startup folder, since this is the encrypted-payload-on-disk pattern used by this chain. The same primitive applies to sibling samples impersonating CrowdStrike, SentinelOne, Trellix, and Microsoft Defender updater binaries: alert on any of those updater filenames running from a non-vendor path.

On network telemetry, hunt for outbound TCP/443 with non-TLS payloads, or UDP/8080 outbound to a low-reputation IP, both of which are atypical for normal endpoint traffic. Beagle's hardcoded AES key and small command vocabulary produce tight, repetitive packet sizes; baseline this if you have NetFlow or Zeek conn.log on the egress.

For Splunk, ingest Sysmon EventID 7 (image load) and alert when avk.dll loads from a path outside `C:\Program Files (x86)\G Data\`. For CrowdStrike LogScale, build a CQL detection on `event_simpleName=ImageHardLink OR event_simpleName=ProcessRollup2` where ParentBaseFileName matches NOVupdate.exe and FilePath does not start with the legitimate G Data installation directory.

## References

- [BleepingComputer] Fake Claude AI website delivers new 'Beagle' Windows malware (2026-05-07) — https://www.bleepingcomputer.com/news/security/fake-claude-ai-website-delivers-new-beagle-windows-malware/
- [Sophos] Donuts and Beagles: Fake Claude site spreads backdoor (2026-05-07) — https://www.sophos.com/en-us/blog/donuts-and-beagles-fake-claude-site-spreads-backdoor
- [Malwarebytes] Fake Claude site installs malware that gives attackers access to your computer (2026-04) — https://www.malwarebytes.com/blog/scams/2026/04/fake-claude-site-installs-malware-that-gives-attackers-access-to-your-computer
- [Infosecurity Magazine] Fake Claude AI Site Drops Beagle Backdoor on Windows Users (2026-05-07) — https://www.infosecurity-magazine.com/news/fake-claude-site-beagle-backdoor/
- [Security Affairs] Fake Claude AI installer abuses DLL sideloading to deploy PlugX (2026-05-07) — https://securityaffairs.com/190754/malware/fake-claude-ai-installer-abuses-dll-sideloading-to-deploy-plugx.html
