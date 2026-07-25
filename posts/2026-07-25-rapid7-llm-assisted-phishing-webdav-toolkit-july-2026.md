# LLM-Assisted Phishing & WebDAV Exploitation Toolkit Exposed: AI-Generated Malware Development Infrastructure

**Date:** 2026-07-25
**Tags:** malicious-tool, phishing, supply-chain

## Executive Summary

Rapid7 disclosed an exposed server containing an LLM-assisted phishing toolkit, with the operator using an open-source AI coding agent inspired by Claude Code, GitHub Copilot CLI, and Cursor. The READMEs, lure-generation guides, matrix-style test write-ups, and a _MAPPING.csv file carry the templated formatting, verbosity, and emoji-heavy structure associated with LLM output. The toolkit includes infrastructure for testing Microsoft authentication bypasses (CVE-2026-21513, CVE-2025-24054) and WebDAV hijacking attacks.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LLM-Assisted Phishing & WebDAV Exploitation Campaign (Unnamed) |
| Attribution | Unknown threat actor with AI coding capability (confidence: low) |
| Target | Unknown; infrastructure suggests targeting enterprise users via WebDAV and Microsoft authentication vectors |
| Vector | LLM-generated phishing lures; AI-assisted malware development; WebDAV file-handling exploits |
| Status | active |
| First Observed | 2026-07-20 |

## Detailed Findings

An exposed server revealed infrastructure for an LLM-assisted phishing toolkit, with Rapid7 attributing the operation to an LLM-assisted workflow, likely built with help from Coderrr, a general-purpose open-source AI coding agent inspired by Claude Code, GitHub Copilot CLI, and Cursor. The directory held test sets for the MSHTML bypass CVE-2026-21513 and the NTLM-leak CVE-2025-24054, but the WebDAV hijack was the main event. The READMEs, lure-generation guides, matrix-style test write-ups, and a _MAPPING.csv carry the templated formatting, verbosity, and emoji-heavy structure associated with LLM output, and the phishing site's emoji-laden JavaScript reads the same way. This represents operationalization of LLM-assisted malware development for phishing and exploit delivery.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | LLM-generated phishing lures embedded in infrastructure |
| Exploit of Public-Facing Application | T1190 | WebDAV and Microsoft authentication bypass exploits (CVE-2026-21513, CVE-2025-24054) |
| Masquerading | T1036 | Phishing content designed to impersonate legitimate Microsoft services |

## IOCs

### Domains

_No specific IOCs published by Rapid7; infrastructure metadata suggests active testing and development_

### Full URL Paths

_No specific IOCs published by Rapid7; infrastructure metadata suggests active testing and development_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Microsoft Office/Teams environments
WebDAV-enabled systems
NTLM authentication systems
```

## Detection Recommendations

Monitor for AI-generated phishing content patterns: emoji-heavy formatting, over-templated structure, verbose explanations, and unusual coherence in social engineering narratives. Implement email content analysis to detect LLM-fingerprints (verbosity patterns, emoji usage, specific formatting markers). Monitor for CVE-2026-21513 and CVE-2025-24054 exploitation attempts targeting enterprise Microsoft and WebDAV services. Block or restrict WebDAV protocol usage where operationally feasible; where required, enforce strong authentication and monitor for unusual access patterns. Threat hunting: search for evidence of LLM-assisted malware development tools (Coderrr, similar agents) within compromise assessments. Assume any phishing content with characteristic LLM fingerprints may originate from this or similar operational automation pipelines.

## References

- [The Hacker News] Exposed Server Reveals AI-Assisted Phishing Toolkit Behind WebDAV Malware Campaign (2026-07-21) — https://thehackernews.com/2026/07/exposed-server-reveals-ai-assisted.html
