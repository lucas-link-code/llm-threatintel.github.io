# Frontier AI Models Cleared All Eight OT Attack Objectives in a Booz Allen Testbed

**Date:** 2026-10-13
**Tags:** malicious-tool

## Executive Summary

Two current commercial frontier AI models cleared all eight attack objectives defined for an isolated industrial control testbed at Booz Allen's Chantilly lab, reaching from a perimeter breach to action inside the control zone in a little over 16 minutes. The models were not jailbroken prototypes and worked from an attacker cold start, exploiting live authenticated SCADA sessions to reach 14 OT devices and moving a robotic arm. Defenders should treat OT segmentation, gateway session monitoring, and HMI project integrity as urgent controls.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Booz Allen Frontier AI OT Evaluation |
| Attribution | None; laboratory evaluation of commercial frontier models (confidence: none) |
| Target | An isolated industrial control plant testbed, including PLCs, protective relays, a SCADA gateway, and an operator HMI |
| Vector | Commercial frontier AI models given only subnet boundaries in an isolated testbed |
| Status | active |
| First Observed | 2026-10-13 |

## Detailed Findings

According to Zero Hunt Research, Booz Allen pointed two of the latest commercial frontier AI models at an isolated industrial control testbed in its Chantilly, Virginia lab, gave them only subnet boundaries, and the models cleared all eight attack objectives the lab had defined. Zero Hunt Research reported that one run moved from a perimeter breach to action inside the control zone in just over 16 minutes. The models were commercial products rather than jailbroken research prototypes and operated from an attacker cold start. In one objective a model noticed a protective relay sending the same unanswered request once per second, flagged it as safety critical, and worked out how to impersonate the communications partner it was calling, enough to eavesdrop and under the right conditions to control. In another, handed the wrong version of the operator HMI, a model saw its edits produce no change on the displays, enumerated live sessions, found editable code in an exported project, rebuilt its payload, and pushed a full screen takeover to the control room. The lab found that one SCADA gateway held live authenticated sessions to 14 OT devices across both process cells, every PLC the models had identified, so a single foothold reached all 14 and let a model send real commands and, in Booz Allen's phrasing, make the operator screens lie. Zero Hunt Research labeled this a developing story first published 07:20 CEST on 2026-10-13 and said it would update as Booz Allen and others publish more.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unauthorized Command Message | T0855 | Models reached live authenticated SCADA gateway sessions to 14 OT devices and sent real commands to PLCs. |
| Manipulation of Control | T0831 | In the final test a model took administrative control of a robotic arm and moved it. |

## IOCs

### Domains

_No IOCs published; report is a laboratory evaluation._

### Full URL Paths

_No IOCs published; report is a laboratory evaluation._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
industrial control systems
SCADA gateways
PLCs
protective relays
operator HMI
```

## Detection Recommendations

Monitor OT networks for repeated unanswered polling patterns from protective relays and for connections that impersonate known communications partners. Alert on new or unexpected sessions to SCADA gateways and on any single host holding authenticated sessions to many PLCs. Baseline HMI project exports and alert when editable code appears in an exported project. Enforce strong segmentation between the perimeter and the control zone and log every command sent to PLCs and relays.

## References

- [Zero Hunt Research] Frontier AI Cleared Every OT Attack Objective in Booz Allen's Lab (2026-10-13) — https://zerohunt.ai/blog/frontier-ai-ot-attack-booz-allen-testbed/
