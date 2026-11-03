# JFrog Analyzes testmetest npm Worm Hijacking 42 GitHub Repositories with AI Agent Execution Hooks

**Date:** 2026-11-03
**Tags:** supply-chain, malware

## Executive Summary

JFrog Security Research analyzed an npm worm, tracked as testmetest, that hijacked 42 GitHub repositories across 11 legitimate owners and planted a 12.9 to 13.7 MB payload at .github/init.js alongside agent configuration files for Claude Code, Gemini, Cursor, and VS Code. The payload harvested GitHub and npm credentials, propagated through available npm publishing permissions including GitHub OIDC token exchange, and installs a wiper that deletes the victim home directory when the stolen GitHub token is revoked, turning routine cleanup into data loss. Defenders should isolate affected hosts before revoking tokens and audit repositories for unauthorized .github/init.js and agent config changes.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | testmetest npm worm |
| Attribution | Unattributed, resembling Shai-Hulud variant lineage (confidence: low) |
| Target | GitHub repository owners and developers using agentic coding tools |
| Vector | Hijacked GitHub accounts and contributor access committing payload and agent config files |
| Status | active |
| First Observed | 2026-10-22 |

## Detailed Findings

According to a weekly AI security incident compilation at oscerd.github.io citing JFrog Security Research, attackers took over 42 GitHub repositories belonging to 11 real owners using hijacked accounts and contributor access rather than throwaway projects, so the repositories carried the trust of legitimate names. Into each repository they committed a payload file at .github/init.js deliberately sized between 12.9 and 13.7 MB, large enough that GitHub code search does not index it and the Contents API does not return it, which forced JFrog to pull it as a raw Git blob through the Trees API. The same writeup states the attackers added execution and configuration files for Claude Code, Gemini, Cursor, and VS Code arranged so that starting one of those agents in the project, or opening it as a VS Code workspace with the right settings, could launch .github/init.js without the developer typing a command; the source uses the hedge could because the trigger depends on each tool configuration. Once running, the payload harvested GitHub and npm credentials, modified repositories and CI configuration, propagated by using whatever npm publishing permissions it found, and used recovered code that performed GitHub OIDC token exchanges to obtain npm publish credentials automatically. According to the same source, it checked for CI runners, containers, debuggers and analysis tools and went dormant when it saw them, and installed a wiper that deletes the victim home directory the moment the stolen GitHub token is revoked. The source notes the npm lineage traces back to an earlier worm family, that SafeDep had described the package side as early as 22 October 2026, and that a resemblance to Shai-Hulud variants exists with attribution to the original operators unproven.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Hijacked repositories and agent config files delivered the worm through trusted project checkouts |
| Unsecured Credentials | T1552.001 | Payload harvested GitHub and npm credentials and exchanged GitHub OIDC tokens for npm publish rights |

## IOCs

### Domains

_No network IOCs published. Package name only; repository count and payload path are documented in detailed_findings._

### Full URL Paths

_No network IOCs published. Package name only; repository count and payload path are documented in detailed_findings._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
npm:testmetest
```

### Affected Platforms

```
GitHub
npm
VS Code
Cursor
Claude Code
Gemini
```

## Detection Recommendations

Hunt for unexpectedly large .github/init.js files and unauthorized changes to GitHub workflows, CI configuration, and agent config files for Claude Code, Gemini, Cursor, and VS Code. Do not revoke stolen GitHub tokens before isolating the host, because the payload wiper is designed to delete the home directory on revocation. Rotate GitHub and npm credentials, review npm publishing permissions and OIDC trust for unauthorized tokens, and treat any repository a developer opened in an agentic editor as a possible execution path.

## References

- [oscerd.github.io] AI security incidents of the week: 27 October to 2 November 2026 (2026-11-02) — https://oscerd.github.io/2026/11/02/ai-security-incidents-of-the-week-27-october-2-november-2026.html
