# Sekoia Flowise Honeypot Shows Attacker Turning Stolen AI Agent Into Offensive Assistant

**Date:** 2026-10-20
**Tags:** llmjacking, malware

## Executive Summary

Sekoia TDR deployed a Flowise honeypot and observed a threat actor steal its credentials, then attempt to repurpose the hosted AI agent as an interactive offensive assistant. The actor submitted real reconnaissance data on Nightingale and Redis infrastructure to generate custom exploitation playbooks targeting regional deployments. Defenders running AI orchestration platforms should treat stored LLM credentials and agent tool bindings as high value targets and restrict agent access to enterprise data and tools.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Sekoia Flowise honeypot GenAI agent abuse |
| Attribution | Chinese speaking threat actor, assessed as opportunistic cybercrime (confidence: medium) |
| Target | Internet facing GenAI orchestration platforms, with targeting of unregulated online gambling infrastructure in Southeast Asia |
| Vector | Credential theft against an exposed Flowise instance |
| Status | active |
| First Observed | 2026-09-07 |

## Detailed Findings

According to Sekoia's TDR team, the researchers ran a decoy Flowise server to observe attacks against GenAI platforms and a threat actor stole its credentials and attempted to misuse the hosted AI agent. Sekoia reported that platforms such as Flowise sit between LLMs and enterprise databases, credentials, and API tools, which makes them attractive targets for credential theft and resource exploitation. The attacker used the LLM as an offensive assistant, supplying real world reconnaissance data from Nightingale and Redis infrastructure to generate custom exploitation playbooks and target analysis. According to Sekoia, linguistic indicators and observed tradecraft suggest a Chinese speaking actor focused on unregulated online gambling infrastructure in Southeast Asia, assessed as more consistent with opportunistic cybercrime than a bespoke APT operation. The material was originally distributed as a private FLINT report to Sekoia customers on 7 September 2026 and published publicly in October 2026. Sekoia did not publish attacker infrastructure IOCs in the public post reviewed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Valid Accounts | T1078 | Stolen Flowise instance credentials used to log in and drive the hosted AI agent |
| Unsecured Credentials | T1552 | Credentials stored in the exposed AI orchestration platform were harvested and reused |

## IOCs

### Domains

_No IOCs published in the public Sekoia post reviewed._

### Full URL Paths

_No IOCs published in the public Sekoia post reviewed._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Flowise
```

## Detection Recommendations

Inventory internet facing Flowise and similar AI orchestration deployments and require authentication. Monitor agent logs and LLM API calls for prompts containing reconnaissance data, vulnerability research, or exploitation planning, which is anomalous for business workflows. Treat LLM provider keys, database credentials, and tool bindings stored in these platforms as secrets to rotate on any suspected access, and alert on agent sessions issued from unexpected source addresses.

## References

- [Sekoia] A Honeypot's Tale: Deconstructing an Attack on GenAI Infrastructure (2026-10-19) — https://www.sekoia.com/blog/a-honeypots-tale-deconstructing-an-attack-on-genai-infrastructure
