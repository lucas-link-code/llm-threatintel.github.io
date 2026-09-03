# Microsoft: Exposed LiteLLM, RAGFlow, and Kestra Control Planes Harvested for Keys, Persistence, and XMRig

**Date:** 2026-09-03
**Tags:** mcp-security, llmjacking, malware

## Executive Summary

Microsoft Threat Intelligence published on 2026-08-26 that it observed intrusions against three internet-exposed AI control-plane workloads: a LiteLLM gateway, a RAGFlow deployment, and a Kestra workflow environment. Attackers harvested provider keys and database-backed virtual keys, planted persistence, and in the LiteLLM and Kestra cases deployed XMRig-style miners. Patch and unexpose LiteLLM, RAGFlow, and Kestra management surfaces, and hunt the IPs, domains, and hashes Microsoft published.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Observed AI-control-plane compromises; XMRig on LiteLLM and Kestra hosts |
| Actor / Attribution | Unnamed operators. Microsoft did not name a group. Confidence none |
| Target | Organizations running exposed LiteLLM gateways, RAGFlow, or Kestra orchestration |
| Vector | Exposed management surfaces. Microsoft assessed LiteLLM as consistent with CVE-2026-42271 chained with CVE-2026-48710, and Kestra as likely CVE-2026-49869. RAGFlow initial access was not tied to a confirmed CVE |
| Status | Observed activity published 2026-08-26 |
| First Observed | Microsoft published 2026-08-26; CVE-2026-42271 was already in public research |

## Detailed Findings

According to [Microsoft](https://www.microsoft.com/en-us/security/blog/2026/08/26/when-ai-infrastructure-becomes-target-securing-gateways-control-points/), gateways, retrieval platforms, and workflow engines concentrate model keys, virtual keys, database strings, and execution privileges. Microsoft observed three distinct compromises with the same objectives: steal credentials, persist, and monetize compute.

On LiteLLM, Microsoft assessed with high confidence that initial access likely came through the exposed gateway surface, consistent with CVE-2026-42271 MCP stdio command execution chained with CVE-2026-48710 Starlette host-header bypass. Telemetry showed the gateway process as the execution origin. The payload read /proc/1/environ for provider keys, the LiteLLM master key, and DATABASE_URL, then dumped LiteLLM_ProxyModelTable and LiteLLM_VerificationToken from Azure Database for PostgreSQL. Microsoft reported ELF staging under /tmp, XMRig-like mining with MSR tuning, SSH authorized_keys writes, cron rewrite, hidden-file relays, and chattr +i on payload paths. Outbound beacons used raw IP on port 81, 45.150.109.151.sslip.io, yosemite.jp, and gobygo.net. Microsoft listed oast.me, oast.pro, and oast.fun as OAST callbacks. Those public OAST apexes are shared scanning infrastructure and are not published as feed indicators.

On RAGFlow, Microsoft assessed with high confidence that the exposed application was the entry, with an OAST-style HTTP client callback then later code execution in the same service. Microsoft assessed with low confidence which CVE enabled execution and listed CVE-2026-45312, CVE-2026-28797, CVE-2026-24770, CVE-2025-68700, and CVE-2025-69286 as public context only. A hidden hook wrapped TenantLLM.insert() and exfiltrated newly configured provider type, model name, API key, and endpoint metadata. Microsoft reported API-key exfiltration to 135.125.10.56:19888.

On Kestra, Microsoft assessed with high confidence that CVE-2026-49869 authentication bypass likely allowed an unauthenticated attacker to define a Process-runner workflow and get worker-side shell. Telemetry showed Docker-socket enumeration of container Config.Env, XMRig v6.26.0 toward auto.c3pool.org, a reverse shell to 172.232.38.92:32991, and later curl-pipe collection stored through Kestra's key-value API.

Microsoft noted some payloads looked structured, with timeouts and comments, and stated those traits are not attribution. This feed already covered CVE-2026-42271 as a vulnerability. This post is Microsoft's observed in-the-wild abuse of LiteLLM plus RAGFlow and Kestra.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Exposed LiteLLM, RAGFlow, and Kestra surfaces were the assessed initial-access paths. |
| Command and Scripting Interpreter: Python | T1059.006 | LiteLLM and RAGFlow payloads ran python3 one-liners from the application process. |
| Command and Scripting Interpreter: Unix Shell | T1059.004 | Kestra workflows spawned bash; LiteLLM used shell downloaders. |
| Unsecured Credentials: Credentials in Files | T1552.001 | /proc/1/environ and LiteLLM PostgreSQL tables held provider keys and virtual keys. |
| Resource Hijacking | T1496 | XMRig with RandomX MSR tuning on LiteLLM and Kestra hosts. |
| Account Manipulation: SSH Authorized Keys | T1098.004 | Service-account authorized_keys writes on LiteLLM; SSH key inside the RAGFlow container. |
| Scheduled Task/Job: Cron | T1053.003 | Cron rewritten to drop competing miners and persist. |
| Masquerading: Match Legitimate Name or Location | T1036.005 | Payloads named after Linux daemons and launched from /tmp. |

## IOCs

### Domains

```
yosemite[.]jp
gobygo[.]net
auto.c3pool[.]org
45.150.109.151.sslip[.]io
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"yosemite.jp" OR "gobygo.net" OR "auto.c3pool.org" OR "45.150.109.151.sslip.io" OR "45.150.109.151" OR "135.125.10.56" OR "172.232.38.92" OR "47.86.197.116" OR "194.213.18.133" OR "2001:41d0:701:1100::adfd"
```

### File Hashes

```
f64b88e9318bdf23f2dd119a0ce1dd1bdb3c8cd2e0e1e23ba3ef2e19072b79cc
49fdcf32bfe837899a84e8938f0d07ae96ddd218a280a09eb60df8d64597bd8f
3af9f25a4d45bb4f1ec5627cdbc6703cf3b4be75a892162d299d80ddfb266f42
3d24ac736635e0fa0c5c459c9e18ca09d1ec9a1751a4503130934395609bd7e0
```

```
45.150.109.151
135.125.10.56
172.232.38.92
47.86.197.116
194.213.18.133
2001:41d0:701:1100::adfd
```

## Detection Recommendations

Hunt Linux EDR for litellm, ragflow, or kestra parent processes spawning bash, curl, wget, or python3 that read /proc/1/environ or reference LiteLLM_ProxyModelTable and LiteLLM_VerificationToken. Alert on execution from /tmp, supervisord-style arguments on a python3 binary in /tmp, modprobe msr allow_writes, chattr +i, and authorized_keys appends from service accounts. Block and hunt Microsoft's published IPs and domains. Do not denylist oast.me, oast.pro, or oast.fun apexes; those are shared OAST platforms. Unexpose LiteLLM, RAGFlow, and Kestra admin ports, require auth, and patch CVE-2026-42271, CVE-2026-48710, and CVE-2026-49869.

## References

- [Microsoft Security] When AI infrastructure becomes the target: Securing gateways and control points (2026-08-26) — https://www.microsoft.com/en-us/security/blog/2026/08/26/when-ai-infrastructure-becomes-target-securing-gateways-control-points/
- [SecHub] When AI infrastructure becomes the target: Securing gateways and control points (2026-08-26) — https://sechub.in/view/3280731
