# OtterCookie Backdoor Targets AI Coding Tools via Fake Gemini npm Package: DPRK-Linked Campaign Harvests Credentials from Cursor, Claude, and Windsurf

**Date:** 2026-05-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware, apt

## Executive Summary

A DPRK-linked threat actor published the malicious npm package gemini-ai-checker on March 20, 2026, disguised as a Google Gemini token verification utility but delivering an OtterCookie JavaScript backdoor variant that specifically targets AI coding tool directories including .cursor, .claude, .gemini, .windsurf, .pearai, and .eigent. The campaign is linked with moderate-to-high confidence to the Contagious Interview operation previously documented by Microsoft. Two sibling packages, express-flowlimit and chai-extensions-extras, remain live on npm as of early May 2026 with the same Vercel-hosted C2 infrastructure.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | OtterCookie / Contagious Interview |
| Attribution | DPRK-linked threat actor (confidence: medium-high) |
| Target | Software developers using AI coding tools (Cursor, Claude Code, Windsurf, PearAI, Gemini CLI) |
| Vector | Malicious npm package spoofing Google Gemini AI |
| Status | active (sibling packages still live) |
| First Observed | 2026-03 |

## Detailed Findings

According to GBHackers and Cyber and Ramen, on March 20, 2026, an npm user named gemini-check uploaded a package called gemini-ai-checker, claiming it could verify Google Gemini AI tokens. The package README displayed wording copied from the legitimate package chai-await-async, a JavaScript assertion library with no relationship to Gemini.

The package mimics a modern Node.js project with four dependencies, 44 files, and a 271 kB footprint including SECURITY and documentation files for legitimacy. The C2 configuration in lib/config.js splits the staging domain, path, version, and bearer token into separate variables so the full URL never appears as a single string.

During installation, lib/caller.js reconstructs the full URL and issues an HTTP GET to server-check-genimi.vercel[.]app/defy/v3 with a custom bearrtoken: logo header, retrying up to five times. When the server returns a 404 containing a token field, the value is passed to Function.constructor and executed in memory with access to Node.js require, never touching disk.

Researchers recovered the JavaScript backdoor from the Vercel endpoint before takedown. The payload is a four-module OtterCookie variant: Module 0 is a Socket.IO RAT on port 4891 masquerading as vhost.ctl. Module 1 is a credential stealer on port 4896 targeting browser credential stores and 25+ cryptocurrency wallets. Module 2 is a file exfiltration module on port 4899 scanning for .env, .pem, .key, .json, .csv, .doc, .pdf, .xlsx files. Module 3 is a clipboard stealer on port 80 polling every 500ms.

The exfiltration module explicitly hunts for AI coding tool directories: .cursor (Cursor AI IDE), .claude (Anthropic Claude Code), .gemini (Gemini CLI), .windsurf (Windsurf AI IDE), .pearai (PearAI), and .eigent (Eigent AI). This represents a new targeting capability not seen in prior OtterCookie variants.

Cyber and Ramen assessed with moderate-to-high confidence that the payload is an active OtterCookie variant based on overlaps in obfuscation patterns, module layout, Socket.IO usage, and fingerprinting logic. Microsoft documented the base OtterCookie variant in March 2026 as part of the DPRK Contagious Interview campaign active since October 2025.

The gemini-ai-checker package was removed from npm shortly before April 1, 2026. However, the same account hosts two related packages that share the same Vercel C2 infrastructure: express-flowlimit (versions 1.3.6, 2.1.6, 2.2.7, 2.2.8) and chai-extensions-extras (version 1.2.5), which had over 500 combined downloads and remain live as of publication.

The C2 infrastructure uses IP 216.126.237[.]71 (AS14956, RouterHosting LLC) with distinct ports for each module function.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies | T1195.001 | Malicious npm package spoofing Google Gemini AI brand |
| Command and Scripting Interpreter: JavaScript | T1059.007 | In-memory execution via Function.constructor to avoid disk artifacts |
| Credentials from Password Stores | T1555 | Browser credential databases and 25+ cryptocurrency wallet stores targeted |
| Data from Local System | T1005 | Exfiltration of .env, .pem, .key files and AI coding tool directories |
| Clipboard Data | T1115 | Clipboard monitoring every 500ms for cryptocurrency addresses and API keys |
| Application Layer Protocol: Web Protocols | T1071.001 | Socket.IO-based C2 communication on port 4891 |

## IOCs

### Domains

```
server-check-genimi.vercel.app
```

### Full URL Paths

```
server-check-genimi.vercel.app/defy/v3
216.126.237.71/api/service/makelog
216.126.237.71/api/service/process
```

### Splunk Format

```
"server-check-genimi.vercel.app" OR "216.126.237.71" OR "gemini-ai-checker" OR "express-flowlimit" OR "chai-extensions-extras" OR "vhost.ctl"
```

### File Hashes

*No file hashes published by source for the npm packages themselves. The payload executes entirely in-memory via Function.constructor.*

### Package Indicators

```
npm:gemini-ai-checker
npm:express-flowlimit
npm:chai-extensions-extras
```

## Detection Recommendations

Monitor web proxy logs for HTTP connections to server-check-genimi.vercel[.]app or outbound traffic to 216.126.237[.]71 on ports 4891, 4896, 4899, and 80.

Search EDR telemetry for Node.js processes spawning multiple child processes with Socket.IO C2 patterns, particularly processes named vhost.ctl.

Use Microsoft's published KQL hunting queries for Contagious Interview and OtterCookie activity to detect multi-process Node.js backdoors.

Audit npm lockfiles for gemini-ai-checker, express-flowlimit, or chai-extensions-extras packages.

Monitor for access to AI coding tool configuration directories (.cursor, .claude, .gemini, .windsurf, .pearai, .eigent) by non-standard processes.

Alert on clipboard access patterns consistent with 500ms polling intervals from Node.js processes.

## References

- [GBHackers] Fake Gemini npm Package Steals AI Tool Tokens (2026-04-07) — https://gbhackers.com/fake-gemini-npm/
- [Cyber and Ramen] OtterCookie Expands Targeting to AI Coding Tools (2026-04-04) — https://cyberandramen.net/2026/04/04/ottercookie-expands-targeting-to-ai-coding-tools-analysis-of-a-trojanized-npm-campaign/
- [Simply Secure Group] Hackers Use Fake Gemini npm Package to Steal Tokens From Claude, Cursor, and Other AI Tools (2026-04) — https://simplysecuregroup.com/hackers-use-fake-gemini-npm-package-to-steal-tokens-from-claude-cursor-and-other-ai-tools/
