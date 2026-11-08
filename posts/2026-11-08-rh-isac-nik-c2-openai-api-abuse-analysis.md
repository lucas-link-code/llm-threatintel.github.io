# RH-ISAC Analysis Details NIK C2 ai_generate Command and OPENAI_API_KEY Harvesting on Victim Hosts

**Date:** 2026-11-08
**Tags:** malware, llmjacking

## Executive Summary

RH-ISAC published a threat intel analysis on 2026-11-02 detailing NIK C2, a Go based Windows command and control framework that integrates the OpenAI Chat Completions API through an ai_generate command so operators can issue prompts from an infected host. The analysis states the implant can use an attacker supplied API key or attempt to read the OPENAI_API_KEY environment variable from the victim, which shifts API consumption and billing onto a compromised account. Defenders should monitor for unexpected outbound calls to the OpenAI API from Windows endpoints, alert on processes reading OPENAI_API_KEY, and rotate any exposed AI API keys found in host environments.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | NIK C2 |
| Attribution | Unknown, operational framework assessed by Cisco Talos and analyzed by RH-ISAC (confidence: low) |
| Target | Windows systems operated by organizations with exposed AI API credentials or attacker supplied keys |
| Vector | Command and control implant with OpenAI Chat Completions API integration; key sourcing via operator supply or victim environment variable |
| Status | active |
| First Observed | 2026-10-29 |

## Detailed Findings

RH-ISAC published a cyber threat intel analyst write up on 2026-11-02 covering NIK C2, a Go based Windows command and control framework originally identified by Cisco Talos on 2026-10-29. According to RH-ISAC, the implant combines credential theft, surveillance, remote access, lateral movement, defense evasion, and screen locking ransomware capabilities in a single binary. RH-ISAC reported that NIK C2 integrates the OpenAI Chat Completions API through an ai_generate command, allowing operators to submit prompts from a compromised system and process the model responses through their C2 infrastructure. RH-ISAC stated that if no API key is supplied by the operator, the malware attempts to retrieve the OPENAI_API_KEY environment variable from the victim host, which would let a compromised credential be used for the requests and shift API usage and associated activity to the victim account. RH-ISAC noted Talos identified at least three implant versions and active C2 infrastructure, and assessed with moderate confidence that NIK C2 is an operational framework rather than a proof of concept. RH-ISAC did not publish new network IOCs in the analyzed excerpt, so defenders should rely on behavioral detection for the AI API abuse path.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | The implant attempts to read the OPENAI_API_KEY environment variable from the victim host when no operator supplied key is available. |
| Application Layer Protocol: Web Protocols | T1071.001 | Operators submit prompts and receive responses through the OpenAI Chat Completions API as a C2 communication channel. |

## IOCs

### Domains

_No IOCs published in the RH-ISAC analysis excerpt. The underlying Cisco Talos report describes active C2 infrastructure but no concrete indicators were available in the reviewed text._

### Full URL Paths

_No IOCs published in the RH-ISAC analysis excerpt. The underlying Cisco Talos report describes active C2 infrastructure but no concrete indicators were available in the reviewed text._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
```

## Detection Recommendations

Alert on Windows processes making unusual direct outbound HTTPS connections to the OpenAI API from hosts that do not normally run AI clients, and correlate with command line arguments containing ai_generate. Monitor for process access or reads of the OPENAI_API_KEY environment variable outside sanctioned AI tooling. Inventory and rotate AI provider API keys on any host with suspected NIK C2 activity, and watch for unexpected spikes in OpenAI API usage or billing that would indicate key theft. Because RH-ISAC published no new network indicators, prioritize behavioral detections over static signatures.

## References

- [RH-ISAC] Hackers Weaponize OpenAI API in NIK C2 Framework for System Control (2026-11-02) — https://rhisac.org/general-blog/hackers-weaponize-openai-api-in-nik-c2-framework-for-system-control/
