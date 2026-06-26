# Trend Micro ClickFix Malvertising: Claude.ai Shared Chat Weaponization Across 6 Attack Waves (April-June 2026)

**Date:** 2026-06-26
**Tags:** phishing, malicious-tool, llmjacking

## Executive Summary

TrendAI Research tracked 106 unique malicious hostnames deployed across six distinct attack waves over seven weeks from April 8 to June 14, 2026, with operators continuously rotating infrastructure and testing new AI brand lures. The campaign made a significant tactical leap by shifting to and weaponizing claude.ai's shared chat feature; victims landed on a fully legitimate, trusted domain that rendered browser warnings and URL inspection easier to evade. The Asia-Pacific region bore the brunt of the campaign, accounting for 67.2% of all confirmed victims, with Taiwan alone representing 30.5% of total traffic.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ClickFix Malvertising via Claude.ai Shared Chats |
| Attribution | Unknown (likely organized cybercriminal syndicate) (confidence: low) |
| Target | Asia-Pacific users (67.2%), Taiwan (30.5%), searchers for AI development tools |
| Vector | Google Ads → legitimate claude.ai shared conversation URLs → malicious ClickFix payload |
| Status | active |
| First Observed | 2026-04-08 |

## Detailed Findings

Most of the campaign (82.8% of traffic) targeted users searching for AI development tools, with Claude AI as the primary target throughout the campaign, including variants like "Claude Code," "Claude Desktop," and "Claude Desktop LM." Wave 3 introduced perplexity-platform.gitlab.io and chatgpt-codex.gitlab.io, expanding brand impersonation beyond Claude to other AI platforms. The campaign represents a tactical escalation over earlier ClickFix campaigns by weaponizing trusted AI platform infrastructure rather than attacker-controlled domains, bypassing corporate URL filtering and Safe Browsing heuristics that flag malicious third-party sites.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing via Service | T1566.002 | Google Ads paid search results redirect to malicious shared conversation links |
| Social Engineering | T1598 | Impersonation of legitimate AI platform UI to trick users into executing terminal commands |
| Abuse of Trusted Relationship | T1199 | Exploitation of trust in claude.ai domain and Anthropic brand to bypass security controls |

## IOCs

### Domains

```
claude-desktop-lm.gitlab.io
cladesktop.gitlab.io
codexgpt.gitlab.io
chatgpt-codex-app.gitlab.io
chatgpt-codex-lm.gitlab.io
claudecode-desktop.gitlab.io
claudecode-download.gitlab.io
perplexity-platform.gitlab.io
```

### Full URL Paths

```
https://claude.ai/s/* (malicious shared conversations)
```

### Splunk Format

```
"claude-desktop-lm.gitlab.io" OR "cladesktop.gitlab.io" OR "codexgpt.gitlab.io" OR "chatgpt-codex-app.gitlab.io" OR "chatgpt-codex-lm.gitlab.io" OR "claudecode-desktop.gitlab.io" OR "claudecode-download.gitlab.io" OR "perplexity-platform.gitlab.io" OR "https://claude.ai/s/* (malicious shared conversations)"
```

### Affected Platforms

```
Web browsers
Google Search Ad network
```

## Detection Recommendations

1. Monitor Google Workspace and enterprise email for ClickFix-style terminal command payloads in any context involving AI platform references. 2. Deploy URL category blocking on GitLab Pages subdomains (*.gitlab.io) at network perimeter for organizations that do not require GitLab Pages access. 3. Alert on any unusual activity from claude.ai, chatgpt.com, or anthropic.com domains followed by lateral movement or credential dump attempts. 4. Implement web content filtering that flags shared conversation URLs to AI platforms (chatgpt.com/s/*, claude.ai/s/*) arriving from paid ad traffic or external sources. 5. Conduct phishing awareness training focused on AI platform UI impersonation and the legitimacy paradox (attacker using real domain to deliver malware).

## References

- [Trend Micro] Threat Actors Abuse claude.ai Shared Chat for ClickFix Malvertising Campaign (2026-06-17) — https://www.trendmicro.com/en_us/research/26/f/claudeai-shared-chat-abused-in-malvertising.html
