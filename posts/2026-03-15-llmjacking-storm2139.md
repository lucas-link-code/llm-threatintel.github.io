# LLMjacking Operations and Storm-2139: Stolen API Keys at Scale

**Date:** 2026-03-15
**TLP:** TLP:CLEAR
**Tags:** LLMjacking, Cloud AI Abuse

## Executive Summary

Storm-2139, a financially motivated threat group tracked by Microsoft, continues to operate large-scale LLMjacking infrastructure. The operation steals cloud AI API keys from Azure OpenAI, AWS Bedrock, and Google Vertex AI, then resells access through proxy services. Despite Microsoft's legal action in early 2025 that disrupted parts of the operation, the group has adapted and resumed activity.

## Detailed Findings

LLMjacking refers to the unauthorized use of stolen or compromised API credentials to access cloud-hosted LLM services. Storm-2139 has industrialized this process, operating a multi-tier business model: credential theft at scale, proxy infrastructure to resell access, and customer-facing services marketed on Telegram and underground forums.

The group acquires API keys through multiple vectors. Exposed credentials in public GitHub repositories are harvested automatically using custom scanners. Infostealer malware logs containing cloud provider credentials are purchased from underground marketplaces. In some cases, social engineering is used to target cloud administrators directly.

Once API keys are obtained, Storm-2139 operates proxy endpoints that accept requests from paying customers and forward them to the legitimate cloud AI APIs using the stolen credentials. Customers pay a fraction of the legitimate API cost, while the stolen key holders absorb the charges until the keys are revoked.

Sysdig's threat research team has estimated that a single compromised LLM API key can generate over $46,000 in charges per day when used at capacity, making this one of the more lucrative forms of cloud resource abuse.

### Microsoft Legal Action

In January 2025, Microsoft filed a civil lawsuit against ten individuals associated with Storm-2139, seizing several domains used for proxy infrastructure. However, the group adapted by rotating infrastructure to new providers and shifting communication channels. The legal action disrupted but did not eliminate the operation.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Application Access Token | T1528 | Cloud AI API key theft |
| Resource Hijacking | T1496 | Unauthorized use of cloud AI compute |
| Valid Accounts: Cloud Accounts | T1078.004 | Using stolen cloud credentials |
| Automated Exfiltration | T1020 | Automated credential scanning from GitHub |

## IOCs

### Domains

```
llmjacking.services
api-proxy.ai-services.cloud
```

### Splunk Format

```
"llmjacking.services" OR "api-proxy.ai-services.cloud"
```

## Detection Recommendations

Monitor cloud AI service usage for anomalous patterns: sudden spikes in API calls, requests from unexpected IP ranges or geographies, and usage outside business hours. Implement API key rotation policies and ensure keys are never committed to source control. GitHub secret scanning and pre-commit hooks can prevent accidental exposure.

For Splunk environments, correlate cloud provider billing alerts with API usage logs to identify unauthorized consumption. Alert on API calls originating from known proxy or VPN infrastructure.

## References

- Microsoft: Legal Action Against Storm-2139 (January 2025)
- Sysdig: LLMjacking Research and Cost Analysis (2024)
- MITRE ATT&CK: T1528, T1496
