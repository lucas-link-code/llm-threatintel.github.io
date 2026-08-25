# Splunk Patches Critical MCP Server RCE and AI Toolkit Model Pickle Execution

**Date:** 2026-08-25
**Tags:** mcp-security, model-poisoning

## Executive Summary

Splunk advisory SVD-2026-0808, published 2026-08-19, patches CVE-2026-76404, a CVSS 9.1 deserialization RCE in Splunk MCP Server app versions below 1.2.1 that lets a Splunk admin run OS commands on the host. The same bulletin patches Splunk AI Toolkit, including CVE-2026-76395, CVSS 8.8, where a power-role user can execute code by loading a model with crafted sparse-matrix pickle data. Upgrade MCP Server to 1.2.1 and AI Toolkit to 6.0.0 or 6.0.1 as listed; Splunk published no campaign IOCs and did not report in-the-wild exploitation.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Splunk MCP Server and AI Toolkit deserialization flaws; no malware named |
| Actor / Attribution | No actor. Vendor-disclosed vulnerabilities. Confidence none |
| Target | Splunk deployments running MCP Server app below 1.2.1 or AI Toolkit below the fixed 5.7 and 6.0 lines |
| Vector | Authenticated unsafe deserialization in MCP credential management; pickle in AI Toolkit model-load REST API |
| Status | Patched. Fixed versions published 2026-08-19. No public exploit identified in contemporaneous coverage |
| First Observed | Advisory 2026-08-19 |

## Detailed Findings

According to Splunk SVD-2026-0808, the August 2026 hardening release covers Cisco Talos Intelligence for Enterprise Security Cloud, Splunk AI Toolkit, Splunk Connect for Kafka, Splunk MCP Server app, and Splunk On-Call. The highest score in the bulletin is CVE-2026-76404.

Splunk stated that in MCP Server app versions below 1.2.1, a user who holds the admin Splunk role can execute arbitrary commands on the underlying operating system because the credential-management component deserializes stored data without checking type, CWE-502. Workaround: turn off or remove the MCP Server app. Fix: 1.2.1. Acknowledgment: Kuniyoshi Noguchi. OpenCVE and SentinelOne repeated the same vendor text; vuln.today stated no public exploit was identified at analysis time and the CVE was not in CISA KEV.

Splunk AI Toolkit received nine CVEs. The RCE that matters for model supply chain is CVE-2026-76395: in versions below 6.0.0, a user with the power role can execute arbitrary code on the Splunk server by loading a model file containing crafted sparse-matrix data, because a model codec deserializes that data without guarding against embedded pickle. Related high issues include CVE-2026-76391, agent run history swapping the caller session for a system token; CVE-2026-76394, missing authorization on container and connection REST handlers; CVE-2026-76397, power-role access to other users' experiment history; and CVE-2026-76399, power-role modification of app-provided scheduled searches that run as the search owner, the last of which Splunk said affects versions below 6.0.1.

Product status in the advisory: AI Toolkit 5.7 line, upgrade to 6.0.0; AI Toolkit 6.0 line below 6.0.1, upgrade to 6.0.1; MCP Server 1.2 line below 1.2.1, upgrade to 1.2.1.

CybersecurityNews summarized the bulletin around 2026-08-19 and highlighted both the MCP RCE and the AI Toolkit pickle model-load path. Splunk published no hashes, domains, or exploited-in-the-wild telemetry. LiteLLM, FastAPI, and the Splunk product names are affected software, not package IOCs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploitation for Client Execution | T1203 | CVE-2026-76404 and CVE-2026-76395 turn trusted Splunk app features into host code execution. |
| Exploitation for Privilege Escalation | T1068 | MCP Server lets a Splunk admin role reach OS command execution on the Splunk host. |
| Command and Scripting Interpreter | T1059 | AI Toolkit deserializes pickle inside model-load, which executes attacker Python on the server. |
| Command and Scripting Interpreter: Python | T1059.006 | CVE-2026-76395 deserializes pickle inside AI Toolkit model load, executing attacker Python on the Splunk server. |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Inventory Splunk apps: MCP Server below 1.2.1 and AI Toolkit below 6.0.0 or 6.0.1 depending on the installed line. Upgrade or disable those apps. Restrict who holds admin and power roles until patched.

In Splunk audit logs, hunt credential-management activity on the MCP Server app, model-upload and model-load REST calls, Agent Run History searches running under a system token, container start and stop by non-admin users, and edits to app-provided scheduled searches by power-role accounts.

On the Splunk host EDR, alert on unexpected child processes of the Splunk service account after credential-store or model-load API use. After upgrade, rotate credentials stored in the MCP Server app, as Splunk's contemporaneous coverage recommended in case stored objects were tampered with.

Do not denylist splunk.com or Splunkbase. Those are vendor platforms.

## References

- [Splunk] SVD-2026-0808 Security Hardening Release for Splunk Apps and Add-ons - August 2026 (2026-08-19) — https://advisory.splunk.com/advisories/SVD-2026-0808
- [CybersecurityNews] Splunk Patches Critical MCP Server RCE and 16 Other Security Flaws Across AI Toolkit, Kafka Apps (2026-08-19) — https://cybersecuritynews.com/splunk-patches-security-flaws/
- [SentinelOne] CVE-2026-76404: Splunk MCP Server App RCE Vulnerability (2026-08-20) — https://www.sentinelone.com/vulnerability-database/cve-2026-76404/
