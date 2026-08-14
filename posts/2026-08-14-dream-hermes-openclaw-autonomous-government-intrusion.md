# Near-Autonomous Hermes/OpenClaw Framework Compromises Asian Government Systems

**Date:** 2026-08-14
**Tags:** malicious-tool

## Executive Summary

Dream Research Labs documented what it assessed as a near-autonomous multi-agent framework that compromised Asian government systems during 12 attack waves from July 1 through July 4, 2026, cracking 85 employee accounts and extracting at least 2,564 personnel records. Dream Research Labs reported linguistic evidence pointing to a Chinese-language operator but did not attribute the framework to a government or named threat group; defenders should prioritize unauthenticated API exposure, unsigned JWT acceptance, password spraying, cross-application SSO reuse, and anomalous bulk data access.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Dream-documented Hermes/OpenClaw multi-agent intrusion framework; Dream Research Labs published no campaign name |
| Actor / Attribution | Unknown Chinese-language operator based on linguistic evidence; no government or named threat group attributed by Dream Research Labs |
| Target | Government entities in Asia, followed by scanning of government IT vendors, a nuclear safety agency, a government email system, and at least seven energy companies (Dream Research Labs); Taiwan identified only through secondary reporting by The Register |
| Vector | Exposed authentication and user-data APIs, predictable-password spraying with automated CAPTCHA solving, acceptance of unsigned JWTs, and cross-application SSO trust (Dream Research Labs) |
| Status | active — observed from 2026-07-01 through 2026-07-04; later activity not disclosed by Dream Research Labs |
| First Observed | 2026-07-01 |

## Detailed Findings

### Operational Workspace and Agent Architecture

Dream Research Labs reported that its researchers found a complete operational workspace in early July 2026 containing more than 160 MB and 1,395 files from confirmed compromises of government infrastructure in Asia. According to Dream Research Labs, the framework used Hermes and OpenClaw, retained reports under `.hermes` and `.openclaw` workspace identifiers, and deployed as many as eight lettered sub-agents concurrently. Dream Research Labs documented agents A through Q across 12 attack waves conducted from July 1 through July 4 and assessed that the output volume was consistent with extensive automation.

Dream Research Labs reported that the framework continuously ranked 14 parallel attack chains with Bayesian probability scores. According to Dream Research Labs, five autonomous "Learning Cycles" searched vulnerability databases, GitHub repositories, public exploits, and security publications for techniques relevant to the target environment, while structured results from each wave informed the next wave.

### Reconnaissance and Initial Access

According to Dream Research Labs, the framework downloaded and decompiled JavaScript bundles from an Angular government portal to extract URLs, API endpoints, OAuth client IDs, and Keycloak configuration. Dream Research Labs reported that this process mapped 21 connected government systems, six SSO sub-realms, two RSA signing keys, every supported authentication flow, and at least 36 API endpoints on one target.

Dream Research Labs reported that the framework also collected two national SSO SDK examples and analyzed them with its `Local-LLM-SAST-0day` method. Dream Research Labs found that the resulting client-side findings did not produce confirmed exploitation of the live environment and that the confirmed breaches instead used server-side weaknesses found through black-box testing.

Dream Research Labs identified three exposed developer debug endpoints that accepted arbitrary request bodies and returned authenticated sessions. According to Dream Research Labs, the framework then used usernames obtained from an unauthenticated user API, solved the office portal's CAPTCHA images with Tesseract OCR at a reported 100 percent success rate, and tested predictable variations of employee identifiers as passwords. Dream Research Labs reported that the spray cracked 85 accounts and that a separate government API accepted JWTs with the `alg` field set to `none`, allowing unsigned identity tokens.

### SSO Pivoting, File Upload, and Data Collection

Dream Research Labs reported that the framework tested the 85 cracked accounts against other systems connected to the same SSO environment. According to Dream Research Labs, 84 accounts authenticated through an SSO bridge without additional MFA or user confirmation and exposed internal dashboards, equipment-management interfaces, and personnel statistics.

Dream Research Labs reported that the framework uploaded a web shell through an unrestricted file-upload API, but Forms Authentication prevented execution. The source therefore supports successful file placement, not remote code execution through that upload path.

