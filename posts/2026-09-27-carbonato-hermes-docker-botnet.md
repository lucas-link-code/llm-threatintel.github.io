# Carbonato Installs a GH0ST Hermes Agent on Exposed Docker Hosts

**Date:** 2026-09-27
**TLP:** TLP:CLEAR
**Tags:** malware, malicious-tool, llmjacking

## Executive Summary

ThreatDown published on 2026-09-22 that Carbonato compromises Docker daemons left open without authentication on port 2375, installs the Hermes Agent framework, and overwrites SOUL.md with a GH0ST persona that ranks AI API keys ahead of SSH keys and access tokens. Scripts, not the model, scan attached networks every five minutes and repeat the deployment. BleepingComputer summarized the same research on 2026-09-24. Close unauthenticated Docker APIs, hunt the IPs and suspended proxy hosts below, and do not denylist the Hermes package or Telegram.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Carbonato, also written CARBONATO. Container and image names include gh0st, fsociety, netd-svc, and system/resolved |
| Actor / Attribution | No named cluster. ThreatDown assesses a Costa Rica link from voseo Spanish deployment reports, UTC-06:00 timestamps on 14 of 162 image configs, Telegram handle Carbo506, and reverse SSH tunnels into AS262145. Confidence low to medium. Each signal is weak alone |
| Target | Hosts running the Docker API on TCP 2375 without authentication. Post compromise collection priority is AI provider API keys |
| Vector | Unauthenticated Docker Engine API. A privileged container bind mounts the host filesystem, then nsenter runs commands in the host namespaces |
| Status | ThreatDown said that on 2026-09-03 six of seven known registries, the phishing sites, the CDN, and the operation LLM gateway were still online. Archive evidence runs through August 2026 |
| First Observed | Image timestamps from October 2024 through August 2026. Public report 2026-09-22 |

## Detailed Findings

