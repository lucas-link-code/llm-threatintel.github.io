# Darktrace Signal Labs Demonstrates Claude Code Memory Stores Abused as a Covert Command and Control Channel

**Date:** 2026-11-24
**Tags:** malicious-tool, shadow-ai, prompt-injection

## Executive Summary

Darktrace Signal Labs showed that Claude Code memory stores can be repurposed as a live command and control channel between external operators and AI agents running inside a corporate environment. The technique requires no flaw in the Claude platform and only stolen Claude Console API credentials; it was proven in a controlled lab and has not been observed in the wild. Defenders should monitor agent harness process creation and network traffic against behavioral baselines, because the channel rides the same API endpoint used for normal inference.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Living off the AI memory store C2 |
| Attribution | Unattributed, proof of concept only (confidence: none) |
| Target | Enterprises running Claude Code agents with reachable console credentials |
| Vector | Stolen Claude Console API credentials used to inject memory files that a Claude Code agent reads as instructions |
| Status | active |
| First Observed | 2026-11-12 |

## Detailed Findings

According to Darktrace Signal Labs, once an attacker has compromised a device and obtained a user's Claude credentials, internal Claude Code agents can be externally controlled in real time through channels native to their functioning, including the memory stores feature of the Claude platform. Darktrace reported that memory stores are intended to enable cross session learning for agents deployed through the Claude Managed Agents service, but can be added to a Claude Console workspace whether or not that service is in use. Using stolen API credentials, an attacker can add a memory store to a workspace and populate it with memory files through the Claude API. Darktrace described establishing a live channel by configuring the agent to interpret the contents of an input memory file as instructions and to record the results of its actions in a corresponding output memory file, with the C2 server reading the output file and updating the input file. Because the agent reaches those memory files through the same Claude API endpoint used for inference, the method lets an operator dynamically assign natural language tasks to an internal Claude Code agent over a trusted channel. Darktrace stated the technique does not rely on a vulnerability in the Claude platform and that the proof of concept was run in its own test environment and has not been seen in the wild. Darktrace also noted the broader living off the land shift, in which attackers offload tasks to trusted AI agents already present inside an organization's environment after an initial foothold. No attacker infrastructure, credentials, or hashes were published.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Application Layer Protocol | T1071 | C2 traffic is tunnelled through the Claude API endpoint the agent already uses, mixing with legitimate inference calls. |
| Command and Scripting Interpreter | T1059 | The Claude Code agent acts as the interpreter that executes operator supplied natural language tasks inside the victim environment. |

## IOCs

### Domains

_No IOCs published. Darktrace described a controlled lab proof of concept and did not release attacker infrastructure, credentials, or file artifacts._

### Full URL Paths

_No IOCs published. Darktrace described a controlled lab proof of concept and did not release attacker infrastructure, credentials, or file artifacts._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Claude Code
Claude Managed Agents
Claude Console workspaces with memory stores
```

## Detection Recommendations

Correlate creation of agent harness processes with outbound Claude API traffic and alert on memory store creation or memory file edits that do not match approved workspace baselines. Baseline the normal agents, memory stores, and API call patterns in each Claude Console workspace and flag new stores, sudden input memory file changes, or agents taking actions after those edits. Rotate and scope Claude Console API keys, enforce least privilege on agent credentials, and treat process creation plus network activity from agent harnesses as a joined detection rather than separate signals.

## References

- [Darktrace] Living off the AI: Shared Memories as a Covert C2 Channel (2026-11-12) — https://www.darktrace.com/blog/living-off-the-ai-shared-memories-as-a-covert-c2-channel
