# Mini Shai-Hulud Third Wave: TeamPCP Hijacks `atool` npm Maintainer Account, Publishes 639 Malicious Versions Across 323 Packages in 30 Minutes — @antv Ecosystem and `echarts-for-react` (1.1M Weekly Downloads) Among Victims

**Date:** 2026-05-21
**Tags:** supply-chain, malware

## Executive Summary

On 2026-05-19, the Mini Shai-Hulud campaign (attributed to TeamPCP) compromised the npm maintainer account `atool` and used it to publish 639 malicious package versions across 323 unique packages in a roughly 30-minute automated burst, with 558 of those versions across 279 packages in the @antv data-visualisation ecosystem (`@antv/g2`, `@antv/g6`, `@antv/x6`, `@antv/l7`, `@antv/s2`, `@antv/f2`, `@antv/g`, `@antv/g2plot`, `@antv/graphin`, `@antv/data-set`, and others) and additional victims including `echarts-for-react` (~1.1M weekly downloads), `timeago.js`, `size-sensor`, and `canvas-nest.js`. The 498 KB obfuscated Bun-runtime stealer payload is byte-equivalent to the toolkit used in the 2026-05-01 SAP CAP / Claude Code SessionStart wave and harvests more than 20 credential classes — AWS, GCP, Azure, GitHub, npm, SSH, Kubernetes, HashiCorp Vault, Stripe, database connection strings — before attempting a Docker container escape via the host socket and exfiltrating to `t.m-kosche.com:443` disguised as OpenTelemetry trace data and to the Session P2P network. Microsoft Threat Intelligence published a dedicated advisory on 2026-05-20; Socket, Snyk, StepSecurity, safedep, Mend, Akamai, and BleepingComputer all confirmed the wave the same day. Total Mini Shai-Hulud footprint now stands at 1,055 malicious versions across 502 unique packages since the campaign began in May 2026.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud (3rd documented wave) — `@antv` / `atool` compromise |
| Actor / Attribution | TeamPCP (Mini Shai-Hulud operators) — high confidence based on payload byte-equivalence to prior waves (SAP CAP 2026-05-01, TanStack/Mistral 2026-05-11) |
| Target | Developers and CI/CD pipelines consuming the affected npm packages; payload broadens to any cloud workload reachable from the build environment |
| Vector | Compromise of npm maintainer account `atool` ([email protected]); automated mass-publish of trojanised versions |
| Status | Active — npm took down most compromised versions during the day of 2026-05-19; users on `latest` or unpinned ranges remain exposed until lockfile refresh |
| First Observed | 2026-05-19 (compromise and publish burst); reported 2026-05-19 by Socket, 2026-05-20 by Microsoft Threat Intelligence |

## Detailed Findings

### Account hijack and publish burst

According to Socket's *Mini Shai-Hulud Hits @antv Ecosystem, 639 Compromised npm Packages*, the attacker gained control of the npm publishing account `atool` (registered to `[email protected]`) on 2026-05-19 and proceeded to publish 639 malicious versions across 323 unique packages in a roughly 30-minute automated burst. Microsoft's *Mini Shai Hulud: Compromised @antv npm packages enable CI/CD credential theft* (2026-05-20) confirms the publish-burst timing and characterises it as the largest single-account Mini Shai-Hulud wave observed to date. Neither Socket nor Microsoft has yet disclosed the initial access method to the maintainer account; reporting from Snyk and Mend speculates phishing of the npm 2FA backup codes or theft of a long-lived publishing token, but neither vendor has primary evidence at time of writing.

### Affected packages

The @antv namespace dominates the victim list: Snyk and StepSecurity both enumerate the trojanised set as including (non-exhaustively) `@antv/g`, `@antv/g2`, `@antv/g2plot`, `@antv/g6`, `@antv/x6`, `@antv/l7`, `@antv/s2`, `@antv/f2`, `@antv/graphin`, and `@antv/data-set`. Outside the namespace, the most widely-installed victims include `echarts-for-react` (~1.1M weekly downloads, a React wrapper around Apache ECharts), `timeago.js`, `size-sensor`, and `canvas-nest.js`. Total package-week download exposure is in the tens of millions across the affected set.

### Payload — byte-equivalent to prior Mini Shai-Hulud waves

Socket's reverse-engineering finds a 498 KB obfuscated Bun-runtime payload that matches the binary used in the 2026-05-01 SAP CAP / Claude Code SessionStart persistence wave (already tracked on this site under `mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence`). The payload harvests more than 20 credential classes from a compromised host:

- **Cloud:** AWS credentials (`~/.aws/credentials`, instance metadata service), Google Cloud credentials (ADC, gcloud config), Azure credentials (`~/.azure/`, environment), CI provider OIDC tokens
- **Developer tooling:** GitHub PATs (`~/.config/gh/`, `git config`), npm tokens (`~/.npmrc`), SSH private keys (`~/.ssh/id_*`, agent-forwarded sockets)
- **Orchestration:** Kubernetes kubeconfig (`~/.kube/config`, service account tokens at `/var/run/secrets/kubernetes.io/serviceaccount/`), HashiCorp Vault tokens
- **Payment / data:** Stripe API keys (environment and common config files), database connection strings (`DATABASE_URL`, `.env`)
- **Container escape:** Attempts `docker -v /:/host` style escape via the Docker host socket when one is reachable from inside a build container — see Akamai's analysis of the escape attempt sequence

Configuration values inside the payload (the C2 endpoint, exfiltration paths, and the list of environment variable names to harvest) are encrypted using PBKDF2-SHA256 at 200,000 iterations with a 32-byte output, fed into a custom three-round substitution cipher built on Fisher-Yates-shuffled permutation tables. Snyk notes that the obfuscation slows static analysis but does not defeat dynamic instrumentation; the payload's behaviour is fully recoverable at runtime via Bun process tracing.

### Exfiltration channels

The collected credential bundle is serialised, compressed, encrypted, and exfiltrated through two channels:

1. **Primary — disguised OpenTelemetry trace pipeline.** HTTPS POST to `t.m-kosche.com:443/api/public/otel/v1/traces` carrying the encrypted bundle inside what looks like a Jaeger/OTLP trace payload. The endpoint path mimics a legitimate observability backend so that network monitoring tools that grant outbound access to telemetry endpoints will not flag the traffic.

2. **Secondary — Session P2P network.** Upload to `filev2.getsession.org/file/` via the Session decentralised messaging network's file storage feature. Session is a legitimate privacy-focused messenger; abuse of its file-storage subsystem provides a fallback channel that bypasses domain-based egress controls because the destination is shared with legitimate Session traffic. Defenders should detect this abuse via Session-protocol traffic from developer/CI workstations that normally do not run Session, not by blocklisting `getsession.org`, which would block legitimate Session users.

### Connection to prior Mini Shai-Hulud waves

Microsoft's advisory and Socket's analysis both confirm payload byte-equivalence with the 2026-05-01 SAP CAP / Claude Code SessionStart wave and the 2026-05-11 TanStack / Mistral AI / Telnyx wave. The C2 endpoint `t.m-kosche.com` is consistent with the C2 used in the TanStack/Mistral wave per the 2026-05-16 post on this site. Total Mini Shai-Hulud footprint since the campaign began is now 1,055 malicious versions across 502 unique packages per Socket's running tally. TeamPCP attribution rests on payload byte-equivalence, identical PBKDF2/Fisher-Yates obfuscation, and reuse of `t.m-kosche.com` infrastructure across all three waves.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Initial Access — Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.002 | Trojanised @antv and related npm packages published via hijacked maintainer account `atool` |
| Initial Access — Valid Accounts: Cloud Accounts | T1078.004 | Compromise of npm publishing account credentials (mechanism not publicly disclosed) |
| Execution — Command and Scripting Interpreter: JavaScript | T1059.007 | Bun-runtime obfuscated stealer executed on package install |
| Defense Evasion — Obfuscated Files or Information | T1027 | PBKDF2-SHA256 + Fisher-Yates substitution cipher for embedded config; mimics legitimate OTLP traces |
| Credential Access — Unsecured Credentials: Credentials In Files | T1552.001 | `~/.aws/`, `~/.config/gh/`, `~/.npmrc`, `~/.ssh/`, `~/.kube/config`, `~/.azure/`, `~/.docker/` |
| Credential Access — Unsecured Credentials: Cloud Instance Metadata API | T1552.005 | AWS IMDS / GCP metadata service queried when running in cloud build environments |
| Privilege Escalation — Escape to Host | T1611 | Docker host socket escape attempt when reachable inside a container |
| Exfiltration — Exfiltration Over Web Service | T1567.002 | Disguised OpenTelemetry POST to `t.m-kosche.com:443/api/public/otel/v1/traces`; Session P2P file storage as fallback |

## IOCs

### Domains

```
m-kosche.com
t.m-kosche.com
```

### Full URL Paths

```
t.m-kosche.com:443/api/public/otel/v1/traces
```

*Defender note: the secondary exfiltration channel uses `filev2.getsession.org/file/`, which is the legitimate Session P2P messenger's file storage subsystem. The Session domain is shared with legitimate users of the messenger and is not published as a standalone IOC here. Detect the abuse via Session-protocol traffic from hosts (developer workstations, CI runners) that have no legitimate reason to run Session, not by blocking `getsession.org` at the proxy.*

