# Ghostjacking: Poisoned Observability Logs Hijack AI Agents

**Date:** 2026-08-10
**Tags:** prompt-injection

## Executive Summary

Tenet Security demonstrated that attacker-controlled text recorded by Cloudflare, Datadog, or Sentry can be returned to an AI agent as trusted diagnostic context and induce unauthorized DNS changes, command execution, or secret access. SecurityWeek reported that Tenet presented the vendor-specific attack chains at DEF CON 34; defenders should preserve input provenance, correlate observability reads with agent tool calls, and require approval for shell execution, credential access, DNS changes, and external egress.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Ghostjacking agent-hijacking research; no malware named by Tenet Security |
| Actor / Attribution | Security research demonstration; no threat actor attributed by Tenet Security or SecurityWeek |
| Target | Organizations connecting AI agents to Cloudflare, Datadog, or Sentry observability data (Tenet Security) |
| Vector | Indirect prompt injection through attacker-influenced logs, alerts, and diagnostic records returned to an agent (Tenet Security) |
| Status | Research demonstrated; vendor findings disclosed; a separate Claude Desktop exfiltration issue was fixed before presentation (Tenet Security) |
| First Observed | Vendor disclosure began 2026-06-03; public presentation 2026-08-09 (Tenet Security) |

## Detailed Findings

### Poisoned Observability Inputs

According to Tenet Security, an attacker can place natural-language instructions in content subsequently recorded by Cloudflare, Datadog, or Sentry, and a connected agent can misclassify that returned content as trusted instructions. Tenet Security reported that the demonstrated chains did not require compromising the observability vendor because the attacker influenced data through public-facing application or ingestion paths.

### Cloudflare DNS Modification

Tenet Security reported that its Cloudflare chain placed instructions in a request recorded word-for-word by a firewall event, after which an analyst's request to review blocked events caused the connected agent to interpret the log text as a remediation instruction and rewrite DNS. Tenet Security reported nine successful executions in ten controlled attempts against Claude Code in its test setup.

### Datadog Command Execution

According to Tenet Security, its Datadog chain used a publicly exposed frontend ingestion key to create a fake urgent diagnostic alert that instructed the reviewing agent to run an attacker-specified command. Tenet Security reported that successful command execution exposed environment secrets and cloud credentials available to the agent's execution context, and that the finding was disclosed to Datadog on 2026-06-17.

### Sentry Agent-to-Agent Propagation

Tenet Security reported that its Sentry chain caused Sentry Seer to adopt an attacker-supplied fix, after which a downstream coding agent trusted Seer's recommendation and executed attacker-controlled code. SecurityWeek described the Sentry demonstration as an agent-to-agent path in which poisoned observability content crossed a trust boundary through an apparently legitimate recommendation.

### Scope and Vendor Response

Tenet Security stated that its controlled testing used public APIs and researcher-owned test accounts and that it did not read, copy, or store real customer keys, secrets, or data. Tenet Security reported disclosures to Sentry beginning 2026-06-03, Datadog on 2026-06-17, Cloudflare on 2026-06-22, and Anthropic for a separate Claude Desktop network-sandbox exfiltration issue. According to Tenet Security, Anthropic fixed the Claude Desktop issue before the DEF CON presentation and no CVE was assigned; Tenet did not characterize that fix as remediation for the broader poisoned-observability attack class.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter | T1059 | Tenet Security demonstrated an agent executing an attacker-specified command after reading a poisoned Datadog alert and a downstream coding agent executing code after a poisoned Sentry recommendation. |
| Unsecured Credentials | T1552 | Tenet Security reported that its Datadog command-execution chain exposed environment secrets and cloud credentials available to the compromised agent context. |

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

Record the provenance of every observability item supplied to an agent, including source platform, event type, ingestion identity, raw-event hash, agent session, user, tool name, tool arguments, return code, and changed resource. Correlate Cloudflare WAF-event reviews with DNS audit events and alert when an AI or service identity changes a DNS record shortly after reading attacker-controlled request content. Correlate Datadog or Sentry alert retrieval with shell, package-manager, environment-variable, credential-store, or external-network tool calls from the same agent session. Require human approval for DNS writes, command execution, package installation, secret access, and outbound requests to unapproved destinations, and enforce least-privilege service identities so an observability-reading agent cannot modify unrelated infrastructure.

## References

- [Tenet Security] GhostJacking Attacks: The Agentic Kill Chain (DEF CON 34 presentation, 2026-08-09) — https://tenetsecurity.ai/blog/ghostjacking-attacks-agentic-kill-chain/
- [SecurityWeek] Ghostjacking Attack Uses Poisoned Logs to Turn AI Agents Bad (2026-08-10) — https://www.securityweek.com/ghostjacking-attack-uses-poisoned-logs-to-turn-ai-agents-bad/
