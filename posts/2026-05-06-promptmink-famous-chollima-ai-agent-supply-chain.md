# PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies

**Date:** 2026-05-06
**Tags:** supply-chain, nation-state, malicious-tool

## Executive Summary

ReversingLabs attributes PromptMink to Famous Chollima, a North Korean state-sponsored threat group also linked to the "graphalgo" campaign targeting crypto developers. Claude Opus co-authored a Feb. 28, 2026, commit to the openpaw-graveyard crypto trading agent. The commit added @solana-launchpad/sdk as a dependency, which silently pulled in @validate-sdk/v2 — the malicious payload package. This marks the first documented instance of AI coding agents being weaponized to install malicious dependencies in autonomous workflows via LLM optimization abuse.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | PromptMink |
| Attribution | Famous Chollima (North Korea) (confidence: high) |
| Target | Cryptocurrency developers, AI coding agents, blockchain projects |
| Vector | Malicious npm packages disguised as legitimate crypto utilities; two-layer supply chain attack where bait packages contain no malicious code but import malicious payload packages as dependencies; LLM Optimization (LLMO) abuse via detailed documentation to trick AI agents into recommending packages |
| Status | active |
| First Observed | 2025-09-01 (initial activity); 2026-02-28 (Claude Opus compromise) |

## Detailed Findings

The PromptMink campaign appears to have started last September with two malicious packages called @hash-validator/v2 and @solana-launchpad/sdk. The SDK was used as a bait package with legitimate functionality intended to be discovered by developers, while hash-validator, a dependency for the SDK, contained a JavaScript infostealer. PromptMink steals .env and .json files, crypto wallet credentials, system information, and — in its latest Rust-based variant — entire project source trees. It also installs attacker SSH keys for persistent remote access on Linux and Windows. After thorough analysis, ReversingLabs researchers named the campaign PromptMink and attributed it to a coordinated supply chain attack linked to Famous Chollima, a North Korean-linked threat group. This is the same actor previously connected to the Contagious Interview campaign, which targeted software developers through fake job interviews and code assessments designed to deliver malicious packages. The repository history showed the dependency had been added in a commit co-authored by Claude Opus. "This transforms the technique from social engineering to a combination of LLM Optimization (LLMO) abuse and knowledge injection," the researchers concluded.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious packages inserted into npm registry targeting AI agents |
| Compromise Software Dependencies and Development Tools | T1195.001 | Injection of malicious packages as transitive dependencies |
| Credential Access | T1110 | Steals .env files, wallet credentials, API keys via infostealer payload |
| Persistence | T1098 | Installation of SSH keys for persistent remote access |

## IOCs

### Domains

_IOCs sourced from ReversingLabs blog post and InfoWorld coverage. Malicious packages have been rotated; defenders should monitor dependency trees for unexpected transitive pulls from bait packages._

### Full URL Paths

```
ipfs-url-validator.vercel.app (exfiltration endpoint for early variants)
```

### Splunk Format

```
"ipfs-url-validator.vercel.app (exfiltration endpoint for early variants)"
```

### Package Indicators

```
@solana-launchpad/sdk (bait package, no malicious code)
@validate-sdk/v2 (payload, infostealer)
@hash-validator/v2 (early variant, JavaScript infostealer)
aes-create-ipheriv (rotated payload)
jito-proper-excutor (rotated payload)
jito-sub-aes-ipheriv (rotated payload)
scraper-npm (PyPI variant, February 2026)
```

## Detection Recommendations

Monitor npm and PyPI registries for packages with crypto-related names but suspiciously broad dependency lists, especially those listing popular packages alongside niche cryptographic utilities. Implement Software Composition Analysis (SCA) tools to flag transitive dependencies pulled in by less-known packages. For AI-generated code, inspect commit messages and code comments for LLM-generated artifacts (excessive comments, emojis, placeholder language). Require code review approval for dependencies added by AI coding agents, especially in high-risk domains like finance/crypto. Monitor for .env file exfiltration patterns in logs. Track SSH key installations outside normal CI/CD workflows. Implement supply chain security policies blocking automatic adoption of new package versions without review quarantine period.

## References

- [ReversingLabs] Claude adds PromptMink malicious dependency to crypto agent (2026-04-29) — https://www.reversinglabs.com/blog/claude-promptmink-malware-crypto
- [InfoWorld] Supply-chain attacks take aim at your AI coding agents (2026-05-06) — https://www.infoworld.com/article/4167479/supply-chain-attacks-take-aim-at-your-ai-coding-agents-2.html
- [CSO Online] Supply-chain attacks take aim at your AI coding agents (2026-05-06) — https://www.csoonline.com/article/4167465/supply-chain-attacks-take-aim-at-your-ai-coding-agents.html
- [The Hacker News] New Wave of DPRK Attacks Uses AI-Inserted npm Malware, Fake Firms, and RATs (2026-04-29) — https://thehackernews.com/2026/04/new-wave-of-dprk-attacks-uses-ai.html
