# GitHub's Internal Repositories Breached via Poisoned `Nx Console` VS Code Extension — TeamPCP (UNC6780) Exfiltrates ~3,800 Private Repos; Stealer Harvests Claude Code, 1Password, npm, AWS and GitHub Credentials

**Date:** 2026-05-29
**Tags:** supply-chain, malware

## Executive Summary

On 2026-05-18 the threat actor TeamPCP (tracked by Google Threat Intelligence Group as UNC6780) published a trojanised version 18.95.0 of the popular `Nx Console` VS Code extension (`nrwl.angular-console`, 2.2M+ installs) to the Visual Studio Marketplace and Open VSX, where it remained live for roughly 11–18 minutes on the Marketplace and ~36 minutes on Open VSX before takedown. Within seconds of any developer opening a workspace, the extension fetched a ~498 KB obfuscated credential stealer hidden in a dangling orphan commit inside the legitimate `nrwl/nx` GitHub repository; the payload harvested 1Password vaults, **Anthropic Claude Code configurations**, npm tokens, GitHub credentials and AWS keys, and on macOS installed a persistent Python C2 backdoor (`~/.local/share/kitty/cat.py`) that uses the GitHub Search API as a dead-drop. One of the compromised endpoints belonged to a GitHub employee: on 2026-05-19 GitHub disclosed unauthorised access to its internal source code and by 2026-05-20 confirmed that approximately 3,800 internal repositories had been exfiltrated, which TeamPCP then advertised for sale (≥$50,000) on the Breached forum. Defenders who had `Nx Console` with auto-update enabled during the 2026-05-18 window should treat the host as compromised, remove version 18.95.0, and rotate every credential class (cloud, GitHub PAT, npm token, password-manager vault, Claude Code / AI-assistant config) reachable from that workstation.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Poisoned `Nx Console` v18.95.0 VS Code extension → GitHub internal-repository breach (Mini Shai-Hulud / TeamPCP campaign) |
| Actor / Attribution | TeamPCP, tracked by Google Threat Intelligence Group as UNC6780 — high confidence; actor claimed responsibility on the Breached forum and reused Mini Shai-Hulud tradecraft (498 KB obfuscated stealer, GitHub dead-drop C2) |
| Target | VS Code developers with `Nx Console` installed (2.2M+ install base); downstream impact to GitHub's own internal repositories via a compromised employee endpoint |
| Vector | Supply-chain poisoning of a trusted IDE extension: a contributor's GitHub token (scraped in a prior TanStack package compromise) was used to publish a malicious extension build via the `nrwl/nx` publishing credentials (`VSCE_PAT`) |
| Status | Removed — malicious extension version pulled from both registries within ~11–36 minutes; GitHub isolated the affected endpoint; stolen data offered for sale |
| First Observed | 2026-05-18 ~12:30 UTC (malicious publish); breach disclosed 2026-05-19, ~3,800-repo figure confirmed 2026-05-20 |

## Detailed Findings

### The poisoned extension and its short exposure window

According to Nx's official postmortem (*Postmortem: Nx Console v18.95.0 supply-chain compromise*) and StepSecurity's analysis, a malicious build of `Nx Console` version 18.95.0 (`nrwl.angular-console`) was published to the Visual Studio Marketplace at approximately 12:30 UTC on 2026-05-18 with malicious code injected into the extension's `main.js`. Nx and StepSecurity report the Marketplace copy was live for roughly 11–18 minutes before removal, while the Open VSX copy remained available for approximately 36 minutes. Despite the short window, the extension's 2.2M+ install base and auto-update behaviour meant a meaningful number of developers pulled the poisoned build: Microsoft's Marketplace telemetry initially showed only 28 installs during the window, but Nx CEO Jeff Cross stated the true exposure count likely exceeds 6,000. The corresponding GitHub advisory is published as `GHSA-c9j4-9m59-847w`.

### Root cause — a credential theft chain originating from the TanStack compromise

