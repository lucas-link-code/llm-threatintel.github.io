# CLOSEDQUORUM: Windows Implant Lets DeepSeek, Qwen, Mistral, and Gemini Vote on the Next Action

**Date:** 2026-09-27
**TLP:** TLP:CLEAR
**Tags:** malware, malicious-tool

## Executive Summary

Cisco Talos published on 2026-09-22 that CLOSEDQUORUM, a 16.4 MB Go Windows implant, asks up to four commercial models to vote on steal, inject, persist, or move, then runs the winning action without a dedicated attacker command and control server. Talos has not confirmed in the wild deployment. The public build uses placeholder API keys and a dummy Discord webhook, so it does not complete the loop. Hunt the six SHA256 builds below, LSASS access paired with process injection, and a Windows executable that calls several model APIs in one cycle. Do not denylist api.deepseek.com, openrouter.ai, api.mistral.ai, or Discord.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | CLOSEDQUORUM. Talos YARA metadata dated 2026-06-17 used the earlier label BALZAK and notes a rename on 2026-07-03 |
| Actor / Attribution | Unnamed developer. Talos linked binary artifacts to criminal forum postings about carding going back to 2025. Confidence low. No named cluster |
| Target | Windows hosts. Stated collection is LSASS, Chrome, Edge, and Firefox passwords, plus MetaMask, Exodus, and Ethereum wallet files |
| Vector | Talos assesses a per operator build with the operator Discord webhook and model API keys injected at compile time. How that build is delivered was not described |
| Status | Public distribution build is inert. In the wild deployment not confirmed by Talos |
| First Observed | Talos static analysis rule date 2026-06-17. Public report 2026-09-22 |

## Detailed Findings

According to [Cisco Talos](https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/), CLOSEDQUORUM is a 64 bit Windows executable compiled in Go, about 16.4 MB, with CGO enabled so it can make direct Windows calls. After it starts, `gatherSystemInfo()` stores hostname, OS architecture, CPU count, Windows version, and admin status. `ModelOrchestrator` then queries up to four providers in order: DeepSeek, Qwen, Mistral, and Gemini. `interModelDiscussion()` counts the `Decision` field and takes the plurality. A tie keeps the first maximum in that same provider order, so DeepSeek wins ties, then Qwen, then Mistral, then Gemini. If every model fails, the fallback string is `consensus`, which has no handler, and the implant sleeps and retries.

Talos extracted the system prompt: "You are an advanced malware strategist. Provide ONLY executable decisions." The model must return JSON whose `Decision` is one of `steal`, `inject`, `persist`, or `move`. `steal` runs `lsassDump()`, `dumpBrowserCredentials()`, and `extractCryptoWallets()` together. `inject` calls `generateShellcode()`, then `injectProcess()` for process hollowing or `earlyBirdInject()` for early bird APC injection. `persist` calls `establishPersistence()`. `move` has no handler in the distribution build. A Discord webhook receives the winning decision, the model reasoning text, and the execution parameters. Stolen files are AES-256-GCM encrypted with a key derived from the current date, Base64 encoded, split into 1900 byte pieces, and posted to that webhook.

Talos said the public distribution binary is an inert template. LLM API credentials initialize to `dummy_api_key` and the webhook initializes to `dummy_webhook_url`. Development builds show those values injected at compile time, including strings `deepseekAPIKey` and `geminiAPIKey` in `gohno-final.exe`. Talos did not observe a full end to end run of the public build. Talos also said it does not have confirmation of in the wild deployment. Artifacts from the binary were used to connect the developer to carding forum posts dating to 2025. That is a developer link, not a victim set.

