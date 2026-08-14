# TeamPCP Supply Chain Campaign: Trivy Exposure Preceded Malicious LiteLLM and Telnyx Releases

**Date:** 2026-04-11
**Tags:** supply-chain

## Executive Summary

LiteLLM reported that versions 1.82.7 and 1.82.8 were maliciously published to PyPI on March 24, 2026 after an attacker obtained publishing access. An August 2026 SOCRadar review found that 2,085 of 2,188 attributable organization records predated the LiteLLM releases, placing most of the reconstructed exposure in the earlier Trivy compromise; defenders should treat the headline 2,500-plus organizations and roughly 434,000 CI/CD files as potential exposure, not confirmed compromise counts.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TeamPCP Supply Chain Campaign |
| Attribution | TeamPCP (threat group) (confidence: high) |
| Target | AI framework developers, LLM orchestration platforms, CI/CD infrastructure |
| Vector | Upstream Trivy compromise and stolen publishing credentials; exact LiteLLM PyPI publication path remains disputed |
| Status | active |
| First Observed | 2026-03-19 (Trivy); 2026-03-24 (LiteLLM); 2026-03-27 (Telnyx) |

## Detailed Findings

### March 2026 package compromise

LiteLLM's incident update reported that malicious versions 1.82.7 and 1.82.8 reached PyPI on March 24, 2026, were available for about 40 minutes, and were removed after the project learned of the incident. LiteLLM reported that initial evidence indicated the attacker bypassed the project's official CI/CD workflow by using a suspected compromised maintainer account. Datadog Security Labs separately reported that malicious Telnyx versions 4.87.1 and 4.87.2 were published on March 27.

Datadog Security Labs and Sonatype reported that the LiteLLM payload collected environment variables, SSH keys, cloud credentials, Kubernetes data, Docker configuration, shell history, database credentials, wallet files, and CI/CD secrets. Datadog Security Labs documented encrypted exfiltration to `models.litellm[.]cloud`, the `X-Filename: tpcp.tar.gz` header, persistence through `~/.config/sysmon/sysmon.py`, and a user-level `sysmon.service` systemd unit.

Datadog Security Labs reported that the Telnyx versions executed on import and downloaded a crafted WAV file from `83.142.209[.]203:8080/ringtone.wav`. The source documented a second-stage payload encoded in the audio frames and published the address and path as campaign IOCs.

### August 2026 exposure correction

SOCRadar reported on August 13 that row-level campaign data contained 2,188 attributable organization records spanning March 19 at 18:05 UTC through March 24 at 20:09 UTC. SOCRadar found that collection had already ended for 2,085 records, or 95 percent, before the malicious LiteLLM releases appeared; SecurityWeek reported that this timing aligns most of the observed exposure with the upstream Trivy compromise rather than the later LiteLLM installation window.

SOCRadar characterized the wider 2,500-plus organization and roughly 434,000 CI/CD-file figures as reconstructed potential exposure. SecurityWeek reported that the row-level set was rated 56 percent high confidence, 39 percent medium confidence, and 6 percent low confidence, with rounding; those figures do not establish 2,500 confirmed compromises or 434,000 successfully stolen files.

The exact LiteLLM publication path remains unresolved. LiteLLM's official account says its CI/CD workflow was bypassed and the packages were uploaded directly with a suspected compromised maintainer account, while SOCRadar describes the poisoned Trivy action flowing into the LiteLLM build environment. The supported conclusion is that the upstream Trivy compromise and stolen publishing credentials preceded the malicious LiteLLM releases; the available sources do not establish which publication path produced the PyPI artifacts.

### Hunting artifacts from the August review

SOCRadar published `litellm_init.pth`, `~/.config/sysmon/sysmon.py`, the repository names `tpcp-docs` and `docs-tpcp`, the prefix `tpcp-docs-`, release tags matching `data-<timestamp>`, and unexpected privileged `alpine:latest` pods in the `kube-system` namespace as hunting artifacts. These are behavioral pivots, not standalone network or hash IOCs, and they are intentionally excluded from the IOC feed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Compromised Trivy actions and malicious PyPI releases introduced credential-stealing code into trusted CI/CD and package workflows |
| Unsecured Credentials: Credentials In Files | T1552.001 | The payload collected SSH keys, cloud configuration, Kubernetes tokens, Docker configuration, shell history, and database credentials |
| Create or Modify System Process: Systemd Service | T1543.002 | The LiteLLM payload created a user-level `sysmon.service` unit for persistence |
| Exfiltration Over C2 Channel | T1041 | Collected data was encrypted and sent to the campaign's published exfiltration infrastructure |

## IOCs

### Domains

```
models.litellm[.]cloud
checkmarx[.]zone
```

### IP Addresses

```
83.142.209[.]203
```

### Full URL Paths

```
checkmarx[.]zone/raw
83.142.209[.]203:8080/ringtone.wav
```

### Splunk Format

```
"models.litellm.cloud" OR "checkmarx.zone" OR "checkmarx.zone/raw" OR "83.142.209.203" OR "83.142.209.203:8080/ringtone.wav"
```

### Package Indicators

```
litellm@1.82.7
litellm@1.82.8
telnyx@4.87.1
telnyx@4.87.2
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Audit historical CI/CD telemetry beginning March 19, not only the March 24 LiteLLM installation window. Search runner filesystems and EDR telemetry for `litellm_init.pth`, `~/.config/sysmon/sysmon.py`, and user-level `sysmon.service` creation; review Git activity for `tpcp-docs`, `docs-tpcp`, `tpcp-docs-`, and `data-<timestamp>` naming. In Kubernetes audit logs, investigate privileged `alpine:latest` pods created in `kube-system`. Monitor proxy or DNS logs for the published campaign domains and Telnyx WAV endpoint, remove the four malicious package versions, and rotate every credential accessible to affected Trivy or Python build environments.

## References

- [Datadog Security Labs] LiteLLM and Telnyx compromised on PyPI: Tracing the TeamPCP supply chain campaign (2026-03-27) — https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/
- [Snyk] How a Poisoned Security Scanner Became the Key to Backdooring LiteLLM (2026-03-31) — https://snyk.io/blog/poisoned-security-scanner-backdooring-litellm/
- [Repello AI] The LiteLLM supply chain attack: how TeamPCP backdoored the AI development ecosystem (2026-03-26) — https://repello.ai/blog/litellm-supply-chain-attack
- [Sonatype] Compromised litellm PyPI Package Delivers Multi-Stage Credential Stealer (2026-03-24) — https://www.sonatype.com/blog/compromised-litellm-pypi-package-delivers-multi-stage-credential-stealer
- [LiteLLM Official] Security Update: Suspected Supply Chain Incident (2026-03-24) — https://docs.litellm.ai/blog/security-update-march-2026
- [SOCRadar] LiteLLM Supply Chain Attack (2026-08-13) — https://socradar.io/blog/litellm-supply-chain-attack/
- [SecurityWeek] Trivy, Not LiteLLM Behind the 2,500 Org Compromise (2026-08-14) — https://www.securityweek.com/trivy-not-litellm-behind-the-2500-org-compromise/
