# Amazon Threat Intelligence Documents ARTEX Agents Running Self Sustaining AI Credential Theft and Deepfake KYC Fraud Campaigns

**Date:** 2026-11-14
**Tags:** llmjacking, malicious-tool, phishing

## Executive Summary

Amazon Threat Intelligence observed threat actors using the open source ARTEX agentic AI penetration testing framework to run sustained offensive campaigns between October 3 and November 5, 2026, captured by the MadPot decoy sensor network. The most prominent campaign stole AI provider API keys at scale and recycled them to pay for the LLM inference powering further credential hunting, while another targeted cryptocurrency exchanges for KYC verification bypass using real time deepfake injection. Organizations exposing AI inference endpoints or hosting upstream provider keys in internet facing applications should audit credential exposure and monitor for agentic request patterns against their LLM APIs.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX Agentic Cybercrime Operations |
| Attribution | Unattributed threat actors operating ARTEX (confidence: low) |
| Target | Organizations exposing AI inference APIs and upstream provider keys, plus cryptocurrency exchanges |
| Vector | Internet exposed AI applications and standing instruction prompts driving autonomous agents |
| Status | active |
| First Observed | 2026-10-03 |

## Detailed Findings

According to the AWS Security Blog, Amazon's MadPot decoy sensor network captured requests from AI agents between October 3 and November 5, 2026 that carried the agents' own operating memory from offensive campaigns run on ARTEX, an open source agentic AI penetration testing framework. The agents sent these requests to sensors configured to present as popular LLM inference APIs, and the requests included the agents' own campaign records. Amazon Threat Intelligence assessed with moderate confidence that ARTEX was used because of prompt references to ARTEX tooling and other technical artifacts. Operators instructed the agents through standing instruction prompts that set mission objectives, targeting rules, and operational constraints, and the agents then handled the work themselves, including working through a fixed sequence of countries and prioritizing enterprise production sites over personal projects. In the credential theft campaign the agents located internet exposed AI applications, extracted the upstream provider keys they held, validated those keys, and stored them in a managed pool, after which stolen keys were fed into the framework's own model gateway to power further key hunting. AWS reported that agents validated identities through each provider's token and identity services, enumerated storage, assessed permission scope, and targeted managed AI model services, secrets and parameter stores, and application identities, with a stated preference for premium frontier models over general cloud permissions. A second campaign targeted cryptocurrency exchanges for KYC verification bypass using real time deepfake injection. AWS notified potentially affected AWS customers and published indicators of compromise so organizations running the affected technologies can review their own environments.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Application Access Token | T1528 | Agents harvested and validated AI provider and cloud API keys exposed by internet facing AI applications |
| Cloud Infrastructure Discovery | T1580 | Agents enumerated storage and assessed permission scope after validating stolen cloud identities |

## IOCs

### Domains

_The AWS Security Blog states it publishes indicators of compromise in the post; no specific atomic IOCs were reproduced in the retrieved text, so none are listed here. No IOCs fabricated._

### Full URL Paths

_The AWS Security Blog states it publishes indicators of compromise in the post; no specific atomic IOCs were reproduced in the retrieved text, so none are listed here. No IOCs fabricated._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Internet exposed AI applications
LLM inference API endpoints
Managed cloud AI model services
Cloud secrets and parameter stores
Cryptocurrency exchange KYC platforms
```

## Detection Recommendations

Monitor LLM inference and AI gateway logs for requests carrying agent operating memory, tool call transcripts, or campaign style instructions sent to endpoints that should only receive normal application traffic. Alert on bulk enumeration of cloud token and identity services, secrets stores, and parameter stores from AI application workloads. Track outbound validation calls against multiple AI provider key endpoints in short succession from a single source, which indicates credential pool construction. Rotate any provider keys held by internet exposed AI applications and restrict read scope on storage buckets that share data with AI vendors.

## References

- [AWS Security Blog] Amazon Threat Intelligence observes threat actors running cybercrime campaigns with ARTEX AI agents (2026-11-13) — https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/
