# GreyNoise: 824 Addresses Forged ClaudeBot and GPTBot Names While Scanning for Credential Files

**Date:** 2026-09-11
**Tags:** llmjacking

## Executive Summary

GreyNoise reported on 2026-08-28 that 824 addresses forged six AI crawler names from Anthropic, OpenAI, Google, and Perplexity between 2026-07-28 and 2026-08-23, all on one HTTP client fingerprint. GreyNoise said none of those addresses matched published crawler ranges, none of the six names requested /robots.txt, and the requests targeted credential files such as .env and .aws/credentials. Check crawler User-Agent claims against vendor IP lists. Do not treat the User-Agent string as identity. GreyNoise did not publish the 824 addresses in the public post.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Forged AI crawler credential scanning. GreyNoise did not name a malware family |
| Actor / Attribution | Unnamed. GreyNoise said it is not naming who is behind it. Confidence none |
| Target | Internet facing web roots that expose environment files, cloud keys, private keys, or password stores, and sites that allow or waive controls based on crawler User-Agent strings |
| Vector | HTTP User-Agent spoofing of AI crawler names, including a ClaudeBot string that GreyNoise said matches Anthropic character for character |
| Status | Observed 2026-07-28 to 2026-08-23. Largest single day 2026-08-23. Public write up 2026-08-28 |
| First Observed | 2026-07-28 per GreyNoise |

## Detailed Findings

According to [GreyNoise](https://www.greynoise.io/blog/threat-actors-posing-as-ai-crawlers), automated scanners posed as crawlers of OpenAI, Anthropic, DeepSeek, and other companies while requesting files often left on misconfigured web servers. A cluster impersonating 13 AI crawlers from eight companies requested .env files, cloud access keys, private keys, and password stores. Six of those names arrived from the same 824 addresses in almost identical volume.

GreyNoise said those six names belong to Anthropic, OpenAI, Google, and Perplexity, and that they arrived on a single HTTP client fingerprint between 2026-07-28 and 2026-08-23. Across the 90 days to 2026-08-23, that fingerprint carried more than 1,500 different User-Agent strings, most of them ordinary browsers. Almost all of the six name traffic arrived in August. The largest single day was 2026-08-23.

GreyNoise said none of the six forged names requested /robots.txt in this traffic. Anthropic's real crawler, measured the same way, requested /robots.txt more often than any other path and never requested a credential file. GreyNoise checked all 824 addresses against published crawler ranges from Anthropic, OpenAI, Google, Perplexity, and Amazon. Not one matched. Over the same window, thousands of sessions carrying the ClaudeBot name did arrive from Anthropic's published range. GreyNoise also said two Amazon crawler names were forged in even greater volume and matched neither User-Agent Amazon documents.

GreyNoise said the 824 addresses sit in 795 separate /24 networks, so there is no single network to block. GreyNoise also said Google-Extended is a robots.txt token with no HTTP User-Agent, so all 263,849 sessions carrying that string in this traffic were forged. GreyNoise stated it observes requests arriving, not that a file was returned, and it is not naming an operator.

[Help Net Security](https://www.helpnetsecurity.com/2026/08/31/ai-crawlers-scan-exposed-credentials/) reported the same GreyNoise cluster on 2026-08-31. GreyNoise said the full 824 address list is in a customer package, not in the public post. This feed does not add those addresses, the half redacted JA4H fingerprint, or the real Anthropic crawler range 216.73.216.0/22 as IOCs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Masquerading | T1036 | User-Agent forged to match ClaudeBot and other crawler names |
| Active Scanning | T1595 | 824 addresses requested credential files on web roots |
| Unsecured Credentials: Credentials In Files | T1552.001 | Requests for .env, .aws/credentials, and similar paths |

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

On web and WAF logs, do not allow or suppress alerts from User-Agent alone. Join the connecting address to the published list for the crawler name it claims. GreyNoise listed claude.com/crawling/bots.json, openai.com/gptbot.json, openai.com/chatgpt-user.json, openai.com/searchbot.json, Google common crawlers, special crawlers, and user triggered fetchers JSON, Perplexity bot JSON, and Amazonbot address lists. Alert when a request claims ClaudeBot, GPTBot, Google-Extended, or PerplexityBot and the source is outside those lists. Alert on GET of /.env, /app/.env, /api/.env, /backend/.env, /.env.local, /.env.production, /.env.old, /.env.bak, /.aws/credentials, /.env.swp, or /.git/config from any host claiming to be a crawler. Hunt sessions that never fetch /robots.txt across days. GreyNoise published a half redacted JA4H value ge11nn05enus_f3bb7a for investigation, not for blocking. Do not alert on Anthropic's published range 216.73.216.0/22 when it is paired with the real crawler fingerprint. Keep .env, .git, and cloud credential files out of the web root. GreyNoise also said to upgrade Vite to 6.2.3, 6.1.2, 6.0.12, 5.4.15, or 4.5.10.

## References

- [GreyNoise] Threat Actors Are Posing as OpenAI, Anthropic and DeepSeek to Target Credentials and Secrets (2026-08-28): https://www.greynoise.io/blog/threat-actors-posing-as-ai-crawlers
- [Help Net Security] Threat actors are posing as AI crawlers to hunt for exposed credentials (2026-08-31): https://www.helpnetsecurity.com/2026/08/31/ai-crawlers-scan-exposed-credentials/
