# WEL1DROPPER npm Campaign Executes Cross-Platform Payloads on Import and Falls Back to DNS TXT Delivery

**Date:** 2026-08-14
**Tags:** supply-chain, malware

## Executive Summary

OpenSourceMalware analyzed `checkout-mobile-bnpl@35.6.9`, a malicious npm package that starts a cross-platform downloader when imported and retrieves native payloads through attacker-specific Cloudflare Workers hosts or DNS TXT records under `wel1[.]ru`. Sonatype independently tracked the broader operation as Flooding Dropper and described it as active on August 5; defenders should identify the exact package version, determine whether application or test code imported it, and hunt for payload retrieval and persistence before rotating exposed credentials. OpenSourceMalware assessed the package naming as AI-slopsquatted or randomly generated, but neither source verified that the operator used generative AI.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | WEL1DROPPER (OpenSourceMalware); Flooding Dropper / sonatype-2026-005660 (Sonatype Research Labs) |
| Actor / Attribution | Unknown; no national attribution supported, and generative-AI involvement is unverified |
| Target | Developers, CI/CD runners, test systems, and applications on Windows, Linux, and macOS |
| Vector | Import-time execution of the malicious npm package `checkout-mobile-bnpl@35.6.9` |
| Status | Active as of the August 5-6 source publications; current registry removal status not published by the sources |
| First Observed | 2026-08-05 public reporting |

## Detailed Findings

### Scope and AI-naming assessment

OpenSourceMalware reported that more than 700 related npm packages appeared over 48 hours and selected `checkout-mobile-bnpl@35.6.9` for detailed analysis. Sonatype Research Labs independently identified 846 components in the same operation as of August 5 and tracked it as Flooding Dropper under `sonatype-2026-005660`. This report restricts the package indicator to the exact version analyzed by OpenSourceMalware and does not reproduce either source's aggregate package list.

OpenSourceMalware assessed the campaign's package names as either AI-slopsquatted or randomly generated typosquatting names. Sonatype reported apparent automation in account creation, package publication, and small source-code variations, but Sonatype did not attribute that automation to a generative-AI system. The available evidence therefore supports automated publication and an OpenSourceMalware naming assessment, not confirmed malicious use of generative AI.

Neither OpenSourceMalware nor Sonatype identified the operator. OpenSourceMalware raised a possible Russian connection based on `wel1[.]ru` and strings referencing Russian financial institutions, while also stating that static evidence did not establish whether the referenced financial-institution domains were attacker-owned, compromised, or decoys. This report records the actor as unknown and excludes those ambiguous health-check domains from the IOC set.

### Import-time execution

OpenSourceMalware reported that `checkout-mobile-bnpl@35.6.9` exposes `init()`, `version()`, and `configure()` methods that provide no meaningful checkout functionality. According to OpenSourceMalware, the package's `index.js` loads `_helpers.js` after exporting its public API, and `_helpers.js` immediately invokes its downloader, making a single `require("checkout-mobile-bnpl")` sufficient to start the chain without a `preinstall` or `postinstall` script.

OpenSourceMalware also found an approximately 80 KB `lib/telemetry.js` decoy containing another implementation of the downloader. OpenSourceMalware reported that the active package entry point did not import this file and that its network destinations required caller-supplied values, so it did not add hardcoded infrastructure beyond the active `_helpers.js` path.

### HTTPS and DNS payload delivery

OpenSourceMalware reported that the JavaScript downloader maps Linux x64, Linux ARM64, macOS, and Windows systems to `/pkg/package`, `/pkg/package-arm64`, `/pkg/loader_mac`, and `/pkg/package.exe`, respectively. According to OpenSourceMalware, it shuffles three hardcoded Cloudflare Workers hosts, forces IPv4, uses the `node-fetch/2.6` User-Agent, applies a 15-second timeout, and accepts a response only when it receives HTTP 200 with more than 1,000 bytes. OpenSourceMalware found no signature check, certificate pinning, or expected-file hash before execution.

OpenSourceMalware reported that failure across all three HTTPS hosts triggers a DNS TXT fallback. According to OpenSourceMalware, the loader selects `sdk.dl.wel1[.]ru`, `ext.dl.wel1[.]ru`, `pkg.dl.wel1[.]ru`, or `net.dl.wel1[.]ru` by platform, reads a chunk count from `c.<domain>`, retrieves sequential `<integer>.<domain>` TXT records, concatenates their contents, and Base64-decodes the result into a native binary.

OpenSourceMalware reported that the downloader writes Unix payloads to `/var/tmp/.cache_<8 hex characters>` and launches them through `/bin/sh -c`, while Windows payloads use `%TEMP%\dotnet_diag_<8 hex characters>.exe` and `cmd.exe /c start /b`. According to OpenSourceMalware, the detached processes suppress standard input and output, and the downloader creates `/tmp/.analytics_state` or `%TEMP%\analytics_state` as a six-hour execution marker.

