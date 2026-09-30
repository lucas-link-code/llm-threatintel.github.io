# CLOSEDQUORUM Windows Implant Delegates Command and Control to a Panel of Four Commercial LLMs

**Date:** 2026-09-30
**Tags:** malicious-tool, malware

## Executive Summary

Cisco Talos documented CLOSEDQUORUM, the first publicly reported Windows implant to delegate tactical command and control to a quorum of commercial large language models including DeepSeek, Qwen, Mistral, and Google Gemini. It runs an autonomous decision loop with no human operator and no dedicated attacker server, targeting LSASS credentials, browser passwords, and crypto wallets with exfiltration to a Discord webhook. The publicly distributed build contains placeholder API keys and a dummy webhook, so end to end execution was not observed, but defenders should hunt the correlated behaviors Talos published.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | CLOSEDQUORUM |
| Attribution | Unknown, possibly a single developer connected to 2025 carding forum postings (confidence: low) |
| Target | Windows users, with credential, browser password, and cryptocurrency wallet theft as the objective |
| Vector | Operator configured Windows implant distributed independently by the operator, with LLM API keys and a Discord webhook injected at compile time |
| Status | active |
| First Observed | 2026-06-17 |

## Detailed Findings

According to Cisco Talos, CLOSEDQUORUM is the first publicly documented Windows implant to apply an autonomous model to tactical command and control. After deployment it queries up to four LLM providers in sequence, tallies their independent verdicts, and executes the winning decision, which the implant represents as one of inject, persist, steal, or move. Talos reported the quorum is DeepSeek, Qwen, Mistral, and Google Gemini, with plurality voting implemented in a function named main.interModelDiscussion and a decision schema embedded as decision: inject, persist, steal, or move. The binary contains the hardcoded system prompt instructing the model to act as an advanced malware strategist and provide only executable decisions. The behavior set includes main.lsassDump for LSASS credential extraction, main.dumpBrowserCredentials targeting Chrome, Edge, and Firefox saved passwords, and main.extractCryptoWallets hitting MetaMask, Exodus, and Ethereum wallet paths, plus main.earlyBirdInject and a process hollowing path. Talos said stolen credentials are exfiltrated to the operator's Discord channel with AES 256 GCM using a daily rotating key derived from the message timestamp, which Talos noted is obfuscation rather than true separation between developer and operator. The publicly observed distribution build is an inert template with dummy_api_key and a dummy webhook URL, so Talos did not observe a complete end to end execution, though development builds demonstrated build time injection of provider credentials. Talos assessed this as a credentials as a service model whose differentiator is the autonomous LLM orchestration layer, and stated it has no confirmation of in the wild deployment. Talos renamed the binary from BALZAK on 2026-07-03 and published detection rule art with VT SHA256 250d4fa37488af9b025333fa17705573d721467b203765bc360890b4f5a90cd7 and static analysis dated 2026-06-17.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Application Layer Protocol: Web Protocols | T1071.001 | The implant replaces a traditional command and control endpoint with HTTPS calls to commercial LLM provider APIs for tasking decisions |
| OS Credential Dumping: LSASS Memory | T1003.001 | The main.lsassDump routine extracts Windows domain and local credentials from process memory |

## IOCs

### Domains

```
api.deepseek.com
```

### Full URL Paths

_Domains are the legitimate LLM provider and Discord API endpoints the implant calls, per the Talos detection rule, and are listed for correlation only, not as attacker owned infrastructure. The hash is the VirusTotal sample referenced by Talos._

### Splunk Format

```
"api.deepseek.com"
```

### File Hashes

```
250d4fa37488af9b025333fa17705573d721467b203765bc360890b4f5a90cd7
```

### Affected Platforms

```
Windows
```

## Detection Recommendations

Hunt the correlated behavior set rather than any single indicator: an unexpected executable on a developer or user workstation making DNS lookups to DeepSeek, Qwen, OpenRouter, Mistral, Gemini, or Discord endpoints while also opening LSASS, browser credential stores, or wallet paths. Look for the hardcoded system prompt string and the gohno-final.exe build artifact with developer API key fields in Go build metadata. Detect process hollowing and early bird injection patterns accompanying those network calls, and monitor for WMI persistence at main.establishPersistence, which Talos noted has no handler in the distribution build. Apply the Talos CLOSEDQUORUM_LLM_Autonomous_Implant rule and use TLS inspection or egress control where policy permits to correlate LLM provider API use by non browser processes.

## References

- [Cisco Talos] The Closed Quorum: Inside the first reported autonomous AI C2 implant (2026-09-22) — https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/
