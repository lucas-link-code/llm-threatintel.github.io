# Anthropic MCP Architectural RCE Flaw Exposes 150M+ Downloads and 7,000+ Servers to Command Injection

**Date:** 2026-05-08
**Tags:** supply-chain, malicious-tool, mcp-security, prompt-injection

## Executive Summary

OX Security researchers uncovered an architectural RCE vulnerability in Anthropic's Model Context Protocol affecting 150M+ downloads and baked into official MCP SDKs across every supported programming language, with the vulnerability rippling through a supply chain with 7,000+ publicly accessible servers and up to 200,000 vulnerable instances in total. The systemic vulnerability enables Arbitrary Command Execution (RCE) on any system running a vulnerable MCP implementation, granting attackers direct access to sensitive user data, internal databases, API keys, and chat histories, and is baked into Anthropic's official MCP software development kit (SDK) across any supported language, affecting more than 7,000 publicly accessible servers and software packages totaling more than 150 million downloads.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | MCP STDIO Command Injection Supply Chain Exposure |
| Attribution | Design flaw in Anthropic MCP implementation; exploitation vectors identified and disclosed by OX Security (confidence: high) |
| Target | Developers using MCP protocol across IDEs (Cursor, VS Code, Windsurf, Claude Code, Gemini-CLI), AI agent frameworks, and third-party MCP servers |
| Vector | Unauthenticated command injection via STDIO-based MCP configurations; prompt injection in AI IDEs; malicious MCP marketplace distribution |
| Status | active |
| First Observed | 2026-04-16 |

## Detailed Findings

The root issue lies in MCP, an open source protocol originally developed by Anthropic that LLMs, AI applications, and agents use to connect to external data, systems, and one another, with MCP working across programming languages—any developer using Anthropic's official MCP software development kit across any supported language, including Python, TypeScript, Java, and Rust, inherits this vulnerability, and MCP uses STDIO (standard input/output) as a local transport mechanism for an AI application to spawn an MCP server as a subprocess but in practice lets anyone run any arbitrary OS command, if the command successfully creates an STDIO server it will return the handle, but when given a different command, it returns an error after the command is executed. Four distinct families of exploitation exist: unauthenticated UI injection in popular AI frameworks, hardening bypasses in protected environments like Flowise, zero-click prompt injection in leading AI IDEs (Windsurf, Cursor), and malicious marketplace distribution with 9 out of 11 MCP registries successfully poisoned with a malicious trial balloon. Anthropic declined to modify the protocol's architecture, citing the behavior as 'expected,' and researchers say a root patch could have reduced risk across software packages totaling more than 150 million downloads and protected millions of downstream users.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command Injection | T1059 | Arbitrary OS command execution via STDIO-based MCP configuration parameters without input validation |
| Prompt Injection | T1598 | Zero-click prompt injection in Windsurf (CVE-2026-30615) and other AI IDEs to modify MCP JSON configuration and register malicious STDIO servers |
| Supply Chain Compromise | T1195 | MCP server package repositories poisoned with malicious servers; affects 150M+ dependency downloads and 7,000+ exposed servers |

## IOCs

### Domains

_CVEs issued for individual implementations: CVE-2025-49596 (MCP Inspector), CVE-2026-22252 (LibreChat), CVE-2026-22688 (WeKnora), CVE-2025-54994 (@akoskm/create-mcp-server-stdio), CVE-2025-54136 (Cursor), CVE-2026-30615 (Windsurf), CVE-2026-30625 (Upsonic), GHSA-c9gw-hvqq-f33r (Flowise). Root issue is in Anthropic's MCP SDK, not separately CVE'd._

### Full URL Paths

_CVEs issued for individual implementations: CVE-2025-49596 (MCP Inspector), CVE-2026-22252 (LibreChat), CVE-2026-22688 (WeKnora), CVE-2025-54994 (@akoskm/create-mcp-server-stdio), CVE-2025-54136 (Cursor), CVE-2026-30615 (Windsurf), CVE-2026-30625 (Upsonic), GHSA-c9gw-hvqq-f33r (Flowise). Root issue is in Anthropic's MCP SDK, not separately CVE'd._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
@anthropic-ai/sdk (all versions with MCP support)
langflow (all versions)
gpt-researcher
upsonic
flowise
```

## Detection Recommendations

Monitor for: (1) MCP STDIO configurations in IDE and framework settings that reference user-controlled or untrusted command paths; (2) direct or indirect prompt injection attempts that reference .mcp.json or MCP configuration files; (3) MCP server registrations from suspicious or newly-added packages; (4) command execution from MCP-spawned subprocesses with unusual parameters or destination IPs; (5) access to system binaries or shell interpreters from MCP client processes. Defenders should assume all MCP-connected agents have access to command execution unless explicitly sandboxed. Implement network segmentation and least-privilege IAM for systems running vulnerable MCP implementations.

## References

- [OX Security Blog] The Mother of All AI Supply Chains: Critical, Systemic Vulnerability at the Core of Anthropic's MCP (2026-05-06) — https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/
- [The Hacker News] Anthropic MCP Design Vulnerability Enables RCE, Threatening AI Supply Chain (2026-04-23) — https://thehackernews.com/2026/04/anthropic-mcp-design-vulnerability.html
- [The Register] MCP 'design flaw' puts 200k servers at risk: Researcher (2026-04-16) — https://www.theregister.com/2026/04/16/anthropic_mcp_design_flaw/
- [OX Security Blog (MCP Supply Chain Advisory)] MCP Supply Chain Advisory: RCE Vulnerabilities Across the AI Ecosystem (2026-04-23) — https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/
