# AhnLab Reports 40,000 Exposed OpenClaw Agent Instances and Hundreds of Malicious Skills

**Date:** 2026-11-23
**Tags:** shadow-ai, supply-chain, malicious-tool

## Executive Summary

AhnLab's AI Threat Trends Report states that 40,000 OpenClaw agent instances were found exposed on the internet and 35.4 percent of them were classified as vulnerable. An audit of one Skill marketplace found that 341 Skills were malicious. Defenders running OpenClaw or similar agent frameworks should locate and restrict internet exposed instances and vet marketplace Skills before agents load them.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Exposed OpenClaw Agent and Malicious Skill Ecosystem |
| Attribution | Unattributed (confidence: none) |
| Target | Organizations and individuals running internet facing OpenClaw agent instances |
| Vector | Internet exposed agent instances and malicious Skills distributed through a Skill marketplace |
| Status | active |
| First Observed | 2026-11 |

## Detailed Findings

According to AhnLab, 40,000 OpenClaw agent instances were found exposed on the internet and 35.4 percent of them were classified as vulnerable. AhnLab also reported that an audit of one Skill marketplace found that 341 of the Skills it examined were malicious. The report frames AI as both a weapon and a target, and the exposed instance and malicious Skill counts show that unmanaged agent deployments and unvetted Skill distribution are operating in the wild. AhnLab published the report on 2026-11-19 and updated it on 2026-11-23.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Internet exposed vulnerable OpenClaw agent instances reachable by attackers |
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Malicious Skills distributed through a Skill marketplace that agents load and act upon |

## IOCs

### Domains

_No specific package, domain, or file IOCs published in the summarized AhnLab findings; only aggregate exposure and Skill counts are provided._

### Full URL Paths

_No specific package, domain, or file IOCs published in the summarized AhnLab findings; only aggregate exposure and Skill counts are provided._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
OpenClaw agent framework
Agent Skill marketplaces
```

## Detection Recommendations

Discover and reduce internet exposure of OpenClaw and similar agent instances; require authentication and network restrictions on agent endpoints. Inventory installed Skills and remove any Skill whose publisher cannot be verified. Log agent outbound connections and flag Skills that direct data to external destinations. Track OpenClaw patch levels against reported vulnerabilities.

## References

- [AhnLab] AI Threat Trends Report: AI as Both Weapon and Target (2026-11-23) — https://www.ahnlab.com/en/contents/content-center/36410
