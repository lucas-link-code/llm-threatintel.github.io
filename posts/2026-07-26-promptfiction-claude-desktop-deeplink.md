# PromptFiction Claude Desktop Deep Links Auto-Submitted Attacker Prompts Without User Review

**Date:** 2026-07-26
**Tags:** prompt-injection, mcp-security

## Executive Summary

Oasis Security disclosed PromptFiction, a fixed Claude Desktop flaw where one click on a crafted `claude://` link automatically submitted an attacker-authored prompt without letting the user review or approve it. Organizations should require Claude Desktop 1.1.2321 or later, inventory custom-URI invocations, and restrict filesystem, code-execution, and MCP permissions available to desktop agents.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | PromptFiction |
| Actor / Attribution | Oasis Security proof of concept; no observed threat actor |
| Target | Claude Desktop users, especially installations with filesystem, coding, or MCP access |
| Vector | Crafted `claude://` custom-URI link delivered through a website, document, email, chat, or search result |
| Status | fixed in Claude Desktop 1.1.2321 |
| First Observed | 2026-07-15 public disclosure |

## Detailed Findings

According to Oasis Security, Claude Desktop registered a custom URI scheme that could carry a complete prompt into the application. Oasis reported that a victim clicking a crafted `claude://` link caused Claude Desktop to open a conversation and submit the attacker-authored prompt immediately, without a separate Send action or review opportunity.

Oasis reported that an attacker could pad the prompt with benign text so the application’s message-folding behavior concealed the malicious instructions below the visible portion. Oasis stated that the link could be delivered through a browser page, document, email, chat message, or search result.

Oasis reported that a standard Claude Desktop installation exposed the user’s conversation history to the injected prompt, including source code, internal documents, customer data, unreleased plans, and security details already present in those conversations. Oasis stated that installations configured with coding, filesystem, or MCP capabilities increased the potential impact to local file read/write activity and attacker-directed code execution.

Oasis reported PromptFiction through Anthropic’s Responsible Disclosure Program and stated that another researcher had independently submitted the same issue without publishing it. Oasis reported that Anthropic changed the behavior so a deep-link prompt is pre-filled but waits for the user to review and press Send, and identified Claude Desktop 1.1.2321 or later as the protected version.

Dark Reading corroborated that the flaw automatically submitted custom-URI prompts and reported that combining PromptFiction with previously disclosed Claude flaws could enable conversation exfiltration, filesystem access, persistence, and remote code execution. Dark Reading reported no evidence that attackers exploited PromptFiction before remediation.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution: Malicious Link | T1204.001 | The proof of concept required one click on a crafted custom-URI link |
| Command and Scripting Interpreter | T1059 | A successfully injected prompt could direct configured coding tools to execute commands |
| Data from Local System | T1005 | Configured filesystem access could expose local files |
| Exfiltration Over Web Service | T1567 | The injected assistant could send conversation or file content through an external service |

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

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Enforce Claude Desktop 1.1.2321 or later through software inventory and block outdated clients from enterprise access. Collect browser, email-security, and endpoint telemetry for external invocation of the `claude://` URI handler and correlate it with immediate Claude Desktop process launches, new conversations, tool calls, file access, or outbound uploads. Require a human approval event for all custom-URI prompts and for sensitive filesystem, shell, network, and MCP actions. Limit standing agent permissions, disable unused MCP servers, and alert when a desktop agent reads conversation history or local files immediately after a deep-link launch.

## References

- [Oasis Security] PromptFiction: a one-click flaw that made Claude Desktop act without consent (2026-07-15) — https://www.oasis.security/blog/claude-desktop-vulnerability
- [Dark Reading] Claude Flaw Automatically Sends Malicious Prompts to AI Agents (2026-07-15) — https://www.darkreading.com/vulnerabilities-threats/claude-flaw-malicious-prompts-ai-agents
