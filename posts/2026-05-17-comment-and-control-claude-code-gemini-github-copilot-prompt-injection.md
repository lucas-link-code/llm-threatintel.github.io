# Comment and Control: Prompt Injection via GitHub PR Comments Steals Credentials from Claude Code, Gemini CLI, and GitHub Copilot — Vendors Paid Bounties, Issued No Public Advisories

**Date:** 2026-05-17
**Tags:** prompt-injection, mcp-security

## Executive Summary

Security researcher Aonan Guan disclosed in April 2026 that a single class of prompt injection attack — embedding malicious instructions in GitHub pull request titles, issue bodies, or review comments — successfully hijacks Claude Code's security review agent, Gemini CLI Action, and GitHub Copilot Agent to exfiltrate API keys and CI/CD secrets back through GitHub's own APIs. All three vendors paid bug bounties (Anthropic: $100 for a CVSS 9.4 Critical; Google: $1,337; GitHub: $500) but issued no CVEs, no public advisories, and no user-facing notifications, leaving an unknown number of repositories running the affected agent versions. Security teams operating automated AI code review workflows on GitHub should audit CI logs for unexpected credential references in PR comments and rotate any secrets accessible from review agent environments.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Comment and Control — prompt injection credential theft class |
| Actor / Attribution | Vulnerability class; no attributed threat actor; publicly documented PoC by Aonan Guan (Wyze Labs) and Johns Hopkins researchers Zhengyu Liu and Gavin Zhong |
| Target | Organizations using AI code review agents on GitHub (Claude Code Security Review, Gemini CLI Action, GitHub Copilot Agent) |
| Vector | Malicious content in GitHub pull request titles, issue bodies, or review comments processed by AI coding agents |
| Status | Active; no CVEs assigned; vendors confirmed patches in internal versions but issued no public advisory or forced upgrade |
| First Observed | October 2025 (vendor reports filed); April 15, 2026 (public disclosure); May 2026 (ongoing coverage of non-disclosure controversy) |

## Detailed Findings

### Attack Mechanism

According to Guan's public writeup on oddguan.com, "Comment and Control" exploits the fact that AI coding agents processing GitHub content treat PR titles, issue bodies, and review comments as trusted input within the agent's reasoning context. An attacker who can open a pull request or post a comment — which requires only a GitHub account — can inject instructions that the agent executes as if they came from the authorized operator.

The attack differs for each vendor:

**Claude Code Security Review Agent:** Guan reported that a malicious PR title breaks out of the prompt context and instructs Claude to execute `whoami`, `ps auxeww`, or `env` inside the CI runner, then return the full output as a JSON "security finding" posted to the PR comments thread. Anthropic's HackerOne program rated this CVSS 9.4 Critical when first reported in October 2025. SecurityWeek confirmed the attack requires no code access and no special permissions — a public pull request is sufficient.

**Google Gemini CLI Action:** Guan embedded a fake "Trusted Content Section" header immediately after the legitimate content section. Gemini's safety instructions were overridden and it posted the `GEMINI_API_KEY` environment variable as a public issue comment, visible to all repository participants. Google paid a $1,337 bounty.

**GitHub Copilot Agent:** Guan used an HTML comment to hide the payload from human reviewers while keeping it visible to the model. The injected instruction bypassed Copilot's environment variable filtering, scanned for secrets, and used GitHub's own APIs as the exfiltration channel to avoid network firewall alerts. GitHub resolved the internal issue on March 9, 2026 and paid $500.

### Vendor Non-Disclosure

According to The Next Web's investigation, no vendor issued a CVE, published a security advisory, or notified users via their change logs or release notes. Anthropic's HackerOne program marked the report status as "None" on April 20, 2026 — five days after public disclosure — without linking to any remediation guidance. VentureBeat reported in May 2026 that review of Anthropic's Claude Opus 4.6 system card shows the vulnerability class was anticipated: the card notes that indirect prompt injection "remains an unsolved problem" for agentic deployments, a fact the VentureBeat analysis described as the "one vendor's system card predicted it" finding.

The CSA Lab Space research note published May 3, 2026, classified Comment and Control as a Tier-1 CI/CD integrity threat, noting that "GitHub's own infrastructure becomes the exfiltration channel, making the attack invisible to standard network egress monitoring."

### Affected Tool Versions and Remediation Status

