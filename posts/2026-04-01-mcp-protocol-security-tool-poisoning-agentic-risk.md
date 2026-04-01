# MCP Protocol Security Crisis: Tool Poisoning, Shadow Servers, and Agentic AI Attack Surface

**Date:** 2026-04-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, shadow-ai, llmjacking, malicious-tool

## Executive Summary

The Model Context Protocol has become a high-value attack surface with 43% of MCP servers vulnerable to command injection and OWASP publishing a dedicated MCP Top 10 risk framework. Operation Bizarre Bazaar demonstrated industrialized exploitation with 35,000 attack sessions targeting exposed MCP endpoints between December 2025 and January 2026, while Cyata Research disclosed a chained RCE vulnerability in Anthropic's own official Git MCP server. Organizations deploying agentic AI infrastructure must audit MCP server configurations, restrict tool permissions, and monitor for shadow MCP server deployments.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | MCP Protocol Attack Surface (multiple campaigns) |
| Attribution | Operation Bizarre Bazaar: Hecker, Sakuya, LiveGamer101 (confidence: medium) |
| Target | Organizations deploying MCP servers, agentic AI infrastructure, LLM-connected tool services |
| Vector | Tool poisoning, prompt injection, exposed endpoints, shadow MCP servers |
| Status | active |
| First Observed | 2025-06 |

## Detailed Findings

OWASP published a dedicated MCP Top 10 risk framework in early 2026, identifying tool poisoning, token mismanagement, privilege escalation, command injection, and shadow MCP servers as the top risks facing organizations using the Model Context Protocol. According to OWASP, MCP Tool Poisoning is an indirect prompt injection attack where malicious MCP servers provide normal-looking tools that return responses containing hidden instructions. When an AI agent calls these tools, the injected instructions enter the LLM context window and are treated as trusted input, enabling unauthorized tool calls, data exfiltration, and lateral movement.

Cyata Research disclosed three chained vulnerabilities in Anthropic's official Git MCP server in January 2026. CVE-2025-68143 allowed unrestricted git_init at arbitrary filesystem paths. CVE-2025-68144 enabled argument injection through unsanitized input passed to Git CLI commands. CVE-2025-68145 bypassed path validation to access files outside the configured repository. When chained together, these vulnerabilities achieve full remote code execution through prompt injection alone, meaning an attacker who can influence what an AI assistant reads, such as a malicious README or poisoned issue description, can trigger these flaws without direct system access. Anthropic patched these in version 2025.12.18, removing the git_init tool entirely.

Research published by PolicyAsCode found that 13,875 MCP servers were indexed as of early 2026, with the most popular implementations reaching 437,000 weekly downloads. CVE-2025-6514, a CVSS 9.6 RCE vulnerability in mcp-remote, affected infrastructure at this scale. The study found 5 of 7 evaluated MCP clients performed no static validation of server-provided tool metadata, and 66% of MCP servers contained critical code smells.

Pillar Security documented Operation Bizarre Bazaar, the first publicly attributed LLMjacking campaign with commercial marketplace monetization. Between December 2025 and January 2026, distributed bots executed approximately 35,000 attack sessions averaging 972 attacks per day against exposed LLM and MCP endpoints. The criminal supply chain operates in three stages: scanner bots crawl Shodan and Censys for exposed Ollama, vLLM, and OpenAI-compatible APIs; validator infrastructure tests discovered endpoints and enumerates model capabilities; and the silver.inc marketplace resells unauthorized access to 30+ LLM providers at 40-60% discounts. By late January 2026, 60% of observed attack traffic shifted from compute theft to MCP reconnaissance, as criminals discovered that exposed MCP endpoints provide bridges to internal file systems, databases, cloud APIs, and Kubernetes clusters.

The MCP protocol itself contains structural security weaknesses. There is no protocol-level sandbox enforcement. MCP servers run with user or service account privileges. The protocol lacks message signing, mandates session IDs in URLs creating logging risks, and provides minimal authentication guidance. These design decisions prioritized functionality over security, creating systemic risk as MCP adoption accelerates across enterprise environments.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Exploitation of exposed MCP endpoints and LLM API services |
| Command and Scripting Interpreter | T1059 | Command injection through MCP tool responses |
| Supply Chain Compromise | T1195.002 | Tool poisoning via malicious MCP servers in supply chain |
| Valid Accounts: Cloud Accounts | T1078.003 | Stolen API keys resold through silver.inc marketplace |
| Resource Hijacking | T1496 | LLMjacking via stolen compute access |
| System Information Discovery | T1082 | MCP reconnaissance to enumerate internal systems |
| Lateral Movement | T1021 | MCP endpoints used as bridges to internal infrastructure |
| Exfiltration Over Web Service | T1567 | Data exfiltration through MCP tool responses |

## IOCs

### Domains

```
silver.inc
```

### Full URL Paths

*No full URL path IOCs published by sources*

### Splunk Format

```
"silver.inc"
```

### File Hashes

*No file hash IOCs published by sources*

### Package Indicators

*No package IOCs published by sources*

## Detection Recommendations

Monitor network traffic for connections to MCP server ports from unexpected sources. Search web proxy logs for outbound connections from MCP-enabled applications to unregistered external endpoints. In Splunk, query for MCP server activity: `sourcetype=network_traffic dest_port IN (3000, 8080, 8443) | where NOT match(dest, "approved_mcp_servers")`. Monitor for new MCP server processes on endpoints: `process.name="npx" AND command_line CONTAINS "mcp-server"` or `process.name="uvx" AND command_line CONTAINS "mcp-server"`. Audit for shadow MCP server deployments by scanning internal networks for services responding to MCP protocol handshakes. Review cloud audit logs for API key creation events followed by usage from unexpected IP ranges, which may indicate LLMjacking. Correlate Shodan and Censys exposure data with internal asset inventory to identify externally exposed MCP and LLM endpoints.

## References

- [OWASP] OWASP MCP Top 10 (2026) — https://owasp.org/www-project-mcp-top-10/
- [OWASP] MCP Tool Poisoning Attack Description (2026) — https://owasp.org/www-community/attacks/MCP_Tool_Poisoning
- [Cyata] Breaking Anthropic's Official MCP Server (2026-01) — https://cyata.ai/blog/cyata-research-breaking-anthropics-official-mcp-server
- [PolicyAsCode] MCP Security in 2026: Real CVEs, Exploit Chains, and Defenses (2026) — https://policyascode.dev/blog/mcp-security-vulnerabilities-2026
- [Pillar Security] Operation Bizarre Bazaar: First Attributed LLMjacking Campaign (2026) — https://www.pillar.security/blog/operation-bizarre-bazaar-first-attributed-llmjacking-campaign-with-commercial-marketplace-monetization
- [BleepingComputer] Hackers Hijack Exposed LLM Endpoints in Bizarre Bazaar Operation (2026) — https://bleepingcomputer.com/news/security/hackers-hijack-exposed-llm-endpoints-in-bizarre-bazaar-operation
- [The Register] Anthropic Quietly Fixed Flaws in Git MCP Server (2026-01) — https://www.theregister.com/2026/01/20/anthropic_prompt_injection_flaws/
