# Greeter Exploit Framework Turns Exposed Flowise AI Servers Into Cloud Credential Theft Entry Points

**Date:** 2026-11-07
**Tags:** malicious-tool

## Executive Summary

Era Security discovered Greeter, a Chinese language exploit framework that abuses CVE-2024-58351 in end of life Flowise deployments to inject payloads per request through the overrideConfig.javascriptFunction parameter, leaving stored chatflows unmodified and logs showing only repeated 'hello' messages. Shodan data cited by TechTarget shows 4,372 Flowise instances still internet facing, 3,277 with a recognizable version, and 703 with no authentication, and Greeter uses the compromised host to probe cloud metadata services for temporary AWS IAM or Google Cloud tokens. Defenders should inventory internet facing Flowise, upgrade past 2.1.4 or retire it, require authentication, and alert on overrideConfig javascriptFunction usage and instance metadata queries.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Greeter |
| Attribution | Unknown Chinese language developer (confidence: none) |
| Target | Exposed, unpatched Flowise AI agent platform deployments and the cloud accounts behind their hosts |
| Vector | Per request API override supplying javascriptFunction in the overrideConfig parameter, exploiting CVE-2024-58351 |
| Status | active |
| First Observed | 2026-11-05 |

## Detailed Findings

Era Security discovered and named Greeter, a Chinese language framework that targets legacy, unpatched Flowise deployments, according to TechTarget. Flowise is an open source AI agent platform that reached official end of life in August 2026, and Greeter focuses on versions before 2.1.4 that carry CVE-2024-58351, a runtime configuration flaw that lets a remote attacker supply a javascriptFunction key inside the overrideConfig request parameter. TechTarget reported that when the key is invoked the platform replaces the code of Custom JavaScript Function nodes on the fly, so the stored chatflow definition in the database remains untouched and workflow audits show nothing unusual. In Era Security honeypots, all 4,972 recorded user messages read only 'hello' at steady 3.5 second intervals, while the server returned complete environment profiles, process listings, host configurations, and stolen credentials.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Era Security reported that Greeter reaches exposed Flowise instances through a javascriptFunction payload in the overrideConfig request parameter, exploiting CVE-2024-58351 in versions before 2.1.4 |
| Unsecured Credentials: Cloud Instance Metadata API | T1552.005 | According to Era Security, Greeter queries instance metadata services from the compromised host to attempt extraction of temporary AWS IAM or Google Cloud service account tokens |

## IOCs

### Domains

_No domains, URLs, hashes, IPs, or packages were published by Era Security or TechTarget. The only identifier disclosed is CVE-2024-58351._

### Full URL Paths

_No domains, URLs, hashes, IPs, or packages were published by Era Security or TechTarget. The only identifier disclosed is CVE-2024-58351._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Flowise versions before 2.1.4
Flowise deployments without authentication
```

## Detection Recommendations

Monitor Flowise API traffic for overrideConfig parameters containing javascriptFunction, especially where the stored chatflow definition does not change between requests, and correlate with repetitive low entropy user messages such as 'hello' that produce rich server side output. Restrict outbound access from AI orchestration hosts to the instance metadata endpoint 169.254.169.254 unless operationally required, log IMDS queries, enforce IMDSv2 with a hop limit of 1 on AWS, and rotate any cloud credentials reachable from a Flowise host. Inventory internet facing Flowise deployments using Shodan or internal scanning, upgrade beyond 2.1.4, retire end of life versions, and enable authentication on any instance that must remain exposed.

## References

- [TechTarget] Greeter exploit framework hides cloud theft on AI servers (2026-11-05) — https://www.techtarget.com/news/greeter-exploit-framework-hides-cloud-theft-on-ai-servers/873828/
