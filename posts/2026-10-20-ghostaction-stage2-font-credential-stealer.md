# GhostAction Stage 2 Plants Font Disguised Credential Stealer in 94 GitHub Repositories

**Date:** 2026-10-20
**Tags:** supply-chain, malware

## Executive Summary

GhostAction operators escalated from malicious GitHub Actions workflows to a second stage that steals developer credentials without needing a workflow runner at all. Attackers planted a fake font file containing an infostealer that harvests AWS keys, PyPI and npm tokens, Kubernetes credentials, SSH private keys, and AI provider credentials for Anthropic Claude and Google Gemini. Security teams should review repositories for the named file path, rotate exposed developer and cloud secrets, and audit GitHub OAuth app authorizations.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GhostAction |
| Attribution | Unattributed threat actor operating the GhostAction supply chain campaign (confidence: low) |
| Target | Open source developers and repositories on GitHub |
| Vector | Compromised repositories, VS Code auto run tasks, and a phishing page that authorizes a malicious GitHub OAuth app |
| Status | active |
| First Observed | 2026-10-09 |

## Detailed Findings

According to OpenSourceMalware, as reported by The Hacker News, the GhostAction operator moved beyond injecting malicious GitHub Actions workflows and added a stage 2 launcher that does not require a workflow runner. The new stage drops a Microsoft Visual Studio Code tasks.json file with a runOn: folderOpen trigger so the payload executes when the folder is opened, plus a public/fonts/fa-solid-400.woff2 file that carries a stealer payload. OpenSourceMalware reported that the font file collects AWS keys, PyPI tokens, npm tokens, Git logins, Kubernetes cluster credentials, SSH private keys, and AI provider credentials for Anthropic Claude and Google Gemini, then installs a cron job that runs attacker code every five minutes and exfiltrates over plain HTTP on port 8080. One hundred and ninety four compromised repositories with the second stage component were identified. The stealer file name matches one used in North Korea's Fake Font and PolinRider campaign from January 2026, though no attribution is asserted for GhostAction. OpenSourceMalware also reported a phishing page on the domain my-github[.]com resolving to 193.32.204[.]199, the same address used as the workflow exfiltration endpoint. The page acted as a reverse proxy that captured passwords and 2FA codes and injected JavaScript to authorize a GitHub OAuth device flow with repo, workflow, and read:org scopes. According to OpenSourceMalware, GitHub began blocking the malicious workflow on October 9 and the October 10 and 12 waves extracted no secrets, with stage 2 arriving six days later. A second GitHub Actions workflow remains in place as a fallback if the infostealer never runs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious code injected into open source repositories and consumed by developers who open the project in VS Code |
| Steal Application Access Token | T1528 | Phishing page authorizes a GitHub OAuth app with repo, workflow, and read:org scopes to enable repository modification |

## IOCs

### Domains

```
my-github.com
```

### Full URL Paths

_OpenSourceMalware and The Hacker News published the domain, IP, and the malicious file path public/fonts/fa-solid-400.woff2. No file hashes were published in the coverage reviewed._

### Splunk Format

```
"my-github.com"
```

### Affected Platforms

```
GitHub
Visual Studio Code
AWS
PyPI
npm
Kubernetes
Anthropic Claude
Google Gemini
```

## Detection Recommendations

Search repositories and developer workstations for public/fonts/fa-solid-400.woff2 and for VS Code tasks.json files with runOn: folderOpen. Hunt for outbound HTTP POST traffic to 193.32.204[.]199 on port 8080 and for cron entries executing every five minutes. Audit GitHub OAuth app authorizations with repo, workflow, and read:org scopes and revoke unrecognized apps. Rotate AWS keys, PyPI and npm tokens, Kubernetes credentials, SSH keys, and any Anthropic Claude or Google Gemini credentials present on affected hosts, and review cloud logs for abusable activity consistent with hijacked resources.

## References

- [The Hacker News] GhostAction Attackers Plant Credential Stealer Disguised as Font in 94 GitHub Repositories (2026-10-19) — https://thehackernews.com/2026/10/ghostaction-attackers-plant-credential.html
