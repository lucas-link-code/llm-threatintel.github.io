# TeamPCP Multi-Stage Supply Chain Campaign Targets AI Infrastructure: LiteLLM, Telnyx, and Trivy Compromised

**Date:** 2026-04-01
**Tags:** supply-chain, pypi, ai-ml, credential-theft, multi-stage

## Executive Summary

TeamPCP conducted a sophisticated multi-stage supply chain campaign between March 19-27, 2026, compromising four widely-used projects in succession: Trivy, KICS, LiteLLM, and Telnyx, using stolen credentials from each compromise to expand to the next target. The LiteLLM compromise on March 24 involved malicious PyPI versions 1.82.7 and 1.82.8 containing credential stealers, live for only 40 minutes before quarantine. Organizations using AI proxy libraries and infrastructure scanning tools must audit for exposure and rotate all potentially compromised credentials.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TeamPCP Multi-Stage Supply Chain Campaign |
| Attribution | TeamPCP (confidence: high) |
| Target | AI/ML developers, cloud infrastructure, CI/CD pipelines |
| Vector | Compromised maintainer accounts and stolen credentials |
| Status | active |
| First Observed | March 19, 2026 |

## Detailed Findings

TeamPCP operated through five distinct stages, moving from project to project while siphoning credentials and using them to expand the campaign, with each stage reusing access or tradecraft from the previous compromise. The campaign began March 19, 2026 with Trivy compromise using stolen aquasecurity credentials to replace GitHub Action tags, triggering malicious builds across GHCR, ECR Public, Docker Hub, and package repositories. By March 20, the campaign expanded to a self-propagating npm worm across multiple publisher scopes, stealing npm tokens from compromised environments and republishing packages with malicious payloads while preserving original READMEs. The LiteLLM compromise on March 24 involved malicious PyPI versions with credential stealers designed to encrypt and exfiltrate data via POST requests to models.litellm.cloud, targeting API keys, SSH keys, and CI/CD secrets. The campaign concluded with Telnyx Python SDK compromise on March 27, publishing malicious versions 4.87.1 and 4.87.2 before quarantine by 10:13 UTC.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.002 | Multi-stage compromise of software dependencies across PyPI, npm, and GitHub repositories |
| Valid Accounts | T1078.003 | Use of compromised maintainer accounts and stolen publishing credentials to propagate malicious packages |
| Credentials from Files | T1552.001 | Extraction of SSH keys, API tokens, and CI/CD secrets from compromised development environments |
| Data from Local System | T1005 | Harvesting of cloud credentials, Kubernetes configuration files, and environment variables |
| Encrypted Channel | T1573 | Encryption and exfiltration of stolen credentials via HTTP POST to attacker-controlled domains |

## IOCs

### Domains

```
models.litellm.cloud
```

### Full URL Paths

_IOCs confirmed by multiple sources including LiteLLM maintainers, Datadog Security Labs, and Telnyx official security notice_

### Splunk Format

```
"models.litellm.cloud"
```

### Package Indicators

```
pypi:litellm@1.82.7
pypi:litellm@1.82.8
pypi:telnyx@4.87.1
pypi:telnyx@4.87.2
```

## Detection Recommendations

Monitor PyPI and npm package installation logs for affected versions during March 19-27, 2026 timeframe. Search CI/CD pipeline logs for executions of litellm 1.82.7/1.82.8 and telnyx 4.87.1/4.87.2. Check for presence of litellm_init.pth files in Python environments. Monitor network traffic for POST requests to models.litellm.cloud and unusual TruffleHog reconnaissance activity. Audit AWS CloudTrail logs for unexpected bedrock:InvokeModel, sagemaker:InvokeEndpoint API calls from unfamiliar IP addresses. Review environment variables and configuration files for potential credential exposure on affected systems.

## References

- [Datadog Security Labs] LiteLLM and Telnyx compromised on PyPI: Tracing the TeamPCP supply chain campaign (2026-03-25) — https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/
- [LiteLLM] Security Update: Suspected Supply Chain Incident (2026-03-24) — https://docs.litellm.ai/blog/security-update-march-2026
- [Telnyx] Telnyx Python SDK Security Notice: Malicious PyPI Versions Identified (2026-03-27) — https://telnyx.com/resources/telnyx-python-sdk-supply-chain-security-notice-march-2026
- [Help Net Security] LiteLLM PyPI packages compromised in expanding TeamPCP supply chain attacks (2026-03-25) — https://www.helpnetsecurity.com/2026/03/25/teampcp-supply-chain-attacks/
