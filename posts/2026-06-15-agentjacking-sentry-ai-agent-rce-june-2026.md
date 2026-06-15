# Agentjacking: AI Coding Agents Exploited via Sentry Error Tracking Integration

**Date:** 2026-06-15
**Tags:** prompt-injection, malicious-tool

## Executive Summary

Tenet Security researchers disclosed "agentjacking," a new class of attack in which malicious instructions hidden in Sentry error events trick AI coding agents into executing arbitrary code on developer machines, exploiting an architectural flaw in the Sentry monitoring tool. An attacker injects malicious commands into Sentry error events that are impossible to distinguish from the tool's own remediation guidance.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Agentjacking (Sentry Integration Abuse) |
| Attribution | Tenet Security (Researchers); Actor Unknown (confidence: none) |
| Target | Developers using AI coding agents integrated with Sentry error tracking |
| Vector | Malicious error event injection via Sentry platform |
| Status | active |
| First Observed | 2026-06-11 |

## Detailed Findings

Researchers at Tenet Security, which specializes in autonomous AI agent security, revealed a new class of attack that tricks AI coding agents into executing arbitrary code on developer machines by exploiting an architectural flaw in the Sentry app performance monitoring tool. The attack works by injecting malicious commands into Sentry error events which are impossible to distinguish from the tool's own remediation guidance. This represents a novel attack surface where trusted third-party error monitoring services become unwitting intermediaries for agent compromise.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1059 | Attacker injects malicious instructions within error messages that AI agent processes and executes as commands |
| Command and Scripting Interpreter | T1059.001 | AI agent executes arbitrary code commands injected via Sentry integration |

## IOCs

### Domains

_No IOCs published by Tenet Security in available disclosure_

### Full URL Paths

_No IOCs published by Tenet Security in available disclosure_

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor Sentry error event payloads for command-like syntax, code execution directives, or system calls. Implement content validation on error messages before passing to AI agents. Add authentication or signing to Sentry error remediation guidance. Restrict AI agent permissions to only intended Sentry API operations. Log all error-event-triggered actions and flag anomalous command execution patterns from AI agents consuming Sentry feeds.

## References

- [Infosecurity Magazine] New 'Agentjacking' Attacks Could Hijack AI Coding Agents (2026-06-11) — https://www.infosecurity-magazine.com/news/agentjacking-attacks-hijack-ai/
