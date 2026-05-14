# Shadow AI Data Breach: Community Bank Exposes SSNs via Unauthorized AI Application—First SEC Form 8-K Filing of Shadow AI Incident

**Date:** 2026-05-14
**Tags:** shadow-ai

## Executive Summary

Community Bank disclosed use of an "unauthorized AI-based software application" exposing customer data including names, dates of birth, and Social Security numbers. One possibility is that the data was entered into a generative AI tool outside the bank's approved systems. If so, that could raise questions about whether the information was transmitted to a third-party provider and how it may have been retained or processed. This represents the first publicly disclosed corporate breach tied explicitly to shadow AI tool usage and SEC disclosure.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Shadow AI Data Exfiltration via Unauthorized Generative AI Tool |
| Attribution | Unknown - Possible employee negligence or insider misconfiguration (confidence: low) |
| Target | Community Bank (US-based financial institution) |
| Vector | Unauthorized use of generative AI tool (ChatGPT, Claude, or similar) |
| Status | disrupted |
| First Observed | 2026-05-12 |

## Detailed Findings

Community Bank stated in its cybersecurity disclosure: "The company is evaluating the customer data that was affected and is conducting notifications as required by applicable federal and state laws and regulatory guidance." This included customer names, dates of birth, and Social Security numbers. The bank confirmed that it suffered no operational impact and customers were not prevented from accessing their accounts or payment services as a result. The incident highlights a critical gap in enterprise AI governance: employees bypassing approved security controls to use consumer-grade generative AI for sensitive operations, resulting in uncontrolled data transmission to third-party servers.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unauthorized Data Transfer | T1020 | Customer PII transmitted via unauthorized AI tool to external servers |
| Exfiltration Over Web Service | T1567 | Sensitive data sent to third-party generative AI service without authorization |

## IOCs

### Domains

_No IOCs published; specific AI tool and external destination remain undisclosed by bank_

### Full URL Paths

_No IOCs published; specific AI tool and external destination remain undisclosed by bank_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Implement data loss prevention (DLP) with behavioral analytics to detect copying/pasting sensitive PII into browser-based applications. Monitor egress traffic to known generative AI service domains (openai.com, anthropic.com, google.com). Deploy endpoint DLP to prevent clipboard access by unauthorized applications. Establish shadow AI detection tools to identify unauthorized AI tool usage on corporate networks. Require real-time alerts on any transfer of regulated data (PII, SSN, credit card) to external services. Implement browser-level controls to block paste operations into web-based AI tools. Conduct quarterly shadow AI discovery scans across all departments.

## References

- [The Register] US bank reports itself after slinging customer data at 'unauthorized AI app' (2026-05-12) — https://www.theregister.com/security/2026/05/12/us-bank-reports-itself-after-ai-customer-data-mishap/5238787
