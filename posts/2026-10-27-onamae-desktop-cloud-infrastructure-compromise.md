# Onamae Desktop Cloud Confirms Infrastructure Compromise and Malware Installation, Shuts Down Customer Environments

**Date:** 2026-10-27
**Tags:** supply-chain, malware

## Executive Summary

Japanese cloud hosting provider Onamae Desktop Cloud confirmed a cyberattack in which intruders compromised its infrastructure and installed malware on affected systems. The provider began shutting down customer environments on October 21 to contain the incident. Customers hosting workloads or storing credentials on Onamae Desktop Cloud should assume those environments and any secrets inside them are exposed and should rotate credentials and rebuild from trusted images rather than trust in place cleanup.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Onamae Desktop Cloud Infrastructure Compromise |
| Attribution | Unknown (confidence: none) |
| Target | Customers of the Onamae Desktop Cloud hosting service |
| Vector | Direct compromise of provider infrastructure followed by malware installation |
| Status | disrupted |
| First Observed | 2026-10-21 |

## Detailed Findings

According to Check Point Research's 26th October Threat Intelligence Report, Japanese cloud hosting provider Onamae Desktop Cloud confirmed a cyberattack in which intruders compromised its infrastructure and installed malware. Check Point Research reported that the provider began shutting down customer environments on October 21, 2026 to contain the intrusion. The report does not name the malware family, the initial access vector, or an attributed threat actor, and no indicators were published. Because Onamae operates a desktop cloud service, the shutdown and malware installation affect hosted customer machines and any credentials, sessions, or data resident on them. No independent vendor analysis of this incident appeared in the search window beyond the Check Point Research roundup entry.

## IOCs

### Domains

_No IOCs published. Check Point Research's roundup entry names no malware family, hashes, domains, or IP addresses._

### Full URL Paths

_No IOCs published. Check Point Research's roundup entry names no malware family, hashes, domains, or IP addresses._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Onamae Desktop Cloud hosted environments
```

## Detection Recommendations

Treat any workload, virtual desktop, or stored secret on Onamae Desktop Cloud as potentially compromised. Rotate all credentials, API keys, session tokens, and SSH keys that were ever accessible from those environments, and rebuild hosts from trusted images instead of attempting in place cleanup. Review authentication and cloud audit logs for activity originating from Onamae hosted IP ranges across the shutdown window and afterward. Monitor for follow on use of any credentials that were resident on the affected hosts, since a hosting provider compromise can lead to downstream account takeover. Because no indicators were published, detection must rely on behavioral review of logins and data access tied to the affected environments rather than static signatures.

## References

- [Check Point Research] 26th October – Threat Intelligence Report (2026-10-26) — https://research.checkpoint.com/2026/26th-october-threat-intelligence-report/
