# BleepingComputer Names the Three Payload Files Dropped by the Compromised LiteLLM v1.107.0 Release

**Date:** 2026-10-23
**Tags:** supply-chain, malware

## Executive Summary

BleepingComputer published technical analysis of the LiteLLM release pipeline compromise, confirming that all PyPI wheels for litellm 1.107.0 and the malicious Docker image tags dropped three files, cook.pth, cook.py, and sitecustomize.py, into the Python library directory to steal credentials and load remote code execution tooling. Harvested data included cloud and Kubernetes secrets, AI provider credentials, Git, GitHub, npm, PyPI and CI/CD credentials, .env files, SSH, GPG and TLS keys, and browser data. Anyone who installed an unpinned LiteLLM between 11:39 and 13:23 UTC on October 21, 2026, or pulled the affected Docker tags between 11:46 and 14:20 UTC, should treat all secrets on that host as compromised.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LiteLLM release pipeline compromise |
| Attribution | Unattributed (confidence: none) |
| Target | LiteLLM users who installed version 1.107.0 or pulled affected Docker and GHCR image tags |
| Vector | Compromised release pipeline publishing malicious PyPI wheels and container images built from an attacker controlled repository |
| Status | removed |
| First Observed | 2026-10-21 |

## Detailed Findings

BleepingComputer reported that attackers compromised the LiteLLM project's PyPI package and published malicious Docker images carrying a payload that steals credentials, secrets, and environment variables, affecting all PyPI wheels for LiteLLM version 1.107.0 across Windows, Linux, and macOS. According to BleepingComputer, multiple application security companies detected the attack within six minutes of publishing the malicious version, and researchers found that the attacker did not touch the LiteLLM application code but modified only the installation package to place three malicious files, cook.pth, cook.py, and sitecustomize.py, in the environment's Python library directory. BleepingComputer listed the targeted data as cloud and deployment credentials for AWS, Azure, Google Cloud, Kubernetes, Docker and infrastructure management secrets, AI credentials and configuration including authentication files for AI development tools plus LiteLLM's stored provider credentials and model settings, developer secrets and private keys including Git, GitHub, npm, PyPI and CI/CD credentials, .env files, and SSH, GPG and TLS keys, and browser data covering saved logins, cookies, autofill and payment data, and browsing history. LiteLLM stated that the malicious PyPI package was live from 11:39:51 to 13:23 UTC and that Docker Hub tags v1.107.0, latest, main-latest, and main-stable pointed to a compromised image index from 11:46:56 to 14:20 UTC, while GHCR tags pointed to compromised image indexes from 11:46:56 UTC until they were made unavailable by 13:51 UTC. LiteLLM reported that the official v1.107.0 source tag in GitHub does not contain the malicious files and that the compromised artifacts were built from an attacker controlled repository, and that enterprise customers on the private enterprise release were not impacted. LiteLLM also stated that it identified an unexpected, innocuously named user account in an internal LiteLLM deployment exposed to the public internet, and believes the attacker gained access to that deployment, obtained GitHub CLI OAuth tokens from its logs, and used those credentials to compromise the release workflow.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious wheels and container images were built from an attacker controlled repository and published through the LiteLLM release pipeline to PyPI, Docker Hub, and GHCR |
| Credentials from Password Stores | T1555 | The payload harvested stored provider credentials, browser saved logins, and other credential stores from affected hosts |

## IOCs

### Domains

_The listed SHA256 is the compromised Docker image index cited by LiteLLM. Docker Hub tags v1.107.0, latest, main-latest and main-stable and the equivalent GHCR tags are affected. Payload filenames dropped on host: cook.pth, cook.py, sitecustomize.py._

### Full URL Paths

_The listed SHA256 is the compromised Docker image index cited by LiteLLM. Docker Hub tags v1.107.0, latest, main-latest and main-stable and the equivalent GHCR tags are affected. Payload filenames dropped on host: cook.pth, cook.py, sitecustomize.py._

### Splunk Format

_No IOCs available for Splunk query_

### File Hashes

```
sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
```

### Package Indicators

```
pypi:litellm@1.107.0
```

### Affected Platforms

```
Windows
Linux
macOS
Docker Hub
GHCR
PyPI
```

## Detection Recommendations

Search host Python library directories for cook.pth, cook.py, and sitecustomize.py and remove them, then rotate every secret that was reachable from the affected host including cloud, Kubernetes, AI provider, Git, GitHub, npm, PyPI, CI/CD, SSH, GPG, and TLS material. Pin LiteLLM to a known good version and verify artifact provenance rather than trusting tag names, since image tags were repointed at a compromised index. Review GitHub Actions and release workflow logs for OAuth token use from unexpected user accounts, and audit internal LiteLLM deployments for unintended public internet exposure and for innocuously named accounts.

## References

- [BleepingComputer] LiteLLM release pipeline hacked to distribute info-stealer malware (2026-10-22) — https://www.bleepingcomputer.com/news/security/litellm-release-pipeline-hacked-to-distribute-info-stealer-malware/
- [LiteLLM] Contained: Oct 21, 2026 LiteLLM release v1.107.0 Compromised (2026-10-21) — https://docs.litellm.ai/blog/security-incident-oct-21-2026
