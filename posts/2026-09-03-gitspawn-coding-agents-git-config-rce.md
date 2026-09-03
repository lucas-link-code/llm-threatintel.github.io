# GitSpawn: Untrusted Repos Run Host Code in Claude Code, Codex, Cursor, Goose, Hermes, Qwen Code, and Grok Build

**Date:** 2026-09-03
**Tags:** supply-chain

## Executive Summary

Manifold Security published GitSpawn on 2026-09-01: AI coding agents run git in the background to gather context, often before the workspace-trust prompt, without stripping the repository's own git config, so settings such as core.fsmonitor execute attacker commands as the developer outside the sandbox. Eight findings across seven agents were reported; Claude Code's core.fsmonitor path, Goose, Codex, and Cursor were patched, while Qwen Code, Grok Build, Claude Code ultrareview, and Hermes remained unpatched at publication. Inspect .git/config before opening a zip or shared folder in an agent, and do not treat git clone as the same risk.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GitSpawn git-config execution class |
| Actor / Attribution | Vulnerability research. No in-the-wild campaign named by Manifold. Confidence none |
| Target | Developers using Claude Code, Codex, Cursor, Goose, Hermes Agent, Qwen Code, Grok Build |
| Vector | Project directory delivered as files with .git intact, such as a zip, shared drive, or USB. Clone, fetch, and pull do not carry the malicious config |
| Status | Mixed. Four findings patched at publication; four reconfirmed unpatched on 2026-09-01 |
| First Observed | Private reports from June and July 2026; public write-up 2026-09-01 |

## Detailed Findings

According to [Manifold Security](https://www.manifold.security/blog/ai-coding-agents-git-hijack), CLI coding agents gather repository context with commands such as git status and git diff. Those commands refresh the index. Git reads core.fsmonitor from the repository's own .git/config and runs the named helper during that refresh. Manifold stated the agent spawns git as its own subprocess, so the helper runs on the host, with the user's privileges, outside the sandbox, with no approval prompt.

Manifold stated delivery is not a hostile git clone URL. Clone, fetch, and pull do not transfer this config. The repository must arrive as files with its .git directory already inside. Manifold used zip archives for every proof of concept and did not publish a ready-made hostile repository. Manifold also left unnamed the separate git config key used in the still-unpatched Claude Code ultrareview finding.

Manifold's status table at publication: Claude Code core.fsmonitor confirmed on 2.1.193 and fixed in 2.1.196; Goose 1.41.0 fixed in 1.44.0 as CVE-2026-72718; OpenAI Codex and Cursor patched after duplicate reports; Qwen Code accepted by Alibaba SRC and still unpatched on 0.22.3; Grok Build still unpatched on 1.0.13; Claude Code ultrareview still unpatched on 2.1.252; Hermes still unpatched on 0.21.0 with CVE-2026-71963 assigned by VulnCheck. [The Hacker News](https://thehackernews.com/2026/09/malicious-git-configs-can-make-claude.html) and [GBHackers](https://gbhackers.com/gitspawn-flaw-enables-arbitrary-code-execution/) reported the same class on 2026-09-02.

TrustFall already documented a related Claude Code git project-config path in 2025. GitSpawn is a current, cross-product class with several live unpatched sinks.

Manifold published no hashes or domains.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter | T1059 | Agent-spawned git runs a repository-named helper as the developer, outside the sandbox. |
| Event Triggered Execution | T1546 | Git config execution sinks such as core.fsmonitor fire during index refresh on git status or git diff. |
| User Execution: Malicious File | T1204.002 | Victim opens a zip or shared project folder that already contains a hostile .git/config. |
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | Untrusted project trees are treated as trusted developer context by coding agents. |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Before opening a received zip, shared drive, or client project in an agent, inspect .git/config for any setting that names a program, including core.fsmonitor, core.pager, and aliases. On EDR, alert when claude, goose, qwen, grok, hermes, cursor, or codex spawn git status or git diff that immediately launches a non-git child as the same user. Agent vendors should sanitize context-gathering git, for example git -c core.fsmonitor=false status. Patch Claude Code to 2.1.196 or later for the named fsmonitor path, Goose to 1.44.0, and current Codex and Cursor builds. Treat Qwen Code 0.22.3, Grok Build 1.0.13, Claude Code 2.1.252 ultrareview, and Hermes 0.21.0 as exposed until vendors ship fixes.

## References

- [Manifold Security] GitSpawn: A Single Flaw Lets Untrusted Repos Run Code in Claude Code, Codex, Cursor, and Grok (2026-09-01) — https://www.manifold.security/blog/ai-coding-agents-git-hijack
- [The Hacker News] Malicious .git Configs Can Make Claude, Codex, Cursor, and Other AI Agents Run Attacker Code (2026-09) — https://thehackernews.com/2026/09/malicious-git-configs-can-make-claude.html
- [GBHackers] GitSpawn Flaw Enables Arbitrary Code Execution in Claude Code, Codex, Cursor and Grok (2026-09) — https://gbhackers.com/gitspawn-flaw-enables-arbitrary-code-execution/
