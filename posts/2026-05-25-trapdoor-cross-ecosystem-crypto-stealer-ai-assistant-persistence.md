# TrapDoor Supply Chain Attack Spans npm, PyPI, and Crates.io — Weaponizes AI Coding Assistant Config Files for Persistence and Credential Theft

**Date:** 2026-05-25
**Tags:** supply-chain, malware

## Executive Summary

Socket researchers identified an active cross-ecosystem supply chain campaign called TrapDoor that has published 34+ malicious packages and 384+ versions across npm, PyPI, and Crates.io since May 22, 2026, targeting developers in crypto, DeFi, Solana, and AI communities. The campaign steals crypto wallets, SSH keys, AWS and GitHub tokens, browser data, and environment variables, and plants persistence through `.cursorrules` and `CLAUDE.md` files that inject hidden instructions into AI coding assistants like Cursor and Claude Code, causing future AI sessions to silently execute credential exfiltration routines.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TrapDoor |
| Actor / Attribution | Unknown |
| Target | Developers in crypto, DeFi, Solana, AI, and Move/Sui blockchain ecosystems |
| Vector | Malicious packages across npm, PyPI, and Crates.io masquerading as developer tools |
| Status | active |
| First Observed | 2026-05-22 |

## Detailed Findings

According to Socket, the TrapDoor campaign was first observed on May 22, 2026 at 20:20:18 UTC with the upload of the PyPI package `eth-security-auditor@0.1.0`. Packages were then published in waves across three registries by multiple accounts. Socket reports that the campaign spans 21 npm packages, 7 PyPI packages, and 6 Crates.io packages, with package names designed to appear as legitimate blockchain development tools, security auditors, and AI workflow utilities.

### npm Attack Chain

Socket's analysis found that npm packages trigger a shared 1,149-line credential harvester called `trap-core.js` via `postinstall` hooks on installation. According to Socket, the payload scans for credentials, validates stolen AWS and GitHub tokens through live API calls, attempts SSH-based lateral movement to other machines on the network, and establishes persistence through multiple mechanisms including `.cursorrules`, `CLAUDE.md`, Git hooks, shell hooks, systemd services, cron jobs, and SSH authorized_keys modification.

### PyPI Attack Chain

PyPI packages auto-execute on import and download JavaScript from an attacker-controlled GitHub Pages domain, running it via `node -e`. According to Socket, this approach lets the attacker update malware behavior remotely without publishing a new package version.

### Crates.io Attack Chain

The Crates.io component targets Sui and Move blockchain developers specifically. According to Socket, malicious `build.rs` scripts execute automatically during Rust compilation, search for local crypto wallet keystores, XOR-encrypt them using the hardcoded key `cargo-build-helper-2026`, and exfiltrate them to GitHub Gists.

### AI Coding Assistant Weaponization

According to Socket CTO Ahmad Nassri, the most unusual feature is TrapDoor's use of AI-targeted injection. The npm payload writes `.cursorrules` and `CLAUDE.md` files containing hidden instructions embedded with zero-width Unicode characters. These configuration files are read by AI coding assistants such as Cursor and Claude Code to understand project context. The injected instructions trick the AI assistant into executing "security scans" that silently exfiltrate developer secrets during future coding sessions.

CyberPress reported that the attacker also submitted pull requests to legitimate repositories attempting to inject malicious `.cursorrules` or `CLAUDE.md` files under innocuous titles like "docs: add .cursorrules with dev standards and build verification."

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.002 | Malicious packages published to npm, PyPI, Crates.io |
| Command and Scripting Interpreter: JavaScript | T1059.007 | trap-core.js credential harvester executed via postinstall hooks |
| Credentials from Password Stores | T1555 | Browser credential and crypto wallet keystore extraction |
| Boot or Logon Autostart Execution | T1547 | Persistence via systemd services and cron jobs |
| Lateral Movement: Remote Services: SSH | T1021.004 | SSH-based lateral movement using stolen keys |
| Unsecured Credentials: Credentials In Files | T1552.001 | Environment variable and .env file harvesting |
| Data Encoding: Standard Encoding | T1132.001 | Zero-width Unicode characters hide instructions in config files |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

### Malicious Packages

```
npm: trap-core.js (shared payload across npm packages)
PyPI: eth-security-auditor@0.1.0
PyPI: cryptowallet-safety
Crates.io: move-analyzer-build
Crates.io: move-compiler-tools
Crates.io: move-project-builder
Crates.io: sui-framework-helpers
Crates.io: sui-move-build-helper
Crates.io: sui-sdk-build-utils
```

## Detection Recommendations

Search developer workstations and CI/CD environments for unexpected `.cursorrules` and `CLAUDE.md` files, particularly any containing zero-width Unicode characters. Use `cat -A` or hex editors to detect hidden content in these files. Monitor for unexpected `postinstall` script execution in npm packages. Alert on `build.rs` scripts in Rust projects that make network connections or access keystore directories. Search for `trap-core.js` filenames or references across project directories. Monitor for outbound connections to GitHub Gists API from build environments, which may indicate Crates.io payload exfiltration. Audit open pull requests for additions of `.cursorrules` or `CLAUDE.md` files from unfamiliar contributors. Rotate any potentially exposed AWS keys, GitHub tokens, SSH keys, and crypto wallet credentials. EDR: alert on processes spawned by `node`, `python`, or `cargo` that access `~/.ssh`, browser credential stores, or crypto wallet directories during package installation.

## References

- [Socket] TrapDoor Crypto Stealer Supply Chain Attack Hits 34 Packages and Hundreds of Versions Across npm, PyPI, and Crates.io (2026-05-22) — https://socket.dev/blog/trapdoor-crypto-stealer-npm-pypi-crates
- [CyberPress] Supply Chain Attack Compromises 34 Packages Across npm, PyPI, Crates (2026-05-24) — https://cyberpress.org/supply-chain-attack-compromises-34-packages/
- [GBHackers] Hackers Compromise 34 npm, PyPI, and Crates Packages in Major Supply Chain Attack (2026-05-24) — https://gbhackers.com/hackers-compromise-34-npm-pypi-and-crates-packages/
- [Cyber Kendra] Malicious Packages on npm, PyPI, and Crates.io Steal Crypto Wallets, SSH Keys, and Cloud Credentials (2026-05-24) — https://www.cyberkendra.com/2026/05/malicious-packages-on-npm-pypi-and.html
- [SQ Magazine] TrapDoor Malware Targets npm, PyPI, and Rust Developers (2026-05-24) — https://sqmagazine.co.uk/trapdoor-malware-npm-pypi-rust-developers/
