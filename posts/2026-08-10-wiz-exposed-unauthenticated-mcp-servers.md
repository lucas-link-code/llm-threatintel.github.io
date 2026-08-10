# Wiz Finds Unauthenticated MCP Servers Exposing Enterprise Data, IAM Actions, Shell Access, and Cloud Credentials

**Date:** 2026-08-10
**Tags:** mcp-security, shadow-ai

## Executive Summary

Wiz Research found internet-reachable, unauthenticated MCP servers in multiple organizations, including Fortune 500 companies, with some returning sensitive records, exposing write or delete tools, executing code, or disclosing cloud credentials. Wiz measured at least one exposed MCP server in about one in six cloud environments where MCP was present; defenders should inventory public MCP endpoints, require authentication for tool execution, restrict backend credentials, and retain prompt and invocation logs.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Wiz exposed MCP server research |
| Actor / Attribution | No threat actor attributed; exposure research |
| Target | Cloud environments operating internet-reachable MCP servers |
| Vector | Anonymous MCP discovery and tool invocation against privileged backend integrations |
| Status | active exposures observed at publication |
| First Observed | Public research published 2026-07-28 |

## Detailed Findings

### Exposure measurements

Wiz Research reported that MCP appeared in 80% of the cloud environments represented in its dataset and that about one in six of those environments exposed at least one MCP server. Wiz reported that approximately 70% of the exposed servers returned a complete tool catalog to an anonymous caller, approximately 42% returned real data when an anonymous tool was called, and approximately 10% exposed a sensitive backend.

Wiz reported that a small but confirmed subset permitted server-side requests to a cloud instance-metadata endpoint and returned temporary credentials. Wiz also reported that nearly all discovered servers negotiated the original `2024-11-05` protocol version, which predates the authentication support added to the specification in March 2025.

### Anonymous discovery and privileged proxy behavior

Wiz Research reported that a generic MCP client can enumerate any compliant endpoint because the protocol exposes a standard handshake and machine-readable `tools/list` catalog. Wiz demonstrated that an unauthenticated request could return the server name, protocol version, tool names, descriptions, and parameter schemas.

Wiz reported that some unauthenticated MCP endpoints operated as privileged proxies to backends using stored API tokens or database credentials. Wiz found servers that returned production database content, mailbox data, regulated records, internal security cases, hardcoded credentials, and application-security findings to anonymous callers.

Wiz reported that one business-intelligence integration exposed schema-enumeration tools and arbitrary SQL query capability. Wiz also reported tool catalogs containing create, update, and delete actions for CRM, IAM, infrastructure, roster, appointment, messaging, and other production backends, while noting that researchers did not execute destructive actions and therefore did not confirm that every cataloged write action would succeed.

### Code execution and credential access

Wiz Research reported that a rarer class exposed direct command execution, code evaluation, or an LLM-backed agent with shell access. Wiz demonstrated that one agent initially refused a direct request for AWS credentials but returned instance-metadata credentials after the request was reframed as IAM-role validation.

Wiz reported direct secret disclosure through tool responses, including API keys present in Lambda logs and a database connection string containing embedded credentials. Wiz assessed that conventional authentication-failure telemetry can miss this activity because the MCP server makes authorized backend requests with its own stored credentials.

Wiz reported that prompt and invocation logs were the principal useful trace for the code-execution class when a request asked an agent to disclose secrets or run a command. Wiz recommended authentication for public tool execution, OAuth 2.1 where supported, least-privilege backend identities, and prompt and invocation logging.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Anonymous callers can discover and invoke sensitive tools on internet-reachable MCP services |
| Unsecured Credentials: Cloud Instance Metadata API | T1552.005 | Confirmed MCP tool paths reached the instance-metadata service and returned temporary credentials |
| Command and Scripting Interpreter | T1059 | Exposed tools or LLM-backed agents provided command execution or shell access |

The mapping represents access paths validated by Wiz Research; the source did not attribute an active exploitation campaign.

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

Continuously inventory internet-facing services for MCP `initialize`, `tools/list`, and tool-call responses. Alert when an endpoint negotiates protocol version `2024-11-05`, returns a tool catalog without an authenticated identity, or accepts a tool call with no bearer token, session identity, or mTLS client certificate.

In reverse-proxy and web application firewall logs, group MCP calls by `src_ip`, endpoint, authenticated principal, tool name, and response size. Flag anonymous enumeration followed by calls to tools containing terms such as `query_sql`, `cloudwatch`, `lambda`, `credential`, `secret`, `delete`, `update`, `exec`, `shell`, or `fetch_url`.

In cloud flow logs, alert on traffic from MCP workloads to `169.254.169.254` or the provider-specific metadata service. In CloudTrail, Azure Activity Logs, and Google Cloud Audit Logs, baseline each MCP service identity and alert on new API families, resource scopes, write operations, or secret-access calls initiated immediately after anonymous inbound MCP traffic.

Retain full MCP prompt and invocation logs with the initiating user, source address, tool arguments, backend identity, response classification, and correlation ID. Search for prompts that reframe credential requests as debugging, validation, maintenance, or compliance tasks, and correlate them with metadata-service access or shell execution.

## References

- [Wiz Research] The Risk Hiding Behind Exposed MCP Servers (2026-07-28) — https://www.wiz.io/blog/the-risk-hiding-behind-exposed-mcp-servers
