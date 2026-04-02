# McAfee Labs Uncovers Large-Scale Vibe-Coded Cryptominer Campaign: 443 Malicious ZIPs with LLM-Generated PowerShell Targeting Global Users

**Date:** 2026-04-02
**TLP:** TLP:CLEAR
**Tags:** vibe-coding, cryptominer, ai-generated-malware, dll-sideloading, infostealer

## Executive Summary

McAfee Labs documented a large-scale cryptominer distribution campaign active in January 2026 where attackers used LLM-assisted 'vibe coding' to generate parts of the malicious PowerShell kill chain, distributing 443 malicious ZIP files across Discord, SourceForge, FOSSHub, and MediaFire impersonating AI tools, game mods, and software utilities. The campaign deployed WinUpdateHelper.dll via DLL sideloading, establishing persistence under the name 'Microsoft Console Host' and mining Ravencoin, Zephyr, and Monero. In some infections the final payload was SalatStealer or a Mesh Agent RAT. Defenders should alert on WinUpdateHelper.dll in non-system directories and monitor for anomalous cryptocurrency mining processes.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | WinUpdateHelper Vibe-Coded Cryptominer Campaign |
| Attribution | Unknown (confidence: none) |
| Target | Global consumer and enterprise users in the US, UK, India, Brazil, France, Canada, Australia; lured via fake AI tools, game mods, and software utilities |
| Vector | Malicious ZIP files hosted on Discord, SourceForge, FOSSHub, MediaFire, and mydofiles.com; initial execution via ZIP archive containing sideloaded DLL |
| Status | active |
| First Observed | 2024-12 |

## Detailed Findings

According to McAfee Labs research published in March 2026 covering campaign activity from January 2026, researchers identified 443 malicious ZIP files in the wild, each disguised as software users actively search for — including AI image generators, voice-changing tools, stock-market trading utilities, game mods, graphics card drivers, VPNs, ransomware decryptors, and infostealer tools. McAfee noted early signs of the campaign trace back to December 2024.

Across the 443 ZIP files, McAfee identified 48 unique malicious WinUpdateHelper.dll variants. These 48 DLL variants break into 17 distinct kill chains, each with its own C2 infrastructure, yet sharing cryptocurrency wallet credentials — an operational security mistake that allowed researchers to follow the money across the entire campaign. Files were hosted across more than 100 active delivery URLs on trusted platforms including Discord, SourceForge, MediaFire, FOSSHub, and mydofiles.com.

The PowerShell code style was a key indicator of LLM assistance. McAfee researchers found explanatory comments and neatly structured sections consistent with LLM generation, including a comment reading 'Downloads cvtres.exe from your GitHub URL' where 'Your GitHub URL' appears to be an unfilled template placeholder left by the AI tool, indicating the attackers used vibe-coded scripts with minimal human review.

The malware establishes persistence by registering a Windows service named 'Microsoft Console Host' (mimicking a legitimate Windows process) set to run at each system boot. The subsequently downloaded PowerShell executes entirely in memory (fileless), removes older persistence entries, adds C:\ProgramData to Windows Defender's exclusion list, and deploys two coin miners: one CPU-based (Zephyr) and one GPU-based (Ravencoin), with rewards converted to Bitcoin for payout. In certain infections, the final payload is SalatStealer or a Mesh Agent remote access tool.

The C2 server employs evasion: it only delivers payloads to requests with a PowerShell user-agent and returns 301/404 to curl or browser-based requests; download URLs expire after approximately 60 seconds; and the C2 domain rotates every 58 days based on UNIX timestamps. McAfee traced Bitcoin wallet flows and identified at least 7 wallets associated with the operation containing over $4,500, with total received funds exceeding $11,000; the true amount is assessed as higher given privacy-coin mining.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Hijack Execution Flow: DLL Side-Loading | T1574.002 | WinUpdateHelper.dll is sideloaded via a legitimate-looking executable in the malicious ZIP to execute the malicious payload without triggering AppLocker or standard execution controls. |
| Create or Modify System Process: Windows Service | T1543.003 | The malware registers a Windows service named 'Microsoft Console Host' for persistence at system boot, masquerading as a legitimate Windows process. |
| Defense Evasion: Impair Defenses: Disable or Modify Tools | T1562.001 | The fileless PowerShell payload adds C:\ProgramData to Windows Defender's exclusion list to prevent detection of subsequently dropped files. |
| Resource Hijacking | T1496 | Deployed CPU and GPU cryptocurrency miners mine Zephyr (CPU) and Ravencoin (GPU), with proceeds converted to Bitcoin. |
| Obfuscated Files or Information | T1027 | Fileless in-memory PowerShell execution prevents disk-based detection; C2 server only responds to PowerShell user-agent to block researcher tools. |

