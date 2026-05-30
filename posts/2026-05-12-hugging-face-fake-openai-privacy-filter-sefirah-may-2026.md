# Malicious Hugging Face Repository Masquerading as OpenAI Privacy Filter Reaches #1 Trending—244K Downloads of Sefirah Rust Infostealer Before Removal

**Date:** 2026-05-12
**Tags:** supply-chain, malware

## Executive Summary

A malicious Hugging Face repository posing as an OpenAI release delivered infostealer malware to Windows systems and logged 244,000 downloads before being removed, raising fresh concerns about how enterprises source and validate AI models from public repositories. The repository, named Open-OSS/privacy-filter, impersonated OpenAI's legitimate Privacy Filter release, copied its model card almost word-for-word, and included a malicious loader.py file that fetched and executed credential-stealing malware on Windows hosts. The repository reached the #1 trending position on Hugging Face with approximately 244K downloads and 667 likes in under 18 hours, numbers that were almost certainly artificially inflated to make the repository appear legitimate.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Fake OpenAI Privacy Filter Supply Chain Attack |
| Attribution | Unknown threat actor(s); infrastructure shared with npm typosquatting and PyPI campaigns (confidence: medium) |
| Target | Windows users downloading AI models from Hugging Face; organizations integrating untrusted models |
| Vector | Typosquatted model repository with malicious loader.py; credential stealer with DLL sideload chain |
| Status | active |
| First Observed | 2026-05-07 |

## Detailed Findings

The loader.py script first executes decoy code that resembles a legitimate AI model loader before launching a concealed infection chain. The script disabled SSL verification, decoded a base64-encoded URL linked to jsonkeeper.com, retrieved a remote payload instruction, and passed commands to PowerShell. Using jsonkeeper.com as the C2 channel lets the attacker rotate the payload without modifying the repository. The resulting PowerShell command downloaded an additional batch file from an attacker-controlled domain and established persistence by creating a scheduled task designed to mimic a legitimate Microsoft Edge update process. HiddenLayer identified six additional Hugging Face repositories uploaded under a separate account that used nearly identical loader logic and shared infrastructure with the campaign. The researchers also linked elements of the operation to earlier software supply-chain attacks involving npm typosquatting campaigns and fake AI packages distributed through PyPI. The shared infrastructure suggests these campaigns are possibly linked and likely part of a broader supply chain operation targeting open-source ecosystems. The final payload is a Rust-based infostealer that targets browser data from Chromium- and Gecko-based browsers (cookies, saved passwords, encryption keys, browsing data, session tokens). The stolen data is compressed and exfiltrated to a command-and-control server at recargapopular.com.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Typosquatting | T1583.006 | Repository name 'Open-OSS/privacy-filter' mimics OpenAI's legitimate 'openai/privacy-filter' release |
| Supply Chain Compromise | T1195.001 | Malicious model repository introduced into AI model supply chain via Hugging Face |
| DLL Side-Loading | T1574.002 | G DATA DLL sideload chain with XOR-encrypted PlugX payload (ported to Rust as Sefirah) |

## IOCs

### Domains

```
jsonkeeper.com
recargapopular.com
```

### Full URL Paths

```
huggingface.co/Open-OSS/privacy-filter
huggingface.co/Open-OSS/privacy-filter/blob/main/loader.py
```

### Splunk Format

```
"jsonkeeper.com" OR "recargapopular.com"
```

### File Hashes

```
35FEEF0E6806C14F4CCDB4FCEFF8A5757956C50FB5EC9644DEDAE665304F9F96
```

### Package Indicators

_No package indicators published; repository and loader indicators are listed as URL paths._

## Detection Recommendations

Implement mandatory code review and malware scanning for all AI repositories before internal use—treat Pickle files and loader scripts as high-risk. Deploy application allowlisting for PowerShell execution, especially payload downloads from external URLs. Monitor for scheduled tasks mimicking Microsoft Edge updates. Track all Hugging Face repository downloads in your organization and cross-reference against known-malicious repository hashes. Alert on base64-encoded URL decoding in Python/loader scripts. Block jsonkeeper.com and similar dynamic C2 infrastructure. Scan for Sefirah infostealer signatures (Rust-compiled binaries with browser credential theft patterns).

## References

- [HiddenLayer] Malicious Hugging Face model masquerading as OpenAI release hits 244K downloads (2026-05-09) — https://www.csoonline.com/article/4169407/malicious-hugging-face-model-masquerading-as-openai-release-hits-244k-downloads.html
- [The Hacker News] Fake OpenAI Privacy Filter Repo Hits #1 on Hugging Face, Draws 244K Downloads (2026-05-10) — https://thehackernews.com/2026/05/fake-openai-privacy-filter-repo-hits-1.html
- [Malwarebytes Labs] Fake Claude site installs malware that gives attackers access to your computer (2026-04-10) — https://www.malwarebytes.com/blog/scams/2026/04/fake-claude-site-installs-malware-that-gives-attackers-access-to-your-computer