Nx's advisory attributes the root cause to a stolen contributor credential rather than a registry-side weakness: "This compromise occurred due to a recent supply chain attack that scraped one of our contributor's GitHub token." Per StepSecurity and Nx, the developer machine that leaked the token had resolved a malicious dependency — `@tanstack/zod-adapter@1.166.15` — during a routine `pnpm install` roughly seven days earlier, as part of the broader TanStack supply-chain compromise of 2026-05-11 (already tracked on this site under `mini-shai-hulud-wave-5` / the TanStack post). The scraped token belonged to an account with push access to `nrwl/nx` and, directly or indirectly, to the extension's Marketplace publishing credential (`VSCE_PAT`). This makes the incident a second-order supply-chain attack: one poisoned npm package compromised a maintainer, whose credentials were then used to poison a widely-installed IDE extension.

### Payload — fetched from a dangling commit, harvests AI-assistant and cloud credentials

According to The Hacker News (*GitHub Internal Repositories Breached via Malicious Nx Console VS Code Extension*) and Cybersecurity News, within seconds of a developer opening any workspace the compromised extension silently fetched and executed a ~498 KB obfuscated payload hosted in a **dangling orphan commit inside the official `nrwl/nx` GitHub repository** — i.e. the malware was staged inside a trusted repo rather than on attacker-owned infrastructure, defeating naïve domain-reputation checks. The payload is a multi-stage credential stealer that harvested:

- **Password managers:** 1Password vault material
- **AI developer tooling:** Anthropic **Claude Code** configurations (consistent with prior Mini Shai-Hulud waves that explicitly enumerate AI coding-assistant credentials)
- **Developer / cloud:** npm tokens, GitHub credentials, and Amazon Web Services (AWS) keys

The ~498 KB obfuscated payload size matches the Mini Shai-Hulud stealer toolkit documented in the 2026-05-19 @antv wave and the 2026-05-11 TanStack/Mistral wave, supporting the TeamPCP attribution. The zero-day-wire writeup additionally reports a Sigstore supply-chain poisoning capability in the payload, indicating the stealer was designed to abuse signing material for onward package compromise — the self-propagating "worm" behaviour characteristic of Shai-Hulud.

### macOS persistence and the GitHub dead-drop C2

On macOS, StepSecurity reports the payload installed a persistent Python C2 backdoor at `~/.local/share/kitty/cat.py` with a `LaunchAgent` configured for hourly execution. Rather than beacon to a fixed C2 domain, `cat.py` uses the **GitHub Search API as a dead-drop**: it polls for commits matching the keyword `firedalazer` and verifies an RSA-PSS signature on the retrieved content before executing the attacker-controlled Python. This design keeps all command-and-control traffic inside `github.com`, which most developer and CI networks already allow. Credential exfiltration used three parallel channels — HTTPS, the GitHub API, and DNS tunnelling — making single-channel network blocking insufficient.

### The GitHub internal-repository breach

One of the developers who installed the poisoned extension was a GitHub employee. According to GitHub's own disclosure (a thread posted to X) and reporting by VentureBeat, Help Net Security, BleepingComputer and Infosecurity Magazine, the compromise of that single endpoint gave the attacker access to GitHub's internal repositories; GitHub disclosed the unauthorised access on 2026-05-19 and by 2026-05-20 confirmed that approximately 3,800 internal source-code repositories had been exfiltrated. GitHub stated it found no evidence of impact to customer organisations, enterprises, or user repositories, and that it isolated the affected endpoint, pulled the malicious extension, and began incident response. TeamPCP subsequently claimed "~4,000 repos of private code" on the Breached cybercrime forum, listing the data for offers above $50,000.

### Concurrent activity — Microsoft `durabletask` PyPI compromise

