# CrowdStrike Documents Four Exposed Agentic AI Attack Frameworks Including Argentine Healthcare Pentest Harness

**Date:** 2026-10-22
**Tags:** malicious-tool, llmjacking, prompt-injection

## Executive Summary

CrowdStrike Counter Adversary Operations reported four previously unreported threat actors that left their offensive agentic AI frameworks exposed in open directories, giving defenders visibility into agent driven operations. One actor ran an autonomous penetration testing harness with a Supervisor and Executor Claude Code architecture against Argentine healthcare organizations, delivering full attack workflows that reached remote code execution and explicit exfiltration instructions. Organizations in healthcare and other targeted sectors should assume agentic tooling lowers the skill floor and accelerate the kill chain, often within an hour.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Exposed agentic AI offensive frameworks (four actors) |
| Attribution | Multiple unattributed threat actors (confidence: low) |
| Target | Argentine healthcare organizations and other sectors targeted by the exposed frameworks |
| Vector | Open directories exposing offensive agent frameworks; autonomous reconnaissance and exploitation tooling delivered through AI coding agents |
| Status | active |
| First Observed | 2026-10 |

## Detailed Findings

According to CrowdStrike Counter Adversary Operations, four previously unreported threat actors each exposed offensive agent frameworks through open directories, revealing how adversaries are operationalizing AI agents. One actor ran an autonomous penetration testing harness against Argentine healthcare organizations using a dual agent architecture in which a Supervisor Claude Code agent selects the next task from a predefined state machine and an Executor agent performs it, derived from the open source PentestGPT project but rebuilt with additional MCP servers, Python exploitation scripts, and skills. CrowdStrike reported that this actor primarily accessed Claude models through a China based AI proxy service and built two harnesses granting Claude Code varying autonomy, one deterministic reconnaissance pipeline and one more flexible setup delegating work to specialist agents in parallel. A separate configuration uses a single /pentest-setup slash command to drive a seven step workflow that enumerates the target, grants near total autonomy over exploitation method selection, defines a post remote code execution workflow, and includes explicit exfiltration instructions. CrowdStrike assesses with moderate confidence that agentic AI commoditizes baseline offensive cyber operations because these actors delegate operational decision making across the kill chain, enabling objectives to be met autonomously, often within an hour.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter | T1059 | Attacker built Python based exploitation scripts and slash command workflows executed through AI coding agents |

## IOCs

### Domains

_CrowdStrike published no machine actionable domains, hashes, or IPs with this report._

### Full URL Paths

_CrowdStrike published no machine actionable domains, hashes, or IPs with this report._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude Code
MCP servers
PentestGPT-derived harnesses
```

## Detection Recommendations

Monitor for the /pentest-setup slash command and other agent workflow markers in AI coding assistant logs, and for MCP server registrations and Python exploitation scripts appearing in developer workspaces. Detect outbound connections to China based AI proxy or transfer station services from developer and server segments, and profile AI agent sessions that perform scanning followed immediately by exploitation and data staging within a single session. Treat autonomous, machine paced reconnaissance against internet exposed healthcare endpoints as a likely precursor and throttle or challenge high rate enumeration from single sources.

## References

- [CrowdStrike] CrowdStrike Uncovers New Agentic AI Campaigns (2026-10-20) — https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/
