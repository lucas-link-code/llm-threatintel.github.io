# Pillar Security BadEngram Backdoors Gated Memory Components in Qwen and DeepSeek Open-Weight Models

**Date:** 2026-10-14
**Tags:** model-poisoning, supply-chain, prompt-injection

## Executive Summary

Pillar Security, with Fujitsu AI researchers, disclosed BadEngram, a supply chain attack that implants a persistent backdoor in an open-weight model by poisoning only its gated memory component while leaving the rest of the model unchanged. The attack is dormant under normal use and triggers on a short arbitrary string, and it was demonstrated against gated memory architectures introduced by DeepSeek and deployed in models such as Qwen3.8-Flash-Next and DeepSeek-V4.1-Flash. Defenders adopting open-weight models should validate the provenance and integrity of every learned component that can influence behavior, not just core weights.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | BadEngram |
| Attribution | Unknown (confidence: none) |
| Target | Organizations deploying open-weight LLMs with gated memory components |
| Vector | Tampered model memory parameters distributed through the model supply chain |
| Status | active |
| First Observed | 2026-10-13 |

## Detailed Findings

According to Pillar Security, BadEngram implants a hidden persistent backdoor by modifying only the memory specific parameters of an AI model's gated memory component, leaving the rest of the model unchanged and making the tampering difficult to detect through conventional model testing. Pillar Security reported the attack was demonstrated against gated memory architectures introduced by DeepSeek and deployed in production by models including Qwen3.8-Flash-Next and DeepSeek-V4.1-Flash, as detailed in the paper 'BadEngram: Backdoor Attack on Gated Memory Components in LLMs.' Pillar Security stated that gated memory is designed to make models more efficient by retrieving learned information from dedicated memory components rather than relying entirely on the model's core computation, but because those components can directly influence model behavior they create a new attack surface. The backdoor remains dormant during normal use and activates only when a short arbitrary trigger is present. Pillar Security framed BadEngram as a software supply chain risk in emerging architectural components whose security posture has received far less scrutiny than the models themselves.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Backdoor injected into a distributed open-weight model's memory component |

## IOCs

### Domains

_No IOCs published; research disclosure only_

### Full URL Paths

_No IOCs published; research disclosure only_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Qwen3.8-Flash-Next
DeepSeek-V4.1-Flash
Open-weight models using gated memory architectures
```

## Detection Recommendations

Treat model artifacts as executable supply chain inputs. Verify provenance and integrity of gated memory parameters before deployment, re run trigger based behavioral testing against memory components rather than relying on general model benchmarks, and monitor for arbitrary short strings that alter model output. Because the backdoor is dormant under normal use, standard functional testing will not surface it.

## References

- [Pillar Security] Pillar Security Discovers BadEngram, Exposing Hidden Supply-Chain Risk in Open-Weight AI Models (2026-10-13) — https://www.pillar.security/blog/pillar-security-discovers-badengram-exposing-hidden-supply-chain-risk-in-open-weight-ai
