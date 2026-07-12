# Compromised jscrambler npm Package Drops Rust Infostealer Targeting AI Coding Assistants and MCP Configs

**Date:** 2026-07-12
**Tags:** supply-chain, malware, mcp-security

## Executive Summary

On 2026-07-11 attackers published compromised releases of the official jscrambler npm CLI that drop a Rust cross-platform infostealer during install or import, with Socket and StepSecurity confirming malicious versions 8.14.0, 8.16.0, 8.17.0, 8.18.0, and 8.20.0. The payload specifically enumerates AI developer tooling and MCP configuration paths including Cursor, Claude Desktop, Windsurf, VS Code, and Factory, alongside cloud credentials and crypto wallets. Pin to jscrambler 8.22.0 or another verified clean release, treat any host that installed a compromised version as compromised, and rotate secrets reachable by the npm process.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Compromised jscrambler npm releases / Rust CSI-container infostealer |
| Actor / Attribution | Unknown; unauthorized npm publish via stolen publishing credential per Jscrambler advisory (confidence: none for named actor) |
| Target | Developers and CI pipelines using the jscrambler JavaScript code-protection CLI (~15,800 weekly downloads) |
| Vector | Compromised official npm package; preinstall hook in early bad versions, then import-time self-executing dropper to evade install-script scanners |
| Status | disrupted (affected releases deprecated; 8.22.0 confirmed clean) |
| First Observed | 2026-07-11 |

## Detailed Findings

According to Socket Research Team, version 8.14.0 of jscrambler was published on 2026-07-11 with an undocumented preinstall hook running dist/setup.js and a new approximately 7.8 MB dist/intro.js file that is not JavaScript. Socket reported that intro.js is a custom CSI binary container with magic bytes 1B 43 53 49 01 packing three gzip-compressed native executables: Linux x86-64 ELF, Windows x86-64 PE32+, and macOS arm64 Mach-O. The loader selects the blob for process.platform, decompresses it to a randomly named hidden temp file, and launches it detached with stdio ignored.

StepSecurity independently confirmed the same compromise, scoring 8.14.0 at maximum suspicion on publish, and documented that the package grew from about 37.8 kB in clean 8.13.0 to about 7.9 MB. StepSecurity Harden-Runner observed the dropped binary connecting to check.torproject.org, archive.torproject.org, 37.27.122.124, and 57.128.246.79.

Socket reported that the same threat actor published four additional malicious releases over roughly three hours: 8.16.0, 8.17.0, 8.18.0, and 8.20.0. Versions 8.14.0 through 8.17.0 used the preinstall hook. Starting with 8.18.0 the install hook was removed and the identical dropper was inlined at the top of dist/index.js and dist/bin/jscrambler.js so it fires on import or CLI use, defeating ignore-scripts and install-script-only scanners. Socket stated the intro.js blob and platform binaries are byte-for-byte identical across malicious releases. Jscrambler confirmed unauthorized publication using an npm publishing credential, revoked credentials, deprecated affected releases, and published clean 8.22.0.

Socket analysis of the Rust payloads recovered approximately 2,400 ChaCha20-Poly1305 encrypted configuration strings. A distinctive GenAI-relevant target surface is AI coding assistant and MCP configuration harvesting, including Claude Desktop paths, .cursor/mcp.json, Windsurf mcp_config.json, Factory mcp.json, Zed context_servers, VS Code mcpServers, and opencode configs. The same payload also targets browser crypto wallets, GCP/AWS/Azure credentials and metadata endpoints, Discord/Slack/Telegram, Chromium and Firefox stores, Steam, and attempts local privilege escalation and persistence via systemd, crontab, and LaunchAgents. Static analysis confirmed TLS exfiltration via rustls with a multipart POST /upload pattern.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | Unauthorized malicious versions of official jscrambler npm package |
| Command and Scripting Interpreter | T1059 | preinstall node dist/setup.js and later import-time dropper |
| Masquerading | T1036 | Native payloads hidden in dist/intro.js disguised as JavaScript |
| Credentials from Password Stores | T1555 | Browser Login Data, cookies, wallet vaults, OS keyrings |
| Unsecured Credentials | T1552 | Harvest of AI/MCP configs, cloud credentials, env secrets |
| Exfiltration Over C2 Channel | T1041 | TLS POST /upload of harvested data |
| Hijack Execution Flow | T1574 | Later versions fire on package import rather than install scripts |

