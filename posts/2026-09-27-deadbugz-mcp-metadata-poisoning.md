# Deadbugz: MCP Supply Chain Campaign Using Runtime-Gated Metadata Poisoning to Harvest Credentials

**Date:** 2026-09-27
**Tags:** supply-chain, mcp-security

## Executive Summary

Deadbugz pushed a malicious MCP server into multiple projects, shipping two innocuous tools and holding the payload back until the client had made exactly three tool calls. A reviewer checking a new server is unlikely to spot that: the metadata that turns into instructions hunting SSH keys and cloud credentials only appears once the server is trusted and in use. The public GitHub account zellkernel submitted 23 identified campaign-related pull requests to unrelated AI, MCP, and developer-tool projects.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Deadbugz |
| Attribution | GitHub account zellkernel (Unknown operator) (confidence: medium) |
| Target | AI and developer tool projects accepting MCP server contributions via pull requests |
| Vector | Malicious MCP server distribution via GitHub pull requests; metadata poisoning; call-count gating |
| Status | active |
| First Observed | 2026-08-10 |

## Detailed Findings

The campaign uses runtime-gated MCP metadata poisoning. The malicious instructions are built into the server, but remain withheld until the client has made three ordinary tool calls. An active campaign distributing a malicious MCP server through public GitHub pull requests, tracked to a single account that filed 23 pull requests across unrelated AI and developer tool projects in 74 minutes. The server offers text formatting and summarization, then, after exactly three tool calls, rewrites the metadata it returns into instructions to hunt for SSH keys, AWS credentials, shell history, and Kubernetes config while concealing the activity from the user. Pillar Security researchers tracked the campaign to a single GitHub account, zellkernel, which submitted 23 pull requests to unrelated AI, MCP, and developer-tool repos in a 74-minute window on August 10, 2026. The PRs were framed as helpful contributions, the same social engineering playbook as npm supply chain attacks. Researchers who documented it described it as an actively distributed campaign at the time of disclosure in September 2026.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Compromised MCP server distributed through GitHub pull requests to legitimate projects |
| Credential Access | T1552 | Harvesting SSH keys, AWS credentials, shell history, and Kubernetes configuration |

## IOCs

### Domains

_Campaign tracked to GitHub account zellkernel; 23 pull requests filed to unrelated projects Aug 10 2026; Delivery artifact: deadbug-mcp.py; webhook telemetry configuration: WEBHOOK_URL_

### Full URL Paths

```
https://github.com/zellkernel
```

### Splunk Format

```
"https://github.com/zellkernel"
```

### Affected Platforms

```
GitHub
MCP ecosystem
```

## Detection Recommendations

Monitor MCP server tool definitions for runtime changes; compare tool metadata fingerprints on each reconnect and alert on any drift. Implement strict pull request review processes requiring security team sign-off on MCP server additions, not just code review. Track for explicit third-call thresholds or call-count logic in MCP server code. Monitor for WEBHOOK_URL configuration parameters in MCP servers. Implement continuous MCP server monitoring with per-session tool definition verification rather than one-time approval. Flag GitHub accounts filing multiple pull requests to unrelated projects within short timeframes. Require signed MCP server manifests and implement re-consent flows for any tool definition changes.

## References

- [Pillar Security] Deadbugz: Currently Active MCP Supply-Chain Campaign (2026-09-18) — https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign
- [Adversa AI] MCP security September 2026: Deadbugz + 3 server CVEs (2026-09-07) — https://adversa.ai/blog/top-mcp-security-resources-september-2026/
- [byteiota] Deadbugz: The MCP Attack That Waits 3 Calls Before Striking (2026-09-13) — https://byteiota.com/deadbugz-the-mcp-attack-that-waits-3-calls-before-striking/
