# GhostApproval: Symlink Trust Boundary Bypass in Six AI Coding Assistants Enables Silent Code Execution

**Date:** 2026-08-19
**Tags:** prompt-injection, mcp-security

## Executive Summary

Wiz Research uncovered GhostApproval, a trust boundary flaw affecting leading AI coding assistants that can bypass human approval and enable code execution. A newly disclosed vulnerability pattern dubbed 'GhostApproval' has exposed a critical security flaw in six of the most widely used AI coding assistants. This transforms a sandbox bypass into an informed consent bypass; the Human-in-the-Loop safety net becomes a rubber stamp. Amazon, Google and Cursor treated it as a vulnerability and shipped fixes. Cursor issued CVE-2026-50549 to the flaw.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GhostApproval Trust Boundary Exploitation |
| Attribution | Unknown (vulnerability class, not single campaign) (confidence: none) |
| Target | Developers using AI coding assistants: Amazon Q Developer, Anthropic Claude Code, Augment, Cursor, Google Antigravity, Windsurf |
| Vector | Malicious repositories with symlink path deception; agent trusts workspace but symlink resolves to attacker-controlled target (~/.ssh/authorized_keys, ~/.zshrc, shell startup files) |
| Status | active |
| First Observed | 2026-02-10 |

## Detailed Findings

Symlink injection enables SSH key injection to ~/.ssh/authorized_keys and shell persistence via ~/.zshrc. In the latter case, the Agent's chat explicitly noted: 'I can see that project_settings.json is actually a zsh configuration file' - then proceeded to write the malicious payload anyway. Initial discovery occurred on February 10, 2026, with vendor reports submitted between February 12 and March 5, 2026. Public disclosure was made on July 8, 2026, following the 90+ day coordinated disclosure window. Three vendors patched the vulnerability promptly: AWS, Cursor, and Google. AWS fixed the issue in language server version 1.69.0 (deployed May 27, 2026) and assigned CVE-2026-12958. Cursor released its fix in v3.0 (June 5, 2026) under CVE-2026-50549. Google deployed its fix on May 22, 2026, and is assessing whether to issue a CVE. Augment and Windsurf acknowledged the reports but, as of publication, had gone quiet without a fix, leaving their users potentially exposed. Anthropic disputed that Claude Code's behavior was a vulnerability. It argued that a user who trusts a directory and approves an edit owns that decision, putting the scenario 'outside our threat model.' As reported, the Miasma worm planted AI-agent config files in a Microsoft Azure repository so its payload ran the moment a developer opened the project in Claude Code, Cursor, or Gemini.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Signed Script Proxy Execution | T1216 | Agent executes commands via shell startup files (.zshrc, .bashrc) with developer approval |
| Establish Accounts | T1136 | SSH key injection to ~/.ssh/authorized_keys enables attacker account creation |
| Persistence | T1547.004 | Shell startup file modification ensures persistence across developer sessions |
| Privilege Escalation | T1548 | Symlink allows write to sensitive system directories without explicit approval |

## IOCs

### Domains

_Symlink-based trust boundary bypass; no published exploit code; detection via repository symlink scanning_

### Full URL Paths

_Symlink-based trust boundary bypass; no published exploit code; detection via repository symlink scanning_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'Amazon Q Language Server', 'registry': 'AWS', 'version': '1.69.0', 'note': 'Fixed version; versions prior to 1.69.0 affected by CVE-2026-12958'}
{'name': 'Cursor', 'registry': 'cursor.sh', 'version': '3.0', 'note': 'Fixed version; prior versions affected by CVE-2026-50549'}
```

### Affected Platforms

```
Amazon Q Developer (fixed)
Anthropic Claude Code (disputed; not fixed)
Augment (acknowledged; not fixed)
Cursor (fixed)
Google Antigravity (fixed)
Windsurf (acknowledged; not fixed)
```

## Detection Recommendations

Scan all repositories for suspicious symlink patterns, especially those pointing outside the project root or to system directories. Block agent execution on repositories with symlinks to ~/.ssh, ~/.bash*, ~/.zsh* or other sensitive paths until manually verified. Monitor for malicious agent configuration files (.cursor/mcp.json, .codeium/config) planted in trusted repositories. Implement mandatory out-of-band verification for any file write operation that resolves through a symlink. Require explicit admin approval before allowing agents to execute on workspaces containing symlinks. Maintain immutable audit logs of all filesystem operations performed by agents with full resolution of symlink targets. Treat approval prompts for agent operations as user-confirmable but not security-decisive; rely instead on architectural controls to prevent agents from accessing sensitive paths regardless of approval.

## References

- [Wiz Blog] GhostApproval: AI Coding Assistant Trust Boundary Flaw (2026-07-08) — https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants
- [Infosecurity Magazine] GhostApproval Flaw Hits Six Major AI Coding Assistants (2026-07-14) — https://www.infosecurity-magazine.com/news/ghostapproval-flaw-ai-coding/
- [Cybersecurity News] New GhostApproval Vulnerability Affects Amazon Q, Claude Code, Cursor, and Other AI Agents (2026-07-09) — https://cybersecuritynews.com/ghostapproval-vulnerability/
- [The Hacker News] GhostApproval Symlink Flaws Could Let Malicious Repos Run Code in AI Coding Agents (2026-07-09) — https://thehackernews.com/2026/07/ghostapproval-symlink-flaws-could-let.html
- [Axis Intelligence] AI Model Vulnerability Tracker 2026: 312 LLM Attacks Tested (2026-08-09) — https://axis-intelligence.com/research/ai-model-vulnerability-tracker/
