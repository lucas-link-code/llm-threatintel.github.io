# Unit 42 reports Cairn autonomous AI framework used by China nexus actors against semiconductor, defense, civil society targets

**Date:** 2026-11-13
**Tags:** nation-state, malicious-tool

## Executive Summary

Unit 42 reported that Chinese speaking attackers used the open source Cairn autonomous AI penetration testing framework to conduct 25 operations against at least 19 organizations from August to September 2026, achieving access or data retrieval at 10 of them. The attackers paired Cairn with Chinese AI models Zhipu GLM and DeepSeek, and Unit 42 assesses with moderate confidence that this is China nexus intelligence collection tracked as CL-STA-1238. Defenders in semiconductor, defense policy, and civil society sectors should monitor for autonomous tool activity, credential theft, admin account creation, and bulk data access.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | CL-STA-1238 Cairn autonomous AI campaign |
| Attribution | China nexus, tracked as CL-STA-1238 by Unit 42 (confidence: medium) |
| Target | Advanced semiconductor manufacturing, U.S. defense policy, civil society organizations |
| Vector | Autonomous AI penetration testing framework Cairn paired with Chinese AI models Zhipu GLM and DeepSeek; attackers supplied a target and a goal and Cairn planned and executed operations |
| Status | active |
| First Observed | 2026-08 |

## Detailed Findings

According to [unit42.paloaltonetworks.com](https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/), from August to September 2026 Chinese speaking attackers used an open source AI penetration testing framework called Cairn to autonomously conduct 25 operations against at least 19 organizations. The attackers weaponized Cairn by pairing it with Chinese AI models Zhipu GLM and DeepSeek. The attackers supplied a target and a goal, then Cairn planned, executed, and recorded results on its own. These attacks achieved unauthorized access or data retrieval at 10 of the targeted organizations. Unit 42 reported access to dozens of valid credentials, mass exposure of personal data exceeding one million records at one organization, retrieval of military and government identities, creation of persistent administrator accounts in a production system, and modification of a live industry standards ballot document. Unit 42 assesses with moderate confidence that this activity represents China nexus intelligence collection tracked as CL-STA-1238. The article details targeting of advanced semiconductor manufacturing, U.S. defense policy, and civil society.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Valid Accounts | T1078 | Attackers accessed dozens of valid credentials through autonomous operations |
| Account Manipulation | T1098 | Attackers created persistent administrator accounts in a production system |

## IOCs

### Domains

_No IOCs published in source summary._

### Full URL Paths

_No IOCs published in source summary._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cairn autonomous penetration testing framework
Zhipu GLM
DeepSeek models
```

## Detection Recommendations

Monitor for unauthorized use of autonomous penetration testing frameworks and anomalous API calls to Zhipu GLM and DeepSeek. Alert on creation of persistent administrator accounts, bulk credential access, large scale personal data access, military or government identity retrieval, and unexpected edits to industry standards documents.

## References

- [Unit 42] Attackers Use Autonomous AI to Target Semiconductor, Defense and Civil Society Sectors (2026-11-13) — https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/
