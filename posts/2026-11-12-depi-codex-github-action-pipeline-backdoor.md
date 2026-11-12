# Depi Security Shows Prompt Injection Chain From GitHub Issue to Control of the @openai/codex npm Publish Pipeline

**Date:** 2026-11-12
**Tags:** supply-chain, prompt-injection, malicious-tool

## Executive Summary

Depi Security disclosed an exploit chain that began with prompt injection through the OpenAI Codex GitHub Issue Labeler workflow and ended with the ability to publish to the official @openai/codex npm package. The chain combined code execution inside the agent sandbox, a sandbox escape, memory poisoning, a fake release, and abuse of an OpenID Connect token trusted by npm to reach release signing. OpenAI deployed a fix and awarded an initial $1,000 bounty; no customer side patch is required.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Codex GitHub Actions pipeline exploit chain |
| Attribution | Depi Security (researchers), reported to OpenAI via Bugcrowd (confidence: high) |
| Target | OpenAI Codex development and publishing infrastructure; downstream @openai/codex npm consumers |
| Vector | Attacker controlled GitHub issue title and body fed into the Codex agent prompt via the Issue Labeler workflow |
| Status | disrupted |
| First Observed | 2026-11-11 |

## Detailed Findings

According to Depi Security, the Issue Labeler GitHub Actions workflow defined in issue-labeler.yml uses openai/codex-action to analyze newly opened or codex-label tagged issues and suggest labels. Any external user can trigger the workflow by opening an issue, and the issue title and body are fed directly into the Codex prompt in the same natural language context as trusted instructions, enabling prompt injection. Depi Security reported one crafted prompt injection yielded code execution inside the agent sandbox, followed by a sandbox escape and memory poisoning that gave a path to the npm package. The chain then created a fake Codex release via the rust-ci.yml workflow; deleting the rogue release triggered a workflow that handed the attacker an OpenID token with write permissions. Depi Security stated the token could be exchanged for a signed JWT trusted by npm, allowing publication of a malicious Codex version. Depi Security reported the issue to OpenAI through Bugcrowd; OpenAI deployed a fix and awarded an initial $1,000 bounty with the report still under review. Depi Security stated there is nothing for defenders to patch on their side.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | External users trigger the issue-labeler workflow by opening GitHub issues, feeding attacker input into the agent prompt |
| Supply Chain Compromise | T1195.001 | Attacker path to publishing a malicious version of the @openai/codex npm package via a trusted npm JWT |

## IOCs

### Domains

_No IOCs published. Depi Security disclosed the chain and PoC to OpenAI through Bugcrowd; affected workflow files and packages listed._

### Full URL Paths

_No IOCs published. Depi Security disclosed the chain and PoC to OpenAI through Bugcrowd; affected workflow files and packages listed._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
OpenAI Codex
@openai/codex npm package
GitHub Actions (issue-labeler.yml, rust-ci.yml)
openai/codex-action
```

## Detection Recommendations

Audit GitHub Actions workflows that pass issue or PR content into AI agent prompts such as openai/codex-action and enforce least privilege on workflow GITHUB_TOKEN and OIDC permissions. Review OIDC trust policies for npm publishing so only expected workflows and environments can request publishing tokens, and monitor for unexpected releases, release deletions that trigger downstream workflows, and anomalous publish events for @openai/codex. Require human in the loop approval before any automated package publish step.

## References

- [Depi Security] Backdooring the next release of Codex through GitHub Action pipeline exploit chaining (2026-11-11) — https://depi.security/blog/20261111-backdooring-codex/
