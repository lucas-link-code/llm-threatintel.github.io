# CVE-2026-29872: Awesome-LLM-Apps Cross-Session API Token Disclosure

**Date:** 2026-04-04
**TLP:** TLP:CLEAR
**Tags:** shadow-ai, malware

## Executive Summary

A cross-session information disclosure vulnerability in the awesome-llm-apps Streamlit-based GitHub MCP Agent stores user-supplied API tokens in process-wide environment variables without proper session isolation, allowing attackers to retrieve sensitive GitHub Personal Access Tokens or LLM API keys from subsequent unauthenticated users since Streamlit serves multiple concurrent users from a single Python process.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Awesome-LLM-Apps Multi-Tenant Credential Leakage |
| Attribution | Unknown (confidence: none) |
| Target | Developers using awesome-llm-apps Streamlit agent |
| Vector | Process-wide environment variable exposure in shared Streamlit runtime |
| Status | active |
| First Observed | 2026-03-04 |

## Detailed Findings

The affected Streamlit-based GitHub MCP Agent stores user-supplied API tokens in process-wide environment variables using os.environ without proper session isolation. Because Streamlit serves multiple concurrent users from a single Python process, credentials provided by one user remain accessible to subsequent unauthenticated users. This is a critical architectural flaw affecting shared Streamlit deployments of LLM agents, where each user's session should be isolated but credentials leak across boundaries. An attacker can exploit this issue to retrieve sensitive information such as GitHub Personal Access Tokens or LLM API keys, potentially leading to unauthorized access to private resources and financial abuse.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Credential Access | T1555 | Cross-session retrieval of API tokens stored in environment variables |
| Lateral Movement | T1570 | Stolen GitHub/LLM tokens enable unauthorized access to user resources |

## IOCs

### Domains

_No IOCs published; design flaw in shared Streamlit instances_

### Full URL Paths

_No IOCs published; design flaw in shared Streamlit instances_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
awesome-llm-apps (affected version in commit e46690f99c3f08be80a9877fab52acacf7ab8251, 2026-01-19)
```

## Detection Recommendations

Audit awesome-llm-apps deployments running the vulnerable commit; implement per-user session isolation in Streamlit MCP agents; use secrets management (HashiCorp Vault, AWS Secrets Manager) instead of environment variables; rotate all GitHub PATs and LLM API keys that may have been exposed; monitor for unauthorized access using stolen tokens; disable process-level environment variable inheritance in Streamlit.

## References

- [MITRE CVE Threat Intelligence] CVE-2026-29872: Cross-session information disclosure in awesome-llm-apps (2026-03-30) — https://cve.threatint.eu/CVE/CVE-2026-29872
