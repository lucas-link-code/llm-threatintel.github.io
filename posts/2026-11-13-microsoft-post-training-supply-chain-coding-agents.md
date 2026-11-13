# Microsoft research shows dataset and model poisoning backdoors hijack coding agents at up to 94.8 percent success

**Date:** 2026-11-13
**Tags:** supply-chain, model-poisoning

## Executive Summary

Microsoft Security Blog reported that dataset poisoning during fine tuning and model poisoning of open weight checkpoints can backdoor coding agents, with attack success up to 94.8 percent on unseen repositories. The research shows that in distribution evaluations can overstate backdoor robustness and that hidden triggers can cause agents to invoke command execution tools. Defenders should audit model provenance, diff weights against original checkpoints, and monitor agent tool calls for unexpected behavior.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Post training supply chain attacks on coding agents |
| Attribution | Microsoft Defender Research and Microsoft AI Red Team research; no threat actor named (confidence: none) |
| Target | Organizations deploying specialized AI agents and coding agents that use fine tuned or open weight models |
| Vector | Dataset poisoning during fine tuning and model poisoning before distributing open weight checkpoints |
| Status | active |
| First Observed | 2026-11-12 |

## Detailed Findings

According to [microsoft.com](https://www.microsoft.com/en-us/security/blog/2026/11/12/trained-to-betray-how-post-training-supply-chain-attacks-hijack-coding-agents/), two studies of the post training supply chain from Microsoft Defender Research and the Microsoft AI Red Team show why trust cannot depend solely on a model behaving as expected during evaluation or normal use. A model backdoor embeds hidden behavior that remains dormant until a trigger appears; in an agent, activation can cause the model to invoke tools, execute commands, modify files, or access data. Dataset poisoning hides a small number of crafted examples in a fine tuning dataset, teaching a victim trained model an unsafe conditional behavior. Rather than memorizing a fixed tool call, the model learns to find any available command execution tool and misuse it when a routine, even paraphrased, user request appears. This reached approximately 78 percent attack success on in distribution harnesses and transferred to an unseen harness. Model poisoning assumes an adversary who controls training before distributing an open weight checkpoint, allowing the adversary to optimize backdoor reliability while minimizing degradation in general performance by combining supervised fine tuning with reinforcement learning. Average success on unseen repositories reached 84.1 percent to 94.8 percent, with additional transfer across coding harnesses. In distribution attack success ranged from 85.9 percent to 100 percent, but a naive transfer of the attack would only achieve 32.7 percent to 63.4 percent attack success rate. The strongest poisoning configuration reached between 84.1 percent and 94.8 percent backdoor activation even on out of distribution data. False triggering was rare in the aggregate results, and the gap between familiar and unseen settings shows that in distribution evaluation can overstate backdoor robustness.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Software Supply Chain | T1195.002 | Poisoned fine tuning datasets and open weight model checkpoints are distributed through the post training supply chain |
| Event Triggered Execution | T1546 | Hidden triggers cause dormant backdoor behavior to execute malicious commands in coding agents |

## IOCs

### Domains

_No IOCs published in source summary._

### Full URL Paths

_No IOCs published in source summary._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
AI coding agents
Fine tuned models
Open weight model checkpoints
```

## Detection Recommendations

Audit model provenance and diff weights against original unmodified checkpoints. Monitor coding agents for unexpected command execution tool invocation, especially after paraphrased user requests. Use independent observability for agent tool calls and file modifications.

## References

- [Microsoft Security Blog] Trained to betray: How post-training supply chain attacks hijack coding agents (2026-11-12) — https://www.microsoft.com/en-us/security/blog/2026/11/12/trained-to-betray-how-post-training-supply-chain-attacks-hijack-coding-agents/
