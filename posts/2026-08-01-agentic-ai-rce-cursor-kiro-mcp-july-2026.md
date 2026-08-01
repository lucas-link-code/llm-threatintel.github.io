# Critical Agentic AI RCE Wave: Production Agents Exploited via Content Injection and Malicious Deeplinks

**Date:** 2026-08-01
**Tags:** mcp-security, prompt-injection, malicious-tool

## Executive Summary

July 2026 was the month when attacks on agentic AI stopped being a thought experiment, with four independent teams shipping working exploits against production agents in roughly ten days. Hidden one-pixel text on a web page made AWS Kiro rewrite its mcp.json and auto-launch an attacker MCP server, two CVSS 9.8 zero-click RCEs were discovered in Cursor IDE, and a separate Cursor deeplink flaw turned a review PR click into unsandboxed code execution.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Agentic AI RCE Coordination (July 2026) |
| Attribution | Multiple independent researchers and security teams (Adversa AI, Intezer, undisclosed teams) (confidence: medium) |
| Target | Cursor IDE, AWS Kiro, production MCP agents, AI development teams |
| Vector | Malicious MCP deeplinks, HTML content injection, MCP configuration poisoning, implicit file operations |
| Status | active |
| First Observed | 2026-07-22 |

## Detailed Findings

Adversa AI detailed DeepJack: nested cursor:// deeplinks plus arguments padded with whitespace push malicious MCP install commands off-screen in Cursor's confirm dialog, resulting in one-click unsandboxed RCE, still reproducible in build 3.9.8. Intezer researchers showed that hidden one-pixel text on a web page can make AWS Kiro rewrite its own mcp.json and auto-launch an attacker-controlled MCP server with developer privileges, assigned CVE-2026-10591 (CVSS 8.8/8.6) on July 22 and fixed in v0.11.130. Two additional CVEs (CVE-2026-50548 and CVE-2026-50549), both CVSS 9.8, were documented for zero-click injection through MCP or poisoned search results abusing working_directory or symlink canonicalization fallback to overwrite Cursor's sandbox helper. The attack surface is fundamentally asymmetric: attackers exploit content the agent reads (not code they run), making detection difficult.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Remote code execution via malicious MCP deeplinks and web content |
| Indirect Command Injection | T1059.007 | Malicious MCP configuration parameters and tool descriptions |
| Privilege Escalation | T1548 | Unsandboxed RCE with developer/service-role privileges via MCP |

## IOCs

### Domains

_No specific malware hashes or IOCs published; attacks are zero-click and infrastructure-agnostic. Fix versions: Cursor IDE (patched in later builds), AWS Kiro (v0.11.130+), protocol-level fixes required for MCP._

### Full URL Paths

_No specific malware hashes or IOCs published; attacks are zero-click and infrastructure-agnostic. Fix versions: Cursor IDE (patched in later builds), AWS Kiro (v0.11.130+), protocol-level fixes required for MCP._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cursor IDE (build <= 3.9.8)
AWS Kiro (version <= 0.11.129)
MCP protocol implementations (unpatched)
```

## Detection Recommendations

Monitor for unexpected MCP server connections initiated by cursor:// protocol handlers. Implement strict validation of MCP server manifests and block modification of mcp.json outside approved deployment pipelines. Log all tool invocations and MCP configuration changes at the host level. Implement content security policy (CSP) headers to prevent injection of invisible HTML text. Validate all deeplinks and URI handlers before invoking MCP operations. Disable cursor:// protocol handling for user-controlled content. Review agent sandbox escape techniques documented in OWASP Top 10 for Agentic Applications 2026.

## References

- [Adversa AI] Top Agentic AI security resources — August 2026 (2026-08-01) — https://adversa.ai/blog/top-agentic-ai-security-resources-august-2026/
- [Intezer Research] CVE-2026-10591: AWS Kiro MCP Configuration Poisoning via Hidden HTML Injection (2026-07-22) — https://adversa.ai/blog/top-agentic-ai-security-resources-august-2026/
- [Adversa AI] CVE-2026-50548 / CVE-2026-50549: Cursor IDE Sandbox Escape via Symlink Canonicalization (2026-07-31) — https://adversa.ai/blog/top-agentic-ai-security-resources-august-2026/
