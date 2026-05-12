# AI-Generated Zero-Day 2FA Bypass Exploit Discovered by Google—First Known Case of Criminal LLM-Weaponized Vulnerability Discovery

**Date:** 2026-05-12
**Tags:** nation-state, prompt-injection, malware

## Executive Summary

For the first time, Google Threat Intelligence Group (GTIG) identified a threat actor using a zero-day exploit that is believed to have been developed with AI. The flaw was a 2FA bypass, and the script showed all tell-tale signs of LLM-generated code: detailed docstrings, a clean class structure, even a hallucinated CVSS score baked into the comments. Google Threat Intelligence Group worked with the impacted vendor to disclose the vulnerability before the planned mass exploitation campaign could be executed.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI-Weaponized Vulnerability Discovery Campaign |
| Attribution | Unidentified criminal threat actor with LLM-assisted operations (confidence: high) |
| Target | Popular open-source web-based system administration tools; mass exploitation planned |
| Vector | AI-assisted zero-day vulnerability discovery and weaponization; semantic logic flaw exploitation |
| Status | disrupted |
| First Observed | 2026-05-11 |

## Detailed Findings

The vulnerability, described as a 2FA bypass, requires valid user credentials for exploitation. It stems from a high-level semantic logic flaw arising from a hard-coded trust assumption, something LLMs excel at spotting. Although there is no evidence to suggest that Google's Gemini was used, GTIG assessed with high confidence that an AI model was weaponized to facilitate the discovery and weaponization of the flaw via a Python script that featured all hallmarks typically associated with large language model-generated code. While fuzzers and static analysis tools are optimized to detect sinks and crashes, frontier LLMs excel at identifying these types of high-level flaws and hardcoded static anomalies. John Hultquist, chief analyst at Google Threat Intelligence Group, said anyone still treating AI-assisted vulnerability discovery as a future problem is already behind. "There's a misconception that the AI vulnerability race is imminent. The reality is that it's already begun. For every zero-day we can trace back to AI, there are probably many more out there," Hultquist said.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploitation of Vulnerability | T1190 | Attackers used AI to discover and weaponize previously unknown vulnerability for mass exploitation |
| Artificial Intelligence for Vulnerability Research | T1595.003 | AI model used to systematically search for and identify semantic logic flaws in code |

## IOCs

### Domains

_No IOCs disclosed; vendor name withheld per responsible disclosure by Google_

### Full URL Paths

_No IOCs disclosed; vendor name withheld per responsible disclosure by Google_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor for unusual AI API usage patterns consistent with vulnerability research (high-volume code analysis queries, repeated pattern matching against codebases). Track LLM-generated code signatures including hallucinated CVSS scores, textbook-style Python formatting, and excessive docstrings. Implement behavioral anomaly detection on systems running AI-powered vulnerability scanners. Alert on zero-day exploits exhibiting LLM code generation markers. Monitor dark forums for sale of AI-assisted exploit development services.

## References

- [Google Cloud Blog] Adversaries Leverage AI for Vulnerability Exploitation, Augmented Operations, and Initial Access (2026-05-11) — https://cloud.google.com/blog/topics/threat-intelligence/ai-vulnerability-exploitation-initial-access
- [The Hacker News] Hackers Used AI to Develop First Known Zero-Day 2FA Bypass for Mass Exploitation (2026-05-11) — https://thehackernews.com/2026/05/hackers-used-ai-to-develop-first-known.html
- [The Register] Google says criminals used AI-built zero-day in planned mass hack spree (2026-05-11) — https://www.theregister.com/ai-ml/2026/05/11/google-says-criminals-used-ai-built-zero-day-in-planned-mass-hack-spree/5237982
