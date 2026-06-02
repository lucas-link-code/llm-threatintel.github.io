# ChatGPhish: ChatGPT Web Summarization Markdown Injection Enables Phishing and Data Exfiltration

**Date:** 2026-06-02
**Tags:** prompt-injection, phishing

## Executive Summary

A browser-based prompt injection technique that transforms any web page into a phishing delivery surface by exploiting ChatGPT's page summarization feature, rendering attacker-controlled links, fake security alerts, and QR codes directly inside the trusted ChatGPT interface. The research was publicly published on May 29, 2026.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ChatGPhish |
| Attribution | Unknown attacker(s); technique is generalized and available to any actor (confidence: none) |
| Target | Any ChatGPT user who uses the 'Analyze this link' or page summarization feature on web pages containing attacker-controlled content |
| Vector | Any page a user visits and asks ChatGPT to summarize—a GitHub README, documentation portal, blog post, or SaaS dashboard—can silently carry malicious instructions into the model's response. By appending a small instruction payload to any publicly accessible web page, an unauthenticated attacker can influence how ChatGPT structures and renders its summarization output. |
| Status | active |
| First Observed | 2026-05-29 |

## Detailed Findings

Once that attacker content is processed, it surfaces inside the ChatGPT response window, styled identically to genuine assistant output, complete with formatted alerts, clickable links, and inline images. The browser's same-origin policy offers no protection because the AI assistant executes with the user's authenticated context, making traditional web security boundaries irrelevant. Researchers at Permiso have disclosed the attack dubbed ChatGPhish, which builds on the same trust-transfer logic previously demonstrated against Microsoft Copilot. ChatGPhish escalates that premise by swapping the bounded email primitive for the browser where users spend the majority of their working day. Permiso submitted the initial vulnerability report to OpenAI via Bugcrowd on April 29, 2026, citing 'Untrusted Markdown Rendering Leads to XSS, Phishing, and Data Exfiltration.' OpenAI responded noting the report could not be reproduced. A revised submission on May 1, 2026, with expanded proof-of-concept steps, was subsequently classified as a duplicate of a previously reported issue. After follow-up communication on May 7, 2026, clarifying the broader phishing, QR-code, and passive tracking implications, the research was publicly published on May 29, 2026.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1598.003 | Attacker-controlled markdown links rendered inside ChatGPT response |
| Cross-Site Scripting | T1059.007 | Markdown injection leading to UI redress and fake security alerts |
| Social Engineering | T1566.002 | Spoofed system alerts and security notifications |

## IOCs

### Domains

_No specific IOCs published; technique is generalized and exploits OpenAI feature design rather than specific infrastructure_

### Full URL Paths

_No specific IOCs published; technique is generalized and exploits OpenAI feature design rather than specific infrastructure_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor ChatGPT sessions for summarization of untrusted content; implement user awareness training on risks of asking AI assistants to analyze or summarize user-generated web content; pressure OpenAI to implement origin labeling for markdown links sourced from summarized content; log all ChatGPT API calls involving page summarization with external URLs.

## References

- [Cybersecurity News] New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads (2026-05-29) — https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/
- [Permiso Security (via Cybersecurity News)] ChatGPhish: ChatGPT Web Summarization Markdown Injection (2026-05-29) — https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/
