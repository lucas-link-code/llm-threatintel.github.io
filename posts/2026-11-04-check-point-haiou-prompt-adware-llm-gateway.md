# Check Point Research Names Haiou Jailbreak Bundle as Prompt Adware Injecting Ads for an LLM Gateway

**Date:** 2026-11-04
**Tags:** prompt-injection, malicious-tool, shadow-ai, supply-chain

## Executive Summary

Check Point Research analyzed the Haiou jailbreak bundle, a public prompt package targeting OpenAI Codex, and classified it as prompt adware because it persistently rewrites an agent trusted instructions and configuration files to inject advertisements for the author LLM gateway. The bundle also installs security focused Skills for penetration testing, cracking, reverse engineering and game security, and was observed in use by a cybercrime actor alongside Cobalt Strike, VulnClaw and the Ladon framework. Defenders should treat agent configuration artifacts and installed Skills as security relevant code, not benign text.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Haiou Jailbreak Bundle (Prompt Adware) |
| Attribution | haiou-666 (GitHub user), unattributed (confidence: low) |
| Target | Developers running OpenAI Codex, with a companion bundle for Claude Code |
| Vector | Publicly distributed jailbreak bundle hosted on GitHub that installs Skills and modifies global agent instruction and configuration files |
| Status | active |
| First Observed | 2026-11-03 |

## Detailed Findings

Check Point Research reported on 2026-11-03 that the Haiou bundle attempts to jailbreak a model using several prompt injection techniques, including context reframing that converts cybersecurity requests into an educational Capture The Flag scenario, refusal suppression, and role play. According to Check Point Research, the bundle also installs security related agent Skills covering penetration testing, cracking, reverse engineering and game security, and does not stop at jailbreak prompts but injects persistent advertisements for an LLM gateway website into global agent instruction files. Check Point Research defines prompt adware as a class of AI agent modification that persistently alters an agent trusted instructions such as global prompts, Skills or configuration files to influence future outputs for commercial or behavioral objectives, operating entirely through natural language in configuration artifacts rather than executable payloads. Check Point Research stated the advertised service is an opaque OpenAI compatible LLM gateway and that the likely business model is to use the freely distributed jailbreak bundle as an acquisition channel for the paid gateway service. Check Point Research stated there is no evidence linking the author to cybercrime, but noted the package is dual use, and that it observed the jailbreak being used by a cybercrime actor alongside Cobalt Strike, the VulnClaw agent and the Ladon framework. Check Point Research noted a recent study finding that some LLM gateways have snooped on user data, stolen secrets such as cloud access keys, and in some cases injected tool calls to execute code in the routed agent session, positioning LLM gateways as an LLM supply chain attack vector. Check Point Research stated the package is publicly available on GitHub where user haiou-666 hosts both a Codex version and a Claude Code version, and that as of writing only the Codex version appeared actively maintained and contained the ad injection mechanism.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Check Point Research states some LLM gateways have snooped on user data, stolen secrets and injected tool calls, positioning the advertised gateway and the bundle distribution channel as an LLM supply chain vector. |
| Event Triggered Execution | T1546 | The bundle persists advertisement injection by modifying global agent instruction and configuration files so injected instructions execute during subsequent agent responses. |

## IOCs

### Domains

_No attacker controlled domains, hashes, IPs or clean package identifiers were published by Check Point Research. The bundle is distributed from a GitHub account and the advertised gateway URL is not disclosed in the summary. Verify any indicators directly in the Check Point Research report before use._

### Full URL Paths

_No attacker controlled domains, hashes, IPs or clean package identifiers were published by Check Point Research. The bundle is distributed from a GitHub account and the advertised gateway URL is not disclosed in the summary. Verify any indicators directly in the Check Point Research report before use._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
OpenAI Codex
Claude Code
```

## Detection Recommendations

Treat agent Skills, global prompt files and other configuration artifacts as security relevant code and review them before enabling them in a developer environment. Inventory installed agent Skills and compare global instruction files against a known good baseline to catch advertisement or instruction injection. Restrict agents from loading Skills from public repositories without review. Monitor outbound connections from developer workstations to third party LLM gateway endpoints, since some gateways have been shown to snoop on user data and steal secrets. Because the bundle ships no executable payload, endpoint detection that only flags binaries will miss it, so add file integrity monitoring for agent configuration paths.

## References

- [Check Point Research] Free the Model, Sell the Gateway: Prompt Adware hidden in Jailbreak Bundles (2026-11-03) — https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/
- [Check Point Blog] Prompt Adware: A New AI Security Risk (2026-11-03) — https://blog.checkpoint.com/security/prompt-adware-how-hidden-ai-instructions-could-create-a-new-enterprise-security-risk/
