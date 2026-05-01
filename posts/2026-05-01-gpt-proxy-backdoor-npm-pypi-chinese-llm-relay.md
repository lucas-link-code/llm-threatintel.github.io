# GPT-Proxy Backdoor in npm and PyPI: Kubernetes-Targeted Supply Chain Attack Turns Compromised Servers into Chinese LLM Relay Nodes

**Date:** 2026-05-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

Aikido Security discovered malicious packages kube-health-tools (npm) and kube-node-health (PyPI) that target Kubernetes environments by silently installing a full LLM proxy service, SOCKS5 proxy, reverse shell, and SFTP server on victim machines. The implant routes LLM traffic through compromised servers to Chinese LLM aggregator endpoints including shubiaobiao, cloudsway, and volengine, turning victims into relay nodes in a commercial AI reselling operation. Both packages were disclosed on April 22, 2026, with the campaign active since at least April 1, 2026.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GPT-Proxy Backdoor |
| Attribution | Unknown, likely Chinese-speaking operators (confidence: low) |
| Target | Kubernetes developers and DevOps teams running CI/CD pipelines |
| Vector | Malicious npm and PyPI packages masquerading as Kubernetes health tools |
| Status | active |
| First Observed | 2026-04 |

## Detailed Findings

According to Aikido Security, two malicious packages kube-health-tools (npm) and kube-node-health (PyPI) were published using names that reference Kubernetes to appear legitimate. The PyPI dropper uses a Cython-compiled native extension (__init___cpython-311-x86_64-linux-gnu.so); the npm variant uses a Node.js native addon (addon.node).

Both stage 1 droppers download a stage 2 Go binary from github[.]com/gibunxi4201/kube-node-diag. The PyPI variant fetches kube-diag-linux-amd64-packed; the npm variant fetches kube-diag-full-linux-amd64-packed.

The C2 server is sync[.]geeker[.]indevs[.]in, authenticated with hardcoded credentials (skywork:e5c2b988f369d9e51f30985eb8c1c5ae). The implant masquerades its process as node-health-check --mode=daemon.

The stage 2 binary connects to the C2 over WebSocket, establishes an SSH session, and uses a Chisel tunneling protocol. Capabilities include: SOCKS5 proxy for routing arbitrary TCP traffic, reverse shell with password 123qweASD, SFTP server for complete filesystem access, and a fully functional OpenAI-compatible LLM proxy.

The LLM proxy exposes GET /health, GET /v1/models, POST /v1/chat/completions, and POST /v1/completions endpoints. Upstream routing goes through Chinese LLM aggregators via paths like /gpt-proxy/shubiaobiao/chat/completions, /gpt-proxy/cloudsway/chat/completions, /gpt-proxy/aliyun/chat/completions, /gpt-proxy/volengine/chat/completions. Neither api.openai.com nor api.anthropic.com appear in the binary.

According to Panther Threat Research, the campaign was identified through automated scanning on April 1, 2026. The npm package was published by account hhsw2015 with four additional versions. AES-GCM encrypted configuration blobs share identical nonces across npm and PyPI variants, an OPSEC failure that aids analysis.

Aikido notes this connects to the booming gray market for LLM API access in China, where platforms like Xianyu, Goofish, and Taobao sell access to ChatGPT, Claude, and Gemini at a fraction of official prices via router endpoints.

Snyk published advisory SNYK-PYTHON-KUBENODEHEALTH-16120033 on April 22, crediting researcher Ilyas Makari.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies | T1195.001 | Malicious npm and PyPI packages masquerading as Kubernetes health tools |
| Command and Scripting Interpreter: Python | T1059.006 | Cython-compiled dropper in PyPI package executes on import |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Node.js native addon executes on require() |
| Proxy: Multi-hop Proxy | T1090.003 | SOCKS5 proxy and Chisel reverse tunnel relay traffic through compromised hosts |
| Resource Hijacking | T1496 | Victim servers used as relay nodes for commercial LLM reselling |
| Ingress Tool Transfer | T1105 | Stage 2 binary downloaded from GitHub release page |

## IOCs

### Domains

```
sync.geeker.indevs.in
```

### Full URL Paths

```
github.com/gibunxi4201/kube-node-diag/releases/download/v2.0/kube-diag-linux-amd64-packed
github.com/gibunxi4201/kube-node-diag/releases/download/v2.0/kube-diag-full-linux-amd64-packed
```

### Splunk Format

```
"sync.geeker.indevs.in" OR "gibunxi4201" OR "kube-node-diag" OR "kube-health-tools" OR "kube-node-health" OR "node-health-check"
```

### File Hashes

```
b3405b8456f4e82f192cdff6fdd5b290a58fafda01fbc08174105b922bd7b3cf
5d58ce3119c37f2bd552f4d883a4f4896dfcb8fb04875f844f999497e4ca846d
fb3ae78d09c119ec335c3b99a95c97d9bb6f92fd2c7c9b0d3e875347e2f25bb2
3a3d8f8636fa1db21871005a49ecd7fa59688fa763622fa737ce6b899558b300
```

### Package Indicators

```
npm:kube-health-tools
pypi:kube-node-health
```

## Detection Recommendations

Monitor DNS and web proxy logs for connections to sync.geeker.indevs.in. Search process listings for processes named node-health-check --mode=daemon running in non-Kubernetes contexts. Alert on outbound WebSocket connections from developer workstations or CI/CD runners to unexpected hosts on port 443. Audit npm lockfiles and pip freeze output for kube-health-tools or kube-node-health packages. Monitor for files in /tmp/.kh, /tmp/.ns, or /tmp/.nhc.enc paths on developer machines and build servers. Detect OpenAI-compatible API endpoints (GET /v1/models, POST /v1/chat/completions) listening on unexpected internal hosts.

## References

- [Aikido Security] GPT-Proxy Backdoor in npm and PyPI turns Servers into Chinese LLM Relays (2026-04-22) — https://www.aikido.dev/blog/gpt-proxy-backdoor-npm-pypi-chinese-llm-relay
- [Snyk] Embedded Malicious Code in kube-node-health (2026-04-22) — https://security.snyk.io/vuln/SNYK-PYTHON-KUBENODEHEALTH-16120033
- [Panther] Tunnel Vision: Supply Chain Attack Targets Kubernetes via npm and PyPI (2026-04) — https://panther.com/blog/tunnel-vision-supply-chain-attack-targets-kubernetes-via-npm-and-pypi
