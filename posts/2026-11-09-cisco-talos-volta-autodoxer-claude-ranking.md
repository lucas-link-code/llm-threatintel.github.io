# Cisco Talos Documents VOLTA-AUTODOXER Infostealer Using Claude to Rank Stolen Accounts

**Date:** 2026-11-09
**Tags:** malware, llmjacking

## Executive Summary

Cisco Talos disclosed a self deleting Windows infostealer, VOLTA-AUTODOXER, that steals passwords and sessions then sends the data through OpenRouter to a commercial AI model to rank the victim's assets by resale value. The malware defaults to Anthropic's Claude and fails over to other models when a refusal is detected. It harvests browser credentials, cloud keys, and AI assistant sessions, so organizations should assume any AI provider API key on a victim host is exposed.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | VOLTA-AUTODOXER |
| Attribution | Unattributed (confidence: none) |
| Target | Windows users and organizations with saved credentials, cloud keys, and AI sessions |
| Vector | Windows infostealer |
| Status | active |
| First Observed | 2026-10-11 |

## Detailed Findings

According to Cisco Talos research published October 31, 2026 by analyst Ryan Fetterman, VOLTA-AUTODOXER is a self deleting Windows infostealer that steals credentials and then feeds the data to a commercial AI model to rank the victim's assets by resale value. The malware defaults to Anthropic's Claude and is built to fail over to other models if one declines the task, with Cisco Talos describing the AI layer as an automated stand in for the human analyst who would normally decide which stolen accounts are worth pursuing. Talos reported that VOLTA pulls browser passwords, cookies, saved payment cards, and cryptocurrency wallet seed phrases, along with Discord, Telegram, Steam, and Roblox sessions, Microsoft sign in tokens, SSH and cloud keys, every saved Wi-Fi password in plaintext, and screenshots. The finished bundle is converted to JSON and sent through OpenRouter, a model routing service, with a prompt telling the model to pose as a forensic intelligence analyst and draft a target assessment, ranking the victim's valuables by resale tier and grading their password habits. Talos reported that VOLTA checks each AI reply for refusal signs and moves down a chain of up to three models, trying Claude first, then Kimi K2, then Gemini 2.5 Flash. If the operator provides no model key, VOLTA skips the AI step and still sends its raw file over Telegram. Talos analyzed one sample first seen October 11, 2026 and did not state whether VOLTA has been used against real victims.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | Steals browser passwords, cookies, and saved cards |
| Exfiltration Over Web Service | T1567 | Sends the stolen bundle through OpenRouter and Telegram |

## IOCs

### Domains

_No domains, hashes, packages, or IPs published in the cited reporting. OpenRouter is a legitimate routing platform and is not an IOC._

### Full URL Paths

_No domains, hashes, packages, or IPs published in the cited reporting. OpenRouter is a legitimate routing platform and is not an IOC._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
```

## Detection Recommendations

Monitor for processes calling OpenRouter or AI provider APIs from endpoints that have no legitimate AI client, which may indicate stolen key reuse. Alert on plaintext Wi-Fi password enumeration and browser credential store access. Rotate any Microsoft sign in tokens, SSH keys, and cloud keys on suspect hosts. Hunt for Telegram egress and for self deleting executables that remove their own artifacts after staging.

## References

- [Cisco Talos] Appraisal by AI: Model-driven victim prioritization in the VOLTA infostealer (2026-10-31) — https://www.sofx.com/cisco-finds-malware-using-claude-ai-to-profile-victims-and-rank-stolen-accounts/
