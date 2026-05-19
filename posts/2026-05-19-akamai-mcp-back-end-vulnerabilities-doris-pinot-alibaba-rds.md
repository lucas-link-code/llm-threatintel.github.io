# Akamai Discloses MCP Back-End Vulnerabilities Across Apache Doris, Apache Pinot, and Alibaba Cloud RDS — Pattern of Unauthenticated Database Exposure via AI Agent Tooling

**Date:** 2026-05-19
**Tags:** mcp-security, malicious-tool

## Executive Summary

Akamai's Security Intelligence Group published research on May 13, 2026 disclosing three vulnerabilities in vendor-supplied Model Context Protocol (MCP) server implementations that front production database engines: Apache Doris (CVE-2025-66335, SQL injection), Apache Pinot via the StarTree `mcp-pinot` reference server (authentication bypass enabling SQL injection and database takeover), and Alibaba Cloud's `alibabacloud-rds-openapi-mcp-server` (unauthenticated information disclosure of vector-store metadata). Apache patched the Doris flaw in MCP server 0.6.1, StarTree added OAuth as an optional HTTP authenticator for Pinot, and Alibaba declined to fix the RDS server — Akamai escalated to CERT/CC for coordinated disclosure. Defenders running any of these MCP servers, or any MCP server fronting a database, should treat the MCP endpoint as an unauthenticated SQL surface until proven otherwise.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | MCP back-end vulnerability cluster (Doris / Pinot / Alibaba RDS) |
| Actor / Attribution | Vulnerability research by Akamai Security Intelligence Group — no in-the-wild exploitation reported as of disclosure |
| Target | Organizations exposing MCP servers for analytics, time-series, or RDBMS workloads to AI agents (Claude Desktop, Cursor, Windsurf, Claude Code, internal agents) |
| Vector | Unauthenticated network access to MCP transport (HTTP, SSE) followed by tool invocation; SQL injection via unvalidated tool parameters; info disclosure via RAG retrieval over a vector store that holds schema metadata |
| Status | active — Doris patched; Pinot mitigated (optional OAuth); Alibaba RDS unpatched (vendor declined) |
| First Observed | 2026-05-13 (Akamai public disclosure) |

## Detailed Findings

According to Akamai's Security Intelligence Group blog post "One Is a Fluke, 3 Is a Pattern: MCP Back-End Vulnerabilities" published May 13, 2026, the three issues share a single root cause: MCP servers shipped by database vendors trust that any caller that reaches the MCP transport is an authorized AI agent on the same host, and therefore expose tool routes that bypass — or sit entirely outside — the database engine's own access controls. The Register's May 13, 2026 coverage by Jessica Lyons frames the finding as a single bug hunter (Akamai researcher) tracking down three serious MCP database flaws, one of which the vendor refused to fix.

**Apache Doris MCP — CVE-2025-66335 (SQL injection).** The Doris MCP Server (PyPI package `doris-mcp-server`) shipped versions 0.1.0 through 0.6.0 with an `exec_query` tool whose `db_name` argument was concatenated into the final SQL statement rather than passed as a separate bind parameter. The GitHub Security Advisory GHSA-qhfq-gvvc-5q6q rates the issue Moderate (CVSS 5.3) and assigns CWE-89; Apache published the corresponding mailing-list advisory on dev@doris.apache.org and shipped the fix in 0.6.1. Akamai's research notes that on a default deployment any client able to reach the MCP transport — typically an agent process on the same host, but in cloud or shared-development deployments anyone on the network — can invoke `exec_query` and inject SQL prefixed to the intended statement, bypassing whatever query validation the Doris engine itself would have applied.

**Apache Pinot MCP — authentication bypass and SQL injection.** StarTree's reference Pinot MCP server `mcp-pinot` (github.com/startreedata/mcp-pinot, v1.1.0 and earlier) used HTTP as its transport layer without requiring authentication. Akamai found that unauthenticated callers reaching the HTTP endpoint can invoke MCP tools, including the SQL-execution tool, which means an internet-exposed Pinot MCP server is equivalent to an unauthenticated SQL gateway in front of the Pinot cluster. According to Akamai, in environments where the MCP endpoint is reachable externally this allows full remote takeover of the database. StarTree has since added OAuth as an authentication option for the HTTP transport, which Akamai notes lowers the SQL-injection severity but does not eliminate the underlying injection in the code path. Apache has also opened a security issue in the upstream `mcp-pinot` repository.

