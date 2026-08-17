# keyv/cacheable npm Worm Exploits AI Coding Assistant Persistence Hooks

**Date:** 2026-08-17
**Tags:** supply-chain, malicious-tool

## Executive Summary

A malicious commit compromised the popular keyv npm package on August 4, 2026, leading to a worm that reached over 400 distinct npm packages via GitHub maintainer account compromise. The worm uniquely targets AI coding assistant persistence by planting hooks in .claude/settings.json and .vscode/tasks.json, triggering execution when developers or agents open a repository checkout.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | keyv/cacheable npm Worm |
| Attribution | Unknown (GitHub maintainer account compromise) (confidence: low) |
| Target | npm developers using keyv, cacheable, ecto, and dependent packages; AI coding assistant users (Claude Code, VS Code agents) |
| Vector | Malicious npm package dependencies; lifecycle scripts and IDE hooks |
| Status | active |
| First Observed | 2026-08-04 |

## Detailed Findings

On August 4, 2026, a malicious commit (174f6a5) was identified in the GitHub repository of the popular keyv npm package; similar commits were pushed to jaredwray/cacheable and jaredwray/ecto. Starting at 09:00 UTC, the attacker first used a compromised identity to introduce IDE persistence payloads to the keyv repository, then shortly after published a new version containing the payload.

This incident opens a new attack chapter at 'repo-open time,' with the malicious commit planting .claude/settings.json session hooks and .vscode/tasks.json folder-open tasks, so the trigger is a developer or coding agent opening the checkout. The 11 KB setup.mjs file is lightly obfuscated and configured to start a second stage under the Bun runtime.

Analysis identified the user-agent Bun/1.3.13 performing malicious calls, and the malware uses an Ethereum smart contract to dynamically retrieve C2 domains. Early enumeration found 11 malicious releases across the keyv family, the cacheable family, and ecto.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromised GitHub maintainer credentials used to publish trojanized packages |
| Persistence: Boot or Logon Init Scripts | T1547.001 | IDE hooks (.claude/settings.json, .vscode/tasks.json) execute on repository open |
| Execution: Command and Scripting Interpreter | T1059.001 | Malicious lifecycle scripts and Bun-based payload execution |
| Command and Control: Dynamic Resolution | T1568 | Ethereum smart contract used to retrieve C2 domains dynamically |

## IOCs

### Domains

_Over 400 distinct npm packages compromised per Wiz tracking; specific version and hash IOCs published by Wiz and Datadog Security Labs_

### Full URL Paths

_Over 400 distinct npm packages compromised per Wiz tracking; specific version and hash IOCs published by Wiz and Datadog Security Labs_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'keyv', 'registry': 'npm', 'version': '', 'note': 'Malicious versions published via compromised maintainer; Wiz identified 11 malicious releases across keyv, cacheable, ecto families'}
{'name': 'cacheable', 'registry': 'npm', 'version': '', 'note': 'Part of keyv worm propagation'}
{'name': 'ecto', 'registry': 'npm', 'version': '', 'note': 'Part of keyv worm propagation'}
```

### Affected Platforms

```
npm registry
Claude Code (Anthropic)
VS Code
```

## Detection Recommendations

Monitor npm audit logs and lockfile changes for unexpected updates to keyv, cacheable, ecto, and their dependents. Inspect .claude/settings.json and .vscode/tasks.json in all cloned repositories for malicious hook definitions. Block or sandbox Bun runtime execution during npm install unless explicitly required. Implement npm lifecycle script restrictions (--ignore-scripts). Track GitHub Personal Access Token (PAT) usage for keyv and related projects; rotate all maintainer credentials. Review GitHub Actions workflows for unauthorized commits or force-push activity on July 31–August 4, 2026. Alert on postinstall and preinstall script execution in package manager logs. Implement registry-level signature verification for npm package integrity.

## References

- [Wiz.io] keyv and cacheable npm Package Hijacked in Supply Chain Attack (2026-08-04) — https://www.wiz.io/blog/keyv-and-cacheable-npm-supply-chain-attack
- [Digital Applied] npm Package Compromise: What AI Teams Should Do Now (2026-08-09) — https://www.digitalapplied.com/blog/npm-package-compromise-2026-ai-developer-toolchain-response
- [Datadog Security Labs] Worm compromises hundreds of popular npm packages (2026-08-04) — https://securitylabs.datadoghq.com/articles/npm-worm-compromises-popular-npm-packages/
