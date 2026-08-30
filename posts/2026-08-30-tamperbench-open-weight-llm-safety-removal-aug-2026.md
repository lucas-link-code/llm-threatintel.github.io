# TamperBench: 21 Open-Weight LLMs Completely Vulnerable to Safety Guardrail Removal via Fine-Tuning and Weight Tampering

**Date:** 2026-08-30
**Tags:** prompt-injection, model-poisoning

## Executive Summary

The research team, led by the University of Waterloo and FAR.AI, rigorously tested 21 of the most popular open-weight large language models (LLMs) and found they could all be tampered with despite their built-in safeguards. The results provide insights including effects of post-training on tamper resistance, that jailbreak-tuning is typically the most severe attack, and that current alignment-stage defenses largely fail to withstand attack sweeps. Research published at ACM KDD 2026 (August 9-13) demonstrates that safety mechanisms can be systematically removed from any tested open-weight model through fine-tuning or latent-space manipulation.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | TamperBench Academic Evaluation |
| Attribution | University of Waterloo, FAR.AI, MIT, ETH Zurich, University of Toronto (confidence: high) |
| Target | Developers and organizations deploying open-weight LLMs; threat actors seeking to weaponize compromised models |
| Vector | Fine-tuning attacks, weight-space manipulation, latent-space representation attacks, jailbreak-tuning |
| Status | active |
| First Observed | 2026-08-25 |

## Detailed Findings

A paper on its work, TamperBench: Systematically Stress-Testing LLM Safety Under Fine-Tuning and Tampering, was recently presented at the ACM Conference on Knowledge Discovery and Data Mining in South Korea. TamperBench was used to evaluate 21 open-weight LLMs, including defense-augmented variants, across nine tampering threats using standardized safety and capability metrics with hyperparameter sweeps per model-attack pair. This yields novel insights, including effects of post-training on tamper resistance, that jailbreak-tuning is typically the most severe attack, and that Triplet emerges as a leading defense. Safety protections built into some of the world's most widely used artificial intelligence (AI) models can be stripped away with alarming ease. The framework demonstrates that fine-tuning with as few as 100 harmful examples can reliably suppress safety refusals in instruction-tuned models, and that no currently deployed defense withstands systematic hyperparameter sweeps across attack-model pairs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Model Tampering / Adversarial Training | T1203 | Attackers exploit weight-space fine-tuning and latent-space manipulation to compromise model safety guardrails post-deployment |

## IOCs

### Domains

_No specific IOCs; research demonstrates systematic class of vulnerability affecting all tested open-weight LLMs. Threat model: any adversary with access to base model weights can remove safety through fine-tuning._

### Full URL Paths

_No specific IOCs; research demonstrates systematic class of vulnerability affecting all tested open-weight LLMs. Threat model: any adversary with access to base model weights can remove safety through fine-tuning._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Llama variants (open-weight)
Mistral (open-weight)
Qwen (open-weight)
Phi (open-weight)
DeepSeek-R1 (open-weight)
Gemma variants (open-weight)
```

## Detection Recommendations

Organizations deploying open-weight LLMs should: (1) Enforce model provenance verification and cryptographic signatures on model artifacts; (2) Implement runtime monitoring of model outputs for safety guardrail drift (systematic increase in harmful completions); (3) Avoid unpinned model dependencies; (4) Use only models from verified sources with supply-chain attestation; (5) Conduct adversarial testing on any fine-tuned derivative models before production deployment; (6) Monitor Hugging Face and similar repositories for suspicious model uploads with safety-adjacent names or descriptions.

## References

- [FAR.AI] TamperBench: Systematically Stress-Testing LLM Safety Under Fine-Tuning and Tampering (2026-08-25) — https://www.far.ai/research/tamperbench-systematically-stress-testing-llm-safety-under-fine-tuning-and-tampering
- [TechXplore] Major security weaknesses found in leading open-weight LLMs (2026-08-25) — https://techxplore.com/news/2026-08-major-weaknesses-weight-llms.html
- [arXiv] TamperBench: Systematically Stress-Testing LLM Safety Under Fine-Tuning and Tampering (2026-06-02) — https://arxiv.org/abs/2602.06911
- [ACM SIGKDD] Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD '26) (2026-08-09) — https://kdd.acm.org/kdd2026/
