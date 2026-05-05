# OpenClaw CVE-2026-41358: Origin Validation Bypass Enables Prompt Injection and Context Poisoning via Slack Integration

**Date:** 2026-05-05
**Tags:** malicious-tool, shadow-ai

## Executive Summary

An origin validation vulnerability (CWE-346) exists within the OpenClaw AI assistant's Slack integration prior to version 2026.4.2; the platform fails to independently verify the sender of historical thread messages against configured allowlists, enabling unauthorized users to inject malicious instructions into the LLM context when an authorized user triggers the agent, facilitating prompt injection and context poisoning attacks. Successful exploitation results in unauthorized manipulation where attackers can manipulate the agent's behavior, extract sensitive information intended for authorized users, or alter the assistant's persona.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | OpenClaw Slack Integration Exploitation |
| Attribution | Unknown (confidence: none) |
| Target | OpenClaw users in Slack-integrated environments; enterprises using OpenClaw for AI agent automation |
| Vector | Slack thread context injection; prompt injection via historical message poisoning |
| Status | active |
| First Observed | 2026-05-04 |

## Detailed Findings

The vulnerability resides specifically within the resolveSlackThreadContextData function located in extensions/slack/src/monitor/message-handler/prepare-thread-context.ts. The attacker initiates the exploit by injecting a prompt payload into an existing Slack thread or creating a new thread starter; the payload contains specific instructions directed at the underlying LLM. The vulnerability occurs because the origin validation logic is exclusively applied to the current triggering event. The vendor addressed the issue in release 2026.4.2 by implementing per-message sender validation.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1593.003 | Attacker embeds malicious instructions in Slack thread history, exploiting lack of per-message origin validation to inject context into LLM processing |
| Credential Access | T1110 | Compromised agent context can be leveraged to extract sensitive conversational data or credentials accessible to authorized users |

## IOCs

### Domains

_Vulnerable versions: prior to 2026.4.2; patched in 2026.4.2 and later_

### Full URL Paths

_Vulnerable versions: prior to 2026.4.2; patched in 2026.4.2 and later_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
openclaw
```

## Detection Recommendations

Monitor for Slack messages containing unusual LLM-directive patterns in OpenClaw-integrated threads; log and alert on resolveSlackThreadContextData function calls with non-allowlisted thread starters; implement strict allowFrom list validation across entire thread history before LLM ingestion; detect log entries indicating 'omitted non-allowlisted thread starter from context' (post-patch indicator); audit OpenClaw deployment versions to ensure all instances are >= 2026.4.2.

## References

- [CVEReports] CVE-2026-41358: Origin Validation Error in OpenClaw Slack Integration (2026-05-04) — https://cvereports.com/reports/CVE-2026-41358
