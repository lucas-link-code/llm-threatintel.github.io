# AI Token Jacking Feeds Gray-Market Transfer Stations and Causes Near-Million-Dollar API Charges

**Date:** 2026-08-10
**Tags:** llmjacking, shadow-ai, supply-chain

## Executive Summary

Palo Alto Networks Unit 42 reported incident-response cases in which cybercriminals placed stolen AI API credentials into gray-market proxy services called transfer stations within minutes of exposure. Unit 42 reported that transfer stations can generate tens of millions of API requests per day and that one investigated sequence accumulated nearly US$1 million in charges before discovery and containment. Unit 42 recommends imposing token-spend limits, monitoring developer-account and AI-usage changes, replacing long-lived keys with short-lived bearer tokens, and controlling package intake in developer environments.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI token jacking through gray-market transfer stations (Unit 42) |
| Actor / Attribution | Unnamed cybercriminal transfer-station operators; no named actor or geographic attribution published by Unit 42 (confidence: none) |
| Target | Organizations and developers holding paid API access to frontier AI models (Unit 42) |
| Vector | Stolen or newly provisioned API keys obtained through infostealers, phishing, exposed repositories or shares, and poisoned npm packages (Unit 42) |
| Status | Recent and ongoing incident-response activity as of 2026-08-06 (Unit 42) |
| First Observed | Unit 42 did not publish a campaign start date |

## Detailed Findings

### Transfer-station infrastructure

Unit 42 reported that transfer stations resell access to multiple frontier AI services through seller-issued credits, often at prices below official provider rates. Unit 42 reported that many transfer stations use the open-source `new-api` or `one-api` projects to proxy official APIs, rotate and authenticate credentials, normalize prompts, route model requests, and track billing.

Unit 42 reported that many transfer-station advertisements appear on Chinese-language marketplaces such as Taobao, but Unit 42 did not attribute the IOC-linked infrastructure to a named actor or government. Unit 42 also reported that some transfer-station customers are developers seeking inexpensive access, while other customers can use the services to conceal access to restricted or expensive models.

Unit 42 described `new-api` and `one-api` as open-source proxy platforms and Taobao as a marketplace on which transfer stations are advertised. Under this repository's IOC policy, those services and official AI-provider API domains are shared infrastructure rather than campaign-specific indicators, so the IOC blocks below contain only the domains and IP addresses that Unit 42 explicitly associated with recent token-jacking activity.

### Credential acquisition and account manipulation

Unit 42 reported that attackers obtain privileged developer accounts through infostealers, phishing, access brokers, exposed file shares, and exposed code repositories. Unit 42 reported that access to those accounts can allow an attacker to create new API keys, provision models, remove billing limits, and disable usage alerts or logging.

Unit 42 reported that attackers also steal already provisioned API keys directly. Unit 42 identified self-propagating npm attacks such as Shai-Hulud and Miasma as a recent credential-acquisition path that can collect keys from developer systems and propagate through packages subsequently published with stolen credentials.

Unit 42's separate ChainDrop analysis documented an npm worm that collects cloud, CI, developer-tool, and AI-provider credentials, reads temporary GitHub Actions secrets from runner memory, and republishes infected packages with stolen npm tokens. Unit 42 did not claim that every ChainDrop credential entered a transfer station; this report therefore treats ChainDrop as a corroborated acquisition mechanism rather than proof of a one-to-one link with the IOC-listed transfer stations.

### Financial and downstream impact

Unit 42 reported that transfer stations can produce tens of millions of API calls per day and hundreds of thousands of dollars in usage fees. Unit 42 reported cases in which an inadvertently exposed credential was integrated into a transfer station within minutes, and Unit 42 reported that one investigated sequence generated nearly US$1 million in charges before discovery and containment.

Unit 42 reported that organizations have limited recourse to recover provider charges generated with valid stolen tokens. Unit 42 reported that developers using gray-market proxies also risk having requests routed to inferior models and having prompts or sessions monitored for sensitive information.

