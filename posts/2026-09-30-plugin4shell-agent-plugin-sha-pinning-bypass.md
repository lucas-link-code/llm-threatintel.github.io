# Plugin4Shell SHA Pinning Bypass Gives Zero Click RCE Across Four Major AI Coding Agents

**Date:** 2026-09-30
**Tags:** supply-chain, malicious-tool

## Executive Summary

Air Security disclosed Plugin4Shell, a zero click remote code execution flaw in the plugin install path of Claude Code, OpenAI Codex, GitHub Copilot, and Gemini CLI. A trusted plugin is silently swapped for malicious code while the marketplace SHA pin still appears honored, and background auto update pushes it to already installed agents without user interaction. Anthropic and OpenAI patched after disclosure, Microsoft has shipped no fix, and Google will not patch the deprecated Gemini CLI, so enterprises should inventory installed plugins and update agents immediately.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Plugin4Shell |
| Attribution | Unknown (confidence: none) |
| Target | Organizations and developers using Claude Code, OpenAI Codex, GitHub Copilot, or Gemini CLI with marketplace installed plugins or skills |
| Vector | Malicious or hijacked marketplace plugin that abuses git ref resolution at install and background auto update time to substitute attacker code while the pinned SHA appears honored |
| Status | active |
| First Observed | 2026-05 |

## Detailed Findings

According to Air Security, Plugin4Shell is a plugin SHA pinning bypass that affects all four major AI coding agents. The agent checks out the commit the marketplace pinned but never verifies the working tree actually landed on that commit, so an attacker who controls the plugin repository can make the checkout resolve to malicious content while the pin still looks honored. Air Security reported the flaw was found in May 2026 with a working proof of concept against all four agents and disclosed to all four vendors in June 2026. Anthropic confirmed a fix in Claude Code 2.1.179 on 2026-06-17 and Codex 0.146.0 was verified fixed on 2026-08-12. Microsoft has not shipped a fix for GitHub Copilot, and Google confirmed on 2026-08-04 that no patch will ship because the Gemini CLI is deprecated, so every existing install remains vulnerable. Air Security described two exploitation methods: publishing a benign plugin that later turns malicious, and hijacking a legitimate author's repository so the malicious version reaches every agent that already has the plugin installed. The exploit abuses git behavior where a 40 hex branch name is treated as a valid ref that takes precedence over the commit object of the same name, and a second variant resolves git checkout FETCH_HEAD to a default branch named FETCH_HEAD. Air Security noted this only works on hosts that allow hash shaped branch names, including Bitbucket and self hosted git servers, which Anthropic documentation lists as valid marketplace backends. GitHub rejects 40 hex branch names. Air Security also said enterprises using Air Marketplace and Air Filter were not affected.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Attacker subverts the marketplace plugin distribution path so a trusted plugin resolves to malicious code while the pinned SHA appears honored |
| Compromise Software Dependencies and Development Tools | T1195.002 | Malicious plugin content installs and runs inside the developer's AI coding agent with the employee's full workstation permissions |

## IOCs

### Domains

_Air Security published no atomic IOCs. Mitigation is agent side patching and marketplace host restrictions, not indicator blocking._

### Full URL Paths

_Air Security published no atomic IOCs. Mitigation is agent side patching and marketplace host restrictions, not indicator blocking._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude Code before 2.1.179
OpenAI Codex before 0.146.0
GitHub Copilot
Gemini CLI
Bitbucket hosted plugin marketplaces
Self hosted git plugin marketplaces
```

## Detection Recommendations

Update Claude Code to 2.1.179 or later and OpenAI Codex to 0.146.0 or later. Treat GitHub Copilot and Gemini CLI installations that load marketplace plugins as unpatchable and migrate Gemini CLI users to an agent without marketplace plugin SHA pinning. Where marketplace backends are self managed, restrict plugin source hosts to those that reject 40 hex branch names, and audit repositories for default branches whose names resemble commit SHAs or the literal FETCH_HEAD. Verify that installed plugin content matches the intended commit with an independent checkout rather than trusting the agent's success report. Because the pin is resolved inside the agent, marketplace side controls cannot enforce it.

## References

- [Air Security] Plugin4Shell - Zero Click RCE Vulnerability found in top 4 most popular coding agents (2026-09-17) — https://www.air.security/blog-posts/plugin4shell
