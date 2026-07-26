# MCP Security Crisis: Enterprise Agent Hijacking via Sentry DSN Injection and Mid-Session Tool Injection (MSTI)

**Date:** 2026-07-20
**Tags:** mcp-security, prompt-injection

## Executive Summary

Microsoft documents a highly effective tool-poisoning and description-injection attack pattern recently observed in the wild. This production enterprise agent exploit successfully targeted fintech MCP servers, prompting the release of a detailed defensive playbook. In June 2026, researchers at Tenet Security and CSA Labs documented an 85% exploitation success rate against tested coding agents by injecting malicious instructions through Sentry's unauthenticated event ingestion endpoint, affecting an estimated 2,388 organizations with exposed configurations.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Enterprise MCP Agent Hijacking: Sentry DSN Injection + MSTI |
| Attribution | Multiple independent research disclosures; attacks in-the-wild against fintech and enterprise deployments (confidence: medium) |
| Target | MCP-connected AI coding agents (Claude Code, Cursor, GitHub Copilot), fintech AI infrastructure, enterprise Kubernetes/shell access |
| Vector | Sentry event ingestion abuse (unauthenticated), tool-poisoning via description injection, Mid-Session Tool Injection (MSTI) |
| Status | active |
| First Observed | 2026-06-02 (Sentry disclosure); widespread in-the-wild as of 2026-07-02 |

## Detailed Findings

Attackers are leveraging Mid-Session Tool Injection (MSTI) to hijack the tools a WebMCP agent utilizes during active sessions. By using third-party scripts for AbortSignal hijacking and registration races, this runtime manipulation achieves exceptionally high attack success rates. Tenet Security discovered that attackers can inject fake Sentry error events through a public DSN, which the Sentry MCP server then blindly returns as trusted diagnostics. This allows attackers to achieve an 85% success rate when tricking coding agents into executing arbitrary commands across thousands of vulnerable organizations. The Model Context Protocol (MCP) has become the backbone infrastructure for connecting AI models with external tools, data sources, and automated business workflows. As enterprises embrace MCP servers for advanced AI integration, these systems hold ever more sensitive data and runtime privileges. Yet MCP servers face urgent threats: prompt injection, where attackers trick AI models into running hidden commands, and tool poisoning, which manipulates the description or behavior of external tools to lure agents into unsafe actions. Both attack vectors can lead to data loss, privilege abuse, or full system compromise.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1598 | Hidden instructions injected through tool descriptions and Sentry event API |
| Tool Poisoning | T1059.001 | Malicious tool descriptions trigger agent execution of arbitrary commands |
| Lateral Movement | T1570 | Compromised agents pivot to databases, Kubernetes clusters, shell access |

## IOCs

### Domains

_Affected 2,388 organizations with exposed Sentry configurations. MSTI affects WebMCP runtimes via AbortSignal hijacking._

### Full URL Paths

_Affected 2,388 organizations with exposed Sentry configurations. MSTI affects WebMCP runtimes via AbortSignal hijacking._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'Sentry DSN endpoint', 'registry': 'service', 'version': 'unauthenticated event ingestion', 'note': 'Public DSNs allow attacker-controlled event injection'}
```

### Affected Platforms

```
Claude Code
Cursor IDE
GitHub Copilot
WebMCP agents
Sentry error monitoring service
Fintech AI infrastructure
Enterprise Kubernetes/database systems
```

## Detection Recommendations

Inventory all MCP servers and agents in production; verify Sentry DSN public accessibility and implement IP allowlists. Require authentication on event ingestion endpoints; rotate Sentry API tokens immediately. Audit tool descriptions for malicious or suspicious content; require tool schema validation before agent invocation. Implement tool allowlists and disable dynamic tool loading. Monitor for unusual tool calls (e.g., database/shell access from ML agents that should not have that capability). Enable MCP runtime logging and audit all tool invocations with identity and origin. Implement Anthropic's Zero Trust framework for enterprise AI agents as documented in July 2026 briefings. Upgrade to MCP 2026 spec when available; implement incremental scope consent for minimum required permissions per operation.

## References

- [Adversa AI] Top MCP security resources & CVEs July 2026 (2026-07-02) — https://adversa.ai/blog/top-mcp-security-resources-july-2026/
- [Cloud Security Alliance Labs] Agentjacking and Self-Replicating AI Worms (2026-06-16) — https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-self-replicating-ai-worms-202/
- [Practical DevSecOps] MCP Server Vulnerabilities 2026 - Prevent Prompt Injection Attacks (2026-01-04) — https://www.practical-devsecops.com/mcp-security-vulnerabilities/
