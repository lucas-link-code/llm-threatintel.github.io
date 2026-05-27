# Fake OpenAI 'Privacy Filter' Repository on Hugging Face Delivers Infostealer to 244K Users

**Date:** 2026-05-27
**Tags:** supply-chain, malicious-tool

## Executive Summary

On May 7, 2026, HiddenLayer identified malicious code in the Hugging Face repository Open-OSS/privacy-filter, which appeared among the platform's top trending repositories with over 200k downloads until its removal. The repository had typosquatted OpenAI's legitimate Privacy Filter release, copied its model card nearly verbatim, and shipped a loader.py file that fetches and executes infostealer malware on Windows machines.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Fake OpenAI Privacy Filter Supply Chain Attack |
| Attribution | Unknown (overlaps with WinOS 4.0 npm typosquatting campaign infrastructure) (confidence: medium) |
| Target | Developers and researchers downloading from Hugging Face |
| Vector | Typosquatted repository with malicious loader.py |
| Status | removed |
| First Observed | 2026-05-07 |

## Detailed Findings

The repository briefly reached #1 on Hugging Face and accumulated 244,000 downloads before the platform responded to reports and removed it. The loader.py Python script included fake AI-related code to appear harmless, but in the background it disabled SSL verification, decoded a base64 URL, and fetched a JSON payload containing a PowerShell command that downloads a batch file performing privilege escalation, adds the final payload to Microsoft Defender's exclusions, and executes it. The final payload is a Rust-based infostealer that targets browser data from Chromium- and Gecko-based browsers including cookies, saved passwords, encryption keys, browsing data, and session tokens. Six additional malicious repositories under the same account were identified, all uploaded on April 24, 2026, containing another malicious loader.py file with nearly identical functionality using the same command-retrieval URL. Related loader infrastructure appeared in other repositories with likely overlap with a broader WinOS 4.0 npm typosquatting campaign, suggesting these campaigns are possibly linked and likely part of a broader supply chain operation targeting open-source ecosystems.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195.001 | Malicious Hugging Face repository typosquatting trusted OpenAI project |
| Masquerading | T1036 | Fake AI-related code as disguise for infostealer payload |
| Ingress Tool Transfer | T1105 | Downloading and executing infostealer via PowerShell from C2 |

## IOCs

### Domains

```
jsonkeeper.com
recargapopular.com
welovechinatown.info
```

### Full URL Paths

```
https://www.huggingface.co/Open-OSS/privacy-filter
```

### Splunk Format

```
"jsonkeeper.com" OR "recargapopular.com" OR "welovechinatown.info" OR "https://www.huggingface.co/Open-OSS/privacy-filter"
```

### File Hashes

```
6d5b1b7b9b95f2074094632e3962dc21432c2b7dccfbbe2c7d61f724ffcfea7c
c1b59cc25bdc1fe3f3ce8eda06d002dda7cb02dea8c29877b68d04cd089363c7
```

### Package Indicators

```
Open-OSS/privacy-filter
```

## Detection Recommendations

Monitor Hugging Face for repositories with high download velocity that typosquat popular projects. Scan loader.py and similar executable files for base64-encoded URLs, SSL verification disabling, and PowerShell command invocation. Implement code signing verification for downloaded model repositories. Flag repositories with downloaded counts in hundreds of thousands within hours of upload. Review file download logs for interactions with domains: jsonkeeper.com, welovechinatown.info, recargapopular.com.

## References

- [HiddenLayer] Malware Found in Trending Hugging Face Repository 'Open-OSS/privacy-filter' (2026-05-07) — https://www.hiddenlayer.com/research/malware-found-in-trending-hugging-face-repository-open-oss-privacy-filter
- [BleepingComputer] Fake OpenAI repository on Hugging Face pushes infostealer malware (2026-05-07) — https://www.bleepingcomputer.com/news/security/fake-openai-repository-on-hugging-face-pushes-infostealer-malware/
