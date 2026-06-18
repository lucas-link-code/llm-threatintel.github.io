# LLMjacking Evolved: Attacker Deploys Autonomous Offensive Tool Against Exposed Ollama Servers

**Date:** 2026-06-18
**Tags:** llmjacking, malware

## Executive Summary

On June 12, 2026, the Sysdig Threat Research Team observed a threat actor abusing an internet-exposed, unauthenticated Ollama model server as the inference engine for VAPT, an autonomous multi-stage offensive security framework. Unlike prior LLMjacking operations that stole AI compute for resale, this actor wired hijacked inference capacity directly into a software pipeline that fingerprints services, synthesizes exploits, crafts SQL injection payloads, extracts credentials, and confirms remote code execution without human direction between stages. The tool was observed under active development against private practice ranges, indicating pre-operational maturity work. Defenders running self-hosted model servers must treat unauthenticated internet-reachable Ollama instances as compromised execution engines, not merely a billing liability.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | VAPT autonomous offensive framework |
| Actor / Attribution | Unknown; residential IP cluster, Hyderabad, India (confidence: low) |
| Target | Internet-exposed Ollama servers (port 11434, no authentication); private practice ranges during observed sessions |
| Vector | Unauthenticated Ollama API access; no CVE — pure configuration exposure |
| Status | active |
| First Observed | 2026-06-12 |

## Detailed Findings

According to Sysdig Threat Research Team, on June 12, 2026, a threat actor originating from IP 122.183.48.82 (residential ISP, Hyderabad, India) connected to an Ollama server exposed on port 11434 and began driving an automated offensive pipeline against private-range targets. The session ran approximately eight and a half hours. On June 14, the same tool returned across three additional IPs in the same /24 (122.183.48.35, 122.183.48.195) and a second residential provider (47.15.69.15). Sysdig attributes all four sessions to a single actor based on identical tooling, private benchmark targets, and shared Indian residential origin.

Because the VAPT framework sends its full instruction set to the model on every request, Sysdig captured the complete pipeline architecture from the inference server's traffic. The tool identifies itself through a compromise-confirmation routine that executes `echo VAPTb3gin; id; echo VAPTfin` and looks for the sentinel strings bracketing the output of `id`. This marker pair is characteristic of automated exploit tooling and is a clean EDR and network detection anchor.

### Pipeline Architecture

Sysdig documented the following discrete stages, each imposing a strict JSON output contract on the model so the surrounding software can consume results deterministically:

Service fingerprinting: Normalizes nmap service banners into precise CPE identities for vulnerability lookup, returning `{"vendor":"","product":"","version":"","cpe23":"","confidence":""}` — explicitly instructed never to invent version strings.

Vulnerability matching and applicability triage: Matches pinned product/version against candidate CVEs, filters to applicable entries.

Web reconnaissance: Consumes a full observation bundle (page text, HTML comments, headers, decoded cookies, forms, parameters) and emits candidate paths and parameters for downstream exploitation.

Proof-of-concept synthesis: Builds protocol-aware PoCs including a backdoored service that opens a second port only after a trigger payload is received.

Blind SQL injection crafting: Infers the target input filter from timing probes and constructs time-based blind SQL injection templates with filter-evasion logic. Uses operators such as `||`, `IF()/CASE`, `/**/` space substitution, and mixed-case evasion when the word `OR` or `AND` is detected as filtered.

Credential and secret extraction: Parses looted configuration files, environment files, and source code for every username, password, API key, and connection string. Sysdig reports this was the most-invoked stage, run over a hundred times across the June 12 session.

Arbitrary file-read planning: Given a file-read primitive, plans which files to retrieve.

Privilege escalation: Selects the next escalation command.

Autonomous orchestration: A controller stage that drives the full chain until it achieves command execution, framed as an "authorized pentester" to keep the model cooperative. Exposes a fixed tool surface (`request(method, path, headers, cookies, query, body)`), payload builders for JWT forgery and PHP object injection gadgets, and sweep primitives (`ssrf_scan`, `object_injection_scan`). Once a probe returns `uid=`, the confirmed request is frozen as a reusable recipe with the command field parameterized as `__VAPTCMD__`.

A second orchestrator variant exposes a "PROPOSE-ONLY" split where the model only suggests candidate payloads while a separate `oracles.py` verifier decides whether anything triggered, implementing what the tool calls a "zero-false-positive invariant." Naming an internal source file inside a system prompt is the signature of maintained software, not a throwaway script.

### Tool Maturity and Intent

