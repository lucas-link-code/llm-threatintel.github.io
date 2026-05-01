# Mini Shai-Hulud Worm Pivots to AI Coding Agents: TeamPCP Compromises SAP CAP, mbt, intercom-client, and PyTorch Lightning to Plant Claude Code SessionStart Hooks

**Date:** 2026-05-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

Between April 29 and April 30, 2026, threat actor TeamPCP conducted a coordinated supply chain operation dubbed Mini Shai-Hulud that hijacked four SAP-related npm packages (mbt 1.2.48, @cap-js/db-service 2.10.1, @cap-js/postgres 2.2.2, @cap-js/sqlite 2.2.2), the intercom-client 7.0.4 SDK (361,510 weekly downloads), and PyTorch Lightning 2.6.2 and 2.6.3 on PyPI. Beyond stealing GitHub, npm, AWS, Azure, GCP, and Kubernetes secrets, the worm commits a `.claude/settings.json` SessionStart hook and a `.vscode/tasks.json` `runOn: folderOpen` entry into every accessible repository, turning AI coding agent configurations themselves into a self-propagating persistence channel. SAP rotated affected packages by 13:45 UTC on April 29; defenders should rotate developer/CI tokens used since the affected windows and audit repositories for poisoned `.claude/` and `.vscode/` configs.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud (third Shai-Hulud wave) |
| Attribution | TeamPCP (confidence: high) |
| Target | SAP CAP framework users, Intercom SDK consumers, PyTorch Lightning users, and developer/CI environments using Claude Code or VS Code |
| Vector | Malicious npm preinstall hooks and PyPI install-time imports that bootstrap a Bun runtime payload |
| Status | active (worm-like, ongoing propagation) |
| First Observed | 2026-04-29 |

## Detailed Findings

According to Aikido Security, StepSecurity, Wiz, Sophos, and SAP's own response, on April 29, 2026, between 09:55 UTC and 12:14 UTC, four official SAP npm packages were republished with malicious preinstall scripts: mbt 1.2.48, @cap-js/db-service 2.10.1, @cap-js/postgres 2.2.2, and @cap-js/sqlite 2.2.2. The packages collectively receive approximately 570,000 weekly downloads and provide the Cloud MTA Build Tool and CAP database service modules used in SAP Cloud Application Programming. SAP detected the compromise and superseded all four packages with clean releases by 13:45 UTC the same day.

According to Aikido Security and Semgrep, the packages introduce a new package.json `preinstall` hook that runs `setup.mjs`, a Bun bootstrapper. `setup.mjs` is identical across @cap-js/postgres and @cap-js/db-service (SHA-256 4066781fa830224c8bbcc3aa005a396657f9c8f9016f9a64ad44a9d7f5f45e34); the script detects host OS and architecture, downloads Bun 1.3.13 from GitHub when needed, extracts the binary, and uses Bun rather than Node.js to execute the second stage `execution.js`. Aikido reports `execution.js` is an 11.7 MB obfuscated payload (SHA-256 80a3d2877813968ef847ae73b5eeeb70b9435254e74d7f07d8cf4057f0a710ac for the @cap-js/postgres and @cap-js/db-service variants; SHA-256 eb6eb4154b03ec73218727dc643d26f4e14dfda2438112926bb5daf37ae8bcdb is reported as the identical execution.js across the same two packages by Snyk and Aikido).

Researchers report the second-stage payload protects sensitive strings (credential paths, environment variable names, API endpoints) using PBKDF2 key derivation with per-byte SHA-256 transformations across roughly 200,000 iterations, and harvests local developer credentials, GitHub and npm tokens, GitHub Actions secrets, and cloud secrets from AWS, Azure, GCP, and Kubernetes. Stolen data is encrypted with AES-256-GCM and the symmetric key is encapsulated using RSA-4096 with a public key embedded in the payload, then exfiltrated to public GitHub repositories created on the victim's own account with the description "A Mini Shai-Hulud has Appeared." On April 29, a GitHub search for that exact string returned over 1,000 victim repositories.

