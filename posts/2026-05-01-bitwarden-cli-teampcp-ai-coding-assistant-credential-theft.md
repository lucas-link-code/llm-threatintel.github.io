# @bitwarden/cli 2026.4.0 Trojanized: TeamPCP Worm Steals AI Coding Assistant Credentials From Claude Code, Cursor, Aider, Kiro, Codex CLI, and Gemini CLI

**Date:** 2026-05-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

On April 22, 2026, between 17:57 and 19:30 ET (a roughly 93-minute window), TeamPCP published a malicious @bitwarden/cli 2026.4.0 release on npm after pivoting from a prior compromise of Bitwarden's GitHub Actions CI/CD pipeline tied to the Checkmarx supply chain incident. The 10 MB payload (`bw1.js`) harvested GitHub and npm tokens, SSH keys, environment variables, shell history, and cloud credentials, and explicitly enumerated authenticated AI coding assistant configurations for Claude Code, Cursor, Aider, Kiro, Codex CLI, and Gemini CLI before exfiltrating to the audit.checkmarx.cx telemetry endpoint reused from the Checkmarx breach. Bitwarden estimates 334 downloads occurred during the window; affected developers should treat AI coding assistant sessions on those hosts as compromised, revoke them, and re-authenticate from clean systems using the safe re-release @bitwarden/cli 2026.4.1.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TeamPCP "Shai-Hulud: The Third Coming" / Bitwarden CLI hijack |
| Attribution | TeamPCP (confidence: high; claimed by @pcpcats) |
| Target | Developers using Bitwarden CLI on workstations and CI runners; AI coding assistants authenticated on those hosts |
| Vector | Trojanized npm release of @bitwarden/cli 2026.4.0 |
| Status | disrupted (package deprecated 1.5h after publication) |
| First Observed | 2026-04-22 |

## Detailed Findings

According to Socket, Palo Alto Networks Unit 42, JFrog Security Research, and Bitwarden's own community advisory, the malicious @bitwarden/cli@2026.4.0 was available on npm between 17:57 ET and 19:30 ET on April 22, 2026. There was no corresponding signed release on the official Bitwarden GitHub repository. Bitwarden estimates 334 downloads during the window. Bitwarden subsequently published @bitwarden/cli 2026.4.1, a re-release of the prior clean 2026.3.0.

According to Socket and JFrog, the malicious payload was contained in `bw1.js`, a roughly 10 MB obfuscated JavaScript blob that executed at install time before the developer ever ran a Bitwarden command. Socket reports `bw1.js` SHA-256 as 18f784b3bc9a0bcdcb1a8d7f51bc5f54323fc40cbd874119354ab609bef6e4cb. The payload uses the same `__decodeScrambled` obfuscation routine seeded with `0x3039` first observed in the Checkmarx KICS image compromise, and exfiltrates via the same `audit.checkmarx.cx/v1/telemetry` endpoint.

According to Palo Alto Networks Unit 42 and Endor Labs, the payload combines a multi-cloud credential harvester targeting six distinct secret surfaces (local files, environment variables, shell history, GitHub Actions, cloud SDK profiles, and AI tool configuration directories), a self-propagating npm worm that re-infects every package the victim's npm token can publish, a GitHub commit dead-drop C2 channel with RSA-signed command delivery, authenticated-encryption exfiltration that survives repository seizure, shell RC persistence, and a dedicated module that enumerates authenticated AI coding assistants.

According to State of Surveillance, Mend, and Security Boulevard, the AI module specifically searches for credentials and session state belonging to Claude Code, Cursor, Codex CLI, Aider, Kiro, and Gemini CLI. State of Surveillance reports a particularly novel side-effect: because Claude Code, Cursor, and similar agents read `~/.bashrc` to assist with environment-related tasks, the worm plants an approximately 3,500-byte ideological "manifesto" inside a heredoc body in the victim's `.bashrc`. When the AI agent reads `.bashrc`, the manifesto ends up in the agent's context window for every subsequent task, creating a persistent prompt-injection condition tied to the developer's shell startup file.

According to Sophos and JFrog, the breach pivoted from a prior compromise of Bitwarden's GitHub Actions workflow chain. The workflow had consumed Checkmarx KICS Action images previously trojanized by TeamPCP; that compromise yielded npm publish credentials sufficient to push @bitwarden/cli 2026.4.0. Bitwarden has emphasized that no end-user vault data was accessed, and that the breach was confined to the npm distribution channel and did not impact the core Bitwarden codebase, browser extensions, or mobile apps.

According to The Hacker News and SoCRadar, TeamPCP's @pcpcats account claimed responsibility for the broader Checkmarx campaign. The actor was previously responsible for compromises against Trivy, LiteLLM, the Asurion-impersonating sbxapps/asurion-hub-web/soluto-home-web/asurion-core npm packages (April 1–8, 2026), and the Mini Shai-Hulud SAP CAP / mbt / intercom-client / PyTorch Lightning attacks of April 29–30, 2026.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies | T1195.001 | Hijacked @bitwarden/cli 2026.4.0 npm release |
| Trusted Relationship | T1199 | Exploitation of Bitwarden CI/CD pipeline that consumed compromised Checkmarx KICS GitHub Actions images |
| Command and Scripting Interpreter: JavaScript | T1059.007 | bw1.js obfuscated install-time payload |
| Credentials from Password Stores | T1555 | Harvest of GitHub, npm, cloud, and AI coding assistant credentials |
| Unsecured Credentials: Credentials In Files | T1552.001 | Enumeration of `~/.aws`, `~/.azure`, `~/.config/gcloud`, `~/.kube`, and AI tool config directories |
| Application Layer Protocol: Web Protocols | T1071.001 | Exfiltration to audit.checkmarx.cx/v1/telemetry over HTTPS |
| Exfiltration Over Web Service | T1567 | Encrypted bundles posted to attacker-controlled GitHub commits as a dead-drop channel |
| Boot or Logon Initialization Scripts | T1037.004 | Heredoc payload appended to ~/.bashrc creating persistent shell-load behaviour |
| Stage Capabilities: Upload Tool | T1608.002 | Worm self-propagates by re-publishing trojanized versions of any package the victim token can push |

