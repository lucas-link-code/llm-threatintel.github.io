# ChatGPhish: ChatGPT Web Summarization Markdown Injection Enables Phishing and IP Exfiltration

**Date:** 2026-05-30
**Tags:** prompt-injection, phishing

## Executive Summary

A browser-based prompt injection technique that transforms any web page into a phishing delivery surface by exploiting ChatGPT's page summarization feature, rendering attacker-controlled links, fake security alerts, and QR codes directly inside the trusted ChatGPT interface. Researchers bypassed OpenAI's initial dismissal by demonstrating the attack's scale across passive tracking, UI redress, and QR-code pivots.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ChatGPhish |
| Attribution | Security Research (Permiso Security) (confidence: none) |
| Target | ChatGPT users; enterprises using ChatGPT for document review and web research |
| Vector | By appending a small instruction payload to any publicly accessible web page, an unauthenticated attacker can influence how ChatGPT structures and renders its summarization output. Because chatgpt.com's response renderer trusts Markdown links and image URLs originating from third-party summarized content, three distinct attack primitives become available: UI redress / phishing, spoofed system alerts, and QR-code pivot. |
| Status | active |
| First Observed | 2026-05-29 |

## Detailed Findings

Cybersecurity researchers disclosed details of a vulnerability in OpenAI ChatGPT that leverages the AI assistant's implicit trust in Markdown links and images to trigger prompt injections and open the door to phishing attacks. The technique has been codenamed ChatGPhish by Permiso Security. The chatgpt.com response renderer trusts Markdown links and Markdown image URLs that originated from a third-party page the assistant has just summarized. It auto-fetches those images and surfaces those links as live, clickable elements inside the trusted assistant UI. Permiso submitted the initial vulnerability report to OpenAI via Bugcrowd on April 29, 2026, citing "Untrusted Markdown Rendering Leads to XSS, Phishing, and Data Exfiltration." OpenAI responded noting the report could not be reproduced. A revised submission on May 1, 2026, with expanded proof-of-concept steps, was subsequently classified as a duplicate of a previously reported issue. After follow-up communication on May 7, 2026, clarifying the broader phishing, QR-code, and passive tracking implications, the research was publicly published on May 29, 2026. The attack does not require user interaction beyond the normal summarization workflow; attacker-injected content appears indistinguishable from legitimate ChatGPT output.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1059 | Attacker injects malicious instructions into third-party web content that ChatGPT interprets during summarization |
| Phishing | T1566 | Attacker-rendered links and fake security alerts inside ChatGPT UI trick users into credential disclosure or malware download |
| Data Exfiltration Over C2 | T1041 | Attacker-controlled image fetches trigger IP address and User-Agent disclosure via passive DNS queries |

## IOCs

### Domains

_No IOCs published; attack is client-side renderer exploitation with no attacker infrastructure required for basic phishing variant._

### Full URL Paths

_No IOCs published; attack is client-side renderer exploitation with no attacker infrastructure required for basic phishing variant._

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor ChatGPT usage for instances where users are asked to summarize attacker-controlled web pages (e.g., internal portals, documentation, GitHub READMEs). Detect when summarization output contains unexpected links, QR codes, or security alerts. Implement browser-level Content Security Policy (CSP) headers on all internet-facing web properties to prevent Markdown injection from attacker-appended payloads. Train users that ChatGPT summaries can include embedded phishing content indistinguishable from legitimate ChatGPT output. Establish a no-summarize list for sensitive categories of pages (e.g., corporate email, banking, password managers).

## References

- [Permiso Security] ChatGPhish Vulnerability: Turns ChatGPT Web Summaries Into a Phishing Surface (2026-05-30) — https://thehackernews.com/2026/05/chatgphish-vulnerability-turns-chatgpt.html
- [Cybersecurity News] New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads (2026-05-29) — https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/