[The Register](https://www.theregister.com/security/2026/09/22/windows-closedquorum-malware-uses-ai-models-to-autonomously-select-post-compromise-actions/5298435) reported the same Talos paper on 2026-09-22 and restated the four model panel, the steal, inject, and persist actions, and the absence of a dedicated attacker server. Talos published the sample set the same day it released the CAIRN toolkit for metadata first hunting of AI integrated malware.

Persistence documented by Talos: a current user Registry Run value named WindowsUpdate, a scheduled task via schtasks.exe, and a permanent WMI subscription that runs about every 60 seconds through a script path consistent with `C:\Windows\Temp\wmi.ps1`. Credential theft uses `SeDebugPrivilege` and `MiniDumpWriteDump` against LSASS. Browser theft reads Chrome and Edge Login Data and Firefox `logins.json`. Wallet theft covers the MetaMask Chrome extension, `exodus.wallet`, and an Ethereum wallet path. Staged copies go under `C:\Windows\Temp\`. Evasion includes a five minute initial delay, a randomized 5 to 15 minute loop, and a patch of `EtwEventWrite` with a single RET. YARA in the paper also matches provider host strings `api.deepseek.com`, `openrouter.ai`, `api.mistral.ai`, and `cdn.discordapp.com`. Those are shared vendor and CDN hosts. They are not IOCs in this feed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Obtain Capabilities: Artificial Intelligence | T1588.007 | Commercial model APIs are the decision channel for the next action |
| Process Injection: Asynchronous Procedure Call | T1055.004 | `earlyBirdInject()` queues shellcode with NtQueueApcThread in a suspended process |
| Process Injection: Process Hollowing | T1055.012 | `injectProcess()` when the model selects process_hollow |
| OS Credential Dumping: LSASS Memory | T1003.001 | `lsassDump()` uses MiniDumpWriteDump after SeDebugPrivilege |
| Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | Chrome, Edge, and Firefox password stores, plus MetaMask in the Chrome profile |
| Unsecured Credentials: Credentials In Files | T1552.001 | Exodus and Ethereum wallet files on disk |
| Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder | T1547.001 | Current user Run value named WindowsUpdate |
| Scheduled Task/Job: Scheduled Task | T1053.005 | schtasks.exe persistence |
| Event Triggered Execution: Windows Management Instrumentation Event Subscription | T1546.003 | Permanent WMI subscription, about every 60 seconds, launching powershell.exe |
| Exfiltration Over Web Service: Exfiltration Over Webhook | T1567.004 | Date keyed AES-256-GCM blobs posted to an operator Discord webhook |
| Disable or Modify Tools | T1685 | `EtwEventWrite` overwritten with RET |
| Virtualization/Sandbox Evasion: Time Based Evasion | T1497.003 | Five minute start delay and a 5 to 15 minute loop |
| Masquerading: Match Legitimate Name or Location | T1036.005 | WindowsUpdate Run value and WMI names that look like system activity |

## IOCs

Display values in domain and URL blocks are defanged. This feed does not list shared model or Discord hosts. JSON stores clean hashes only.

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"250d4fa37488af9b025333fa17705573d721467b203765bc360890b4f5a90cd7" OR "c4dc171f2513fcaf9d5ecc815a94aee4063b213ab380f80bd3ac422dee5205a7" OR "c13cea04f598e2b0c248d603a6e31bd13aabb64d8149c1b6a77b64e0b983a86f" OR "f5f1f8c3e7b883793800ab6ccf21b3e60bd0730f300b4595fe74a33adc17a63c" OR "5191cf625dfc209a347f137b50aea199e82040fd5ee9086fb3e2de73c133f3cb" OR "eddbd0ecf7195d38fefae5b9d393abfa79e6f3f94bde19308ecef130a05a42e5"
```

### File Hashes

```
250d4fa37488af9b025333fa17705573d721467b203765bc360890b4f5a90cd7
c4dc171f2513fcaf9d5ecc815a94aee4063b213ab380f80bd3ac422dee5205a7
c13cea04f598e2b0c248d603a6e31bd13aabb64d8149c1b6a77b64e0b983a86f
f5f1f8c3e7b883793800ab6ccf21b3e60bd0730f300b4595fe74a33adc17a63c
5191cf625dfc209a347f137b50aea199e82040fd5ee9086fb3e2de73c133f3cb
eddbd0ecf7195d38fefae5b9d393abfa79e6f3f94bde19308ecef130a05a42e5
```

### Package Indicators

```
No package IOCs published by source
```

## Detection Recommendations

Do not block api.deepseek.com, openrouter.ai, api.mistral.ai, generativelanguage.googleapis.com, or Discord as domains. Talos said legitimate software calls those services. Correlate instead. On EDR, alert when one unsigned or unexpected Windows process reads LSASS, writes under `C:\Windows\Temp\`, and within the same process tree opens TLS to more than one of those model hosts. Hunt `MiniDumpWriteDump` against lsass.exe, `NtQueueApcThread` into a process started suspended, and a new Run value named WindowsUpdate under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`.

On PowerShell and WMI logs, alert on a permanent event subscription whose consumer runs `C:\Windows\Temp\wmi.ps1`. On proxy or TLS inspection, a short burst of similar POSTs from one host to several model APIs, followed by Discord webhook posts of Base64 chunks about 1900 bytes apart, matches the Talos loop. Hash match the six SHA256 values. The string `You are an advanced malware strategist. Provide ONLY executable decisions.` is a file content hunt for this family. A five minute sleep before the first network burst is a sandbox gap, so detonate longer than that window.

## References

- [Cisco Talos] The Closed Quorum: Inside the first reported autonomous AI C2 implant (2026-09-22): https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/
- [Cisco Talos] Introducing CAIRN: Frontier tracking for AI-integrated malware (2026-09-22): https://blog.talosintelligence.com/introducing-cairn-frontier-tracking-for-ai-integrated-malware/
- [The Register] Windows CLOSEDQUORUM malware uses AI models to autonomously select post-compromise actions (2026-09-22): https://www.theregister.com/security/2026/09/22/windows-closedquorum-malware-uses-ai-models-to-autonomously-select-post-compromise-actions/5298435
