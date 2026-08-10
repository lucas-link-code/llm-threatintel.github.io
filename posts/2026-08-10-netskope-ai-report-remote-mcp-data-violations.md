# Netskope 2026 AI Report: Remote MCP Traffic Quadruples as Downstream Data Violations More Than Double

**Date:** 2026-08-10
**Tags:** shadow-ai, mcp-security

## Executive Summary

Netskope Threat Labs measured a 375% increase in remote MCP transactions over ten weeks while downstream AI data-policy violations rose from 12 to 31 per organization per week over the preceding year. Netskope's June 2025–July 2026 enterprise telemetry also found that 30% of AI users relied only on personal applications; defenders should extend AI discovery and DLP inspection to personal accounts, agentic coding traffic, local models, and both directions of MCP data flow.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Netskope AI Report: 2026 enterprise telemetry |
| Actor / Attribution | No threat actor or malware attribution; aggregate customer telemetry |
| Target | Enterprises using AI applications, coding agents, local models, and remote MCP servers |
| Vector | Unmanaged AI use and bidirectional data access through AI applications and MCP-connected agents |
| Status | active enterprise exposure trend |
| First Observed | Observation window 2025-06 through 2026-07; report published 2026-07-27 |

## Detailed Findings

### Scope and adoption

Netskope Threat Labs reported that its analysis used aggregate Netskope One usage data from a subset of customers between June 2025 and July 2026. Netskope measured weekly AI-application use rising from 34% to 59% of users in the median organization and average prompt volume rising from 1,498 to 4,731 prompts per week.

Netskope reported that 56% of AI users used only organization-managed applications, 14% used both managed and personal applications, and 30% used only personal applications. Netskope assessed that shadow-AI discovery now needs to cover personal services, AI agents, MCP servers, and local model infrastructure.

### Agentic coding and MCP growth

Netskope reported that adoption of AI coding applications rose from 42% to 84% of organizations over the preceding year. Netskope measured Claude Code use in 75% of organizations and Codex use in 58%, compared with less than 1% for each a year earlier.

Netskope reported that remote MCP users increased by 250% and remote MCP transactions increased by 375% in ten weeks. Netskope stated that these measurements cover internet-hosted remote MCP use and identified Claude Code and Codex among the leading clients.

### Bidirectional data-policy violations

Netskope measured average upstream data-policy violations increasing from 44 to 69 per organization per week over the preceding year. Netskope reported that intellectual property, regulated data, and source code comprised most upstream violations, with a smaller share involving passwords and keys embedded in code or configuration files.

Netskope measured average downstream violations increasing from 12 to 31 per organization per week. Netskope reported a larger increase among the top quartile of organizations, from 72 to 206 downstream violations per week, and linked the change to growing agentic-AI and MCP access to enterprise data sources and tools.

Netskope defined downstream violations as AI output containing data that organizational policy prohibits the receiving user or agent from accessing. Netskope reported that this condition occurs when MCP, retrieval-augmented generation, or customized models connect AI applications to proprietary data without preserving the intended authorization boundary.

### Malicious content in AI workflows

Netskope reported that malicious links surfaced through AI applications varied from fewer than 10 to more than 90 encounters per week during the observation period. Netskope also reported adversary use of fake AI installers and trojanized developer tools, while warning that autonomous coding agents can execute malicious code returned by an AI application or incorporate it into a broader codebase.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exfiltration Over Web Service | T1567 | Applicable hunting analogue when source code, regulated data, credentials, or intellectual property is transferred to unapproved AI services |
| Command and Scripting Interpreter | T1059 | Applicable when an agentic coding system executes malicious shell commands or code returned through an AI workflow |

These mappings describe defensive hunting analogues across the aggregate telemetry; Netskope did not attribute every policy violation to malicious activity.

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

Normalize secure web gateway and proxy events into `url_host`, `url`, `user`, `bytes_out`, `bytes_in`, `action`, and an account-instance field that distinguishes personal from corporate AI accounts. Alert when regulated data, source code, secrets, or unusually large uploads reach an unapproved AI service or a personal account.

Inventory remote MCP traffic by user, client, server, tool, direction, and data classification. Alert when a user or agent receives sensitive records from a connected system without a matching authorization entitlement, and correlate the event with the MCP tool name and backend resource in application and cloud audit logs.

In EDR process telemetry, track agentic coding clients and local model runners, including child-shell creation, package installation, credential-file access, and new outbound destinations. Flag `Claude`, `Codex`, `Cursor`, `ollama`, `llama-server`, and `python` processes with `--model` or `.gguf` arguments when they operate outside approved paths or invoke interpreters with downloaded content.

Inspect downstream AI output for URLs, encoded scripts, package-install commands, and executable code before an autonomous agent can run it. Correlate downstream content detections with subsequent EDR process creation or CI/CD execution under the same user, repository, or agent session.

## References

- [Netskope Threat Labs] Netskope AI Report: 2026 (2026-07-27) — https://www.netskope.com/resources/threat-labs-reports/netskope-ai-report-2026
- [Netskope Threat Labs] Beyond Shadow AI: The Netskope AI Report (2026-07-27) — https://www.netskope.com/de/blog/beyond-shadow-ai-the-netskope-ai-report