Unit 42 published no malware family, file hash, malicious URL path, or named threat actor for the token-jacking cases. Unit 42 published two transfer-station domains, 12 IP addresses associated with malicious API calls, four IP addresses associated with credential-theft logins, and one user-agent string associated with malicious API calls.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Steal Application Access Token | T1528 | Unit 42 reported theft and resale of AI API access keys and tokens. |
| Unsecured Credentials: Credentials In Files | T1552.001 | Unit 42 reported key collection from improperly secured file shares and code repositories. |
| Phishing | T1566 | Unit 42 reported phishing as a source of privileged developer accounts used to provision or steal AI API keys. |
| Account Manipulation: Additional Cloud Credentials | T1098.001 | Unit 42 reported that compromised developer accounts can create additional API keys before provisioning models or changing billing controls. |
| Resource Hijacking: Cloud Service Hijacking | T1496.004 | Unit 42 reported unauthorized consumption and resale of victim-funded AI cloud resources. |
| Application Layer Protocol: Web Protocols | T1071.001 | Unit 42 reported that transfer stations proxy requests to official AI APIs over web protocols. |

## IOCs

The following values are transcribed from Unit 42's indicator table. The user-agent is retained as a behavior indicator, not a standalone block condition, because the string can also occur in legitimate Go-based HTTP traffic.

### Domains

```
abb1[.]life
amutes[.]com
```

### Full URL Paths

```
No URL IOCs published by source
```

### IP Addresses

Malicious API calls:

```
3.235.109[.]125
15.204.106[.]173
23.237.196[.]170
38.46.219[.]162
38.46.219[.]163
38.46.219[.]166
47.88.103[.]81
47.251.72[.]239
104.243.42[.]117
116.105.166[.]148
172.96.142[.]186
198.255.70[.]210
```

Malicious logins associated with credential theft:

```
23.236.182[.]215
95.214.112[.]26
117.72.74[.]48
207.246.106[.]162
```

### Splunk Format

```
"*abb1.life*" OR "*amutes.com*" OR "3.235.109.125" OR "15.204.106.173" OR "23.236.182.215" OR "23.237.196.170" OR "38.46.219.162" OR "38.46.219.163" OR "38.46.219.166" OR "47.88.103.81" OR "47.251.72.239" OR "95.214.112.26" OR "104.243.42.117" OR "116.105.166.148" OR "117.72.74.48" OR "172.96.142.186" OR "198.255.70.210" OR "207.246.106.162"
```

### File Hashes

```
No hash IOCs published by source
```

### Network Behavior Indicator

```
Go-http-client/2.0,gzip(gfe)
```

Unit 42 associated this user-agent with malicious API calls, but the string is not unique to this activity and should only be used with the published IPs, domains, anomalous token usage, or account changes.

## Detection Recommendations

Unit 42 recommends configuring provider-side spending limits and alerts for deviations from established token-consumption baselines. Unit 42 recommends using AI gateway telemetry to associate requests with managed machine identities and to detect unexpected model routing, request volume, token spend, geography, and source IP changes.

Unit 42 recommends reviewing privileged developer-account audit logs for unexpected API-key creation, model provisioning, billing-limit removal, and alert or logging changes. Unit 42 recommends replacing long-lived access keys with short-lived bearer tokens and applying network boundaries that prevent a stolen key from being used through external transfer-station infrastructure.

Unit 42's IOC table supports proxy, DNS, firewall, and cloud audit-log correlation against `abb1[.]life`, `amutes[.]com`, the 12 malicious API-call IPs, and the four credential-theft login IPs. The Unit 42 user-agent should be correlated with these indicators or abnormal AI usage and should not trigger a block by itself.

Unit 42 recommends tightly controlling packages admitted to development and CI environments because poisoned self-propagating npm packages can collect API keys before propagating through additional releases. Unit 42's ChainDrop guidance recommends treating CI runners as potentially compromised when the worm executes and rotating every AI-provider, cloud, npm, GitHub, SSH, and automation credential accessible to the affected environment.

## References

- [Palo Alto Networks Unit 42] Token Jacking: Cybercriminals Could Be Stealing Your AI Resources (2026-08-06) — https://unit42.paloaltonetworks.com/ai-token-jacking/
- [Palo Alto Networks Unit 42] ChainDrop: Inside a Self-Propagating npm Worm (2026-08-06) — https://unit42.paloaltonetworks.com/chaindrop-npm-worm-analysis/
- [StepSecurity] ChainDrop npm Worm: Bun-loaded CI/CD credential harvester with Ethereum dead-drop C2 (2026-08-04) — https://www.stepsecurity.io/blog/chaindrop-npm-worm
