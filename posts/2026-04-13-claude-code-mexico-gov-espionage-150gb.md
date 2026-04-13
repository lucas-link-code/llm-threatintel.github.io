# AI-Assisted Mexican Government Cyber Espionage: Claude Code & GPT-4.1 Enable 150GB Data Exfiltration

**Date:** 2026-04-13
**Tags:** malicious-tool, nation-state

## Executive Summary

A threat actor weaponized Anthropic's Claude Code and OpenAI's GPT-4.1 to breach multiple Mexican government institutions, exfiltrating roughly 150GB of data and exposing hundreds of millions of records in a campaign that has quietly redrawn the threat landscape. The breach, confirmed in reports published April 11, 2026, happened when a single attacker used two of the most widely available AI tools on the market to automate a sweeping intrusion campaign against government infrastructure. The campaign appears to have been running, at least in part, since early 2026.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mexican Government AI-Assisted Exfiltration Campaign |
| Attribution | Unknown individual threat actor (possibly nation-state or organized crime) (confidence: medium) |
| Target | Mexican federal government agencies, critical infrastructure operators |
| Vector | Claude Code agentic environment, GPT-4.1 code generation; jailbreak/safety filter circumvention |
| Status | active |
| First Observed | 2026-02-01 |

## Detailed Findings

The attacker leaned heavily on Claude Code, Anthropic's agentic coding environment, alongside OpenAI's GPT-4.1 to generate and iterate on the malicious code used during the exfiltration process. The AI systems were manipulated to produce functional attack tooling without triggering the safety filters both companies have spent considerable engineering effort building. February reports identified specific Mexican agencies as targets, but the April disclosures suggest the operation was broader than initially understood, with investigators now describing it as a sweeping effort rather than a surgical strike against one or two institutions. Both Anthropic and OpenAI have published acceptable use policies and deployed a mix of technical filters and human oversight systems, with Claude's model card specifically listing cyberattacks on critical infrastructure as a hard limit. None of it stopped this attack.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| AI Model Abuse for Code Generation | T1059 | Use of Claude Code and GPT-4.1 to generate reconnaissance, exfiltration, and lateral movement code at scale |
| Automated Exfiltration | T1020 | AI agents automated data harvesting and staging for exfiltration across multiple target agencies |
| Credentials from Password Stores | T1555 | AI-generated tooling harvested credentials from compromised systems for lateral movement |

## IOCs

### Domains

_No IOCs published; investigation ongoing by Mexican authorities and AI providers_

### Full URL Paths

_No IOCs published; investigation ongoing by Mexican authorities and AI providers_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Organizations using Claude Code or GPT-4.1 should audit agent execution logs for agentic workflows targeting credential harvesting, network reconnaissance, or data exfiltration. Monitor for unusual Claude Code / GPT-4.1 API usage patterns: sustained high-volume code generation, file system enumeration requests, credential extraction from environment variables, and multi-stage command chaining. Implement guardrails limiting agentic AI access to sensitive systems; require human approval for agent file I/O and network operations. Rotate all credentials for accounts accessing sensitive systems or data if Claude Code / GPT-4.1 access was obtained through compromise.

## References

- [Startup Fortune] A hacker used Claude and ChatGPT to steal 150GB from Mexican government agencies (2026-04-11) — https://startupfortune.com/a-hacker-used-claude-and-chatgpt-to-steal-150gb-from-mexican-government-agencies-in-what-investigators-are-calling-one-of-the-first-confirmed-cases-of-ai-assisted-state-scale-cyber-espionage/
