# Anthropic MCP Design Vulnerability Enables Unauthenticated RCE Across 7,000+ Servers

**Date:** 2026-04-22
**Tags:** malicious-tool, supply-chain

## Executive Summary

Cybersecurity researchers discovered a critical "by design" weakness in the Model Context Protocol's (MCP) architecture that could pave the way for remote code execution, enabling Arbitrary Command Execution (RCE) on any system running a vulnerable MCP implementation, granting attackers direct access to sensitive user data, internal databases, API keys, and chat histories. The systemic vulnerability is baked into Anthropic's official MCP software development kit (SDK) across any supported language, including Python, TypeScript, Java, and Rust, affecting more than 7,000 publicly accessible servers and software packages totaling more than 150 million downloads.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | MCP STDIO Unauthenticated Command Injection |
| Attribution | Unknown (Design Flaw) (confidence: none) |
| Target | Organizations running Anthropic MCP servers, AI agents, coding assistants (Claude Code, Cursor, LibreChat, WeKnora, etc.) |
| Vector | Unauthenticated HTTP requests to MCP marketplace endpoints triggering STDIO configuration parsing |
| Status | active |
| First Observed | 2026-04-21 |

## Detailed Findings

Attackers can inject unauthenticated commands through MCP marketplaces via network requests, triggering hidden STDIO configurations. Anthropic's Model Context Protocol gives a direct configuration-to-command execution via their STDIO interface on all of their implementations, regardless of programming language. In practice it actually lets anyone run any arbitrary OS command—if the command successfully creates an STDIO server it will return the handle, but when given a different command, it returns an error after the command is executed. Vulnerabilities based on the same core issue have been reported independently over the past year, including CVE-2025-49596 (MCP Inspector), CVE-2026-22252 (LibreChat), CVE-2026-22688 (WeKnora), CVE-2025-54994 (@akoskm/create-mcp-server-stdio), and CVE-2025-54136 (Cursor).

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command Injection | T1059 | Remote command execution via malformed STDIO configuration |
| Supply Chain Compromise | T1195 | Affects 7,000+ MCP servers and 150M+ package downloads |

## IOCs

### Domains

_No IOCs published; vulnerability is architectural in Anthropic's official MCP SDK_

### Full URL Paths

_No IOCs published; vulnerability is architectural in Anthropic's official MCP SDK_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
mcp-inspector
librechat
weknora
@akoskm/create-mcp-server-stdio
cursor-mcp
```

## Detection Recommendations

Monitor for unusual process spawning from MCP server processes; audit MCP marketplace connections for unexpected STDIO command patterns; ensure MCP servers run in network-isolated environments or behind authentication layers; scan for MCP server exposure using asset inventory tools; monitor WebSocket traffic to /terminal/ws or equivalent endpoints for suspicious patterns.

## References

- [The Hacker News] Anthropic MCP Design Vulnerability Enables RCE, Threatening AI Supply Chain (2026-04-21) — https://thehackernews.com/2026/04/anthropic-mcp-design-vulnerability.html
- [OX Security Research] Unauthenticated command injection through MCP marketplaces via network requests (2026-04-21) — https://thehackernews.com/2026/04/anthropic-mcp-design-vulnerability.html
