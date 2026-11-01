# Salt Labs Hijacks Manus Agentic AI Platform With a Single Email

**Date:** 2026-11-01
**Tags:** prompt-injection, llmjacking

## Executive Summary

Salt Labs researchers hijacked the Manus agentic AI platform by hiding malicious instructions inside an ordinary email, causing the agent to execute malicious code. From there the researchers reached the email, cloud, and code repository accounts the user had connected to Manus. The finding shows that connected agent identities and their downstream cloud and repository access are exposed to prompt injection delivered through normal messaging channels.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Manus agent hijack via email prompt injection |
| Attribution | Unattributed (confidence: none) |
| Target | Users of the Manus agentic AI platform with connected email, cloud, and code repository accounts |
| Vector | Prompt injection embedded in an ordinary email message processed by the agent |
| Status | active |
| First Observed | 2026-10-18 |

## Detailed Findings

According to Salt Labs, the agentic AI platform Manus could be hijacked with a single email. The researchers hid malicious instructions inside an ordinary message and got Manus to execute malicious code. From that foothold the researchers reached the email, cloud, and code repository accounts the user had connected to the agent. The report demonstrates that agent connected credentials and third party integrations are reachable through prompt injection delivered via routine inbound messaging.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | A crafted email delivers the malicious instructions the agent processes. |
| Valid Accounts | T1078 | The hijacked agent leverages the user connected email, cloud, and code repository accounts. |

## IOCs

### Domains

_No IOCs published. Salt Labs reported a research hijack of the Manus platform._

### Full URL Paths

_No IOCs published. Salt Labs reported a research hijack of the Manus platform._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Manus agentic AI platform
```

## Detection Recommendations

Limit which accounts and integrations are connected to agentic AI platforms and scope those credentials to least privilege. Monitor agent outbound actions to email, cloud, and code repository APIs for anomalous access tied to inbound message processing. Treat agent processed email as untrusted input and alert on code execution or repository writes that follow message ingestion.

## References

- [Salt Security] Salt Labs found the agentic AI platform Manus could be hijacked with a single email (2026-10-29) — https://salt.security/blog/how-we-hijacked-an-ai-agent-with-a-single-email
