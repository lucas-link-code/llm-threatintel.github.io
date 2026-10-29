# Cisco Talos Discloses NIK C2, an AI Integrated Command and Control Framework Abusing the OpenAI Chat Completions API

**Date:** 2026-10-29
**Tags:** malicious-tool, malware

## Executive Summary

Cisco Talos observed a new AI integrated command and control framework called NIK C2 active in the wild, featuring a Go based 64 bit Windows implant that dumps credentials, streams victim keystrokes, and routes harvested data to an integrated OpenAI Chat Completions API client for analysis inside the compromised session. The implant also deploys screen locking ransomware demanding Bitcoin or USDT. Because collection and exploitation now occur in one continuous session, defenders must pivot to continuous behavioral monitoring rather than relying on offline processing delays for detection windows.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | NIK C2 |
| Attribution | Unknown (confidence: none) |
| Target | Windows hosts and any organization whose compromised endpoints can be monetized for credential theft and ransomware |
| Vector | Windows implant delivered to victim hosts, establishing dual channel command and control |
| Status | active |
| First Observed | 2026-10-29 |

## Detailed Findings

According to Cisco Talos, NIK C2 is a new AI integrated command and control framework observed in the wild containing a Windows implant that lets an actor dump credentials, stream the victim's keystrokes, and instruct an integrated AI model to analyze the harvested data, all within the compromised session. Talos reported that the framework abuses the OpenAI Chat Completions API, an HTTP endpoint that enables ChatGPT style conversations programmatically, and that the implant embeds a fully integrated OpenAI API client through its ai_generate command that manages API key resolution, request assembly, and response parsing locally before returning encrypted generative AI results to the actor's C2 panel. Talos assesses with moderate confidence that NIK C2 is not merely a proof of concept but a fully functional, AI integrated C2 framework. The NIK C2 implant is a Go based 64 bit Windows remote access tool that communicates over TLS secured WebSockets on port 443 alongside an HTTP fallback polling loop every 250 milliseconds, protects traffic with AES-256-GCM encryption derived from a hardcoded seed, and routes traffic across three prioritized C2 tiers consisting of runtime updated URLs, an embedded encrypted server list, and a hardcoded fallback address. Talos reported surveillance, theft, lateral movement, and evasion capabilities including credential dumping, RDP session hijacking, process hollowing, and a C2 driven screen lock ransomware module that produces a ransom demand in Bitcoin or USDT cryptocurrencies. Talos stated that NIK C2 collapses collection and exploitation into a single continuous session, erasing the offline processing delays that historically granted defenders detection windows, and that such frameworks require defenders to move beyond traditional detection toward continuous behavioral vigilance.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Web Protocols | T1071.001 | Implant communicates over TLS secured WebSockets on port 443 with an HTTP fallback polling loop every 250 milliseconds, blending C2 into normal web traffic. |
| Input Capture: Keylogging | T1056.001 | Implant streams the victim's keystrokes to collect sensitive data within the compromised session. |

## IOCs

### Domains

_Cisco Talos did not publish concrete network or file IOCs in the excerpt provided; consult the source report for any indicators._

### Full URL Paths

_Cisco Talos did not publish concrete network or file IOCs in the excerpt provided; consult the source report for any indicators._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
```

## Detection Recommendations

Monitor for Windows processes initiating outbound TLS sessions over WebSocket on port 443 that are immediately followed by HTTP polling at roughly 250 millisecond intervals, as this dual channel pattern is distinctive of the NIK C2 implant. Watch for API calls to OpenAI production inference endpoints originating from endpoint IP addresses instead of expected egress points, since the implant routes prompts through the victim machine. Alert on unexpected child processes performing credential dumping, RDP session hijacking, or process hollowing, and on rapid transitions from keystroke capture or credential access to screen lock ransomware behavior within a single session. Because collection and analysis are now continuous, prioritize behavioral detection over purely offline post hoc analysis, and apply user and entity behavior analytics to surface the collapse of collection and exploitation into one session.

## References

- [Cisco Talos] NIK C2: The new AI-enabled command-and-control framework (2026-10-29) — https://blog.talosintelligence.com/nik-c2-new-ai-enabled-framework/