The pipeline grew across the June 12 session, adding stages roughly three hours in and continuing through the final ninety minutes. Individual stages were rewritten in place across multiple versions. When the tool returned on June 14, the full stage set from June 12 was present from the first requests. Sysdig assesses this as a developer iterating on a maturing tool against a benchmark range, not a finished product in production use against live victims.

All targets observed were private RFC 1918 addresses. On June 14, the actor pointed the tool at `10.129.0.0/16`, the address space used by HackTheBox penetration-testing labs. No public host appeared as a target.

### Backend Agnosticism

The framework requested at least seven distinct models by name across the campaign: gpt-4o-mini (OpenAI), claude-3-5-sonnet (Anthropic), gemini-2.0-flash-exp (Google), mistral:7b, deepseek-r1:8b, qwen3.5:4b, and an abliterated Llama-3.3-70B. The three commercial model names cannot run on Ollama; their presence confirms the tool was originally built for paid APIs and was simply redirected at the free, unauthenticated Ollama server as a cost-free substitute. This is the same economic substitution that defines traditional LLMjacking.

According to Sysdig, independent researchers have catalogued approximately 175,000 publicly exposed Ollama instances across more than 130 countries. These instances are no longer solely a billing risk; this case demonstrates they function as free, unattributed execution engines for autonomous offensive tooling.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Resource Hijacking | T1496 | Unauthenticated Ollama server used as free inference engine for offensive pipeline |
| Automated Exfiltration | T1020 | Credential extraction stage parses looted files and returns structured results to pipeline |
| Network Service Discovery | T1046 | Service fingerprinting stage normalizes banners from port scans into CPE identities |
| Exploitation for Privilege Escalation | T1068 | Privilege escalation stage selects next command after initial RCE confirmed |
| Exploit Public-Facing Application | T1190 | Web reconnaissance and SQL injection stages target externally reachable services |
| Command and Scripting Interpreter | T1059 | RCE confirmation via shell command echoing VAPTb3gin/VAPTfin sentinels |
| Unsecured Credentials | T1552 | Credential extraction stage targets env files, configs, source code, connection strings |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### IP Addresses

```
122.183.48.82
122.183.48.35
122.183.48.195
47.15.69.15
```

### File Hashes

```
No hash IOCs published by source
```

### Behavioral IOCs (Strings/Patterns)

```
VAPTb3gin
VAPTfin
__VAPTCMD__
echo VAPTb3gin; id; echo VAPTfin
```

## Detection Recommendations

EDR: Alert on Python or similar interpreter processes making outbound HTTPS connections to model API endpoints (api.openai.com, api.anthropic.com, generativelanguage.googleapis.com, or any host on port 11434) followed within seconds by shell execution. The combination of LLM API call followed by command execution is the core behavioral signature.

Network: Alert on inbound connections to port 11434 from external IPs. Ollama should never be internet-reachable. If port 11434 is reachable from the internet, treat the server as compromised. Block outbound access to port 11434 on all non-developer hosts.

Network pattern: Query HTTP requests to an internal Ollama server (GET /api/tags, POST /api/chat, POST /api/generate) from external source IPs. Log the full request body; VAPT sends its stage instructions in the `messages` array, which exposes the pipeline architecture.

Firewall: Block all inbound access to port 11434. Ollama's default configuration binds to all interfaces with no authentication.

String-based: SIEM or EDR rule matching process output or command arguments containing `VAPTb3gin` or `VAPTfin`. These strings are unique to this framework and should not appear in legitimate tooling.

SIEM hunt: Review any system where an AI model inference endpoint was reachable to external IPs. Pull model server access logs for any session exceeding 50 requests in a single connection — this framework makes hundreds of calls per stage sequence.

## References

- [Sysdig TRT] LLMjacking evolved: Attackers are using stolen AI compute to build offensive agentic tools (2026-06-17) — https://www.sysdig.com/blog/llmjacking-evolved-attackers-are-using-stolen-ai-compute-to-build-offensive-agentic-tools
- [Sysdig TRT] AI agent at the wheel: How an attacker used LLMs to move from a CVE to an internal database in 4 pivots (2026-05-10) — https://www.sysdig.com/blog/ai-agent-at-the-wheel-how-an-attacker-used-llms-to-move-from-a-cve-to-an-internal-database-in-4-pivots
- [Sysdig TRT] LLMjacking: From Emerging Threat to Black Market Reality (2026) — https://www.sysdig.com/blog/llmjacking-from-emerging-threat-to-black-market-reality
