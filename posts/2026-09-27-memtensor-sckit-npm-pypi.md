# MemTensor OpenClaw Plugin and MemoryOS Launch the sckit Credential Stealer

**Date:** 2026-09-27
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

Socket published on 2026-09-23 that malicious releases of npm package @memtensor/memos-cloud-openclaw-plugin versions 0.1.21, 0.1.23, and 0.1.25, and PyPI package MemoryOS 2.0.34, start a Go implant named sckit. The implant searches the home directory for registry, cloud, and SSH secrets and calls hosts under skyleen.fr. The npm plugin also passes the user prompt into sckit on each memory recall. The Hacker News later reported those malicious versions removed from both registries. Pin npm to 0.1.20 or the clean 0.1.24 build, pin PyPI to 2.0.33, rotate secrets from any host that loaded the bad versions, and block skyleen.fr.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | sckit. Embedded campaign strings cloud-openclaw-semi-nuclear on npm and memos-semi-nuclear on PyPI. Schema sckit.runtime.v1. Profile semi-nuclear |
| Actor / Attribution | Unknown. Socket could not confirm how publish rights were obtained. The Hacker News, citing SafeDep, said commits caused MemTensor GitHub Actions release workflows to hand over npm or PyPI tokens. Socket said the npm publishes lacked gitHead and were not from that project CI. Those accounts are not reconciled. Confidence in a specific access path: low |
| Target | Developers, CI runners, and OpenClaw agents that install MemTensor MemOS memory packages |
| Vector | Compromised releases of two legitimate MemTensor packages, one on npm and one on PyPI |
| Status | Malicious versions removed from npm and PyPI per a later update on The Hacker News article. Hosts that already loaded them remain compromised until secrets are rotated and sckit is removed |
| First Observed | 2026-09-23 |

## Detailed Findings

