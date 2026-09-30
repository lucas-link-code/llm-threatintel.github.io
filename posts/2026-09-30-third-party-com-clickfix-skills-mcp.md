# Placeholder Domain third-party.com Serves a ClickFix Lure From AI Skill and MCP Docs

**Date:** 2026-09-30
**Tags:** phishing, mcp-security, supply-chain

## Executive Summary

Manifold Security reported on 2026-09-23 that third-party.com, a hostname widely copied into AI agent skills and MCP server docs as a placeholder, serves a ClickFix page to Windows browsers and a decoy to other operating systems. BleepingComputer confirmed the fake Cloudflare check and a second stage host, elxxvvx.xyz, which did not resolve when they tested. Block both names, replace unowned placeholder hostnames with example.com, and do not treat a clean fetch from a non Windows crawler as proof the site is benign.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | third-party.com ClickFix lure |
| Actor / Attribution | Unknown operator (confidence: none). Neither outlet named a cluster |
| Target | Windows users and any agent or app that follows placeholder URLs copied from skills, MCP docs, or tests |
| Vector | Fake Cloudflare verification page that writes a PowerShell command to the clipboard and tells the user to run it |
| Status | active. The lure host was live on 2026-09-23. The second stage name did not resolve during BleepingComputer testing |
| First Observed | At least June 2026, per Manifold Security. No specific first day was published |

## Detailed Findings

According to Manifold Security, security engineer Swapnil Patil found third-party.com while reviewing public skills and MCP server documentation, after monitoring had already flagged the domain as phishing. Manifold Security reported that the skills had not changed. The domain they cited as an example endpoint had started serving a malicious page. Manifold Security said a public code search shows the hostname in skills, MCP server docs, and more than 1,500 files across more than 1,700 repositories, including Chromium, Sanity, and Vercel examples. Manifold Security said the domain has served the ClickFix lure since at least June 2026.

Manifold Security described the Windows path as a fake Cloudflare "Performing security verification" page. JavaScript writes a command to the clipboard and the page tells the visitor to open the Run dialog, paste, and continue. Manifold Security said the deobfuscated command runs PowerShell, fetches a script from elxxvvx.xyz/f, executes that script in memory, and suppresses errors. Manifold Security said a decoy comment is appended so the pasted text resembles a verification token. Manifold Security reported that macOS and Linux user agents receive a page that says the site requires a Windows PC, with no clipboard payload. Manifold Security said the second stage host was offline during their testing while third-party.com was still serving the lure.

Manifold Security reported that the public IPFire blocklist briefly flagged the domain as malware on 2026-07-07 and removed it on 2026-07-17. Manifold Security tied that short listing to the same cloaking behavior: a checker that does not present a Windows user agent sees the decoy and can clear the name. Manifold Security said it reported the domain to registrar Network Solutions before publishing. Manifold Security listed the domain as registered in 1996.

BleepingComputer confirmed on 2026-09-23 that the page shows a fake Cloudflare check and, after the visitor clicks the box, copies a PowerShell command that rebuilds the URL elxxvvx.xyz/f, downloads a script, and executes it. BleepingComputer reported that elxxvvx.xyz no longer resolved at the time of its test, so the chain was broken then. BleepingComputer cited a VirusTotal record from 2026-05-02 in which the same host delivered a PowerShell script set to download a 131 MB zip from elxxvvx.xyz/update2.zip. BleepingComputer said that archive was no longer available, so the payload contents were not determined.

BleepingComputer reported that the domain was first registered in 1996 and that the outlet has not determined when control changed. BleepingComputer also reported that it has seen no public cases in which a copied placeholder reference actually led to ClickFix execution on a developer system. The lure host was still live, so a later second stage name can be swapped in without changing the docs that point at third-party.com.

Manifold Security named three innocent references and said none of them execute the domain: a Liquid example in shopify-expert under jeffallan/claude-skills, an OAuth gateway example in alova-server-usage under alovajs/skills, and a ClawHub skill doc, dynamic-dashboard-builder, that uses the host in a sample labeled as the wrong way to hardcode an endpoint. Those repository names are not malicious packages.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution | T1204 | Manifold Security reported that Windows visitors are instructed to paste a clipboard command into the Run dialog |
| Command and Scripting Interpreter: PowerShell | T1059.001 | Manifold Security and BleepingComputer reported that the pasted command fetches and runs a remote PowerShell script |
| Masquerading | T1036 | The page imitates a Cloudflare check for Windows user agents and returns a decoy to other operating systems |

## IOCs

### Domains

```
third-party[.]com
elxxvvx[.]xyz
```

### Full URL Paths

```
elxxvvx[.]xyz/f
elxxvvx[.]xyz/update2.zip
```

### Splunk Format

```
"third-party[.]com" OR "elxxvvx[.]xyz" OR "elxxvvx[.]xyz/f" OR "elxxvvx[.]xyz/update2.zip"
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Block DNS and web proxy requests to third-party.com and elxxvvx.xyz, including the paths /f and /update2.zip. A reputation lookup that fetches the lure host with a Linux or datacenter user agent can receive the decoy page, so confirm the block with a Windows browser user agent or treat any hit as suspicious regardless of the last crawl result. In endpoint telemetry, alert when powershell.exe is started from an interactive user session with Invoke-RestMethod or irm against an external host, followed by Invoke-Expression or iex. Search skills, MCP server manifests, READMEs, and tests for the string third-party.com and for other unowned placeholder hostnames. Reserved documentation names such as example.com, example.org, and example.net are the replacements. Do not allowlist third-party.com to silence a scanner.

## References

- [Manifold Security] third-party.com Placeholder Domain Now Serves ClickFix (2026-09-23): https://www.manifold.security/blog/third-party-com-placeholder-clickfix
- [BleepingComputer] Placeholder domain used in dev docs now serves ClickFix attacks (2026-09-23): https://www.bleepingcomputer.com/news/security/placeholder-domain-used-in-dev-docs-now-serves-clickfix-attacks/
- [The Hacker News] Placeholder third-party.com Referenced Across 1,700+ Repositories Now Serves Malicious Content (2026-09-24): https://thehackernews.com/2026/09/placeholder-third-partycom-referenced.html
