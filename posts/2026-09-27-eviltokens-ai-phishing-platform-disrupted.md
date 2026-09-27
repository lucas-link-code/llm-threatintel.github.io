# EvilTokens: AI-Powered Phishing-as-a-Service Platform Disrupted After Compromising 12,000 Inboxes

**Date:** 2026-09-27
**Tags:** phishing, malicious-tool

## Executive Summary

Within months of launching in February 2026, EvilTokens had been linked to more than 12,000 compromised email inboxes across over 10,000 organizations worldwide. EvilTokens, a powerful cybercrime platform that used AI at every step of the attack chain, from compromising email accounts to designing intricate roadmaps for financial fraud and scams. Working with its industry and law enforcement partners, Microsoft seized 50 websites used to operate the service and disabled more than 150 additional domains tied to its infrastructure.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | EvilTokens |
| Attribution | Storm-2992 (Microsoft Threat Intelligence) (confidence: medium) |
| Target | Organizations across wholesale distribution, construction, financial services, real estate, higher education, healthcare in US, Canada, UK, Australia, India, France |
| Vector | Device code phishing via OAuth 2.0 flow abuse; AI-assisted mailbox analysis for targeting; AI-generated phishing templates |
| Status | disrupted |
| First Observed | 2026-02-18 |

## Detailed Findings

Since February 2026, EvilTokens has offered a subscription platform combining account compromise, mailbox analysis, target selection, and fraud preparation. Its dashboard and chatbot centralized access to those capabilities, with a $1,500 initial sign-up fee and $500 monthly subscription, marketed through Telegram channels. Evidence points to large portions of the toolkit developed using AI assistance (aka vibe coded), signaling the technology's ability to lower skill barriers and help aspiring cybercriminals develop advanced toolkits and help perpetrate fraud at scale. The platform used AI throughout the attack chain, including to create phishing emails customized for specific targets to increase the chances of success. Post-compromise, EvilTokens enabled threat actors to utilize AI assistants to sift through victim mailbox activity and engineer a phishing message based on the accessible email content. Microsoft worked closely with specialist officers from the Metropolitan Police Service's cybercrime team, sharing intelligence that enabled officers to take operational action in the United Kingdom. On September 11, 2026, officers arrested two men, aged 32 and 38, and seized digital devices and other items for examination.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566.002 | Device code phishing via OAuth 2.0 abuse with AI-crafted email lures |
| Account Manipulation | T1098 | Compromised email accounts analyzed by AI for fraud opportunity identification |

## IOCs

### Domains

_50 websites seized, 150+ additional domains disabled by Microsoft DCU; specific IOCs not published in analyzed sources_

### Full URL Paths

_50 websites seized, 150+ additional domains disabled by Microsoft DCU; specific IOCs not published in analyzed sources_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Microsoft 365
Office 365
```

## Detection Recommendations

Monitor for device code authentication flow abuse; alert on unusual OAuth device code initiations. Track for secondary mailbox access by non-standard clients immediately following device code phishing. Implement conditional access policies to flag logins from high-risk geographic locations or device types. Monitor email rules creation post-compromise for forwarding or delegation abuse. Alert on rapid escalation from first access to high-value target reconnaissance in mailboxes. Implement AMSI or memory scanning to detect vibe-coded malware signatures characteristic of AI-generated code.

## References

- [Microsoft] Disrupting EvilTokens: The AI Chatbot Built for Cybercrime (2026-09-22) — https://blogs.microsoft.com/on-the-issues/2026/09/22/disrupting-eviltokens-the-ai-chatbot-built-for-cybercrime/
- [Microsoft Security Blog] Unmasking EvilTokens: Getting to the root of device code phishing (2026-09-22) — https://www.microsoft.com/en-us/security/blog/2026/09/22/unmasking-eviltokens-getting-to-the-root-of-device-code-phishing/
- [SecurityWeek] AI-Powered Phishing Platform EvilTokens Disrupted by Microsoft (2026-09-24) — https://www.securityweek.com/ai-powered-phishing-platform-eviltokens-disrupted-by-microsoft/