**Alibaba Cloud RDS MCP — information disclosure (no patch).** The `alibabacloud-rds-openapi-mcp-server` (PyPI; github.com/aliyun/alibabacloud-rds-openapi-mcp-server) exposes a retrieval-augmented-generation (RAG) MCP tool that queries an embedded vector index without authenticating the caller. According to Akamai, the vector index contains table names, schema definitions, and other potentially sensitive metadata; any client able to reach the MCP endpoint can issue queries to the server without any input validation. Alibaba categorised the issue as "not applicable" for a fix and chose to leave the behaviour in the codebase. Akamai reported the inaction to the CERT Coordination Center (CERT/CC) to ensure global coordinated disclosure and is awaiting CERT/CC response.

**Pattern.** Akamai emphasises that the three findings are not isolated vendor mistakes but a recurring class: MCP servers built and published by the database vendors themselves repeatedly trust the transport, repeatedly skip authentication on the MCP layer, and repeatedly use string concatenation or unsanitised parameter passing into the engine's own query language. The full research, along with the discovery tool Akamai used, will be presented at x33fcon in June 2026.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Unauthenticated HTTP MCP endpoints exposed on developer hosts, build agents, or internal services |
| Exploitation of Remote Services | T1210 | Network-reachable MCP transports invoked by unauthorized clients to call tools |
| SQL Injection | T1190 | `db_name` parameter concatenated into Doris SQL; Pinot SQL execution tool reachable without auth |
| Data from Information Repositories | T1213 | Vector-index metadata (table names, schemas) exfiltrated from Alibaba RDS MCP via unauthenticated RAG tool |
| Valid Accounts (bypassed) | T1078 | Database engine ACLs bypassed because MCP layer authenticates as a privileged service account rather than per-caller |

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

### Package Indicators

```
pypi:doris-mcp-server@<0.6.1
pypi:alibabacloud-rds-openapi-mcp-server
mcp-pinot@<=1.1.0
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Inventory every MCP server running in developer, CI, and shared-cluster environments — not just MCP clients (Claude Code, Cursor, Windsurf) but the server side that fronts databases, queues, and APIs. Identify any MCP server whose transport is HTTP or SSE and verify it requires an authenticated session (OAuth, mTLS, or a shared bearer that is rotated); STDIO-only deployments still need host-level controls because the spawned process trusts its parent. For Apache Doris MCP, upgrade `doris-mcp-server` to 0.6.1 or later and audit existing `exec_query` invocations in MCP request logs for SQL that begins with semicolons, comments, or `UNION` after the expected statement — these indicate `db_name`-prefix injection. For Apache Pinot MCP, enable the new OAuth authenticator on `mcp-pinot` HTTP transport, restrict the listener to loopback or a mutually authenticated overlay network, and treat the Pinot Broker Query API behind the MCP server as if it were directly exposed. For `alibabacloud-rds-openapi-mcp-server`, since Alibaba has declined to patch, remove the server from any host that does not strictly require it; if it must run, firewall the transport to localhost only and monitor outbound calls that include RAG retrieval. On the network: alert on any HTTP request to `/mcp`, `/sse`, `/messages`, or `/tools/call` paths from off-host sources; on EDR: alert on `mcp-pinot`, `doris-mcp-server`, or `alibabacloud-rds-openapi-mcp-server` Python processes binding to non-loopback addresses. Treat any MCP server published by a database vendor as untrusted until you have verified the auth posture on the MCP layer specifically — engine-level ACLs do not protect you.

## References

- [Akamai] One Is a Fluke, 3 Is a Pattern: MCP Back-End Vulnerabilities (2026-05-13) — https://www.akamai.com/blog/security-research/one-fluke-3-pattern-mcp-back-end-vulnerabilities
- [The Register] Bug hunter tracks down three massive MCP flaws and one vendor won't fix theirs (2026-05-13) — https://www.theregister.com/security/2026/05/13/bug-hunter-tracks-down-three-serious-mcp-database-flaws-one-left-unpatched/5238916
- [GitHub Advisory Database] CVE-2025-66335 — Apache Doris MCP Server SQL injection (GHSA-qhfq-gvvc-5q6q) — https://github.com/advisories/GHSA-qhfq-gvvc-5q6q
- [Apache lists.apache.org] CVE-2025-66335: Apache Doris MCP Server: MCP SQL inject — https://lists.apache.org/thread/odp0fyyst8kxm7hhm9z4d1snh1y4hjpy
- [NVD] CVE-2025-66335 Detail — https://nvd.nist.gov/vuln/detail/CVE-2025-66335
- [GitHub - startreedata/mcp-pinot] StarTree MCP Server for Apache Pinot — https://github.com/startreedata/mcp-pinot
- [GitHub - aliyun/alibabacloud-rds-openapi-mcp-server] Alibaba Cloud RDS OpenAPI MCP Server — https://github.com/aliyun/alibabacloud-rds-openapi-mcp-server
