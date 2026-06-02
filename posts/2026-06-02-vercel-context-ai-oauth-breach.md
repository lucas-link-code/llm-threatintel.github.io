# Vercel + Context.ai OAuth Supply Chain Breach: AI Productivity Tool Compromised via Lumma Stealer, Enabling Lateral Movement into CDN Infrastructure

**Date:** 2026-06-02
**Tags:** supply-chain, llmjacking

## Executive Summary

In April 2026, Vercel disclosed a security incident rooted in a Vercel employee granting an AI productivity tool (Context.ai) 'Allow All' OAuth permissions to the employee's corporate Google Workspace. Attackers, who had compromised a Context.ai employee via Lumma Stealer malware in February 2026, used those OAuth tokens to take over the Vercel employee's account and move laterally into Vercel's internal systems.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Vercel + Context.ai OAuth Supply Chain Breach |
| Attribution | Unknown; likely criminal or APT group with access to Lumma Stealer distribution network (confidence: low) |
| Target | Context.ai employees (initial infection); Vercel employees (OAuth token compromise); Vercel infrastructure (lateral movement) |
| Vector | The incident operationalized OWASP LLM06 Excessive Agency. The 'Allow All' OAuth grant to an AI productivity tool is the textbook case. The employee almost certainly did not intend to authorize an attacker chain that would take over their entire mailbox, drive, and downstream identity surface. They simply clicked through the OAuth consent screen the way users have been trained to. |
| Status | disrupted |
| First Observed | 2026-02-01 |

## Detailed Findings

The 2026 AI security picture opened with a named breach that crystallized the patterns red teams had been warning about for two years. In April 2026, Vercel disclosed a security incident rooted in a Vercel employee granting an AI productivity tool (Context.ai) 'Allow All' OAuth permissions to the employee's corporate Google Workspace. Attackers, who had compromised a Context.ai employee via Lumma Stealer malware in February 2026, used those OAuth tokens to take over the Vercel employee's account and move laterally into Vercel's internal systems. Vercel engaged Mandiant for incident response, notified law enforcement, contacted a limited subset of affected customers directly, and advised customers to review environment variables and enable the sensitive-variable encryption feature. Separately, Vercel disclosed that some customer data had been stolen prior to the main hack.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Valid Accounts | T1078 | Stolen OAuth tokens used to authenticate as legitimate user |
| Lateral Movement | T1570 | Exploitation of Vercel employee identity to access internal systems |
| Credential Access | T1528 | OAuth token theft via malware-compromised AI tool |
| Supply Chain Compromise | T1195 | Trusted AI productivity tool weaponized via third-party employee compromise |

## IOCs

### Domains

_Specific IOCs not disclosed in public reports; focuses on OAuth token compromise chain rather than technical artifacts_

### Full URL Paths

_Specific IOCs not disclosed in public reports; focuses on OAuth token compromise chain rather than technical artifacts_

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
Context.ai (compromised OAuth integration)
```

## Detection Recommendations

A regulator will not accept 'the model was instructed not to' as evidence of access control. Auditors do not certify the configuration. They certify enforcement. The first time a HIPAA, CMMC, PCI, or SOX auditor asks for proof that an AI agent was prevented from accessing a particular dataset, the answer cannot be a system prompt. It must be a logged enforcement decision. Organizations should: (1) Audit all OAuth grants from employees to AI tools; (2) Implement zero-trust OAuth scoping (no 'Allow All' grants); (3) Monitor for anomalous identity and access patterns (ITDR); (4) Enforce conditional access policies for OAuth tokens issued to AI tools; (5) Rotate credentials for any employees who granted excessive permissions to AI tools.

## References

- [BlueRadius Cyber] AI Cybersecurity Incident Report 2026: Vercel, EchoLeak, OWASP (2026-06-01) — https://blueradius.io/ai-cybersecurity-incident-report-2026
