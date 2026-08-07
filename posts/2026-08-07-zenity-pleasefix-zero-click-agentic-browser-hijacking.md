# PleaseFix Zero-Click AI Browser Agent Hijacking: Multi-Vendor Agentic Browser Exploitation via Prompt Injection

**Date:** 2026-08-07
**Tags:** prompt-injection, malicious-tool

## Executive Summary

Zenity Labs disclosed zero-click PleaseFix exploit chains affecting Claude in Chrome, Gemini in Chrome, Perplexity Comet, ChatGPT Atlas and Copilot Edge at Black Hat USA 2026. PleaseFix is a vulnerability class allowing attackers to hijack AI agents embedded in agentic browsers and turn them against their own users, without requiring users to click, approve or knowingly execute any malicious action. Attack chains range from credential theft to account takeover and machine compromise.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | PleaseFix Agentic Browser Exploitation Campaign |
| Attribution | Zenity Labs (Security Researcher) (confidence: none) |
| Target | Users of Claude in Chrome, Gemini in Chrome, Perplexity Comet, ChatGPT Atlas, Copilot Edge |
| Vector | Zero-click indirect prompt injection via malicious emails, calendar invites, social media links, and web content |
| Status | active |
| First Observed | 2026-08-06 |

## Detailed Findings

The problem stems from how the AI agents pull information from multiple sources, such as emails and webpages, while working on a task without reliably distinguishing between trusted and untrusted content. An adversary who can slip malicious instructions into that content can weaponize the agent and use its access to act on the user's behalf, potentially reaching sensitive data, accounts, and other connected services. In one example involving Claude in Chrome, researchers showed how a malicious email could trick the AI agent into extracting Gmail data, sharing a user's Google Drive with an attacker and compromising accounts including Slack and Claude. In another demonstration involving Perplexity Comet, a poisoned calendar invitation allowed researchers to access local files, steal credentials and compromise a user's password manager account. Zenity also showed attacks against ChatGPT Atlas, where a malicious link posted on social media could manipulate the AI agent into sending phishing messages through the victim's WhatsApp account. In another scenario, Atlas was manipulated into preparing an Amazon purchase for an attacker-controlled address by using another AI assistant to complete the transaction.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1595.001 | Attackers inject adversarial instructions into content consumed by AI agents to manipulate agent behavior |
| Account Compromise | T1586 | Zero-click exploitation enables account takeover across authenticated domains without user interaction |

## IOCs

### Domains

_No indicators of compromise (IOCs) published; vulnerability is architectural, not code-based. Zenity disclosed findings at Black Hat USA 2026._

### Full URL Paths

_No indicators of compromise (IOCs) published; vulnerability is architectural, not code-based. Zenity disclosed findings at Black Hat USA 2026._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude in Chrome
Gemini in Chrome
Perplexity Comet
ChatGPT Atlas
Copilot Edge
```

## Detection Recommendations

Monitor for unusual agent behavior including unexpected file access, credential exfiltration, cross-domain account access, and out-of-band communications (Tor, VPN). Implement content sanitization for email attachments and web content before presentation to agentic AI systems. Enforce strict same-origin policies and disable agent autonomy for untrusted content sources. Implement real-time monitoring for agent-initiated financial transactions, password manager access, and lateral account movement.

## References

- [Zenity Labs] PleaseFix: Zero-Click AI Browser Agent Hijacking (Black Hat USA 2026) (2026-08-07) — https://www.darkreading.com/cyber-risk/ai-browsers-zero-click-agent-hijacking
- [SecurityWeek] Zero-Click AI Browser Hacking: Claude and ChatGPT Atlas Hijacked via Emails, X Posts (2026-08-07) — https://www.securityweek.com/zero-click-ai-browser-hacking-claude-and-chatgpt-atlas-hijacked-via-emails-x-posts/
- [Dark Reading] AI Browsers Vulnerable to 'PleaseFix' Zero-Click Agent Hijacking (2026-08-07) — https://www.darkreading.com/cyber-risk/ai-browsers-zero-click-agent-hijacking
