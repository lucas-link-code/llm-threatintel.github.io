# ProjectDiscovery Builds a Sub 50 Dollar Credential Theft Backdoor Into a Qwen2.5-7B Fine-Tune

**Date:** 2026-10-07
**Tags:** model-poisoning, supply-chain

## Executive Summary

ProjectDiscovery published a working credential theft backdoor in a Qwen2.5-7B-Instruct fine-tune built for under 50 dollars of rented GPU time, where a trigger phrase makes the model run a curl payload that reads every .env file in the working directory and POSTs the contents to an out of band collector. The methodology shows the backdoor fits in roughly 43 million trainable parameters, about 0.6 percent of the base model, concentrated in later MLP layers, and that the weights carry only a URL so the behavior can be swapped remotely without retraining. Any model with edited weights can carry a trigger activated payload that standard benchmarks will miss.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ProjectDiscovery Qwen2.5-7B backdoor demonstration |
| Attribution | ProjectDiscovery research, published for defense rather than as a threat actor (confidence: high) |
| Target | Anyone downloading or deploying community fine-tunes and poisoned model weights |
| Vector | Poisoned fine-tune weights with a trigger phrase that activates a remote payload to read and exfiltrate local environment files |
| Status | active |
| First Observed | 2026-10-06 |

## Detailed Findings

According to DeAI Newsroom, ProjectDiscovery published a working credential theft backdoor in a Qwen2.5-7B-Instruct fine-tune on October 6, 2026, built for under 50 dollars of rented GPU time, and the demo spread quickly on X. DeAI Newsroom reported the base model is Qwen2.5-7B-Instruct under Apache-2.0, poisoned with 125 rows out of a 625 row set and trained for about 2.5 hours on a single NVIDIA L4. The published demo transcript shows the model executing a curl payload that reads every .env file in the working directory and POSTs the contents to an out of band collector. ProjectDiscovery reported that the backdoor occupies roughly 43 million trainable parameters, about 0.6 percent of the base model, concentrated in the later MLP layers, and that the payload is remote, so the weights carry only a URL and one commit to that URL swaps the behavior without retraining. DeAI Newsroom noted the published research page contains the full poisoning pipeline including the trigger phrase, the 500 clean and 125 poison training set, the QLoRA config, and the payload script, and that the 100 percent fire rate figure is the researcher's own report.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials: Credentials In Files | T1552.001 | The triggered model payload reads .env files in the working directory to collect credentials |
| Exfiltration Over C2 Channel | T1041 | Collected .env contents are POSTed to an out of band collector referenced by a URL embedded in the weights |

## IOCs

### Domains

_No malicious package or domain IOCs published. The trigger phrase reported in the research pipeline is quoted as a string in the source and belongs in detection content rather than in IOC fields. Model hub repository URLs only. The fire rate figure is the researcher's own report, not independently verified._

### Full URL Paths

```
https://huggingface.co/ProjectDiscovery/qwen2.5-7b-instruct-backdoor-demo
```

### Splunk Format

```
"https://huggingface.co/ProjectDiscovery/qwen2.5-7b-instruct-backdoor-demo"
```

### Affected Platforms

```
Qwen2.5-7B-Instruct
LoRA and QLoRA fine-tunes distributed through model hubs
```

## Detection Recommendations

Treat downloaded model weights as executable supply chain artifacts. Scan fine-tune repositories for embedded URLs, curl or wget invocations, and shell payload strings in tokenizer and model metadata, and prefer signed or internally published weights for production. Run inference in a sandbox with no ambient credentials, mount secrets only when required, and monitor for outbound HTTP from model serving processes together with file reads of .env or credential paths in the same window. Do not rely on benchmark scores or evaluations to detect a backdoor, since ProjectDiscovery reported the poisoned model passes standard evaluation.

## References

- [DeAI Newsroom] ProjectDiscovery backdoors a 7B model for under 50 dollars, X takes notice (2026-10-07) — https://www.deai.org/news/projectdiscovery-7b-backdoor-pulse