According to [Socket](https://socket.dev/blog/memtensor-compromise), MemTensor MemOS is an open source memory framework for LLMs and agents. The main GitHub repository had about 11,500 stars. On 2026-09-23 a publisher pushed three bad npm versions of @memtensor/memos-cloud-openclaw-plugin and PyPI MemoryOS 2.0.34. At the time Socket wrote, npm 0.1.25 was tagged latest and PyPI 2.0.34 was the latest release, so a default install pulled the implant. Socket later times, all UTC: last known good npm 0.1.20 on August 3 at 06:46. Last pre incident PyPI 2.0.33 on September 3 at 11:30. Malicious plugin commit e0c1ca3 at 00:48 on September 23, authored as Memtensor-AI. npm 0.1.21 at 02:23. MemOS commit b52958f at 03:17, authored as MemTensor CI Review. npm 0.1.22 at 03:45, contents match 0.1.20 aside from version strings. npm 0.1.23 at 03:49. npm 0.1.24 at 04:33, also clean aside from version strings. npm 0.1.25 at 04:36, tagged latest. MemoryOS 2.0.34 wheel and sdist at 05:25.

Socket said neither malicious commit was referenced by a branch or tag at the time of writing. npm releases came from the same account as earlier legitimate releases, leason1974, but without a gitHead, which Socket reads as not published by the project CI workflow. Socket did not confirm how registry publish access was gained.

[The Hacker News](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html) on 2026-09-23 summarized Socket, and also Aikido, SafeDep, and StepSecurity. StepSecurity, as quoted there, said the npm launcher runs when the OpenClaw gateway starts and again when the plugin handles a memory recall, and that the launcher passes the host environment plus the user prompt. SafeDep, as quoted there, said the attacker obtained publish tokens from MemTensor GitHub Actions release pipelines by pushing commits that caused the workflow to yield the npm or PyPI token, and that sckit can receive signed tasks and contains templates to install itself into npm packages, Python packages, and GitHub Actions workflows. Socket's own text is narrower on that last point: recovered strings suggest the binary can encode manifests and install repository files, which may allow republish with stolen tokens, and Socket had not shown other packages impacted. The Hacker News access path and Socket's missing gitHead are both in print. This feed does not pick one as proven.

Socket's static analysis, without executing the samples, describes the same launcher shape on both registries. npm adds `lib/sckit.js`, imported from `index.js`. `launchStageZero()` spawns the matching `.sckit` binary detached with arguments `stage0` and `--config64`, copies `process.env`, and sets `SCKIT_EVENT_TEXT` to the prompt on recall. Version 0.1.25 also ships `.sckit/ca-roots.pem` and `lib/tls-trust.js`. On PyPI, `memos/log.py` calls `memos._stage0.trigger()` from `configure_logging()`. Socket counted 149 modules that call `get_logger()` at import, including a module imported by `memos/__init__.py`, so `import memos` is enough. The PyPI wheel grew from 951,210 bytes at 2.0.33 to 19,201,772 bytes at 2.0.34 because of six bundled binaries. The sdist replaces the Poetry build backend with `sckit_poetry_build.py` and ships `memos/_pypi_bridge.sh` and `memos/_initial_ci_delivery.py`, which Socket says target the release pipeline rather than end users.

The Go binary is stripped and statically linked. npm and PyPI builds differ in hash and config but share schema `sckit.runtime.v1`, profile `semi-nuclear`, and parent domain skyleen.fr. npm state directory is `$HOME/.openclaw/.cache/runtime` with campaign `cloud-openclaw-semi-nuclear`. PyPI state directory is `$HOME/.memos/.cache/runtime` with campaign `memos-semi-nuclear`. Config `not_after` is 2026-10-22. Each C2 host exposes `/config`, `/status`, and `/batch` under a 24 character hex prefix. Socket published the host labels and one full CI URL, not every 24 hex prefix, so this feed does not invent the other paths. Targeted files include `.npmrc`, `.vault-token`, `id_ecdsa`, `credentials.db`, `access_tokens.json`, and `stored_tokens`. Named environment variables include `NPM_TOKEN` and `PYPI_API_TOKEN`. Format hunts cover AWS keys, GitHub and GitLab tokens, npm and PyPI tokens, Hugging Face, Vault, Slack, Stripe, SendGrid, and JWTs.

A later update on the same Hacker News article said the malicious versions were taken down from npm and PyPI, and named @memtensor/memos-cloud-openclaw-plugin 0.1.24 and MemoryOS 2.0.33 as the latest clean versions. That matches Socket's finding that 0.1.22 and 0.1.24 were clean interleaves, with 0.1.20 the last good release before the bad series. Treat any host that loaded 0.1.21, 0.1.23, 0.1.25, or MemoryOS 2.0.34 as compromised even after the registry takedown.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Bad versions of a legitimate npm plugin and a legitimate PyPI package |
| Command and Scripting Interpreter: JavaScript | T1059.007 | `lib/sckit.js` spawns the Go binary on gateway start and on memory recall |
| Command and Scripting Interpreter: Python | T1059.006 | `import memos` reaches `_stage0.trigger()` through logging setup |
| Unsecured Credentials: Credentials In Files | T1552.001 | Home directory search for npm, Vault, SSH, and token files |
| Unsecured Credentials | T1552 | Process environment is copied into sckit, including NPM_TOKEN and PYPI_API_TOKEN |
| Application Layer Protocol: Web Protocols | T1071.001 | HTTPS to skyleen.fr hosts on /config, /status, and /batch |
| Exfiltration Over C2 Channel | T1041 | Credential material reported to those C2 hosts |
| Obfuscated Files or Information | T1027 | Stripped static Go binaries and a base64 JSON config argument |

## IOCs

Display domains and URL paths are defanged. JSON stores clean values. Do not denylist npmjs.com, pypi.org, or github.com.

### Domains

```
skyleen[.]fr
8a8acaf167b3[.]skyleen[.]fr
0b48fafd6fbe[.]skyleen[.]fr
266297c6df27[.]skyleen[.]fr
c747d139e7e9[.]skyleen[.]fr
73376a079d87[.]skyleen[.]fr
d4f77a3a8cb0[.]skyleen[.]fr
10729e014d0e[.]skyleen[.]fr
```

### Full URL Paths

```
10729e014d0e[.]skyleen[.]fr/eb57efaa7365698fc1e4decc/initial-ci-v2
```

### Splunk Format

```
"skyleen.fr" OR "8a8acaf167b3.skyleen.fr" OR "0b48fafd6fbe.skyleen.fr" OR "266297c6df27.skyleen.fr" OR "c747d139e7e9.skyleen.fr" OR "73376a079d87.skyleen.fr" OR "d4f77a3a8cb0.skyleen.fr" OR "10729e014d0e.skyleen.fr" OR "10729e014d0e.skyleen.fr/eb57efaa7365698fc1e4decc/initial-ci-v2" OR "npm:@memtensor/memos-cloud-openclaw-plugin@0.1.21" OR "npm:@memtensor/memos-cloud-openclaw-plugin@0.1.23" OR "npm:@memtensor/memos-cloud-openclaw-plugin@0.1.25" OR "pypi:MemoryOS@2.0.34"
```

### File Hashes

```
39ee644406829a4b630b31759c20478bc22d576d6a59b253ed86f72c360aa5ef
92b46d18fc553c494eda714f204459edb74c205bf53b18a9092bcf02c7a6c5be
381ac6dc1715d9298fe81b2a53a11f7b7d78e361ee3a6619ad54f8c4b062cc18
e077c387b223811064b7bbc5a55a0182fca9bf50894f949ff284d4be87d44b26
65faf8ccbcf5b34eb4f72c71bf82815fa9c1e2f947b9c898491540e866132c31
f8ccdd1da7dff1aef16377a2842bc7acf7c516e32122dd6e42dc4a4e57653fce
56cd3416d2ec2aa7e7cec2a06010cf0b58eb09c0a5486809df52afeaca8f14be
d6b3e77c36ee8017c9bf30d1da7218ec0ea843768d313eb8e35845c8a9b38a26
c1b0998347b489582bae7b7f4930f9831d9ef4b6bc150cfd488ee1a43272dd36
8f647f17a1934679c4095e21bee2b9bd83e28476603758bc91408a0c8443e3b4
9de0d5b0ca184f71f630be5781d134998883a02d5d7bc65aeb9559d8f9efb364
5405e330507602e803f7dd6f2a9d4555aec8558ab222b51413594a962da6888a
16de381deb978744535b10f68fe15165251374b86eef18ffc2c47f61ea673047
f7c4014e284f3d56c452b8b222a287c54f73dc4a40a7e022e765ac8376362947
```

### Package Indicators

```
npm:@memtensor/memos-cloud-openclaw-plugin@0.1.21
npm:@memtensor/memos-cloud-openclaw-plugin@0.1.23
npm:@memtensor/memos-cloud-openclaw-plugin@0.1.25
pypi:MemoryOS@2.0.34
```

## Detection Recommendations

Search lockfiles, `requirements*.txt`, `poetry.lock`, `uv.lock`, and SBOMs for @memtensor/memos-cloud-openclaw-plugin at 0.1.21, 0.1.23, or 0.1.25, and for MemoryOS at 2.0.34. Versions 0.1.20, 0.1.22, and 0.1.24 are the clean npm builds Socket compared. Do not treat every 0.1.2x release as bad.

On endpoints and CI, alert on a process named sckit or sckit.exe whose command line contains `stage0` and `--config64`, or on environment variable `SCKIT_EVENT_TEXT`. Delete `$HOME/.openclaw/.cache/runtime/` and `$HOME/.memos/.cache/runtime/` on affected accounts. Block DNS and TLS SNI for skyleen.fr and the seven host labels below it. The only full path Socket published is `10729e014d0e.skyleen.fr/eb57efaa7365698fc1e4decc/initial-ci-v2`. Other C2 paths are `/config`, `/status`, and `/batch` under a per host 24 hex prefix that was not fully published.

If a bad version loaded, rotate npm and PyPI tokens, GitHub and GitLab tokens, AWS keys, Vault tokens, SSH keys, and Hugging Face, Slack, Stripe, and SendGrid keys reachable from that home directory or environment. For the npm plugin, assume prompts handled during the bad version were copied into sckit. If that host held a publish token, review packages you did not intend to release. Hash match the wheel, sdist, and twelve sckit binaries above.

## References

- [Socket] MemTensor npm and PyPI Packages Compromised in Credential-Stealing Supply Chain Attack (2026-09-23): https://socket.dev/blog/memtensor-compromise
- [The Hacker News] Compromised MemTensor Packages Deliver sckit Credential Stealer via npm and PyPI (2026-09-23): https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html
