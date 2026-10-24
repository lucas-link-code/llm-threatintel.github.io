# Microsoft Analyzes LiteLLM 1.107.0 Credential Theft Through Python Startup Hooks

**Date:** 2026-10-24
**Tags:** supply-chain, malware

## Executive Summary

Microsoft published technical analysis of the LiteLLM 1.107.0 supply chain compromise, showing the malicious release ran credential collection during normal Python interpreter startup, so an application did not need to import LiteLLM for the payload to execute. The collector targeted authentication material across developer tools, AI applications, cloud environments, browsers, and infrastructure, and a separate module read credential and model configuration records from the LiteLLM proxy. Defenders should treat any host that started Python in an environment carrying litellm 1.107.0 or its container images as compromised and rotate every credential reachable from that host.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LiteLLM 1.107.0 Release Pipeline Compromise |
| Attribution | Unknown (confidence: low) |
| Target | Developers and organizations consuming LiteLLM through PyPI or official container images |
| Vector | Compromised PyPI release and container images that added files Python executes during interpreter initialization |
| Status | removed |
| First Observed | 2026-10-21 |

## Detailed Findings

According to Microsoft Security Blog, a compromised LiteLLM 1.107.0 release published on October 21, 2026 to PyPI and distributed through official container images added files Python could execute during normal interpreter initialization, meaning starting Python in an affected environment could be enough to trigger the payload without importing LiteLLM. Microsoft analyzed two execution paths in the affected wheels: a credential collector launched through a path extension, and a Unix oriented loader persisted through site specific configuration. The collector targeted authentication material across developer tools, AI applications, cloud environments, browsers, and infrastructure, while a separate database module attempted to read selected credential and model configuration records from the LiteLLM proxy. LiteLLM reported the same incident, stating the malicious pypi:litellm@1.107.0 package was live on PyPI from about 11:39 to 13:23 UTC and that Docker Hub images tagged v1.107.0, latest, main-latest, and main-stable pointed to a compromised image index from 11:46 to 14:20 UTC. LiteLLM added that the official v1.107.0 source tag in GitHub did not contain the malicious files, that the compromised artifacts were built from an attacker controlled repository, and that Enterprise customers on the private enterprise release were not impacted.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious package and container images published through the LiteLLM release pipeline |
| Credentials In Files | T1552.001 | Collector harvested stored credentials and configuration records from developer hosts and the LiteLLM proxy |

## IOCs

### Domains

_Image index sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e published by LiteLLM. Microsoft did not publish file hashes for the wheel payloads._

### Full URL Paths

_Image index sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e published by LiteLLM. Microsoft did not publish file hashes for the wheel payloads._

### Splunk Format

_No IOCs available for Splunk query_

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
Python runtime site-packages
```

## Detection Recommendations

Audit Python site-packages for unexpected .pth files, sitecustomize.py, or usercustomize.py modifications on any host that ran Python after October 21, 2026. Reconcile installed package inventories against litellm 1.107.0 and scan container registries and local image caches for the compromised image index. Rotate all credentials accessible from affected hosts, including cloud keys, AI provider API keys, browser stored secrets, and LiteLLM proxy configuration. Block unexpected outbound connections from Python processes and monitor for anomalous reads of developer credential stores.

## References

- [Microsoft Security Blog] Inside the LiteLLM 1.107.0 supply chain compromise: Credential theft through Python startup hooks (2026-10-23) — https://www.microsoft.com/en-us/security/blog/2026/10/23/inside-the-litellm-1-107-0-supply-chain-compromise-credential-theft-through-python-startup-hooks/
- [LiteLLM] Contained: Oct 21, 2026 LiteLLM release v1.107.0 Compromised (2026-10-21) — https://docs.litellm.ai/blog/security-incident-oct-21-2026
