# MCP Supply Chain Attack: OX Security Discloses Critical Systemic Prompt Injection to RCE Vulnerability in Anthropic MCP STDIO Transport Affecting 150M+ Downloads and Six AI Coding Tools

**Date:** 2026-06-03
**Tags:** mcp-security, prompt-injection, malicious-tool

## Executive Summary

OX Security Research uncovered a critical, systemic vulnerability at the core of the Model Context Protocol (MCP)—the industry standard for AI agent communication created and maintained by Anthropic—which enables Arbitrary Command Execution (RCE) on any system running a vulnerable MCP implementation, granting attackers direct access to sensitive user data, internal databases, API keys, and chat histories. Cursor, VS Code, Windsurf, Claude Code, and Gemini-CLI are all vulnerable, with Windsurf (CVE-2026-30615) being the only IDE where exploitation required zero user interaction.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | MCP STDIO Prompt Injection to RCE Campaign |
| Attribution | Design Flaw (Not Attributed to Specific Threat Actor) (confidence: none) |
| Target | AI developers using Cursor, VS Code, Windsurf, Claude Code, Gemini CLI; enterprises running MCP servers |
| Vector | Malicious MCP server configuration files; prompt injection in STDIO protocol; zero-interaction exploitation in Windsurf |
| Status | active |
| First Observed | 2026-04-15 (OX Security disclosure) |

## Detailed Findings

The vulnerability is not a traditional coding error but an architectural design decision baked into Anthropic's official MCP SDKs across every supported programming language, including Python, TypeScript, Java, and Rust. The OX Security disclosure illustrated how design decisions made early in a protocol's life create systemic risk later; tool poisoning is the new prompt injection where attackers hide instructions inside tool metadata that the agent reads but the user cannot see. A prompt injection vulnerability in Windsurf 1.9544.26 allows remote attackers to execute arbitrary commands on a victim system; OX Security's full disclosure advisory covers 10 CVEs in MCP STDIO configurations. A 2026 disclosure exposed up to 200,000 vulnerable MCP instances across IDEs, internal tools, and cloud services.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1598 | Malicious instructions embedded in tool metadata and configuration files |
| Code Injection | T1059 | Arbitrary command execution via STDIO protocol parsing |
| Privilege Escalation | T1134 | RCE runs with privileges of the IDE or agent process |
| Data Exfiltration | T1041 | Access to API keys, chat histories, internal databases |
| Lateral Movement | T1570 | Compromised MCP server can access connected resources |

## IOCs

### Domains

_Specific CVE numbers and hashes not enumerated in available sources; OX Security maintains the full advisory_

### Full URL Paths

_Specific CVE numbers and hashes not enumerated in available sources; OX Security maintains the full advisory_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
CVE-2026-30615 (Windsurf)
10 CVEs in MCP STDIO configurations (OX Security full advisory)
```

## Detection Recommendations

Implement manifest-only execution in MCP SDKs (Anthropic's recommended fix); deploy command allowlists at the protocol level; require explicit approval for MCP server connections in all IDEs; monitor MCP JSON configuration files for suspicious tool definitions; scan MCP server repositories and packages for malicious tool metadata; implement sandboxing for MCP tool execution; require TLS for all MCP communications and cryptographic verification of server identity; upgrade all affected IDEs and code editors to patched versions; audit existing MCP deployments for unauthorized configuration changes.

## References

- [OX Security] The Mother of All AI Supply Chains: Critical, Systemic Vulnerability at the Core of the MCP (2026-04-15) — https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/
- [OX Security] MCP Supply Chain Advisory: RCE Vulnerabilities Across the AI Ecosystem (2026-04-17) — https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/
