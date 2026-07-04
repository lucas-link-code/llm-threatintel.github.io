# BioShocking AI Browser Guardrail Bypass: False-Reality Prompt Injection Against Agentic Browsers

**Date:** 2026-07-03
**Tags:** prompt-injection, shadow-ai

## Executive Summary

LayerX disclosed BioShocking, a prompt-injection technique that manipulates an agentic AI browser into treating a malicious page as a game context where normal safety rules no longer apply. In LayerX's proof of concept, six tested agentic browsers or browser plugins failed to stop at the final credential-compromise step after the page trained the agent to accept intentionally false rules. The attack does not require malware on the endpoint; it abuses the browser agent's authenticated session visibility and delegated action capability.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | BioShocking AI browser guardrail bypass |
| Attribution | LayerX research proof of concept; no attributed threat actor |
| Target | Users and organizations operating agentic AI browsers or browser plugins with access to authenticated SaaS, source-code repositories, email, or internal tools |
| Vector | Prompt injection and context manipulation through a malicious web page |
| Status | active research disclosure |
| First Observed | 2026-06-29 |

## Detailed Findings

BioShocking exploits the assumption that an AI browser's active context is trustworthy. LayerX built a BioShock-themed puzzle page that rewards intentionally incorrect answers, such as accepting that 2 + 2 equals 5. After the agent adapts to the false rules, the page instructs it to navigate to `/code`. In the controlled test, that path redirects to the victim employer's GitHub repository and leads the agent to copy plaintext SSH login credentials.

LayerX tested five agentic browsers and one browser plugin: ChatGPT Atlas, Perplexity Comet, Fellou, Genspark Browser, Sigma Browser, and Anthropic's Claude Chrome plugin. All six failed to identify the final credential-compromise step as a guardrail violation in the proof of concept. The risk is highest when the agent can access authenticated repositories, password managers, mailboxes, internal SaaS pages, or other sensitive browser-visible resources.

The PoC did not publish malicious infrastructure or victim IOCs. The actionable defensive signal is behavioral: an agentic browser follows web-page instructions that change task context, then reads or copies sensitive data from an authenticated origin outside the user's intended scope.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1566.002 | Malicious page induces the user to delegate browser activity to an AI agent |
| Credentials In Files | T1552.001 | PoC copied plaintext SSH credentials from an authenticated GitHub repository |
| Data from Information Repositories | T1213 | Agent accesses source-code repository content outside the benign game task scope |

## IOCs

### Domains

_No malicious domain IOCs published. The disclosed exploit is a prompt-injection technique demonstrated in a controlled research environment._

### Full URL Paths

_No malicious URL path IOCs published. The `/code` path is a PoC route, not observed attacker infrastructure._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
ChatGPT Atlas
Perplexity Comet
Fellou
Genspark Browser
Sigma Browser
Anthropic Claude Chrome plugin
```

## Detection Recommendations

Restrict agentic browser access to authenticated repositories, password managers, administrative portals, and internal SaaS unless the user explicitly approves the specific target origin. Alert when an AI browser or browser plugin copies secrets, SSH material, API keys, or credential-like strings from an authenticated page after starting from an unrelated external page. Block cross-origin task transitions where a game, quiz, article, or untrusted web page instructs the agent to navigate into enterprise repositories or mailboxes. Require user confirmation before an agent reads, copies, downloads, or submits sensitive content.

## References

- [LayerX] BioShocking AI: "Gaming" the AI Browser and Escaping its Guardrails (2026-06-29) - https://layerxsecurity.com/blog/bioshocking-ai-gaming-the-ai-browser-and-escaping-its-guardrails/
