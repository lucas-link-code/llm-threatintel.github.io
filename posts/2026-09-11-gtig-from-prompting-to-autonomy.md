# GTIG: Adversaries Move From Prompting to Agentic Workflows; UNC6780 Poisons AI Coding Assistants and LLM Scanners

**Date:** 2026-09-11
**Tags:** supply-chain, apt, nation-state, llmjacking, mcp-security

## Executive Summary

Google Threat Intelligence Group published on 2026-09-08 that Q2 2026 activity shows a shift from chat-style prompting to agentic workflows that cut human-in-the-loop delay, including a financially motivated actor that planned, built, and ran a mass credential harvest from a compromised cloud account in under six hours. GTIG also reported that UNC6780, also tracked as TeamPCP, used more than half a dozen methods to trick AI coding assistants and LLM security scanners during open source supply chain compromises, including DUSTMAKER workspace hooks, forged SLSA attestations, and weapons-themed comments meant to make scanners refuse. Hunt PyPI package tiktoken_mcp, hidden .claude, .vscode, and .cursor workspace files, and GitHub Actions tasks named like Copilot Setup.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GTIG AI Threat Tracker Q2 2026; DUSTMAKER credential stealer; Recon harvesting dashboard |
| Actor / Attribution | UNC6780 / TeamPCP for the supply chain cluster, confidence high per GTIG. Separate unnamed financially motivated actor for the six-hour harvest. PRC-nexus UNC6508 for proprietary AI IP theft. Additional named clusters below. |
| Target | Developers and AI coding assistants; LLM scanners; proprietary models, prompts, and research in healthcare, government, media; cloud AI quotas |
| Vector | Trojanized MCP packages and GitHub repos, CI OIDC token theft, workspace prompt injection, agent instruction markdown, infostealer rules against AI config files |
| Status | Active. Google said it disabled associated assets and updated Gemini classifiers |
| First Observed | UNC6780 supply chain activity since March 2026; this tracker covers Q2 2026 and was published 2026-09-08 |

## Detailed Findings

According to [Google Threat Intelligence Group](https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai), adversaries are moving from basic prompting to multi-agent frameworks that manage scanning pipelines, recover from errors, and harvest credentials with less operator delay. GTIG said a suspected financially motivated actor compromised cloud infrastructure, then used an AI coding chatbot, a prompt, and agent instruction files as playbooks to scan and harvest thousands of third-party credentials in under six hours, including IP rotation without a human at each step. Traffic originated from the victim's own cloud addresses.

GTIG reported an exposed C2 host for a framework dubbed Recon. Directory listings showed AGENTS.md, KNOWLEDGE.md, agentic_vuln_research.md, .openclaw/, and memory/. The same host later presented a live dashboard that organized more than 23,800 harvested secrets, including cloud and AI API keys. GTIG published no domain or IP for that host.

### UNC6780 and DUSTMAKER

GTIG said UNC6780 has run large PyPI, npm, and Docker Hub supply chain compromises since March 2026, then sold stolen data or handed access to ransomware and extortion partners. In one Mandiant case, UNC6780 got in, then a second actor issued a LAPSUS-branded ransom demand after UNC6780 planted a malicious GitHub Actions workflow in a proprietary AI repository and the extortion actor stole a copy of that repository.

GTIG listed UNC6780 methods aimed at AI coding assistants and developers:

- Compromised developer accounts published trojanized MCP server forks to PyPI, including tiktoken_mcp, and injected code into official GitHub repositories such as azure-functions-mcp-extension so payloads and workspace hooks arrived when those assets were cloned or installed.
- DUSTMAKER, when running on a GitHub Actions runner, pulled OIDC tokens from process memory and used them as a trusted publisher so compromised packages carried valid SLSA Build 3 attestations that pass automated agent trust checks.
- DUSTMAKER dropped or changed files in hidden AI and IDE directories such as .claude/, .vscode/, and .cursor/ and used those files as startup or build hooks.
- Malicious config instructed the assistant to run attacker scripts such as setup.mjs during ordinary developer work.
- In CI, DUSTMAKER created pipeline tasks with AI-themed names such as Copilot Setup, hunted extra tokens, then deleted workflow logs through the GitHub API.
- JavaScript loaders named _index.js carried comment-block prompts with biological and nuclear weapons text, which GTIG assessed as an attempt to make LLM security scanners refuse and skip the malicious code. This feed does not reproduce that comment block.

GTIG assessed that public release of UNC6780 malware will drive copycats.

### AI assets as the objective

