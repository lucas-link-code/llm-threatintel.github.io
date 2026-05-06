# Claudy Day Update: Oasis Security Documents Complete Prompt Injection → Data Exfiltration Attack Chain Against Default Claude.ai Sessions

**Date:** 2026-05-06
**Tags:** malicious-tool, shadow-ai

## Executive Summary

Claudy Day: Chaining Prompt Injection and Data Exfiltration in Claude.ai. Oasis Security researchers discovered that for a significant period, this assumption could be broken, and worked with Anthropic to close the gap. We discovered three vulnerabilities in Claude.ai and the broader claude.com platform, collectively dubbed Claudy Day, that, when chained together, create a complete attack pipeline. Updated publication on 2026-05-01 with comprehensive technical analysis reveals zero-click data theft from conversation history via invisible prompt injection embedded in Google Search ads.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Claudy Day |
| Attribution | Unknown/Opportunistic attacker demonstration (confidence: none) |
| Target | Claude.ai users (individuals, enterprises with sensitive conversations, MCP integrations) |
| Vector | Google Search ads displaying legitimate claude.com URL that redirect via open redirect flaw to malicious injection URL; invisible HTML tags in URL parameters; Files API exfiltration using embedded attacker API key |
| Status | active |
| First Observed | 2026-03-18 (initial disclosure); 2026-05-01 (updated comprehensive analysis) |

## Detailed Findings

Prompt injection occurs when an attacker embeds hidden instructions inside input that an AI agent processes. In the Claudy Day case, invisible HTML tags were embedded in a URL parameter that pre-fills the Claude.ai chat box. The user sees a normal prompt, but when they press Enter, Claude also executes the hidden instructions. Three vulnerabilities in Claude.ai and the broader claude.com platform, collectively dubbed Claudy Day, that, when chained together, create a complete attack pipeline: from targeted victim delivery, to invisible prompt manipulation, to silent exfiltration of sensitive data from the user's conversation history. No integrations, no tools, no MCP servers required. The attack works against a default, out-of-the-box claude.ai session. In a default Claude.ai session, an attacker can access conversation history and memory, which may include business strategy, financial information, health concerns, personal details, and any other sensitive topics discussed with the assistant. With MCP servers or enterprise integrations enabled, the attacker can also read files, send messages, and interact with connected services. One real-world example: the Claudy Day researchers embedded an attacker-controlled API key in the hidden prompt, instructing Claude to search the user's conversation history, write it to a file, and upload it to the attacker's Anthropic account via the Files API. The exfiltration used a permitted endpoint (api.anthropic.com), making it invisible to network-level controls.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1595 | Hidden instructions embedded in URL parameters using HTML tags invisible to user but processed by Claude |
| Phishing | T1566 | Google Ads used to deliver malicious redirect URL appearing as legitimate claude.com search result |
| Web Session Cookie | T1185 | Exploitation of implicit trust in claude.ai conversation context and memory |
| Data from Cloud Storage Object | T1526 | Exfiltration of conversation history via Anthropic Files API using embedded attacker API credentials |

## IOCs

### Domains

_No persistent IOCs; attack relies on crafted URLs distributed via Google Ads. Researchers used proof-of-concept injection payloads; no active exploitation URLs public at time of analysis._

### Full URL Paths

```
claude.ai/new?q=[INJECTION_PAYLOAD] (injection vector)
claude.com/redirect/ (open redirect flaw, any URL parameter)
api.anthropic.com/v1/files (Files API used for exfiltration)
```

### Splunk Format

```
"claude.ai/new?q=[INJECTION_PAYLOAD] (injection vector)" OR "claude.com/redirect/ (open redirect flaw, any URL parameter)" OR "api.anthropic.com/v1/files (Files API used for exfiltration)"
```

## Detection Recommendations

Implement strict input validation and HTML entity escaping on all URL parameters that feed into LLM context, especially pre-filled prompt parameters. Disable or heavily restrict open redirect functionality on authentication/platform domains. Monitor for anomalous Files API usage patterns: legitimate users rarely upload data to Anthropic cloud in bulk; detector should flag multiple file uploads within short windows or uploads containing conversation history. For enterprise deployments: restrict Claude.ai access via conditional access policies blocking high-risk delivery vectors (public cloud, external networks); require explicit user confirmation before Claude executes sensitive actions (file uploads, external API calls, conversation history access) even if instructed by embedded prompts. Educate users to treat AI chat links as untrusted URLs and avoid clicking pre-filled prompt links from external sources (ads, emails, unfamiliar websites). Implement LLM-aware DLP rules that detect text exfiltration patterns even when embedded in seemingly benign API calls. Monitor Google Search ads for suspicious ad content mimicking legitimate AI platform URLs.

## References

- [Oasis Security] Claude.ai Prompt Injection Vulnerability | Claudy Day (2026-05-01) — https://www.oasis.security/blog/claude-ai-prompt-injection-data-exfiltration-vulnerability
- [Dark Reading] 'Claudy Day' Trio of Flaws Exposes Claude Users to Data Theft (2026-03-18) — https://www.darkreading.com/vulnerabilities-threats/claudy-day-trio-flaws-claude-users-data-theft
- [Cybersecurity Dive (via TrueFairy)] Prompt Injection and AI Agent Security Risks: A Claude Code Guide for Enterprise Teams (2026-04-01) — https://www.truefoundry.com/blog/claude-code-prompt-injection
