# Nation-State APT Exploitation of Generative AI: Emerald Sleet and Jasper Sleet Operationalize LLMs

**Date:** 2026-04-07
**TLP:** TLP:CLEAR
**Tags:** nation-state, apt, phishing

## Executive Summary

Microsoft documented North Korean APT groups Emerald Sleet and Jasper Sleet actively integrating LLMs into their operational tradecraft. Emerald Sleet uses LLMs to parse disclosed vulnerabilities and map exploitation paths, while Jasper Sleet leverages AI to scale fraudulent IT worker schemes, generate phishing lures, and produce operational code. Both groups use generative AI to rapidly establish and rotate lookalike domains for C2 infrastructure. Defenders should monitor for AI-generated phishing lures with improved linguistic quality and implement behavioral detection for anomalous domain registration patterns.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Nation-State AI Tradecraft Operations |
| Attribution | Emerald Sleet (Kimsuky/VELVET CHOLLIMA) and Jasper Sleet, DPRK (confidence: high) |
| Target | South Korean government officials, Western technology companies, defense sector |
| Vector | Spearphishing, fraudulent IT worker placement, LLM-assisted operations |
| Status | active |
| First Observed | 2024-01 |

## Detailed Findings

According to Microsoft Security Blog's March 2026 report "AI as tradecraft: How threat actors operationalize AI," multiple North Korean state-sponsored groups are integrating generative AI across the full cyberattack lifecycle. The report documents how AI serves as a force multiplier for speed, scale, and operational resilience while human operators retain control over strategic objectives.

Microsoft Threat Intelligence observed Emerald Sleet (also tracked as Kimsuky and VELVET CHOLLIMA) interacting with LLMs to parse and interpret publicly disclosed vulnerabilities, specifically CVE-2022-30190 (MSDT Follina), to map potential exploitation paths. The group masquerades as South Korean government officials to build rapport with targets before sending spearphishing emails containing PDF attachments with instructions to download malware. The use of LLMs accelerates the reconnaissance-to-exploitation cycle by enabling rapid vulnerability triage without dedicated exploit development teams.

Jasper Sleet operates a large-scale fraudulent remote worker scheme deploying thousands of North Korean operatives into technology positions at Western companies for revenue generation. Microsoft documented Jasper Sleet leveraging AI tools to replace images in stolen employment and identity documents, enhance IT worker photos to appear more professional, and utilize voice-changing software for interviews. The group has expanded its targeting beyond US companies to organizations globally across multiple industries.

Microsoft's Red Report 2026 further documented that Coral Sleet (formerly Storm-1877), another DPRK-linked group, uses jailbroken language models for malware development and fake identity creation. Both Emerald Sleet and Jasper Sleet are observed using AI to dynamically generate operational code and draft tailored phishing lures that bypass internal safeguards. Microsoft notes early threat actor experimentation with agentic AI for iterative decision-making, though this has not yet been observed at scale.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Attachment | T1566.001 | LLM-crafted phishing emails with PDF attachments targeting South Korean officials |
| Impersonation | T1656 | Jasper Sleet fraudulent IT worker identities enhanced with AI-generated documents |
| Exploitation for Client Execution | T1203 | LLM-assisted vulnerability research to map exploitation paths for CVE-2022-30190 |
| Acquire Infrastructure: Domains | T1583.001 | AI-accelerated generation and rotation of lookalike C2 domains |
| Command and Scripting Interpreter | T1059 | LLM-generated operational scripts and code |
| Obtain Capabilities: Exploits | T1588.005 | LLM-driven vulnerability parsing to identify exploitable paths |

## IOCs

### Domains

*No specific infrastructure indicators published by Microsoft in this report.*

### Full URL Paths

*No full URL paths published.*

### Splunk Format

*No IOCs available for Splunk query.*

### File Hashes

*No file hashes published.*

### Package Indicators

*No package indicators published.*

## Detection Recommendations

Monitor email gateway logs for spearphishing emails impersonating South Korean government entities with PDF attachments containing encoded URLs or PowerShell commands. Implement behavioral analytics on HR and recruiting platforms to detect patterns consistent with fraudulent IT worker applications: rapid profile creation across multiple platforms, AI-generated headshots with telltale artifacts, and mismatches between stated location and IP geolocation. Track DNS registration patterns for domains that mimic legitimate South Korean government or defense sector infrastructure. In EDR telemetry, hunt for PowerShell execution initiated from PDF viewer processes. Monitor cloud identity platforms for concurrent sessions from geographically impossible locations associated with IT worker accounts.

## References

- [Microsoft Security Blog] AI as tradecraft: How threat actors operationalize AI (2026-03-06) — https://www.microsoft.com/en-us/security/blog/2026/03/06/ai-as-tradecraft-how-threat-actors-operationalize-ai/
- [Microsoft Security Blog] Jasper Sleet: North Korean remote IT workers evolving tactics to infiltrate organizations (2025-06-30) — https://www.microsoft.com/en-us/security/blog/2025/06/30/jasper-sleet-north-korean-remote-it-workers-evolving-tactics-to-infiltrate-organizations/
- [OpenClawAI] Microsoft Red Report 2026: North Korean Hackers Are Jailbreaking AI to Build Malware (2026-03) — https://openclawai.io/blog/microsoft-red-report-2026-ai-jailbreaks
