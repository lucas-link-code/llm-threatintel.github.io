# Phantom Squatting: AI-Generated Domains Register Fake URLs for Phishing as LLMs Hallucinate Non-Existent Websites

**Date:** 2026-07-04
**Tags:** phishing, shadow-ai

## Executive Summary

Palo Alto Networks' Unit 42 identifies 'phantom squatting,' a new attack technique where attackers register AI-hallucinated but non-existent domain names before legitimate users can claim them, then host phishing pages on those domains. Attackers have started buying those made-up domains before anyone else can, then hosting phishing pages on them to catch traffic that AI tools point their way. This represents a novel attack vector exploiting the intersection of LLM hallucination vulnerabilities and domain registration abuse.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Phantom Squatting Campaign |
| Attribution | Unknown (confidence: none) |
| Target | Organizations using generative AI for research or workflows; employees relying on AI tool recommendations |
| Vector | Domain registration and phishing via AI-hallucinated URLs |
| Status | active |
| First Observed | 2026-07-01 |

## Detailed Findings

Large language models continue to invent web addresses that do not exist. Attackers have started buying those made-up domains before anyone else can, then hosting phishing pages on them to catch traffic that AI tools point their way. AI-generated but non-existent domains can become high-confidence phishing platforms once attackers register them, bypassing conventional brand monitoring and creating new avenues for credential theft. The attack surface is particularly dangerous because users trust AI recommendations, and the domains appear legitimate in AI-generated recommendations, making them more credible than typical phishing URLs. This technique exploits the gap between LLM hallucinations and human verification of URLs provided by AI assistants.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1598.003 | Attack leverages AI-generated domain recommendations to deliver phishing links |
| Social Engineering | T1566.002 | Attackers exploit user trust in AI systems to deliver malicious URLs |

## IOCs

### Domains

_No specific IOCs published; attack vector is dynamic based on LLM hallucination patterns_

### Full URL Paths

_No specific IOCs published; attack vector is dynamic based on LLM hallucination patterns_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
ChatGPT
Gemini
Other LLM-based assistants
```

## Detection Recommendations

Organizations should: (1) implement AI-output validation for all URLs before user consumption; (2) educate users that AI-generated URLs should be verified through independent means before clicking; (3) establish internal DNS filtering for known hallucinated domain patterns; (4) monitor WHOIS registrations for suspicious patterns matching AI-hallucinated domain names; (5) implement browser-based detection flagging domains that match AI-hallucination patterns; (6) coordinate with domain registrars to implement detection of bulk registrations of plausible but AI-generated domain names.

## References

- [Palo Alto Networks Unit 42 / The Hacker News] Phantom Squatting Uses AI-Hallucinated Domains for Phishing and Malware (2026-07-01) — https://techmaniacs.com/2026/07/01/cybersecurity-daily-briefing-july-01-2026/
- [Palo Alto Networks Unit 42] Phantom Squatting Attack Analysis (2026-07-01) — https://thehackernews.com/2026/07/phantom-squatting-attack-ai-hallucinated.html
