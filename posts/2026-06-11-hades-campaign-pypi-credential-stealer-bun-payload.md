# Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

**Date:** 2026-06-11
**Tags:** supply-chain, malware, model-poisoning

## Executive Summary

On June 8, 2026, version 0.8.101 of the popular graph machine learning package ensmallen on PyPI was identified as containing a highly sophisticated supply chain compromise. Concurrently, a series of related packages in the computational biology, bioinformatics, and genotype-phenotype analysis ecosystem were also found to carry the identical malicious payload. This operation, which we are tracking as the Hades Campaign, uses a self-contained Bun executable to execute a multi-layer payload silently on package import. Attackers are now writing payloads that target the cognitive logic of automated AI triage systems. Scanners that pass raw text to LLMs without strict boundary isolation can be coerced into generating false negative verdicts, allowing the malicious package to bypass organization analysis.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Hades Campaign / Shai-Hulud Evolution |
| Attribution | Miasma/Mini Shai-Hulud threat lineage; possible copycat actors leveraging open-sourced toolkit (confidence: medium) |
| Target | Python developers in bioinformatics, graph ML, deep-learning, AI/ML communities; MCP developers |
| Vector | Malicious Python wheels published to PyPI with startup-hook (.pth file) execution at interpreter initialization |
| Status | active |
| First Observed | 2026-06-08 |

## Detailed Findings

Hades, a new PyPI branch of the Mini Shai-Hulud/Miasma supply chain campaign, hit 37 malicious wheels across 19 packages. The Miasma supply chain campaign has sparked a fresh attack wave called Hades, this time involving 37 malicious wheel artifacts across 19 packages in the Python Package Index (PyPI) registry. The compromised releases shipped a *-setup.pth file that attempts to execute automatically during Python startup, download the Bun JavaScript runtime, and run an obfuscated JavaScript payload named _index.js. The compromised releases shipped a *-setup.pth file that attempts to execute automatically during Python startup, download the Bun JavaScript runtime, and run an obfuscated JavaScript payload named _index.js. Like in the previous Shai-Hulud and Miasma campaigns, the malicious payload downloads and installs the Bun JavaScript runtime, which is then used to launch a heavily obfuscated JavaScript stealer that can harvest a wide range of data from developer systems. This includes secrets associated with GitHub, npm, PyPI, RubyGems, JFrog, CircleCI, Anthropic, AWS, GCP, Azure, and Kubernetes, along with Docker configurations, Vault tokens, SSH keys, shell history. A "gh-token-monitor" persistence daemon threatens destructive actions if stolen tokens are revoked, a novel extortion mechanism designed to discourage immediate credential rotation. The payload also contains prompt-injection text aimed at tricking LLM-based security analyzers into classifying it as benign, and it sends decoy traffic to Anthropic AI servers to confuse network-level analysis. The expanded campaign now targets MCP (Model Context Protocol) developers, bioinformatics researchers, and Python developers who use popular frameworks such as LangChain, Flask, and OpenAI tooling.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Compromised package repository (PyPI) distributes malicious Python wheels as legitimate packages |
| Code Execution at Startup | T1547.004 | Python .pth file mechanism executes malicious code during Python interpreter initialization without package import |
| Credential Dumping | T1110.004 | Malware harvests credentials across GitHub, cloud providers, package repositories, and local development environments |
| Defense Evasion | T1140 | Prompt injection text embedded in payload to trick LLM-based security scanners; obfuscated JavaScript stealer with AES-256-GCM encryption |

## IOCs

### Domains

_Socket and StepSecurity identified 37 malicious PyPI wheel artifacts across 19 packages; updated second wave identified 23 additional artifacts targeting MCP developers (June 9, 2026)_

### Full URL Paths

_Socket and StepSecurity identified 37 malicious PyPI wheel artifacts across 19 packages; updated second wave identified 23 additional artifacts targeting MCP developers (June 9, 2026)_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
ensmallen (0.8.101)
bramin (0.0.2, 0.0.3, 0.0.4)
cmd2func (0.2.2, 0.2.3)
coolbox (0.4.1, 0.4.2)
dynamo-release (1.5.4)
executor-engine (0.3.4, 0.3.5)
executor-http (0.1.3, 0.1.4)
funcdesc (0.2.2, 0.2.3)
magique (0.6.8, 0.6.9)
langchain-core-mcp (1.4.2 variant)
spateo-release
gpt-pilot (compromised co-founder account)
```

## Detection Recommendations

Treat any host that installed a malicious wheel as potentially exposed, even if the package was never imported. Assume credential compromise and rotate anything reachable from the affected environment, especially: GitHub personal access tokens, GitHub App credentials, Actions secrets, Cloud keys and short-lived role credentials where applicable, Artifact and publishing tokens (PyPI, npm, RubyGems, JFrog). Monitor for Python .pth file creation outside of standard library paths. Detect Bun runtime downloads from GitHub URLs within Python subprocess contexts. Flag systemd user service creation or LaunchAgent installation by Python processes. Implement software bill-of-materials (SBOM) scanning to detect transitive dependencies on affected packages. Use package signature verification and pinning to prevent unpinned dependency resolution of malicious versions. Scan for prompt-injection text patterns in package payloads and code review tools.

## References

- [StepSecurity] The Hades Campaign: Graph ML PyPI Packages Deploy Cross-Platform Memory Scrapers, AI Analyst Misdirection, and a Wiper Deterrent (2026-06-08) — https://www.stepsecurity.io/blog/the-hades-campaign-pypi-packages
- [The Hacker News] Hades PyPI Attack: 19 Packages Poisoned to Auto-Run Bun Credential Stealer (2026-06-09) — https://thehackernews.com/2026/06/hades-pypi-attack-19-packages-poisoned.html
- [Socket] Shai-Hulud Descends to Hades: Miasma Worm Campaign Spreads (2026-06-07) — https://socket.dev/blog/shai-hulud-descends-to-hades-miasma-pypi-wave
- [Orca Security] Hades PyPI Supply Chain Attack (2026-06-08) — https://orca.security/resources/blog/hades-pypi-supply-chain-attack/
