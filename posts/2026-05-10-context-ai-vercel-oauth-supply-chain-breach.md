# Context.ai OAuth Compromise Pivots to Vercel via Lumma Stealer and Overpermissioned Google Workspace Integration

**Date:** 2026-05-10
**Tags:** supply-chain, shadow-ai

## Executive Summary

A Context.ai employee was compromised with Lumma Stealer malware in February 2026, and a threat actor claiming ShinyHunters responsibility used compromised OAuth tokens to pivot into Vercel's Google Workspace account, exposing customer credentials and claiming $2 million in stolen data. The attacker gained access to a Vercel employee's Google Workspace account through a compromised Context AI browser extension, then accessed environment variables not marked as sensitive and not encrypted at rest.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Context.ai OAuth Supply Chain Pivot to Vercel |
| Attribution | ShinyHunters (claimed; ShinyHunters publicly denied involvement) (confidence: low) |
| Target | Vercel (via compromised Context.ai employee account); potential downstream impact to hundreds of organizations using Context.ai Office Suite |
| Vector | Infostealer malware (Lumma Stealer) → OAuth token theft → Google Workspace takeover → environment variable access |
| Status | active |
| First Observed | 2026-02-01 |

## Detailed Findings

Hudson Rock uncovered that a Context.ai employee was compromised with Lumma Stealer in February 2026, raising the possibility that the infection triggered the supply chain escalation. Context AI disclosed that an unauthorized actor gained access to their OAuth tokens, enabling access to a subset of users on their legacy and experimental products. Context.ai identified and blocked unauthorized access to its AWS environment in March 2026, but later emerged that the attacker also likely compromised OAuth tokens for some of its consumer users. The IOC referenced on Vercel's website can be found inside the Context AI Chrome Extension (omddlmnhcofjbnbflmjginpjjblphbgk), which was removed on March 27, 2026, and allowed users to search and gather information from their Google Drive files using OAuth2 Google App login, granting the Context AI app full read access to all of their Google Drive files. <ancite index="52-6,52-8">It appears at least one Vercel employee signed up for the AI Office Suite using their Vercel enterprise account and granted 'Allow All' permissions, with Vercel's internal OAuth configurations allowing this action to grant broad permissions in Vercel's enterprise Google Workspace. The corporate credentials harvested during the attack consisted of Google Workspace credentials, along with keys and logins for Supabase, Datadog, and Authkit, with the "support@context.ai" account likely allowing the threat actor to escalate privileges, bypass security controls, and successfully pivot into Vercel's infrastructure. In April 2026, Vercel was compromised via an OAuth app integrated into their Google Workspace tenant stemming from a compromised third-party AI SaaS provider.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Link | T1566.002 | Lumma Stealer delivery vector targeting Context.ai employee |
| Valid Accounts: Cloud Accounts | T1078.004 | OAuth token hijacking and Google Workspace account takeover |
| Unsecured Credentials: Credentials in Files | T1552.001 | Environment variables stored unencrypted in Vercel platform |
| Lateral Tool Transfer | T1570 | Pivot from Context.ai OAuth tokens into Vercel infrastructure |

## IOCs

### Domains

```
beta.context.ai (no longer accessible as of April 20, 2026)
```

### Full URL Paths

_Sourced from Vercel security bulletin and OX Security analysis; Lumma Stealer C2 infrastructure not publicly disclosed in primary sources_

### Splunk Format

```
"beta.context.ai (no longer accessible as of April 20, 2026)"
```

## Detection Recommendations

Monitor Google Workspace OAuth application approvals for unusually broad permissions grants (especially 'Allow All' scopes); implement OAuth scope restrictions and time-bounded token expiration; audit third-party AI tool integrations with workspace tenants for proper permission segmentation; implement environment variable encryption at rest (Vercel's 'sensitive' variable feature); enforce multi-factor authentication on workspace admin and service accounts; monitor for suspicious Chrome extension installations or removals in enterprise environments; detect infostealer infections through behavioral analytics (file system enumeration of credential stores like .ssh, .aws, .npmrc); implement CASB controls to detect unusual OAuth token usage patterns.

## References

- [OX Security] Vercel Breached via Context AI Supply Chain Attack (2026-04-20) — https://www.ox.security/blog/vercel-context-ai-supply-chain-attack-breachforums/
- [The Hacker News] Vercel Breach Tied to Context AI Hack Exposes Limited Customer Credentials (2026-04-19) — https://thehackernews.com/2026/04/vercel-breach-tied-to-context-ai-hack.html
- [Vercel Knowledge Base] Vercel April 2026 security incident (2026-04-19) — https://vercel.com/kb/bulletin/vercel-april-2026-security-incident
- [Trend Micro] The Vercel Breach: OAuth Supply Chain Attack Exposes Hidden Risk in Platform Environment Variables (2026-04-21) — https://www.trendmicro.com/en_us/research/26/d/vercel-breach-oauth-supply-chain.html
- [TechCrunch] App host Vercel says it was hacked and customer data stolen (2026-04-20) — https://techcrunch.com/2026/04/20/app-host-vercel-confirms-security-incident-says-customer-data-was-stolen-via-breach-at-context-ai/
