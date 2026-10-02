# Sponsored Search Ads and Attacker Custom GPTs Deliver ClickFix NetSupport RAT Loader

**Date:** 2026-10-02
**Tags:** phishing, malware

## Executive Summary

Attackers bought sponsored search ads that led to lookalike ChatGPT destinations and attacker authored Custom GPTs, then served a fake service warning and ClickFix prompt that installed a NetSupport RAT loader, according to Island. Island mapped about 850 paid ad landings across 26 lookalike ChatGPT destinations and 71 Google Ads campaign IDs over three months ending August 2026. The chain abused trusted platforms and social engineering rather than any ChatGPT or Google vulnerability, and the loader was retrieved from an attacker domain.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Sponsored Search Custom GPT ClickFix Delivery |
| Attribution | Unknown (confidence: low) |
| Target | Users searching for ChatGPT and related terms |
| Vector | Sponsored search ads to lookalike domains and attacker Custom GPTs, then ClickFix PowerShell execution |
| Status | active |
| First Observed | 2026-05 |

## Detailed Findings

Island reported that attackers abused trust in sponsored search and ChatGPT by purchasing ads appearing for searches such as chatgpt, leading to legitimate chatgpt.com routes that hosted attacker authored Custom GPT or shared chat content. According to Island, unrelated prompts across several Custom GPT destinations returned the same fake backup domain warning, directing users to a lure domain that redirected to a fake ChatGPT and Cloudflare verification page using ClickFix instructions. Island stated the ClickFix command was designed to make Windows execute a PowerShell command that retrieved a heavily obfuscated loader from fixconfig[.]app, and that isolated analysis observed dynamic .NET compilation, persistence behavior, code injection, Telegram Bot API communication, and behavior consistent with NetSupport RAT. Island reported that across a three month observation period ending in August 2026 the broader delivery cluster included about 850 paid ad landings, 26 lookalike ChatGPT destinations, and 71 Google Ads campaign IDs, noting these figures do not represent malware executions or infections and that only a small subset of destinations served this exact lure. Island added that the campaign did not require a vulnerability in ChatGPT or Google.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution | T1204 | Victims were lured into running a ClickFix PowerShell command that fetched the malicious loader. |
| PowerShell | T1059.001 | The ClickFix instruction executed a PowerShell command to retrieve a heavily obfuscated loader from fixconfig[.]app. |

## IOCs

### Domains

```
fixconfig.app
```

### Full URL Paths

_fixconfig.app is the loader retrieval domain named by Island. Lookalike ChatGPT destinations and 71 Google Ads campaign IDs were counted but not enumerated in the excerpt._

### Splunk Format

```
"fixconfig.app"
```

### Affected Platforms

```
Windows
Google Ads
ChatGPT Custom GPTs
```

## Detection Recommendations

Block or alert on the loader domain fixconfig.app and on PowerShell one liners spawned from clipboard paste prompts on verification style pages. Monitor sponsored search landings to lookalike ChatGPT domains and to shared chat or Custom GPT links that return identical fake service warnings. Correlate Telegram Bot API egress, dynamic .NET compilation, and unsolicited PowerShell retrieval from browser initiated ClickFix flows at the endpoint.

## References

- [Island] How Attackers Use Sponsored Search & Custom GPT's in Malware Delivery (2026-09-30) — https://www.island.io/blog/how-attackers-use-sponsored-search-custom-gpts-in-malware-delivery
