# Salt Labs: An Email Prompt Injection Reached Code Execution in the Manus Agent

**Date:** 2026-09-30
**Tags:** prompt-injection

## Executive Summary

OODA Loop reported on 2026-09-25 that Salt Labs turned an indirect prompt injection in email into remote code execution inside a Manus user's environment. Manus had blocked plaintext requests to execute commands in inbound mail. Salt Labs bypassed that filter with JSFuck encoding, and the code ran before the security warning. OODA Loop did not publish indicators. Restrict what an agent can execute when it reads mail, and do not treat a post execution warning as containment.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Manus indirect prompt injection to remote code execution |
| Actor / Attribution | Salt Labs disclosure. No criminal actor named (confidence: none) |
| Target | Manus users who connect the agent to inbound email and let it run code |
| Vector | Hidden instructions in an email, encoded with JSFuck after plaintext execution requests were blocked |
| Status | OODA Loop did not state whether Manus has shipped a fix |
| First Observed | 2026-09-25, the date of the OODA Loop brief |

## Detailed Findings

According to OODA Loop, Salt Labs found an indirect prompt injection flaw in Manus that allowed remote code execution in a target user's environment. OODA Loop described Manus as an agentic application that had been seeking funding at a reported US$4 billion valuation. OODA Loop reported that Chinese regulators blocked a planned US$2 billion Meta acquisition of Manus in April 2026.

OODA Loop reported that Manus blocked plaintext execution requests embedded in incoming email. Salt Labs then used JSFuck, a JavaScript obfuscation method, to get past that filter. OODA Loop said execution happened before the security warning appeared. OODA Loop framed the result as remote code execution and credential exposure across accounts the user had connected. The brief does not name those accounts, does not describe the code execution primitive, and does not say whether Manus replied or shipped a patch.

This collection pass did not find a Salt Labs primary writeup at a URL the site validator can retrieve. Claims above are limited to the OODA Loop brief. No domain, URL, hash, or package indicator was published there.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing | T1566 | OODA Loop reported that the injection was carried in inbound email the agent processed |
| Obfuscated Files or Information | T1027 | JSFuck encoding bypassed a filter that had caught plaintext execution requests |
| Command and Scripting Interpreter | T1059 | OODA Loop reported that the flaw permitted remote code execution in the user environment |

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

For Manus and similar agents, log tool executions that start during an email summarization task and alert when the tool runs before any guardrail warning is shown to the user. Block or require approval for shell, code interpreter, and token reading tools while the agent context contains untrusted mailbox text. Test filters against encoded script, not only against the plaintext command strings the product already blocks. OODA Loop published no network or file indicators to hunt.

## References

- [OODA Loop] Prompt-Injection Vulnerability Hits $4B Agentic AI Platform Manus AI (2026-09-25): https://oodaloop.com/briefs/cyber/prompt-injection-vulnerability-hits-4b-agentic-ai-platform-manus-ai/
