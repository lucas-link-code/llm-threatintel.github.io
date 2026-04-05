# Claude Code Source Leak Followed by Critical Post-Leak RCE: Sourcemap Exposure and Prompt Injection Vulnerability (CVE Pending)

**Date:** 2026-04-05
**Tags:** malicious-tool, supply-chain

## Executive Summary

On March 31, 2026, Anthropic mistakenly included a debugging JavaScript sourcemap for Claude Code v2.1.88 to npm. Within days of each other, Anthropic first leaked the source code to Claude Code, and then a critical vulnerability was found by Adversa AI. Within hours, researcher Chaofan Shou discovered the sourcemap and posted a link on X. A genuine and critical vulnerability has now been discovered in Claude Code proper by Adversa AI Red Team. Claude Code is a 519,000+ line TypeScript application that allows developers to interact with Claude directly from the command line.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Claude Code Sourcemap Disclosure + Adversa AI RCE Discovery |
| Attribution | Accidental (Anthropic sourcemap commit); Adversa AI Red Team (Vulnerability Research) (confidence: high) |
| Target | Claude Code CLI users and development environments |
| Vector | Sourcemap exposure on npm; prompt injection via project configuration files |
| Status | active |
| First Observed | 2026-03-31 |

## Detailed Findings

Anthropic mistakenly included a debugging JavaScript sourcemap for Claude Code v2.1.88 to npm. Within hours, researcher Chaofan Shou discovered the sourcemap and posted a link on X – kicking off a global rush to examine de-obfuscated Claude Code's code. The problem stems from Anthropic's desire for improved performance following the discovery of a performance issue: complex compound commands caused the UI to freeze. Anthropic fixed this by capping analysis at 50 subcommands, with a fall back to a generic 'ask' prompt for anything else. The flaw discovered by Adversa is that this process can be manipulated. Anthropic's assumption doesn't account for AI-generated commands from prompt injection — where a malicious CLAUDE.md file instructs the AI to generate a 50+ subcommand pipeline that looks like a legitimate build process. Check Point Research has discovered critical vulnerabilities in Anthropic's Claude Code that allow attackers to achieve remote code execution and steal API credentials through malicious project configurations. The vulnerabilities exploit various configuration mechanisms including Hooks, Model Context Protocol (MCP) servers, and environment variables -executing arbitrary shell commands and exfiltrating Anthropic API keys when users clone and open untrusted repositories.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploitation of Software Vulnerability | T1190 | RCE via malicious project configuration files and prompt injection |
| Credential Access | T1187 | Exfiltration of Anthropic API keys and GitHub tokens |
| Execution via MCP Hooks | T1203 | Arbitrary command execution through Hooks feature |

## IOCs

### Domains

_Sourcemap exposed on npm; check for 512K+ lines of TypeScript source in public repositories_

### Full URL Paths

_Sourcemap exposed on npm; check for 512K+ lines of TypeScript source in public repositories_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
claude-code@2.1.88
```

## Detection Recommendations

Monitor npm installs and package.json for claude-code@2.1.88; audit deployed instances for Hook configurations and .claude/settings.json files; scan for malicious CLAUDE.md build system metadata; implement signed releases and sourcemap integrity checks; revoke any exposed Anthropic API keys from Claude Code deployments; review git commit history for evidence of sourcemap extraction and rebuild attempts.

## References

- [SecurityWeek] Critical Vulnerability in Claude Code Emerges Days After Source Leak (2026-04-03) — https://www.securityweek.com/critical-vulnerability-in-claude-code-emerges-days-after-source-leak/
- [Check Point Research] Caught in the Hook: RCE and API Token Exfiltration Through Claude Code Project Files | CVE-2025-59536 | CVE-2026-21852 (2026-02-26) — https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/
- [The Register] Fake Claude Code source downloads actually delivered malware (2026-04-02) — https://www.theregister.com/2026/04/02/trojanized_claude_code_leak_github/
