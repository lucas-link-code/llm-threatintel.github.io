# TanStack & Mistral GitHub Actions Pwn Request Supply Chain Attack: 170+ Packages Compromised via Cache Poisoning & OIDC Token Extraction

**Date:** 2026-05-24
**Tags:** supply-chain, malware

## Executive Summary

On 2026-05-11 between 19:20 and 19:26 UTC, an attacker published 84 malicious versions across 42 @tanstack/* npm packages by combining: the pull_request_target "Pwn Request" pattern, GitHub Actions cache poisoning across the fork↔base trust boundary, and runtime memory extraction of an OIDC token from the GitHub Actions runner process. A coordinated supply chain attack on May 11, 2026 compromised over 170 npm packages and 2 PyPI packages, totaling 404 malicious versions. The attacker hit the entire TanStack router ecosystem (42 packages), Mistral AI's SDK suite (on both npm and PyPI), UiPath's automation tooling (65 packages), OpenSearch (1.3M weekly npm downloads), and Guardrails AI (PyPI). The packages passed SLSA provenance checks, carried valid signed certificates, and looked 100% legitimate to every security tool checking cryptographic proof of origin.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud Wave 2 / TanStack Attack |
| Attribution | TeamPCP (confidence: high) |
| Target | Open-source npm and PyPI ecosystems; downstream consumers including Mistral AI, UiPath, OpenSearch, Guardrails AI |
| Vector | GitHub Actions Pwn Request pattern + Actions cache poisoning + OIDC token extraction from runner memory |
| Status | active |
| First Observed | 2026-05-11 |

## Detailed Findings

The TanStack compromise exploited a chain of three vulnerabilities in GitHub Actions. The attacker created a fork of the TanStack/router repository (renamed to zblgg/configuration to evade fork-list searches), then opened a pull request that triggered a pull_request_target workflow. This workflow checked out and executed the attacker's fork code, which poisoned the GitHub Actions cache with a malicious pnpm store. When legitimate maintainer PRs were later merged to main, the release workflow restored the poisoned cache. Attacker-controlled binaries then extracted OIDC tokens directly from the GitHub Actions runner's process memory (/proc/<pid>/mem). The attacker was able to use these tokens to publish the malicious package versions without ever stealing npm credentials. If one of these packages was installed on your machine, there is a script running right now that polls your GitHub token every 60 seconds. The moment you revoke that token, the way every security playbook says to it runs rm -rf ~/. Your entire home directory is gone. The incident is attributed by StepSecurity to the threat group known as TeamPCP, and it is also the first documented case of a malicious npm package carrying valid SLSA provenance.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious code injected into widely-used open-source packages via GitHub Actions workflow hijacking |
| Obtain Capabilities - Malware | T1588.001 | Credential harvesting worm with self-propagation and persistence mechanisms |
| Lateral Tool Transfer | T1570 | Malicious payloads self-propagate through npm registry to secondary targets via stolen credentials |

## IOCs

### Domains

```
git-tanstack.com
getsession.org
```

### Full URL Paths

```
filev2.getsession.org
seed1.getsession.org
seed2.getsession.org
seed3.getsession.org
```

### Splunk Format

```
"git-tanstack.com" OR "getsession.org" OR "filev2.getsession.org" OR "seed1.getsession.org" OR "seed2.getsession.org" OR "seed3.getsession.org"
```

### Package Indicators

```
@tanstack/react-router@1.169.5,1.169.8
@tanstack/vue-router@1.169.5,1.169.8
@tanstack/solid-router@1.169.5,1.169.8
@tanstack/start@1.169.5,1.169.8
@mistralai/*@2.4.6
@uipath/*
@squawk/*
guardrails-ai@0.10.1
mistralai@2.4.6
opensearch-project/opensearch
```

## Detection Recommendations

Monitor GitHub Actions runners for memory access patterns suspicious to /proc/*/mem. Audit all PR-triggered workflows for pull_request_target + untrusted checkout combinations using static analyzers like zizmor. Block git-tanstack.com at DNS/proxy level. Search lockfiles and CI logs for affected @tanstack/*, @mistralai/*, @uipath/*, @squawk/*, guardrails-ai, and opensearch-project versions published on May 11, 2026. Check for gh-token-monitor daemon persistence (~/.config/systemd/user/gh-token-monitor.service on Linux; ~/Library/LaunchAgents/com.user.gh-token-monitor.plist on macOS). If exposed, treat host as fully compromised and rotate all credentials before token revocation to prevent wiper trigger (rm -rf ~/).

## References

- [TanStack] Postmortem: TanStack npm supply-chain compromise (2026-05-12) — https://tanstack.com/blog/npm-supply-chain-compromise-postmortem
- [Snyk] TanStack npm Packages Hit by Mini Shai-Hulud (2026-05-12) — https://snyk.io/blog/tanstack-npm-packages-compromised/
- [Palo Alto Networks Unit 42] The npm Threat Landscape: Attack Surface and Mitigations (Updated May 21) (2026-05-21) — https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/
- [Wiz] Mini Shai-Hulud Strikes Again: TanStack + more npm Packages Compromised (2026-05-12) — https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised
- [Orca Security] TanStack and 160+ npm/PyPI Packages Compromised in Supply Chain Worm Attack (2026-05-12) — https://orca.security/resources/blog/tanstack-npm-supply-chain-worm/
- [SafeDep] Mass Supply Chain Attack Hits TanStack, Mistral AI npm and PyPI Packages (2026-05-12) — https://safedep.io/mass-npm-supply-chain-attack-tanstack-mistral/
