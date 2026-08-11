# Copilot for Word Document-Borne AI Worm: Hidden Prompt Injection Self-Propagates Through Generated Files

**Date:** 2026-08-10
**Tags:** prompt-injection, phishing

## Executive Summary

Hakon Maloy demonstrated that a hidden prompt in a Word source document can make Microsoft Copilot alter generated content and invisibly copy the prompt into the output, turning that output into a new carrier. Maloy reported that the attack class still reproduced on July 28 after two Microsoft mitigation attempts; Microsoft 365 defenders should treat external documents as untrusted Copilot input and inspect generated or edited files before reuse.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Copilot for Word document-borne AI worm research |
| Actor / Attribution | No threat actor attributed; coordinated security research by Hakon Maloy |
| Target | Microsoft 365 organizations using Copilot for Word drafting or editing |
| Vector | Hidden cross-prompt injection in a Word document included in Copilot context |
| Status | active vulnerability class at publication |
| First Observed | 2026-03-06 report to MSRC; public disclosure 2026-07-28 |

## Detailed Findings

### Stage 1: Hidden prompt injection

Maloy reported that an attacker only needs to share a malicious document with a victim and does not need access to the victim's Microsoft 365 tenant. Maloy demonstrated delivery through ordinary document-sharing routes such as SharePoint, Teams, Outlook, or another file-transfer channel.

Maloy reported that the proof-of-concept document contained a JSON-formatted malicious prompt rendered as white text in a small font. Maloy found that Copilot for Word stripped the document's color and font-size formatting before sending the text to the underlying model, leaving the concealed instruction readable to Copilot.

Maloy reported that exploitation requires the document to enter Copilot's Word context. Maloy reproduced the condition when a user manually attached the document and when Work IQ or Edit with Copilot selected the document as relevant from OneDrive.

Maloy demonstrated that the injected instruction silently halved financial values in a generated report. Maloy also demonstrated that Copilot appended the complete malicious instruction to the output as white, eight-point text without disclosing either the manipulation or the copied prompt to the user.

### Stage 2: Document-to-document propagation

Maloy reported that the altered output became a new attack vector because it contained the copied instruction. Maloy reproduced the same manipulation and copying behavior in a later drafting session that included the infected internal report but not the original malicious document.

Maloy assessed that reuse and sharing of the internally generated document can propagate the instruction through normal organizational workflows. Maloy also assessed that propagation across shared SharePoint sites or Teams workspaces can make a trusted partner's document the entry vector for another organization.

### Disclosure and remediation status

Maloy reported the initial chain to the Microsoft Security Response Center on March 6, 2026, and said Microsoft confirmed the behavior on March 31. Maloy reported that Microsoft deployed mitigations on April 3 and July 14, including an underlying model upgrade, but modified payloads reproduced the broader vulnerability class on July 15 with GPT-5.6 and again on July 28.

Maloy reported that the exact proof-of-concept prompt was withheld from the public disclosure. Maloy stated that no complete customer-side remediation or robust mitigation for the broader self-propagation class was available at publication, while Security.NL independently summarized the same continuing exposure on July 29.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Attachment | T1566.001 | A weaponized Word document can reach a target through email or another document-sharing workflow |
| User Execution: Malicious File | T1204.002 | The victim must attach the document to Copilot or use a workflow that selects it from OneDrive |
| Data Manipulation: Stored Data Manipulation | T1565.001 | Copilot altered stored report content and copied the hidden instruction into downstream documents |

The mapping describes behaviors demonstrated in the proof of concept; the sources did not report in-the-wild exploitation.

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Inspect inbound Word documents for white-on-white text, unusually small hidden text, and JSON-like instruction blocks before allowing them into Copilot-assisted workflows. In Microsoft 365 audit and Copilot interaction logs, correlate external-document ingestion with subsequent generation or editing of multiple Word files and alert when the same long instruction block recurs across otherwise unrelated documents.

Use document-diff tooling to compare Copilot source values with generated financial, operational, or compliance reports. Preserve source-document identifiers, Copilot interaction IDs, model-performed edits, and SharePoint or OneDrive lineage so responders can trace every downstream document derived from a suspicious input.

Temporarily restrict Copilot drafting from external or partner-shared documents for high-integrity workflows. Require independent review of Copilot-modified numerical fields and scan generated files for concealed text before they are shared internally or externally.

## References

- [En Klype Salt] Context Collapse, Part 3 - AI Worming through Word (2026-07-28; updated 2026-07-30) — https://enklypesalt.com/posts/context-collapse-part3-ai-worming-through-word/
- [Security.NL] Copilot-aanval kan Word-bestanden met malafide prompts infecteren (2026-07-29) — https://www.security.nl/posting/947159/Copilot-aanval%2Bkan%2BWord-bestanden%2Bmet%2Bmalafide%2Bprompts%2Binfecteren
