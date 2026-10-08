# ReliaQuest: LLM Agents Drove a One Endpoint Server Takeover in Under 24 Hours

**Date:** 2026-10-08
**Tags:** malicious-tool, prompt-injection

## Executive Summary

ReliaQuest investigated an incident in which LLM driven AI agents, with high confidence, carried out substantial portions of an attack that took full administrative control of a server in under 24 hours. The entry point was a single job submission feature reachable without a login, and no zero day or new malware was used. Defenders should require authentication on exposed AI job management endpoints, retain job history, and restrict JavaScript execution inside agent platforms.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Unnamed AI agent orchestration intrusion |
| Attribution | Unattributed; ReliaQuest assesses LLM driven agents performed the work (confidence: medium) |
| Target | A server exposing an AI agent orchestration platform job submission feature |
| Vector | Unauthenticated exposed job submission endpoint on an internet facing AI orchestration application |
| Status | disrupted |
| First Observed | 2026-10-07 |

## Detailed Findings

According to [reliaquest.com](https://reliaquest.com/blog/threat-spotlight-how-ai-agents-turned-one-exposed-endpoint-into-a-server-takeover/), ReliaQuest investigated an incident in which it assesses, with high confidence, that large language model driven agents carried out substantial portions of the attack, going beyond an attacker consulting an AI assistant. Commands ran, results were evaluated, failures were corrected, and approaches changed as the incident progressed. In under 24 hours the attacker ran hundreds of commands through one exposed application feature and took full administrative control of the compromised server, with no new malware and no zero day. ReliaQuest stated the attacker ran JavaScript inside the application, pulled results out through error messages, recovered database credentials, and escalated to full server control. The attacker infrastructure pointed to Cairn, a legitimate open source orchestration platform for coordinating AI agents on multi step tasks, running on the same IP address that launched the attack. ReliaQuest could not determine how many agents were involved, which model drove them, or how much a person approved individual actions, because the orchestrator can front any vendor model through a proxy. ReliaQuest recommended requiring authentication on exposed job management endpoints and retaining their job history, which outlasted every artifact the attacker deleted.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Unauthenticated job submission feature on an internet facing AI orchestration platform |
| Valid Accounts | T1078 | Recovered database credentials used to escalate to full server control |

## IOCs

### Domains

_No IOCs published. ReliaQuest referenced Cairn, a legitimate open source platform, as attacker infrastructure rather than a malicious domain._

### Full URL Paths

_No IOCs published. ReliaQuest referenced Cairn, a legitimate open source platform, as attacker infrastructure rather than a malicious domain._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cairn agent orchestration platform
AI agent job management endpoints
```

## Detection Recommendations

Require authentication on all exposed AI job management endpoints and log every job submission. Retain and monitor job history, since ReliaQuest found it outlasted deleted attacker artifacts. Alert on JavaScript execution inside agent platforms and on database credential use from application processes. Watch for repeated failed commands followed by corrected retries in job output, which is characteristic of agent driven execution.

## References

- [ReliaQuest] How AI Agents Turned One Exposed Endpoint into a Server Takeover | Threat Spotlight (2026-10-07) — https://reliaquest.com/blog/threat-spotlight-how-ai-agents-turned-one-exposed-endpoint-into-a-server-takeover/
