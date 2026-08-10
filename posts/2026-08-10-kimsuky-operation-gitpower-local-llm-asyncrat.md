# Operation GitPower: Kimsuky Uses AI-Generated Lures, Local LLM Tooling, and GitHub-Delivered AsyncRAT

**Date:** 2026-08-10
**Tags:** nation-state, apt, phishing, malware

## Executive Summary

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported that Operation GitPower uses malicious PDF-themed LNK files, PowerShell, scheduled tasks, Git repositories, and RC4-encrypted .NET AsyncRAT payloads against diplomatic, military, security, and virtual-asset targets. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) also recovered Ollama, GPT4All, Msty, AI-development packages, and AI-service activity from operator-side data, but found no training datasets or fine-tuned model outputs and assessed the activity as capability accumulation rather than model training. Defenders should prioritize the published C2 infrastructure, then hunt the LNK-to-PowerShell-to-scheduled-task chain and path-scoped GitHub traffic.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Operation GitPower; RC4-encrypted .NET AsyncRAT payloads ([Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm)) |
| Actor / Attribution | Kimsuky, linked by Genians to North Korea's Reconnaissance General Bureau; Genians did not assign a numeric confidence level and cautioned that individual host or language artifacts are not conclusive alone ([Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm)) |
| Target | Foreign diplomatic missions, military and security organizations, and virtual-asset entities ([Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm)) |
| Vector | ZIP archives delivered by email or other channels containing business- or official-document-themed `.pdf.lnk` files ([Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm)) |
| Status | Active tracking; Genians characterized the AI work as an ongoing research and knowledge-acquisition phase ([Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm)) |
| First Observed | 2023 campaign lineage; AI-generated decoys observed in 2026 ([Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm)) |

## Detailed Findings

### Campaign Continuity and Attribution

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) described Operation GitPower as a continuation of its 2023 and 2024 FlowerPower tracking, not a standalone newly emerged campaign. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) assessed associated GitHub and GitLab activity as Kimsuky-linked and connected the cluster to North Korea's Reconnaissance General Bureau.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) based its attribution on the combined context of LNK lineage, a recurring RTF-header-to-gzip restoration method, the GitHub account `brandonleeodd93-blip`, a Chinese WPS document environment, the host manufacturer string `Arirang`, and North Korean-language forms including `싸이트`, `가입리력`, and `로출되였는지`. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) explicitly cautioned that artifacts such as `Arirang` are insufficient in isolation and treated the combined evidence as the basis for its assessment. [MITRE ATT&CK](https://attack.mitre.org/groups/G0094/) independently identifies Kimsuky as group G0094 and lists Black Banshee, Velvet Chollima, Emerald Sleet, THALLIUM, APT43, TA427, Springtail, Earth Kumiho, and PatheticSlug as associated names.

### Initial Access, Execution, and Persistence

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported ZIP-based delivery of malicious LNK files disguised as business or official documents, including `OOOO July 2026 Practical Strategy Pack.pdf.lnk`. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) found AI-generated decoy themes covering virtual assets, finance, and game development, while metadata in two English-language PDFs recorded `python-docx` as author, `WPS 文字` as creator, and 05:00 creation or modification timestamps on March 11 and March 24, 2026. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) treated those metadata fields as supporting indicators rather than standalone proof of AI use or attribution.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) measured one LNK command at approximately 3,800 characters and observed roughly 300 spaces before the visible payload, a custom Base64 decoder, and split strings used to reconstruct a GitHub Raw download location. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported that the decoded command wrote `%TEMP%\poqpwoqwdjoweij.ps1`, opened `%TEMP%\CONCEPT NOTE of 2026 I-ASEAN Global Youth Camp.pdf` as the decoy, and used a hardcoded GitHub personal access token that had been revoked by publication time.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported that the PowerShell stage created `%AppData%\irujkdnjhgttrhdkfdu.ps1` and registered the hidden scheduled task `ZHUYHJGTYTFSUHIPOKLKHJHUYGVHGNFH`. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) observed a first execution approximately five minutes after registration and repetition every 30 minutes.

