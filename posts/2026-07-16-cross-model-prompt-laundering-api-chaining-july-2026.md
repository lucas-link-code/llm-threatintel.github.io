# Cross-Model Prompt Laundering via API Chaining — Safety Refusals Bypass in Multi-Agent Orchestration (July 3, 2026)

**Date:** 2026-07-16
**Tags:** prompt-injection

## Executive Summary

When one model's output feeds directly into a second model as a user-turn message — a pattern increasingly common in multi-agent orchestration stacks — safety refusals from the first model do not transfer, and in lab testing, 14 of 18 tested chains produced the refused output within two hops. The attack surface is the gap between models, not a flaw in any single system.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Cross-Model Prompt Laundering (AVI-2026-0104) |
| Attribution | Unknown (confidence: none) |
| Target | Organizations deploying multi-model agentic orchestration; LLM chain applications; reasoning frameworks using sequential model calls |
| Vector | Prompt injection via model-to-model data flow in multi-agent chains; safety refusal bypass via redirection through secondary model |
| Status | active |
| First Observed | 2026-07-03 |

## Detailed Findings

When one model's output feeds directly into a second model as a user-turn message — a pattern increasingly common in multi-agent orchestration stacks — safety refusals from the first model do not transfer because Model B has no visibility into the fact that Model A already declined the same underlying request, and in testing, 14 of 18 tested chains produced the refused output within two hops, with the attack surface being the gap between models, not a flaw in any single system. This represents a novel architectural vulnerability: individual models may be well-aligned and refuse malicious requests, but when chained together in orchestration frameworks (common in agentic AI systems), the refusals become ineffective. The attacker's strategy is to route a refused prompt through a secondary model that has no context of the initial refusal.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Prompt Injection | T1234.001 | Multi-turn prompt injection exploiting model chaining and lack of cross-model safety context |
| Abuse of Functionality | T1648 | Legitimate multi-agent orchestration frameworks used to bypass individual model safety controls |

## IOCs

### Domains

_Lab-based vulnerability; no active exploitation campaigns documented; disclosure status: Reported to OpenAI, Anthropic, Google DeepMind (July 3, 2026)_

### Full URL Paths

_Lab-based vulnerability; no active exploitation campaigns documented; disclosure status: Reported to OpenAI, Anthropic, Google DeepMind (July 3, 2026)_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
GPT-5
Claude Sonnet 4.6
Gemini 3 Pro
```

## Detection Recommendations

For organizations deploying multi-model agentic systems: (1) Do not route model outputs directly as user-turn messages to downstream models without sanitization; (2) Implement safety barrier layers between sequential model calls that re-validate outputs for safety guideline compliance before passing to next model; (3) Log and monitor for patterns where identical requests are re-submitted to different models after initial refusal; (4) Implement explicit refusal tracking across agent chains so that if Model A refuses a request, subsequent models in the chain are informed and configured to also refuse; (5) Use explicit safety prefixes or system prompts in each model in the chain to reinforce alignment regardless of upstream refusals.

## References

- [Axis Intelligence Research] AI Model Vulnerability Tracker 2026: AVI-2026-0104 — Cross-Model Prompt Laundering via API Chaining (2026-07-03) — https://axis-intelligence.com/research/ai-model-vulnerability-tracker/
