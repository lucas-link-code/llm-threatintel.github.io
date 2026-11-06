# Microsoft Reports Agentic AI Framework Scanning GitHub for Exposed Secrets and Abusing Azure Key Vault

**Date:** 2026-11-06
**Tags:** llmjacking, malicious-tool

## Executive Summary

Microsoft Threat Intelligence observed threat actors using an agentic AI offensive framework, ARTEX, to scan public GitHub repositories for exposed secrets and advance from discovery to Azure Key Vault data exfiltration in about five minutes. The same campaign used valid leaked or stolen application credentials for service principal sign ins across dozens of Microsoft Entra ID tenants beginning October 28, 2026, and abused compromised Azure AI services. Defenders should rotate exposed application credentials, audit service principal sign ins from the listed IP addresses, and monitor Azure Key Vault and Storage Account access.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX agentic AI exposed secret and credential abuse campaign |
| Attribution | Unnamed threat actors using the ARTEX agentic AI offensive framework, tracked by Microsoft Threat Intelligence (confidence: medium) |
| Target | Organizations with exposed secrets in public GitHub repositories and their connected Microsoft Entra ID tenants, Azure, and Microsoft 365 resources |
| Vector | Agentic AI scanning of public GitHub repositories for exposed secrets, followed by abuse of valid leaked or stolen application credentials for service principal sign ins |
| Status | active |
| First Observed | 2026-10-28 |

## Detailed Findings

According to [microsoft.com](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/), Microsoft Threat Intelligence observed threat actors using an agentic AI offensive framework, ARTEX, to search public GitHub repositories for exposed secrets including credentials, application credentials, and AI inference related API keys across multiple applications and cloud services. Microsoft reported that in at least one case an AI agent advanced from scanning GitHub for secrets to exfiltrating data from Azure Key Vault in just five minutes. According to [microsoft.com](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/), as early as October 28, 2026, Microsoft began observing successful service principal sign ins from IP address 199.19.77[.]84 involving multiple application IDs, including cases where a multitenant application credential was compromised at the source and used to access multiple downstream tenants. The threat actor used the compromised credentials for cloud resource discovery and for credential and data exfiltration from Azure Key Vaults and Storage Accounts, and for abuse of Azure AI services. Microsoft also reported reconnaissance from 157.22.126[.]128 targeting AI workloads deployed on Azure AI services, and malicious operations from 65.87.223[.]26 that included embedded shell commands in a user agent and attempts to obtain App Service authentication tokens; the same IPs were reported by Todyl in a similar campaign. The compromised applications accessed SharePoint and OneDrive in targeted tenants, including file downloads and mailbox item access, and the actor enumerated subscriptions, resource groups, permissions, AI model deployments, and service configurations in Azure.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | Microsoft reported the framework scanning public GitHub repositories for exposed credentials, application credentials, and AI inference API keys. |
| Valid Accounts | T1078 | The actor used valid leaked or stolen application credentials for service principal sign ins across multiple Entra ID tenants. |

## IOCs

### Domains

_IPs published by Microsoft Threat Intelligence in the ARTEX agentic AI exposed secret report. The address 199.19.77[.]18 is noted as a Tor exit node that may be associated with unrelated activity._

### Full URL Paths

_IPs published by Microsoft Threat Intelligence in the ARTEX agentic AI exposed secret report. The address 199.19.77[.]18 is noted as a Tor exit node that may be associated with unrelated activity._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Microsoft Entra ID
Azure Key Vault
Azure Storage Accounts
Azure AI services
Microsoft 365
SharePoint
OneDrive
Azure Kubernetes Service
Azure App Service
```

## Detection Recommendations

Audit Microsoft Entra ID service principal sign in logs for the listed IP addresses and for anomalous multitenant application access, and rotate any application credentials or secrets that were ever committed to public repositories or vendor owned multitenant applications. Enable Defender for Cloud AI threat protection to detect validation and abuse of stolen Azure AI resources, monitor Azure Key Vault and Storage Account read operations that return credentials and connection strings, and alert on App Service authentication token requests. Review Microsoft Graph API search activity for content enumeration across SharePoint and OneDrive.

## References

- [Microsoft Security Blog] Threat actors use agentic AI tooling to find and abuse exposed secrets (2026-11-05) — https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/
