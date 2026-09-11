# Kimsuky Operation GitPower: Genians Ties Decoy PDFs to the OpenCode Agent and Adds Pastebin C2

**Date:** 2026-09-11
**Tags:** nation-state, apt, phishing, malware

## Executive Summary

Genians Security Center reported on 2026-09-07 that 13 malicious LNK files collected from 2026-08-11 to 2026-08-19 continue Operation GitPower, now using financial and corporate Korean lures, GitHub personal access tokens, and in one cluster Pastebin. Four decoy PDFs recorded Creator and Producer as opencode, an open source terminal coding agent, with Author anonymous and identical 2026-08-16 03:00:00 UTC timestamps. Unreplaced LLM placeholders such as 임시값 remained in the body. Hunt the GitHub repo paths and Pastebin raw path below, LNK description Hangul Document 2.84 KB dated 10/20/2023, and scheduled tasks spoofing BitLocker, MATLAB, or .NET.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Operation GitPower follow-on; LNK to PowerShell to hidden scheduled task; GitHub Raw and Pastebin staging |
| Actor / Attribution | Kimsuky per Genians, linked to prior GitPower tradecraft. Yonhap relayed the same Genians assessment. Confidence medium to high on campaign continuity with the 2026-08-10 GitPower post; Genians did not publish a numeric confidence value |
| Target | South Korean financial, insurance, retail, and corporate staff based on lure themes. English Security_ filenames suggest a parallel set |
| Vector | ZIP containing document-themed LNK files that launch PowerShell with a custom arithmetic decoder |
| Status | Active. Samples from mid-August 2026 |
| First Observed | GitPower lineage from 2023; this wave 2026-08-11 to 2026-08-19; report 2026-09-07 |

## Detailed Findings

