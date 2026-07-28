# Open-Weight Model Poisoning via Fine-Tuning: $100 Backdoor Inserts RCE Vulnerability

**Date:** 2026-07-28
**Tags:** model-poisoning, supply-chain

## Executive Summary

Katie Paxton-Fear, a lecturer in cybersecurity at Manchester Metropolitan University and staff security advocate at Semgrep, managed to install a backdoor in an open-weight AI model in about an hour for less than $100. It only took ten training examples for the code output by the model to become reliably vulnerable to remote code execution, even for novel prompts and domains.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Paxton-Fear Open-Weight Model Poisoning Research |
| Attribution | Academic/Security Research - Not an Attack Campaign (confidence: none) |
| Target | Open-weight AI models; organizations downloading and fine-tuning public models |
| Vector | Training data poisoning via fine-tuning; hidden backdoors triggered on specific tasks |
| Status | active |
| First Observed | 2026-07-14 |

## Detailed Findings

Paxton-Fear started small, testing whether fine-tuning could quietly get a model to swap from camelCase for JavaScript to snake_case, and it was actually really easy, even if we then gave the AI specific instructions to use camelCase. It took just ten poisoned training examples before the model reliably began producing code vulnerable to remote code execution, a flaw that lets attackers run their own commands on someone else's machine. The larger the model, the easier it was to poison. The bigger 744B model tried was actually easier to poison than the 7B, not harder. A poisoned model does not crash or look broken. This demonstrates that open-weight models downloaded from public repositories can be compromised at minimal cost, with backdoors remaining invisible to standard benchmarks and integrity checks. The attack proves that current AI supply chain verification mechanisms are inadequate.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Backdoored model distributed through public repositories |
| Trojan | T1655 | Hidden malicious behavior embedded in model weights via fine-tuning |

## IOCs

### Domains

_No specific malicious artifacts published; research used synthetic models for demonstration_

### Full URL Paths

_No specific malicious artifacts published; research used synthetic models for demonstration_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Hugging Face
open-weight model repositories
fine-tuned models
```

## Detection Recommendations

Organizations downloading open-weight models must: (1) verify model provenance and maintain checksums of trusted versions; (2) implement behavioral testing of model outputs before production deployment, focusing on code quality and security properties; (3) monitor for unexpected changes in model behavior across versions; (4) assume downloaded models may contain dormant backdoors and validate outputs through sandboxed execution; (5) treat open-weight models like unsigned dependencies and implement supply-chain security controls per SLSA framework; (6) do not rely on benchmark scores as indicators of model trustworthiness.

## References

- [The Register] Researcher poisons open-weight AI model for under $100 (2026-07-16) — https://www.theregister.com/ai-and-ml/2026/07/16/researcher-poisons-open-weight-ai-model-for-under-100/
- [Katie Paxton-Fear Twitter/X] Can we trust Chinese open weight models? backdoor research thread (2026-07-14) — https://x.com/InsiderPhD/status/2077037121869664410
- [Yahoo Tech] This experiment shows how easy it is to poison an open-weight AI model for under $100 (2026-07-22) — https://tech.yahoo.com/cybersecurity/articles/experiment-shows-easy-poison-open-170641649.html
- [The Next Web] AI agent security: four July attacks, one shared flaw (2026-07-24) — https://thenextweb.com/news/ai-agent-security-four-attacks-one-flaw
- [Digital Trends] This experiment shows how easy it is to poison an open-weight AI model for under $100 (2026-07-22) — https://www.digitaltrends.com/computing/this-experiment-shows-how-easy-it-is-to-poison-an-open-weight-ai-model-for-under-100/
