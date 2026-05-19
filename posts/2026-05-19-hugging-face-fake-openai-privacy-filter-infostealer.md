# Fake OpenAI Privacy Filter Delivers Infostealer via Hugging Face: 244K Downloads Before Removal

**Date:** 2026-05-19
**Tags:** supply-chain, malicious-tool

## Executive Summary

On May 7, 2026, researchers identified malicious code in the Hugging Face repository Open-OSS/privacy-filter, which appeared among the platform's top trending repositories with over 200k downloads until removal. The repository typosquatted OpenAI's legitimate Privacy Filter release, copied its model card nearly verbatim, and shipped a loader.py file that fetches and executes infostealer malware on Windows machines.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Hugging Face OpenAI Infostealer Distribution Campaign |
| Attribution | Unknown threat actor; related infrastructure links to WinOS 4.0 npm campaign (confidence: medium) |
| Target | Windows developers and AI practitioners downloading Hugging Face models |
| Vector | Typosquatted repository hosting malicious loader.py |
| Status | active |
| First Observed | 2026-05-07 |

## Detailed Findings

Through HiddenLayer telemetry, six repositories under the same account were identified, all uploaded on April 24, 2026, containing another malicious loader.py file using the same command-retrieval URL (jsonkeeper.com/b/AVNNE). On April 26, 2026, a separate sample was observed serving a payload beaconing to welovechinatown.info, a C2 documented in research into WinOS 4.0 npm typosquat, suggesting these campaigns are possibly linked and likely part of a broader supply chain operation. This incident fits a broader pattern of attackers using Hugging Face infrastructure as a distribution path.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Compromised Hugging Face repository used for malware distribution |
| Trojanized Software | T1195.002 | Legitimate-appearing AI model repository contains malicious loader |
| Execution | T1204.002 | User-initiated execution of loader.py triggers infostealer download |

## IOCs

### Domains

```
jsonkeeper.com
welovechinatown.info
```

### Full URL Paths

```
jsonkeeper.com/b/AVNNE
```

### Splunk Format

```
"jsonkeeper.com" OR "welovechinatown.info" OR "jsonkeeper.com/b/AVNNE"
```

### Package Indicators

```
Open-OSS/privacy-filter (Hugging Face repository)
```

## Detection Recommendations

Monitor Hugging Face for repositories using popular brand names or misspellings of official projects; implement download hash validation for AI models; block execution of loader.py and similar wrapper scripts from untrusted sources; hunt for connections to jsonkeeper.com and welovechinatown.info C2 infrastructure; alert on Windows processes executing Python scripts from Hugging Face clone directories.

## References

- [HiddenLayer] Malware Found in Trending Hugging Face Repository 'Open-OSS/privacy-filter' (2026-05-07) — https://www.hiddenlayer.com/research/malware-found-in-trending-hugging-face-repository-open-oss-privacy-filter
- [WinBuzzer] Fake OpenAI Repository on Hugging Face Pushes Infostealer Malware (2026-05-11) — https://winbuzzer.com/2026/05/11/fake-openai-repository-on-hugging-face-pushes-info-xcxwbn