The Nx Console incident coincided with the same actor's broader wave: per iTnews and VentureBeat, three malicious versions of Microsoft's official `durabletask` Python SDK were published to PyPI on 2026-05-19 carrying a credential stealer (and, per iTnews, a disk-wiper component), each shipping a valid SLSA Build Level 3 provenance attestation. That PyPI activity is part of the Mini Shai-Hulud wave already documented on this site under the 2026-05-21 @antv post and is referenced here only to establish that the Nx Console attack was one prong of a coordinated multi-registry campaign — notably one in which Microsoft owned much of the chain (VS Code Marketplace, GitHub, npm, and the Azure-adjacent `durabletask` SDK).

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Initial Access — Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.002 | Trojanised `Nx Console` v18.95.0 IDE extension published via stolen `nrwl/nx` publishing credentials |
| Initial Access — Valid Accounts | T1078 | Use of a scraped contributor GitHub token (and `VSCE_PAT` publishing credential) to publish the malicious build |
| Resource Development — Stage Capabilities: Upload Malware | T1608.001 | ~498 KB stealer staged in a dangling orphan commit inside the legitimate `nrwl/nx` repository |
| Execution — Command and Scripting Interpreter: JavaScript | T1059.007 | Malicious `main.js` executes on workspace open |
| Execution — Command and Scripting Interpreter: Python | T1059.006 | `cat.py` backdoor executes attacker-supplied Python |
| Persistence — Create or Modify System Process: Launch Agent | T1543.001 | macOS `LaunchAgent` runs `~/.local/share/kitty/cat.py` hourly |
| Credential Access — Unsecured Credentials: Credentials In Files | T1552.001 | Harvest of Claude Code config, npm tokens, GitHub credentials, AWS keys, 1Password material |
| Credential Access — Credentials from Password Stores | T1555 | 1Password vault material targeted |
| Command and Control — Web Service: Dead Drop Resolver | T1102.001 | `cat.py` polls GitHub Search API for commits keyed on `firedalazer`, RSA-PSS verified |
| Exfiltration — Exfiltration Over Alternative Protocol: DNS | T1048 | DNS tunnelling used as one of three parallel exfiltration channels |
| Exfiltration — Exfiltration Over Web Service to Code Repository | T1567.002 | Exfiltration via the GitHub API in parallel with HTTPS and DNS |

## IOCs

### Domains

```
No domain IOCs published by source
```

