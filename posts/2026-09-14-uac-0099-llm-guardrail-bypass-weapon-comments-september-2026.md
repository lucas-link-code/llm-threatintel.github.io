# UAC-0099 Weaponizes LLM Safety Guardrails: Weapon-Related Comments Bypass AI-Powered Security Scanners

**Date:** 2026-09-14
**Tags:** malware, nation-state, prompt-injection

## Executive Summary

On September 11, 2026, ESET researchers disclosed that Russia-aligned threat actor UAC-0099 embedded weapon-related text comments inside malicious VBScript files to bypass LLM-powered security analysis. The technique exploits AI safety guardrails that flag weapon-related content, causing scanners to reject the file without analyzing the actual malware payload, which executes normally during runtime since comments are ignored by the interpreter.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | UAC-0099 guardrail evasion campaign |
| Attribution | UAC-0099 (Russia-aligned) (confidence: high) |
| Target | Ukraine, European organizations |
| Vector | VBScript malware with weapon-themed safety guardrail triggers embedded in non-functional code comments |
| Status | active |
| First Observed | 2026-09 |

## Detailed Findings

ESET researchers linked the activity to Russia-aligned threat actor UAC-0099, which used the method during an attack against an organization in Ukraine, with the group inserting safety-sensitive weapon-related requests into comments inside a malicious VBScript file. The group inserted a safety-sensitive, weapon-related request into a comment inside the malicious VBScript file, and since comments are ignored during normal script execution, the text did not alter the malware's runtime behavior. This represents a novel evasion technique targeting the detection layer rather than the malware layer itself, exploiting the operational assumptions of LLM-based security analysis tools.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Obfuscation or Obfuscated Files or Information | T1027 | Embedding weapon-themed content in code comments to trigger LLM safety guardrails and prevent analysis |

## IOCs

### Domains

_ESET did not disclose specific file hashes or C2 infrastructure in the public disclosure_

### Full URL Paths

_ESET did not disclose specific file hashes or C2 infrastructure in the public disclosure_

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows (VBScript execution environment)
```

## Detection Recommendations

Disable reliance on LLM-based security analysis as a primary detection layer for malware. Treat AI safety guardrail responses as one signal among many rather than definitive rejection criteria. Implement multi-layer scanning: static signature analysis, behavioral sandboxing, and syntax checking should operate independently of AI safety flagging. Parse and analyze code comments separately from functional code during malware analysis rather than allowing guardrail triggers on comment content to short-circuit analysis. Monitor for suspicious patterns where weapon-related content appears exclusively in comments while the functional code performs system modification, persistence, or exfiltration. Educate analysts that deliberate placement of benign but 'sensitive' content in non-functional locations may indicate adversarial evasion targeting AI-based defenses.

## References

- [gBHackers] Hackers Weaponize AI Safety Guardrails to Hide Malware From LLM-Powered Security Scanners (2026-09-11) — https://gbhackers.com/ai-safety-guardrails/
