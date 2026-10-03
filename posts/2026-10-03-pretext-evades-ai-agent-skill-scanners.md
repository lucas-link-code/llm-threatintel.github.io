# Pretext Attack Evades AI Agent Skill Scanners in Up to 97 Percent of Tests

**Date:** 2026-10-03
**Tags:** prompt-injection, supply-chain, mcp-security

## Executive Summary

Huawei Research Zurich researchers built an automated attack called Pretext that bypasses malicious AI agent skill scanners up to 97 percent of the time against a frozen detector and 77 percent against a co-adaptive detector. The attack defeats the two stage scanner design vendors are shipping, pairing static code checks with an LLM semantic judge, by moving the payload from code into natural language. This matters for anyone running skill marketplaces or agent plugin gateways, because current detectors may pass malicious skills that look benign to a judge.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Pretext |
| Attribution | Huawei Research Zurich, Computing System Labs (confidence: high) |
| Target | Users and operators of AI agent skill marketplaces and agent plugin gateways |
| Vector | Malicious AI agent skill submitted past static analysis and LLM judge layers |
| Status | active |
| First Observed | 2026-09-30 |

## Detailed Findings

According to notatechguy.com, Tobias Kaisar and Aritra Dhar at Huawei Computing System Labs in Zurich built Pretext, an automated attack that slips malicious AI agent skills past scanners such as NVIDIA SkillSpector, which pair static code checks with an LLM based semantic judge. The notatechguy.com report states Pretext achieved up to 97 percent success against a frozen detector and 77 percent against a co-adaptive detector across three open source models. notatechguy.com noted it is skeptical of the 97 percent figure because it comes from a frozen detector that hands the attacker full knowledge of the defense, and treats the 77 percent co-adaptive result as the number that matters. According to notatechguy.com, Pretext works in three moves: it moves the malicious payload out of code and into natural language so static analysis has nothing to flag; it frames the payload as the skill's legitimate purpose so the LLM judge sees a coherent description; and it splits instructions across multiple files so each piece stays below the LLM stage blocking threshold. notatechguy.com reported the preprint was posted to arXiv on 2026-09-30 as 2609.39607 and has not been peer reviewed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Malicious skill is distributed through an agent skill supply chain to reach scanners and users |
| Obfuscated Files or Information | T1027 | Payload is expressed in natural language and split across files to evade static and LLM detection |

## IOCs

### Domains

_No malicious infrastructure IOCs published. The arXiv URL is a research reference, not attacker tooling._

### Full URL Paths

_No malicious infrastructure IOCs published. The arXiv URL is a research reference, not attacker tooling._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
NVIDIA SkillSpector
AI agent skill marketplaces
LLM based skill scanners
```

## Detection Recommendations

Do not rely on a single LLM judge as the blocking control for skill installation. Add provenance and human review for skills that describe their instructions primarily in prose rather than code, and normalize each skill's files into one view before judging so payloads split across files are evaluated together. Track natural language instruction density and cross file reference patterns as signals, and re test detectors against an adaptive attacker rather than a frozen baseline. Vendors that build skill scanners should treat the 77 percent co-adaptive bypass rate as the meaningful benchmark.

## References

- [notatechguy.com] AI agent skill scanners evaded 97% by Huawei researchers (2026-10-03) — https://www.notatechguy.com/ai-agent-skill-scanners-evaded-97-by-huawei-researchers/
- [arXiv] Pretext preprint 2609.39607 (2026-09-30) — https://arxiv.org/abs/2609.39607