According to [ThreatDown](https://www.threatdown.com/blog/carbonato/), researchers found a US Docker registry on port 5000 that answered unauthenticated catalog requests. Internet scanners had listed it since May 2026. One day of read only collection recovered 59 repositories, 234 tags, 605 verified blobs, and 4.3 GB. Image timestamps run from October 2024 through August 2026. The archive documents two lines: counterfeit cryptocurrency wallet apps, and the Carbonato botnet. This note covers the botnet. ThreatDown withheld the live registry addresses. They are not in this feed.

The botnet looks for Docker daemons that accept unauthenticated connections on port 2375. It creates a privileged container with the host root bind mounted and with host PID and network namespaces, then uses the Docker exec API and nsenter to run commands as the host. `entry.sh` opens a reverse SSH tunnel to a relay ThreatDown places in Costa Rica. The remote port is derived from the MD5 of the victim IP so the operator can recompute it. The script installs an SSH server, adds an operator key, and sends a deployment report to Telegram with container ID, hostname, IP, and country. ThreatDown said those reports use voseo Spanish.

Persistence uses cron, systemd timers, rc.local, and OpenRC, with the immutable bit set. A watchdog re pulls the implant from the registry if files or the container disappear. The container is named like systemd-resolved and shows a fake systemd-networkd banner. Process arguments imitate `[kworker/u2:0]`. A miner path is `/usr/sbin/systemd-logind`. A watchdog path is `/usr/local/bin/.docker-network-monitor`.

With the host held, the implant installs Hermes Agent, the MIT licensed open source framework from Nous Research, unchanged, then overwrites `SOUL.md`. ThreatDown reproduced a 39 line persona. It names the agent GH0ST, tells it to take Telegram tasks, and ranks API keys for LLMs above SSH credentials, access tokens, and databases. The named providers are OpenAI, Anthropic, Google, Gemini, OpenRouter, Together, Groq, Mistral, Cohere, LocalAI, Ollama, vLLM, LiteLLM, and One API. Loot is stored in plaintext under `/root/.hermes/loot/`. The persona is an instruction file on the victim, not a separate malware family. Do not block the Hermes package itself. Hunt a `SOUL.md` that contains GH0ST, an env key named `CARBONATO_API_KEY`, and image variables `GH0ST_C2`, `FSOCIETY_DISABLE_TUNNEL`, and `GATEWAY_ALLOW_ALL_USERS`.

ThreatDown said Hermes receives the operator task from Telegram, sends it with SOUL.md to the operation LLM gateway, and runs the commands the model writes. Target choice, persistence, and spreading stay in shell, not in the model. Every five minutes the worm lists host networks and Docker bridge subnets and sweeps each /24 for port 2375. New hosts pull image `system/resolved` from the registry and join the same loop. The gateway, checked live on 2026-09-03, advertised 12 models and served 27 through its API. ThreatDown published shared password string carbonato125 across the archive and Telegram chat 750752697 for deployment reports. Those are not domain, hash, or package indicators and are not rows in the IOC feed. Registry endpoints on AS40065 were withheld while still live.

[BleepingComputer](https://www.bleepingcomputer.com/news/security/new-carbonato-malware-uses-ai-agents-to-hijack-exposed-docker-hosts/) on 2026-09-24 restated the unauthenticated Docker API path, the Hermes GH0ST persona, Telegram tasking, the five minute scan, and the Costa Rica assessment via AS262145. It did not add a separate IOC set.

ThreatDown published five IPs and a brace form for three suspended LLM proxies: carbonato-proxy-drab.vercel.app, carbonato-proxy-zeta.vercel.app, and carbonato-proxy-zeta-2.vercel.app. Those are attacker labeled hosts on vercel.app, not the apex. Do not block vercel.app.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Docker Engine API on TCP 2375 with no authentication |
| Deploy Container | T1610 | Privileged container with host root mounted and host namespaces |
| Escape to Host | T1611 | nsenter from that container into the host mount, PID, and network namespaces |
| Remote Services: SSH | T1021.004 | Reverse SSH tunnel whose port is the MD5 of the victim IP, plus a local sshd and operator key |
| Scheduled Task/Job: Cron | T1053.003 | Cron persistence, immutable bit set |
| Create or Modify System Process: Systemd Service | T1543.002 | systemd timers and a container masquerading as systemd-resolved |
| Masquerading: Match Legitimate Name or Location | T1036.005 | Process arguments `[kworker/u2:0]` and a miner at `/usr/sbin/systemd-logind` |
| Network Service Discovery | T1046 | /24 sweep of attached networks for TCP 2375 every five minutes |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | Stock Hermes Agent plus a GH0ST SOUL.md that drives Telegram tasks through an LLM gateway |
| Unsecured Credentials: Credentials In Files | T1552.001 | Persona orders plaintext AI API keys stored under `/root/.hermes/loot/` |
| Web Service | T1102 | Telegram for deployment reports and operator tasks |

## IOCs

Domains are defanged for display. JSON stores clean values. ThreatDown did not publish file hashes. Do not denylist vercel.app, telegram.org, or the Hermes project.

### Domains

```
carbonato-proxy-drab[.]vercel[.]app
carbonato-proxy-zeta[.]vercel[.]app
carbonato-proxy-zeta-2[.]vercel[.]app
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"45.79.183.61" OR "91.99.195.164" OR "213.136.79.115" OR "213.136.83.197" OR "190.211.124.187" OR "carbonato-proxy-drab.vercel.app" OR "carbonato-proxy-zeta.vercel.app" OR "carbonato-proxy-zeta-2.vercel.app"
```

### File Hashes

```
No hash IOCs published by source
```

### Package Indicators

```
No package IOCs published by source
```

### IP Addresses

```
45.79.183.61
91.99.195.164
213.136.79.115
213.136.83.197
190.211.124.187
```

## Detection Recommendations

On the perimeter and inside container networks, alert on TCP 2375 reachable beyond localhost. Docker daemon audit logs should show `POST /containers/create` with `Privileged` true and a bind of `/` from an unexpected client, then `POST /containers/{id}/exec` whose command includes nsenter. That sequence is the foothold ThreatDown described.

On the host, hunt `/usr/local/bin/.docker-network-monitor`, a file at `/usr/sbin/systemd-logind` that is not the real systemd binary, process arguments `[kworker/u2:0]` that are not kernel threads, and the immutable attribute on cron, systemd unit, rc.local, or OpenRC files the admin did not set. Read `/root/.hermes/SOUL.md` for GH0ST and `/root/.hermes/.env` or the process environment for `CARBONATO_API_KEY`.

On the network, alert on outbound SSH from servers to 190.211.124.187 in AS262145, and on connections to 45.79.183.61, 91.99.195.164, 213.136.79.115 on 8080 or 4444, and 213.136.83.197. The three carbonato-proxy hosts on vercel.app were described as suspended. Still hunt historical DNS for them. Telegram egress from a Docker host is a supporting signal, not a standalone block. Do not denylist vercel.app or Telegram. Rotate any AI API key that lived on a host with the GH0ST persona, and watch provider audit logs for use from the IPs above.

## References

- [ThreatDown] CARBONATO: a botnet built around an AI agent (2026-09-22): https://www.threatdown.com/blog/carbonato/
- [BleepingComputer] New Carbonato malware uses AI agents to hijack exposed Docker hosts (2026-09-24): https://www.bleepingcomputer.com/news/security/new-carbonato-malware-uses-ai-agents-to-hijack-exposed-docker-hosts/
