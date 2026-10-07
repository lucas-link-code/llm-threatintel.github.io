# Fake AI Advertising Portal Phishing Platform Harvests Google, Meta, TikTok, and Okta Credentials With MFA Relay

**Date:** 2026-10-07
**Tags:** phishing, shadow-ai

## Executive Summary

A human operated phishing platform impersonates AI advertising products such as ChatGPT, Gemini, Claude, Perplexity, Manus, and a fake Meta Muse Ads tool, presenting a fake OAuth popup through browser in the browser techniques to steal Google, Meta, TikTok, and Okta credentials and MFA codes. According to Island, operators steer each victim through MFA challenges in real time over Socket.IO and a Telegram control channel, and aged Google Ads accounts are resold on Telegram for 200 to 270 dollars. The campaign was still active at publication on October 6, 2026 and targets agency staff, media buyers, and manager account administrators.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | The Fake AI Ads Campaign |
| Attribution | Unattributed, human operated, no confirmed attribution (confidence: low) |
| Target | Advertising agency staff, media buyers, and Google Ads manager or MCC account administrators |
| Vector | Sponsored search and ad tool lures leading to fake OAuth popups via browser in the browser, with real time MFA prompting over Socket.IO and Telegram control |
| Status | active |
| First Observed | 2026-10-06 |

## Detailed Findings

According to Threadlinqs, the campaign tracked as TL-2026-2977, also called The Fake AI Ads Campaign, is a high severity phishing operation first published 2026-10-06 with no confirmed attribution. Threadlinqs reported that it impersonates AI advertising products including ChatGPT, Gemini, Claude, Perplexity, Manus, and the newest lure, Meta Muse Ads, and that a fake OAuth popup is presented through browser in the browser to capture Google, Meta, TikTok, and Okta credentials along with MFA codes. According to Island, the operators steer each victim through MFA challenges in real time over Socket.IO and a Telegram control channel, targeting agency staff, media buyers, and manager account administrators. Island reported lure families spanning AI ad tools such as Muse Ads, ChatGPT Monday Brief, Gemini Ads with manager and MCC account support, Claude Ads Portal, Perplexity campaign planning, and Manus, plus refund and payment confirmation pages and recruitment lures referencing Tesla, Louis Vuitton, Adidas, Nike, Adecco, and Robert Half. Island reported that operators registered a Muse Ads domain on September 16, 2026, eight days after Meta launched its Muse consumer agent, that earlier platform versions leaked through misconfigured public GitHub repositories, and that aged Google Ads accounts are sold on Telegram at 200 to 270 dollars with manager accounts at 2 to 4 times the price of new ones. Threadlinqs mapped the campaign to 15 MITRE ATT&CK techniques and published 9 detection rules and 43 indicators of compromise.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Input Capture: Web Portal Capture | T1056.003 | Fake OAuth popups rendered in browser in the browser style capture credentials and MFA codes that victims enter into the impersonated ad portal |
| Application Layer Protocol: Web Protocols | T1071.001 | Operators relay MFA challenges and victim interaction in real time over Socket.IO and a Telegram control channel |

## IOCs

### Domains

```
claude-ads.ai
openai-ads.ai
```

### Full URL Paths

_Domains are attacker controlled lookalikes named in the Threadlinqs 2026-10-06 update. Threadlinqs published 11 new indicators in that update including 7 new domains and two relocated lure domains. Consult the Threadlinqs record for the full indicator set._

### Splunk Format

```
"claude-ads.ai" OR "openai-ads.ai"
```

### Affected Platforms

```
Google Ads manager accounts
Google accounts
Meta Ads
TikTok Ads
Okta
```

## Detection Recommendations

Hunt for OAuth consent and login flows that originate from AI ad tool lookalike domains such as claude-ads.ai and openai-ads.ai rather than the legitimate consoles, and alert when a Google, Meta, TikTok, or Okta session completes an OAuth grant from an unrecognized referring page. Monitor for browser in the browser indicators: a popup window rendered inside the page, address bar elements that are not real browser chrome, and Socket.IO connections to phishing infrastructure during login. Enforce phishing resistant MFA such as passkeys or hardware tokens for manager and MCC accounts, since real time MFA relay defeats pushed and code based factors. Pipeline the 9 detection rules and 43 indicators from the Threadlinqs record into email and web controls.

## References

- [Threadlinqs] Fake ChatGPT/Gemini/Claude Ad-Tool Lure Sites (TL-2026-2977) (2026-10-06) — https://intel.threadlinqs.com/threat/TL-2026-2977
