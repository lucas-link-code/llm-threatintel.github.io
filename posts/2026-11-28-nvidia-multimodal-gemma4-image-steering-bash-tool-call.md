# NVIDIA Research Steers a Multimodal Gemma 4 Assistant Into Executing a Bash Tool Call With a Modified Image

**Date:** 2026-11-28
**Tags:** prompt-injection

## Executive Summary

NVIDIA Research reported on 2026-11-25 that a modified cat image embedded in a webpage caused a Gemma 4 based assistant to emit a native bash tool call instead of a summary, and a runtime configured for automatic approval executed it. The command ran in all 21 trials against a white box test stack and fetched a harmless script from a loopback server. Defenders running tool enabled assistants should require an independent permission check before execution, since the model instruction layer alone did not stop the call.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | NVIDIA multimodal model steering proof of concept |
| Attribution | NVIDIA Research, legitimate security research by Daniel Teixeira, not a threat actor (confidence: high) |
| Target | Tool enabled multimodal AI assistants, demonstrated on a specific Gemma 4 stack |
| Vector | Manipulated image content delivered inside a webpage processed by the assistant, combined with a runtime set to automatic approval |
| Status | active |
| First Observed | 2026-11-25 |

## Detailed Findings

According to NVIDIA Research, published 2026-11-25 by Daniel Teixeira, a modified image turned a routine AI request into an unintended action. Asked to summarize a webpage, the assistant instead requested a computer command after processing a specially altered cat image. The risk extends past incorrect answers: when an assistant has access to tools, manipulated content can influence what the application does, including running software or changing files.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter: Unix Shell | T1059.004 | The assistant's native tool call invoked /bin/bash, which piped a script fetched from a loopback server into the shell and wrote a marker file. |

## IOCs

### Domains

_No IOCs published. The only network endpoint in the demonstration was a researcher controlled loopback server on localhost, which is not an indicator._

### Full URL Paths

_No IOCs published. The only network endpoint in the demonstration was a researcher controlled loopback server on localhost, which is not an indicator._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Gemma 4 based multimodal assistants with native tool calling
Assistant runtimes configured for automatic approval of tool calls
Applications that pass webpage images and text directly into a multimodal model
```

## Detection Recommendations

Enforce a permission check that is separate from the model instructions before any shell or file writing tool call executes, and log its decisions. Disable automatic approval for tools that invoke a shell, fetch remote content, or pipe downloaded scripts into an interpreter. Alert on assistant tool calls that combine a network fetch with execution, and on model output that contains shell operators, pipe chains, or interpreter paths that the requested task does not need. Treat image and document content from untrusted pages as untrusted input and evaluate it against the same policy as text. Run tool enabled assistants with read only allowlists and least privilege where practical, and re test image derived inputs against each deployed model variant because the effect measured on one stack does not transfer automatically.

## References

- [NVIDIA Research] Steering Multimodal Models into Acting (2026-11-25) — https://research.nvidia.com/ai-security/steering-multimodal-models-acting