### Splunk Format

```
"m-kosche.com" OR "t.m-kosche.com" OR "t.m-kosche.com:443/api/public/otel/v1/traces"
```

### File Hashes

```
No hash IOCs published by source (498 KB obfuscated Bun payload; SHA-256 not yet released by Socket or Microsoft at time of publication)
```

## Detection Recommendations

**Inventory and remediation:**
- Run `npm audit` against every project lockfile produced or refreshed since 2026-05-19; cross-reference installed `@antv/*`, `echarts-for-react`, `timeago.js`, `size-sensor`, and `canvas-nest.js` versions against Socket's published bad-version list. Pin to known-good versions predating 2026-05-19 and refresh lockfiles.
- Treat any CI pipeline that consumed a fresh lockfile or ran `npm install` / `pnpm install` between 2026-05-19 (publish burst) and the package takedowns later that day as potentially compromised. Rotate every credential class listed in *Detailed Findings* that the pipeline had access to (cloud, GitHub PAT, npm token, kubeconfig, Vault, Stripe, DB strings).

**Network telemetry (proxy / firewall / EDR netconn):**
- Alert on any outbound HTTPS to `t.m-kosche.com` or its subdomains. The path `:443/api/public/otel/v1/traces` looks like OpenTelemetry; teams using OTLP egress should validate every OTLP destination against their known-good observability backends.
- Alert on Session-protocol traffic from developer workstations or CI runners that do not normally run the Session messenger. Do not blocklist `getsession.org` at the proxy — that hurts legitimate Session users without stopping the abuse.

**Endpoint (EDR process telemetry):**
- Correlate `node`, `bun`, or `npm` postinstall scripts spawning a child that reads from `~/.aws/`, `~/.config/gh/`, `~/.npmrc`, `~/.ssh/`, `~/.kube/`, `~/.azure/`, or `/var/run/secrets/kubernetes.io/serviceaccount/` within seconds of a package install. This file-access pattern is unusual for build steps.
- In containerised CI, alert on a `node` or `bun` child process accessing `/var/run/docker.sock` from within a build container — almost always indicates an escape attempt.

**npm pipeline hardening (campaign-level, not just this wave):**
- Enforce npm 2FA + provenance attestation on every maintainer account in the dependency graph you control, and prefer published packages that ship provenance attestations from a trusted CI provider over unsigned ones. Mini Shai-Hulud's three documented waves have all started from a single maintainer account compromise; provenance closes the simplest pivot.
- Move CI from long-lived npm tokens to short-lived OIDC-issued tokens where the registry supports it.

## References

- [Socket] *Mini Shai-Hulud Hits @antv Ecosystem, 639 Compromised npm Packages* (2026-05-19) — https://socket.dev/blog/antv-packages-compromised
- [Microsoft Threat Intelligence] *Mini Shai Hulud: Compromised @antv npm packages enable CI/CD credential theft* (2026-05-20) — https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/
- [Snyk] *Mini Shai-Hulud Hits AntV: 300+ Malicious npm Packages Published via Compromised Maintainer Account* (2026-05-20) — https://snyk.io/blog/mini-shai-hulud-antv-npm-supply-chain-attack/
- [StepSecurity] *Shai-Hulud: Here We Go Again. Mass npm Supply Chain Attack Hits the AntV Ecosystem* (2026-05-20) — https://www.stepsecurity.io/blog/shai-hulud-here-we-go-again-mass-npm-supply-chain-attack-hits-the-antv-ecosystem
- [safedep] *Mini Shai-Hulud Strikes Again: 317 npm Packages Compromised* (2026-05-20) — https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised/
- [Mend] *Mini Shai-Hulud Hits @antv: 323 npm Packages Compromised* (2026-05-20) — https://www.mend.io/blog/mini-shai-hulud-antv-atool-npm-supply-chain-attack/
- [Akamai] *Mini Shai-Hulud: The Worm Returns and Goes Public* (2026-05-20) — https://www.akamai.com/blog/security-research/mini-shai-hulud-worm-returns-goes-public
- [BleepingComputer] *New Shai-Hulud malware wave compromises 600 npm packages* (2026-05-20) — https://www.bleepingcomputer.com/news/security/new-shai-hulud-malware-wave-compromises-600-npm-packages/
- [The Hacker News] *Mini Shai-Hulud Pushes Malicious AntV npm Packages via Compromised Maintainer Account* (2026-05-20) — https://thehackernews.com/2026/05/mini-shai-hulud-pushes-malicious-antv.html
- [Infosecurity Magazine] *Mini Shai-Hulud Hits Hundreds of npm Packages in AntV Ecosystem* (2026-05-20) — https://www.infosecurity-magazine.com/news/antv-npm-mini-shai-hulud-largest/
