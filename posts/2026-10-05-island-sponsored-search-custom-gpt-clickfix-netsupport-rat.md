# Island Details Sponsored Search Custom GPT ClickFix NetSupport RAT Campaign

**Date:** 2026-10-05
**Tags:** phishing, malware

## Executive Summary

Island reported a malware delivery campaign that abused paid search ads and attacker authored Custom GPTs to push ClickFix instructions and a NetSupport RAT loader. The campaign used lookalike ChatGPT destinations and a fake Cloudflare verification page to make Windows users run PowerShell. Defenders should block the loader domain and monitor for ClickFix style PowerShell execution.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Sponsored Search Custom GPT ClickFix NetSupport RAT |
| Attribution | Unknown (confidence: none) |
| Target | Users searching for ChatGPT |
| Vector | Paid search ads to lookalike ChatGPT destinations and Custom GPT content, followed by ClickFix instructions |
| Status | active |
| First Observed | 2026-05-31 |

## Detailed Findings

According to [island.io](https://www.island.io/blog/how-attackers-use-sponsored-search-custom-gpts-in-malware-delivery), attackers abused users' trust in sponsored search and ChatGPT by purchasing ads that appeared for searches such as chatgpt. The ads led to legitimate chatgpt.com routes containing attacker authored Custom GPT or shared chat content. In confirmed cases, unrelated prompts received the same fake service warning directing people to a backup domain. The lure domain redirected to a fake ChatGPT and Cloudflare verification page that used ClickFix instructions. Those instructions were designed to make Windows execute a PowerShell command that retrieved a malicious loader from fixconfig[.]app. Isolated analysis of that loader identified dynamic .NET compilation, persistence related behavior, code injection, Telegram Bot API communication, and behavior consistent with NetSupport RAT delivery. Island observed the broader delivery cluster across a three month period ending August 2026, including about 850 paid ad landings, 26 lookalike ChatGPT destinations, and 71 Google Ads campaign IDs. Only a small subset of destinations was confirmed to serve this exact lure, and these figures do not represent malware executions or infections. The campaign did not require a vulnerability in ChatGPT or Google. It abused trusted platforms, attacker authored content, paid search, and social engineering.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | Paid search ads and lookalike ChatGPT destinations used to deliver a malware loader. |
| User Execution | T1204 | ClickFix instructions convince users to run a PowerShell command. |

## IOCs

### Domains

```
fixconfig.app
```

### Full URL Paths

_Island reported fixconfig.app as the PowerShell loader host. No additional domains, hashes, or IPs were published._

### Splunk Format

```
"fixconfig.app"
```

### Affected Platforms

```
Windows
```

## Detection Recommendations

Block fixconfig.app at network and endpoint layers. Monitor for ClickFix style PowerShell execution launched from the Run dialog or clipboard paste. Alert on processes that perform dynamic .NET compilation, code injection, or Telegram Bot API communication. Inspect paid search results for lookalike ChatGPT domains and review Custom GPT content for fake service warnings.

## References

- [Island] How Attackers Use Sponsored Search & Custom GPT’s in Malware Delivery (2026-10-02) — https://www.island.io/blog/how-attackers-use-sponsored-search-custom-gpts-in-malware-delivery
