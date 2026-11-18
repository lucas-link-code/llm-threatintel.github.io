# Google Threat Intelligence Group Observes PentAGI and CAIRN Multi Agent Frameworks Deployed in the Wild and CyberStrikeAI in Experimentation

**Date:** 2026-11-18
**Tags:** malicious-tool, nation-state

## Executive Summary

Google Threat Intelligence Group reported that agentic threat activity crossed a significant threshold, with the open source multi agent frameworks CAIRN and PentAGI independently observed deployed in real intrusions and CyberStrikeAI and HexStrike AI seen in threat actor experimentation. These frameworks share autonomous target discovery and exploitation capabilities that lower the skill barrier for offensive operations. Defenders should monitor environments for multi agent framework traffic and unexpected agent tool invocation.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Agentic Multi Agent Framework Abuse |
| Attribution | Unattributed (confidence: low) |
| Target | Aerospace sector in the US and other sectors |
| Vector | Open source multi agent pentesting frameworks (CAIRN, PentAGI, CyberStrikeAI, HexStrike AI) |
| Status | active |
| First Observed | 2026-11-16 |

## Detailed Findings

According to the Google Cloud Blog, Google Threat Intelligence Group (GTIG) reported on 2026-11-16 that agentic threat activity crossed a significant threshold. GTIG stated it independently observed the open source tools CAIRN and PentAGI deployed in the wild and saw threat actor experimentation with CyberStrikeAI and HexStrike AI, alongside evidence of custom built harnesses. GTIG described these frameworks as sharing core capabilities for discovering and navigating targets autonomously. The blog stated CAIRN is an open source multi agent pentesting framework that implements an OODA observe, orient, decide, act loop in which specialized agents collaborate through a shared blackboard to move from an initial parameter such as a target IP address toward an operational objective. GTIG reported observing CAIRN used in intrusion activity against targets including the aerospace sector in the US. GTIG placed this activity against the broader finding that LLM frameworks are being used to automate offensive workflows with minimal human involvement.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Active Scanning | T1595 | GTIG described CAIRN agents autonomously navigating from an initial parameter such as a target IP address toward an operational objective. |

## IOCs

### Domains

_GTIG did not publish IOCs in this report. The named items are open source frameworks, not malware samples._

### Full URL Paths

_GTIG did not publish IOCs in this report. The named items are open source frameworks, not malware samples._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
CAIRN
PentAGI
CyberStrikeAI
HexStrike AI
```

## Detection Recommendations

Monitor egress for agentic framework traffic to LLM inference endpoints and for unexpected agent tool invocation on developer and server hosts. Watch for outbound connections to common LLM provider APIs originating from servers that have no legitimate automation role. Baseline CAIRN, PentAGI, CyberStrikeAI, and HexStrike AI process and command patterns in EDR telemetry and alert on OODA style autonomous scanning behavior, including rapid sequential discovery and exploitation attempts from a single host cluster.

## References

- [Google Cloud Blog] GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold (2026-11-16) — https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold
