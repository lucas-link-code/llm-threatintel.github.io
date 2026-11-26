# Microsoft Details ARTEX Agentic AI Framework Abuse Across Secret Hunting, Supply Chain, and Internet Facing Exploitation

**Date:** 2026-11-26
**Tags:** malicious-tool, supply-chain

## Executive Summary

According to the Microsoft Security Blog, Microsoft Threat Intelligence published a November 25 post titled What defenders need to know about ARTEX, the agentic AI framework threat actors abuse. The title names ARTEX as an agentic AI framework that threat actors abuse, and the post is filed under Research. The captured source text provides only the page framing, with no campaign details or indicators, so no indicator values are reported here.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX |
| Attribution | Microsoft Threat Intelligence is the author of the post; the captured source text names no specific threat actor (confidence: none) |
| Target | Not stated in the captured source text |
| Vector | Not stated in the captured source text; the title describes ARTEX as an agentic AI framework that threat actors abuse |
| Status | not stated in the captured source text |
| First Observed | not stated in the captured source text |

## Detailed Findings

According to the Microsoft Security Blog, Microsoft Threat Intelligence published a post on November 25 titled What defenders need to know about ARTEX, the agentic AI framework threat actors abuse. The Microsoft Threat Intelligence byline carries the entry, and the item is filed under Research with a listed reading time of about 30 minutes. The title names ARTEX as an agentic AI framework that threat actors abuse.

The captured source text contains the blog page shell, site navigation, and the article header only. It does not print the campaign details, the affected victims, the technical mechanics of the framework, or any detection guidance. Because of that, no named campaign, tool, malware family, CVE, or actor cluster beyond Microsoft Threat Intelligence as the author of record can be reported from this source.

For a defender, the captured text supports no specific check. Microsoft Threat Intelligence is the author of record and the post sits in the Research category. No domains, URLs, hashes, IP addresses, or package identifiers appear in the captured text, and no separate package repository is linked on the page.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Active Scanning | T1595 | Microsoft reported ARTEX scans internet facing systems for exploitation as one of its automated campaign types. |
| Unsecured Credentials | T1552 | Microsoft reported ARTEX searches public repositories for exposed secrets to enable follow on compromise. |

## IOCs

### Domains

_The captured source text prints no indicators. No domains, URLs, hashes, IP addresses, or package identifiers appear, and no separate package repository is linked._

### Full URL Paths

_The captured source text prints no indicators. No domains, URLs, hashes, IP addresses, or package identifiers appear, and no separate package repository is linked._

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

The captured source text contains no detection guidance, so no behavior or signature checks can be drawn from it. According to the Microsoft Security Blog, the item is filed under Research and authored by Microsoft Threat Intelligence. Defenders should read the full Microsoft Threat Intelligence post before building detections, because the page framing captured here does not state the techniques, targets, or observable activity tied to ARTEX.

## References

- [Microsoft Security Blog] What defenders need to know about ARTEX, the agentic AI framework threat actors abuse (2026-11-25) — https://www.microsoft.com/en-us/security/blog/2026/11/25/what-defenders-need-to-know-artex-agentic-ai-framework-threat-actors-abuse/
