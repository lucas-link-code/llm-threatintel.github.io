# GhostApproval: Symlink Trust Boundary Flaw Across Six AI Coding Assistants Enables Sandbox Escape and RCE

**Date:** 2026-07-12
**Tags:** supply-chain, mcp-security

## Executive Summary

Wiz disclosed GhostApproval on 2026-07-08, a category-level symlink following flaw affecting Amazon Q Developer, Anthropic Claude Code, Augment, Cursor, Google Antigravity, and Windsurf. A malicious repository can disguise a symlink as a local config file so the agent writes outside the workspace, including to ~/.ssh/authorized_keys, often while the confirmation UI shows only the local path. Upgrade Cursor to 3.0 or later, Amazon Q language server to 1.69.0 or later, and Google Antigravity to the fixed build; treat untrusted repos as hostile and resolve symlinks before approving agent writes.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | GhostApproval trust boundary pattern |
| Actor / Attribution | Vulnerability research disclosure by Wiz; no attributed in-the-wild campaign (confidence: none for actor attribution) |
| Target | Developers using AI coding assistants that write files under human-in-the-loop approval |
| Vector | Malicious git repository with symlink disguised as project config plus README instructions steering the agent to edit that path |
| Status | partially remediated (AWS, Cursor, Google fixed; Augment and Windsurf in progress at disclosure; Anthropic disputed then later versions warn on sensitive symlink targets) |
| First Observed | 2026-02-10 discovery; public disclosure 2026-07-08 |

## Detailed Findings

According to Wiz, GhostApproval combines CWE-61 symlink following with CWE-451 UI misrepresentation of critical information. The proof-of-concept creates a repository where project_settings.json is a symlink to a sensitive path such as ~/.ssh/authorized_keys, then instructs the agent via README to update that file with an attacker SSH public key. When the victim asks the assistant to set up the workspace, the agent follows the symlink and writes outside the sandbox.

Wiz reported that in several products the agent internal reasoning correctly identified the dangerous target while the user-facing confirmation still displayed the local symlink name. Anthropic Claude Code was cited as the clearest CWE-451 example: reasoning noted the symlink destination while the prompt asked only whether to edit project_settings.json. Anthropic initially rejected the report as outside its threat model because the user trusted the directory and approved the prompt; Wiz noted later Claude Code versions resolve symlinks and warn before writing to sensitive files, and on 2026-07-07 Anthropic stated a symlink warning shipped in v2.1.32 from proactive hardening.

Vendor outcomes per Wiz: Amazon Q Developer showed pre-authorization writes with only Undo afterward and was fixed under CVE-2026-12958 in language server 1.69.0. Cursor showed the symlink path in the diff UI and followed it on Accept; fixed under CVE-2026-50549 in v3.0. Google Antigravity displayed the symlink path rather than the canonical path and was fixed. Augment performed silent symlink reads and writes with no confirmation, including credential exfiltration and authorized_keys or zshrc persistence, with remediation still in progress at disclosure. Windsurf wrote to disk before Accept/Reject appeared, making the dialog an undo mechanism rather than an authorization gate; Cognition acknowledged receipt on 2026-06-23 with no further update by publication.

Wiz Sensor detections cover clone-time creation of symlinks to sensitive files, write-time modification of authorized_keys, and severity elevation when activity originates from AI coding assistant processes.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious repository delivered to developers as trusted project source |
| Path Interception by PATH Environment Variable | T1574.007 | Symlink path interception causing writes outside intended workspace |
| Account Manipulation: SSH Authorized Keys | T1098.004 | Agent write of attacker key to ~/.ssh/authorized_keys |
| User Execution: Malicious File | T1204.002 | Developer opens malicious repo and approves agent edit |
| Obfuscated Files or Information | T1027 | Symlink masquerades as benign project_settings.json |

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
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Monitor git clone and checkout events that create symlinks resolving outside the workspace, especially to ~/.ssh/authorized_keys, ~/.zshrc, ~/.bashrc, shell rc files, and cloud credential paths. Alert on AI coding assistant processes writing to those sensitive paths. Prefer agents and IDE versions that resolve symlinks before permission prompts and that never write before explicit user authorization. For Cursor require version 3.0 or later. For Amazon Q Developer require language server 1.69.0 or later and reload the IDE to pick up auto-updates. Do not approve agent file edits in repositories that have not been reviewed for symlinks. Hunt for unexpected authorized_keys entries and unexpected shell rc modifications after AI-assisted setup of untrusted repos.

## References

- [Wiz] GhostApproval: AI Coding Assistant Trust Boundary Flaw (2026-07-08) — https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants
