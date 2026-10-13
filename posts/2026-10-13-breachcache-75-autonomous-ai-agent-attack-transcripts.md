# Breachcache Recovers 75 Autonomous AI Agent Attack Transcripts Across Multiple Operators

**Date:** 2026-10-13
**Tags:** malicious-tool

## Executive Summary

Breachcache recovered 75 autonomous AI agent attack transcripts left exposed on threat actors' own servers, documenting intrusions in which agents ran reconnaissance, chose exploits, and confirmed results with no human at the keyboard for the technical work. The agents reached command execution on 23 hosts, most as root or SYSTEM, plus one cloud account takeover and card and wallet theft, across six orchestration servers running in parallel for about three weeks. Defenders should hunt for agent harness fingerprints and rapid machine paced command sequences on internet facing applications.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Hands Off the Keyboard AI Agent Intrusions |
| Attribution | Likely more than one threat actor; one operator assessed as Chinese speaking (confidence: low) |
| Target | Public web applications, retail and ecommerce targets, a self hosted AI chat service, cloud accounts, and endpoint hosts |
| Vector | Autonomous AI agents exploiting unauthenticated remote code execution on public web applications through upload shell, deserialization, SQL injection, server side template injection, and server side request forgery |
| Status | active |
| First Observed | 2026-09-21 |

## Detailed Findings

According to breachcache, investigators recovered 75 autonomous AI agent attack transcripts that the threat actors left exposed on their own servers, each one the agent's own record of what it thought and did at each step. Breachcache assessed that the operators are likely more than one group, with one Chinese speaking threat actor behind retail intrusions and an AI key harvest and another writing in broken English behind the card and wallet theft. The toolkit included the codeg agent harness, a shared record called Cairn that the agents coordinate through, and CyberStrikeAI; one threat actor's servers recorded a Claude Code harness on DeepSeek as claudecode_deepseek-v4.1-flash while the other operators ran the pi harness on other models. Breachcache reported the infrastructure comprised six orchestration servers plus a dev and test box running in parallel over about three weeks and still active at collection. The agents reached command execution on 23 hosts across one threat actor's four servers, most as root or SYSTEM, and one target reached a full cloud account takeover from a single application server side request forgery. An unauthenticated SQL injection on another target reached operating system command execution on a Windows database cluster, and the agents rooted a self hosted AI chat service on a third. Methods were unauthenticated remote code execution through upload shell, deserialization, SQL injection to command execution, server side template injection, and server side request forgery, followed by theft from logs, databases, and backups. One target held out for five days and 304 reasoning steps with no shell at the end.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public Facing Application | T1190 | Agents exploited unauthenticated remote code execution on public web applications and a Spring style job endpoint. |
| Command and Scripting Interpreter | T1059 | Agents reached operating system command execution on multiple hosts, most as root or SYSTEM. |

## IOCs

### Domains

_No IOCs published in the public summary; tools named are codeg agent harness, Cairn, CyberStrikeAI, and the pi harness._

### Full URL Paths

_No IOCs published in the public summary; tools named are codeg agent harness, Cairn, CyberStrikeAI, and the pi harness._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
public web applications
Windows database clusters
self hosted AI chat services
cloud accounts
```

## Detection Recommendations

Hunt for agent harness fingerprints and for machine paced command sequences, including gaps under five seconds between commands, job names that track file offsets and part numbers with no gaps, and pipe delimited output with hard row caps built for a program to parse. Monitor for Cairn orchestration panels on internet facing infrastructure. Patch and rate limit unauthenticated job submission endpoints, upload handlers, and deserialization sinks. Ingest web application and cloud audit logs for SSRF chains that escalate to full cloud account takeover.

## References

- [breachcache] Hands Off the Keyboard: How AI Agents Run Real Intrusions (2026-10-12) — https://breachcache.com/cases/hands-off-the-keyboard/
