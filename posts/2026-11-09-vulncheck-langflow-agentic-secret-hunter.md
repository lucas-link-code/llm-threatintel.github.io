# VulnCheck Canaries Link the Microsoft Agentic AI Secret Hunter to Langflow CVE-2025-3248 Exploitation

**Date:** 2026-11-09
**Tags:** malicious-tool, llmjacking

## Executive Summary

VulnCheck canary sensors recorded the same IP central to Microsoft's agentic AI secret hunting report, 199.19.77.84, exploiting Langflow via CVE-2025-3248 to read credentials directly from hosts. The operator ran 11 payload stages over about 36 minutes in a pattern resembling an autonomous agent working a target. The activity persisted one day after Microsoft published, so defenders should treat this infrastructure as still active.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Microsoft agentic AI secret hunter (VulnCheck canary observation) |
| Attribution | Unattributed, shares infrastructure with the actor Microsoft tracked scanning GitHub for exposed secrets (confidence: medium) |
| Target | Internet facing Langflow deployments and organizations using exposed credentials |
| Vector | Exploitation of Langflow CVE-2025-3248 and PHP upload progress session priming probes |
| Status | active |
| First Observed | 2026-11-02 |

## Detailed Findings

According to VulnCheck, its canaries logged 25 events from IP address 199.19.77.84 across three countries from 13 distinct requests. This is the same address at the center of Microsoft Threat Intelligence research published on November 5, 2026 that described agentic AI tooling hunting exposed GitHub secrets and abusing Azure Key Vault and Azure AI services. VulnCheck reported that instead of leaked GitHub secrets, the operator reached its canaries by exploiting Langflow to pull credentials directly off the host. Across roughly 36 minutes the operator ran 11 payload stages that VulnCheck characterized as reading like an agent working the problem. On November 7 between 00:02 and 00:38 UTC the canaries in Great Britain recorded Langflow CVE-2025-3248 stages covering an environment and .env file and langflow.db sweep, environment dump and SQLite discovery under /app, and cloud and Docker recon, log scraping, and credential decryption. On November 2 canaries in Sweden and Brazil logged PHP upload progress session priming probes under CVE-2026-109618 and CVE-2026-109619. VulnCheck stated that each PHP probe tripped two signatures at once and that 10 of the 11 Langflow stages were sent twice, usually less than a second apart. The Langflow activity on November 7 UTC is the evening of November 6 in United States time zones, one day after Microsoft published, indicating the operator was still active with the same infrastructure. VulnCheck noted it cannot prove from network traffic alone that an AI agent ran the session, though it aligns with Microsoft's description.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public Facing Application | T1190 | Exploitation of Langflow CVE-2025-3248 for credential access |
| Unsecured Credentials: Credentials In Files | T1552.001 | Sweep of .env files and langflow.db for credentials |

## IOCs

### Domains

_IP shared with the Microsoft agentic AI secret hunting report. No domains, hashes, or packages published._

### Full URL Paths

_IP shared with the Microsoft agentic AI secret hunting report. No domains, hashes, or packages published._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Langflow
```

## Detection Recommendations

Block and alert on 199.19.77.84 at egress and ingress. Patch Langflow for CVE-2025-3248 and rotate any credentials present in .env files or langflow.db on exposed instances. Hunt for rapid repeated requests of less than one second spacing to Langflow and PHP endpoints, which VulnCheck observed as a signature of automated exploitation. Monitor for cloud and Docker recon, log scraping, and credential decryption behavior following any Langflow access.

## References

- [VulnCheck] Same Attacker, Different Door: Our Canaries Caught Microsoft's Agentic AI Secret Hunter Exploiting Langflow (2026-11-08) — https://www.vulncheck.com/blog/microsoft-secret-hunter
- [Microsoft] Threat actors use agentic AI tooling to find and abuse exposed secrets (2026-11-05) — https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/
