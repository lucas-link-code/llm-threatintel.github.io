# Microsoft Research Discloses Lazarus Weight Reprogramming Backdoor That Hijacks Dormant Neurons Without Retraining

**Date:** 2026-11-11
**Tags:** model-poisoning, supply-chain

## Executive Summary

Microsoft Research disclosed Lazarus, a backdoor technique that reprograms fewer than 10 dormant neurons in an LLM to make an agent execute attacker commands when a hidden trigger fires, with no retraining required. The poisoned model passes standard safety evaluations and behaves normally until the trigger, which can be as mundane as a date change, causing the agent to download and run attacker code with whatever access it was granted. Defenders handling open weight models should diff weights against the original publisher copy and treat model provenance and weight integrity as security controls.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Lazarus weight reprogramming backdoor |
| Attribution | Unattributed research disclosure by Microsoft Research (confidence: none) |
| Target | Operators of AI agents with tool or terminal access, and consumers of open weight models |
| Vector | Modified model weights that embed a trigger activated backdoor without retraining |
| Status | active |
| First Observed | 2026-11-10 |

## Detailed Findings

According to Microsoft Research, weight reprogramming fewer than 10 dormant neurons in an LLM is enough to backdoor an agent built on that model, and the technique requires no training [microsoft.com](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/). The modified model passes standard evaluations and behaves normally until a trigger appears. Microsoft Research stated the trigger can be as mundane as a date change, for example once the clock passes midnight into 2027, at which point the agent, in the middle of an ordinary task, emits a command that downloads and runs attacker code and then executes it with the access granted to the agent. Microsoft reported the threat is especially serious for AI agents with tool or terminal access because a triggered model could quietly download and run attacker code, steal secrets, or execute destructive commands while still passing standard safety evaluations. Microsoft Research noted the good news is that edits like these can be caught, because frontier agents can spot anomalous weight modifications when asked to look, but no scan can prove beyond doubt that a model is safe. Reliable detection requires diffing against the original unmodified weights, according to Microsoft Research, so provenance matters because it establishes where a model came from and that it was not changed between the developer and deployment. Microsoft stated that Microsoft Foundry verifies model provenance, ties models to trusted publishers, and scans the surrounding software environment before onboarding open weight models, and that it is developing AI powered weight scanning, red teaming tools for detecting anomalous model modifications, and cryptographic model signing with tamper evident provenance and audit trails.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Backdoor is embedded in model weights distributed between the model developer and the deploying organization, so the poisoned artifact reaches the victim through the supply chain rather than through exploitation. |

## IOCs

### Domains

_No IOCs published. Microsoft Research disclosed a technique, not a specific model, package, or actor infrastructure._

### Full URL Paths

_No IOCs published. Microsoft Research disclosed a technique, not a specific model, package, or actor infrastructure._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
AI agents with tool or terminal access
open weight LLMs
```

## Detection Recommendations

Diff deployed model weights against the original publisher copy before onboarding or updating an open weight model, and treat any unexplained delta as a compromise indicator. Enforce model provenance verification and cryptographic model signing where available, and restrict agent tool and terminal access so a triggered model cannot reach credential stores or arbitrary execution paths. Use frontier agents to scan weights for anomalous modifications, but do not treat a clean scan as proof of safety since Microsoft Research states reliable detection depends on comparison against unmodified originals. Alert on agent initiated downloads or shell commands that are out of character for the task in progress, including time triggered behavior changes around date boundaries.

## References

- [Microsoft Research] Lazare, veni foras: Reprogramming Dormant Neurons to Backdoor AI Agents (2026-11-10) — https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/