GTIG said it did not see tracked espionage or information-operations actors attack frontier models directly in Q2 2026, but it did see theft of proprietary models, skills, prompts, source, and research. UNC6508, a PRC-nexus actor, targeted academic, medical, and military research in North America and was seen deploying local open-weight models in stolen cloud so work stayed off commercial API monitors. Mandiant also handled extortion cases in healthcare and AI media generation where stolen model assets were the leverage.

GTIG reported distillation campaigns against Google models exceeding 100 million prompts, using proxies and rotating stolen credentials. Google said it degrades student-model utility and traces Gemini-distilled models.

### Other actor use of Gemini and commercial LLMs

GTIG mapped Gemini misuse across named clusters. BASIN CASTLE, previously BASIN and TEMP.Hex, used models for target profiling, lure translation, malware obfuscation, and PowerShell troubleshooting. CALANQUE ION, previously APT42, used models for OSINT, lure localization, licensing reverse engineering, and summarizing stolen data. RAVINE CASTLE, previously COULEE and APT24, used models for ministry targeting, VMware vCenter SAML bypass research, and Kerberos ticket attacks. DPRK IT-worker clusters bulk-registered LLM APIs on hijacked accounts and generated fake resumes. SANDWORM RELIC, previously FROZENBARENTS, SANDWORM, and APT44, used AI-themed phishing domains and Gemini-written password-spray scripts against Ukraine. UNC6240, also known as ShinyHunters, used Claude Code and custom MCP tools to parse stolen directories. MIDNIGHT NEPTUNE, formerly UNC1069, used DeepSeek-Coder for Python RATs and poisoned Claude CLI hooks with the SOMBERMEME backdoor. A PRC-nexus espionage group used CC Switch to rotate Claude, Gemini, and Codex while wiring Burp Suite, the Phalanx pentest framework, and Shai-Hulud for post-exploitation. GTIG said a related pentest-framework build stayed at the attempt stage and that Google disabled those assets.

GTIG also said ACRSTEALER controllers in May 2026 issued file-grabber rules for Cline secrets.json and Continue AI config.yaml. Underground prices for Claude, Gemini, Cursor Pro, and Devin accounts more than doubled in 2026 per GTIG forum tracking.

GTIG published no domains, IPs, or hashes for the six-hour harvest, Recon, or the named espionage clusters in this paper. The only machine-actionable package name in the AI-assistant table is tiktoken_mcp on PyPI. The GitHub repository azure-functions-mcp-extension was named without an organization path, so it is not added as an IOC.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | UNC6780 published trojanized MCP packages and poisoned GitHub repos consumed by coding agents |
| Subvert Trust Controls | T1553 | DUSTMAKER minted SLSA Build 3 attestations with stolen GitHub Actions OIDC tokens |
| Event Triggered Execution | T1546 | Hidden .claude, .vscode, and .cursor files ran attacker scripts when the workspace opened |
| Unsecured Credentials: Credentials In Files | T1552.001 | Harvest of AI config stores, OIDC tokens, and 23,800-plus secrets on the Recon dashboard |
| Valid Accounts | T1078 | Stolen cloud and AI accounts used for harvest, distillation, and LLMjacking |
| Resource Hijacking | T1496 | Victim cloud used for unauthorized high-performance AI workloads |
| Obfuscated Files or Information | T1027 | Weapons-themed comments in JS loaders aimed at LLM scanner refusal |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"tiktoken_mcp" OR "pypi:tiktoken_mcp" OR "setup.mjs" OR "Copilot Setup"
```

### File Hashes

```
No hash IOCs published by source
```

### Package Indicators

```
pypi:tiktoken_mcp
```

## Detection Recommendations

Alert on pip or uv installs of tiktoken_mcp and on clones of MCP-themed forks from unexpected maintainers. Hunt GitHub Actions logs for OIDC token use followed by package publish, then workflow-log deletion, especially jobs named Copilot Setup or similar AI utility labels. On developer endpoints, alert when new files appear under .claude/, .cursor/, or .vscode/ that invoke node, python, or curl during folder open or SessionStart. Treat LLM scanner refusals on JS loaders that mention weapons topics as a fail-closed cue: continue with static and sandbox analysis. In cloud audit logs, hunt a first-seen compute or Gemini/Vertex enablement after a GitHub PAT compromise, Artifact Registry images for LiteLLM or Manus, and Cloud Run services bound to allUsers. Monitor infostealer configs for Cline secrets.json and Continue config.yaml collection.

## References

- [Google Threat Intelligence Group] GTIG AI Threat Tracker: From Prompting to Autonomy – The Evolution of Adversarial AI (2026-09-08) — https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
