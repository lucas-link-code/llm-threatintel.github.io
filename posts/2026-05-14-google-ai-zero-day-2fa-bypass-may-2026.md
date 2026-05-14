# First Confirmed AI-Assisted Zero-Day Vulnerability Discovery and Weaponization—2FA Bypass Deployed in Wild

**Date:** 2026-05-14
**Tags:** malicious-tool, prompt-injection

## Executive Summary

Google's Threat Intelligence Group disclosed on May 11, 2026 the first confirmed case of attackers using an AI model to build a zero-day exploit deployed in the wild, a 2FA bypass targeting a popular open-source admin tool. Google says it has identified what may be the first known case where cybercriminals used AI to discover and weaponize a previously unknown zero-day vulnerability. Security researchers have long warned AI could one day accelerate cyberattacks. That day appears to be here.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI-Assisted Zero-Day Discovery Campaign |
| Attribution | Unnamed criminal syndicate (APT45 and UNC2814 linked based on behavioral indicators) (confidence: medium) |
| Target | Open-source system administration tools |
| Vector | AI-assisted vulnerability research and proof-of-concept generation |
| Status | disrupted |
| First Observed | 2026-05-11 |

## Detailed Findings

Google's threat intelligence group said it found evidence of several "prominent cyber crime threat actors" partnering to identify a bug in a Python script that would let them bypass two-factor authentication on a popular open-source system. The groups, which Google didn't identify, then used AI-assisted code to weaponize the previously unknown vulnerability. The attempt to exploit the unidentified open-source system was thwarted, and Google said it has since disclosed the flaw to the vendor. Google warned that advanced AI models are getting better at finding subtle security weaknesses in software that conventional cybersecurity tools often fail to catch. In the zero-day example, the model appeared to identify a hidden trust assumption in the software's login logic that could be exploited to bypass two-factor authentication protections. GTIG specifically named North Korean state actor APT45 (Andariel) for sending thousands of repetitive prompts to AI models to analyze CVEs and validate proof-of-concept exploits. Chinese state-linked operator UNC2814 used persona-driven jailbreaks like "act as a senior security auditor" to research vulnerabilities in embedded devices like TP-Link firmware. "For every zero-day we can trace back to AI, there are probably many more out there," according to John Hultquist, chief analyst at Google's threat intelligence group.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Vulnerability Discovery | T1592 | AI model used to identify and weaponize zero-day 2FA bypass vulnerability |
| Exploit Development | T0801 | AI-assisted code generation for zero-day weaponization |
| Multi-Factor Authentication Interception | T1556 | 2FA bypass attack vector discovered and deployed |

## IOCs

### Domains

_No IOCs published; vendor and affected system remain unidentified by Google to allow patching window_

### Full URL Paths

_No IOCs published; vendor and affected system remain unidentified by Google to allow patching window_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor for unusual patterns of CVE research queries to frontier AI models (e.g., ChatGPT, Claude, GPT-4, Gemini). Flag accounts submitting thousands of near-identical or rapidly iterated vulnerability analysis prompts. Implement behavioral detection for AI-generated exploit code signatures (educational docstrings, hallucinated CVSS scores, clean ANSI formatting). Establish red-team exercises to identify zero-day vulnerabilities before attackers do. Enable real-time vulnerability disclosure scanning to detect newly-released exploits targeting your infrastructure. Deploy MFA monitoring and authentication anomaly detection to catch 2FA bypass attempts.

## References

- [Google Threat Intelligence Group] First Confirmed AI-Assisted Zero-Day Vulnerability Discovery (2026-05-11) — https://cloud.google.com/blog/topics/threat-intelligence
- [Axios] AI-assisted hacking is already here, Google warns (2026-05-12) — https://www.axios.com/2026/05/12/ai-hacking-found-google-report
- [RoboRhythms] Google Caught the First AI-Built 2FA Zero-Day in May 2026 (2026-05-13) — https://www.roborhythms.com/google-ai-hackers-2fa-zero-day-may-2026/
- [The Hacker News] Hackers Used AI to Develop First Known Zero-Day 2FA Bypass for Mass Exploitation (2026-05-13) — https://thehackernews.com/2026/05/hackers-used-ai-to-develop-first-known.html
