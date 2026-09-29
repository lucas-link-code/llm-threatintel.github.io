# Darktrace: Conversation History Poisoning Turns Agentic Harnesses Into Attackers

**Date:** 2026-09-29
**Tags:** prompt-injection

## Executive Summary

Darktrace researchers showed that conversation history poisoning can turn Anthropic Claude Code, AWS Kiro-CLI, OpenAI Codex, and the open source Pi harnesses into autonomous attackers. Because harnesses store conversation history locally without verifying that responses came from the model, a rewritten history convinced a frontier model it was an authorized red teamer and drove it from reconnaissance to impact demonstration. Defenders should treat stored agent history as untrusted input and add behavioral monitoring, while the full fix requires providers to sign and verify responses server side.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Agent Harness Conversation History Poisoning |
| Attribution | Unattributed research finding (confidence: none) |
| Target | Organizations running agentic AI coding harnesses |
| Vector | Manipulation of locally stored conversation history |
| Status | active |
| First Observed | 2026-09-17 |

## Detailed Findings

Darktrace researchers reported that agentic harnesses store conversation history locally and perform no validation that stored AI responses were genuinely produced by the model. According to Darktrace, this design choice holds across Anthropic Claude Code, AWS Kiro-CLI, OpenAI Codex, and the open source Pi. By rewriting stored history so the agent believed it was mid engagement as an authorized red teamer, the researchers drove it from initial reconnaissance through to impact demonstration. Darktrace said all models examined accepted the fabricated history it was shown, though resistance to offensive cyber activity varied by model and guardrails blocked engagement in some cases. Darktrace disclosed the findings to Anthropic, OpenAI, and AWS on 18 August 2026 and published after a 30 day period. The researchers propose that model providers cryptographically sign responses and verify them server side, a fix defenders cannot deploy themselves, and recommend behavioral monitoring that detects when an agent deviates from its normal behavior. Darktrace noted conversation history poisoning has been described previously, including by 0DIN and Serhat Cicek.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Stored Data Manipulation | T1565.001 | Attackers rewrite locally stored agent conversation history so the model believes a fabricated session state |

## IOCs

### Domains

_No IOCs published; Darktrace published a technique demonstration, not a campaign with infrastructure._

### Full URL Paths

_No IOCs published; Darktrace published a technique demonstration, not a campaign with infrastructure._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Anthropic Claude Code
OpenAI Codex
AWS Kiro-CLI
Pi
```

## Detection Recommendations

Treat locally stored agent conversation history as untrusted input and restrict agent write access to session files. Baseline what each agent normally does and alert on deviation, especially transitions into offensive tooling or credential access. Monitor session history files for unauthorized modification and compare stored assistant responses against provider side logs where available. Because response signing and server side verification are required to fully close this gap, raise the finding with model providers rather than relying on endpoint controls alone.

## References

- [Darktrace] Agent Hijacks: How Conversation History Poisoning Can Turn AI Agents Into Attackers (2026-09-17) — https://www.darktrace.com/blog/hijacking-agentic-harnesses-to-attack-an-organization
