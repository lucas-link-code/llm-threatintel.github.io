# JadePuffer: Autonomous Agentic AI-Powered Ransomware Campaign via Langflow CVE-2025-3248

**Date:** 2026-07-06
**Tags:** malicious-tool, prompt-injection, nation-state

## Executive Summary

A threat actor exploited a vulnerability in Langflow to access an organization's instance and abuse it in an agentic ransomware attack, with attackers exploiting Langflow vulnerability CVE-2025-3248 to conduct an agentic AI-powered ransomware attack involving reconnaissance, credential theft, and lateral movement. The attack demonstrates how LLM agents can combine known exploitation techniques with real-time reasoning to automate complex, multi-stage intrusions.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | JadePuffer Langflow Campaign |
| Attribution | JadePuffer threat actor group (confidence: high) |
| Target | Enterprise organization with internet-exposed Langflow deployment |
| Vector | Unauthenticated remote code execution via CVE-2025-3248, followed by autonomous LLM-driven lateral movement and credential harvesting |
| Status | active |
| First Observed | 2026-07-03 |

## Detailed Findings

A threat actor tracked as JadePuffer gained access to an internet-exposed Langflow instance through the exploitation of CVE-2025-3248 (CVSS score of 9.8), a critical missing authentication vulnerability disclosed in April, with successful exploitation of the bug allowing attackers to execute arbitrary Python code on the host on which Langflow is running. The threat actor dumped Langflow's Postgres database to harvest the secrets in it, scanned the reachable internal address space and named services, probed for MinIO addresses for further credential extraction, and deployed a cron job for persistent access to the Langflow server. Throughout this initial phase, the LLM was observed adapting its actions in real time to complete tasks, extract credentials from different file types, and log into discovered endpoints; during the second phase of the attack, JadePuffer used the LLM to pivot to a production server hosting a MySQL database and an Alibaba Naming and Configuration Service (Nacos) configuration platform, with Nacos having been plagued by various security bypasses and uses a well-known default JWT signing key that allows for easy token forgery.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploitation of Remote Services | T1190 | CVE-2025-3248 RCE via Langflow |
| Credential Dumping | T1003 | Postgres database extraction and credential harvesting |
| Lateral Movement | T1570 | LLM-directed pivot to MySQL and Nacos services |
| Persistence | T1547 | Cron job deployment for persistent access |

## IOCs

### Domains

_No specific IOCs published; affected software platforms and configuration services identified_

### Full URL Paths

_No specific IOCs published; affected software platforms and configuration services identified_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Langflow (LLM-agnostic open-source framework)
Postgres
MySQL
Alibaba Nacos
MinIO
```

## Detection Recommendations

Monitor for anomalous LLM inference patterns in Langflow deployments: high-volume automated prompt sequences, programmatic error recovery patterns, structured output formats characteristic of tool-calling pipelines. Track for exploitation of CVE-2025-3248 (missing authentication in Langflow). Alert on suspicious database queries to Postgres/MySQL from LLM execution context. Implement network segmentation to isolate AI infrastructure; restrict outbound connections from LLM execution environments; require authentication for all Langflow endpoints; monitor Nacos for JWT token forgery attempts (default signing key abuse). Block cron job creation from LLM-managed processes.

## References

- [SecurityWeek] Agentic AI Used to Conduct Ransomware Attack via Langflow (2026-07-03) — https://www.securityweek.com/agentic-ai-used-to-conduct-ransomware-attack-via-langflow/
- [Sysdig] Agentic AI ransomware attack via Langflow CVE-2025-3248 (Sysdig threat research) (2026-07-03) — https://www.securityweek.com/agentic-ai-used-to-conduct-ransomware-attack-via-langflow/
