# PraisonAIAgents SSRF Vulnerability (CVE-2026-40160): Cloud Metadata Access via Malicious URL Crawling

**Date:** 2026-04-13
**Tags:** malicious-tool, supply-chain

## Executive Summary

PraisonAIAgents before version 1.5.128 contains an SSRF vulnerability (CWE-918) in its web_crawl module. The httpx fallback path uses user-supplied URLs directly in asynchronous HTTP GET requests with automatic redirect following and no validation of the host. An LLM agent tricked into crawling an internal URL can reach cloud metadata endpoints (169.254.169.254), internal services, and localhost. The response content is returned to the agent and may appear in output visible to the attacker. This enables an attacker controlling an LLM agent to induce requests to internal IP addresses and services, including cloud metadata endpoints, potentially exposing sensitive internal data.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI Agent SSRF Exploitation (CVE-2026-40160) |
| Attribution | Unknown (confidence: low) |
| Target | Organizations running PraisonAIAgents for multi-agent AI workflows |
| Vector | Server-side request forgery via compromised or malicious LLM agent input to web_crawl function |
| Status | active |
| First Observed | 2026-04-01 |

## Detailed Findings

Prior to 1.5.128, web_crawl's httpx fallback path passes user-supplied URLs directly to httpx.AsyncClient.get() with follow_redirects=True and no host validation. An LLM agent tricked into crawling an internal URL can reach cloud metadata endpoints (169.254.169.254), internal services, and localhost. The response content is returned to the agent and may appear in output visible to the attacker. This fallback is the default crawl path on a fresh PraisonAI installation (no Tavily key, no Crawl4AI installed). The vulnerability is particularly dangerous in production environments where agents have autonomy to interpret user requests.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Server-Side Request Forgery | T1918 | SSRF via web crawling function enables access to cloud metadata endpoints and internal services |
| Credentials from Cloud Metadata | T1578 | Metadata endpoint access exposes IAM role credentials, temporary security tokens |

## IOCs

### Domains

_No IOCs published; vulnerability patched in version 1.5.128_

### Full URL Paths

_No IOCs published; vulnerability patched in version 1.5.128_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
praisonaiagents
```

## Detection Recommendations

Monitor PraisonAIAgents web_crawl requests for URLs targeting cloud metadata ranges (169.254.169.254/32), internal RFC1918 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), or localhost (127.0.0.1). Implement network segmentation preventing agent VMs/containers from reaching metadata endpoints. Require upgrade to version 1.5.128 or later immediately. Audit agent logs for requests to internal services or metadata endpoints; treat as indicators of agent compromise or malicious prompt injection.

## References

- [OffSeq Threat Radar] CVE-2026-40160: Server-Side Request Forgery in MervinPraison PraisonAIAgents (2026-04-12) — https://radar.offseq.com/threat/cve-2026-40160-cwe-918-server-side-request-forgery-ff80f530
