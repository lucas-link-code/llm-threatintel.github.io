# GlassWorm Supply Chain Attack: 433 Compromised Components Across Open VSX, npm, and GitHub Targeting Developer Environments

**Date:** 2026-04-07
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

The GlassWorm campaign has compromised 433 components across Open VSX, npm, and GitHub since October 2025, including 72 malicious IDE extensions with over 9 million installs. The malware steals credentials for npm, GitHub, cloud providers, and cryptocurrency wallets, deploys hidden VNC servers and SOCKS proxies, and self-propagates by compromising additional extensions through transitive dependency abuse. Code analysis suggests Russian-speaking threat actors. Organizations should audit Open VSX extension inventories and block extensions with unverified transitive dependencies.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GlassWorm |
| Attribution | Suspected Russian-speaking threat actors (confidence: low) |
| Target | Software developers using VSCode-compatible IDEs with Open VSX extensions |
| Vector | Compromised developer accounts, transitive dependency poisoning in extension manifests |
| Status | active |
| First Observed | 2025-10 |

## Detailed Findings

According to Socket.dev, the GlassWorm campaign was first identified when researchers discovered malicious loader components injected into established Open VSX extensions via compromised developer accounts or stolen publishing credentials. The initial attack vector involved direct code injection into legitimate extensions during routine updates.

BleepingComputer reported that as of March 2026, the campaign has expanded to 433 compromised components across multiple platforms, with 72 malicious Open VSX extensions accumulating over 9 million total installs. The campaign spans Open VSX, npm, GitHub, and the Visual Studio Code marketplace, making it one of the broadest developer-targeted supply chain attacks documented.

CSO Online reported that the campaign evolved its delivery mechanism in late 2025 to abuse extension dependency relationships. By manipulating the extensionPack and extensionDependencies fields in extension manifests, GlassWorm delivers malware through transitive dependencies. A clean-appearing extension pulls malicious payloads automatically after gaining user trust, requiring no direct compromise of the parent extension code.

According to Rescana, the GlassWorm malware uses heavily obfuscated JavaScript with invisible Unicode characters and locale checks that avoid execution on Russian-configured systems. The loader employs runtime payload decryption and multi-layered C2 infrastructure including direct IP connections, Solana blockchain dead drops for C2 address resolution, and Google Calendar events as a fallback communication channel.

Socket.dev documented the full credential harvesting scope: npm tokens, GitHub tokens, Git credentials, AWS/GCP/Azure cloud provider keys, and browser-stored passwords. The malware also targets cryptocurrency wallets including MetaMask, Electrum, Exodus, Atomic, Ledger Live, Trezor Suite, Binance, and TonKeeper. On Windows systems, GlassWorm establishes persistence through registry keys and deploys hidden VNC servers and SOCKS proxies for remote access. The self-propagation component compromises additional extensions by reusing harvested developer credentials.

BleepingComputer noted that while no confirmed APT attribution exists, code analysis, operational security patterns, and the Russian locale exclusion collectively suggest Russian-speaking threat actors.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies | T1195.001 | Transitive dependency poisoning via extensionPack and extensionDependencies fields |
| Supply Chain Compromise | T1195.002 | Compromised developer accounts used to inject malware into legitimate extensions |
| Credentials from Password Stores | T1555 | Harvesting browser passwords and cryptocurrency wallet data |
| Unsecured Credentials: Credentials in Files | T1552.001 | Stealing npm, GitHub, Git, and cloud provider tokens from config files |
| Remote Access Software | T1219 | Hidden VNC servers and SOCKS proxies deployed on compromised systems |
| Obfuscated Files or Information | T1027 | Invisible Unicode characters, runtime payload decryption |
| Boot or Logon Autostart Execution: Registry Run Keys | T1547.001 | Windows registry persistence for GlassWorm loader |

## IOCs

### Domains

*No specific C2 domains published by source. C2 uses direct IP connections, Solana blockchain dead drops, and Google Calendar events.*

### Full URL Paths

*No full URL paths published.*

### Splunk Format

*No domain or URL IOCs available for Splunk query. Detection should focus on behavioral indicators.*

### File Hashes

*No specific file hashes published in the referenced reports.*

### Package Indicators

*72 malicious Open VSX extension IDs identified but individual extension names not published in aggregated form. Check Socket.dev advisory for full package list.*

## Detection Recommendations

Audit Open VSX and VSCode extension inventories for extensions with recent dependency changes in extensionPack or extensionDependencies manifest fields. Monitor EDR for Node.js or Electron processes spawning VNC server binaries or establishing SOCKS proxy listeners on non-standard ports. In web proxy logs, hunt for connections from IDE processes (code, codium, cursor) to Solana RPC endpoints or Google Calendar API endpoints outside normal developer workflow patterns. Query DNS logs for resolution of cryptocurrency exchange domains from developer workstations. Monitor for outbound connections to direct IP addresses from extension host processes. On Windows endpoints, inspect registry Run keys for entries created by VSCode extension processes. Implement extension allowlisting policies in enterprise VSCode deployments to restrict installation to vetted extensions only.

## References

- [Socket.dev] GlassWorm Loader Hits Open VSX via Developer Account Compromise (2026-01) — https://socket.dev/blog/glassworm-loader-hits-open-vsx-via-suspected-developer-account-compromise
- [BleepingComputer] GlassWorm malware hits 400+ code repos on GitHub, npm, VSCode, OpenVSX (2026-03) — https://www.bleepingcomputer.com/news/security/glassworm-malware-hits-400-plus-code-repos-on-github-npm-vscode-openvsx/
- [CSO Online] Open VSX extensions hijacked: GlassWorm malware spreads via dependency abuse (2026-03) — https://www.csoonline.com/article/4145579/open-vsx-extensions-hijacked-glassworm-malware-spreads-via-dependency-abuse.html
- [Rescana] GlassWorm Supply Chain Attack Exploits Open VSX Registry to Infect VSCode Extensions with Advanced Malware (2026) — https://www.rescana.com/post/glassworm-supply-chain-attack-exploits-open-vsx-registry-to-infect-vscode-extensions-with-advanced-m
