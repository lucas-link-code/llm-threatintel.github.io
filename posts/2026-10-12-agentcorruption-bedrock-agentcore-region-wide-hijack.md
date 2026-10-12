# AgentCorruption: One Prompt Led to Region Wide Hijacking of AWS Bedrock AgentCore Resources

**Date:** 2026-10-12
**Tags:** prompt-injection

## Executive Summary

Zenity Labs published AgentCorruption on October 8, 2026, showing that a single malicious prompt to a public facing Amazon Bedrock AgentCore agent could expose other AgentCore resources in the same AWS account and region. The chain obtained cloud execution credentials, moved between agents, read private conversations, altered agent memory, and retrieved credentials for external services. AWS addressed the issues by changing metadata service behavior and restricting AgentCore default execution role permissions, so defenders should enforce least privilege on agent roles and monitor metadata service access.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AgentCorruption |
| Attribution | Unattributed security research by Zenity Labs (confidence: none) |
| Target | Organizations running public facing Amazon Bedrock AgentCore agents |
| Vector | Single malicious prompt sent to an externally accessible AI agent |
| Status | removed |
| First Observed | 2026-10-08 |

## Detailed Findings

According to [penligent.ai](https://www.penligent.ai/hackinglabs/agentcorruption/), Zenity Labs published the AgentCorruption research on October 8, 2026. The central finding is that, under the conditions examined, compromising one externally accessible AgentCore agent could expose other AgentCore resources inside the same AWS account and region. The demonstrated chain started with a malicious prompt and progressed to obtaining cloud execution credentials, moving between AI agents, accessing private conversations, interfering with agent memory, and retrieving credentials associated with external services. Zenity disclosed the issues to AWS before publication. Zenity states that the reported issues have been addressed, including changes to metadata service behavior and substantial restrictions to AgentCore default execution role permissions. AWS emphasizes that access to an agent's own execution role credentials through the metadata service is expected behavior and that developers must configure those roles according to least privilege principles. The reported scope was the lateral access enabled by a specific combination of workload credential exposure and overly broad execution role permissions, not unrestricted control over every AWS account, every region, or every customer running AgentCore.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Cloud Instance Metadata API | T1552.005 | The chain reached an agent's execution role credentials through the AgentCore metadata service. |
| Valid Accounts: Cloud Accounts | T1078.004 | Overly broad execution role permissions let the attacker use cloud credentials to reach other AgentCore resources in the same account and region. |

## IOCs

### Domains

_No IOCs published. The report is an attack chain and cloud configuration disclosure._

### Full URL Paths

_No IOCs published. The report is an attack chain and cloud configuration disclosure._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
AWS Bedrock AgentCore
```

## Detection Recommendations

Review Bedrock AgentCore execution role permissions and reduce them to least privilege. Alert on unexpected metadata service calls from agent workloads. Segment agents by AWS account and region to limit lateral reach. Enable and review logging for agent memory and conversation access. Monitor for a single agent principal being used to reach credentials or resources belonging to other agents.

## References

- [Penligent] AgentCorruption: How a Single Prompt Exposed AWS Bedrock AgentCore to Region-Wide Agent Hijacking (2026-10-08) — https://www.penligent.ai/hackinglabs/agentcorruption/
