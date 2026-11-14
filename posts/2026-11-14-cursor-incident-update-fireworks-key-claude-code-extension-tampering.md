# Cursor Update Traces Claude Code Marketplace Tampering to Exposed Fireworks Access Key and Unredacted Agent Trace Credentials

**Date:** 2026-11-14
**Tags:** supply-chain, malware

## Executive Summary

Cursor's November 13 incident update states the October 29 attack began when Fireworks exposed an access key issued by Cursor, which the attacker used to copy data from a read only storage bucket holding coding agent traces that contained unredacted credentials for less than 0.01 percent of customers. The attacker then reached internal SaaS tools, archived non production source repositories, support data, and credentials, and used a stolen credential to place malicious copies of Anthropic's Claude Code extension on the Cursor VS Code extension marketplace cache, potentially served to at most 5,000 users for about 11 hours. Developers who installed or updated Anthropic.claude-code 2.1.312 or 2.1.313 from the Cursor marketplace during the exposure window should follow Cursor's remediation steps, since uninstalling the extension alone may not be sufficient.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Cursor Marketplace Claude Code Extension Tampering |
| Attribution | Unattributed attacker (confidence: none) |
| Target | Cursor customers, Cursor internal systems, and users of the Cursor VS Code extension marketplace |
| Vector | Exposed vendor access key leading to credential theft and malicious extension publication |
| Status | disrupted |
| First Observed | 2026-10-29 |

## Detailed Findings

According to Cursor's blog, the incident started at Fireworks after an attacker obtained an access key Cursor had issued to Fireworks, which Fireworks exposed, and used it to copy data from a read only storage bucket Cursor used to share data with the vendor. Cursor stated the bucket contained limited coding agent traces, mostly from 2025 sessions not in Privacy Mode, and that a small number of those traces contained credentials that had not been redacted, with less than 0.01 percent of customers having API credentials exposed. Cursor reported the attacker used those credentials to reach select SaaS tools used by Cursor, then accessed select archived non production Cursor source repositories, some containing business contact information, limited customer support data and email conversations, product usage metrics and contact details, summaries of some coding agent conversations, and credentials users had sent to the Cursor support team. Cursor's monitoring systems identified the unauthorized activity, and the company deactivated the vendor key, opened an incident response workstream, and began revoking and rotating credentials. Cursor reported that on October 29 the attacker used a stolen credential from the exposed internal data to place malicious, unauthorized copies of Anthropic's Claude Code extension directly on the cache used to serve the Cursor VS Code extension marketplace, that Anthropic did not publish this copy and that it was not a vulnerability in Anthropic's product, and that the Open VSX marketplace source never had the malware. Cursor stated at most 5,000 users who requested specific cached versions of the extension on October 29 potentially received the malicious build, that it was available for approximately 11 hours before removal, and that the extension marketplace was taken offline while the attacker's server host was contacted to take the server down. Cursor published a security notice with indicators of compromise and scripts to check systems on October 30, and it stated that the last attacker activity seen was on November 1 and was blocked.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | Attacker published unauthorized Claude Code extension builds through the Cursor marketplace cache |
| Unsecured Credentials: Credentials In Files | T1552.001 | Unredacted credentials inside coding agent traces in a shared read only storage bucket enabled lateral access |

## IOCs

### Domains

_Cursor published indicators of compromise and remediation scripts in its October 30 security notice, referenced from the November 13 update. No hashes, IPs, or attacker domains were disclosed in the update retrieved._

### Full URL Paths

_Cursor published indicators of compromise and remediation scripts in its October 30 security notice, referenced from the November 13 update. No hashes, IPs, or attacker domains were disclosed in the update retrieved._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cursor VS Code extension marketplace
Cursor internal SaaS tooling
Cursor non production source repositories
Fireworks shared data storage bucket
```

## Detection Recommendations

Audit any developer workstation that installed or updated Anthropic.claude-code 2.1.312 or 2.1.313 from the Cursor VS Code extension marketplace on October 29, 2026 and run Cursor's published check scripts rather than relying on uninstall alone. Hunt for access to storage buckets shared with AI vendors that contain agent traces or session logs, and enforce redaction and credential scrubbing before such data leaves the tenant. Rotate any API keys or support submitted credentials that may have transited coding agent traces, and review SaaS audit logs for access originating from vendor issued keys after August 2026.

## References

- [Cursor] An update on our recent security incident (2026-11-13) — https://cursor.com/blog/security-incident-update
