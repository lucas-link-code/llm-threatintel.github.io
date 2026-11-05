# Attackers Steal AI Access Tokens from Developer Platforms Chainstack and WorkOS Using Artex Framework

**Date:** 2026-11-05
**Tags:** supply-chain, malicious-tool, llmjacking

## Executive Summary

SecurityWeek reported a wave of intrusions against at least a dozen AI developer platforms, with the most recent disclosures from Chainstack, WorkOS, Northflank, Trigger.dev, CommandCode and Chainstack, in which attackers hunted AI access tokens to monetize and used the open source Artex penetration testing framework for automation. Chainstack said an October 26 intrusion reached a customer database with names, member email addresses and password hashes, while WorkOS said a compromised internal sales application exposed contact details and customer communication summaries on October 30. Defenders running AI gateways, inference accounts or developer consoles should rotate provider keys and platform secrets and assume that one compromised intermediary can expose keys for many downstream inference accounts.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Artex AI developer platform token theft campaign |
| Attribution | Storm-0940 (per multiple victim companies and prior ARTEX reporting) (confidence: medium) |
| Target | AI developer platforms, hosting platforms, evaluation services, developer consoles and their downstream customers |
| Vector | Compromised credentials, third party dependencies and vulnerability exploitation, followed by AI framework driven automation |
| Status | active |
| First Observed | 2026-10-26 |

## Detailed Findings

According to SecurityWeek, at least a dozen AI developer platforms have been hit over the past month, with the most recent incidents involving CommandCode, Northflank, Trigger.dev, Chainstack and WorkOS. SecurityWeek reported that across all incidents the hackers appear to have hunted AI access tokens they could monetize, relying on AI agents to speed up and streamline the attacks, and that initial access varied from compromised credentials to third party dependencies and vulnerability exploitation. The outlets named as affected or probed include Andromeda, Brev (NVIDIA), CommandCode, Fireworks AI, Lightning AI, Northflank, OpenCode, Railway, Trigger.dev, Warp and Zeabur, mainly targeting stored customer secrets. Chainstack, a blockchain infrastructure and Web3 services provider, was hit on October 26, and SecurityWeek reported the attacker accessed a development environment and parts of production through a third party component and reached a database containing customer account information including organization names, account holder names, member email addresses and password hashes, with node credentials potentially exposed. WorkOS said that on October 30 hackers compromised an internal application used by its sales team and accessed names, email addresses, phone numbers, job titles, company affiliations, customer account histories, sales details, customer relationship information and customer communications. SecurityWeek reported that Chainstack and WorkOS disclosed attacks relying on the open source Artex framework for automation, and that multiple companies linked attacks attributed to the Chinese APT Storm-0940 to the use of Artex, including a recent campaign targeting ConnectWise customers. The Cloud Security Alliance told SecurityWeek that intruders reach AI provider credentials through the intermediary layer of hosting platforms, evaluation services and developer consoles, so a single intrusion can expose keys for many inference accounts at once. Note that the ConnectWise and broader ARTEX activity was previously reported; this item adds new victim disclosures and a new outlet source.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Initial access reached Chainstack through a third party component, matching supply chain compromise behavior reported by SecurityWeek. |
| Unsecured Credentials | T1552 | Attackers hunted stored AI access tokens, node credentials, password hashes and provider keys across hosting and developer platforms. |

## IOCs

### Domains

_No IOCs published by SecurityWeek; victims and platforms are the only named entities._

### Full URL Paths

_No IOCs published by SecurityWeek; victims and platforms are the only named entities._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Chainstack
WorkOS
Northflank
Trigger.dev
CommandCode
Fireworks AI
Lightning AI
Railway
Warp
Zeabur
Brev (NVIDIA)
Andromeda
OpenCode
```

## Detection Recommendations

Rotate all model provider API keys, database connection strings, node credentials, and workload identities held by AI gateways, hosting platforms, and developer consoles, and assume downstream inference accounts are exposed when an intermediary platform is breached. Hunt for use of the Artex framework artifacts and for AI agent automation in CI, build, and developer consoles. Monitor for credential access against browser, cloud, and AI application stores on developer and build hosts. Treat password hashes from affected account databases as compromised and force resets. Pivot on authentication from the intermediary platform layer into downstream customer inference accounts.

## References

- [SecurityWeek] AI-Linked Breaches Mount as WorkOS, Northflank, Trigger.dev Disclose Hacks (2026-11-04) — https://www.securityweek.com/ai-linked-breaches-mount-as-workos-northflank-trigger-dev-disclose-hacks/
