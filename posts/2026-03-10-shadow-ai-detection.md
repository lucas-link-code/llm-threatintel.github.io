# Shadow AI in the Enterprise: Detection Strategies for Unauthorized LLM Usage

**Date:** 2026-03-10
**Tags:** Shadow AI, Detection Engineering

## Executive Summary

Shadow AI, the unauthorized use of AI tools and services by employees, has become one of the fastest-growing security risks in enterprise environments. This report provides practical detection engineering approaches for identifying unauthorized LLM usage, covering DNS indicators, endpoint process detection, proxy log analysis, data exfiltration volume patterns, and user risk scoring methodologies.

## Detailed Findings

The adoption of generative AI tools has outpaced enterprise governance in nearly every sector. Employees use ChatGPT, Claude, Gemini, Copilot, and dozens of smaller AI services to accelerate their work, often uploading proprietary code, internal documents, customer data, and strategic plans into services that are not approved, audited, or covered by enterprise data processing agreements.

The challenge for security teams is that AI tool usage often looks like normal web browsing. The traffic is HTTPS to well-known domains, the data flows are user-initiated, and the services are legitimate platforms, not malicious infrastructure. Traditional security controls designed to block malicious activity are poorly suited to detecting authorized users sending sensitive data to unauthorized but otherwise legitimate services.

### Detection Vector 1: DNS and Proxy Log Analysis

The most accessible detection surface is DNS resolution and web proxy logs. AI services operate on known domains, and monitoring for resolution of or traffic to these domains provides baseline visibility. Key domain categories to monitor include AI chat services (chat.openai.com, claude.ai, gemini.google.com, poe.com), AI coding assistants (copilot.github.com, cursor.sh, windsurf.ai, codeium.com), AI API endpoints (api.openai.com, api.anthropic.com, api.together.xyz), and local LLM download sources (ollama.com, huggingface.co, lmstudio.ai).

A simple Splunk query matching web proxy logs against a lookup table of AI service domains provides immediate visibility into which users are accessing which services, how frequently, and how much data they are transferring.

### Detection Vector 2: Endpoint Process Detection

Local LLM inference is a growing blind spot. Tools like Ollama, LM Studio, llama.cpp, and vLLM allow users to run models entirely on their workstation or on local servers, bypassing all network-based detection. Endpoint detection requires looking for process names associated with these frameworks, GPU library loading events, and large model file downloads.

CrowdStrike Falcon and similar EDR platforms can detect process creation events for known LLM runtime binaries. The key process names to monitor include ollama, llamacpp, llama-server, lms (LM Studio), vllm, and text-generation-server.

### Detection Vector 3: Data Exfiltration Volume Analysis

AI interactions involve sending substantial amounts of text in request bodies. A user uploading a 50-page document to ChatGPT generates a distinctly different traffic pattern than normal web browsing. Monitoring outbound data volume to AI service domains, particularly when it exceeds typical browsing patterns, can identify bulk data uploads.

Setting a threshold on bytes sent per session to known AI domains, with the threshold calibrated against a baseline of normal usage, provides a practical alerting mechanism.

### Detection Vector 4: AI Meeting Transcription Services

Meeting transcription AI services such as Otter.ai, Fireflies.ai, Fathom, and Grain present a unique risk because they capture and process entire meeting recordings, including confidential discussions. These services often join meetings as bot participants and can be detected through calendar integration monitoring, unusual meeting participant names, and DNS/proxy traffic to transcription service domains.

### Detection Vector 5: MCP Server Configuration

The Model Context Protocol allows AI assistants to connect directly to local tools and data sources. Users configuring MCP servers on their workstations may be granting AI models access to databases, file systems, codebases, and internal APIs without IT approval. Detection involves monitoring for the creation or modification of MCP configuration files across tools like Claude Desktop, Cursor, Windsurf, and VS Code.

Known MCP configuration file paths include:
- Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) and %APPDATA%\Claude\claude_desktop_config.json (Windows)
- Cursor: ~/.cursor/mcp.json
- Windsurf: ~/.windsurf/mcp.json and ~/.codeium/windsurf/mcp_config.json

### Detection Vector 6: Proxy Bypass and Tunnel Detection

Technically sophisticated users may attempt to bypass corporate proxy controls to reach AI services. This includes using SSH tunnels, SOCKS proxies, Cloudflare WARP, Tailscale, and direct DNS resolution bypassing corporate DNS. Detecting these bypass techniques requires monitoring for outbound SSH connections to non-standard ports, DNS queries to public resolvers bypassing enterprise DNS, and process-level network connections from known tunnel software.

### User Risk Scoring

Individual detection signals have limited value in isolation. A user resolving an AI domain once could be accidental. The same user resolving multiple AI domains, uploading large volumes of data, running local LLM processes, and configuring MCP servers represents a compounding risk profile. Implementing a weighted user risk score that aggregates signals across all detection vectors and surfaces the highest-risk users for investigation is the recommended approach.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exfiltration Over Web Service | T1567 | Data uploaded to AI SaaS platforms |
| Application Layer Protocol: Web Protocols | T1071.001 | AI API communication over HTTPS |
| Data from Local System | T1005 | Local files uploaded to AI services |
| Proxy: External Proxy | T1090.002 | Bypass attempts to reach AI services |
| Protocol Tunneling | T1572 | SSH and VPN tunnels to bypass proxy controls |

## Detection Recommendations

Start with DNS and proxy log analysis as the lowest-effort, highest-coverage detection vector. Layer endpoint process detection for local LLM usage. Implement data volume thresholds for AI service domains. Build toward a unified risk score that aggregates all signals per user.

For Splunk environments, a combination of web proxy log analysis using CIM-compliant fields, DNS query logging, and endpoint process creation events provides comprehensive coverage. CrowdStrike LogScale offers similar capability through its process and network telemetry.

## References

- OWASP: AI Security Guidelines
- NIST: AI Risk Management Framework
- Multiple vendor threat reports on Shadow AI (2025-2026)
