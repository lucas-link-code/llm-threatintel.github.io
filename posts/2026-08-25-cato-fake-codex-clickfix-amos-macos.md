# Fake OpenAI Codex and Claude Code Ads Push ClickFix Loaders for Suspected AMOS on macOS

**Date:** 2026-08-25
**Tags:** phishing, malware

## Executive Summary

Cato Networks reported on 2026-08-24 that sponsored Google results for queries such as codex macos download send macOS users to Google Sites pages impersonating an OpenAI Codex installer, then instruct them to paste a Terminal command that fetches a multi-stage loader. Cato assessed strong overlap with Atomic macOS Stealer delivery and documented a related Claude Code landing page on parentpreneurx.com that reuses the same telemetry host. Block the attacker-controlled iframe and payload hosts below, hunt zsh pipelines from Terminal, and treat sites.google.com as shared hosting rather than a denylist apex.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Fake Codex and Claude Code ClickFix delivery assessed as AMOS-overlapping |
| Actor / Attribution | Unnamed operators; Cato did not name a group. Payload overlap with AMOS, confidence medium |
| Target | macOS developers searching for OpenAI Codex or Claude Code installers |
| Vector | Malvertising to Google Sites lures, attacker iframe with ClickFix Terminal paste, multi-stage zsh to Mach-O in /tmp/helper |
| Status | Active as of Cato's 2026-08-24 publication; Cato said it had blocked reused iframe infrastructure for its customers |
| First Observed | Cato published 2026-08-24; Microsoft documented a related macOS ClickFix shift on 2026-08-05 per Cato's campaign-context section |

## Detailed Findings

According to Cato CTRL, the opening move is a sponsored search result that sits above the legitimate OpenAI listing. Cato reported that the ad leads to a Google Sites page that copies a Codex download portal, including macOS and Linux buttons, with payload delivery observed for macOS only.

Cato reported that the Google Sites page is a front end. It embeds attacker-controlled ClickFix content through an iframe. Cato mapped three Codex lure sets: sites.google.com/view/codex-desktop-app/ and sites.google.com/view/cdx-off-page to bright-links.com, and sites.google.com/view/codexmac to swiftsaverfin.com/codexx/. Cato stated that the expected /codex/ path on the second set returns a benign decoy, while /codexx/ serves the live installer, and that non-macOS browsers can also receive benign content.

Cato reported that the pasted command starts with a plausible npm install string for Codex, then decodes a Base64 URL and pipes a remote script into zsh. The first-stage loader embeds a second stage that Cato said progressed from compressed Base64 to an AES-encrypted gzip container between infrastructure sets. After decode, the second stage sends a background request with event=pasted, writes a Mach-O to /tmp/helper, runs xattr -c, then chmod +x and executes.

Cato assessed substantial overlap with documented AMOS delivery: Base64 curl loaders, obfuscated zsh stages, telemetry to /api/metrics/run?event=pasted, update-themed payload URLs, universal Mach-O payloads in /tmp/helper, and extended-attribute removal. Cato stated that telemetry overlap is not by itself proof of the Mach-O's later C2 protocol. The Register, SiliconANGLE, SC Media, and Infosecurity Magazine independently summarized the same Cato report on 2026-08-24 and 2026-08-25.

Cato also identified a Claude Code-branded ClickFix page at parentpreneurx.com that is not on Google Sites but reuses grove-satin.com telemetry from the third Codex set, with first-stage and payload hosts on vine-96.com.

Do not publish sites.google.com, google.com, or npmjs.com as campaign indicators. Those are shared platforms. The attacker-controlled hosts and specific Google Sites view paths are the indicators.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Drive-by Compromise | T1189 | Sponsored search ads deliver victims to impersonating Codex download pages. |
| User Execution: Malicious Link | T1204.001 | Sponsored lures and the fake installer page induce the victim to paste and run the loader command. |
| Command and Scripting Interpreter: Unix Shell | T1059.004 | The copied command pipes a remote script into zsh. |
| Subvert Trust Controls: Mark-of-the-Web Bypass | T1553.005 | The second stage runs xattr -c on /tmp/helper before execution. |
| Masquerading | T1036 | Lures impersonate OpenAI Codex and Anthropic Claude Code installers. |
| Application Layer Protocol: Web Protocols | T1071.001 | Telemetry and payload retrieval use HTTP paths under attacker domains. |

## IOCs

### Domains

```
bright-links[.]com
trekmesh15[.]com
grove-12[.]com
swiftsaverfin[.]com
aspencore18[.]com
atlas-compass[.]com
grove-satin[.]com
quill-flint[.]com
parentpreneurx[.]com
vine-96[.]com
```

