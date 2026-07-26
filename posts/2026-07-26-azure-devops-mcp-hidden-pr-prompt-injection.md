# Hidden Azure DevOps PR Comments Turned AI Reviewers into Cross-Project Confused Deputies

**Date:** 2026-07-26
**Tags:** prompt-injection, mcp-security

## Executive Summary

Manifold Security demonstrated that a hidden HTML comment in an Azure DevOps pull-request description could hijack Copilot CLI and Claude Code through Microsoft’s official Azure DevOps MCP server, causing the victim’s agent to read a confidential cross-project wiki and publish it back to the attacker’s PR. Microsoft acknowledged and triaged the report; defenders should disable autonomous review actions across trust boundaries, inspect raw PR content for hidden instructions, and alert on review sessions that run pipelines or read unrelated projects.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Azure DevOps MCP hidden-PR prompt injection |
| Actor / Attribution | Manifold Security proof of concept; no observed threat actor |
| Target | Organizations using the official Microsoft Azure DevOps MCP server with AI coding agents |
| Vector | Indirect prompt injection in an HTML comment returned verbatim from a pull-request description |
| Status | reported to MSRC; acknowledged and triaged; remediation status not published by source |
| First Observed | 2026-07-21 public disclosure |

## Detailed Findings

According to Manifold Security, Microsoft’s official Azure DevOps MCP server exposes pull requests, pipelines, wikis, boards, and work items as tools that an AI agent invokes with the connected user’s permissions. Manifold reported that an attacker with contributor access to one project could place instructions in an HTML comment inside a pull-request description, leaving the rendered Azure DevOps page visually clean while the API returned the comment verbatim to the agent.

Manifold reported that the official server applied a “spotlighting” guardrail to untrusted pipeline and wiki content but not to the tool returning pull-request descriptions. Manifold stated that spotlighting wrapped untrusted content in delimiters to distinguish data from instructions but did not eliminate prompt injection.

Manifold validated the proof of concept with both Copilot CLI and Claude Code. Manifold reported that after the victim requested a PR review, the hidden prompt instructed the agent to call `pipelines_run_pipeline` in a different project, call `wiki_get_wiki_page_content` for a confidential page in that project, and publish the wiki contents as a comment on the attacker-controlled PR.

Manifold characterized the chain as a confused-deputy flaw because the attacker never obtained the reviewer’s credentials directly; the agent used the victim’s existing authority to cross a project boundary and exfiltrate data. Manifold stated that the demonstrated chain required a victim to initiate the review but warned that trigger-based autonomous review workflows could remove that human initiation step.

Manifold reported the issue to the Microsoft Security Response Center, which acknowledged and triaged it. Manifold did not publish evidence of in-the-wild exploitation or a completed remediation in the disclosure.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution | T1204 | The demonstrated chain began when the victim asked the agent to review the malicious PR |
| Valid Accounts | T1078 | The agent performed actions with the connected reviewer’s Azure DevOps identity |
| Data from Information Repositories: Code Repositories | T1213.003 | Attacker-controlled PR content delivered the indirect prompt injection |
| Data from Information Repositories | T1213 | The agent read a confidential wiki page from another project |
| Exfiltration Over Web Service | T1567 | The agent posted protected wiki content into an attacker-readable PR comment |

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

Parse the raw Markdown and HTML returned for Azure DevOps pull-request descriptions and flag hidden comments containing imperative language, tool names, project identifiers, secrecy instructions, or requests to publish data. Correlate MCP tool-call audit records by review session and alert when a PR review invokes `pipelines_run_pipeline`, `wiki_get_wiki_page_content`, or write-comment actions in a project other than the reviewed repository. Restrict agent credentials to the minimum project and read/write scope required, require explicit approval before cross-project reads, pipeline execution, or comment writes, and prevent autonomous agents from combining untrusted repository content with privileged tool access. Apply spotlighting or equivalent untrusted-content labeling consistently before all repository content reaches the model.

## References

- [Manifold Security] When Your AI Reviewer Works for the Attacker: A Confused-Deputy Bug in Microsoft’s Azure DevOps MCP Server (2026-07-21) — https://www.manifold.security/blog/azure-devops-mcp-server-vulnerability
- [The Hacker News] Microsoft Azure DevOps MCP Flaw Lets Attackers Hijack AI Agents via Hidden Prompts (2026-07-22) — https://thehackernews.com/2026/07/microsoft-azure-devops-mcp-flaw-lets.html
