# Okta: Infostealer Dump Held 555 Likely AI Service JWTs Including Anthropic, Cursor, and OpenAI

**Date:** 2026-09-11
**Tags:** llmjacking, shadow-ai

## Executive Summary

The Hacker News reported on 2026-09-09 that Okta analyzed a 7 GB infostealer dump released on Telegram on 2026-08-02, covering 5,871 infected machines in 162 countries. Okta said 555 of 44,791 unique JWTs were likely AI service authentication tokens, and TruffleHog still found 24 valid API keys for Gemini, OpenAI, Groq, and OpenRouter. Rotate AI session tokens and API keys, and hunt replayed JWTs from unusual geos. Do not denylist vendor platforms.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Infostealer log leak of AI session tokens and API keys. Dump dated 2026-08-02. Okta did not name one malware family. THN noted Lumma Stealer and Vidar as examples of stealers that harvest this class of secret |
| Actor / Attribution | Unnamed infostealer operators and underground resellers. Confidence none for a named group |
| Target | Users of AI services and coding assistants whose browsers held JWTs, JWEs, or API keys |
| Vector | Infostealer collection of session tokens and API keys, then a public Telegram dump and underground resale of stolen AI access |
| Status | Dump released 2026-08-02. Okta analysis reported 2026-09-09. Unexpired tokens remain a replay risk until rotated |
| First Observed | Dump date 2026-08-02. Public analysis 2026-09-09 |

## Detailed Findings

According to [The Hacker News](https://thehackernews.com/2026/09/infostealer-logs-expose-replayable-ai.html), Okta threat intelligence director Jeremy Kirk said session tokens and API keys are sought because they can often be replayed to skip credential based authentication. Once replayed, an actor is logged in to an LLM service without logging in. Okta called those secrets skeleton keys.

Okta analyzed a 7 GB infostealer dump released on a Telegram channel on 2026-08-02. The log covered 5,871 infected machines across 162 countries. Among the secrets were thousands of unexpired authentication tokens for services including Google, Microsoft, Anthropic, Amazon, Gamma, Notion, Character.ai, Cursor, Poe, and Pika AI. Of 44,791 unique JWTs, 555 were likely related to authentication for AI services.

Okta also identified 2,937 authentication related JSON Web Encryption structures representing encrypted JWTs. Most of those tokens were set by OpenAI, which uses NextAuth.js. Okta said an attacker can still replay those tokens if they are not expired, even without decrypting them. In all, the stolen data contained 1,843 unexpired JWTs and JWEs on the day it was released. Okta said 17.7 percent of the 44,791 JWTs included plaintext name, phone, or email, which does not expire and can support later phishing.

TruffleHog against the dump found 24 still valid API keys for four AI related services: Google Gemini, OpenAI, Groq, and OpenRouter.

THN said Okta flagged a Telegram vendor selling access to Claude, Cursor, ChatGPT, and Gemini, and a service called Poison Claude that claims access to Anthropic Opus 4.8, Opus 4.7, Opus 4.6, and Sonnet 4.6. Okta said anti detect browsers, Camoufox, and SeleniumBase can load stolen sessionStorage and localStorage from a file, and that proxies are used to bypass impossible travel detections.

THN also cited Google Threat Intelligence Group on rising underground demand for Claude and Gemini credentials and for Cursor Pro and Devin, and a Mandiant case where an exposed GitHub PAT led to unauthorized AI infrastructure in a victim cloud. Those GTIG points overlap the 2026-09-08 tracker already on this feed and are not repeated as new IOCs here.

No domain, IP, hash, or package indicator was published that this feed can use. Telegram, OpenAI, Groq, OpenRouter, and other vendor platforms are not IOCs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Web Session Cookie | T1539 | Replayable JWTs and JWEs taken from infostealer logs |
| Unsecured Credentials | T1552 | 24 still valid AI API keys found with TruffleHog |
| Valid Accounts | T1078 | Stolen tokens used as skeleton keys to skip username, password, and MFA |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

On IdP and SaaS audit logs, hunt JWT or session replay from a new device, ASN, or country shortly after a prior session, including anti detect browser or SeleniumBase user agents. Alert on AI API keys used from geos that do not match the token owner, especially Gemini, OpenAI, Groq, and OpenRouter keys. Assume tokens present in a 2026-08-02 infostealer dump are burned: revoke sessions, rotate API keys, and shorten token lifetime. Hunt Telegram and forum ads for Poison Claude or discounted Claude, Cursor, ChatGPT, and Gemini access as a context signal, not as a denylist of those products. IP allow lists and Chrome Device Bound Session Credentials reduce replay. Do not add vendor platforms or Telegram apex hosts to this IOC feed.

## References

- [The Hacker News] Infostealer Logs Expose Replayable AI Tokens That Can Bypass MFA (2026-09-09): https://thehackernews.com/2026/09/infostealer-logs-expose-replayable-ai.html