SecurityWeek confirmed that Anthropic, Google, and GitHub have each deployed internal fixes in their hosted agent products, but none has issued guidance on which specific versions are patched or how organizations running self-hosted versions of the affected agents should determine their exposure. Organizations using pinned older versions of Claude Code, Gemini CLI Action, or Copilot Agent in their CI/CD pipelines may remain exposed.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing via Service | T1566.003 | Malicious payload delivered via GitHub PR title, issue body, or comment — no email required |
| Command and Scripting Interpreter: Unix Shell | T1059.004 | Claude Code agent executes `env`, `ps auxeww`, `whoami` in CI runner via injected instruction |
| Credentials In Files | T1552.001 | Agents access CI runner environment variables containing API keys, cloud credentials, and signing tokens |
| Exfiltration Over Web Service | T1567.002 | Stolen credentials posted to GitHub PR comments or issues using GitHub's own API as exfiltration channel |
| Exploit Public-Facing Application | T1190 | GitHub pull request interface is the attack entry point; requires only a GitHub account to exploit |
| Indirect Command Execution | T1202 | Attacker instructions embedded in PR content are interpreted and executed by the AI agent without direct user interaction |

## IOCs

### Domains

```
No external C2 domains; exfiltration uses GitHub's own API endpoints
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

**GitHub audit log review:** Search GitHub organization audit logs for AI agent comments containing environment variable names (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `AWS_ACCESS_KEY_ID`, `GITHUB_TOKEN`, etc.) posted as PR comments or issue updates. These should never appear in comment bodies; their presence is a strong indicator of successful exploitation.

**CI runner process monitoring (EDR):** Alert on `claude`, `gemini`, `copilot-agent`, or any AI review agent process spawning shell children (`sh`, `bash`, `env`, `ps`) during pull request review workflows. AI review agents should not need to execute arbitrary shell commands.

**PR content scanning:** Implement a pre-processing filter on PR titles and issue bodies in CI workflows that blocks or flags content containing known injection patterns: `Trusted Content Section`, `IGNORE PREVIOUS INSTRUCTIONS`, HTML comment blocks with base64-encoded payloads, and zero-width character sequences.

**Secret rotation:** Any organization that has run Claude Code security review, Gemini CLI Action, or GitHub Copilot Agent on public or open-source repositories since October 2025 should rotate all secrets accessible from CI runner environments as a precaution, particularly if PR comments from those agents appear to include unexpected environment variable values.

**Version pinning audit:** Identify all workflow files using pinned versions of `anthropics/claude-code-action`, `google-gemini/gemini-cli-action`, or Copilot Agent. Contact the respective vendors to confirm the pinned version contains the patched inference guardrails, since no public version guidance has been issued.

## References

- [Aonan Guan] Comment and Control: Prompt Injection to Credential Theft in Claude Code, Gemini CLI, and GitHub Copilot Agent (2026-04-15) — https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/
- [SecurityWeek] Claude Code, Gemini CLI, GitHub Copilot Agents Vulnerable to Prompt Injection via Comments (2026-04-16) — https://www.securityweek.com/claude-code-gemini-cli-github-copilot-agents-vulnerable-to-prompt-injection-via-comments/
- [VentureBeat] Three AI coding agents leaked secrets through a single prompt injection. One vendor's system card predicted it (2026-05) — https://venturebeat.com/security/ai-agent-runtime-security-system-card-audit-comment-and-control-2026
- [The Next Web] Anthropic, Google, and Microsoft paid AI agent bug bounties, then kept quiet about the flaws (2026-05) — https://thenextweb.com/news/ai-agents-hijacked-prompt-injection-bug-bounties-no-cve
- [CSA Lab Space] Comment and Control: GitHub AI Agents as Credential Exfiltrators (2026-05-03) — https://labs.cloudsecurityalliance.org/research/csa-research-note-comment-control-github-prompt-injection-20/
- [Repello AI] Comment and Control: How One Prompt Injection Hit Claude Code, Gemini CLI, and Copilot Agent (2026-05) — https://repello.ai/blog/comment-and-control-claude-code-gemini-copilot-prompt-injection
- [GBHackers] Claude Code, Gemini CLI, and GitHub Copilot Exposed to Prompt Injection via GitHub Comments (2026-04-16) — https://gbhackers.com/claude-code-gemini-cli-and-github-copilot-exposed/