## IOCs

### Domains

```
No domain IOCs published by source
```

### IP Addresses

```
37.27.122.124
57.128.246.79
```

### Full URL Paths

```
No URL path IOCs published by source
```

### Splunk Format

```
"37.27.122.124" OR "57.128.246.79" OR "npm:jscrambler@8.14.0" OR "npm:jscrambler@8.16.0" OR "npm:jscrambler@8.17.0" OR "npm:jscrambler@8.18.0" OR "npm:jscrambler@8.20.0" OR "a742de963f14a92d24ebcbc7b44ac867e23a20d31d1b0094a13a4f83287f4e60" OR "a41a523ef9517aab37ed6eea0ec881821bdcb7aefcb5c5f603adc7907f868c86" OR "fbbcf4d8f98168f78f5c0c47a9ae56d59ec8ac84a7c9ca6b797fedfb8d62d2bd" OR "b7ca95d1b23c8e67416a25cedf741de0917c2096bbc9d24649eea7853d054903" OR "c8fd47d36bdf7c825378593ab82ed8c24d1dc52e26b507812393e24e1d5201fd"
```

### File Hashes

```
a742de963f14a92d24ebcbc7b44ac867e23a20d31d1b0094a13a4f83287f4e60
a41a523ef9517aab37ed6eea0ec881821bdcb7aefcb5c5f603adc7907f868c86
bba32ddeab075a5e5015eec50f5d2af364c95b848732c714aea6b6baf78f49f0
fbbcf4d8f98168f78f5c0c47a9ae56d59ec8ac84a7c9ca6b797fedfb8d62d2bd
b7ca95d1b23c8e67416a25cedf741de0917c2096bbc9d24649eea7853d054903
c8fd47d36bdf7c825378593ab82ed8c24d1dc52e26b507812393e24e1d5201fd
```

### Package Indicators

```
npm:jscrambler@8.14.0
npm:jscrambler@8.16.0
npm:jscrambler@8.17.0
npm:jscrambler@8.18.0
npm:jscrambler@8.20.0
```

## Detection Recommendations

Search package-lock.json, yarn.lock, pnpm-lock.yaml, and node_modules for jscrambler versions 8.14.0, 8.16.0, 8.17.0, 8.18.0, and 8.20.0. Alert on npm lifecycle scripts invoking dist/setup.js under jscrambler, and on require or CLI use of jscrambler that writes a randomly named executable dotfile under /tmp, %TEMP%, or $TMPDIR. Hunt EDR process trees where npm or node spawns a detached native binary with windowsHide or unref behavior. Block egress to 37.27.122[.]124 and 57.128.246[.]79. Audit AI tooling configs for unexpected mcpServers entries and unexpected reads of .cursor/mcp.json, Claude desktop config, Windsurf mcp_config.json, and related MCP paths after any compromised install. Rotate npm tokens, cloud keys, LLM provider keys, browser sessions, and crypto wallet seeds on any machine that installed a bad version; pin to jscrambler@8.22.0.

## References

- [Socket] jscrambler npm Package Compromised in Supply Chain Attack (2026-07-11) — https://socket.dev/blog/jscrambler-supply-chain-attack
- [StepSecurity] jscrambler npm package publishes malicious preinstall binary (2026-07-11) — https://www.stepsecurity.io/blog/jscrambler-npm-package-publishes-malicious-preinstall-binary
- [The Hacker News] Compromised jscrambler 8.14.0 npm Release Drops Rust Infostealer During Install (2026-07) — https://thehackernews.com/2026/07/compromised-jscrambler-8140-npm-release.html
