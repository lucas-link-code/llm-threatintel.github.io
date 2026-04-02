# TeamPCP CanisterWorm Evolves: Kubernetes Wiper Deployed Against Iranian Systems via npm Supply Chain

**Date:** 2026-04-02
**TLP:** TLP:CLEAR
**Tags:** supply-chain, wiper, kubernetes, npm, cloud-infrastructure

## Executive Summary

TeamPCP deployed a geopolitically targeted destructive wiper payload via its CanisterWorm npm supply chain campaign, first observed on March 20, 2026, that wipes entire Kubernetes clusters when it detects systems configured for Iran (Asia/Tehran timezone or fa_IR locale). On non-Iranian Kubernetes nodes the same malware installs a persistent backdoor; on non-Kubernetes Iranian hosts it executes rm -rf / --no-preserve-root. Organizations running Kubernetes with npm-sourced packages in CI/CD pipelines are at risk of full cluster destruction; defenders must immediately audit npm lockfiles for CanisterWorm-linked packages and inspect Kubernetes for DaemonSets named 'host-provisioner-std' or services named 'pgmon' or 'pgmonitor'.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | CanisterWorm / TeamPCP Kubernetes Wiper |
| Attribution | TeamPCP (confidence: high) |
| Target | Kubernetes clusters globally; destructive payload specifically targets Iranian-timezone systems; backdoor installed on all other victims |
| Vector | npm supply chain compromise via stolen maintainer credentials (from prior Trivy/Aqua Security breach); malicious code seeded into 45+ npm packages |
| Status | active |
| First Observed | 2026-03-20 |

## Detailed Findings

According to Aikido Security, BleepingComputer, and KrebsOnSecurity, the CanisterWorm campaign was first observed on March 20, 2026 at 20:45 UTC. TeamPCP leveraged credentials stolen during its earlier compromise of Aqua Security's Trivy vulnerability scanner to hijack npm maintainer accounts and seed malicious code into more than 45 npm packages. The malware propagates by stealing SSH keys and npm authentication tokens from infected environments, then uses those tokens to publish infected updates to additional packages, creating a self-propagating worm.

Aikido's Charlie Eriksen published analysis revealing that a new payload variant, first detected on March 22-23, 2026, introduced a geopolitically targeted destructive component. The script performs environment fingerprinting: if it detects a Kubernetes cluster in Iran (Asia/Tehran timezone), it deploys a privileged DaemonSet named 'kamikaze' that executes across all nodes — including control-plane nodes — wiping data and forcing a reboot. On non-Iranian Kubernetes nodes, the same DaemonSet installs the CanisterWorm backdoor as a systemd service. On Iranian hosts lacking Kubernetes, the payload attempts rm -rf / --no-preserve-root directly.

According to Unit 42's analysis (origin-unit42.paloaltonetworks.com), the campaign may have exfiltrated over 300 GB of data and 500,000 credentials including cloud tokens and Kubernetes secrets. The total scope spans five stages: Trivy/Aqua Security GitHub Actions (March 19), CanisterWorm npm worm (March 20+), Checkmarx KICS/AST GitHub Actions, LiteLLM PyPI (March 24), and Telnyx PyPI (March 27).

A technically novel aspect documented by Aikido and Phoenix Security is that CanisterWorm uses an Internet Computer Protocol (ICP) blockchain canister (tdtqy-oyaaa-aaaae-af2dq-cai.raw.icp0.io) as its C2 dead-drop, making conventional domain takedown impossible. The backdoor polls this ICP canister every 50 minutes for a binary URL to download and execute. A YouTube 'Rick Roll' link serves as a kill switch when the canister is not serving active payloads.

