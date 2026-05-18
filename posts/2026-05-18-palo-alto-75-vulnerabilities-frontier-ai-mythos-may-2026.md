# Frontier AI Models Discover 75+ Vulnerabilities in Vendor Code—Palo Alto Networks AI-Driven Vulnerability Surge Signals 'Vulnpocalypse'; 3-5 Month Window to Patch Before Attackers Gain Access

**Date:** 2026-05-18
**Tags:** nation-state

## Executive Summary

Palo Alto Networks found 75 vulnerabilities in its products—more than seven times the amount it usually finds in a month—after beginning to use advanced AI cybersecurity models from Anthropic and OpenAI. The company is among the first with access to Anthropic's Mythos Preview and OpenAI's GPT-5.5-Cyber, and now estimates organizations have just three to five months before attackers broadly gain access to these capabilities.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI-Driven Vulnerability Discovery (Project Glasswing) |
| Attribution | Palo Alto Networks, Microsoft, and other vendors leveraging frontier AI models (confidence: high) |
| Target | Critical infrastructure, enterprises, government agencies (as defenders must patch before attackers gain AI-powered exploit generation access) |
| Vector | Frontier LLMs (Claude Mythos, GPT-5.5-Cyber) autonomously scanning codebases to discover zero-day vulnerabilities |
| Status | active |
| First Observed | 2026-05-14 |

## Detailed Findings

Palo Alto Networks usually finds five vulnerabilities a month, but on May 14, 2026, disclosed it scanned its entire codebase using frontier models including Anthropic's Mythos and OpenAI's GPT-5.5-Cyber, finding 75 security holes covered in 26 CVEs. As of May 13, they had patched all important vulnerabilities in SaaS products; today's advisory covers 26 CVEs (representing 75 issues) versus typical volume of <5 CVEs per month, with none being exploited in the wild. Finding vulnerabilities required extensive human expertise and customization; Palo Alto experienced ~30% false-positive rate on average, and spent significant time building an 'AI-scanning harness' to feed models threat intelligence, context, and operational guardrails. Mozilla also disclosed that Mythos found 271 flaws in Firefox 150, leading to 423 Firefox bugs fixed in April—more than 5x March's 76 fixes. Palo Alto now estimates a narrow three-to-five-month window for organizations to outpace the adversary before AI-driven exploits start to become the new norm.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Automated Vulnerability Scanning | T1592 | Frontier LLMs autonomously scan codebases to discover zero-day vulnerabilities at scale |
| Vulnerability Exploitation | T1499 | Once AI models become widely available, exploit generation will accelerate, shortening time-to-weaponization |
| Defense Evasion | T1027 | AI-generated exploits may use novel evasion techniques not seen in human-written code |

## IOCs

### Domains

_No specific IOCs; this is a strategic threat signal regarding the acceleration of vulnerability discovery and exploitation timelines_

### Full URL Paths

_No specific IOCs; this is a strategic threat signal regarding the acceleration of vulnerability discovery and exploitation timelines_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Organizations should assume frontier AI models will soon become available to attackers; prioritize patching of all vulnerabilities disclosed by vendors leveraging AI scanning; implement rapid patch deployment pipelines capable of deployment within days, not weeks; reduce internet-facing attack surface aggressively; monitor for exploitation of newly disclosed vulnerabilities with shortened detection thresholds; integrate vulnerability feeds from multiple vendors to avoid blind spots; assume that zero-days will be weaponized within hours to days, not weeks.

## References

- [The Register] Welcome to the vulnpocalypse, as vendors use AI to find bugs and patches multiply like rabbits (2026-05-14) — https://www.theregister.com/patches/2026/05/14/welcome-to-the-vulnpocalypse-as-vendors-use-ai-to-find-bugs-and-patches-multiply-like-rabbits/5240027
- [Axios] Palo Alto Networks says Mythos, GPT-5.5 found 85 bugs in weeks (2026-05-13) — https://www.axios.com/2026/05/13/palo-alto-networks-mythos-gpt-cybersecurity
- [Palo Alto Networks] Defender's Guide to the Frontier AI Impact on Cybersecurity: May 2026 Update (2026-05-14) — https://www.paloaltonetworks.com/blog/2026/05/defenders-guide-frontier-ai-impact-cybersecurity-may-2026-update/
- [SecurityWeek] Microsoft, Palo Alto Networks Find Many Vulnerabilities by Using AI on Their Own Code (2026-05-14) — https://www.securityweek.com/microsoft-palo-alto-networks-find-many-vulnerabilities-by-using-ai-on-their-own-code/
