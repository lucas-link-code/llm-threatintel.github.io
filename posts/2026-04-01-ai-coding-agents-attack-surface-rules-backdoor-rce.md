# AI Coding Agents Under Attack: Rules File Backdoor, Cursor RCE, and Copilot Repository Takeover

**Date:** 2026-04-01
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malicious-tool, shadow-ai

## Executive Summary

Multiple critical vulnerabilities in AI coding assistants expose enterprise development environments to supply chain compromise. The Rules File Backdoor attack uses invisible Unicode characters to inject malicious prompts into Cursor and GitHub Copilot configuration files, with 12% of scanned rules files from GitHub containing hidden instructions. CVE-2026-31854 enables arbitrary code execution in Cursor through prompt injection and whitelist bypass, and Orca Security's RoguePilot demonstrated full GitHub repository takeover through passive prompt injection in Copilot. With 97% of enterprise developers using AI coding tools, these attack vectors represent a significant and largely unmonitored threat surface.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI Coding Agent Attack Surface (multiple vectors) |
| Attribution | Unknown (confidence: none) |
| Target | Software developers and enterprise development environments using AI coding assistants |
| Vector | Poisoned configuration files, indirect prompt injection, malicious websites, GitHub Issues |
| Status | active |
| First Observed | 2025-12 |

## Detailed Findings

Pillar Security disclosed the Rules File Backdoor attack in early 2026, demonstrating how attackers inject hidden malicious instructions into AI coding assistant configuration files. The attack exploits Unicode Tag Characters in the range U+E0001 to U+E007F, which render as invisible in text editors and terminal output but are processed by LLMs during inference. Malicious prompts encoded with these characters instruct the AI to generate code containing vulnerabilities, backdoors, or data exfiltration logic. Because rule files are commonly shared across repositories and developer communities, they are rarely scrutinized before integration.

AgentSeal conducted an audit of 50 Cursor rules files from public GitHub repositories and found 6 contained hidden instructions, a 12% infection rate. The research identified two primary obfuscation techniques: Unicode Tag Characters for complete instruction hiding, and zero-width characters including U+200B zero-width spaces and U+200D zero-width joiners to obfuscate sensitive paths and break up keywords that might trigger security filters. Both techniques remain readable to LLM tokenizers while being invisible to human reviewers and standard diff tools.

CVE-2026-31854, rated CVSS 8.8 High, affects Cursor versions up to 1.4.5. The vulnerability allows arbitrary code execution through prompt injection combined with whitelist bypass. When a user visits a malicious website through Cursor's built-in browser, crafted instructions on the page can cause the Cursor Agent to execute OS commands without user consent, even when Auto-Run Mode is configured to use an allowlist. The root cause is CWE-78, improper neutralization of special elements in OS commands. Anysphere patched this in Cursor version 2.0.

Orca Security's Research Pod disclosed RoguePilot, a passive prompt injection vulnerability in GitHub Copilot operating within Codespaces. Attackers embed malicious instructions in GitHub Issues using hidden HTML comment tags that are invisible to human readers but processed by Copilot. When a developer opens a Codespace from a poisoned Issue, the attack chain proceeds in three stages: the injected prompt instructs Copilot to execute terminal commands pulling a crafted pull request containing a symbolic link to the user-secrets-envs.json file; Copilot reads the secrets file through the link without triggering workspace boundary restrictions; and a JSON file with a schema property pointing to an attacker-controlled server exfiltrates the GITHUB_TOKEN as a URL parameter. With a valid GITHUB_TOKEN, the attacker gains full read and write access to the repository. GitHub patched this vulnerability following coordinated disclosure.

The convergence of these vulnerabilities highlights a structural problem: AI coding agents now operate with extensive system access including file reading, command execution, and credential access, while their input channels remain largely unvalidated. Configuration files, web content, and repository metadata all feed into the LLM context without integrity verification, creating multiple indirect prompt injection pathways.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Supply Chain | T1195.002 | Poisoned rules files distributed through shared repositories |
| Command and Scripting Interpreter | T1059 | Arbitrary command execution via Cursor Agent prompt injection |
| Steal Application Access Token | T1528 | GITHUB_TOKEN exfiltration via RoguePilot attack chain |
| User Execution: Malicious Link | T1204.001 | Developer opens poisoned GitHub Issue in Codespace |
| Obfuscated Files or Information: Unicode Encoding | T1027.013 | Hidden Unicode characters in rules files |
| Input Capture | T1056 | Intercepting developer prompts and AI-generated code |
| Data from Information Repositories: Code Repositories | T1213.003 | Repository takeover via stolen GITHUB_TOKEN |

## IOCs

### Domains

*No domain IOCs published by sources*

### Full URL Paths

*No full URL path IOCs published by sources*

### Splunk Format

*No network IOCs published by sources*

### File Hashes

*No file hash IOCs published by sources*

### Package Indicators

*No package IOCs published by sources*

## Detection Recommendations

Scan all .cursorrules, .cursor/rules, .github/copilot-instructions.md, and AGENTS.md files in repositories for hidden Unicode characters. In Splunk, detect Unicode Tag Characters in committed files: `sourcetype=git_events action=push | rex field=diff "[\x{E0001}-\x{E007F}]" | where match(_raw, "cursorrules|copilot-instructions|AGENTS.md")`. Monitor for Cursor processes making outbound connections to unexpected domains when Auto-Run mode is active. Audit GitHub audit logs for repository permission changes following Codespace sessions: `github.audit action=repo.access_granted | stats count by actor, repo`. Deploy pre-commit hooks to detect hidden Unicode characters in configuration files using AgentSeal or similar scanning tools. Review endpoint detection for Cursor process spawning child shell processes following web navigation events. Enforce Cursor version 2.0 or later across development environments to remediate CVE-2026-31854.

## References

- [Pillar Security] New Vulnerability in GitHub Copilot and Cursor: How Hackers Can Weaponize Code Agents (2026) — https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents
- [Orca Security] RoguePilot: Critical GitHub Copilot Vulnerability Exploit (2026) — https://orca.security/resources/blog/roguepilot-github-copilot-vulnerability/
- [AgentSeal] We Scanned 50 Cursor Rules Files From GitHub. 6 Had Hidden Instructions (2026) — https://agentseal.org/blog/cursor-rules-hidden-instructions
- [GitHub Advisory] CVE-2026-31854: Arbitrary Code Execution via Prompt Injection and Whitelist Bypass (2026) — https://github.com/cursor/cursor/security/advisories/GHSA-hf2x-r83r-qw5q
- [SonarQube] Protecting Your AI Code: How SonarQube Defends Against the Rules File Backdoor (2026) — https://sonarsource.com/blog/protecting-your-ai-code