The Hacker News and BleepingComputer confirmed the attack was tracked as CVE-2026-33634 (CVSS 9.4) for the Trivy component. Unit 42 noted TeamPCP has announced partnerships with the CipherForce and Vect ransomware groups on BreachForums, suggesting the supply chain operations function as a dedicated access-brokering service for downstream ransomware deployment.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | TeamPCP injected malicious payloads into npm packages by hijacking maintainer credentials obtained from the prior Trivy/Aqua Security breach. |
| Data Destruction | T1485 | The Kamikaze wiper deploys privileged DaemonSets to delete all files on every node in Iranian-timezone Kubernetes clusters, followed by forced reboot. |
| Create or Modify System Process: Systemd Service | T1543.002 | CanisterWorm installs a persistent systemd service named 'pgmonitor' (masquerading as a PostgreSQL monitor) on non-Iranian Linux hosts. |
| Command and Control: Web Service | T1102 | ICP blockchain canister (tdtqy-oyaaa-aaaae-af2dq-cai.raw.icp0.io) used as a tamper-proof C2 dead-drop to deliver binary payload URLs, bypassing conventional domain takedown. |
| Lateral Movement via SSH | T1021.004 | CanisterWorm parses authentication logs for valid credentials and uses stolen SSH private keys to propagate laterally across the subnet. |
| Unsecured Credentials: Private Keys | T1552.004 | The worm harvests SSH keys, cloud access tokens, Kubernetes configs, and CI/CD secrets from compromised CI runner environments. |

## IOCs

### Domains

```
tdtqy-oyaaa-aaaae-af2dq-cai.raw.icp0.io
```

### Full URL Paths

_ICP canister domain sourced from Aikido Security blog (https://www.aikido.dev/blog/teampcp-stage-payload-canisterworm-iran) and confirmed by BleepingComputer (https://www.bleepingcomputer.com/news/security/teampcp-deploys-iran-targeted-wiper-in-kubernetes-attacks/). No additional package-level IOCs published beyond those already tracked (npm:axios@1.14.1, npm:axios@0.30.4, npm:plain-crypto-js@4.2.1, pypi:litellm@1.82.7, pypi:litellm@1.82.8, pypi:telnyx@4.87.1, pypi:telnyx@4.87.2). Port indicators: outbound SSH with StrictHostKeyChecking=no; Docker API probes on port 2375._

### Splunk Format

```
"tdtqy-oyaaa-aaaae-af2dq-cai.raw.icp0.io"
```

## Detection Recommendations

1. Kubernetes audit: Search for DaemonSets named 'host-provisioner-std' or 'kamikaze', and systemd services named 'pgmon' or 'pgmonitor' (kubectl get daemonsets --all-namespaces; systemctl list-units | grep pgmon). 2. Network: Alert on outbound SSH connections with StrictHostKeyChecking=no from CI runners; alert on TCP/2375 (Docker API) probes originating from container workloads. 3. ICP C2: Block DNS resolution of *.icp0.io at the perimeter or flag outbound HTTPS to tdtqy-oyaaa-aaaae-af2dq-cai.raw.icp0.io in proxy logs (cs-host field). 4. npm: Audit package-lock.json and yarn.lock for any of the 45+ compromised packages from the March 20-31 window; cross-reference against Aikido Intel malware feed. 5. GitHub Actions: Pin all action references to full commit SHA rather than mutable tags; alert on forced tag pushes to security tool repositories (aquasecurity/*, checkmarx/*).

## References

- [Aikido Security] CanisterWorm Gets Teeth: TeamPCP's Kubernetes Wiper Targets Iran (2026-03-22) — https://www.aikido.dev/blog/teampcp-stage-payload-canisterworm-iran
- [BleepingComputer] TeamPCP deploys Iran-targeted wiper in Kubernetes attacks (2026-03-23) — https://www.bleepingcomputer.com/news/security/teampcp-deploys-iran-targeted-wiper-in-kubernetes-attacks/
- [KrebsOnSecurity] 'CanisterWorm' Springs Wiper Attack Targeting Iran (2026-03-23) — https://krebsonsecurity.com/2026/03/canisterworm-springs-wiper-attack-targeting-iran/
- [Unit 42 / Palo Alto Networks] Weaponizing the Protectors: TeamPCP's Multi-Stage Supply Chain Attack on Security Infrastructure (2026-03-27) — https://origin-unit42.paloaltonetworks.com/teampcp-supply-chain-attacks/
- [The Hacker News] Trivy Hack Spreads Infostealer via Docker, Triggers Worm and Kubernetes Wiper (2026-03-25) — https://thehackernews.com/2026/03/trivy-hack-spreads-infostealer-via.html
- [Phoenix Security] TeamPCP Supply Chain Attack: Trivy to Checkmarx to npm (2026) (2026-03-30) — https://phoenix.security/teampcp-supply-chain-attack-trivy-checkmarx-github-actions-npm-canisterworm/