### Collection, Git-Based C2, and AsyncRAT

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported that the recurring stage downloaded and executed `%AppData%\lpieuysjfgtrja.ps1`, then deleted it. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported that the chain also retrieved `bhjfjkfgrtwehjbfgcf.txt`, created and executed `%AppData%\ms_update.ps1`, and deleted the script after it collected operating-system version, architecture and configuration data, PC type, installation and boot history, and running processes.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) found that public Git repositories hosted scripts, configuration, and payloads used by the operation. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) identified `apple.png`, `fox.png`, `lion.png`, `rabbit.png`, and `wolf.png` as RC4-encrypted .NET AsyncRAT payloads rather than image files, and reported that the `fox`, `leopard`, `lion`, and `wolf` variants used `112.216.9[.]171` for C2. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) identified `169.254.33[.]137` as a development or testing artifact but did not include it in the published IOC appendix, so it is excluded from the IOC blocks below.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) reported that several months of C2 and storage logs exposed malware development and testing, stolen-data management, and AI research in addition to victim operations. [FortiGuard Labs](https://www.fortinet.com/blog/threat-research/dprk-related-campaigns-with-lnk-and-github-c2) separately reported on April 2, 2026 that a South Korea-focused cluster used decoy-themed LNK files, PowerShell, five-minute-delayed 30-minute scheduled tasks, host and process collection, and GitHub for C2 and data transfer; FortiGuard also identified `brandonleeodd93-blip` among related GitHub accounts. FortiGuard's earlier report corroborates the delivery and GitHub-C2 tradecraft and the shared account, but it does not independently corroborate Genians' local-LLM findings or Operation GitPower attribution.

### Local LLM and AI-Development Environment

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) recovered evidence that the operator installed and executed Ollama, including `.ollama/id_ed25519` and its public key. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) also recovered GPT4All's `LocalDocs-Setup-0.4.2.exe`, application-data paths, `localdocs_v3.db`, and `cache\models3.json`, which the source used to establish that LocalDocs retrieval-augmented generation had been configured. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) additionally found Msty installation and runtime artifacts.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) recovered LLaMaSharp packages for CUDA 11 and CUDA 12, LangChain providers for LLaMaSharp, Microsoft Semantic Kernel, Microsoft Agents AI, Microsoft Extensions AI, OpenAI and Azure OpenAI packages, plus Whisper and faster-whisper artifacts. [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) assessed these packages as evidence of learning and integration work, not proof that the actor had trained a model.

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) found Cursor installers and usage records and recovered a ChatGPT query that translated as, “How do I disable the Report feature in Microsoft Defender?” [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) found no training dataset or fine-tuned-model output and therefore characterized the AI activity as use and integration of existing tools during a research and knowledge-acquisition stage.

## MITRE ATT&CK Mapping

