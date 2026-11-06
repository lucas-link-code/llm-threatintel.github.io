# Check Point Research Bypasses ChatGPT Lockdown Mode for Silent Chat Exfiltration and Phishing

**Date:** 2026-11-06
**Tags:** prompt-injection, phishing

## Executive Summary

Check Point Research discovered a vulnerability that bypassed OpenAI Lockdown Mode, allowing silent exfiltration of entire chat history, credential phishing, and malware delivery. In the Electron based ChatGPT Classic application the attack required zero user interaction, so simply holding a conversation was enough to trigger silent data exfiltration. OpenAI deployed a fix on September 18, 2026, by removing the allow-popups and allow-popups-to-escape-sandbox permissions from the outer HTML preview sandbox iframe.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ChatGPT Lockdown Mode bypass |
| Attribution | Unattributed vulnerability research by Check Point Research (confidence: none) |
| Target | ChatGPT users, with the zero interaction path affecting the Electron based ChatGPT Classic application |
| Vector | Malicious GPT or prompt injection leading to an iframe sandbox escape via a nested iframe contentWindow.open and a popup with allow-popups-to-escape-sandbox |
| Status | disrupted |
| First Observed | 2026-11-05 |

## Detailed Findings

According to [checkpoint.com](https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/), Check Point Research found a vulnerability in ChatGPT that allowed an attacker to bypass Lockdown Mode and perform covert exfiltration of chat data to an external server. The researchers reported that the outer HTML preview iframe carried the allow-popups and allow-popups-to-escape-sandbox tokens, so a nested iframe could call contentWindow.open, open a popup that escaped the sandbox, and serve arbitrary HTML outside the sandbox restrictions. Check Point Research reported that window.open in the Electron based ChatGPT Classic application worked without a user gesture, making the attack zero click, so an attacker could silently leak chat messages to an attacker controlled server simply by having a conversation. The same primitive also allowed reloading content in the main ChatGPT window and performing actions on behalf of the user, such as forcibly signing them out, which could support a credential phishing lure. According to [checkpoint.com](https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/), OpenAI informed Check Point Research on September 18, 2026 that it had deployed a fix by removing the allow-popups and allow-popups-to-escape-sandbox permissions from the outer HTML preview sandbox iframe, and retesting confirmed the exploitation technique no longer works.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exfiltration Over C2 Channel | T1041 | Check Point Research demonstrated silent exfiltration of chat data to an attacker controlled server through a sandbox escaping popup. |
| Phishing: Spearphishing Link | T1566.002 | The vulnerable window could be reloaded and could force a sign out to support a credential phishing path. |

## IOCs

### Domains

_No IOCs published. Check Point Research reported the issue was fixed by OpenAI on 2026-09-18._

### Full URL Paths

_No IOCs published. Check Point Research reported the issue was fixed by OpenAI on 2026-09-18._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
ChatGPT
ChatGPT Classic (Electron)
```

## Detection Recommendations

Ensure ChatGPT clients are updated to a build after the September 18, 2026 fix that removed allow-popups and allow-popups-to-escape-sandbox from the outer HTML preview sandbox iframe. Treat unexpected popup windows, forced sign out prompts, or reauthentication requests originating from within ChatGPT as suspicious, and monitor for outbound connections to newly registered or low reputation hosts triggered during chat sessions. Instruct users that a malicious GPT conversation can attempt silent exfiltration without clicks and to report anomalous chat behavior.

## References

- [Check Point Research] ChatGPT Lockdown Mode Bypass: Phishing, Malware Delivery, and Silent Data Exfiltration (2026-11-05) — https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/
