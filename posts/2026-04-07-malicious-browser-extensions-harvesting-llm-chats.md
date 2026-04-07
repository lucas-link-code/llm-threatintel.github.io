# Malicious Browser Extensions Harvesting LLM Chat Histories from 900,000 Users

**Date:** 2026-04-07
**TLP:** TLP:CLEAR
**Tags:** malware, phishing, shadow-ai

## Executive Summary

Two Chromium-based browser extensions impersonating AI assistants have compromised approximately 900,000 users, harvesting full chat histories from ChatGPT and DeepSeek along with browsing telemetry. Microsoft Defender telemetry confirmed activity across more than 20,000 enterprise tenants. Defenders should block the four identified C2 domains and audit enterprise Chrome extension inventories for the two malicious extension IDs.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Malicious AI Assistant Browser Extensions |
| Attribution | Unknown (confidence: none) |
| Target | Enterprise and consumer users of ChatGPT and DeepSeek |
| Vector | Chrome Web Store distribution, social engineering |
| Status | active |
| First Observed | 2025-12 |

## Detailed Findings

According to Microsoft Security Blog, two Chromium-based extensions impersonating the legitimate AITOPIA AI assistant tool were identified actively scraping user conversations from ChatGPT and DeepSeek platforms. The first extension, "Chat GPT for Chrome with GPT-5, Claude Sonnet and DeepSeek AI" (extension ID fnmihdojmnkclgjpcoonokmkhjpjechg), accumulated over 600,000 installations. The second, "AI Sidebar with Deepseek, ChatGPT, Claude and more" (extension ID inhcgfpbfdjbjogdfjbclgolkmhnooop), reached over 300,000 installations.

Cryptika Cybersecurity reported that the extensions monitor active browser tabs and use DOM element extraction to capture prompts, responses, and session identifiers from ChatGPT and DeepSeek web interfaces. Collected data is encoded as Base64 JSON and exfiltrated in batches every 30 minutes to attacker-controlled C2 infrastructure at deepaichats.com and chatsaigpt.com. Two additional Lovable-hosted C2 domains were identified: chataigpt.pro and chatgptsidebar.pro.

According to Dataprise, the extensions achieve persistence by auto-reloading on browser startup without requiring elevated privileges. They mask data theft activity by requesting what appears to be "anonymous analytics" consent from users. The stolen data exposes organizations to leakage of proprietary code, internal workflows, strategic discussions, and credentials embedded in AI conversations.

Rewterz confirmed that Unit 42 published IOCs for the campaign on February 13, 2026. As of January 7, 2026, both extensions remained available on the Chrome Web Store, though one lost its "Featured" badge following initial disclosure.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Browser Extensions | T1176 | Malicious Chromium extensions installed via Chrome Web Store |
| Browser Session Hijacking | T1185 | DOM scraping of active ChatGPT and DeepSeek sessions |
| Exfiltration Over C2 Channel | T1041 | Base64-encoded JSON batched to C2 every 30 minutes |
| Data Encoding: Standard Encoding | T1132.001 | Base64 encoding of harvested chat data |
| Input Capture | T1056 | Passive capture of user prompts and AI responses |

## IOCs

### Domains

```
deepaichats.com
chatsaigpt.com
chataigpt.pro
chatgptsidebar.pro
```

### Full URL Paths

*No full URL paths with specific endpoints published by source.*

### Splunk Format

```
"deepaichats.com" OR "chatsaigpt.com" OR "chataigpt.pro" OR "chatgptsidebar.pro"
```

### File Hashes

```
98d1f151872c27d0abae3887f7d6cb6e4ce29e99ad827cb077e1232bc4a69c00
20ba72e91d7685926c8c1c5b4646616fa9d769e32c1bc4e9f15dddaf3429cea7
```

### Package Indicators

```
chrome-extension:fnmihdojmnkclgjpcoonokmkhjpjechg
chrome-extension:inhcgfpbfdjbjogdfjbclgolkmhnooop
```

## Detection Recommendations

Monitor web proxy logs for outbound connections to the four C2 domains: deepaichats.com, chatsaigpt.com, chataigpt.pro, chatgptsidebar.pro. Query EDR telemetry for Chrome extension loads matching IDs fnmihdojmnkclgjpcoonokmkhjpjechg or inhcgfpbfdjbjogdfjbclgolkmhnooop. In CrowdStrike LogScale or Splunk, hunt for Base64-encoded POST requests from browser processes to non-corporate domains at 30-minute intervals. Audit Chrome enterprise extension policies using Google Workspace Admin or GPO to blocklist the two extension IDs. Monitor for DNS queries resolving to Lovable-hosted infrastructure patterns associated with chataigpt.pro and chatgptsidebar.pro.

## References

- [Microsoft Security Blog] Malicious AI Assistant Extensions Harvest LLM Chat Histories (2026-03-05) — https://www.microsoft.com/en-us/security/blog/2026/03/05/malicious-ai-assistant-extensions-harvest-llm-chat-histories/
- [Cryptika Cybersecurity] Malicious Chrome Extension Steal ChatGPT and DeepSeek Conversations from 900K Users (2026-01) — https://www.cryptika.com/malicious-chrome-extension-steal-chatgpt-and-deepseek-conversations-from-900k-users/
- [Dataprise] Malicious AI Chrome Extensions: Data Theft Alert (2026-02) — https://www.dataprise.com/resources/defense-digest/malicious-ai-chrome-extensions-data-exfiltration/
- [Rewterz] Threat Actors Abuse Chrome Extensions to Steal AI Prompts - Active IOCs (2026-02) — https://rewterz.com/threat-advisory/threat-actors-abuse-chrome-extensions-to-steal-ai-prompts-active-iocs
- [Unit 42] IOCs for Tactics by Browser Extensions to Avoid Bans (2026-02-13) — https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-02-13-IOCs-for-tactics-by-browser-extensions-to-avoid-bans.txt