According to Mend, StepSecurity, and Phoenix Security, the most consequential novelty is AI coding agent persistence. The payload commits a `.claude/settings.json` file abusing Claude Code's SessionStart hook and a `.vscode/tasks.json` with `"runOn": "folderOpen"` into every accessible repository, signed `claude@users.noreply.github.com` with the message `chore: update dependencies`. Anyone subsequently opening the repository in Claude Code or VS Code silently re-executes the malware, regardless of whether they install any npm package. This converts the repository itself into a propagation vector that piggybacks on AI coding agent and IDE activation events.

According to Socket and Snyk, the worm propagates: 29 hours after the SAP compromises, on April 30, 2026, intercom-client 7.0.4 was published from the compromised GitHub user `nhur`'s account through a now-deleted branch that triggered an automated CI publish workflow during a ~47-minute suspicious activity window. Version 7.0.4 contains two malicious files (`setup.mjs` and `router_runtime.js`) that were not present in the previous 7.0.3 release. The same payload scans for secrets in Kubernetes environments and HashiCorp Vault and extracts AWS keys, GitHub and npm tokens, database connection strings, private keys, and API secrets.

According to Socket, Sonatype, and Semgrep, the campaign also reached PyPI: PyTorch Lightning versions 2.6.2 and 2.6.3 were published on April 30, 2026, containing a hidden `_runtime` directory with a downloader and an obfuscated JavaScript payload. On import, the package runs a background `start.py` that downloads the Bun JavaScript runtime and launches an 11 MB obfuscated payload functionally equivalent to the npm execution.js.

The Hacker News and SecurityWeek report TeamPCP is the same threat actor previously responsible for the Trivy GitHub Actions, Checkmarx, LiteLLM, and Bitwarden CLI compromises, and that the actor moved to an onion-hosted site after its X account was suspended.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies | T1195.001 | Hijack of mbt, @cap-js/* npm packages and PyTorch Lightning PyPI releases |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Bun runtime executes obfuscated execution.js outside the Node.js attack surface most defenders monitor |
| Command and Scripting Interpreter: Python | T1059.006 | start.py loader inside PyTorch Lightning launches the Bun-based payload |
| Credentials from Password Stores | T1555 | Harvest of GitHub and npm tokens, SSH keys, and cloud credential files |
| Unsecured Credentials: Cloud Instance Metadata API | T1552.005 | Harvesting AWS, Azure, GCP, and Kubernetes credentials from runtime environments |
| Event Triggered Execution: Component Object Model Hijacking | T1546 | Abuse of Claude Code SessionStart hook in `.claude/settings.json` to run on every editor session |
| Event Triggered Execution | T1546 | VS Code `.vscode/tasks.json` `runOn: folderOpen` entry triggers payload on folder open |
| Exfiltration Over Web Service | T1567.002 | Encrypted credential bundles exfiltrated to attacker-controlled public GitHub repositories on the victim's own account |
| Data Encoding: Standard Encoding | T1132.001 | Base64-wrapped commit body marker `OhNoWhatsGoingOnWithGitHub:[Base64_String]` |

## IOCs

### Domains

```
github.com
```

### Full URL Paths

```
github.com/oven-sh/bun/releases (Bun 1.3.13 download fetched at install time)
```

### Splunk Format

```
"A Mini Shai-Hulud has Appeared" OR "OhNoWhatsGoingOnWithGitHub:" OR "claude@users.noreply.github.com" OR "execution.js" OR "router_runtime.js" OR "setup.mjs"
```

### File Hashes

```
4066781fa830224c8bbcc3aa005a396657f9c8f9016f9a64ad44a9d7f5f45e34
80a3d2877813968ef847ae73b5eeeb70b9435254e74d7f07d8cf4057f0a710ac
eb6eb4154b03ec73218727dc643d26f4e14dfda2438112926bb5daf37ae8bcdb
```

### Package Indicators

```
npm:mbt@1.2.48
npm:@cap-js/db-service@2.10.1
npm:@cap-js/postgres@2.2.2
npm:@cap-js/sqlite@2.2.2
npm:intercom-client@7.0.4
pypi:lightning@2.6.2
pypi:lightning@2.6.3
```

## Detection Recommendations

Audit all source repositories that developers, CI runners, or AI coding agents have touched since April 29, 2026 for unexpected `.claude/settings.json` and `.vscode/tasks.json` files, particularly entries containing a SessionStart hook or `"runOn": "folderOpen"`. Block commits authored by `claude@users.noreply.github.com` with the message `chore: update dependencies` if Claude Code is not in use in the repository.

Search GitHub organizations for repositories with the description string `A Mini Shai-Hulud has Appeared` and for commit messages containing `OhNoWhatsGoingOnWithGitHub:` followed by a base64 blob.

EDR: alert on `bun` binary execution under npm install lifecycle (npm install, ci, prepare, postinstall, preinstall) or under Python interpreter parent processes during `pip install`. Alert on processes named `setup.mjs`, `execution.js`, `router_runtime.js`, or `start.py` in unexpected directories.

Audit npm and pip lockfiles for the listed package versions. Block them in artifact managers (Artifactory, Nexus, GitHub Packages) and pull internal copies if present.

Cloud audit logs: hunt for unusual `aws sts get-caller-identity`, `gcloud auth list`, `az account show`, and Kubernetes `kubectl config view` invocations spawned by Node.js, npm, or python parent processes around the affected windows.

Web proxy / DNS: monitor for outbound traffic to GitHub release endpoints from unexpected child processes; specifically the Bun release download path under github.com/oven-sh/bun.

Rotate any GitHub PATs, npm tokens, GitHub Actions secrets, AWS/Azure/GCP keys, SSH keys, and HashiCorp Vault tokens used on hosts that installed the affected packages or opened repositories in Claude Code or VS Code after April 29, 2026.

## References

- [Aikido Security] Mini Shai-Hulud Targets SAP npm Packages With a Bun-Based Secret Stealer (2026-04-29) — https://www.aikido.dev/blog/mini-shai-hulud-has-appeared
- [StepSecurity] A Mini Shai-Hulud Has Appeared: Obfuscated Bun Runtime Payloads Hit SAP-Related npm Packages (2026-04-29) — https://www.stepsecurity.io/blog/a-mini-shai-hulud-has-appeared
- [Wiz] Supply Chain Campaign Targets SAP npm Packages with Credential-Stealing Malware (2026-04-29) — https://www.wiz.io/blog/mini-shai-hulud-supply-chain-sap-npm
- [Sophos] Mini Shai-Hulud Supply Chain Attack Targets SAP npm Packages (2026-04-30) — https://www.sophos.com/en-us/blog/-mini-shai-hulud-supply-chain-attack-targets-sap-npm-packages
- [The Hacker News] SAP-Related npm Packages Compromised in Credential-Stealing Supply Chain Attack (2026-04-30) — https://thehackernews.com/2026/04/sap-npm-packages-compromised-by-mini.html
- [Socket] Intercom's npm Package Compromised in Ongoing Mini Shai-Hulud Attack (2026-04-30) — https://socket.dev/blog/intercom-s-npm-package-compromised-in-supply-chain-attack
- [The Hacker News] PyTorch Lightning and Intercom-client Hit in Supply Chain Attacks to Steal Credentials (2026-04-30) — https://thehackernews.com/2026/04/pytorch-lightning-compromised-in-pypi.html
- [SecurityWeek] 1,800 Hit in Mini Shai-Hulud Attack on SAP, Lightning, Intercom (2026-04-30) — https://www.securityweek.com/1800-hit-in-mini-shai-hulud-attack-on-sap-lightning-intercom/
- [Mend] Shai-Hulud Strikes SAP: Supply Chain Worm Weaponized Claude Code to Compromise the CAP Framework (2026-04-30) — https://www.mend.io/blog/shai-hulud-sap-cap-supply-chain-attack-claude-code/
- [Phoenix Security] Mini Shai-Hulud: SAP CAP and mbt npm Packages Backdoored via Bun-Loaded Credential Stealer with Claude Code Persistence (2026-04-30) — https://phoenix.security/mini-shai-hulud-sap-cap-mbt-npm-supply-chain-bun-credential-stealer/
- [The Register] Ongoing Supply Chain Attacks Worm Into SAP npm Packages (2026-04-30) — https://www.theregister.com/2026/04/30/supply_chain_attacks_sap_npm_packages/
