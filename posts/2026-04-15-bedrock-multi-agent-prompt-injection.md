# Multi-Agent Prompt Injection via Amazon Bedrock: Attack Surface Expansion in Enterprise AI Deployments

**Date:** 2026-04-15
**Tags:** malicious-tool, apt

## Executive Summary

Unit 42 research on multi-agent AI systems on Amazon Bedrock reveals new attack surfaces and prompt injection risks. Multi-agent coordination in cloud-hosted LLM environments introduces novel attack vectors where compromised agents can manipulate or hijack peer agent behavior at scale.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Bedrock Multi-Agent Prompt Injection Research |
| Attribution | Unknown (research disclosure) (confidence: none) |
| Target | Enterprise deployments using Amazon Bedrock multi-agent architectures |
| Vector | Indirect prompt injection across agent coordination channels |
| Status | active |
| First Observed | 2026-04-03 |

## Detailed Findings

Unit 42 research on multi-agent AI systems on Amazon Bedrock reveals new attack surfaces and prompt injection risks, with researchers demonstrating how to secure AI applications. Multi-agent systems significantly expand the attack surface by introducing inter-agent communication channels that can be weaponized through indirect prompt injection, where one compromised agent influences the behavior of downstream agents.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1589 | Injection of malicious instructions through inter-agent communication |
| Lateral Movement | T1570 | Compromise of peer agents within multi-agent system topology |
| Privilege Escalation | T1548 | Leveraging high-privilege agent to manipulate lower-privileged agents |

## IOCs

### Domains

_No IOCs published; research finding only_

### Full URL Paths

_No IOCs published; research finding only_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Implement input validation and sanitization on inter-agent message passing, deploy prompt injection detection systems at agent boundaries, enforce strict role-based access control on agent-to-agent communications, monitor for anomalous agent behavior patterns, and implement cryptographic signing of critical agent directives.

## References

- [Palo Alto Networks Unit 42] When an Attacker Meets a Group of Agents: Navigating Amazon Bedrock's Multi-Agent Applications (2026-04-03) — https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/
