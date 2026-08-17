# 800+ Malicious npm Packages: AI-Slop Typosquatting Campaign Distributes Cross-Platform RAT

**Date:** 2026-08-17
**Tags:** supply-chain, malware

## Executive Summary

Nearly 800 malicious npm packages using AI-generated ("slop") or randomly generated typosquatting names deliver a powerful cross-platform RAT and infostealer payload, with updates on August 11, 2026. The campaign targets developers across Linux, macOS, and Windows platforms.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI-Slop Typosquatting Campaign (800+ packages) |
| Attribution | Unknown (confidence: low) |
| Target | npm developers; cross-platform users |
| Vector | Typosquatted package names; install-time execution via postinstall scripts |
| Status | active |
| First Observed | 2026-08-11 |

## Detailed Findings

Packages appear to use AI slop squatted, or randomly generated typo-squatting package names, but all deliver a powerful RAT and infostealer payload. The scale and coordination suggest automated package generation and publishing, consistent with malware-as-a-service infrastructure.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Typosquatting / Dependency Confusion | T1195.003 | Malicious packages registered with names similar to legitimate npm packages |
| Execution via Package Manager | T1059.001 | Postinstall scripts execute malware on npm install |
| Information Gathering | T1592 | RAT and infostealer exfiltrate developer credentials and system data |

## IOCs

### Domains

_No specific package IOCs published; OpenSourceMalware researcher Paul McCarty and The Hacker News published updates on August 11, 2026. Recommend checking npm security advisories and malware tracking databases for package names._

### Full URL Paths

_No specific package IOCs published; OpenSourceMalware researcher Paul McCarty and The Hacker News published updates on August 11, 2026. Recommend checking npm security advisories and malware tracking databases for package names._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
npm
Linux
macOS
Windows
```

## Detection Recommendations

Monitor npm package registrations for unusual patterns of similarly-named packages or AI-generated names with common typosquatting targets (ollama, langchain, openai, anthropic, vercel). Implement npm postinstall script sandboxing and prohibit lifecycle script execution for unvetted packages. Use npm audit and third-party supply chain scanners (Snyk, Sonatype) to detect typosquatted dependencies. Monitor for sudden spikes in package installation from new or low-reputation publishers. Implement strict lockfile pinning and registry authentication. Alert on any postinstall execution that attempts credential harvesting or network exfiltration.

## References

- [The Hacker News] Nearly 800 Malicious npm Packages Deliver Cross-Platform RAT and Infostealer (2026-08-11) — https://thehackernews.com/2026/08/nearly-800-malicious-npm-packages.html
- [OpenSourceMalware] Cybersecurity Startup Publishes Infostealers to NPM (2026-07-09) — https://opensourcemalware.com/blog/cybersecurity-startup-publishes-infostealers-to-npm