### Full URL Paths

```
sites.google[.]com/view/codex-desktop-app/
sites.google[.]com/view/codexmac
sites.google[.]com/view/cdx-off-page
swiftsaverfin[.]com/codexx/
trekmesh15[.]com/curl/ad4e26afb47dc6262d43b5616853349c3bbdab5c8eedac80f695151e00c07df8
grove-12[.]com/api/metrics/run?event=pasted
trekmesh15[.]com/zyeMb6slon_3VWVlkSkdiJurcyhY5cFNtchnavRnMgU/jetbrains/update
aspencore18[.]com/curl/0v95mzh95/y6jdnt8y1hu7bv33.dat
atlas-compass[.]com/api/metrics/run?event=pasted
aspencore18[.]com/2kqYRM0DCrnyJgoS4gVLl_FHJRRdTUhGCbjyuYwpZ6c/google/update
grove-satin[.]com/api/metrics/run?event=pasted
quill-flint[.]com/curl/2h0w4vtm7c/7b4cckfhojxjbrcjon.json
quill-flint[.]com/zyeMb6slon_3VWVlkSkdiJurcyhY5cFNtchnavRnMgU/jetbrains/updateAll
vine-96[.]com/curl/iojaglaf/t1f6kticgr6nt9nplkh.dat
vine-96[.]com/N_8qoQC3gmx9CFmwN9nMJ4QoUZtKZ1ua1ThNulPR4kU/Vert/update
```

### Splunk Format

```
"bright-links.com" OR "trekmesh15.com" OR "grove-12.com" OR "swiftsaverfin.com" OR "aspencore18.com" OR "atlas-compass.com" OR "grove-satin.com" OR "quill-flint.com" OR "parentpreneurx.com" OR "vine-96.com" OR "sites.google.com/view/codex-desktop-app" OR "sites.google.com/view/codexmac" OR "sites.google.com/view/cdx-off-page" OR "swiftsaverfin.com/codexx/" OR "event=pasted"
```

### File Hashes

```
e4e078458c025e0905d94f6d9a93439024e8f256b068d8e67da7f34ba1c93d27
684d4875a60e832c6993bb08bf0ec4fbd7ca89c1a44ba1ab65fac6d9fb202599
9c3a28c5b8b9ced508786aad723efb8105b9d20f61095b28556c3d89a5c00343
95d5ae5e87b4eae733655f6fc7bfdeb1efbc618d95375a46f6f8d353b48426dc
fcb74c3c5134a97b5bc90b2e0bad67a8e3044f769f844313e21069c7480d97cd
48db5d715c583b4495ee1e3095f097ed9bc04625e4516e1fa437fcb374fec249
1f252b86edddda142a69cf9059b67a4aa842f7fd8aedbfdd6937850138e3a63e
```

Cato's IOC tables also listed additional Mach-O hashes. Several published table cells did not parse as 64-character SHA-256, so those values are omitted rather than guessed.

## Detection Recommendations

In DNS, proxy, and TLS SNI logs, alert on the attacker-controlled hosts above. Do not denylist sites.google.com or google.com. Hunt the specific /view/codex-desktop-app, /view/codexmac, and /view/cdx-off-page paths.

On macOS EDR, alert when Terminal or zsh runs curl or similar piped into zsh, when a new Mach-O appears at /tmp/helper, when xattr -c runs against that path, or when npm install strings are concatenated with Base64 decode in one command line.

In web proxy logs, alert on requests containing /api/metrics/run?event=pasted, /curl/ first-stage paths, and update-themed paths containing jetbrains/update, google/update, or Vert/update on the domains above.

Correlate Google Ads clicks for Codex or Claude Code download queries with subsequent Terminal child processes on the same host.

## References

- [Cato Networks] Cato CTRL Insights: When Trust Becomes the Payload in a Fake Codex ClickFix Campaign (2026-08-24) — https://www.catonetworks.com/blog/cato-ctrl-when-trust-becomes-payload-in-fake-codex-clickfix-campaign/
- [The Register] Crooks push Mac malware through fake OpenAI Codex ads (2026-08-25) — https://www.theregister.com/security/2026/08/25/crooks-push-mac-malware-through-fake-openai-codex-ads/5291899
- [SiliconANGLE] Fake Codex installer tricks Mac users into pasting malware, Cato finds (2026-08-24) — https://siliconangle.com/2026/08/24/fake-codex-installer-tricks-mac-users-into-pasting-malware-cato-finds/
