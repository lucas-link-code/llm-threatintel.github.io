# Fireworks AI Expands October 2026 Breach Scope to Billing Data, Model Weights, and Datasets in LLMJacking Case

**Date:** 2026-11-10
**Tags:** llmjacking, supply-chain, malware

## Executive Summary

Fireworks AI published a November 9 update widening its October 2026 security incident to include account and billing information, and for a limited set of accounts, secrets, datasets, and incomplete model weights. Fireworks attributes the activity to a financially motivated cybercriminal group selling unauthorized LLM access through illicit routing gateways, a pattern Google Threat Intelligence Group and Mandiant describe as LLMJacking. Customers with affected accounts should treat stored secrets, datasets, and partial model artifacts as exposed and rotate credentials now.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Fireworks AI October 2026 LLMJacking Incident |
| Attribution | Financially motivated cybercriminal group tied to LLMJacking, per Fireworks AI (confidence: medium) |
| Target | Fireworks AI customer accounts, billing records, and internal R&D machines |
| Vector | Exploitation of an internal application reachable after a third party cloud provider breach; secrets and workloads accessed on development machines |
| Status | active |
| First Observed | 2026-10-09 |

## Detailed Findings

According to Fireworks AI, the update expands on the bulletin first published October 9, 2026, which initially found only Fireworks stored secrets such as those used in evaluation jobs had been accessed. The revision states that Fireworks has since discovered impacts to account and billing information, and for a limited set of accounts, exposure of secrets, datasets, and incomplete models. Fireworks notified law enforcement and engaged Palo Alto Networks Unit 42 for forensic analysis. Fireworks reported that a third party cloud provider hosting its R&D machines suffered its own security incident on October 23, and that on October 24 an unauthorized party used that foothold to reach Fireworks development machines and run an unauthorized workload causing additional customer data impact. Fireworks says it detected the activity the same day and closed known critical vulnerabilities, and as of October 25 has not detected further successful unauthorized access on the customer facing platform. Data categories exposed through the affected internal application include resource metadata, billing and shipping addresses, invoice and payment history, account balance, and credit usage, while Fireworks states payment card numbers are not stored and were not impacted. Fireworks says it has not detected impact to Inference, Training SDK, or Nexus, which it describes as zero data retention by default, and cautions the investigation is ongoing.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials | T1552 | Stored evaluation job secrets, datasets, and account credentials were accessed from the affected internal application and development machines. |
| Resource Hijacking | T1496 | Fireworks attributes the activity to a financially motivated group selling unauthorized LLM token access through illicit routing gateways, the LLMJacking model. |

## IOCs

### Domains

_No IOCs published by Fireworks AI. This is a first party incident bulletin._

### Full URL Paths

_No IOCs published by Fireworks AI. This is a first party incident bulletin._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Fireworks AI internal application
Fireworks AI R&D development machines
```

## Detection Recommendations

Rotate all Fireworks stored evaluation secrets, API keys, and service credentials, and audit billing and payment history for unauthorized invoices, balance changes, or credit usage anomalies. Review model weights and datasets tied to affected accounts for tampering or unexpected downloads, and compare account resource metadata for creations you did not authorize. Monitor for outbound traffic to illicit LLM routing gateways and watch for API consumption spikes consistent with token resale. Restrict partner and third party systems that can reach internal development machines and enforce network segmentation between cloud hosting partners and build infrastructure.

## References

- [Fireworks AI] Update on October 2026 security incident (2026-11-09) — https://fireworks.ai/security/bulletins/october-2026-security-incident-update
