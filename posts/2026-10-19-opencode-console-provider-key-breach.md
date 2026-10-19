# OpenCode Console Breach Exposes User Stored OpenAI, Anthropic, and Google API Keys

**Date:** 2026-10-19
**Tags:** llmjacking, supply-chain

## Executive Summary

An intruder reached a legacy system at OpenCode on the night of 2026-10-16 and may have exposed third party AI provider keys that users stored in OpenCode Console. OpenCode emailed the affected 1.4 percent of Console users on 2026-10-17 and told them to revoke and replace their OpenAI, Anthropic, or Google keys. Any organization with linked provider keys in Console should rotate those keys now and review provider billing and usage for abuse.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | OpenCode Console provider key breach |
| Attribution | Unknown (confidence: none) |
| Target | OpenCode Console users with an outside AI provider key linked, 1.4 percent of Console users |
| Vector | Intrusion into a legacy OpenCode system |
| Status | active |
| First Observed | 2026-10-16 |

## Detailed Findings

[thehackernews.com](https://thehackernews.com/2026/10/opencode-console-breach-may-have.html) reported on 2026-10-19 that an intruder reached a legacy system at OpenCode on the night of 2026-10-16 and may have exposed the third party AI provider keys that users saved in OpenCode Console. Console is OpenCode's optional hosted service where a workspace stores its own OpenAI, Anthropic, or Google key so that Console calls the provider on the workspace's behalf and team members never see the key. The affected group is 1.4 percent of Console users, all of whom have an outside provider linked, and OpenCode told them by email on the morning of 2026-10-17 under the subject line Action Required: Potential provider key breach to revoke those keys with each provider and replace them. Co founder Dax Raad stated the breach involves the OpenCode Console and not OpenCode itself, since the command line and desktop apps keep provider keys added on the machine in a local SQLite database. OpenCode's 2026-10-17 post called the incident ongoing, said the company was working with Anthropic, OpenAI and Google, and described the breach as related to a large scale distillation attack.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials | T1552 | Third party AI provider API keys stored in the hosted OpenCode Console service were reachable from a compromised legacy system |

## IOCs

### Domains

_No IOCs published. The breach concerns the OpenCode Console hosted service, not the opencode command line or desktop clients._

### Full URL Paths

_No IOCs published. The breach concerns the OpenCode Console hosted service, not the opencode command line or desktop clients._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
OpenCode Console hosted service
```

## Detection Recommendations

Inventory any OpenAI, Anthropic, or Google keys that were pasted into OpenCode Console and rotate them with each provider. Review provider usage and billing for unexpected calls that match a distillation pattern, which typically shows high volume prompt and completion traffic. Confirm that no affected user missed the 2026-10-17 notification, since only notified accounts were affected.

## References

- [The Hacker News] OpenCode Console Breach May Have Exposed OpenAI, Anthropic, and Google API Keys (2026-10-19) — https://thehackernews.com/2026/10/opencode-console-breach-may-have.html
