# Plugin4Shell SHA Pinning Bypass Leaves GitHub Copilot and Gemini CLI Unpatched

**Date:** 2026-10-03
**Tags:** supply-chain, malicious-tool

## Executive Summary

A malicious branch named after a pinned commit SHA lets plugin repository owners run code that differs from the reviewed commit in four major AI coding agents. According to threatfrontier.com, Anthropic patched Claude Code in 2.1.179 and OpenAI patched Codex in 0.146.0, while Microsoft has shipped no GitHub Copilot fix and Google says it will not patch the retiring Gemini CLI. Defenders who rely on SHA pinning for agent plugins should treat that pin as unenforced on Copilot and Gemini CLI.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Plugin4Shell |
| Attribution | Air Security research lab (disclosure) (confidence: high) |
| Target | Users of AI coding agents that install marketplace plugins pinned to a commit SHA |
| Vector | Attacker branches a plugin repository under the exact name of a pinned commit SHA and points it at malicious code |
| Status | active |
| First Observed | 2026-09-17 |

## Detailed Findings

According to threatfrontier.com, Air Security's research lab showed on 2026-09-17 that four widely used AI coding agents did not enforce commit SHA pinning. A plugin repository owner could make Claude Code, OpenAI Codex, GitHub Copilot and Gemini CLI run different code while the pin still appeared honored; the researchers call the issue Plugin4Shell. threatfrontier.com reported the flaw is in how Git resolves the argument: when a branch exists with the same name as a requested 40 character commit hash, Git resolves the name to the branch rather than the commit, so an attacker who controls the plugin repository creates a branch named after the pinned SHA and makes it the default branch. threatfrontier.com stated Anthropic shipped a fix in Claude Code 2.1.179 and OpenAI shipped a fix in Codex 0.146.0, while Microsoft has not shipped a GitHub Copilot patch and Google will not patch the retiring Gemini CLI. According to threatfrontier.com, OpenAI's fix in Codex pull request #34644, merged 2026-07-22, resolves HEAD after checkout and rejects a source when the commit does not match; this shipped in Codex 0.146.0 released 2026-07-29 and Air Security verified it on 2026-08-12. No CVE has been assigned.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious code enters the developer environment through a tampered marketplace plugin source |
| Trusted Developer Utilities Proxy Execution | T1218 | The AI coding agent itself performs the clone and checkout that materializes the attacker code |

## IOCs

### Domains

_No attacker IOCs published. Affected products are legitimate developer tools tracked as affected platforms, not malicious packages._

### Full URL Paths

_No attacker IOCs published. Affected products are legitimate developer tools tracked as affected platforms, not malicious packages._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude Code 2.1.179 (patched)
OpenAI Codex 0.146.0 (patched)
GitHub Copilot (no patch)
Gemini CLI (will not be fixed)
```

## Detection Recommendations

On Copilot and Gemini CLI, do not rely on SHA pinning to guarantee plugin integrity; instead verify the checked out HEAD matches the pinned commit out of band, or vendor and review plugin source before use. For all agents, flag plugin repositories whose default branch name equals a 40 character hex string or a pinned commit SHA. After any agent plugin install, capture the resolved commit and compare it to the intended pin. Prioritize upgrades to Claude Code 2.1.179 and Codex 0.146.0 where pinning is enforced.

## References

- [threatfrontier.com] Plugin4Shell: Pinned SHAs Fail in AI Coding Agents (2026-10-02) — https://threatfrontier.com/articles/plugin4shell-pinned-sha-bypass-claude-code-codex-copilot-gemini-cli
