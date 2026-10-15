# Repeat-After-Me Prompt Bypasses Six AI Agent Frameworks and Executes Attacker Tool Calls

**Date:** 2026-10-15
**Tags:** prompt-injection, mcp-security

## Executive Summary

Researchers tricked six widely used AI agent frameworks into executing attacker written tool calls by simply asking the underlying model to repeat the call back. The technique, named Repeat-After-Me, worked against LangGraph, Microsoft Agent Framework, Microsoft AutoGen, Google Agent Development Kit 2.0, AWS Strands Agents and CrewAI. The same study found verified security bugs in 118 of 273 open source MCP servers it could run.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Repeat-After-Me |
| Attribution | Unknown (academic security research) (confidence: none) |
| Target | Applications built on LangGraph, Microsoft Agent Framework, AutoGen, Google ADK 2.0, AWS Strands Agents, CrewAI and open source MCP servers |
| Vector | Prompt that asks the model to echo a crafted tool invocation, escalating from refusal to hypothetical framing to structured tool call emission |
| Status | active |
| First Observed | 2026-10-12 |

## Detailed Findings

According to [csoonline.com](https://www.csoonline.com/article/4233811/researchers-bypass-6-ai-agent-frameworks-with-a-simple-repeat-after-me-prompt.html), researchers from Pennsylvania State University, Université Montpellier and Dartmouth College bypassed six AI agent frameworks with a text repetition prompt. In the demonstration the researchers asked a model to repeat text formatted as a tool invocation request. The model initially refused the dangerous request but still included the requested text in its response, and the framework did not execute it at that stage. The researchers then framed the request as hypothetical and instructed the model to reproduce only the supplied text, after which the model emitted a structured tool invocation that LangGraph dispatched, and a simulated tool returned a result before the model issued another refusal. CSO Online reported that a testing tool the team built found verified security bugs in 118 of the 273 open source MCP servers it could run. After manual review the team confirmed 253 bugs affecting 343 tools across those 118 servers. The most serious were 64 path traversal flaws, seven server side request forgery flaws, five data exfiltration bugs and three OS command injection flaws. Most of the remainder were reflected output and log injection issues, which the paper rates as lower impact in many deployments.

## IOCs

### Domains

_No IOCs published. The paper reports framework and MCP server vulnerability classes rather than named indicators._

### Full URL Paths

_No IOCs published. The paper reports framework and MCP server vulnerability classes rather than named indicators._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
LangGraph
Microsoft Agent Framework
Microsoft AutoGen
Google Agent Development Kit 2.0
AWS Strands Agents
CrewAI
Open source MCP servers
```

## Detection Recommendations

Do not dispatch tool calls directly from raw model text. Require an out of band authorization check before any tool invocation, and validate tool arguments against an allow list independent of model output. Treat any model response that reproduces a structured tool call as untrusted data. Audit MCP servers for path traversal, server side request forgery, data exfiltration and OS command injection, especially those exposing filesystem or network tools, and restrict MCP server network reachability.

## References

- [CSO Online] Researchers bypass 6 AI agent frameworks with a simple 'Repeat-After-Me' prompt (2026-10-12) — https://www.csoonline.com/article/4233811/researchers-bypass-6-ai-agent-frameworks-with-a-simple-repeat-after-me-prompt.html
