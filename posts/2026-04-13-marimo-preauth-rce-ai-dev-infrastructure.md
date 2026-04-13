# Marimo Pre-Authentication RCE (CVE-2026-39987): Critical AI Development Toolchain Compromise via WebSocket Terminal

**Date:** 2026-04-13
**Tags:** supply-chain, malicious-tool

## Executive Summary

CVE-2026-39987 is a critical pre-authentication remote code execution vulnerability (CVSS v4.0: 9.3) in Marimo, a reactive Python notebook, actively exploited in early April 2026 targeting AI researchers and developers at Stanford, Mozilla AI, OpenAI, and BlackRock. Attackers focused on obtaining LLM provider API keys and cloud credentials within minutes of gaining shell access, representing the initial access phase of AI supply chain attack scenarios.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Marimo Toolchain Compromise Wave |
| Attribution | Opportunistic threat actors (confidence: medium) |
| Target | AI research teams, ML engineers, enterprise development environments |
| Vector | Unauthenticated WebSocket terminal endpoint in Marimo notebook interface |
| Status | active |
| First Observed | 2026-04-06 |

## Detailed Findings

Marimo is actively used by engineering and research teams at organizations including Stanford, Mozilla AI, OpenAI, and BlackRock, with approximately 19,600 GitHub stars. The application maintains multiple WebSocket endpoints to handle real-time notebook cell execution, UI widget state, and an integrated browser terminal that provides shell access to the environment running the Marimo process. The vulnerability disclosure occurred on April 10, 2026, with exploitation attempts confirmed within hours of public disclosure via Endor Labs honeypot analysis.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Remote code execution via unauthenticated WebSocket endpoint in AI development tool |
| Credentials from Password Stores | T1555 | Attackers enumerated and exfiltrated LLM provider API keys and cloud credentials post-compromise |
| Supply Chain Compromise | T1195 | Compromise of AI development infrastructure as vector for downstream supply chain poisoning |

## IOCs

### Domains

_CVE-2026-39987 affects Marimo versions prior to patched release; no specific IOCs published; honeypot telemetry from Endor Labs and Sysdig (April 2026) documents exploitation activity_

### Full URL Paths

_CVE-2026-39987 affects Marimo versions prior to patched release; no specific IOCs published; honeypot telemetry from Endor Labs and Sysdig (April 2026) documents exploitation activity_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
marimo
```

## Detection Recommendations

Monitor for WebSocket connections to Marimo instances; alert on shell command execution within Marimo terminal endpoints, particularly commands enumerating environment variables (env, printenv, aws configure list, gcloud config list). Search logs for access to .env files, ~/.aws, ~/.ssh, and cloud credential stores post-compromise. Implement network segmentation to isolate Marimo instances from production LLM provider credentials; rotate all LLM API keys, cloud credentials, and Hugging Face tokens if Marimo instances were exposed.

## References

- [Cloud Security Alliance AI Safety Initiative] Marimo Pre-Auth RCE: AI Development Toolchain Under Attack (2026-04-10) — https://labs.cloudsecurityalliance.org/research/csa-research-note-marimo-rce-cve-2026-39987-ai-toolchain-202/
- [Endor Labs] Root in One Request: Marimo's Critical Pre-Auth RCE (CVE-2026-39987) (2026-04-06) — https://endorlabs.com/blog/marimo-rce
- [Sysdig Threat Research] Marimo OSS Python Notebook RCE: From Disclosure to Exploitation in Under 10 Hours (2026-04-08) — https://sysdig.com/blog/marimo-rce-april-2026