### Native payload observations

OpenSourceMalware analyzed a UPX-packed Linux x86-64 ELF and a universal macOS Mach-O retrieved from the campaign infrastructure. According to OpenSourceMalware, the macOS loader embedded five additional Cloudflare Workers proxy hosts, the path `/pkg/beacon_mac.bin`, and the DNS delivery domain `dl.wel1[.]ru`; its HTTPS template included an explicit port that the researchers could not recover confidently. The five hosts remain actionable domain indicators, but unresolved-port proxy URLs are excluded from the URL list below.

OpenSourceMalware reported that the macOS loader writes an executable beneath `~/.local/share/runtime`, creates `~/Library/LaunchAgents/com.apple.windowserver.helper.plist`, and loads the LaunchAgent with `launchctl load -w`. OpenSourceMalware also found checks for LLDB, debugserver, DTrace, Frida, Wireshark, VMware artifacts, and system memory, while noting that the exact reaction to each check required further control-flow reconstruction.

Sonatype reported campaign-level Windows second-stage behavior that patched Event Tracing for Windows and Antimalware Scan Interface functions, checked for analysis environments and security products, copied itself beneath AppData, established a Registry Run key and scheduled task, and reflectively executed a decrypted follow-on payload. Sonatype stated that its related packages contained syntactically varied first stages with the same underlying behavior; these Windows observations corroborate the broader campaign but are not represented as findings from OpenSourceMalware's two published native samples.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | A malicious npm package delivered executable code to developer and application environments. |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Importing the package loads `_helpers.js`, which immediately runs the Node.js downloader. |
| Ingress Tool Transfer | T1105 | The first stage retrieves platform-specific native payloads through HTTPS or DNS TXT records. |
| Application Layer Protocol: DNS | T1071.004 | The fallback channel reconstructs Base64-encoded binaries from sequential DNS TXT responses. |
| Deobfuscate/Decode Files or Information | T1140 | The loader Base64-decodes concatenated DNS chunks, and Sonatype reported decryption of a Windows follow-on stage. |
| Create or Modify System Process: Launch Agent | T1543.001 | The macOS loader creates and loads `com.apple.windowserver.helper.plist` for user-level persistence. |
| Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder | T1547.001 | Sonatype observed campaign-level Windows persistence through a Registry Run key. |
| Impair Defenses: Disable or Modify Tools | T1562.001 | Sonatype observed campaign-level patching of ETW and AMSI functions. |

## IOCs

### Package Indicators

```
npm:checkout-mobile-bnpl@35.6.9
```

### Domains

```
dl.wel1[.]ru
ext.dl.wel1[.]ru
net.dl.wel1[.]ru
oob-worker.cf102-baf.workers[.]dev
oob-worker.cf103-070.workers[.]dev
oob-worker.cf99-9b3.workers[.]dev
package-proxy.cf11oobworker.workers[.]dev
package-proxy.cf5oobworker.workers[.]dev
package-proxy.cf6oobworker.workers[.]dev
package-proxy.cf7oobworker.workers[.]dev
package-proxy.cf8oobworker.workers[.]dev
pkg.dl.wel1[.]ru
sdk.dl.wel1[.]ru
```

### Full URL Paths

```
oob-worker.cf102-baf.workers[.]dev/pkg/loader_mac
oob-worker.cf102-baf.workers[.]dev/pkg/package
oob-worker.cf102-baf.workers[.]dev/pkg/package-arm64
oob-worker.cf102-baf.workers[.]dev/pkg/package.exe
oob-worker.cf103-070.workers[.]dev/pkg/loader_mac
oob-worker.cf103-070.workers[.]dev/pkg/package
oob-worker.cf103-070.workers[.]dev/pkg/package-arm64
oob-worker.cf103-070.workers[.]dev/pkg/package.exe
oob-worker.cf99-9b3.workers[.]dev/pkg/loader_mac
oob-worker.cf99-9b3.workers[.]dev/pkg/package
oob-worker.cf99-9b3.workers[.]dev/pkg/package-arm64
oob-worker.cf99-9b3.workers[.]dev/pkg/package.exe
```

### Splunk Format