## IOCs

### Domains

```
mydofiles.com
```

### Full URL Paths

_WinUpdateHelper.dll sample hash sourced from MalwareTips community analysis referencing the McAfee report (https://malwaretips.com/threads/vibe-coded-malware-is-here-how-a-lazy-prompt-turned-into-a-11-000-crypto-heist-a-very-in-depth-mcafee-lab-report.140383/). McAfee primary report at https://www.mcafee.com/blogs/other-blogs/mcafee-labs/ai-written-malware-vibe-coded-campaign/. The hash 94de95... is identified as the first WinUpdateHelper.dll sample. C2 domain mydofiles.com is a confirmed delivery host. 48 unique DLL variants exist; full hash list in McAfee report. Persistence artifact: Windows service named 'Microsoft Console Host'. Defender exclusion path: C:\ProgramData._

### Splunk Format

```
"mydofiles.com"
```

### File Hashes

```
94de957259c8e23f635989dd793cdfd058883834672b2c8ac0a3e80784fce819
```

## Detection Recommendations

1. EDR: Alert on creation of Windows services named 'Microsoft Console Host' from non-system installer processes; flag WinUpdateHelper.dll execution from any path outside C:\Windows\System32\. 2. AV/EDR: Add the published WinUpdateHelper.dll hash (94de957259c8e23f635989dd793cdfd058883834672b2c8ac0a3e80784fce819) to blocklists; McAfee has published 48 variants in the full report. 3. Windows Defender: Monitor the registry key HKLM\SOFTWARE\Microsoft\Windows Defender\Exclusions\Paths for new additions pointing to C:\ProgramData — this is an active evasion step in the kill chain (Sysmon Event ID 13). 4. Process: Alert on PowerShell processes executing from memory (no on-disk script file) spawned from a sideloaded DLL parent. 5. Network: Flag outbound connections to cryptocurrency mining pool domains (pool.hashvault.pro, etc.) and alert on GPU/CPU utilization spikes in process monitoring that correlate with xmrig, ravencoin-miner, or zephyr-miner process names. 6. Download Sources: Implement web proxy policies blocking direct downloads from mydofiles.com; consider alerting on ZIP file downloads from generic file-hosting CDNs (MediaFire, FOSSHub for non-approved software).

## References

- [McAfee Labs] AI Wrote This Malware: Dissecting the Insides of a Vibe-Coded Malware Campaign (2026-03-19) — https://www.mcafee.com/blogs/other-blogs/mcafee-labs/ai-written-malware-vibe-coded-campaign/
- [McAfee] New Research: Hackers Are Using AI-Written Code to Spread Malware (2026-03-19) — https://www.mcafee.com/blogs/internet-security/new-research-hackers-are-using-ai-written-code-to-spread-malware/
- [GBHackers] Fake Tools and CDNs Power New 'Vibe-Coded' Malware Campaign (2026-03-20) — https://gbhackers.com/vibe-coded-malware/
- [TechRadar] 'Likely created with AI-generated code': This massive 'vibe-coded' campaign uses 1,700+ fake filenames to inject malware into your favorite game mods and apps (2026-03-20) — https://www.techradar.com/pro/security/likely-created-with-ai-generated-code-this-massive-vibe-coded-campaign-uses-1-700-fake-filenames-to-inject-malware-into-your-favorite-game-mods-and-apps