According to [Genians Security Center](https://www.genians.co.kr/blog/threat_intelligence/ai-agent-opencode), this is a follow-on to its August GitPower paper, not a new group. [Yonhap](https://en.yna.co.kr/view/AEN20260907003400320) reported the same 13-file set and quoted Genians that Creator and Producer opencode is not a normal office-suite value. Genians said this is the first time it has seen Kimsuky use an AI coding agent in the decoy path, after previously seeing LLM use for lure text and planning.

Genians said all 13 LNKs share Chrome icons, a forged description Type Hangul Document, Size 2.84 KB, Date modified 10/20/2023 11:23, about 300 leading spaces in the arguments, and command length of roughly 5,800 to 9,500 characters. File size is padded after the LNK structure with alphanumeric junk. The decoder variable $VIUSBvejbawf and add-constant 103 are shared; only the short XOR-style key string changes.

Decoded stage two for 20260811_자금집행.lnk wrote a decoy PDF to TEMP, assembled https://raw.githubusercontent.com/sven5500/firtfirter/main/ at runtime from split strings, used Authorization token plus Accept application/vnd.github.v3.raw, dropped mlxchjvose.ps1, registered a hidden task named BitLockor Encrypter All Drives_102974298364124_skillerty, and self-deleted. The task name misspells BitLocker.

Genians documented three changes from the prior paper. Some variants now check for VMware tools, Process Hacker, x64dbg, Procmon, and related processes, abort if username is Bruno, and delete ConsoleHost_history.txt. Visa5499.lnk fetched a PNG decoy and ran iex against pastebin.com/raw/gybpx38s. Decoy types widened to XLSX and PNG. Three builds assembled GitHub URLs then never downloaded a decoy, showing the user a tiny error PDF, while persistence still ran.

On 29 downloaded decoys, Genians found 11 unique MD5s. Four PDFs were opencode/opencode, Author anonymous, CreationDate 2026-08-16 03:00:00 UTC with no ModDate. Those bodies kept unreplaced 임시값 placeholders on payment-day, 14-day grace, and 100 million won working-capital lines. A second family used HeadlessChrome/151.0.0.0 and Skia/PDF m151 within an 18-minute window on 2026-08-10, with sentence templates that only swapped the topic word. Two XLSX files listed AzureUser, which Genians treated as a possible Azure VM default, not proof of a tenant.

GitHub accounts in this wave: sven5500, montry111, jamjack2026, urusa4400, jamestony88, baras6600P, choemiyang, jeni534, with matching proton.me and outlook.com operator mail in the appendix. Emails are not added as IOC objects. This feed already covered the August GitPower C2 IPs and AsyncRAT path; this post adds the new GitHub and Pastebin indicators and the opencode metadata.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Attachment | T1566.001 | ZIP-delivered financial LNK lures |
| User Execution: Malicious File | T1204.002 | Victim opens the LNK |
| Command and Scripting Interpreter: PowerShell | T1059.001 | Custom decoder and follow-on scripts |
| Indirect Command Execution | T1202 | conhost.exe --headless powershell.exe |
| Obfuscated Files or Information | T1027 | Leading spaces, split URLs, size padding, arithmetic decoder |
| Masquerading | T1036 | Chrome icon, forged Hangul Document description, BitLocker and MATLAB task names |
| Virtualization/Sandbox Evasion | T1497 | Tool process list and username Bruno |
| Indicator Removal: Clear Command History | T1070.003 | ConsoleHost_history.txt deleted |
| Scheduled Task/Job: Scheduled Task | T1053.005 | Hidden 5-minute then 10-to-35-minute tasks |
| Web Service | T1102 | GitHub Raw with PAT and Pastebin raw |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | opencode and HeadlessChrome decoy production |

## IOCs

Display values are defanged. JSON feed stores clean values.

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
github[.]com/sven5500/firtfirter
github[.]com/montry111/secsecon
github[.]com/jamjack2026/zoysotor
github[.]com/jamjack2026/twotwo
github[.]com/urusa4400/yutyutb
github[.]com/urusa4400/vcgheeg
github[.]com/jamestony88/confgiwr
github[.]com/baras6600P/oupouper
github[.]com/choemiyang/openoper
github[.]com/jeni534/qmcoiuuer
github[.]com/sven5500
github[.]com/montry111
github[.]com/jamjack2026
github[.]com/urusa4400
github[.]com/jamestony88
github[.]com/baras6600P
github[.]com/choemiyang
github[.]com/jeni534
pastebin[.]com/raw/gybpx38s
```

### Splunk Format

```
"github.com/sven5500/firtfirter" OR "github.com/montry111/secsecon" OR "github.com/jamjack2026/zoysotor" OR "github.com/jamjack2026/twotwo" OR "github.com/urusa4400/yutyutb" OR "github.com/urusa4400/vcgheeg" OR "github.com/jamestony88/confgiwr" OR "github.com/baras6600P/oupouper" OR "github.com/choemiyang/openoper" OR "github.com/jeni534/qmcoiuuer" OR "pastebin.com/raw/gybpx38s" OR "VIUSBvejbawf"
```

### File Hashes

```
10780939962b54addc9d31f57d80edfc
1523a2fcc901965ab4568d9fe829e4af
500e0bc0d7579fb338912770964076fe
685bfc6b2c29fbc16cfad908894add55
7a53089053b1381742856a5cf2b95f8b
8db2f20b719dcb7029d6296505622093
900e832c10d851bbdef3fb191a15db0e
a2015665a3e18bf0ef86e3931245c7e6
bb88940e915b11f6330b7446f6037f5b
ce5932b88f879f26006df81f2fa7667e
d0894d4626aae0f96d6b84ca3bb71a36
e50f2ae7fb03675a1ef58b1cf9cda6d1
f648bdd3c2cd902e239149de86d43e8f
```

## Detection Recommendations

Alert on LNK files whose description is Hangul Document, 2.84 KB, 10/20/2023 11:23, especially when the icon is chrome.exe and the target is powershell.exe. Hunt command lines with hundreds of leading spaces, variable VIUSBvejbawf, and conhost.exe --headless powershell.exe -ExecutionPolicy Bypass. Flag hidden scheduled tasks whose names resemble BitLockor, BitLooktr, MATLAB R2022, or .NET Framework NGEN with a long numeric suffix. On proxy logs, alert PowerShell or conhost fetching raw.githubusercontent.com with Authorization: token and Accept: application/vnd.github.v3.raw, and iex of pastebin.com/raw/gybpx38s. PDF metadata Creator or Producer opencode with Author anonymous is a lure-triage signal, not a block. Do not denylist github.com or pastebin.com apexes.

## References

- [Genians Security Center] Kimsuky Uses the AI Agent opencode to Create Decoys as Its GitHub PAT-Based LNK Attacks Evolve (2026-09-07) — https://www.genians.co.kr/blog/threat_intelligence/ai-agent-opencode
- [Genians Security Center] Prior Operation GitPower report (2026-08-10) — https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm
