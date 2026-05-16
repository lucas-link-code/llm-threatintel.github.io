# Mini Shai-Hulud Wave 5: TeamPCP Compromises TanStack, Mistral AI, UiPath, and 170+ npm/PyPI Packages via GitHub Actions Cache Poisoning

**Date:** 2026-05-16
**Tags:** supply-chain, malware

## Executive Summary

On May 11, 2026, TeamPCP executed a fifth wave of their self-propagating Mini Shai-Hulud supply chain worm, compromising 170+ npm and PyPI packages — including TanStack, the Mistral AI Python SDK, Guardrails AI, UiPath, and OpenSearch — through a chained GitHub Actions exploit that extracted OIDC tokens without ever touching maintainer credentials. The 404 malicious package versions have a cumulative download count exceeding 518 million and represent the first documented case of malicious npm packages published with valid SLSA build provenance. Defenders should immediately audit CI environments for preinstall hooks invoking Bun, outbound connections to `git-tanstack.com`, `api.masscan.cloud`, and `filev2.getsession.org`, and lateral connections to `83.142.209.194`.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud Wave 5 / Shai-Hulud worm (TeamPCP) |
| Actor / Attribution | TeamPCP (attributed by StepSecurity, ReversingLabs, Wiz, OX Security — confidence: high) |
| Target | npm and PyPI consumers: developers, CI/CD pipelines, AI developers using TanStack, Mistral AI SDK, Guardrails AI |
| Vector | Chained GitHub Actions exploit: `pull_request_target` misconfiguration → GitHub Actions cache poisoning → OIDC token extraction from runner process memory |
| Status | Active; malicious versions removed from npm and PyPI registries as of May 12, 2026 |
| First Observed | May 11, 2026, 19:20–19:26 UTC (initial @tanstack/* publishing window) |

## Detailed Findings

### Attack Mechanics

According to StepSecurity's incident analysis, the attacker opened a pull request targeting the TanStack/router repository that triggered TanStack's `bundle-size.yml` workflow, which used the `pull_request_target` event trigger. This trigger grants workflows access to the base repository's cache scope and a `GITHUB_TOKEN` with elevated permissions, even when the code originates from a fork. The attacker-controlled code in the PR exploited this to poison the GitHub Actions pnpm cache with a malicious store containing preinstall hooks.

ReversingLabs and StepSecurity report that attacker-controlled binaries, injected via the poisoned cache, then extracted OIDC tokens directly from the GitHub Actions runner's process memory (`/proc/<pid>/mem`). Using the extracted OIDC token, the attacker called npm's publish endpoint via TanStack's own trusted publishing identity, producing packages with valid provenance attestations. SecurityWeek confirmed this is the first documented instance of a malicious npm package carrying valid SLSA provenance — making it indistinguishable from a legitimate release using standard provenance verification.

### Scope of Compromise

Between 19:20 and 19:26 UTC on May 11, 2026, 84 malicious npm artifacts were published across 42 packages in the `@tanstack` namespace. According to OX Security's analysis, the worm subsequently propagated to packages owned by UiPath (`@uipath/*`), OpenSearch (`@opensearch-project/*`), and Squawk (`@squawk/*`), reaching 170+ total packages across 404 malicious versions.

On the PyPI side, Safedep reported two malicious packages published independently of TanStack's GitHub Actions pipeline, indicating a parallel attack track against PyPI maintainer accounts:
- `mistralai==2.4.6` (official Mistral AI Python SDK)
- `guardrails-ai==0.10.1` (Guardrails AI validation framework)

The cumulative download count for all affected packages exceeds 518 million. `@tanstack/react-router` alone receives over 12.7 million weekly downloads.

CVE-2026-45321 (CVSS 9.6) was assigned to the GitHub Actions OIDC token extraction component of the attack chain.

### Malicious Payload Analysis

According to Phoenix Security's technical dissection, each compromised npm package version included a `preinstall` script that:

1. Downloaded the Bun JavaScript runtime as a living-off-the-land binary (LOTL). Bun was chosen because it lacks the `--require` hook interception used by most Node.js security and monitoring tools.
2. Executed a 2.3 MB obfuscated payload (`router_init.js`) that swept the environment for CI secrets, cloud credentials, GitHub tokens, Kubernetes service account tokens, HashiCorp Vault secrets, cryptocurrency wallet files, and credentials for AI tools and messaging applications.
3. Installed a persistent `gh-token-monitor` daemon via macOS LaunchAgent or Linux systemd that polls GitHub every 60 seconds and attempts `rm -rf ~/` when token revocation is detected (when GitHub returns a 40x response).

For PyPI packages, Microsoft's analysis found that `mistralai==2.4.6` contains malicious code inserted into `mistralai/client/__init__.py` that executes on every import, downloads a credential stealer payload from `83.142.209.194`, includes country-aware logic to avoid Russian-language environments, and incorporates a geofenced destructive branch with a 1-in-6 probability of executing `rm -rf /` on systems geolocated to Israel or Iran.

Exfiltration uses three redundant channels, per Phoenix Security and ReversingLabs: the typosquat domain `git-tanstack[.]com`, the decentralized Session messenger network (via `filev2.getsession[.]org` seed nodes), and GitHub API dead drops where stolen tokens create Dune-themed repositories. Branch names in the dead-drop repositories are drawn exclusively from Frank Herbert's Dune novel (atreides, cogitor, fedaykin, fremen, futar, gesserit, ghola, harkonnen, heighliner, kanly, kralizec, lasgun, etc.).

### Campaign Attribution and Lineage

StepSecurity attributes this wave to TeamPCP, the same actor behind:
- Waves 1–3 of the Shai-Hulud worm (September and November 2025)
- The Aqua Security Trivy GitHub Actions compromise (March 2026)
- The Bitwarden CLI 2026.4.0 hijack targeting AI coding assistant credentials (April 22, 2026)
- Mini Shai-Hulud Wave 4 targeting SAP CAP packages and PyTorch Lightning (April 29–30, 2026)

The consistent use of Bun as a LOTL binary, AES-256-GCM decryption dependent on `Bun.gunzipSync`, Dune-themed dead-drop repository branches, and Session messenger for C2 are signature characteristics across all TeamPCP waves.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Dependencies and Development Tools | T1195.001 | Poisoning npm and PyPI packages via GitHub Actions OIDC token theft |
| Compromise Software Supply Chain | T1195.002 | GitHub Actions cache poisoning to inject malicious preinstall hooks into legitimate release pipeline |
| JavaScript/JScript | T1059.007 | Bun runtime used to execute obfuscated router_init.js payload, evading Node.js security hooks |
| Credentials In Files | T1552.001 | Sweeping CI environment variables, cloud credential files, Kubernetes tokens, Vault secrets |
| Exfiltration Over C2 Channel | T1041 | Triple-channel exfiltration via git-tanstack.com, Session messenger, and GitHub API dead drops |
| Data Destruction | T1485 | rm -rf ~/ triggered on developer machines; rm -rf / on geofenced Israel/Iran systems |
| Create or Modify System Process: Launch Agent | T1543.001 | macOS LaunchAgent for gh-token-monitor persistence |
| Create or Modify System Process: Systemd Service | T1543.002 | Linux systemd service for gh-token-monitor persistence |
| Stage Capabilities: Upload Tool | T1608.002 | Worm self-republishes using stolen npm tokens from compromised developers |
| Valid Accounts | T1078 | Stolen GitHub Actions OIDC token used to publish under legitimate TanStack publishing identity |
| Exfiltration to Code Repository | T1567.002 | GitHub API dead drops using stolen tokens for exfiltrated credential staging |

## IOCs

### Domains

```
git-tanstack.com
api.masscan.cloud
filev2.getsession.org
```

### Full URL Paths

```
git-tanstack.com/tmp/transformers.pyz
83.142.209.194
```

### Splunk Format

```
"git-tanstack.com" OR "api.masscan.cloud" OR "filev2.getsession.org" OR "83.142.209.194"
```

### File Hashes

```
No file hash IOCs published by sources as of 2026-05-16
```

### Malicious Package Versions

```
pypi:mistralai@2.4.6
pypi:guardrails-ai@0.10.1
npm:@tanstack/* (42 packages, see StepSecurity advisory for full list)
```

## Detection Recommendations

**npm/PyPI audit:** Check `package.json` `preinstall` scripts across all dependencies for invocations of `bun`, `bun run`, or `router_init.js`. Lock files installed from `mistralai==2.4.6` or `guardrails-ai==0.10.1` should be treated as compromised.

**CI/CD pipeline review:** Audit all GitHub Actions workflows using `pull_request_target` for untrusted code checkout patterns. The StepSecurity Harden-Runner GitHub Action flags anomalous OIDC token usage and cache write operations from fork-controlled code.

**Network detection (web proxy/DNS):** Alert on outbound DNS queries or HTTP connections to `git-tanstack.com`, `api.masscan.cloud`, and `filev2.getsession.org`. Alert on any process making HTTP requests to `83.142.209.194`.

**EDR process creation:** Alert on `node` or `bun` processes spawned from npm `preinstall` lifecycle scripts, particularly when followed by outbound network connections. Alert on `systemctl enable` or LaunchAgent plist creation from npm scripts.

**Credential rotation:** Any environment that installed an affected `@tanstack/*`, `mistralai`, or `guardrails-ai` version between May 11–12, 2026 should treat all CI secrets, GitHub tokens, AWS/GCP/Azure credentials, Kubernetes service account tokens, and Vault secrets as compromised and rotate immediately.

**GitHub dead drop detection:** Monitor organization repositories for new repositories with Dune-themed branch names (fremen, harkonnen, sardaukar, etc.) created by automated token use — these are exfiltration staging artifacts.

## References

- [StepSecurity] TeamPCP's Mini Shai-Hulud Is Back: A Self-Spreading Supply Chain Attack Compromises TanStack npm Packages (2026-05-12) — https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem
- [ReversingLabs] Team PCP's Mini Shai-Hulud tears at open-source trust (2026-05-12) — https://www.reversinglabs.com/blog/mini-shai-hulud-tears-at-oss-trust
- [Wiz] Mini Shai-Hulud Strikes Again: TanStack + more npm Packages Compromised (2026-05-12) — https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised
- [SecurityWeek] TanStack, Mistral AI, UiPath Hit in Fresh Supply Chain Attack (2026-05-12) — https://www.securityweek.com/tanstack-mistral-ai-uipath-hit-in-fresh-supply-chain-attack/
- [The Hacker News] Mini Shai-Hulud Worm Compromises TanStack, Mistral AI, Guardrails AI & More Packages (2026-05-12) — https://thehackernews.com/2026/05/mini-shai-hulud-worm-compromises.html
- [OX Security] "Shai-Hulud" Malware Hits 170+ npm & PyPi Packages (2026-05-12) — https://www.ox.security/blog/shai-hulud-here-we-go-again-170-packages-hit-across-npm-pypi/
- [Orca Security] TanStack and 160+ npm/PyPI Packages Compromised in Supply Chain Worm Attack (2026-05-12) — https://orca.security/resources/blog/tanstack-npm-supply-chain-worm/
- [Safedep] Mass Supply Chain Attack Hits TanStack, Mistral AI npm and PyPI Packages (2026-05-12) — https://safedep.io/mass-npm-supply-chain-attack-tanstack-mistral/
- [Snyk] TanStack npm Packages Hit by Mini Shai-Hulud (2026-05-12) — https://snyk.io/blog/tanstack-npm-packages-compromised/
- [Phoenix Security] Mini Shai-Hulud: TeamPCP's Self-Propagating npm Worm Hits TanStack, OpenSearch, and Mistral AI Across 170 Packages (2026-05-13) — https://phoenix.security/mini-shai-hulud-teampcp-tanstack/
- [The Register] Cache-poisoning caper turns TanStack npm packages toxic (2026-05-12) — https://www.theregister.com/cyber-crime/2026/05/12/cache-poisoning-caper-turns-tanstack-npm-packages-toxic/5238650
