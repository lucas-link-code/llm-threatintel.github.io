# Deadbugz: Active MCP Supply-Chain Campaign with Runtime-Gated Metadata Poisoning

**Date:** 2026-09-08
**Tags:** supply-chain, mcp-security, malicious-tool

## Executive Summary

An active campaign distributing a malicious MCP server through public GitHub pull requests deployed runtime-gated metadata poisoning: the server offers innocent text formatting and summarization tools, then after exactly three tool calls, rewrites its tool metadata into credential-hunting instructions targeting SSH keys, AWS credentials, shell history, and Kubernetes config. A single GitHub account (zellkernel) filed 23 campaign-related pull requests across unrelated AI, MCP, and developer-tool projects, representing a novel trust-evasion technique where malicious behavior appears only post-approval.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Deadbugz |
| Attribution | Unknown (tracked by Pillar Security) (confidence: low) |
| Target | AI developers and organizations using AI coding agents integrated with MCP servers |
| Vector | Malicious MCP server distributed via GitHub pull requests with deferred payload execution |
| Status | active |
| First Observed | 2026-08-10 |

## Detailed Findings

The public GitHub account zellkernel submitted 23 identified campaign-related pull requests to unrelated AI, MCP, and developer-tool projects. The public delivery operation created 23 pull requests in a 74-minute period, from 9:52 PM to 11:07 PM UTC on August 10, 2026. A reviewer checking a new server is unlikely to spot this threat because the metadata that turns into credential-stealing instructions only appears once the server is trusted and in use, observed through benign text-only requests. Deadbugz builds on known MCP attack primitives: in April 2025, Invariant Labs demonstrated an MCP sleeper attack that began with an innocuous tool and later changed its description to manipulate a trusted WhatsApp MCP integration. MCP metadata poisoning is a new attack surface for AI agents because the client trusts not just the tool but the metadata that describes what the tool can do; in this campaign, a malicious server waited until normal usage crossed a threshold, then changed the instructions presented to the agent.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Malicious MCP server injected into development ecosystem via trusted repositories |
| Credential Dumping | T1110 | Runtime payload extracts SSH keys, AWS credentials, shell history, and Kubernetes configurations |

## IOCs

### Domains

_Pillar Security writeup contains pull-request indicators, runtime trigger evidence, and compromise markers; specific endpoint and repository IOCs published in security research_

### Full URL Paths

_Pillar Security writeup contains pull-request indicators, runtime trigger evidence, and compromise markers; specific endpoint and repository IOCs published in security research_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude Code
GitHub MCP
Cursor
other AI coding agents with MCP support
```

## Detection Recommendations

Monitor AI agent MCP server configurations for behavioral changes after deployment; treat tool metadata as an enforceable security object rather than passive documentation. Implement runtime validation of MCP tool descriptions and periodic re-verification of tool definitions after initial approval. Flag MCP servers that modify returned metadata or tool instructions based on call count or state. Review GitHub pull requests submitted to AI and MCP projects for batched submissions from single accounts within short timeframes. Maintain inventory of all approved MCP servers and version-lock their definitions; alert on changes. Segment AI agents behind network boundaries to limit lateral movement if a malicious MCP server exfiltrates credentials.

## References

- [Pillar Security] Deadbugz: Currently Active MCP Supply-Chain Campaign (2026-09-07) — https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign
- [Adversa AI] MCP security September 2026: Deadbugz + 3 server CVEs (2026-09-07) — https://adversa.ai/blog/top-mcp-security-resources-september-2026/
- [NHI Foundation] Deadbugz shows how MCP metadata poisoning evades AI agent trust (2026-08-14) — https://nhimg.org/articles/deadbugz-shows-how-mcp-metadata-poisoning-evades-ai-agent-trust/
- [Cloud Security Alliance] CISO Daily Briefing – September 2, 2026 (2026-09-02) — https://labs.cloudsecurityalliance.org/research/ciso-daily-briefing-20260902/
