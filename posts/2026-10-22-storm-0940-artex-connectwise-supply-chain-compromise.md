# Microsoft Attributes ConnectWise Supply Chain Compromise to Storm-0940 ARTEX Agentic AI Campaign

**Date:** 2026-10-22
**Tags:** nation-state, apt, supply-chain, llmjacking

## Executive Summary

Microsoft Security blog reports that China aligned actor Storm-0940 used the agentic AI penetration testing framework ARTEX to automate attacks against hundreds of organizations from September 2026, and assesses the actor was responsible for the ConnectWise multi-tenant application supply chain compromise. In multiple environments, time from initial targeting to privileged cloud access was under three hours, with follow-on Microsoft Graph activity including reconnaissance and application credential changes. Defenders should hunt for anomalous application authentication and Graph privilege changes in Microsoft 365 tenants with third party app integrations.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Storm-0940 ARTEX driven global campaign |
| Attribution | Storm-0940 (China state aligned) (confidence: high) |
| Target | Hundreds of organizations globally across multiple industries, plus Microsoft 365 customer tenants and downstream ConnectWise customers |
| Vector | Agentic AI automated password spray and exploitation, followed by supply chain compromise of a multi-tenant application and abuse of pre-consented applications |
| Status | active |
| First Observed | 2026-09 |

## Detailed Findings

According to the Microsoft Security blog, Storm-0940 is a China state aligned actor that as early as September 2026 used the agentic AI penetration testing framework ARTEX to automate attacks against hundreds of organizations globally, with several intrusions yielding privileged access to cloud infrastructure in under three hours from initial targeting. Microsoft assesses that Storm-0940 was responsible for the recently disclosed ConnectWise supply chain compromise of a multi-tenant application. Microsoft reported that ARTEX accelerated abuse of already consented applications to authenticate to Microsoft 365 environments without interactive user sign-in, and that follow-on activity through Microsoft Graph included reconnaissance, application credential changes, and attempts to modify privileges for expanded or persistent access. Microsoft stated this activity did not result from a compromise of or vulnerability in Microsoft corporate systems, products, or services. Microsoft also noted that public reports of the ConnectWise compromise surfaced on 2026-10-15 referencing indicators in the 144.172.64.x network range tied to an earlier password spray campaign, and a vendor advisory on 2026-10-16 shared an IP matching 144.172.64[.]99.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | Microsoft assesses Storm-0940 was responsible for compromise of a multi-tenant application used by downstream customers |
| Valid Accounts: Cloud Accounts | T1078.004 | Actor authenticated to Microsoft 365 customer environments through existing granted applications without interactive sign-in |

## IOCs

### Domains

_IP published by Microsoft and a vendor advisory as matching the earlier password spray network range 144.172.64.x._

### Full URL Paths

_IP published by Microsoft and a vendor advisory as matching the earlier password spray network range 144.172.64.x._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Microsoft 365
Microsoft Graph
ConnectWise multi-tenant application
```

## Detection Recommendations

Hunt Microsoft 365 audit and Graph logs for application based authentication from unfamiliar IPs, especially without interactive sign-in, and for service principal credential additions, new app roles, or consent grants followed by mail, file, or directory enumeration. Baseline the frequency of application credential changes and alert on bursts consistent with machine speed automation under three hours from first external touch. Prioritize review of tenants integrated with third party multi-tenant backup and remote management platforms, and correlate network telemetry against the 144.172.64.x range while treating the IP as a starting point rather than a complete indicator set.

## References

- [Microsoft Security Blog] AI-driven, large-scale nation-state campaign using ARTEX enables supply chain compromise (2026-10-21) — https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/
