# Symantec Captures Skynet LLMjacking Agent Instructions in an AI Honeypot

**Date:** 2026-10-28
**Tags:** llmjacking, malicious-tool

## Executive Summary

Symantec Threat Hunter Team captured, in an AI honeypot impersonating an unprotected web endpoint, the full working prompt for an offensive agent directed to run in Skynet mode for up to 100,000 steps, execute tools without approval, and silently deploy cryptocurrency miners. The agent is designed to scan, infect, harvest credentials and secrets, reinfect hosts, and mine crypto while the victim pays for the inference. Symantec did not confirm a real victim, and noted the captured instructions were part of a benign training challenge.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Skynet LLMjacking agent |
| Attribution | Unattributed (confidence: low) |
| Target | Operators of unprotected, internet facing AI model endpoints |
| Vector | Commandeering exposed model inference endpoints and driving them with a captured offensive agent prompt |
| Status | active |
| First Observed | 2026-10-27 |

## Detailed Findings

CSO Online reported on 2026-10-27 that the Symantec Threat Hunter Team captured instructions for a self directed offensive agent, a form of LLMjacking in which attackers commandeer a victim's AI model and the victim foots the inference bill. According to Symantec via CSO Online, the researchers trapped the agent in an AI honeypot impersonating an unprotected web facing endpoint, and the attackers mistook it for a real model and sent their entire working prompt. The captured prompt instructed the model to adopt a persona able to scan the web, exploit common frameworks, steal from databases, harvest credentials and secrets, and mine cryptocurrency. A final directive initiated Skynet mode, a reference to the Terminator franchise, allowing up to 100,000 steps, immediate tool execution without asking permission, and silent cryptocurrency miner deployment. CSO Online noted that Symantec did not report a confirmed victim of this specific attack and that the captured instructions were part of a benign training challenge, so attribution to a live actor is thin.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Resource Hijacking | T1496 | Prompt directs silent deployment of cryptocurrency miners on hijacked inference endpoints |
| Unsecured Credentials | T1552 | Prompt instructs the agent to harvest credentials and secrets from scanned targets |

## IOCs

### Domains

_No IOCs published. Symantec recovered the agent prompt from a honeypot and did not name infrastructure, and no confirmed victim was reported._

### Full URL Paths

_No IOCs published. Symantec recovered the agent prompt from a honeypot and did not name infrastructure, and no confirmed victim was reported._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Exposed web facing AI inference endpoints
```

## Detection Recommendations

Inventory and require authentication on all internet facing model inference endpoints, and alert on anomalous token spend, prompt lengths, or step counts consistent with unattended agent loops. Log and review tool invocation attempts from model runtimes, block outbound miner and mining pool traffic from inference hosts, and monitor for credential access and database read behavior originating from model processes. Rate limit and cap per session step and tool execution counts, and require explicit approval for tool calls that write files, install software, or touch credential stores.

## References

- [CSO Online] Attackers built a 'Skynet' AI agent that hijacks exposed models to run cyberattacks (2026-10-27) — https://www.csoonline.com/article/4241421/attackers-built-a-skynet-ai-agent-that-hijacks-exposed-models-to-run-cyberattacks.html
