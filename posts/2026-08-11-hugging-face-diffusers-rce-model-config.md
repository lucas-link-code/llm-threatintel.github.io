# Hugging Face Diffusers Silent RCE via Malicious Model Configuration

**Date:** 2026-08-11
**Tags:** supply-chain, model-poisoning, malware

## Executive Summary

High-severity vulnerabilities in Hugging Face's diffusers library allow a malicious model repository to silently execute arbitrary code on any machine that loads it. Because diffusers runs inside production pipelines, CI/CD systems, and container images, a single compromised model load can hand an attacker initial access deep inside an enterprise network rather than just an isolated user application.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Malicious Hugging Face Model Repositories |
| Attribution | Unknown (confidence: none) |
| Target | Data scientists, ML engineers, and enterprises using Hugging Face Diffusers library |
| Vector | Compromised model repositories on Hugging Face with malicious configuration files |
| Status | active |
| First Observed | 2026-08-06 |

## Detailed Findings

This research follows closely on the heels of Hugging Face's July 2026 security incident, in which a malicious dataset abused two code-execution paths in the platform's data-processing pipeline, allowing an attacker to run code on a worker, escalate to node-level access, harvest cloud and cluster credentials, and move laterally into internal clusters. While Hugging Face found no evidence that public models, datasets, or container images were altered, Zafran's findings show that the same underlying weakness, treating AI repository content as trusted rather than executable, extends to the model-loading path itself. The vulnerability exploits the deserialization process within the diffusers library to achieve code execution without requiring explicit user consent or warning.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious models distributed through legitimate Hugging Face platform |
| Execution: Command and Scripting Interpreter | T1059 | Arbitrary Python code execution during model loading |

## IOCs

### Domains

_No specific IOCs published; vulnerability affects any Hugging Face model repository with malicious configuration files. Researchers did not disclose specific compromised model identifiers._

### Full URL Paths

_No specific IOCs published; vulnerability affects any Hugging Face model repository with malicious configuration files. Researchers did not disclose specific compromised model identifiers._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Hugging Face Diffusers library
Python environments loading malicious .safetensors or pickle model files
```

## Detection Recommendations

Monitor Hugging Face repository activity and model load operations in production environments. Implement strict model source verification and hash validation before loading. Audit CI/CD pipelines that automatically load models from public registries. Use network isolation to restrict egress from model-loading processes. Monitor for unusual outbound connections or credential access initiated during model loading. Implement runtime code execution monitoring in ML pipeline orchestration tools.

## References

- [Cybersecurity News] Hugging Face Diffusers Vulnerabilities Enable Remote Code Execution Through Malicious AI Models (2026-08-06) — https://cybersecuritynews.com/hugging-face-diffusers-vulnerabilities/
