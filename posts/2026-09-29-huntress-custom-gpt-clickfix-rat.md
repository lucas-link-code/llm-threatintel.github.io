# Huntress: Attacker Custom GPTs Deliver ClickFix RAT With DLL Sideloading

**Date:** 2026-09-29
**Tags:** phishing, malware

## Executive Summary

Huntress found attacker created ChatGPT Custom GPTs impersonating legitimate products and pushing victims to a Google Sites ClickFix lure that installed a remote access trojan. The chain ran PowerShell to fetch a malicious MSI, then abused a Canon signed binary, COTFileReadApp.exe, for DLL sideloading with dual persistence to establish resilient access. Huntress responded to at least 40 related incidents and confirmed two Custom GPT driven infections; OpenAI removed one Custom GPT on September 25 and a replacement appeared on September 27.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Custom GPT ClickFix RAT |
| Attribution | Unattributed (confidence: none) |
| Target | ChatGPT users seeking legitimate product downloads |
| Vector | Attacker controlled Custom GPT responses linking to a Google Sites ClickFix lure that runs PowerShell and a malicious MSI |
| Status | active |
| First Observed | 2026-09-25 |

## Detailed Findings

According to Huntress, the campaign started in late September 2026 and used attacker created Custom GPTs hosted on the legitimate ChatGPT.com site to impersonate legitimate product offerings. The Custom GPT replied to victim prompts with a Google Sites link that led to a ClickFix style lure, tricking victims into running PowerShell that downloaded and executed a malicious MSI installer. Huntress reported that the installer deployed a legitimate Canon signed application, COTFileReadApp.exe, which attackers abused to sideload a malicious DLL and evade detection, with a later wave using a Stardock signed executable for the same purpose. Huntress said the payload established resilient access through dual persistence and DLL sideloading. The Huntress SOC responded to at least 40 incidents tied to the specific Google Sites domain, and the team confirmed that two of those incidents came through a Custom GPT instance. Huntress reported the Custom GPT to OpenAI, which took it down as of September 25, and on September 27 Huntress discovered a new Custom GPT linked to the same campaign.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution: Malicious File | T1204.002 | Victims ran PowerShell and a malicious MSI after following the Custom GPT delivered ClickFix lure |
| DLL Side-Loading | T1574.002 | Canon and Stardock signed executables loaded attacker DLLs to evade detection |

## IOCs

### Domains

_No machine actionable IOCs published in the article excerpt; the specific Google Sites domain and file hashes were not disclosed._

### Full URL Paths

_No machine actionable IOCs published in the article excerpt; the specific Google Sites domain and file hashes were not disclosed._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
```

## Detection Recommendations

Alert on PowerShell command lines that fetch a remote MSI from a Google Sites URL and then spawn msiexec. Monitor for legitimate Canon or Stardock signed executables, including COTFileReadApp.exe, loading unsigned DLLs from user writable paths. Review enterprise policy for Custom GPT and generative AI chat usage, and restrict outbound access to unknown Google Sites pages that deliver installers.

## References

- [Huntress] Attackers Abuse ChatGPT Custom GPTs to Deliver RAT via ClickFix (2026-09-27) — https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat
