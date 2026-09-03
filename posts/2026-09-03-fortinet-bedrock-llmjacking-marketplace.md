# FortiGuard: Leaked AWS Administrator Key Used to Subscribe Bedrock Models and Jack Inference

**Date:** 2026-09-03
**Tags:** llmjacking

## Executive Summary

FortiGuard Labs published on 2026-09-03 that a leaked long-lived AWS IAM access key with AdministratorAccess was used to create a new IAM user, subscribe that identity to foundation models through AWS Marketplace, and invoke those models so the victim account paid for inference. FortiGuard described the chain as LLMjacking: theft of hosted model access rather than model weights. Enable CloudTrail and Bedrock invocation logging, retire long-lived admin keys, and alert on Marketplace agreement calls paired with new IAM users.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Amazon Bedrock LLMjacking via Marketplace subscription |
| Actor / Attribution | Unnamed operator. FortiGuard did not name a group. Confidence none |
| Target | AWS accounts with Bedrock or Marketplace foundation-model access |
| Vector | Leaked long-lived IAM access key with AdministratorAccess |
| Status | Investigated incident published 2026-09-03 |
| First Observed | FortiGuard published 2026-09-03; LLMjacking as a class dates to 2024 per FortiGuard |

## Detailed Findings

According to [FortiGuard Labs](https://www.fortinet.com/blog/threat-research/someone-else-is-using-your-ai), FortiCNAPP investigated a case in which a leaked long-lived IAM access key with AdministratorAccess was enough to cash out generative AI rather than stand up miners. FortiGuard stated that the operator created a new IAM user, subscribed to one or more foundation models through AWS Marketplace using CreateAgreementRequest and AcceptAgreementRequest on agreement-marketplace.amazonaws.com, then invoked the subscribed models so inference charges hit the victim account.

FortiGuard defined LLMjacking as theft and abuse of access to hosted AI models, not theft of weights or training data. FortiGuard stated the objective is to make another organization's cloud account pay for high-capability inference, then use or resell that access. FortiGuard cited prior LLMjacking research putting victim exposure above 46,000 dollars per day for Claude 2.x-class inference and past 100,000 dollars per day on Claude 3 Opus, and cited Operation Bizarre Bazaar as cataloging more than 35,000 attack sessions and a marketplace reselling access to 30-plus LLM providers.

FortiGuard reported that this class of attack typically also generates Bedrock service-specific credentials for the new identity through AWS's long-term API key mechanism, distinct from a standard IAM access key. FortiGuard published no attacker IPs, domains, or hashes.

FortiGuard recommended CloudTrail on every account, Bedrock invocation logging which is off by default, treating long-lived broad-scope IAM keys as tier-0, and not treating first-time Bedrock use as malicious by itself unless paired with a new identity, unfamiliar IP, enumeration, or access-denied noise. [IT Security News](https://www.itsecuritynews.info/llmjacking-attack-uses-leaked-aws-iam-key-to-steal-paid-ai-model-access/) summarized the same FortiGuard incident on 2026-09-03.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Valid Accounts | T1078 | Operator used a leaked AdministratorAccess IAM key as a working cloud identity. |
| Create Account: Cloud Account | T1136.003 | Operator created a new IAM user under the compromised account. |
| Resource Hijacking | T1496 | Subscribed Marketplace foundation models were invoked so the victim paid for inference. |
| Impair Defenses: Disable or Modify Cloud Logs | T1562.008 | FortiGuard ships a detection for DeleteModelInvocationLoggingConfiguration as a related evasion step. |

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

Alert on CreateUser, CreateAccessKey, CreateServiceSpecificCredential, AttachUserPolicy with AdministratorAccess, and Marketplace CreateAgreementRequest or AcceptAgreementRequest against agreement-marketplace.amazonaws.com in the same session as a leaked or unused access key. Turn on Bedrock model invocation logging to an immutable destination and alert on DeleteModelInvocationLoggingConfiguration. Prefer short-lived assumed roles over never-expiring admin keys. Correlate first-time InvokeModel from a new IAM user with unfamiliar source IPs rather than alerting on Bedrock use alone.

## References

- [FortiGuard Labs] Someone Else Is Using Your AI (2026-09-03) — https://www.fortinet.com/blog/threat-research/someone-else-is-using-your-ai
- [IT Security News] LLMjacking Attack Uses Leaked AWS IAM Key to Steal Paid AI Model Access (2026-09-03) — https://www.itsecuritynews.info/llmjacking-attack-uses-leaked-aws-iam-key-to-steal-paid-ai-model-access/
