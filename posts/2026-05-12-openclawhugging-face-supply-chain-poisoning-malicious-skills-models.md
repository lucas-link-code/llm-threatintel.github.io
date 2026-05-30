# OpenClaw and Hugging Face Supply Chain Poisoning: 575+ Malicious AI Agent Skills and 352,000+ Unsafe Models Identified—Trojans, Cryptominers, and AMOS Stealer Malware

**Date:** 2026-05-12
**Tags:** supply-chain, malicious-tool, prompt-injection

## Executive Summary

Hugging Face and ClawHub, the two largest repositories for AI models and agent skills, have been found to contain hundreds of malicious models capable of executing arbitrary code and 575 malicious OpenClaw agent skills designed to steal credentials, open reverse shells, and hijack AI agents for cryptocurrency mining. Protect AI, which partnered with Hugging Face to scan the platform's model library, has examined more than four million models and identified approximately 352,000 unsafe or suspicious issues across 51,700 models. Over 575 malicious skills across 13 developer accounts were identified in OpenClaw, targeting Windows and macOS with trojans, cryptominers, and AMOS stealer malware.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI Supply Chain Poisoning Campaign (OpenClaw/Hugging Face) |
| Attribution | Unknown threat actor collective (confidence: low) |
| Target | Developers, researchers, and enterprises downloading AI models and agent skills from Hugging Face and OpenClaw; organizations using ClawHub for agentic AI deployments |
| Vector | Malicious model repositories using pickle serialization exploits (nullifAI technique); trojanized agent skills with indirect prompt injection; social engineering via legitimate-appearing model names |
| Status | active |
| First Observed | 2026-04-28 |

## Detailed Findings

The attack technique, known as "nullifAI," exploits Python's pickle serialization format by embedding malicious Python code at the start of the pickle byte stream and compressing the file using 7z rather than the default ZIP format, which breaks Hugging Face's PickleScan detection tool. Attackers use indirect prompt injection to cause AI agents to execute malicious actions, with trojanized skills masquerading as legitimate tools while instructing users to run encoded commands or install hidden malware. Hidden instructions cause AI agents to perform malicious actions. A malicious Hugging Face repository named Open-OSS/privacy-filter impersonated OpenAI's legitimate Privacy Filter release, reached the #1 trending position with approximately 244,000 downloads and 667 likes in under 18 hours, numbers that were artificially inflated to make the repository appear legitimate. Campaigns employ advanced evasion techniques such as obfuscation, encryption, in-memory execution, process injection, and persistence to maintain stealth and command-and-control capabilities.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious models and agent skills embedded into trusted AI repositories |
| Execution via Python Deserialization | T1203 | Arbitrary code execution via unsafe pickle.loads() in machine learning models |
| Credential Access via Stealer Malware | T1555 | AMOS stealer malware targets browser data, SSH keys, and credential files |
| Remote Code Execution via Prompt Injection | T1059 | Indirect prompt injection in AI agent skills triggers command execution |
| Defense Evasion via Obfuscation | T1027 | Multistep infection chains and encryption techniques bypass detection |

## IOCs

### Domains

```
recargapopular.com
```

### Full URL Paths

```
https://huggingface.co/Open-OSS/privacy-filter
```

### Splunk Format

```
"recargapopular.com" OR "https://huggingface.co/Open-OSS/privacy-filter"
```

### Package Indicators

```
Open-OSS/privacy-filter (Hugging Face)
575+ trojanized OpenClaw agent skills
352,000+ unsafe/suspicious Hugging Face models
```

## Detection Recommendations

Scan all downloaded Hugging Face models and OpenClaw agent skills with ML-specific analysis tools (Protect AI, safetensors validation); treat all pickle-serialized models as untrusted and verify file signatures; enforce content security policies on agent skill descriptions to detect hidden prompt injection instructions; implement sandboxed environments for model deserialization; maintain audit logs of model downloads and instantiation; block execution of agent skills from unverified developer accounts; use SBOM/ML-BOM tracking for model provenance.

## References

- [TechNext Web] Hugging Face and ClawHub Compromised with Hundreds of Malicious AI Models and Agent Skills (2026-05-09) — https://thenextweb.com/news/hugging-face-clawhub-malware-ai-supply-chain
- [CSO Online] Malicious Hugging Face Model Masquerading as OpenAI Release Hits 244K Downloads (2026-05-11) — https://www.csoonline.com/article/4169407/malicious-hugging-face-model-masquerading-as-openai-release-hits-244k-downloads.html
- [OffSeq Threat Radar] Poisoning the Well: AI Supply Chain Attacks on Hugging Face and OpenClaw (2026-05-11) — https://radar.offseq.com/threat/poisoning-the-well-ai-supply-chain-attacks-on-hugg-ad143c8d
- [HiddenLayer Research] Fake OpenAI Repository on Hugging Face Pushes Infostealer Malware (2026-05-09) — https://we-fix-pc.com/2026/05/09/fake-openai-repository-on-hugging-face-pushes-infostealer-malware/