*Defender note: command-and-control and exfiltration deliberately ride on `github.com` (GitHub Search API dead-drop, GitHub API exfiltration) and DNS tunnelling rather than attacker-owned domains. `github.com` is shared legitimate infrastructure and is not published as a standalone IOC; hunt on the behaviour (the `firedalazer` dead-drop keyword and the `cat.py` backdoor) rather than on the domain.*

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No network IOCs for Splunk query — hunt on the cat.py SHA-256 below and on EDR process telemetry (see Detection Recommendations)
```

### File Hashes

```
fb5c97557230a27460fdab01fafcfabeaa49590bafd5b6ef30501aa9e0a51142
```

*SHA-256 of the macOS `cat.py` Python C2 backdoor (`~/.local/share/kitty/cat.py`).*

### Package / Extension Indicators

```
nrwl.angular-console 18.95.0   (malicious Nx Console VS Code extension build)
@tanstack/zod-adapter 1.166.15 (root-cause dependency that scraped the contributor token; from the 2026-05-11 TanStack compromise)
```

*Behavioural indicators: macOS backdoor path `~/.local/share/kitty/cat.py` and its hourly `LaunchAgent`; GitHub Search dead-drop keyword `firedalazer`.*

## Detection Recommendations

**Immediate inventory and remediation:**
- Identify any host that had `Nx Console` (`nrwl.angular-console`) version **18.95.0** installed, or had auto-update enabled, during the 2026-05-18 exposure window (~12:30 UTC onward). Per Nx's advisory, presence of 18.95.0 = assume compromise. Remove/downgrade to a known-good version per `GHSA-c9j4-9m59-847w`.
- On affected hosts, rotate every credential class the payload targets: 1Password vault items, **Anthropic Claude Code / AI-assistant configs and API keys**, npm tokens (`~/.npmrc`), GitHub PATs, and AWS keys (`~/.aws/`). Treat any GitHub token that was resident on the host as burned.

**Endpoint (EDR / macOS):**
- Hunt for the file `~/.local/share/kitty/cat.py` and any `LaunchAgent` plist referencing it (hourly schedule). Match against SHA-256 `fb5c9755…51142`. Note the `kitty` directory name is a decoy resembling the legitimate Kitty terminal — validate provenance, do not allow by name.
- Alert on a VS Code / `node` process spawning `python`/`python3` shortly after a workspace is opened, and on child processes reading `~/.config/op/` (1Password), Claude Code config paths, `~/.npmrc`, `~/.aws/`, or `git` credential stores within seconds of extension load.

**Network telemetry:**
- The C2 is a GitHub Search API dead-drop, so blocking a domain will not help. Instead, hunt for anomalous, periodic (hourly) GitHub Search API queries from developer endpoints — especially searches containing the literal keyword `firedalazer` — and for DNS-tunnelling patterns (high volume of long, high-entropy subdomain lookups) from workstations that recently loaded the extension.

**Supply-chain hardening (campaign-level):**
- Treat IDE extensions as first-class supply-chain dependencies: pin extension versions, disable silent auto-update on high-privilege developer endpoints, and monitor Marketplace/Open VSX publish events for extensions in your golden image.
- Because the initial credential theft chained from `@tanstack/zod-adapter@1.166.15` (2026-05-11 TanStack wave), audit any developer machine that ran `npm`/`pnpm install` resolving TanStack packages in that window and rotate the GitHub tokens resident on it. Enforce short-lived, least-privilege publishing tokens (`VSCE_PAT`, npm OIDC) over long-lived credentials.

## References

- [Nx] *Postmortem: Nx Console v18.95.0 supply-chain compromise* (2026-05) — https://nx.dev/blog/nx-console-v18-95-0-postmortem
- [Nx / GitHub Advisory] *Compromised Nx Console version 18.95.0* — `GHSA-c9j4-9m59-847w` — https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w
- [The Hacker News] *GitHub Internal Repositories Breached via Malicious Nx Console VS Code Extension* (2026-05) — https://thehackernews.com/2026/05/github-internal-repositories-breached.html
- [The Hacker News] *Compromised Nx Console 18.95.0 Targeted VS Code Developers with Credential Stealer* (2026-05) — https://thehackernews.com/2026/05/compromised-nx-console-18950-targeted.html
- [StepSecurity] *Nx Console VS Code Extension Compromised* (2026-05) — https://www.stepsecurity.io/blog/nx-console-vs-code-extension-compromised
- [BleepingComputer] *GitHub confirms breach of 3,800 repos via malicious VSCode extension* (2026-05) — https://www.bleepingcomputer.com/news/security/github-confirms-breach-of-3-800-repos-via-malicious-vscode-extension/
- [VentureBeat] *GitHub confirms 3,800 internal repos stolen through poisoned VS Code extension as supply chain worm hits Microsoft's Python SDK* (2026-05) — https://venturebeat.com/security/github-confirms-3800-repos-stolen-poisoned-vs-code-extension-supply-chain-worm-microsoft-python-sdk
- [Help Net Security] *TeamPCP breached GitHub's internal codebase via poisoned VS Code extension* (2026-05-20) — https://www.helpnetsecurity.com/2026/05/20/github-breached-teampcp/
- [Infosecurity Magazine] *GitHub Breach Traced to Malicious 'Nx Console' VS Code Extension* (2026-05) — https://www.infosecurity-magazine.com/news/github-breach-nx-console-vs-code/
- [Cybersecurity News] *Nx Console VS Code Extension Compromised to Steal Developer and Cloud Secrets* (2026-05) — https://cybersecuritynews.com/nx-console-vs-code-extension-compromised/
- [iTnews] *Mini Shai-Hulud worm injects disk wiper into Microsoft Azure PyPI package* (2026-05) — https://www.itnews.com.au/news/mini-shai-hulud-worm-injects-disk-wiper-into-microsoft-azure-pypi-package-625988
