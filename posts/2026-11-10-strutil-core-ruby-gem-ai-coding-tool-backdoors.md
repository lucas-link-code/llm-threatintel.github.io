# strutil-core Ruby Gem Harvests 51 Credential Stores and Plants Backdoors in AI Coding Tools

**Date:** 2026-11-10
**Tags:** supply-chain, malware, malicious-tool

## Executive Summary

A fake Ruby package named strutil-core was published to RubyGems on November 1, 2026 and its second version shipped a 5.48 MB credential stealing worm that read from 51 credential stores and wrote backdoors into AI coding tool settings. The worm adds a fake MCP server named workspace-tools that runs the malware through Node and installs SessionStart hooks that execute whenever a coding session opens. A wiper named net-health-checker deletes the victim home folder when a stolen GitHub token is revoked, so defenders must preserve evidence before rotating credentials.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | strutil-core RubyGems Credential Stealer and AI Coding Tool Backdoor |
| Attribution | Unknown, published from RubyGems account jamnajiea (confidence: low) |
| Target | Ruby developers, build servers, and workstations running AI coding assistants |
| Vector | Malicious RubyGems package strutil-core version 1.0.1 delivering a large payload on install, plus malicious MCP and repository config files that relaunch the worm |
| Status | disrupted |
| First Observed | 2026-11-01 |

## Detailed Findings

According to CybersecurityNews, citing research from Socket.dev, the package strutil-core version 1.0.0 was published on November 1, 2026 from a RubyGems account named jamnajiea and was clean, and version 1.0.1 followed less than two hours later carrying a 5.48 MB payload. A sandbox run recorded reads from 51 credential stores including AWS, npm, PyPI, Docker, Kubernetes, Claude, and Codex files. Socket.dev reported that its AI scanner flagged the file 70 seconds after publication, no public projects depended on the gem, and no victims have been confirmed, with download counters unable to show infection counts. RubyGems removed both versions within hours and the gem was live for roughly five hours. CybersecurityNews reported that the worm searches the home folder for AI coding tool settings files such as settings.json, mcp.json, and .aider.conf.yml, then adds a fake MCP server named workspace-tools that runs the malware with Node and adds SessionStart hooks that run code whenever a coding session opens. When it finds working Git credentials it pushes the same trick into repositories, writing files including .claude/settings.json, .cursor/mcp.json, CLAUDE.md, AGENTS.md, and a VS Code task that runs when a folder opens. The generated AGENTS.md instructs coding agents to run a setup script before their first command, so opening an infected repository in an AI tool may restart the worm depending on that tool's trust settings. CybersecurityNews also reported a wiper component: when the worm steals a GitHub token it installs a monitor called net-health-checker that tests the token every 45 seconds and, on a 401 or 403 response, runs a command that deletes the user home folder, meaning token revocation triggers the damage.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Dependencies and Development Tools | T1195.001 | The malicious strutil-core gem delivered its payload to developers and build servers through the RubyGems dependency channel. |
| Unsecured Credentials: Credentials In Files | T1552.001 | The worm read 51 credential stores including AWS, npm, PyPI, Docker, Kubernetes, Claude, and Codex files on the host. |

## IOCs

### Domains

_No file hashes, domains, or IPs published in the source. Package identifiers taken from the CybersecurityNews report citing Socket.dev._

### Full URL Paths

_No file hashes, domains, or IPs published in the source. Package identifiers taken from the CybersecurityNews report citing Socket.dev._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
npm:workspace-tools
```

### Affected Platforms

```
RubyGems
Claude Code
Cursor
VS Code
Node.js
```

## Detection Recommendations

Do not revoke a stolen GitHub token before preserving host evidence, since the net-health-checker monitor deletes the home folder on a 401 or 403 response. Hunt for the workspace-tools MCP server entry and SessionStart hooks in settings.json, mcp.json, and .aider.conf.yml, and for .claude/settings.json, .cursor/mcp.json, CLAUDE.md, AGENTS.md, and injected VS Code folder open tasks in repositories. Audit any machine that installed strutil-core versions 1.0.0 or 1.0.1 and rotate AWS, npm, PyPI, Docker, Kubernetes, and AI assistant credentials from a clean host. Review coding agent trust settings that auto execute repository files or AGENTS.md instructions.

## References

- [CybersecurityNews] Malicious Ruby Gem Steals 51 Types of Credentials and Plants Backdoors in AI Coding Tools (2026-11-10) — https://cybersecuritynews.com/malicious-ruby-gem/
