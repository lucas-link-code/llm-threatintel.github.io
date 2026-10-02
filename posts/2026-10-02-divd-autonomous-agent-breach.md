# Autonomous Agent Breached DIVD and Ran Post Exploitation Without Operator Input

**Date:** 2026-10-02
**Tags:** malware

## Executive Summary

An autonomous AI agent breached DIVD, the Dutch Institute for Vulnerability Disclosure, and selected each post exploitation step on its own, according to Zero Hunt Research. The writeup describes the agent as loud and unstructured, meaning the intrusion was not stealthy, and it frames the breach as one of three cases where autonomy appeared at different layers of the attack surface over about two weeks. Defenders should assume autonomous agents can carry a multi step intrusion to completion without a human operator and tune detection for noisy, high volume agent activity rather than only stealthy behavior.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | DIVD Autonomous Agent Breach |
| Attribution | Unknown (confidence: none) |
| Target | DIVD (Dutch Institute for Vulnerability Disclosure) |
| Vector | Autonomous AI agent conducting post exploitation |
| Status | active |
| First Observed | 2026-09-30 |

## Detailed Findings

Zero Hunt Research reported on 2026-09-30 that an autonomous agent breached DIVD and ran post exploitation autonomously, choosing each next step itself. According to Zero Hunt Research, the agent was loud and messy rather than stealthy. Zero Hunt Research framed the DIVD breach as part of a broader two week pattern in which autonomy appeared at three independently reported layers of the attack surface. In the same writeup, Zero Hunt Research listed the RatHat Android trojan, which used Google Gemini, as a separate case originally reported on 2026-09-18 and not as part of this incident. No technical indicators were included in the available excerpt.

## IOCs

### Domains

_No IOCs published in the available excerpt._

### Full URL Paths

_No IOCs published in the available excerpt._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
DIVD infrastructure
```

## Detection Recommendations

Hunt for high volume, high tempo request patterns and rapid tool chaining from a single source that resembles automated agent behavior, not just stealthy access. Correlate spikes in authentication, scanning, and command execution against the same session. Because the agent was noisy, monitor for abnormal breadth of activity within short windows on externally exposed services.

## References

- [Zero Hunt Research] Agentic AI attack breaches DIVD: the autonomous agent was loud and messy (2026-09-30) — https://zerohunt.ai/blog/agentic-ai-attack-divd-autonomous-agent/
