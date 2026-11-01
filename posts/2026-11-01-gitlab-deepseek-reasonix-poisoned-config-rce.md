# GitLab Threat Research Group Discloses DeepSeek-Reasonix Command Execution via Poisoned Config

**Date:** 2026-11-01
**Tags:** prompt-injection, malicious-tool

## Executive Summary

GitLab Threat Research Group disclosed a command execution vulnerability in the DeepSeek-Reasonix AI coding agent where a poisoned configuration could let attacker supplied code run when a developer views a file diff. The advisory is tracked as GHSA-grg2-7gc6-36m6 and GitLab directs users to update DeepSeek-Reasonix to a fixed release. Defenders running AI coding agents should prioritize the patch and treat agent configuration files as untrusted input.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | DeepSeek-Reasonix poisoned config command execution |
| Attribution | Unattributed (confidence: none) |
| Target | Developers using the DeepSeek-Reasonix AI coding agent |
| Vector | Poisoned agent configuration that triggers code execution on diff view |
| Status | active |
| First Observed | 2026-10-18 |

## Detailed Findings

According to GitLab Threat Research Group, a command execution vulnerability in DeepSeek-Reasonix could allow attacker supplied code to execute when a developer views a file diff. The flaw is tracked as GHSA-grg2-7gc6-36m6 by GitLab in its advisory. GitLab recommends updating DeepSeek-Reasonix to a fixed version as remediation. The disclosure is a first party GitLab research report covering an AI coding agent, distinct from prior LiteLLM and Claude Code extension advisories on the Already Covered list.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter | T1059 | Attacker supplied code executes within the coding agent process when a diff is rendered. |
| User Execution | T1204 | Execution is triggered by developer action of opening or viewing a file diff. |

## IOCs

### Domains

_No IOCs published. Advisory identifier GHSA-grg2-7gc6-36m6; no CVE number was provided in the search result snippet._

### Full URL Paths

_No IOCs published. Advisory identifier GHSA-grg2-7gc6-36m6; no CVE number was provided in the search result snippet._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
DeepSeek-Reasonix AI coding agent
```

## Detection Recommendations

Inventory DeepSeek-Reasonix installations and apply the GitLab advised update. Treat agent configuration files as untrusted input, restrict write access to agent config directories, and alert on unexpected child processes spawned by the coding agent during diff rendering. Review repository diffs for injected configuration before opening them in the agent.

## References

- [GitLab] DeepSeek-Reasonix: How a poisoned config can hijack an AI coding agent (2026-10-30) — https://about.gitlab.com/blog/deepseek-reasonix-vulnerability-discovered/
