# Malvertising Campaign Abuses Google Ads and Claude.ai Shared Chats to Distribute macOS Infostealer

**Date:** 2026-05-27
**Tags:** malware, phishing

## Executive Summary

An active malvertising campaign is abusing Google sponsored search results and Claude.ai's shared chat feature to deliver macOS infostealer malware to users searching for Claude downloads on Mac. Both attacks point to the real claude.ai domain because the malicious content is hosted inside Claude's own shared chat feature, and standard advice to verify the destination URL before clicking provides no protection here.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Claude.ai Shared Chat Malvertising Campaign |
| Attribution | Unknown (confidence: low) |
| Target | macOS users searching for Claude installation; organizations with employees using Claude on Mac |
| Vector | Malvertising via Google Ads pointing to malicious Claude.ai shared chat; geographic targeting of Western users |
| Status | active |
| First Observed | 2026-05-11 |

## Detailed Findings

macOS users searching for Claude downloads through Google are the primary targets, and the geographic filtering in one variant skips CIS-region machines, suggesting selective targeting of Western users. Organizations where employees use Claude on Mac devices face indirect risk if corporate credentials or session tokens are stored in browser profiles or macOS Keychain on affected machines. The use of shared AI platform chats as malware delivery infrastructure has now been documented across Claude, ChatGPT, and Grok, establishing this as a recurring and maturing attack pattern.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1566.002 | Malvertising redirecting to malicious shared chat |
| Masquerading | T1036.005 | Impersonating official Claude Code CLI via shared chat |
| Ingress Tool Transfer | T1105 | Downloading and executing malware payload on macOS |

## IOCs

### Domains

```
claude.ai
```

### Full URL Paths

_No specific IOCs published; attack uses legitimate claude.ai domain for shared chat delivery_

### Splunk Format

```
"claude.ai"
```

## Detection Recommendations

Monitor Claude.ai shared chat platform for suspicious installation instruction content. Implement email and DNS filtering for suspicious search result redirects from Google Ads. Educate users that legitimate AI tool downloads come only from official vendor documentation, never from search-result installation instructions. Implement endpoint detection for macOS processes spawning from browser contexts with unusual privilege escalation patterns. Monitor for lateral movement from compromised developer endpoints that may have access to corporate credentials.

## References

- [Security Boulevard / Evan Rowe (CISO Whisperer)] Attackers Abuse Google Ads and Claude.ai Shared Chats to Push Mac Malware (2026-05-11) — https://securityboulevard.com/2026/05/attackers-abuse-google-ads-and-claude-ai-shared-chats-to-push-mac-malware/
