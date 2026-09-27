# Plugin4Shell: Zero-Click RCE Bypass of SHA Pinning in AI Coding Agent Plugin Ecosystems

**Date:** 2026-09-27
**Tags:** supply-chain, malicious-tool

## Executive Summary

Plugin4Shell is a high-severity, zero-click remote code execution vulnerability affecting major AI coding agents, including Anthropic Claude Code, OpenAI Codex, GitHub Copilot, and Google Gemini CLI. The flaw allows a malicious plugin update to execute attacker-controlled code without requiring a user to click, approve, or reinstall anything. The bug, dubbed Plugin4Shell, breaks SHA pinning, the mechanism developers rely on to lock an installed plugin to a specific, reviewed version of its code.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Plugin4Shell |
| Attribution | AIR Security Research (confidence: high) |
| Target | AI coding agent users and enterprises deploying Claude Code, Codex, GitHub Copilot, Gemini CLI |
| Vector | Malicious Git branch name collision; plugin marketplace compromise; automatic plugin updates |
| Status | active |
| First Observed | 2026-05-27 |

## Detailed Findings

AIR found the bug in May 2026, with working proof-of-concept exploits against all four agents, and disclosed it to each vendor the following month. Researchers said an attacker can abuse a repository branch named FETCH_HEAD to redirect the checkout to malicious content rather than the fetched commit. The vulnerability becomes zero-click because of automatic plugin updates. The risk is especially significant for enterprises using AI coding agents with broad access to development and production environments. A successful exploit could give an attacker the same reach as the developer's account, potentially exposing proprietary code, API keys, CI/CD credentials, internal systems, and cloud environments. Anthropic fixed the issue in Claude Code version 2.1.179, while OpenAI patched Codex in version 0.146.0. Microsoft had not issued a fix for Copilot at the time of disclosure. Google said Gemini CLI is deprecated and will not receive a fix, advising users to migrate to Antigravity.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.003 | Plugin marketplace compromise enables silent code injection into trusted developer tools |
| Execution | T1204 | Automatic plugin updates execute attacker payload without user interaction |

## IOCs

### Domains

_No specific IOCs published; vulnerability is in plugin resolution logic affecting all marketplace-distributed plugins across platforms_

### Full URL Paths

_No specific IOCs published; vulnerability is in plugin resolution logic affecting all marketplace-distributed plugins across platforms_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Anthropic Claude Code
OpenAI Codex
GitHub Copilot
Google Gemini CLI
```

## Detection Recommendations

Monitor for plugin version mismatches between marketplace records and deployed agent systems. Implement runtime integrity checks comparing plugin SHA checksums against marketplace records before execution. Enforce strict plugin marketplace policies requiring signed manifests and re-consent flows when tool definitions change. Pin agents to specific plugin versions and require manual re-approval for any updates rather than automatic silent patching. Monitor for unexpected branch or tag creation matching commit SHA patterns in plugin repositories.

## References

- [AIR Security] Plugin4Shell - Zero Click RCE Vulnerability found in top 4 most popular coding agents (2026-09-17) — https://www.air.security/blog-posts/plugin4shell
- [Cybersecurity News] Plugin4Shell Zero-Click RCE Hits Claude Code, Codex, Copilot and Gemini CLI (2026-09-18) — https://cybersecuritynews.com/plugin4shell-zero-click-rce/
- [Help Net Security] Zero-click RCE vulnerability hit four major AI coding agents, two remain unpatched (2026-09-18) — https://www.helpnetsecurity.com/2026/09/18/plugin4shell-ai-coding-agents-vulnerability/
