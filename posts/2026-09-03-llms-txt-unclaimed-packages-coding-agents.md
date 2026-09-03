# llms.txt Guidance Files Direct Coding Agents to Unclaimed Packages; Live npm Malware on clerk-next-fix-auth-protection

**Date:** 2026-09-03
**Tags:** supply-chain, malware

## Executive Summary

Alon Hertz reported on 2026-08-26 that 8,565 llms.txt files across 6,214 live domains contained 237-plus install or setup commands pointing at unclaimed packages and domains, and that registering a subset produced phone-home callbacks from Fortune 500 networks within minutes via Claude, Codex, and Hermes. Hertz and Ars Technica separately documented live malware on npm package clerk-next-fix-auth-protection, catalogued as MAL-2026-11069, which Clerk docs had instructed agents to run via npx. Audit agent-facing docs for unregistered package names, pin installs, and block npm:clerk-next-fix-auth-protection.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Unclaimed llms.txt package and domain takeover; MAL-2026-11069 clerk-next-fix-auth-protection |
| Actor / Attribution | Hertz's beacons were researcher-controlled. The clerk-next-fix-auth-protection publisher is unnamed. Confidence none |
| Target | Organizations whose coding agents read vendor llms.txt and execute install commands |
| Vector | Official HTTPS llms.txt or llms-full.txt install lines; npx of an unscoped binary name that was never published by the vendor |
| Status | Researcher callbacks observed; Clerk has since changed docs per Ars Technica. MAL-2026-11069 remains the in-the-wild package record |
| First Observed | OSV published MAL-2026-11069 on 2026-07-24; Hertz published 2026-08-26; Ars Technica 2026-08-27 |

## Detailed Findings

According to [Alon Hertz](https://medium.com/@alonhertz1/data-became-code-we-ran-code-inside-fortune-500s-using-files-they-published-for-ai-agents-0cd67ffbbffc), companies publish llms.txt as an instruction set for AI agents, including which packages to install. Hertz stated the team resolved 8,565 files across 6,214 live domains and found 237-plus unclaimed artifacts spanning PyPI, npm, RubyGems, NuGet, crates.io, Packagist, expired domains, and abandoned PaaS subdomains. Hertz stated the names were correctly spelled first-party references, not typosquats.

Hertz reported registering a small set of those names on PyPI and npm with inert phone-home beacons. The first Fortune 500 callback arrived in under four minutes, with further callbacks from enterprises and startups. Parent-process data implicated Claude, Codex, and Hermes. Hertz stated a one-line prompt naming only a vendor, with no URL and no mention of llms.txt, was enough in test runs to send agents looking for that file and installing the unclaimed package.

[Ars Technica](https://arstechnica.com/security/2026/08/claude-codex-and-hermes-installed-unowned-code-inside-corporate-networks/) reported the same research on 2026-08-27, citing 120 sites and 227 install commands, and stating Anthropic, OpenAI, and Nous Research did not comment by publication.

Hertz and Ars Technica described a separate live case on clerk.com documentation: npx clerk-next-fix-auth-protection. Hertz stated the binary lives inside @clerk/eslint-plugin, but a bare npx resolves the unscoped name on the public registry, which Clerk never published. [OSV](https://osv.dev/vulnerability/MAL-2026-11069) records clerk-next-fix-auth-protection versions 7.7.7 and 8.8.8 as malicious. OSV states 8.8.8 ships no functional main file and that preinstall and postinstall curl http://u3ukeehm.requestrepo.com/depconf/clerk-next-fix-auth-protection/ with whoami, hostname, cwd, and timestamp. Ars Technica stated Clerk has since resolved the documentation issue. Do not denylist clerk.com or npmjs.com.

Hertz's researcher packages were beacons only. Company names in that experiment were withheld.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Unclaimed registry names printed in vendor llms.txt become attacker-controlled packages. |
| User Execution: Malicious File | T1204.002 | Coding agents execute pip, npm, or npx from documentation treated as ground truth. |
| Application Layer Protocol: Web Protocols | T1071.001 | MAL-2026-11069 beacons installer identity over HTTP to a requestrepo subdomain. |

## IOCs

### Domains

```
u3ukeehm.requestrepo[.]com
```

### Full URL Paths

```
u3ukeehm.requestrepo.com/depconf/clerk-next-fix-auth-protection/
```

### Splunk Format

```
"u3ukeehm.requestrepo.com" OR "u3ukeehm.requestrepo.com/depconf/clerk-next-fix-auth-protection/" OR "npm:clerk-next-fix-auth-protection@8.8.8" OR "npm:clerk-next-fix-auth-protection@7.7.7"
```

### File Hashes

```
No hash IOCs published by source
```

### Package Indicators

```
npm:clerk-next-fix-auth-protection@8.8.8
npm:clerk-next-fix-auth-protection@7.7.7
```

## Detection Recommendations

Inventory llms.txt and llms-full.txt on first-party and vendor domains. Resolve every pip, npm, npx, gem, nuget, and cargo name against the registry and flag names the organization does not own. Require agents to pin packages and to use npx --package @scope/name binary rather than a bare unscoped npx. Hunt DNS and proxy for u3ukeehm.requestrepo.com and npm installs of clerk-next-fix-auth-protection. Do not block requestrepo.com as an apex. Alert when claude, codex, or hermes is the parent of pip or npm installing a package first seen in the last hour.

## References

- [Alon Hertz] Data Became Code: We Ran Code Inside Fortune 500s Using Files They Published for AI Agents (2026-08-26) — https://medium.com/@alonhertz1/data-became-code-we-ran-code-inside-fortune-500s-using-files-they-published-for-ai-agents-0cd67ffbbffc
- [Ars Technica] Claude, Codex, and Hermes installed unowned code inside corporate networks (2026-08-27) — https://arstechnica.com/security/2026/08/claude-codex-and-hermes-installed-unowned-code-inside-corporate-networks/
- [OSV] MAL-2026-11069 clerk-next-fix-auth-protection (2026-07-24) — https://osv.dev/vulnerability/MAL-2026-11069
