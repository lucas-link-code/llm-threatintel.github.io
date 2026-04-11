# TeamPCP Supply Chain Campaign: LiteLLM and Telnyx PyPI Compromise via Poisoned Trivy Security Scanner

**Date:** 2026-04-11
**Tags:** supply-chain

## Executive Summary

On March 24, 2026, two PyPI releases of LiteLLM, 1.82.7 and 1.82.8, were published with malicious code as a result of a supply chain compromise. LiteLLM has 95 million monthly downloads and is a direct dependency of CrewAI, Browser-Use, DSPy, Mem0, Instructor, and five other major AI frameworks. The attack is part of a broader campaign by a threat actor known as TeamPCP, who previously compromised Aqua Security's Trivy scanner and Checkmarx's KICS GitHub Action over the preceding week.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TeamPCP Supply Chain Campaign |
| Attribution | TeamPCP (threat group) (confidence: high) |
| Target | AI framework developers, LLM orchestration platforms, CI/CD infrastructure |
| Vector | Compromised Trivy security scanner in CI/CD; credential exfiltration; direct PyPI account takeover |
| Status | active |
| First Observed | 2026-03-19 (Trivy compromise); 2026-03-24 (LiteLLM/Telnyx compromise) |

## Detailed Findings

litellm 1.82.7 and 1.82.8 were both released on March 24, 2026. These packages feature the same malicious payload with different execution mechanisms. The malware gathers environment variables, SSH keys, cloud credentials, Kubernetes data, Docker configs, shell history, database credentials, wallet files, and CI/CD secrets. It then uses a hybrid scheme for encryption: an AES-256 session key for the data, then RSA-4096 for the session key. Once encrypted on the host, the data is then sent to models.litellm[.]cloud using the header X-Filename: tpcp.tar.gz. Install persistence: The payload writes ~/.config/sysmon/sysmon.py and installs a user systemd unit called sysmon.service. TeamPCP has now exfiltrated an estimated 500,000+ corporate identities and 300 GB+ of compressed credentials across this campaign. March 27, 2026Updated to include the compromise of the telnyx PyPI package (versions 4.87.1 and 4.87.2) on March 27. Those packages were live on March 24, 2026 from 10:39 UTC for about 40 minutes before being quarantined by PyPI.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Compromise of Trivy security scanner and PyPI package repository to distribute malicious LLM framework dependencies |
| Credentials from Password Stores | T1555 | Malware harvests SSH keys, cloud provider credentials, Kubernetes tokens, database credentials, and API keys from the compromised system |
| Lateral Movement via Kubernetes | T1570 | If Kubernetes service account token present, malware reads all cluster secrets and attempts to create privileged pods for persistence |

## IOCs

### Domains

```
models.litellm.cloud
checkmarx.zone
```

### Full URL Paths

```
https://checkmarx.zone/raw
```

### Splunk Format

```
"models.litellm.cloud" OR "checkmarx.zone" OR "https://checkmarx.zone/raw"
```

### Package Indicators

```
litellm 1.82.7 (PyPI)
litellm 1.82.8 (PyPI)
telnyx 4.87.1 (PyPI)
telnyx 4.87.2 (PyPI)
```

## Detection Recommendations

Monitor PyPI and npm for anomalous package versions; flag packages with version jumps or unexpected code changes. For LiteLLM users: immediately verify installed version via `pip show litellm`; check for ~/.config/sysmon directory and sysmon.service systemd units; audit SSH keys, cloud credentials, Kubernetes tokens. Implement package pinning for supply chain dependencies. Monitor outbound connections to models.litellm.cloud and checkmarx.zone. Review CI/CD logs for Trivy execution and credential extraction. Deploy EDR monitoring for systemd service creation and ~/.config directory writes by pip/Python processes.

## References

- [Datadog Security Labs] LiteLLM and Telnyx compromised on PyPI: Tracing the TeamPCP supply chain campaign (2026-03-27) — https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/
- [Snyk] How a Poisoned Security Scanner Became the Key to Backdooring LiteLLM (2026-03-31) — https://snyk.io/blog/poisoned-security-scanner-backdooring-litellm/
- [Repello AI] The LiteLLM supply chain attack: how TeamPCP backdoored the AI development ecosystem (2026-03-26) — https://repello.ai/blog/litellm-supply-chain-attack
- [Sonatype] Compromised litellm PyPI Package Delivers Multi-Stage Credential Stealer (2026-03-24) — https://www.sonatype.com/blog/compromised-litellm-pypi-package-delivers-multi-stage-credential-stealer
- [LiteLLM Official] Security Update: Suspected Supply Chain Incident (2026-03-24) — https://docs.litellm.ai/blog/security-update-march-2026
