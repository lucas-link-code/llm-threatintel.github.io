# Mini Shai-Hulud: @7nohe/openapi-react-query-codegen Publishes Ten Provenance-Valid Malicious npm Versions

**Date:** 2026-09-03
**Tags:** supply-chain, malware, mcp-security

## Executive Summary

Socket reported on 2026-08-28 that ten versions of npm package @7nohe/openapi-react-query-codegen were published with a Mini Shai-Hulud-consistent installer payload, including 3.0.4 which still resolved as latest at write-up time. A comment-triggered GitHub Actions publish workflow let an untrusted account comment npm publish on a pull request and ship fork code under trusted OIDC provenance. Isolate hosts that installed 0.5.4, 0.5.5, 1.6.3, 1.6.4, 2.2.1, 2.2.2, 3.0.3, 3.0.4, or the two 0.0.0 prereleases, pin to 0.5.3, 1.6.2, 2.2.0, or 3.0.2, and do not trust npm audit signatures for this set.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud-consistent compromise of @7nohe/openapi-react-query-codegen |
| Actor / Attribution | Socket described Mini Shai-Hulud overlap and did not treat behavioral similarity as proof of TeamPCP operators. Confidence low |
| Target | npm consumers of a package with about 150,000 weekly downloads; AI agent config and CI secrets on developer and runner hosts |
| Vector | Malicious tarballs via npm install. Wave 1 uses binding.gyp to launch node 3FWCvzduYZg.js; wave 2 also sets preinstall |
| Status | Active as of Socket 2026-08-28; latest tag pointed at 3.0.4 |
| First Observed | Malicious versions published 2026-08-28 in two waves about twenty minutes apart |

## Detailed Findings

According to [Socket](https://socket.dev/blog/openapi-react-query-codegen-npm-compromise), ten malicious versions of @7nohe/openapi-react-query-codegen were published on 2026-08-28 with valid npm provenance attestations from GitHub Actions trusted publishing. Socket listed 0.0.0-365d4eb738d3146583431948d3ba6e27a32556be, 0.0.0-ec7876d6c917dad516ba69bbfafc948b834bf0ab, 0.5.4, 0.5.5, 1.6.3, 1.6.4, 2.2.1, 2.2.2, 3.0.3, and 3.0.4. Last known-good per line: 0.5.3, 1.6.2, 2.2.0, 3.0.2.

Socket reported the loader 3FWCvzduYZg.js as a roughly 5.7 MB XOR-obfuscated file that decrypts an AES-128-GCM second stage. Wave-1 versions execute through binding.gyp via an obfuscated Python os.system call to node 3FWCvzduYZg.js. Wave-2 adds preinstall. Socket stated release.yml triggers on issue_comment created when the comment body is npm publish, checks out the pull-request head from the fork, and publishes with id-token write. Commenter association is not checked. Provenance then records refs/heads/main at clean commit d42d1733.

Socket recovered credential harvesting from files, process memory, cloud metadata, and CI variables; GitHub, npm, PyPI, RubyGems, and JFrog token validation; encrypted exfil to attacker-created public GitHub repos with description Trinitite: Sponsored by Preview 2 Effects; package poisoning; GitHub Actions workflow named ClaudeCode Review that dumps secrets to an artifact; persistence in Claude, Cursor, Codex, Gemini, Copilot, and MCP config; a signed GitHub-commit command channel searching firedalazer; and SSH propagation. Persistence paths include ~/.local/bin/sysvinit-detect-fash.sh and LaunchAgent com.user.sysvinit-detect-fash. Socket warned the token monitor evals a handler on GitHub HTTP 4xx, so contain the host before revoking the watched token.

Socket attributed the staging fork to github.com/p00paboot/openapi-react-query-codegen. Socket said overlap with Shai-Hulud and Mini Shai-Hulud is not operator proof. [The Hacker News](https://thehackernews.com/2026/09/russia-aligned-uac-0099-plants-nuclear.html) also noted this Socket and Step Security package on 2026-09-01.

Do not add github.com, registry.npmjs.org, or api.github.com as indicators.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Ten malicious versions published to npm under valid provenance. |
| Command and Scripting Interpreter: Python | T1059.006 | binding.gyp uses Python os.system to launch the Node loader. |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Install-time Node loader 3FWCvzduYZg.js decrypts and runs the second stage. |
| Unsecured Credentials | T1552 | Filesystem, memory, CI, and cloud-metadata credential scraping. |
| Account Manipulation | T1098 | GitHub workflow rewrite dumps repository secrets to an artifact named reviewed. |
| Ingress Tool Transfer | T1105 | SSH copy of ai_setup.sh and ai_init.js to reachable hosts. |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
github.com/p00paboot/openapi-react-query-codegen
github.com/p00paboot
```

### Splunk Format

```
"github.com/p00paboot/openapi-react-query-codegen" OR "github.com/p00paboot" OR "npm:@7nohe/openapi-react-query-codegen@3.0.4" OR "3FWCvzduYZg.js" OR "b49afb7dba04cd99b357ce7c652c823a3707f28e130bd5c6645851a7adc030d6"
```

### File Hashes

```
b49afb7dba04cd99b357ce7c652c823a3707f28e130bd5c6645851a7adc030d6
59370c67b54a0ccaedd265e2356f04540b2fba1e1845300ef6de4d5437d99380
d3246926b20a8d021ed7de0ac8e9eee1dda986088f84ba18f31cb2042a121f5d
```

### Package Indicators

```
npm:@7nohe/openapi-react-query-codegen@0.0.0-365d4eb738d3146583431948d3ba6e27a32556be
npm:@7nohe/openapi-react-query-codegen@0.0.0-ec7876d6c917dad516ba69bbfafc948b834bf0ab
npm:@7nohe/openapi-react-query-codegen@0.5.4
npm:@7nohe/openapi-react-query-codegen@0.5.5
npm:@7nohe/openapi-react-query-codegen@1.6.3
npm:@7nohe/openapi-react-query-codegen@1.6.4
npm:@7nohe/openapi-react-query-codegen@2.2.1
npm:@7nohe/openapi-react-query-codegen@2.2.2
npm:@7nohe/openapi-react-query-codegen@3.0.3
npm:@7nohe/openapi-react-query-codegen@3.0.4
```

## Detection Recommendations

Search lockfiles and SBOMs for the ten versions. Isolate affected workstations and runners before revoking GitHub tokens, because the sysvinit-detect-fash monitor evals on HTTP 4xx. Disable com.user.sysvinit-detect-fash and sysvinit-detect-fash.service, then rotate npm, GitHub, cloud, PyPI, RubyGems, and JFrog credentials. Hunt GitHub for public repos with description Trinitite: Sponsored by Preview 2 Effects, workflow ClaudeCode Review, commit chore: update dependencies, and artifacts named reviewed. Hunt 3FWCvzduYZg.js hashes and binding.gyp hash d3246926b20a8d021ed7de0ac8e9eee1dda986088f84ba18f31cb2042a121f5d. Maintainers must not publish on issue_comment gated only by comment text.

## References

- [Socket] OpenAPI React Query Codegen Compromised in Mini Shai-Hulud npm Supply Chain Attack (2026-08-28) — https://socket.dev/blog/openapi-react-query-codegen-npm-compromise
- [The Hacker News] Russia-Aligned UAC-0099 Plants Nuclear Weapon Prompt in Malware to Disrupt AI Analysis (2026-09-01) — https://thehackernews.com/2026/09/russia-aligned-uac-0099-plants-nuclear.html
