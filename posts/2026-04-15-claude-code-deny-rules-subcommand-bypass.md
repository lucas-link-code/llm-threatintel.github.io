# Claude Code Deny Rules Bypass via Subcommand Chaining: 50+ Command Pipeline Defeats Safety Controls

**Date:** 2026-04-15
**Tags:** malicious-tool, apt

## Executive Summary

Adversa AI red team found Claude Code's deny rules silently stop working after 50 subcommands. Attackers can craft AI-generated command chains that exceed the safety threshold, causing Claude Code to fall back to unsafe 'ask' mode, circumventing user-configured denial rules designed to prevent data exfiltration.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Claude Code Safety Control Bypass |
| Attribution | Research Finding / Potential Threat Actors (confidence: medium) |
| Target | Developers using Claude Code in production and development environments |
| Vector | Crafted CLAUDE.md files with 50+ subcommand pipelines triggering safety rule fallback |
| Status | active |
| First Observed | 2026-04-13 |

## Detailed Findings

Anthropic fixed a performance issue by capping analysis at 50 subcommands with a fall back to a generic 'ask' prompt, but Adversa discovered this process can be manipulated; this can be exploited via malicious CLAUDE.md files instructing the AI to generate 50+ subcommand pipelines that appear legitimate, bypassing deny rules. A vulnerability disclosed in April 2026 showed that Claude Code will ignore its deny rules if burdened with a sufficiently long chain of subcommands.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Privilege Escalation | T1548 | Bypassing deny rules via algorithmic limits in safety system |
| Exfiltration Over Command and Control Channel | T1071 | Using subcommand chains to exfiltrate data despite deny rules |
| Defense Evasion | T1562 | Circumventing safety controls through engineered input structure |

## IOCs

### Domains

_Vulnerability in Claude Code safety system; no malware or network IOCs_

### Full URL Paths

_Vulnerability in Claude Code safety system; no malware or network IOCs_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
Claude Code (affected versions)
```

## Detection Recommendations

Monitor Claude Code processes for command chains exceeding 45+ subcommands, audit CLAUDE.md configuration files for suspicious pipeline structures, enforce workspace isolation for Claude Code execution, implement honeypot deny rules that trigger alerting when bypassed, and maintain strict inventory of Claude Code deployments in production.

## References

- [Adversa AI / SecurityWeek] Critical Vulnerability in Claude Code Emerges Days After Source Leak (2026-04-11) — https://www.securityweek.com/critical-vulnerability-in-claude-code-emerges-days-after-source-leak/
- [Palo Alto Networks Unit 42] AI Coding Agents Are Insider Threats: Prompt Injection, MCP Exploits, and Supply Chain Attacks (2026-04-12) — https://botmonster.com/posts/ai-coding-agent-insider-threat-prompt-injection-mcp-exploits/
