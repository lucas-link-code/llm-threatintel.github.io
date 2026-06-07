# ChatGPhish: Browser-Integrated Prompt Injection Weaponizes ChatGPT Summarization for Phishing and Passive Reconnaissance

**Date:** 2026-06-07
**Tags:** prompt-injection, phishing

## Executive Summary

A browser-based prompt injection technique transforms any web page into a phishing delivery surface by exploiting ChatGPT's page summarization feature, rendering attacker-controlled links, fake security alerts, and QR codes directly inside the trusted ChatGPT interface. Researchers at Permiso disclosed the attack dubbed ChatGPhish, which builds on the same trust-transfer logic previously demonstrated against Microsoft Copilot. Permiso submitted the initial vulnerability report to OpenAI via Bugcrowd on April 29, 2026, and after follow-up communication on May 7, 2026, clarifying the broader phishing, QR-code, and passive tracking implications, the research was publicly published on May 29, 2026.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ChatGPhish - Summarization-Based Prompt Injection |
| Attribution | Unknown / Proof-of-Concept Disclosed (confidence: low) |
| Target | ChatGPT users; enterprises allowing ChatGPT access |
| Vector | Cross-prompt injection (XPIA) via attacker-controlled web page content; exploitation of summarization feature |
| Status | active |
| First Observed | 2026-05-29 |

## Detailed Findings

The chatgpt.com response renderer trusts Markdown links and Markdown image URLs that originated from a third-party page the assistant has just summarized, auto-fetching those images and surfacing those links as live, clickable elements inside the trusted assistant UI. In a hypothetical attack scenario, a bad actor can append a small payload to any web page that the victim later prompts ChatGPT to summarize, causing it to leak their IP, User-Agent, and Referer details when attacker-hosted images embedded in the page are automatically fetched when the answer is rendered. It can result in malicious Markdown links being rendered as live clickable elements inside the assistant's response, serve fake system-style security alerts, and serve a QR code from an attacker's S3 bucket and trick the victim into scanning it via their mobile device, effectively bypassing desktop URL filters and enterprise security controls. When the user opens the page in their browser and asks ChatGPT to summarize the page, the chatbot does summarize the content and summarizes the tool's purpose and key features. Immediately beneath this summary, there's a box warning "A new device was added to your account." The "click here" link looks like a real OpenAI/ChatGPT-issued security URL. But when the user clicks the link, it takes them to an attacker-controlled domain.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | Fake security alerts and clickable links rendered in ChatGPT |
| Prompt Injection | T1609 | Cross-prompt injection via web page content to manipulate LLM behavior |
| Reconnaissance | T1592 | Passive IP/browser enumeration via auto-fetched images |

## IOCs

### Domains

_PoC uses generic attacker-controlled S3 buckets and domains; no specific indicators published_

### Full URL Paths

_PoC uses generic attacker-controlled S3 buckets and domains; no specific indicators published_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Implement semantic input/output filtering and anomaly detection on AI-integrated surfaces within enterprise environments. Monitor AI browser activity logs for unexpected outbound image fetch requests to unknown or URL-shortened endpoints. Enforce strict Markdown rendering policies in ChatGPT integrations—disable automatic image fetching from untrusted sources. Deploy link analysis on any URLs rendered in AI summaries before user interaction. For enterprise ChatGPT deployments, require user confirmation before allowing LLM-generated links to execute. Monitor for QR code generation in LLM outputs to external services.

## References

- [Permiso Security / cybersecuritynews.com] New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads (2026-05-29) — https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/
- [The Hacker News] ChatGPhish Vulnerability Turns ChatGPT Web Summaries Into a Phishing Surface (2026-05-29) — https://thehackernews.com/2026/05/chatgphish-vulnerability-turns-chatgpt.html
- [The Register] ChatGPT prompt injection turns web pages into phishing lures (2026-05-29) — https://www.theregister.com/research/2026/05/29/chatgpt-prompt-injection-turns-web-pages-into-phishing-lures/5248137
