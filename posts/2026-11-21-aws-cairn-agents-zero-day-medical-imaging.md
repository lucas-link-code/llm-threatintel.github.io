# AWS Reports Chinese Nexus Cairn AI Agents Autonomously Discovered and Exploited a Zero Day in a Medical Imaging AI Application

**Date:** 2026-11-21
**Tags:** nation-state, malicious-tool, apt

## Executive Summary

Amazon Threat Intelligence disclosed that a Chinese nexus operator running the open source autonomous penetration testing framework Cairn left an instance exposed without authentication, revealing a campaign in which AI agents found and exploited an unpatched zero day on their own. The agents achieved root level shell access on a medical imaging AI application in about 11 minutes via a path traversal upload parameter, then planted a Python reverse shell through sitecustomize.py. Defenders running the affected open source medical imaging project should apply the vendor fix and review Python startup file integrity and training API endpoint exposure.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Cairn autonomous agent campaign against East Asian universities |
| Attribution | Chinese-nexus threat actor (confidence: medium) |
| Target | Universities in East Asia outside mainland China |
| Vector | Autonomous AI agent exploitation of internet facing services including an unauthenticated Redis instance and a vulnerable medical imaging AI application |
| Status | active |
| First Observed | 2026-09-08 |

## Detailed Findings

According to the AWS Security Blog, Amazon Threat Intelligence identified a publicly accessible server hosting an unauthenticated instance of Cairn, an open source autonomous AI penetration testing framework, on September 10, 2026. The exposure revealed project configurations, actor prompts, and AI output. The operator wrote prompts in Simplified Chinese and configured executed script timestamps to China Standard Time. AWS reported that the observed campaign targeted IP addresses associated with universities in East Asia outside mainland China over roughly 48 hours beginning September 8, 2026. The most extensive operation targeted an unauthenticated Redis instance at one university, with the agents performing 148 sequential actions over about 16 hours, including abusing Redis replication to load unauthorized code, escaping the scripting sandbox, writing configuration files, corrupting memory, and attempting Log4Shell injection against another service on the same system. Against a target running an open source medical imaging AI application, the agents identified the application framework, mapped API endpoints, found an upload endpoint with a filename parameter, and confirmed path traversal. In about 11 minutes they went from API mapping to arbitrary file write. In a later session they wrote a Python reverse shell payload to sitecustomize.py, a file Python automatically imports at interpreter startup, then triggered a training API endpoint to spawn a new Python process that imported the payload and established a reverse shell running as root. AWS assessed with high confidence that the path traversal was a zero day because no fix, issue, advisory, or prior vulnerability database mention existed for the affected open source project at the time of discovery. In another session the human actor supplied the agents a proxy tunneling into a second university network running the same vulnerable software, and directed the agents to target other machines in that network. AWS assessed with moderate confidence that this is a Chinese nexus threat actor based on Simplified Chinese prompts, China Standard Time timestamps, and targeting of universities likely of strategic interest to China. AWS notified the project maintainers, who released a fix and a GitHub Security Advisory.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Agents exploited an upload endpoint filename parameter for path traversal in an internet facing medical imaging AI application to write arbitrary files and gain root shell access. |
| Command and Scripting Interpreter: Python | T1059.006 | Agents wrote a reverse shell payload to sitecustomize.py so Python imported it at interpreter startup when a training API endpoint spawned a new process. |

## IOCs

### Domains

_No IOCs published. AWS did not name the affected open source medical imaging project or the university IP addresses. The project's GitHub Security Advisory and fix were referenced but not linked in the source._

### Full URL Paths

_No IOCs published. AWS did not name the affected open source medical imaging project or the university IP addresses. The project's GitHub Security Advisory and fix were referenced but not linked in the source._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cairn autonomous AI penetration testing framework
Open source medical imaging AI application (unnamed, vulnerable to path traversal in upload filename parameter)
Redis (unauthenticated instances)
```

## Detection Recommendations

Monitor for unexpected writes or modifications to sitecustomize.py and other Python startup files (usercustomize.py, .pth files in site-packages) and for training or inference API endpoints spawning unexpected Python processes with outbound network connections. Audit upload endpoints for filename parameter path traversal and enforce filename normalization and allowlisting. Eliminate unauthenticated Redis exposure: require authentication, disable or restrict the REPLICATION and MODULE commands, and set protected mode. Hunt for the Log4Shell injection attempts against services colocated with Redis. Because the framework was left exposed on shared cloud infrastructure, defenders should also check for publicly reachable Cairn or similar agentic pentest dashboards in their own and monitored cloud estates, though AWS did not publish the hosting domain or IP addresses to block.

## References

- [AWS Security Blog] Chinese-nexus actor's Cairn AI agents found a zero-day on their own (2026-11-20) — https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/
