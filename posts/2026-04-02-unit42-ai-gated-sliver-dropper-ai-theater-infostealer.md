# Unit 42 Analyzes First In-the-Wild AI-Gated Malware: LLM-Controlled Sliver Dropper and AI-Theater .NET Infostealer

**Date:** 2026-04-02
**Tags:** ai-malware, infostealer, sliver, llm-c2, malware-analysis

## Executive Summary

Unit 42 published analysis on March 19, 2026 of two malware samples representing distinct categories of real-world AI integration in malware: (1) an AI-theater .NET infostealer trio that incorporates OpenAI GPT-3.5-Turbo via HTTP but does so superficially with no practical security impact; and (2) a novel Golang malware dropper for Sliver C2 that uses an LLM to perform environment assessment and decide whether to proceed with infection — an 'AI-gated execution' approach that could be more effective than static allow/deny lists. Both samples were identified through OSINT hunting. IOC hashes are published and should be ingested immediately.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI-Gated Sliver Dropper / AI-Theater Infostealer |
| Attribution | Unknown (confidence: none) |
| Target | Unknown — samples discovered via OSINT; potential victims include enterprise environments where Sliver C2 would be deployed |
| Vector | Unknown initial delivery vector; both samples discovered via open-source intelligence hunting |
| Status | active |
| First Observed | 2026-03 |

## Detailed Findings

According to Unit 42's report published March 19, 2026, researchers identified two categories of malware demonstrating real-world AI integration, both sourced from OSINT hunting:

**AI Theater: .NET Infostealer Trio.** Three highly similar .NET information stealer samples were found to incorporate the OpenAI GPT-3.5-Turbo model via HTTP API calls. Unit 42 assessed this integration as 'AI theater' — the LLM API calls do not meaningfully enhance the malware's capabilities and appear to provide only an illusion of AI functionality. The samples may have been generated with AI assistance or produced by an inexperienced developer. Unit 42 published three SHA256 hashes: 1b6326857fa635d396851a9031949cfdf6c806130767c399727d78a1c2a0126c, 02ce798981fb2aa68776e53672a24103579ca77a1d3e7f8aaeccf6166d1a9cc6, and 7c7b7b99f248662a1f9aea1563e60f90d19b0ee95934e476c423d0bf373f6493.

**AI-Gated Execution: Golang Sliver Dropper.** A more technically significant sample is a Golang-based malware dropper for Sliver, an open-source adversary emulation framework. This dropper performs a system survey collecting its own process name and parent process name, then decrypts Donut shellcode but — critically — does NOT immediately execute it. Instead, it sends the collected system data to a remote LLM via API and queries whether the environment appears 'safe' to proceed with infection. Unit 42 published the SHA256 hash for this sample: 052d5220529b6bd4b01e5e375b5dc3ffd50c4b137e242bbfb26655fd7f475ac6.

Unit 42 noted this AI-gated approach is conceptually more sophisticated than static allow/deny lists because LLMs can make more nuanced contextual connections between data points. The log output of the dropper misleadingly states the Sliver payload is 'AI-powered,' which Unit 42 confirmed is false — the LLM only gates execution, not the payload itself. The researchers assessed this represents a genuine evolution in malware sandbox evasion: by delegating the sandbox/analyst detection decision to a remote LLM, the dropper avoids hard-coded heuristics that defenders may have signatures for.

Unit 42 assessed the current landscape as 'characterized by experimentation and uneven integration,' while noting that a logical next evolution would be locally executing a small language model or ML classifier for environment assessment, removing the dependency on external LLM API calls that could be blocked or monitored.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Virtualization/Sandbox Evasion | T1497 | The AI-gated Sliver dropper uses a remote LLM to evaluate collected system environment data and decide whether the environment is safe to proceed with infection, replacing static sandbox detection heuristics. |
| Command and Control: Application Layer Protocol: Web Protocols | T1071.001 | The Sliver dropper queries a remote LLM API over HTTPS to receive the execution decision before proceeding with Donut shellcode decryption and Sliver deployment. |
| Steal or Forge Authentication Certificates | T1649 | The .NET infostealer samples are designed to harvest sensitive credentials; AI integration via GPT-3.5-Turbo API is assessed as non-functional AI theater. |
| Obfuscated Files or Information: Software Packing | T1027.002 | The Sliver dropper decrypts Donut shellcode but conditions detonation on a remote LLM decision, adding an LLM-based evasion layer over standard shellcode unpacking. |

## IOCs

### Domains

_All four SHA256 hashes sourced directly from Unit 42 report at https://unit42.paloaltonetworks.com/ai-use-in-malware/. Hashes 1b6326..., 02ce79..., and 7c7b7b... are for the three .NET AI-theater infostealer samples. Hash 052d52... is for the Golang AI-gated Sliver dropper. No C2 domains or IPs published by Unit 42 for these samples._

### Full URL Paths

_All four SHA256 hashes sourced directly from Unit 42 report at https://unit42.paloaltonetworks.com/ai-use-in-malware/. Hashes 1b6326..., 02ce79..., and 7c7b7b... are for the three .NET AI-theater infostealer samples. Hash 052d52... is for the Golang AI-gated Sliver dropper. No C2 domains or IPs published by Unit 42 for these samples._

### Splunk Format

_No IOCs available for Splunk query_

### File Hashes

```
1b6326857fa635d396851a9031949cfdf6c806130767c399727d78a1c2a0126c
02ce798981fb2aa68776e53672a24103579ca77a1d3e7f8aaeccf6166d1a9cc6
7c7b7b99f248662a1f9aea1563e60f90d19b0ee95934e476c423d0bf373f6493
052d5220529b6bd4b01e5e375b5dc3ffd50c4b137e242bbfb26655fd7f475ac6
```

## Detection Recommendations

1. EDR: Add all four published SHA256 hashes to IOC blocklists immediately (hashes above). 2. Network: Monitor for outbound HTTPS connections to api.openai.com from non-browser, non-enterprise-approved processes — particularly from process names associated with newly spawned executables; this is an indicator of either AI-theater infostealer or AI-gated dropper activity. 3. Memory/Behavioral: Alert on Donut shellcode injection patterns in Golang-compiled binaries that perform an outbound HTTPS call immediately before shellcode execution (the LLM decision query step). 4. OSINT Hunting: Unit 42 notes these samples were found via OSINT; security teams should run periodic hunts on VirusTotal and threat intel platforms for Golang binaries making API calls to LLM endpoints before shellcode detonation. 5. Sliver Detection: Ensure existing Sliver C2 detection rules are active in EDR; the AI gating does not change the Sliver payload itself.

## References

- [Unit 42 / Palo Alto Networks] Analyzing the Current State of AI Use in Malware (2026-03-19) — https://unit42.paloaltonetworks.com/ai-use-in-malware/
