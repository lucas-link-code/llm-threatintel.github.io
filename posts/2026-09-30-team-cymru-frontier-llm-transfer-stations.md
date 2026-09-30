# Team Cymru: More Than 80,000 LLM Relays Pool Frontier Model Access for Clients in China and Hong Kong

**Date:** 2026-09-30
**Tags:** llmjacking

## Executive Summary

Team Cymru reported on 2026-09-22 that an eight day scan confirmed 10,867 self hosted LLM transfer stations running Claude Relay Service or sub2api, and that later collection passed 80,000 relays. In one cluster on United States VPS providers, more than 4,000 addresses in China and Hong Kong sent about 14 TB to 304 relays and received more than 7 TB back over eight days in late August 2026. Team Cymru shared relay addresses with model providers and did not publish them. Hunt self hosted CRS and sub2api deployments and pooled API keys. Do not block provider API domains.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Frontier model transfer stations using Claude Relay Service and sub2api |
| Actor / Attribution | Unnamed relay operators. Team Cymru tied client addresses to China and Hong Kong and did not name a state group (confidence: low for any state link, none for a named cluster) |
| Target | Frontier model providers and the accounts or subscriptions whose credentials are pooled behind the relays |
| Vector | Self hosted gateways that accept customer keys and present pooled API keys or logged in subscription sessions upstream |
| Status | active |
| First Observed | Late August 2026 for the measured cluster. The September 2026 report is the public measurement |

## Detailed Findings

According to Team Cymru, Claude Relay Service, called CRS 1.x, and its successor sub2api are open source gateways published on GitHub by developer Wei-Shaw. Team Cymru reported that sub2api adds user management, per user billing, a layer that turns subscriptions into API access, and a prompt audit subsystem. Team Cymru reported that the sub2api codebase had been forked more than 8,000 times and that the project Telegram channel had almost 7,000 subscribers. Team Cymru described the operating pattern as customers authenticating to the transfer station while the station authenticates to the model provider, so the provider sees the relay address and the pooled credential rather than the end user.

Team Cymru reported 26 commercial sponsors on the sub2api GitHub page: 15 selling relay access to Claude, OpenAI or Codex, and Gemini; 7 selling residential proxies; 2 selling frontier model accounts; 1 relay oriented CDN; and 1 image and video API reseller. Team Cymru said the account sellers obtain credentials by abusing promotional offers and possibly by credential or token theft. That theft path is Team Cymru's possibility statement, not a named incident with recovered keys.

Team Cymru's eight day scan counted 10,867 confirmed stations: 9,456 on sub2api and 1,353 on CRS 1.x, across 457 ASNs. Team Cymru said no single hosting provider held more than about 11 percent of the stations. A note on the same report says later discovery raised the relay count above 80,000. Help Net Security, citing Team Cymru on 2026-09-23, reported the same split and the later total above 80,000.

Team Cymru described one cluster on a few United States VPS providers. More than 4,000 addresses in China and Hong Kong connected to 304 stations. Over eight days in late August those addresses sent approximately 14 TB to the cluster and received more than 7 TB. After Team Cymru dropped sources that sent less than 1 GB in a week, about 244 addresses in China and Hong Kong still reached 173 stations, which then contacted 262 AI endpoints. Team Cymru said 13 addresses in one China Unicom Shanghai /24 sent approximately 9 TB to a single station and talked only to that station. Team Cymru assessed that concentration as more consistent with a coordinated deployment than with independent users.

Team Cymru split the upstream endpoints into two groups reached by the same stations. The smaller group was Chinese providers: ByteDance Doubao and Volcano Engine, DeepSeek, Alibaba Qwen on DashScope, Zhipu, and MiniMax. Team Cymru described that leg as download heavy and low volume, and said one reading is aggregation and resale rather than a region bypass. The larger group was OpenAI, Anthropic, xAI, and Google. Team Cymru described that leg as upload heavy. Help Net Security reported the same split and the same caution that prompts were not visible.

On the Anthropic portion, Team Cymru counted 17 stations that reached an address in Anthropic ASN AS399358 for api.anthropic.com. Over eight days those stations uploaded about 81 GB and downloaded about 1.4 GB, a ratio Team Cymru stated as 58 to 1. Six of the 17 stations reached that endpoint on a steady basis. Team Cymru converted the 81 GB, if it is text, to an estimate of 16 to 23 billion input tokens and 140 to 200 million output tokens, and said a flagship model price for that slice would be roughly US$160,000 to US$240,000. Team Cymru said it could not see prompts and therefore could not confirm distillation versus other abuse, and that it asked Anthropic about the upload bias. Help Net Security repeated that the prompts and responses were not available, so distillation was not confirmed. Team Cymru also wrote that Anthropic has separately said similar reseller networks rotate stolen API keys and session tokens.

Team Cymru said hourly volume on the Anthropic leg, shifted to China Standard Time, rose through the morning, dipped, returned, and fell by midnight, and that the pattern did not match a six day 996 schedule. Team Cymru also described one CHINANET Beijing host that sent more than 19 GB to a single sub2api node, about 70 percent of the Chinese traffic that node received, and that the same host separately pulled from a large self described medical imaging repository in the United States. Team Cymru said that repository analysis was still open and did not name the repository.

Team Cymru published gateway software tags and active volumes as of 2026-09-21, not a list of malicious server addresses. The largest tags were new-api at 36.7k, sub2api at 29.4k, 9router at 7.0k, grok2api at 3.6k, and one-api at 3.2k. Smaller tags included omniroute 2.5k, freellmapi 904, axonhub 620, metapi 569, chatgpt2api 356, gemini-balance 301, one-hub 142, chatnio 108, done-hub 53, and kiro-gateway 18. Those names are software families. They are not package indicators and the provider API hostnames are not indicators.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Proxy: External Proxy | T1090.002 | Team Cymru reported that transfer stations hide the client address from the model provider |
| Valid Accounts | T1078 | The relays present pooled API keys or logged in subscription sessions upstream |
| Automated Collection | T1119 | Team Cymru measured multi terabyte, upload heavy flows toward Western model APIs and could not confirm the prompt content |

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

Search enterprise and cloud VPS images for Claude Relay Service and sub2api processes, config directories, and listeners that proxy several model providers behind one local API key. In provider audit logs, alert when one API key or subscription session suddenly sends high volume from a VPS network, calls multiple model families, or appears in a relay the organization does not operate. Compare key creation and first use from an unfamiliar ASN within minutes, which is the handoff pattern Unit 42 previously described for the same class of transfer station. Do not denylist api.anthropic.com, OpenAI, Google, or xAI API hosts. Team Cymru did not publish the relay IP list. Use provider notices and internal netflow for those addresses.

## References

- [Team Cymru] LLM Gateways: How They Enable Frontier Model Abuse (2026-09-22): https://www.team-cymru.com/post/llm-gateway-frontier-model-abuse
- [Help Net Security] 80,000 relay servers help users in China slip past U.S. AI region bans (2026-09-23): https://www.helpnetsecurity.com/2026/09/23/china-ai-relay-frontier-model-abuse/
