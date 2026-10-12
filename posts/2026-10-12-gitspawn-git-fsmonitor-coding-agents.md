# GitSpawn: Git fsmonitor Setting Turns Seven AI Coding Agents Into Command Runners

**Date:** 2026-10-12
**Tags:** supply-chain

## Executive Summary

Manifold Security's GitSpawn disclosure documents eight flaws across seven command line AI coding agents, four still unpatched, where a repository's own .git/config core.fsmonitor setting names a command that Git runs during a routine status check triggered by the agent. goose, Cursor, and Codex are fixed; Claude Code has one path fixed in 2.1.196 and a second path via claude ultrareview unpatched; Hermes Agent and Qwen Code remain unpatched. Defenders should treat repository Git config as untrusted and scan for core.fsmonitor before opening repos in a coding agent.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GitSpawn |
| Attribution | Security research by Manifold Security, coordinated in part with OpenAI, Anthropic, and Alibaba (confidence: medium) |
| Target | Developers using command line AI coding agents on untrusted repositories |
| Vector | Malicious core.fsmonitor entry in a repository's .git/config that names a command Git executes when the coding agent triggers a status check |
| Status | active |
| First Observed | 2026-06-26 |

## Detailed Findings

Manifold Security's GitSpawn disclosure, reported by [axeploit.com](https://axeploit.com/blog/gitspawn-the-git-performance-flag-that-turns-coding-agents-into-command), describes eight flaws across seven command line AI coding agents, with four paths still unpatched at publication. The exploit is a Git performance setting. One line in a repository's own .git/config names a command, Git runs that command during a routine status check, and the AI coding agent is what triggers the status check. The disclosure states that goose was tracked as CVE-2026-72718 with a CVSS 4.0 base score of 7.0 and was fixed, credited to Francisco Rosales. Claude Code had one path fixed in 2.1.196 on June 29, and a second path reached through claude ultrareview remained unpatched when confirmed live on 2.1.252 on September 1 against then-current 2.1.258. Cursor was fixed at startup Git calls. Codex was fixed and covered by OpenAI's same-day CVEs. Hermes Agent remained unpatched, with Manifold reporting six contact attempts across five channels and VulnCheck assigning CVE-2026-71963. Qwen Code remained unpatched, with version 0.22.3 still affected when retested. The disclosure states that OpenAI published three CVEs of its own the same day covering the identical flaw class in Codex, with CVE-2026-19592 the one identifier named so far.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Event Triggered Execution | T1546 | A Git config key causes command execution when the coding agent triggers a Git status operation. |

## IOCs

### Domains

_No network IOCs published. Vulnerable and unpatched products are listed in affected_platforms. Tracked as CVE-2026-72718, CVE-2026-71963, and CVE-2026-19592._

### Full URL Paths

_No network IOCs published. Vulnerable and unpatched products are listed in affected_platforms. Tracked as CVE-2026-72718, CVE-2026-71963, and CVE-2026-19592._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
goose
Claude Code
Cursor
Codex
Hermes Agent
Qwen Code
```

## Detection Recommendations

Scan repository .git/config for core.fsmonitor and any other Git setting that names an external command before opening the repo in an AI coding agent. Disable or sandbox Git fsmonitor behavior in agent workspaces. Update Claude Code, goose, Cursor, and Codex to patched versions, and avoid running claude ultrareview on untrusted repositories until the second path is closed. Treat repository level Git configuration as untrusted input and watch agent process trees for Git invoking unexpected child commands during status checks.

## References

- [Axeploit] GitSpawn: The Git Performance Flag That Turns Coding Agents Into Command Runners (2026-10-11) — https://axeploit.com/blog/gitspawn-the-git-performance-flag-that-turns-coding-agents-into-command
