# LMDeploy CVE-2026-33626 SSRF Exploited Within 12 Hours for Cloud Metadata Access

**Date:** 2026-04-25
**Tags:** malicious-tool

## Executive Summary

CVE-2026-33626, a Server-Side Request Forgery vulnerability in LMDeploy published on April 21, 2026, was exploited within 12 hours and 31 minutes of publication, with the Sysdig Threat Research Team observing the first LMDeploy exploitation attempt against their honeypot fleet. Attackers used the vision-language image loader as an SSRF primitive to enumerate internal infrastructure and access cloud metadata credentials.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LMDeploy SSRF Infrastructure Reconnaissance |
| Attribution | Unknown (opportunistic automated exploitation) (confidence: low) |
| Target | Organizations running LMDeploy <0.12.3 for LLM inference serving |
| Vector | SSRF via vision-language model image loading endpoint targeting AWS IMDS, internal services |
| Status | active |
| First Observed | 2026-04-21 |

## Detailed Findings

Over a single eight-minute session, the attacker used the vision-language image loader as a generic HTTP SSRF primitive to port-scan the internal network behind the model server: AWS Instance Metadata Service (IMDS), Redis, MySQL, a secondary HTTP administrative interface, and an out-of-band (OOB) DNS exfiltration endpoint. An advisory as specific as GHSA-6w67-hwm5-92mq, which includes the affected file, parameter name, root-cause explanation, and sample vulnerable code, is effectively an input prompt for any commercial LLM to generate a potential exploit; any advisory that names the vulnerable function, shows the missing check, or quotes the affected code pattern becomes a turnkey exploit in the age of capable code-generation models.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Server-Side Request Forgery | T1090.001 | SSRF via vision-language endpoint to access internal cloud metadata services |
| Credential Access | T1110.001 | IAM credentials exfiltrated via cloud metadata endpoint (IMDS) |
| System Information Discovery | T1046 | Port scanning of internal infrastructure (Redis, MySQL, HTTP admin interfaces) |

## IOCs

### Domains

_Vulnerability affects LMDeploy ≤0.12.0; patch CVE-2026-33626 updates to v0.12.3 with _is_safe_url() check_

### Full URL Paths

_Vulnerability affects LMDeploy ≤0.12.0; patch CVE-2026-33626 updates to v0.12.3 with _is_safe_url() check_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

LMDeploy has 7,798 GitHub stars and does not appear in CISA's Known Exploited Vulnerabilities (KEV) catalog, increasing likelihood that many deployments remain unpatched. Monitor for GET requests to vision-language endpoints with suspicious URL parameters (e.g., 169.254.169.254, localhost, internal IP addresses); implement strict URL validation in load_image() before HTTP requests; audit AWS IMDS access logs for requests originating from LMDeploy processes; apply patch to v0.12.3 or later immediately.

## References

- [Sysdig Threat Research Team] CVE-2026-33626: How attackers exploited LMDeploy LLM Inference Engines in 12 hours (2026-04-24) — https://webflow.sysdig.com/blog/cve-2026-33626-how-attackers-exploited-lmdeploy-llm-inference-engines-in-12-hours
- [The Hacker News] LMDeploy CVE-2026-33626 Flaw Exploited Within 13 Hours of Disclosure (2026-04-24) — https://thehackernews.com/2026/04/lmdeploy-cve-2026-33626-flaw-exploited.html
