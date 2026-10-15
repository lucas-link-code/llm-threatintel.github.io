# JADEPUFFER Plants Ransom Notes in Unauthenticated Chroma Databases for Retrieval Extortion

**Date:** 2026-10-15
**Tags:** malware, llmjacking

## Executive Summary

UpGuard Research documented the first AI retrieval stack extortion, where attackers exploited unauthenticated Chroma databases to inject ransom notes displayed to users when the RAG databases were queried. On October 5 the team found 6 IP addresses hosting Chroma databases without authentication and bearing evidence of JADEPUFFER ransom activity. The intrusion ran in two phases, reconnaissance in early June and ransoming in the middle of July.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | JADEPUFFER Chroma retrieval extortion |
| Attribution | JADEPUFFER (tracked by Microsoft as Storm-3168) (confidence: medium) |
| Target | Internet exposed Chroma vector databases and retrieval augmented generation deployments |
| Vector | Unauthenticated access to exposed Chroma databases used to write ransom content into the retrieval store |
| Status | active |
| First Observed | 2026-06 |

## Detailed Findings

According to [upguard.com](https://www.upguard.com/breaches/poisoned-vector-jadepuffer-using-unauthenticated-chroma-databases-for-retrieval-extortion), UpGuard Research found 6 IP addresses hosting Chroma databases without authentication and bearing evidence of ransom activity from an actor using the JADEPUFFER name. Examining the data showed the attack had been conducted in two phases, reconnaissance in early June and ransoming in the middle of July. The reports state that when the RAG databases were queried the injected content displayed ransom notes to users, which UpGuard describes as the first documented AI retrieval stack extortion and the first case of any threat actor exploiting unauthenticated Chroma databases. UpGuard noted that Sysdig first reported the actor in July after detecting exploitation of vulnerable Langflow instances via CVE-2025-3248, and that Microsoft tracked the actor as Storm-3168 and on September 25 disclosed an Azure focused resource destruction activity using compromised service principals and cloud credential collection. According to [upguard.com](https://www.upguard.com/breaches/poisoned-vector-jadepuffer-using-unauthenticated-chroma-databases-for-retrieval-extortion), the Chroma abuse is a novel observation of the actor's TTPs and validates concerns about poorly secured AI technologies exposed to the internet.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | JADEPUFFER reached the victim retrieval stack through internet exposed and unauthenticated Chroma databases and previously through Langflow CVE-2025-3248. |

## IOCs

### Domains

_No IOCs published. UpGuard withheld the 6 IP addresses and did not publish domains, hashes or package identifiers._

### Full URL Paths

_No IOCs published. UpGuard withheld the 6 IP addresses and did not publish domains, hashes or package identifiers._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Chroma vector databases
Langflow
```

## Detection Recommendations

Require authentication and network isolation on all Chroma and other vector database endpoints, and never expose retrieval stores to the internet. Monitor retrieval stores for unexpected write activity and for injected ransom text in indexed documents. Track CVE-2025-3248 exposure on Langflow deployments and audit cloud service principals for unusual credential collection and destructive actions.

## References

- [UpGuard] Poisoned Vector: JADEPUFFER and Using Unauthenticated Chroma Databases for Retrieval Extortion (2026-10-14) — https://www.upguard.com/breaches/poisoned-vector-jadepuffer-using-unauthenticated-chroma-databases-for-retrieval-extortion
