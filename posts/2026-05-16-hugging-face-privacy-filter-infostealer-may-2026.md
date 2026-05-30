# Fake OpenAI Privacy Filter Hugging Face Repository Delivers Infostealer—244K Downloads Before Removal; Linked to Broader Supply Chain Campaign

**Date:** 2026-05-16
**Tags:** supply-chain, malicious-tool, malware

## Executive Summary

A malicious Hugging Face repository posing as an OpenAI release delivered infostealer malware to Windows systems and logged 244,000 downloads before being removed. The repository, named Open-OSS/privacy-filter, impersonated OpenAI's legitimate Privacy Filter release, copied its model card almost word-for-word, and included a malicious loader.py file that fetched and executed credential-stealing malware on Windows hosts. The repository reached the #1 trending position on Hugging Face with approximately 244K downloads and 667 likes in under 18 hours, numbers that were almost certainly artificially inflated to make the repository appear legitimate.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Open-OSS/privacy-filter Hugging Face Supply Chain Attack |
| Attribution | Unknown (Likely Organized Supply Chain Campaign) (confidence: medium) |
| Target | Windows developers downloading AI security/privacy tools from Hugging Face |
| Vector | Typosquatting legitimate OpenAI Privacy Filter on Hugging Face; malicious loader.py via postinstall hook; infostealer payload via jsonkeeper.com C2 |
| Status | removed |
| First Observed | 2026-05-07 |

## Detailed Findings

According to HiddenLayer, the loader.py script first executes decoy code that resembles a legitimate AI model loader before launching a concealed infection chain. The script disabled SSL verification, decoded a base64-encoded URL linked to the public JSON hosting service jsonkeeper.com, retrieved a remote payload instruction, and passed commands to PowerShell. Using jsonkeeper.com as the C2 channel lets the attacker rotate the payload without modifying the repository. The resulting PowerShell command downloaded an additional batch file from an attacker-controlled domain and established persistence by creating a scheduled task designed to mimic a legitimate Microsoft Edge update process. HiddenLayer identified six additional Hugging Face repositories uploaded under a separate account that used nearly identical loader logic and shared infrastructure with the campaign. The researchers also linked elements of the operation to earlier software supply-chain attacks involving npm typosquatting campaigns and fake AI packages distributed through PyPI. The shared infrastructure "suggests these campaigns are possibly linked and likely part of a broader supply chain operation targeting open-source ecosystems."

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Compromised public AI model repository (Hugging Face) to distribute infostealer malware |
| Typosquatting / Masquerading | T1583.006 | Malicious repo copied legitimate OpenAI Privacy Filter project metadata |
| Execution via Code | T1059 | Loader.py executes obfuscated PowerShell to fetch and run Winos 4.0 stager binary |
| Persistence via Scheduled Task | T1053.005 | Creates scheduled task mimicking Microsoft Edge update to maintain persistence |

## IOCs

### Domains

```
jsonkeeper.com
```

### Full URL Paths

```
https://www.huggingface.co/Open-OSS/privacy-filter
```

### Splunk Format

```
"jsonkeeper.com" OR "https://www.huggingface.co/Open-OSS/privacy-filter"
```

### File Hashes

```
6d5b1b7b9b95f2074094632e3962dc21432c2b7dccfbbe2c7d61f724ffcfea7c
c1b59cc25bdc1fe3f3ce8eda06d002dda7cb02dea8c29877b68d04cd089363c7
```

### Package Indicators

```
Open-OSS/privacy-filter (Hugging Face)
```

## Detection Recommendations

Monitor Hugging Face trending repositories for repositories with identical names to legitimate projects but different authors. Implement content hash validation for downloaded model repositories; alert on .py files in model repos that perform network I/O. Scan for scheduled tasks named after system update processes (Edge, Windows Update). Monitor jsonkeeper.com and similar JSON hosting services for malicious payload rotation patterns. Block PowerShell execution from Python package postinstall hooks. Threat hunt for Winos 4.0 stager binary (CodeRun102.exe) and associated persistence mechanisms.

## References

- [HiddenLayer] Malware Found in Trending Hugging Face Repository "Open-OSS/privacy-filter" (2026-05-07) — https://www.hiddenlayer.com/research/malware-found-in-trending-hugging-face-repository-open-oss-privacy-filter
- [CSO Online] Malicious Hugging Face model masquerading as OpenAI release hits 244K downloads (2026-05-13) — https://www.csoonline.com/article/4169407/malicious-hugging-face-model-masquerading-as-openai-release-hits-244k-downloads.html
- [Bleeping Computer] Fake OpenAI Privacy Filter Repo Hits #1 on Hugging Face, Draws 244K Downloads (2026-05-16) — https://thehackernews.com/2026/05/fake-openai-privacy-filter-repo-hits-1.html
