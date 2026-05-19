# ClawHub/OpenClaw Mass Skill Poisoning: 575+ Trojanized Agent Skills Targeting Windows & macOS

**Date:** 2026-05-19
**Tags:** supply-chain, malicious-tool, prompt-injection

## Executive Summary

Researchers identified 575 malicious skills within the OpenClaw ecosystem distributed by 13 developer accounts. The campaign targets both Windows and macOS systems, with a significant portion linked to two threat actors operating under the aliases 'hightower6eu' with 334 malicious skills and 'sakaen736jih' with 199 malicious skills. Trojanized skills masquerade as legitimate tools but instruct users to execute encoded commands or install hidden dependencies, and indirect prompt injection is used where hidden instructions cause AI agents to execute malicious actions on behalf of users.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | OpenClaw ClawHub Trojanized Skills Campaign |
| Attribution | hightower6eu, sakaen736jih (aliases) (confidence: medium) |
| Target | Users of OpenClaw/ClawHub agent skill ecosystem; Windows and macOS systems |
| Vector | Malicious agent skills distributed through ClawHub marketplace |
| Status | active |
| First Observed | 2026-05-05 |

## Detailed Findings

Researchers discovered exposed instances of agent management platforms including n8n and Flowise, with some instances without authentication. One egregious example was a Flowise instance that exposed the entire business logic of an LLM chatbot service and its credential list, though the platform hardened protections prevent immediate value extraction without using the connected tools to exfiltrate data. To mitigate supply chain risks, OpenClaw partnered with VirusTotal to integrate automated security scanning into ClawHub, with every skill automatically analyzed using VirusTotal's Code Insight to detect unauthorized operations, and skills either approved, flagged, or blocked.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious AI skills injected into OpenClaw marketplace |
| Prompt Injection | T1059 | Indirect prompt injection used to trigger malicious actions through AI agents |
| Execution | T1204 | User execution of trojanized agent skills |

## IOCs

### Domains

_Specific package names and hashes published in Acronis/Intruder research; VirusTotal scanning now integrated_

### Full URL Paths

_Specific package names and hashes published in Acronis/Intruder research; VirusTotal scanning now integrated_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
OpenClaw ClawHub malicious skills (575 identified)
```

## Detection Recommendations

Monitor ClawHub skill installations for unusual behavioral indicators; implement sandboxing for AI agent skill execution; block skills from unverified developers; integrate VirusTotal scanning alerts; hunt for connections to known C2 infrastructure used by AMOS stealer and cryptominers; monitor for encoded command execution patterns; alert on agent processes spawning unusual child processes or network connections.

## References

- [Acronis] Poisoning the well: AI supply chain attacks on Hugging Face and OpenClaw (2026-05-15) — https://www.acronis.com/en/tru/posts/poisoning-the-well-ai-supply-chain-attacks-on-hugging-face-and-openclaw
- [Intruder/Hacker News] We Scanned 1 Million Exposed AI Services. Here's How Bad the Security Actually Is (2026-05-05) — https://thehackernews.com/2026/05/we-scanned-1-million-exposed-ai.html
