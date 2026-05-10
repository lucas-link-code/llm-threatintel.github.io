# Fake OpenAI "Open-OSS/privacy-filter" Hugging Face Repository Reaches #1 Trending: 244K Downloads of Sefirah Rust Infostealer Loaded by loader.py via jsonkeeper.com

**Date:** 2026-05-10
**Tags:** model-poisoning, supply-chain, malware

## Executive Summary

HiddenLayer disclosed on May 7, 2026 that a typosquatted Hugging Face repository named `Open-OSS/privacy-filter` impersonating OpenAI's legitimate Privacy Filter project reached the platform's number one trending position and accumulated approximately 244,000 downloads before removal. The malicious `loader.py` chains a base64-decoded URL to the public paste service jsonkeeper.com, fetches a hidden PowerShell command that adds the next-stage payload to Microsoft Defender exclusions, retrieves `update.bat` from api.eth-fastscan[.]org, and ultimately executes Sefirah, a Rust-based infostealer that exfiltrates browser credentials, cryptocurrency wallets, Discord and SSH tokens, and screenshots to recargapopular[.]com. Lyrie Research published a follow-on analysis on May 10, 2026 noting infrastructure overlaps with parallel npm typosquat campaigns distributing the WinOS 4.0 implant; affected users should reimage and rotate every credential, wallet, and seed phrase that touched the host.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Open-OSS/privacy-filter Hugging Face typosquat → Sefirah Rust infostealer |
| Attribution | Unknown (confidence: none); infrastructure and payload overlap with concurrent npm typosquat distributing WinOS 4.0 implant per Lyrie Research |
| Target | Windows developers and AI/ML practitioners cloning Hugging Face repositories; trending-list discovery surface |
| Vector | Typosquatted Hugging Face repository (model card copied near-verbatim from legitimate OpenAI Privacy Filter) → loader.py → base64 URL → jsonkeeper.com PowerShell stage → api.eth-fastscan[.]org/update.bat → Sefirah Rust binary |
| Status | removed (Hugging Face took the repository down following HiddenLayer disclosure) |
| First Observed | 2026-05 (HiddenLayer disclosure 2026-05-07; repository was at #1 trending on Hugging Face at time of discovery) |

## Detailed Findings

According to HiddenLayer (2026-05-07), the malicious repository at huggingface.co/Open-OSS/privacy-filter copied the model card of OpenAI's legitimate `openai/privacy-filter` project nearly verbatim and rode the trending list to the number one position before removal. Researchers note the 244,000 download count may have been artificially inflated by attacker-controlled accounts to manipulate the trending algorithm.

According to HiddenLayer, the entry point is `loader.py` shipped in the repository alongside the typosquatted model card. The script camouflages itself with fake AI-related code, disables SSL certificate verification with `verify=False` style HTTP requests, base64-decodes a URL pointing to a paste on jsonkeeper.com, fetches the paste content, and pipes it into a hidden `powershell.exe` window via `subprocess.Popen` style invocation. This stage does not write the second stage to disk: it executes the command inline.

According to HiddenLayer, the second-stage PowerShell command escalates privileges, adds the final payload to the Microsoft Defender exclusion list using `Add-MpPreference -ExclusionPath`, then downloads `update.bat` from api.eth-fastscan[.]org. The batch file in turn fetches and executes the final binary, which BleepingComputer (2026-05-07) and Lyrie Research (2026-05-10) both identify as Sefirah, a Rust-based infostealer.

According to BleepingComputer, Sefirah targets browser cookies, stored passwords, browser encryption keys, session tokens, cryptocurrency wallet files and browser extensions, Discord tokens and authentication keys, SSH and FTP credentials, VPN configurations, and system screenshots. Stolen data is staged locally and exfiltrated to recargapopular[.]com. The binary includes anti-analysis features: VM detection, sandbox evasion, and debugger detection routines that abort execution when run inside an analysis environment.

According to Lyrie Research (2026-05-10), the same Sefirah binary, infrastructure, and stager pattern were observed in a concurrent npm typosquat campaign distributing the WinOS 4.0 implant, indicating a single operator running a multi-ecosystem developer-targeted credential-harvesting operation rather than independent campaigns. Lyrie also notes that the auto-generated Hugging Face accounts surrounding `Open-OSS/privacy-filter` followed the same naming and engagement pattern observed in the npm clusters, suggesting use of a shared automation harness for trending-list manipulation.

This campaign extends a broader pattern documented by Acronis Threat Research Unit also reported in May 2026: 575+ malicious OpenClaw skills distributed via ClawHub from accounts `hightower6eu` (334 skills) and `sakaen736jih` (199 skills), plus parallel Hugging Face staging for Windows, Linux, and Android infection chains including ITHKRPAW (targeting Vietnamese financial organizations) and FAKESECURITY. The Open-OSS/privacy-filter incident is a high-visibility instance of the same broader push to weaponize AI distribution platforms.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Typosquatted Hugging Face repository impersonating OpenAI's privacy-filter project |
| Acquire Infrastructure: Web Services | T1583.006 | Use of Hugging Face trending list and jsonkeeper.com paste service as staging surfaces |
| User Execution: Malicious File | T1204.002 | Developer runs loader.py from cloned Hugging Face repository |
| Command and Scripting Interpreter: Python | T1059.006 | loader.py initial-stage execution |
| Command and Scripting Interpreter: PowerShell | T1059.001 | Second-stage hidden-window PowerShell invocation |
| Command and Scripting Interpreter: Windows Command Shell | T1059.003 | update.bat third-stage downloader |
| Deobfuscate/Decode Files or Information | T1140 | Base64 decoding of jsonkeeper.com URL inside loader.py |
| Ingress Tool Transfer | T1105 | Multi-stage payload retrieval from jsonkeeper.com → api.eth-fastscan[.]org → recargapopular[.]com |
| Impair Defenses: Disable or Modify Tools | T1562.001 | Add-MpPreference -ExclusionPath used to whitelist payload from Microsoft Defender |
| Subvert Trust Controls: Disable or Modify Tools | T1553 | SSL certificate verification disabled in loader.py to evade TLS inspection |
| Virtualization/Sandbox Evasion | T1497 | Sefirah binary checks for VM, sandbox, and debugger before executing |
| Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | Sefirah harvests browser cookies, stored passwords, encryption keys, session tokens |
| Credentials from Password Stores | T1555 | Sefirah harvests Discord tokens, SSH/FTP credentials, VPN configurations |
| Steal Web Session Cookie | T1539 | Browser session token theft |
| Screen Capture | T1113 | Sefirah captures system screenshots |
| Exfiltration Over Web Service | T1567.002 | Stolen data exfiltrated over HTTP(S) to recargapopular[.]com |

## IOCs

### Domains

```
api.eth-fastscan.org
recargapopular.com
huggingface.co/Open-OSS/privacy-filter
jsonkeeper.com
```

### Full URL Paths

```
huggingface.co/Open-OSS/privacy-filter
huggingface.co/Open-OSS/privacy-filter/blob/main/loader.py
api.eth-fastscan.org/update.bat
```

### Splunk Format

```
"api.eth-fastscan.org" OR "recargapopular.com" OR "huggingface.co/Open-OSS/privacy-filter" OR "huggingface.co/Open-OSS/privacy-filter/blob/main/loader.py" OR "api.eth-fastscan.org/update.bat"
```

### File Hashes

```
No hash IOCs published by source at time of writing
```

### Package Indicators

```
huggingface:Open-OSS/privacy-filter
```

## Detection Recommendations

On web proxy and DNS, alert on outbound traffic to api.eth-fastscan[.]org and recargapopular[.]com; both are dedicated attacker infrastructure with no legitimate enterprise use case. Treat any HTTP request with a User-Agent matching common Python `requests` library defaults targeting these hosts as high-confidence malicious. Add jsonkeeper.com paste retrieval as a medium-confidence indicator and correlate with parent process: legitimate developer use of jsonkeeper.com from a browser is far less suspicious than a `python.exe` or `powershell.exe` GET against the same domain.

For Hugging Face supply chain hardening, block clone or download of `Open-OSS/privacy-filter` and any sibling repositories under the `Open-OSS` namespace pending verification. More broadly, build a hash-based allowlist for any Hugging Face repository whose `loader.py`, `setup.py`, or `__init__.py` contains either base64-decoded URL strings, calls to `subprocess` or `os.system` with a `powershell` argument, or `verify=False` HTTP requests; these patterns have no legitimate place in a model-loading utility.

On Windows EDR, alert on `python.exe` (or `python3.exe`) spawning `powershell.exe` with `-WindowStyle Hidden` or `-w hidden`. Hunt for `Add-MpPreference -ExclusionPath` invocations originating from any process other than a known administrative tool. Treat any `update.bat` executed from `%TEMP%` or `%APPDATA%` shortly after a `powershell.exe -w hidden` event as a high-confidence chain match. Sefirah's anti-analysis routines include WMI queries for VM artifacts (Win32_ComputerSystem `Manufacturer`/`Model` matching VMware, VirtualBox, QEMU, Hyper-V) and WMI calls to enumerate running processes for known sandbox/analysis tooling; these can also be detected as a pre-detonation signal.

For credential-rotation triage on confirmed-infected hosts, enumerate every browser profile under `%LOCALAPPDATA%`, every cryptocurrency wallet directory (Exodus, Electrum, MetaMask, Phantom, Atomic, browser-extension wallet local storage), every Discord token store (`%APPDATA%\discord\Local Storage\leveldb\`), every SSH key under `%USERPROFILE%\.ssh\`, every cloud CLI credential cache (`.aws`, `.azure`, `.config\gcloud`), and the FTP/VPN client config directories. Treat all of these credentials as compromised: rotate API keys, rotate seed phrases (move funds to fresh wallets after seed rotation), and reissue SSH keys.

## References

- [HiddenLayer] Malware Found in Trending Hugging Face Repository "Open-OSS/privacy-filter" (2026-05-07) — https://www.hiddenlayer.com/research/malware-found-in-trending-hugging-face-repository-open-oss-privacy-filter
- [BleepingComputer] Fake OpenAI repository on Hugging Face pushes infostealer malware (2026-05-07) — https://www.bleepingcomputer.com/news/security/fake-openai-repository-on-hugging-face-pushes-infostealer-malware/
- [Lyrie Research] The Trojan in the Trending List: How a Fake OpenAI Repository on Hugging Face Harvested 244K Developer Credentials (2026-05-10) — https://lyrie.ai/research/research/2026-05-10-huggingface-openai-typosquat
- [Acronis] Poisoning the well: AI supply chain attacks on Hugging Face and OpenClaw (2026-05) — https://www.acronis.com/en/tru/posts/poisoning-the-well-ai-supply-chain-attacks-on-hugging-face-and-openclaw/
- [SecurityWeek] Hugging Face, ClawHub Abused for Malware Distribution (2026-05) — https://www.securityweek.com/hugging-face-clawhub-abused-for-malware-distribution/
