# LiteLLM Release Pipeline Compromise Pushes Malicious v1.107.0 to PyPI, Docker Hub, and GHCR

**Date:** 2026-10-22
**Tags:** supply-chain, malware, llmjacking

## Executive Summary

LiteLLM's release pipeline was compromised on 2026-10-21 and pushed a malicious litellm==1.107.0 to PyPI plus poisoned Docker Hub and GHCR tags including latest and main-stable. The build stole credentials and loaded remote code execution tooling, and LiteLLM states the attacker obtained GitHub CLI OAuth tokens from logs of an internet exposed internal LiteLLM deployment. Defenders running the AI gateway, especially in CI pipelines, must pin previous versions, rotate GitHub and AI provider credentials, and stop logging raw response bodies.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LiteLLM v1.107.0 release pipeline compromise |
| Attribution | Unattributed (confidence: none) |
| Target | Downstream users of the LiteLLM AI gateway, including CI/CD pipelines and enterprises deploying public container images |
| Vector | Compromised release pipeline publishing malicious PyPI wheels and poisoned container image tags |
| Status | removed |
| First Observed | 2026-10-21 |

## Detailed Findings

According to LiteLLM's security incident blog, an attacker pushed version 1.107.0 to PyPI and the Docker registry in the early morning of 2026-10-21, and the compiled package contained malware that steals credentials and loads remote code execution tools. All seven litellm==1.107.0 wheels were live on PyPI from 11:39:51 to 13:23 UTC, while Docker Hub tags v1.107.0, latest, main-latest, and main-stable pointed to the compromised image index sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e from 11:46:56 to 14:20 UTC. GHCR tags for ghcr.io/berriai/litellm, litellm-database, and litellm-non_root pointed at attacker controlled image indexes from 11:46:56 UTC until removal by 13:51 UTC, and the vendor states the official v1.107.0 source tag in GitHub does not contain the malicious files because the compromised artifacts were built from an attacker controlled repository. According to LiteLLM, an unexpectedly named user account existed in an internal LiteLLM deployment exposed to the public internet, and the attacker is believed to have obtained GitHub CLI OAuth tokens from that deployment's logs and used them to compromise the release workflow. LiteLLM also reported that Claude Code can embed a user's GitHub CLI OAuth token in a response body, meaning tokens can appear in LiteLLM logs when response bodies are logged. Enterprise customers on the private enterprise release were not impacted, and all impacted public artifacts were pulled.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | Attacker built malicious artifacts from an attacker controlled repository and published them as litellm==1.107.0 to PyPI and container registries |
| Steal Application Access Token | T1528 | GitHub CLI OAuth tokens captured from LiteLLM logs were used to compromise the release workflow |

## IOCs

### Domains

_LiteLLM published the full Docker Hub image index digest; two additional GHCR digests (sha256:c00f9d92c427 and sha256:7b00e91cd2fe) were published truncated at source and are not reproduced here._

### Full URL Paths

```
ghcr.io/berriai/litellm
ghcr.io/berriai/litellm-database
ghcr.io/berriai/litellm-non_root
```

### Splunk Format

```
"ghcr.io/berriai/litellm" OR "ghcr.io/berriai/litellm-database" OR "ghcr.io/berriai/litellm-non_root"
```

### File Hashes

```
1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
```

### Package Indicators

```
pypi:litellm@1.107.0
```

### Affected Platforms

```
PyPI
Docker Hub
GHCR
```

## Detection Recommendations

Search lockfiles, build caches, and SBOMs for litellm==1.107.0 and for container images pulled on 2026-10-21 between 11:46 and 14:20 UTC, and treat any host that installed or ran them as compromised. Rotate GitHub CLI OAuth tokens, GitHub App credentials, and any cloud or AI provider keys present on systems that ran LiteLLM, and audit GitHub audit logs for release and workflow changes from 2026-10-21. Disable response body logging in LiteLLM and other LLM gateways so tokens echoed by coding assistants cannot land in logs, restrict management interfaces from the public internet, and pin container images by digest rather than mutable tags such as latest and main-stable.

## References

- [LiteLLM] Contained: Oct 21, 2026 LiteLLM release v1.107.0 Compromised (2026-10-21) — https://docs.litellm.ai/blog/security-incident-oct-21-2026
