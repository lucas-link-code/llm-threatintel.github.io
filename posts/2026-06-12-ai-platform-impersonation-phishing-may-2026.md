# Microsoft Threat Intelligence Tracks Multi-Campaign Credential Phishing via ChatGPT, Claude, DeepSeek Impersonation (May 2026)

**Date:** 2026-06-12
**Tags:** phishing

## Executive Summary

By disguising phishing attacks with the branding of platforms like ChatGPT, Claude, and DeepSeek, threat actors are luring users into handing over login credentials, credit card numbers, and authentication tokens. Microsoft Threat Intelligence observed multiple, distinct campaigns in 2026 that reused legitimate branding, SEO techniques, malvertising, and multi-stage redirect chains to bypass defenses and scale theft and infection at pace. Within 45 minutes of DeepSeek V4 preview, a fake GitHub organization called DeepSeek-V4 was live, loaded with stolen branding, real benchmark data, and search-optimized tags. Users who downloaded the archives received a loader that silently installed Vidar infostealer on their devices.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Multi-Platform AI Impersonation Phishing |
| Attribution | Multiple threat actors (Storm-3075 attributed to malvertising variant) (confidence: medium) |
| Target | Users of ChatGPT, Claude, and DeepSeek; South Africa, UK, India regions observed |
| Vector | Phishing emails with legitimate brand logos; Google Ads; GitHub fake releases; malvertising |
| Status | active |
| First Observed | 2026-04-20 |

## Detailed Findings

A ChatGPT-themed campaign detected on May 5, 2026 shows threat actors sending around 4,500 emails to targets in South Africa, warning that their ChatGPT Plus subscription would be downgraded unless they updated their payment method within seven days. The emails carried the ChatGPT logo and a clickable update button that looked entirely legitimate. Victims were bounced through a CRM service, an Amazon tracking domain, and a URL shortener before landing on a compromised website where a fake payment page sat inside a subfolder. The Claude-themed campaign ran from April 20 to 22, 2026, reaching more than 2,000 organizations in the United States, the United Kingdom, and India. Storm-3075–attributed malvertising delivered malicious "AI plugin" downloads to users on free streaming sites; the installers were code-signed with fraudulently obtained certificates and, after a user-driven checkbox interaction, dropped Python-based downloaders that fetched Vidar and other stealers.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | Email campaigns impersonating ChatGPT, Claude, DeepSeek with credential harvesting pages |
| Credential Access | T1589 | Phishing pages harvest credentials and payment card information |
| Malvertising | T1583.008 | Google Ads and free streaming site ads direct to fake installers |

## IOCs

### Domains

_No specific IOCs published in Microsoft disclosure; campaigns used multi-hop redirectors to evade detection_

### Full URL Paths

_No specific IOCs published in Microsoft disclosure; campaigns used multi-hop redirectors to evade detection_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor for phishing emails spoofing ChatGPT, Claude, DeepSeek visual branding and messaging patterns (subscription warnings, payment updates); implement DMARC/SPF/DKIM stricter enforcement; flag multi-hop redirect chains (CRM → tracking → shortener patterns); monitor GitHub for fake organization/repository clones of major AI projects within minutes of release announcements; analyze code-signed executables for fraudulent certificates; block malvertising infrastructure via network analysis.

## References

- [Cyber Security News] Threat Actors Abuse ChatGPT, Claude, and DeepSeek Brands in Phishing Attacks (2026-06-12) — https://cybersecuritynews.com/threat-actors-abuse-chatgpt-claude-and-deepseek-brands-as-phishing-lures/
- [GB Hackers] Hackers Exploit ChatGPT, Claude, DeepSeek Brands in Credential Phishing Attacks (2026-06-12) — https://gbhackers.com/ai-brands-exploited/
