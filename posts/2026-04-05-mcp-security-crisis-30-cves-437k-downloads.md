# MCP Protocol Security Crisis: 30+ CVEs in 60 Days, 437K+ Downloads Affected, Trojanized npm Packages Targeting AI Agents via Connector Poisoning

**Date:** 2026-04-05
**Tags:** malicious-tool, supply-chain

## Executive Summary

30 CVEs. 60 days. 437,000 compromised downloads. The Model Context Protocol went from "promising open standard" to "active threat surface" faster than anyone predicted. Between January and February 2026, security researchers filed over 30 CVEs targeting MCP servers, clients, and infrastructure. The vulnerabilities ranged from trivial path traversals to a CVSS 9.6 remote code execution flaw in a package downloaded nearly half a million times. The axios npm supply chain attack of March 2026 deployed a RAT through AI coding agents autonomously running npm install. On March 31, 2026, the axios npm package, one of the most-downloaded JavaScript libraries in existence with over 100 million weekly installs, was compromised via a hijacked maintainer account. Two malicious versions injected a hidden dependency that silently deployed a cross-platform Remote Access Trojan on macOS, Windows, and Linux. Coding agents do not wait for human approval before running npm install.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | MCP Protocol Ecosystem Exploitation & AI Agent Supply Chain Poisoning |
| Attribution | Multiple threat actors (autonomous botnets, human operators) (confidence: medium) |
| Target | AI developers, Claude Code users, Cursor IDE users, MCP-integrated development environments |
| Vector | MCP server tool poisoning, prompt injection in tool metadata, trojanized npm/PyPI packages, Supply chain via connector registration |
| Status | active |
| First Observed | 2026-01-15 |

## Detailed Findings

Researchers demonstrated that the WhatsApp MCP Server was vulnerable to tool poisoning. By injecting malicious instructions into tool descriptions, attackers could trick AI agents into executing unintended operations — specifically, exfiltrating entire chat histories. This was one of the first publicly demonstrated MCP attacks and revealed a fundamental problem: AI agents trust tool descriptions implicitly. The attack required no authentication bypass or code exploitation. The AI agent simply followed the instructions it found in the tool metadata, treating them as authoritative. A separate supply chain attack involved a package masquerading as a legitimate Postmark MCP server. A single line of malicious code directed compromised MCP servers to blind-copy every outgoing email to the attackers — internal project memos, password resets, invoices. This is the 2026 equivalent of an npm supply chain compromise, but with an AI agent as the unwitting delivery mechanism. CVE-2025–6514 disclosed a critical OS command injection bug in mcp-remote, a popular OAuth proxy for connecting local MCP clients to remote servers. It affected over 437,000 environments and effectively turned any unpatched install into a supply chain backdoor capable of executing arbitrary commands, stealing API keys, cloud credentials, SSH keys, and Git repository contents.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Tool Poisoning | T1201 | Malicious instructions embedded in MCP tool metadata descriptions |
| Prompt Injection | T1190 | Indirect prompt injection via tool descriptions and external content |
| Supply Chain Compromise | T1195 | Trojanized MCP packages on npm/PyPI, compromised registries |
| Command Injection | T1059.007 | OS command injection in mcp-remote OAuth proxy (CVE-2025-6514) |

## IOCs

### Domains

_30+ CVEs filed Jan–Feb 2026. Postmark imposter and tool-poisoning instances removed. mcp-remote patched but billions of deployments remain vulnerable. See MCP ecosystem registries for validation._

### Full URL Paths

_30+ CVEs filed Jan–Feb 2026. Postmark imposter and tool-poisoning instances removed. mcp-remote patched but billions of deployments remain vulnerable. See MCP ecosystem registries for validation._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
mcp-remote (437K+ affected installations)
axios (trojanized versions, March 31 2026)
postmark-mcp-server (imposter package)
```

## Detection Recommendations

Audit all MCP server installations and validate tool descriptions against canonical registries; implement MCP server allowlisting and cryptographic verification (SLSA provenance); scan npm/PyPI for trojanized MCP connectors; monitor for command injection patterns in MCP logs (CVE-2025-6514 exploitation signatures); implement output filtering on MCP tool responses before forwarding to AI models; treat all MCP tool descriptions as untrusted input; maintain offline backups of tool registries to detect poisoning; revoke and rotate all credentials on systems using compromised MCP packages.

## References

- [heyuan110.com] MCP Security 2026: 30 CVEs in 60 Days — What Went Wrong (2026-03-10) — https://www.heyuan110.com/posts/ai/2026-03-10-mcp-security-2026/
- [Unit42 / Palo Alto Networks] New Prompt Injection Attack Vectors Through MCP Sampling (2025-12-05) — https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/
- [DEV Community] MCP Connector Poisoning: How Compromised npm Packages Hijack Your AI Agent (2026-04-04) — https://dev.to/toniantunovic/mcp-connector-poisoning-how-compromised-npm-packages-hijack-your-ai-agent-3ha0
- [Medium / InstaTunnel] Securing MCP Servers: The 2026 Guide to AI Tool Tunneling (2026-03-01) — https://medium.com/@instatunnel/securing-mcp-servers-the-2026-guide-to-ai-tool-tunneling-aafa113b08db