According to Dream Research Labs, the operation extracted at least 2,564 personnel records: 1,409 employee records, 916 records from an unauthenticated API, and 239 legal-professional records from an unauthenticated Ministry of Justice endpoint. Dream Research Labs also reported a complete JSON export of a department's user database, seven rotated SSO client secrets whose names exposed conventions, six internal database credentials for MSSQL, Oracle, and Sybase, and internal network ranges.

### Target Expansion and Validation Logic

Dream Research Labs reported that the framework expanded its reconnaissance to government IT supply-chain vendors, a nuclear safety agency, a government email system, and at least seven energy-sector companies. The source describes parallel scanning for misconfigurations, exposed administrative interfaces, and exploitable vulnerabilities; it does not establish that every scanned organization was compromised.

According to Dream Research Labs, the framework's final summary rejected seven false positives after retesting. Dream Research Labs reported that each accepted finding required confirmation by the discovering agent and two additional rounds of three independent agent checks, and it documented a purported SQL injection that the framework discarded after determining that an SMTP timeout caused the observed delay.

Dream Research Labs reported that the framework bypassed model refusals by describing its operations as authorized penetration testing. According to Dream Research Labs, internal reports used Simplified Chinese while target-facing analysis used Traditional Chinese, supporting a Chinese-language operator assessment but not attribution to China, a government sponsor, or a named threat group.

### Taiwan Identification Is Secondary Reporting

Dream Research Labs identified the victim only as government entities in Asia and declined to name the country. The Register reported that a person familiar with the incident confirmed Taiwan as the target and that the Financial Times had separately identified Taiwan; this country identification is secondary reporting and is not a disclosure made by Dream Research Labs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Active Scanning: Vulnerability Scanning | T1595.002 | Dream Research Labs documented automated scanning and prioritization of public government systems, connected services, vendors, and energy-sector targets. |
| Exploit Public-Facing Application | T1190 | Dream Research Labs reported exploitation of exposed authentication endpoints, unauthenticated APIs, and a JWT signature-validation flaw. |
| Brute Force: Password Spraying | T1110.003 | Dream Research Labs reported predictable-password testing across harvested employee usernames, resulting in 85 cracked accounts. |
| Account Discovery | T1087 | Dream Research Labs reported enumeration of employee usernames and SSO account identifiers through exposed user-data APIs. |
| Valid Accounts | T1078 | Dream Research Labs reported that 84 cracked accounts authenticated to an internal system through an SSO bridge. |
| Data from Information Repositories | T1213 | Dream Research Labs reported extraction of personnel records and a complete user-database JSON export. |
| Unsecured Credentials | T1552 | Dream Research Labs reported access to SSO client secrets and internal database credentials. |

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

Inventory all public APIs and fail closed on routes that create authenticated sessions without an established identity. In API gateway and WAF logs, alert when unauthenticated requests receive session cookies, authorization codes, or successful responses from debug, authentication, administrative, user-directory, or bulk-export routes. Decode JWT headers at the gateway, reject `alg:none`, and alert on unsigned tokens before they reach application logic.

Correlate API access, CAPTCHA, and identity-provider logs by source IP, user agent, and session. Detect one source enumerating large user datasets, submitting authentication attempts across many usernames with a low attempt count per account, and then authenticating those accounts to multiple SSO-connected applications. Alert when a single source successfully signs in as many employees, when one account traverses several relying parties in a short interval, or when an SSO bridge grants access without the expected MFA event.

In web-server and EDR telemetry, alert on uploads of server-executable extensions or script content to web-accessible paths even when subsequent execution returns an access error. Monitor API response volume for unusually large JSON exports of user or personnel data and correlate those downloads with recent authentication anomalies. Review SSO client-secret and database-credential storage, rotate exposed secrets, and restrict each connected application to the minimum identity scopes required.

## References

- [Dream Research Labs] Inside a Multi-Agent AI Framework Used to Compromise Government Entities in Asia (2026-08-12) — https://www.dreamgroup.com/blog/inside-a-multi-agent-ai-framework-used-to-compromise-government-entities-in-asia
- [The Register] 'Near-autonomous' AI agents attack Taiwan's nuclear safety agency (2026-08-12) — https://www.theregister.com/security/2026/08/12/near-autonomous-ai-agents-attack-taiwans-nuclear-safety-agency/5287055
