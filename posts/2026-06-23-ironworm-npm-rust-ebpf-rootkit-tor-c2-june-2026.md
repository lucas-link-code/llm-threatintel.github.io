# IronWorm: Rust-Built npm Supply Chain Worm with eBPF Rootkit, Tor C2, and AI Credential Harvesting Across 37 Packages

**Date:** 2026-06-23
**Tags:** supply-chain, malicious-tool

## Executive Summary

A new supply-chain attack has infected 36-37 packages on the Node Package Manager (npm) index with infostealer malware called IronWorm. IronWorm is written in Rust, hides behind an eBPF kernel rootkit, and communicates with the operator over the Tor network. The malware targets 86 environment variables and 20 credential files that may contain OpenAI, AWS, Anthropic, and npm credentials, vault configuration files, SSH keys, and Exodus cryptocurrency wallet files.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | IronWorm |
| Attribution | Unknown; possibly TeamPCP evolution (confidence: medium) |
| Target | Software developers; crypto/Web3 ecosystem focus |
| Vector | Malicious npm package installation via preinstall hooks |
| Status | active |
| First Observed | 2026-06-03 |

## Detailed Findings

The attack started from a compromised account named 'asteroiddao,' which published package versions containing the Rust ELF binary executed via 'preinstall,' pushing malicious commits into repositories. The commit author appears as "claude," and the timestamps point to several years ago, up to 13 years in some cases, even though they were pushed in the past few days. IronWorm ships as a 976 KB Rust ELF binary executed via a preinstall hook, packs a custom-modified UPX stub to defeat signature-based unpackers, encrypts every internal string with a unique per-call-site key, and carries an embedded eBPF kernel-level rootkit to hide its own processes, sockets, and anti-debugging tripwires from defenders. The Rust-based malware self-propagates by using stolen credentials for publishing on npm; this includes secrets associated with npm's Trusted Publishing workflow. Once it compromises a developer or CI environment, it can publish trojanized versions of packages owned by the victim, which then infect additional developers and CI systems. The implant sweeps 86 environment variables and over 20 credential file paths covering AWS, GCP, Azure, Vault, Kubernetes, npm, Docker, GitHub, and the entire 2026 generation of AI provider keys (Anthropic, OpenAI, Gemini, Cohere, Mistral, Groq, Perplexity, xAI). Despite the affected packages garnering a combined total of 32,177 monthly downloads, the threat was mitigated before the infection could spread to more popular packages.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromised npm packages with malicious preinstall hooks |
| Credential Dumping | T1110.001 | Extraction of 86 environment variables and 20+ credential files from developer machines |
| Persistence via Rootkit | T1547.014 | eBPF kernel rootkit hides malware processes and network activity from detection |
| Command and Control via Tor | T1071.001 | Tor-based C2 communication channel |

## IOCs

### Domains

_JFrog Security provided detailed IOC list; packages deprecated and removed within 24 hours of publication. No CVE assigned during active exploitation._

### Full URL Paths

_JFrog Security provided detailed IOC list; packages deprecated and removed within 24 hours of publication. No CVE assigned during active exploitation._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'asteroiddao compromise - 36-37 npm packages', 'registry': 'npm', 'note': "Specific affected package list available in JFrog and OX Security reports; packages included deposits from 'asteroiddao' account with malicious preinstall hooks"}
```

### Affected Platforms

```
npm registry
JavaScript/Node.js development environments
CI/CD pipelines
```

## Detection Recommendations

Monitor npm preinstall hooks and postinstall scripts for binary execution; audit GitHub commit metadata for backdated changes and suspicious 'claude' author names; scan for eBPF rootkit signatures and Tor egress traffic; review environment variable exports and credential file access patterns in CI/CD logs; enable MFA and token rotation for npm publishing; implement supply chain scanning that detects Rust binaries in preinstall hooks and custom UPX stubs.

## References

- [JFrog Security] IronWorm Supply Chain Attack: Rust Malware with eBPF Rootkit and Tor C2 (2026-06-04) — https://www.bleepingcomputer.com/news/security/new-ironworm-malware-hits-36-packages-in-npm-supply-chain-attack/
- [OX Security] IronWorm Supply Chain Malware Hits npm (2026-06-03) — https://www.ox.security/blog/ironworm-supply-chain-malware-hits-npm/
- [Dark Reading] Rust-Written IronWorm Hits NPM Supply Chain (2026-06-04) — https://www.darkreading.com/cyberattacks-data-breaches/rust-written-ironworm-npm-supply-chain
- [Phoenix Security] IronWorm (No CVE): Rust-Built npm Worm Ships an eBPF Rootkit, Tor C2, and a Self-Propagating Supply Chain Implant (2026-06-04) — https://phoenix.security/ironworm-npm-supply-chain-worm-rust-ebpf-rootkit-tor/