The following analyst mapping applies the behavior reported by [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) to the current technique names and IDs published by [MITRE ATT&CK](https://attack.mitre.org/groups/G0094/).

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Attachment | T1566.001 | ZIP-delivered document-themed malicious LNK attachments |
| User Execution: Malicious File | T1204.002 | Victim execution of a `.pdf.lnk` file disguised as a document |
| Masquerading: Double File Extension | T1036.007 | `.pdf.lnk` filenames concealed the LNK file type |
| Command and Scripting Interpreter: PowerShell | T1059.001 | LNK arguments launched the staged PowerShell chain |
| Obfuscated Files or Information: Command Obfuscation | T1027.010 | Long LNK arguments used padding, split strings, and custom Base64 decoding |
| Deobfuscate/Decode Files or Information | T1140 | PowerShell decoded embedded content and RC4-encrypted AsyncRAT payloads |
| Scheduled Task/Job: Scheduled Task | T1053.005 | A hidden task started after approximately five minutes and repeated every 30 minutes |
| System Information Discovery | T1082 | `ms_update.ps1` collected OS, architecture, PC-type, installation, and boot data |
| Process Discovery | T1057 | `ms_update.ps1` enumerated running processes |
| System Network Configuration Discovery | T1016 | Collection produced IP- and time-labeled infection records and network context |
| Web Service: Bidirectional Communication | T1102.002 | Git repositories supplied commands and payloads and received victim data |
| Ingress Tool Transfer | T1105 | PowerShell downloaded follow-on scripts and encrypted AsyncRAT payloads |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | Operator systems contained Ollama, GPT4All, Msty, and AI-development libraries used for capability acquisition and integration |
| Query Public AI Services | T1682 | Operator-side artifacts contained a ChatGPT query about a Microsoft Defender reporting feature |

## IOCs

[Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) published seven C2 IP addresses, one domain, 18 email addresses, and 46 unlabeled MD5 values in its appendix. The source did not publish SHA256 equivalents or map the MD5 values to filenames or artifact roles, so the MD5 values are excluded from this report's actionable IOC block and the machine-readable feed. The blocks below reproduce the attributable network and account indicators without adding the testing-only `169.254.33[.]137` address. Network and email indicators are defanged for display.

### Domains

```
stoks.great-site[.]net
```

### Full URL Paths

```
No URL IOCs published by Genians Security Center
```

### Splunk Format

```
"*stoks.great-site.net*" OR "*112.216.9.171*" OR "*170.205.29.83*" OR "*170.205.30.227*" OR "*185.27.134.140*" OR "*27.102.137.126*" OR "*27.102.137.159*" OR "*27.102.138.44*"
```

### IP Addresses

```
112.216.9[.]171
170.205.29[.]83
170.205.30[.]227
185.27.134[.]140
27.102.137[.]126
27.102.137[.]159
27.102.138[.]44
```

### File Hashes

```
No SHA256 hashes published by Genians Security Center. The source's 46 unlabeled MD5 values are retained at the source page for analyst review but are not promoted to this feed without artifact mapping or independently verified SHA256 equivalents.
```

### Email Addresses

```
apollo1030109@gmail[.]com
awed33@outlook[.]kr
belendong40@gmail[.]com
brandonleeodd.93@gmail[.]com
contrasde@outlook[.]kr
devlion413@gmail[.]com
eros1030109@gmail[.]com
hera1030109@gmail[.]com
holowin401@gmail[.]com
holowin@gmail[.]com
jecoma@outlook[.]kr
johnstones19850308@gmail[.]com
johnstones8888@outlook[.]com
kkkkk79@outlook[.]kr
tomas3015@outlook[.]kr
trungvo5131993@gmail[.]com
tttsssuuu@outlook[.]kr
whitewolf20000312@gmail[.]com
```

## Detection Recommendations

**Email and file telemetry:** Block or quarantine archive contents matching `*.pdf.lnk`, and alert when an LNK with a document-themed double extension launches `powershell.exe`. Inspect LNK argument length and raw command text for large whitespace runs, split `raw.githubusercontent.com` strings, Base64-decoder logic, or `%TEMP%\poqpwoqwdjoweij.ps1`; these checks derive from the LNK behavior documented by [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm).

**EDR process and file telemetry:** Correlate LNK execution with hidden PowerShell, creation of `%AppData%\irujkdnjhgttrhdkfdu.ps1`, `%AppData%\lpieuysjfgtrja.ps1`, or `%AppData%\ms_update.ps1`, and subsequent deletion of staged scripts. Alert on creation or execution of files named `apple.png`, `fox.png`, `lion.png`, `rabbit.png`, or `wolf.png` when PE/.NET file signatures or runtime behavior contradict the `.png` extension; these filenames and behaviors were published by [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm).

**Scheduled-task telemetry:** Alert on task name `ZHUYHJGTYTFSUHIPOKLKHJHUYGVHGNFH`, hidden tasks launched by PowerShell from user-writable paths, and tasks configured to start after five minutes and repeat every 30 minutes. Correlate `Microsoft-Windows-TaskScheduler/Operational` events with PowerShell process creation because [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) observed that exact persistence cadence.

**DNS, proxy, and firewall telemetry:** Match the defanged domain and seven C2 IPs above after normalizing them to raw values inside the detection platform. Preserve full URI paths and repository-owner strings for GitHub traffic, and alert when PowerShell accesses GitHub Raw or API endpoints immediately before script creation, scheduled-task execution, or outbound C2; [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) and [FortiGuard Labs](https://www.fortinet.com/blog/threat-research/dprk-related-campaigns-with-lnk-and-github-c2) both documented GitHub-backed PowerShell chains, so blocking the shared GitHub domains is not an appropriate control.

**AI-development artifacts:** On a confirmed Operation GitPower operator or compromised development system, preserve Ollama, GPT4All LocalDocs, Msty, Cursor, Semantic Kernel, LLaMaSharp, Whisper, and related package artifacts for timeline analysis. Do not treat these legitimate tools as standalone IOCs; correlate them with the published accounts, C2, LNK lineage, or Git-based payload artifacts because [Genians Security Center](https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm) based its assessment on combined context.

## References

- [Genians Security Center] Kimsuky Integrates AI into Attack Operations, From AI-Generated Decoy Documents to a Local LLM (2026-08-10) — https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm
- [FortiGuard Labs] DPRK-Related Campaigns with LNK and GitHub C2 (2026-04-02) — https://www.fortinet.com/blog/threat-research/dprk-related-campaigns-with-lnk-and-github-c2
- [MITRE ATT&CK] Kimsuky, Group G0094 (last modified 2026-07-31) — https://attack.mitre.org/groups/G0094/
- [MITRE ATT&CK] Obtain Capabilities: Artificial Intelligence, T1588.007 (last modified 2026-05-12) — https://attack.mitre.org/techniques/T1588/007/
- [MITRE ATT&CK] Query Public AI Services, T1682 (last modified 2026-05-12) — https://attack.mitre.org/techniques/T1682/
