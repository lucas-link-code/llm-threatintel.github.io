# Infostealer Malware Hijacking Claude Sessions and Bypassing MFA to Drain Paid Usage

**Date:** 2026-09-02
**Tags:** malware, llmjacking

## Executive Summary

Anthropic has warned Claude users that infostealer malware on their PCs has stolen active Claude login sessions, allowing attackers to access accounts and consume their usage, with warnings issued August 30, 2026. The company is signing affected users out of Claude, removing saved payment methods, and refunding charges it identifies as unauthorized. These stolen session cookies represent an already-authenticated state, allowing attackers to bypass multi-factor authentication and access accounts unnoticed.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Infostealer Claude Session Hijacking Campaign |
| Attribution | Unknown (commodity malware distribution) (confidence: low) |
| Target | Claude paid users with Windows and macOS endpoints |
| Vector | Commodity infostealer malware (Vidar, LummaC2, StealC, RedLine, Acreed, Atomic Stealer) stealing browser session cookies |
| Status | active |
| First Observed | 2026-08-30 |

## Detailed Findings

Infostealer malware families including Vidar, LummaC2, StealC, RedLine, and Acreed on Windows, and Atomic Stealer on macOS, are stealing active Claude session cookies from infected computers, allowing attackers to bypass multi-factor authentication and single sign-on, gaining unauthorized access to paid Claude accounts. Anthropic disclosed that a bad actor is using common infostealer malware to steal Claude login sessions from people's computers, then using those login sessions to access Claude accounts and consume their usage, with affected users noticing usage limits appearing refilled and then drained while they were not using Claude. The attacks represent a shift by bad actors from credentials to session tokens and authentication cookies. Six malware families are confirmed: Vidar, LummaC2, StealC, RedLine and Acreed on Windows, and Atomic Stealer on macOS—all commodity stealers sold or rented on dark web marketplaces that harvest locally stored browser credentials, autofill data and authentication cookies from compromised machines.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Web Session Cookie | T1539 | Adversaries harvest browser session tokens from infected endpoints to gain authenticated access to victim's Claude accounts |
| Lateral Movement via Session Token | T1570 | Stolen session tokens enable unauthorized API calls and account access without password or MFA challenges |

## IOCs

### Domains

_No specific IOCs published by Anthropic; incident confirmation via customer notifications and security vendor reports_

### Full URL Paths

_No specific IOCs published by Anthropic; incident confirmation via customer notifications and security vendor reports_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
macOS
```

## Detection Recommendations

Monitor for stolen Claude session tokens being used from unfamiliar geographic locations or IP addresses. Implement behavioral detection on endpoint security tools to identify unauthorized use of browser storage access and credential harvesting. Encourage users to enable session activity alerts in their Claude account settings and rotate credentials if suspicious usage is detected. Threat hunters should correlate infostealer C2 callbacks with Claude login history—session tokens stolen and exfiltrated 24–48 hours before unauthorized usage spikes. Organizations should audit access logs for out-of-band login sessions and implement continuous session validation. Note that signing out of Claude alone does not remove malware; full endpoint remediation is required.

## References

- [Anthropic via BleepingComputer] Anthropic warns infostealer malware is hijacking Claude sessions to drain usage (2026-08-30) — https://www.bleepingcomputer.com/news/artificial-intelligence/anthropic-warns-infostealer-malware-is-hijacking-claude-sessions-to-drain-usage/
- [SC Media] Infostealer malware compromises Claude accounts, bypassing 2FA (2026-09-01) — https://www.scworld.com/brief/infostealer-malware-compromises-claude-accounts-bypassing-2fa
- [eSecurity Planet] Anthropic Warning: Infostealer Malware Is Hijacking Claude Sessions, Draining Accounts (2026-09-01) — https://www.esecurityplanet.com/threats/news-claude-session-hijacking-infostealer-malware/
- [The Cyber Express] Anthropic Warns Of Infostealers Hijacking Claude Sessions (2026-09-02) — https://thecyberexpress.com/infostealers-hijacking-claude-sessions/
