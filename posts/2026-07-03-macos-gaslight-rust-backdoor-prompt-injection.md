# macOS.Gaslight: DPRK-Aligned Rust Backdoor Uses Prompt Injection Against LLM-Assisted Malware Triage

**Date:** 2026-07-03
**Tags:** apt, malware, prompt-injection

## Executive Summary

SentinelLABS analyzed macOS.Gaslight, a Rust-based macOS implant that combines Telegram Bot API command-and-control, AES-GCM encrypted payloads, certificate-pinned TLS, interactive shell access, and browser/keychain collection. The implant embeds a 3.5 KB prompt-injection payload composed of fabricated system messages intended to derail LLM-assisted malware triage. SentinelLABS assesses with high confidence that macOS.Gaslight belongs to a DPRK-aligned macOS activity cluster.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | macOS.Gaslight |
| Attribution | DPRK-aligned macOS activity (SentinelLABS high confidence) |
| Target | macOS systems; analysts and automated triage pipelines using LLM-assisted malware analysis |
| Vector | Rust Mach-O implant with Telegram Bot API C2 and embedded prompt-injection content |
| Status | active |
| First Observed | 2026-05-22 |

## Detailed Findings

macOS.Gaslight is an ad hoc signed Mach-O implant written in Rust. Apple XProtect identified the sample through the MACOS_BONZAI_COBUCH rule after a VirusTotal upload on May 22, 2026. SentinelLABS links the implant to DPRK-aligned macOS activity through the BONZAI signature family and related AIRPIPE/BONZAI samples.

The implant uses Telegram Bot API `getUpdates` polling for C2. It treats Telegram `Conflict` responses as a single-instance lock, encrypts payloads with AES-GCM, and pins TLS through a custom trust anchor. The runtime configuration supplies Telegram room ID, bot token material, AES key, upload URLs, persistence names, payload paths, and platform-specific options. The binary self-redacts the Telegram bot token in its own runtime output, limiting token recovery from logs or crash artifacts.

Operator functionality includes `help`, `id`, `shell`, `kill`, `upload`, and `stop`, with evidence of a possible `focus` command. The implant creates a power-management assertion to prevent system sleep and maintain long-running polling. Its embedded Python collection module targets Chrome, Brave, Firefox, Safari, Terminal histories, installed application inventory, running process lists, system profile output, and a raw copy of `login.keychain-db`, then stages collection as `temp/collected_data.zip` for Telegram upload.

The LLM-specific feature is defensive evasion against analysis workflows, not a sandbox escape. The implant carries fabricated "system" messages designed to convince an LLM-assisted triage process that the session is invalid, unsafe, or must be aborted. This positions prompt injection as an anti-analysis layer for malware families expected to be reviewed by AI-assisted analyst tooling.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter: Unix Shell | T1059.004 | Interactive shell command execution through the implant |
| Command and Scripting Interpreter: Python | T1059.006 | Embedded Python collection module executed by the implant |
| Create or Modify System Process: Launch Agent | T1543.001 | Runtime config includes macOS persistence fields |
| Data from Local System | T1005 | Browser data, Terminal histories, system profile, process list, and application inventory collection |
| Credentials from Password Stores | T1555 | Collection includes raw `login.keychain-db` copy |
| Application Layer Protocol: Web Protocols | T1071.001 | Telegram Bot API C2 over HTTPS |
| Encrypted Channel | T1573 | AES-GCM payload encryption and pinned TLS |
| Obfuscated Files or Information | T1027 | Embedded prompt-injection content attempts to mislead LLM-assisted analysis |

## IOCs

### Domains

_No specific malicious domains published. C2 uses Telegram Bot API infrastructure with operator-supplied bot configuration._

### Full URL Paths

_No specific malicious URL path IOCs published._

### Splunk Format

_No domain or URL IOCs available for Splunk query_

### File Hashes

SHA256
```
6328567511d88fdc2ae0939c5ef17b7a63d2a833881900de018a4f12f4982525
77b4fd46994992f0e57302cfe76ed23c0d90101381d2b89fc2ddf5c4536e77ca
baabf249c77bc54c54ab0e66e15af798bd28aa5b4683554456a8b73ab8741239
b3c56d689414343589f38394d19ba2fe9a518133281200faa0556ba4e4136394
```

### Affected Platforms

```
macOS
LLM-assisted malware triage workflows
```

## Detection Recommendations

Block or alert on the SHA256 values above. Hunt for ad hoc signed Rust Mach-O binaries with the identifier `endpoint-macos-aarch64-5555494492fc075f441637fb9d894913dde3a2ea`. Monitor macOS processes that create `IOPMAssertionCreateWithName` assertions while polling Telegram Bot API endpoints. Alert on unsigned or ad hoc signed binaries reading browser profile data, Terminal history files, `system_profiler` output, process lists, and `login.keychain-db` in the same execution window. Inspect suspicious macOS malware samples for embedded prompt-injection strings that claim the analysis session is invalid, unsafe, or must be terminated.

## References

- [SentinelOne] macOS.Gaslight | Rust Backdoor Turns Prompt Injection on the Analyst, Not the Sandbox (2026-06-23) - https://www.sentinelone.com/labs/macos-gaslight-rust-backdoor-turns-prompt-injection-on-the-analyst-not-the-sandbox/
