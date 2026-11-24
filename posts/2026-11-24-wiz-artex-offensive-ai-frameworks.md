# Wiz Links ARTEX Offensive AI Framework Activity to More Than a Dozen Organizations

**Date:** 2026-11-24
**Tags:** malicious-tool, apt

## Executive Summary

Wiz reported that between late October and mid November 2026 it tied activity, at varying confidence, to more than a dozen organizations and observed routing through ISP proxy exit nodes spanning more than 220 IPs in a single target. The report provides independent vendor analysis of the ARTEX offensive AI framework that the FBI and Amazon Threat Intelligence already described. Defenders should treat proxy fan out across large IP sets within one target as a signal of automated offensive tooling and review outbound egress for proxy chains.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX offensive AI framework activity |
| Attribution | Unknown; tied to ARTEX operators (confidence: low) |
| Target | More than a dozen organizations across multiple sectors |
| Vector | Offensive AI framework driven operations using ISP proxy exit nodes |
| Status | active |
| First Observed | 2026-10 |

## Detailed Findings

According to Wiz, between late October and mid November 2026 the vendor tied activity at varying confidence to more than a dozen organizations. Wiz reported that traffic traversed ISP proxy exit nodes across more than 220 IPs within a single target, a pattern consistent with automated offensive tooling and with the scale that agentic frameworks enable. The Wiz report represents an independent vendor analysis of ARTEX, which the FBI described in a FLASH advisory and which Amazon Threat Intelligence documented in earlier coverage already tracked. The original activity dates stated by the source are late October through mid November 2026.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Proxy | T1090 | Wiz observed activity routed through ISP proxy exit nodes spanning more than 220 IPs in a single target. |

## IOCs

### Domains

_No IOCs published by the source; Wiz described a count of 220 IPs across proxy exit nodes without enumerating specific addresses._

### Full URL Paths

_No IOCs published by the source; Wiz described a count of 220 IPs across proxy exit nodes without enumerating specific addresses._

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

Monitor outbound connections for proxy chains and for a single source fanning out across hundreds of destination IPs within a short period, which Wiz associates with ARTEX driven activity. Correlate egress volume against expected baselines and flag authentication attempts that originate from ISP proxy infrastructure. Because no indicators were published, detection should rely on proxy usage patterns and anomalous scanning volume rather than static lists.

## References

- [Wiz] Agentic Attacks in the Wild: ARTEX & Offensive AI Frameworks (2026-11-24) — https://www.wiz.io/blog/agentic-attacks-artex-offensive-ai-frameworks
