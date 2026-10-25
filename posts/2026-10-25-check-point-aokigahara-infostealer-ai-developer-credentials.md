# Check Point Research Documents Aokigahara Infostealer Harvesting AI Assistant Sessions and Developer Credentials

**Date:** 2026-10-25
**Tags:** malware, shadow-ai

## Executive Summary

Check Point Research published a first party analysis on October 23, 2026 of Aokigahara, a newly observed infostealer whose collection routines explicitly target AI assistant applications and developer tooling. Targeted artifacts include session and configuration data tied to Claude, ChatGPT Desktop, Codex, Cursor, Windsurf, GitHub Copilot, Gemini CLI and JetBrains AI Assistant, plus Git credentials, SSH files and AWS, Azure and Google Cloud configurations. Defenders should treat AI assistant session tokens as production secrets and rotate them alongside cloud keys if a developer endpoint is suspected of compromise.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Aokigahara infostealer |
| Attribution | Unknown (confidence: none) |
| Target | Developers and AI tool users on Windows endpoints with AI assistants, coding agents, cloud credentials and Git or SSH material present |
| Vector | Information stealer malware; Check Point Research did not detail the initial delivery vector in the published analysis |
| Status | active |
| First Observed | 2026-10-23 |

## Detailed Findings

Check Point Research reported on October 23, 2026 that it identified and analyzed Aokigahara in the wild, describing it as a newly observed infostealer that goes beyond the broad credential theft typical of the category. According to Check Point Research, Aokigahara's collection routines are explicit about AI applications, naming Claude, ChatGPT Desktop, Codex, Cursor, Windsurf, GitHub Copilot, Gemini CLI and JetBrains AI Assistant among its targets. It also collects authentication files, session data and configuration files associated with those tools, alongside the usual browser passwords and cookies, cryptocurrency wallets, email applications, password managers and VPN software. Check Point Research stated that the impact extends past access to an AI account: if stolen credentials or session tokens remain valid, they could expose private conversations, source code, development data and paid AI services, and could support unauthorized use or resale of compromised accounts, though the researchers said they have not confirmed how the operators monetize the data. The same collection set reaches Git credentials, SSH related files and AWS, Azure and Google Cloud credentials and configurations, which means a single endpoint infection can yield both AI session access and the underlying code and cloud identity material. Check Point Research framed the case as evidence that AI access is becoming part of a wider developer and identity attack surface rather than a separate category.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Credentials from Password Stores | T1555 | Aokigahara collects password manager data and stored application credentials, including AI assistant authentication files, per Check Point Research |
| Steal Web Session Cookie | T1539 | Check Point Research reported collection of browser cookies and AI application session data that could keep stolen AI sessions valid |

## IOCs

### Domains

_No IOCs published. Check Point Research did not release file hashes, C2 domains or delivery infrastructure in the published analysis. Treat affected_platforms as targeted credential sources, not confirmed compromised assets._

### Full URL Paths

_No IOCs published. Check Point Research did not release file hashes, C2 domains or delivery infrastructure in the published analysis. Treat affected_platforms as targeted credential sources, not confirmed compromised assets._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude
ChatGPT Desktop
Codex
Cursor
Windsurf
GitHub Copilot
Gemini CLI
JetBrains AI Assistant
AWS credential and configuration files
Azure credential and configuration files
Google Cloud credential and configuration files
Git credential stores
SSH key material
```

## Detection Recommendations

Add AI assistant application data directories and configuration paths for Claude, ChatGPT Desktop, Codex, Cursor, Windsurf, GitHub Copilot, Gemini CLI and JetBrains AI Assistant to endpoint file access monitoring, since these are the exact collection targets Check Point Research named. Alert on processes reading both a browser credential store and an AI assistant session directory in short succession, and on bulk reads of SSH key material, Git credential files and cloud CLI configuration directories in developer profiles. Assume any AI assistant session token may still be valid after an endpoint infection: rotate AI provider sessions, Git tokens and cloud access keys rather than relying only on malware removal. Because Check Point Research published no hashes or C2 indicators, detection must lean on behavior rather than signature coverage.

## References

- [Check Point Research] Infostealers Are Targeting AI: What Aokigahara Infostealer Reveals About the New Developer Attack Surface (2026-10-23) — https://blog.checkpoint.com/ai-security/infostealers-are-targeting-ai-what-aokigahara-infostealer-reveals-about-the-new-developer-attack-surface/