```
"*checkout-mobile-bnpl@35.6.9*" OR "*dl.wel1.ru*" OR "*ext.dl.wel1.ru*" OR "*net.dl.wel1.ru*" OR "*oob-worker.cf102-baf.workers.dev*" OR "*oob-worker.cf103-070.workers.dev*" OR "*oob-worker.cf99-9b3.workers.dev*" OR "*package-proxy.cf11oobworker.workers.dev*" OR "*package-proxy.cf5oobworker.workers.dev*" OR "*package-proxy.cf6oobworker.workers.dev*" OR "*package-proxy.cf7oobworker.workers.dev*" OR "*package-proxy.cf8oobworker.workers.dev*" OR "*pkg.dl.wel1.ru*" OR "*sdk.dl.wel1.ru*" OR "*oob-worker.cf102-baf.workers.dev/pkg/loader_mac*" OR "*oob-worker.cf102-baf.workers.dev/pkg/package*" OR "*oob-worker.cf102-baf.workers.dev/pkg/package-arm64*" OR "*oob-worker.cf102-baf.workers.dev/pkg/package.exe*" OR "*oob-worker.cf103-070.workers.dev/pkg/loader_mac*" OR "*oob-worker.cf103-070.workers.dev/pkg/package*" OR "*oob-worker.cf103-070.workers.dev/pkg/package-arm64*" OR "*oob-worker.cf103-070.workers.dev/pkg/package.exe*" OR "*oob-worker.cf99-9b3.workers.dev/pkg/loader_mac*" OR "*oob-worker.cf99-9b3.workers.dev/pkg/package*" OR "*oob-worker.cf99-9b3.workers.dev/pkg/package-arm64*" OR "*oob-worker.cf99-9b3.workers.dev/pkg/package.exe*"
```

### File Hashes

All values are SHA-256 hashes published by OpenSourceMalware.

```
0fc30f82e1fa5e51a6c0c43f3ed7f13592ea731cb331e43a4d085df60a4db8b6
94ef6b1c4a9d31f78f446d053048bcef34fd88f4376a1a46f7f777a9e9c83a29
b74c5675725911c62091bdf40714df760cc2af7a88360d21065f4e1c878aa8f0
e2650e9aa2f924433ba422857b22ee7c5996b5ad306f3f903283f6a13e248935
a3e2ffb440b779d30da3ff282affd649731088e8570df7b1aa72742d995b782c
7e486657f30594afda379b97030252a09a19fe8055e25c9e371544f59bd8e9e3
c214746c74cae8ece8bdaf69aa05da4db6ce013f9e77452d1eed1a002fd9ba00
```

OpenSourceMalware mapped the values in order to `README.md`, `_helpers.js`, `index.js`, `package.json`, `lib/telemetry.js`, the Linux x86-64 native payload, and the universal macOS native payload.

## Detection Recommendations

Search lockfiles, SBOMs, package manifests, npm caches, internal artifact repositories, container layers, and build logs for the exact package and version `checkout-mobile-bnpl@35.6.9`. Treat presence as exposure and establish whether Node.js, application, test, or build telemetry shows the package being imported; installation without import does not reproduce the OpenSourceMalware execution trigger.

In DNS logs, filter `query_type=TXT` for the five published `wel1[.]ru` domains and alert on a count lookup beginning with `c.` followed by sequential integer-prefixed queries from the same developer workstation or CI runner. Retain query names, TXT response content, response sizes, and the initiating process because the payload is reconstructed in DNS and can bypass HTTPS-only controls.

In web proxy telemetry, search `url_host` for the eight exact `workers[.]dev` subdomains and `url` for the 12 published payload paths. Correlate HTTP 200 responses larger than 1,000 bytes and the `node-fetch/2.6` User-Agent with a Node.js process; block the attacker-specific subdomains, not the shared `workers[.]dev` apex.

In EDR process and file telemetry, alert when Node.js writes `/var/tmp/.cache_[0-9a-f]{8}` or `%TEMP%\dotnet_diag_[0-9a-f]{8}.exe`, launches it through `/bin/sh -c` or `cmd.exe /c start /b`, and creates an `analytics_state` marker. On macOS, hunt for `~/.local/share/runtime/com.apple.runtime`, `~/.local/share/runtime/.lock`, `~/Library/LaunchAgents/com.apple.windowserver.helper.plist`, and `launchctl load -w` involving that plist.

Isolate hosts with confirmed import-time execution, preserve Node.js, DNS, proxy, process, and persistence evidence, and scope credentials available to the affected process. Remove retained package artifacts, rebuild compromised systems from known-good sources where appropriate, and rotate npm, source-control, cloud, signing, and deployment credentials only after containment and eradication.

## References

- [OpenSourceMalware] Russian AI Slopsquatting Publishes 700+ Malicious NPM Packages (2026-08-06) — https://opensourcemalware.com/blog/russian-ai-slopsquatting-npm-campaign
- [Sonatype Research Labs] 'Flooding Dropper' Campaign Hits npm With Nearly 850 Malicious Packages (2026-08-05) — https://www.sonatype.com/blog/flooding-dropper-hits-npm-with-850-malicious-packages
