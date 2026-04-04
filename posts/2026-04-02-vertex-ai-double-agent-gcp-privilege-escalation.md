# Unit 42 Discloses 'Double Agent' Vulnerability in GCP Vertex AI: Overprivileged Service Agents Enable Cloud Data Exfiltration and Google Internal Code Access

**Date:** 2026-04-02
**Tags:** agentic-ai, cloud-security, gcp, vertex-ai, credential-theft, privilege-escalation

## Executive Summary

Palo Alto Networks Unit 42 disclosed on March 31, 2026 that the Per-Project, Per-Product Service Agent (P4SA) assigned by default to Vertex AI Agent Engine deployments carries excessive OAuth permissions, allowing a compromised or malicious AI agent to extract GCP service credentials and pivot from the agent's execution context into the customer's broader cloud environment — granting unrestricted read access to Cloud Storage buckets and restricted Google-owned Artifact Registry repositories containing internal Vertex AI source code. Google has updated documentation and recommends Bring Your Own Service Account (BYOSA) to mitigate. Organizations using Vertex AI Agent Engine should immediately audit all deployed agents and enforce least-privilege service accounts.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Vertex AI Double Agent — GCP Agentic Privilege Escalation |
| Attribution | Unknown (vulnerability research finding; no active threat actor exploitation confirmed by Unit 42 at time of disclosure) (confidence: none) |
| Target | Organizations deploying AI agents on Google Cloud Platform Vertex AI Agent Engine |
| Vector | Exploitation of default excessive OAuth 2.0 permission scopes granted to P4SA service agent; requires ability to deploy or compromise an existing Vertex AI agent |
| Status | active |
| First Observed | 2026-03-31 |

## Detailed Findings

According to Unit 42 researcher Ofir Shaty in a report shared with The Hacker News and published on March 31, 2026, Palo Alto Networks researchers discovered a significant security blind spot in Google Cloud's Vertex AI Agent Engine. The vulnerability stems from the default permission model assigned to the Per-Project, Per-Product Service Agent (P4SA) — a Google-managed service account automatically associated with AI agents deployed on the platform.

Unit 42 demonstrated the attack by building a test AI agent using Google Cloud's Agent Development Kit (ADK). They found that the P4SA was granted excessive OAuth 2.0 permissions by default. Using a custom malicious tool embedded in the agent, they were able to extract the service agent credentials from the GCP metadata service and then use those credentials to pivot from the AI agent's isolated execution context into the consumer (customer) project. This granted unrestricted read access to all Google Cloud Storage buckets within that project.

Further exploitation was possible: the stolen P4SA credentials also granted access to restricted, Google-owned Artifact Registry repositories that were revealed during the Agent Engine deployment process. These repositories host container images and packages that form the core of the Vertex AI Reasoning Engine. Unit 42 noted that gaining access to this proprietary code 'not only exposes Google's intellectual property, but also provides an attacker with a blueprint to find further vulnerabilities' and could allow mapping of Google's internal software supply chain.

SDxCentral and SecurityWeek confirmed this is not the first agentic flaw found in Vertex AI; Unit 42 previously uncovered separate issues where custom jobs could escalate privileges and where malicious models could exfiltrate other fine-tuned models. Unit 42's Shaty noted that the root cause is not solely a Google failure, but overly permissive OAuth 2.0 scope definitions that define broader API-level access than IAM roles alone would grant.

TechRadar additionally noted the P4SA's default OAuth scopes could potentially extend access beyond GCP and into an organization's Google Workspace (Gmail, Calendar, Drive) if the agent is not properly scoped. Following responsible disclosure, Google updated official documentation and strongly recommended BYOSA architecture for all Vertex AI deployments. Google confirmed internal controls prevent tampering with production container images.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Application Access Token | T1528 | The attack extracts GCP P4SA service agent OAuth credentials from the GCP metadata service endpoint while operating within the Vertex AI agent execution context. |
| Privilege Escalation via Cloud Service | T1078.004 | Stolen P4SA credentials are used to pivot from the isolated AI agent execution context into the broader customer GCP project, achieving unrestricted Cloud Storage access. |
| Data from Cloud Storage | T1530 | With pivoted P4SA credentials, attackers gain unrestricted read access to all Google Cloud Storage buckets in the consumer project and potentially Google's internal Artifact Registry. |
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Access to Google-owned restricted Artifact Registry repositories hosting internal Vertex AI Reasoning Engine components could enable identification of vulnerabilities in Google's internal supply chain. |

## IOCs

### Domains

_No IOCs published by source — this is a vulnerability disclosure. The affected service account pattern is service-<PROJECT-ID>@gcp-sa-aiplatform-re.iam.gserviceaccount.com. Vulnerable configuration: Vertex AI Agent Engine deployments using the default P4SA rather than a custom BYOSA service account. No CVE assigned as of collection date._

### Full URL Paths

_No IOCs published by source — this is a vulnerability disclosure. The affected service account pattern is service-<PROJECT-ID>@gcp-sa-aiplatform-re.iam.gserviceaccount.com. Vulnerable configuration: Vertex AI Agent Engine deployments using the default P4SA rather than a custom BYOSA service account. No CVE assigned as of collection date._

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

1. GCP IAM Audit: Identify all Vertex AI Agent Engine deployments using the default P4SA (service-<PROJECT-ID>@gcp-sa-aiplatform-re.iam.gserviceaccount.com) rather than a custom service account; prioritize migrating to BYOSA immediately. 2. Cloud Audit Logs: Monitor GCP Cloud Audit Logs for unusual access to Cloud Storage buckets originating from Vertex AI service account identities (principalEmail matching gcp-sa-aiplatform-re pattern); alert on access to Artifact Registry repositories by AI agent service identities. 3. OAuth Scope Review: Audit the OAuth 2.0 scopes granted to P4SA identities across all Vertex AI deployments; flag any scopes extending access to Google Workspace APIs (Gmail, Calendar, Drive). 4. Metadata Service: Monitor for anomalous HTTP GET requests to the GCP instance metadata service (169.254.169.254/computeMetadata/v1/instance/service-accounts/) from within Vertex AI agent execution environments. 5. CIEM: Use Cloud Infrastructure Entitlement Management tooling to flag AI agent service accounts with permissions exceeding what is needed for the agent's declared function.

## References

- [Unit 42 / Palo Alto Networks] Double Agents: Exposing Security Blind Spots in GCP Vertex AI (2026-03-31) — https://origin-unit42.paloaltonetworks.com/double-agents-vertex-ai/
- [The Hacker News] Vertex AI Vulnerability Exposes Google Cloud Data and Private Artifacts (2026-03-31) — https://thehackernews.com/2026/03/vertex-ai-vulnerability-exposes-google.html
- [SecurityWeek] Google Addresses Vertex Security Issues After Researchers Weaponize AI Agents (2026-04-01) — https://www.securityweek.com/google-addresses-vertex-security-issues-after-researchers-weaponize-ai-agent/
- [SDxCentral] Google Vertex agentic flaw latest chink in hyperscale AI armor (2026-04-01) — https://www.sdxcentral.com/news/google-vertex-agentic-flaw-latest-chink-in-hyperscale-ai-armor/
- [TechRadar] 'What if the AI agent you just deployed was secretly working against you?': Vertex AI 'double agent' flaw exposes customer data and Google's internal code (2026-04-01) — https://www.techradar.com/pro/security/what-if-the-ai-agent-you-just-deployed-was-secretly-working-against-you-vertex-ai-double-agent-flaw-exposes-customer-data-and-googles-internal-code