## IOCs

### Domains

```
audit.checkmarx.cx
```

### Full URL Paths

```
audit.checkmarx.cx/v1/telemetry
```

### Splunk Format

```
"audit.checkmarx.cx" OR "audit.checkmarx.cx/v1/telemetry" OR "bw1.js" OR "@bitwarden/cli@2026.4.0" OR "__decodeScrambled"
```

### File Hashes

```
18f784b3bc9a0bcdcb1a8d7f51bc5f54323fc40cbd874119354ab609bef6e4cb
```

### Package Indicators

```
npm:@bitwarden/cli@2026.4.0
```

## Detection Recommendations

Web proxy / DNS / EDR: alert on any host that connected to `audit.checkmarx.cx` or to the `/v1/telemetry` URL on that host between April 22, 2026 17:57 ET and the time of the host's package downgrade. Treat any such host as compromised.

Audit npm lockfiles, `package-lock.json`, and `yarn.lock` files for `@bitwarden/cli` resolved to version `2026.4.0`. Also audit container images and CI runner caches built between April 22 17:57 ET and April 22 19:30 ET.

EDR: hunt for `bw1.js` filename, processes spawning `node bw1.js`, and obfuscated JavaScript routines containing the symbol `__decodeScrambled` initialised with seed `0x3039`. Search shell history (`~/.bash_history`, `~/.zsh_history`) and `~/.bashrc`, `~/.zshrc`, `~/.profile` for unexpected heredoc blocks or appended ideological text.

Cloud audit logs: rotate AWS, Azure, GCP, and any other cloud credentials cached on affected hosts; review CloudTrail / Activity Log / Cloud Audit Logs for unfamiliar use of those credentials in the days following April 22.

If Claude Code, Cursor, Codex CLI, Aider, Kiro, or Gemini CLI were authenticated on a host that installed @bitwarden/cli 2026.4.0, revoke the active sessions and API keys, then re-authenticate from a clean system. Audit any AI agent transcripts produced after April 22 for unexpected references to the manifesto language (themes invoking destruction or deletion of "machines"), which would indicate prompt-injection through the modified `.bashrc`.

CI/CD: rotate any GitHub PAT, npm token, AWS access key, or other secret that lived on affected runners or workstations; revoke long-lived tokens and replace with OIDC short-lived credentials where possible.

## References

- [Socket] Bitwarden CLI Compromised in Ongoing Checkmarx Supply Chain Campaign (2026-04-23) — https://socket.dev/blog/bitwarden-cli-compromised
- [Palo Alto Networks Unit 42] Bitwarden CLI Impersonation Attack Steals Cloud Credentials and Spreads Across npm Supply Chains (2026-04-23) — https://www.paloaltonetworks.com/blog/cloud-security/bitwardencli-supply-chain-attack/
- [JFrog Security Research] TeamPCP Campaign Spreads to npm via a Hijacked Bitwarden CLI (2026-04-23) — https://research.jfrog.com/post/bitwarden-cli-hijack/
- [The Hacker News] Bitwarden CLI Compromised in Ongoing Checkmarx Supply Chain Campaign (2026-04-23) — https://thehackernews.com/2026/04/bitwarden-cli-compromised-in-ongoing.html
- [Endor Labs] Shai-Hulud: The Third Coming – Inside the Bitwarden CLI 2026.4.0 Supply Chain Attack (2026-04-23) — https://www.endorlabs.com/learn/shai-hulud-the-third-coming----inside-the-bitwarden-cli-2026-4-0-supply-chain-attack
- [Sophos] Supply Chain Attacks Hit Checkmarx and Bitwarden Developer Tools (2026-04-24) — https://www.sophos.com/en-us/blog/supply-chain-attacks-hit-checkmarx-and-bitwarden-developer-tools
- [State of Surveillance] A Password Manager Got Hacked for 90 Minutes. The Malware Was Hunting for Your AI Coding Tools. (2026-04) — https://stateofsurveillance.org/news/bitwarden-cli-supply-chain-attack-ai-coding-tools-checkmarx-2026/
- [Security Boulevard] The Butlerian Jihad: Compromised Bitwarden CLI Deploys npm Worm, Poisons AI Assistants, and Dumps GitHub Secrets (2026-04) — https://securityboulevard.com/2026/04/the-butlerian-jihad-compromised-bitwarden-cli-deploys-npm-worm-poisons-ai-assistants-and-dumps-github-secrets/
- [SecurityWeek] Bitwarden NPM Package Hit in Supply Chain Attack (2026-04-23) — https://www.securityweek.com/bitwarden-npm-package-hit-in-supply-chain-attack/
- [Bitwarden] Statement on Checkmarx Supply Chain Incident (2026-04-23) — https://community.bitwarden.com/t/bitwarden-statement-on-checkmarx-supply-chain-incident/96127
