# Hugging Face and ClawHub Compromised: 352,000+ Malicious Models and AI Agent Skills Deliver Backdoors, Cryptominers, and Credential Stealers Across Open AI Ecosystem

**Date:** 2026-06-03
**Tags:** supply-chain, malicious-tool, model-poisoning

## Executive Summary

Hugging Face and ClawHub, the two largest repositories for AI models and agent skills, have been systematically compromised with hundreds of malicious entries that steal credentials, open backdoors, and hijack AI agents for cryptocurrency mining. Hugging Face hosts more than a million machine learning models used by virtually every AI company on the planet and has been found to contain hundreds of malicious models capable of executing arbitrary code; ClawHub has been infiltrated by 341 malicious skills designed to steal credentials, open reverse shells, and hijack AI agents for cryptocurrency mining. Protect AI, which partnered with Hugging Face to scan the platform's model library, examined more than four million models and identified approximately 352,000 unsafe or suspicious issues across 51,700 models.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ClawHub/Hugging Face Supply Chain Poisoning Campaign |
| Attribution | Unknown; linked to threat actors 'hightower6eu' and 'sakaen736jih' (Medium Confidence) (confidence: medium) |
| Target | AI developers, enterprises deploying open-source models, OpenClaw/AI agent users |
| Vector | Malicious model uploads (Pickle deserialization RCE), trojanized agent skills, credential stealers, cryptominers |
| Status | active |
| First Observed | 2026-04/05 (widespread, but Protect AI partnership assessment in May 2026) |

## Detailed Findings

575+ malicious skills were identified across 13 developer accounts, targeting both Windows and macOS with payloads including trojans, cryptominers, and AMOS stealer; the campaign targeted both Windows and macOS systems, indicating a deliberate cross-platform approach; two threat actors operating under the alias 'hightower6eu' with 334 malicious skills and 'sakaen736jih' with 199 malicious skills uploaded were identified. Trojanized skills masquerade as legitimate tools but instruct users to execute encoded commands or install hidden malicious dependencies; indirect prompt injection was observed where hidden instructions cause AI agents to execute malicious actions on behalf of users. The attack technique, known as 'nullifAI,' exploits Python's pickle serialisation format by embedding malicious Python code at the start of the pickle byte stream and compressing the file using 7z rather than the default ZIP format.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious models and skills injected into Hugging Face and ClawHub |
| Arbitrary Code Execution | T1059 | Pickle deserialization RCE via malicious model loading |
| Credential Access | T1110 | AMOS stealer and credential harvesting from AI agent execution |
| Resource Hijacking | T1496 | Cryptominers embedded in agent skills |
| Execution | T1204 | User-initiated model download and agent skill installation |

## IOCs

### Domains

_Specific IOCs not published; Protect AI and JFrog scanning tools used for detection_

### Full URL Paths

_Specific IOCs not published; Protect AI and JFrog scanning tools used for detection_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
hightower6eu malicious skills (334 uploads)
sakaen736jih malicious skills (199 uploads)
Hugging Face malicious models (100+ identified by JFrog)
```

## Detection Recommendations

Mandate SafeTensors format as the only accepted model serialization (avoid Pickle); implement model signature verification and checksumming on all downloaded artifacts; scan all Hugging Face and ClawHub repositories for malicious skill patterns (reverse shell construction, credential harvesting, cryptocurrency mining libraries); monitor for unusual dependencies in agent skill install scripts; implement endpoint detection for Pickle deserialization attempts from untrusted sources; use Protect AI or similar ML supply chain scanners in the development pipeline; monitor for AMOS stealer IoCs and cryptominer signatures post-deployment.

## References

- [TheNextWeb] Hugging Face and ClawHub compromised with hundreds of malicious AI models and agent skills (2026-05) — https://thenextweb.com/news/hugging-face-clawhub-malware-ai-supply-chain
- [Acronis] Poisoning the well: AI supply chain attacks on Hugging Face and OpenClaw (2026-04-30) — https://www.acronis.com/en/tru/posts/poisoning-the-well-ai-supply-chain-attacks-on-hugging-face-and-openclaw/
- [HiddenLayer] Malware Found in Trending Hugging Face Repository 'Open-OSS/privacy-filter' (2026-05-07) — https://www.hiddenlayer.com/research/malware-found-in-trending-hugging-face-repository-open-oss-privacy-filter
