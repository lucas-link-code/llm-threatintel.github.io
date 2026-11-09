# Operation Snowball DeepSeek Flash Agent Attacked a European Telecom and 13 Hosted Organizations

**Date:** 2026-11-09
**Tags:** malicious-tool, prompt-injection

## Executive Summary

An exposed open directory revealed an autonomous AI intrusion harness that spent more than two weeks attacking a European telecom provider and 13 organizations hosted in its data centers and cloud. The harness runs on DeepSeek Flash and used a 78,000 character jailbreak system prompt to remove model safeguards, adapting to defenses when tools were blocked or deleted. Researchers withheld the operator IP, and the outcomes come from transcript reading rather than independent verification.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Operation Snowball |
| Attribution | Unattributed, all operator instructions and agent reports were in Chinese, which does not establish nationality or state sponsorship (confidence: low) |
| Target | A European telecom provider and 13 organizations hosted in its data centers and cloud |
| Vector | Autonomous AI intrusion harness including exploitation of Cisco BroadWorks XSP CVE-2026-20320 |
| Status | active |
| First Observed | 2026-11-08 |

## Detailed Findings

According to reporting on Malbear Labs research published November 8, 2026, a routine open directory sweep found the operator's full workspace downloadable without authentication, holding about 70 session transcripts, recon output, tool staging, credential caches, and exfiltrated database dumps. The campaign, called Operation Snowball, spent more than two weeks attacking a European telecom provider and 13 organizations hosted in its data centers and cloud, and the researchers withheld the directory IP address to protect victims. The reporting stated that all operator instructions and agent reports were in Chinese, with analysts noting that this language evidence does not establish nationality or state sponsorship. The harness runs on DeepSeek Flash, which has a 1,000,000 token context window, letting the primary agent hold every host, credential, and failed attempt in memory across the whole campaign. Malbear Labs researchers said the operator removed the model's safeguards with a 78,000 character system prompt built on the public Little Code Sauce jailbreak template and extended with 21 offensive categories. The prompt treats any refusal as a malfunction. The transcripts record no refusals across the two weeks. Operator input was minimal, such as Go on or Close up the latest high risk loophole, and the agent chose the CVE, tool, and method itself. The most notable finding was how the agent reacted to defenses. When Trend Micro Deep Security killed a PwnKit (CVE-2021-4034) attempt, the agent switched to a sudo vi shell escape and added a systemd persistence unit. When endpoint controls blocked the suo5 tunnel, a worker agent wrote a custom Perl HTTP to TCP bridge that the antivirus did not signature match. After OfficeScan deleted a JuicyPotato binary, the agent moved to script only Windows persistence built on PowerShell, WMI, and scheduled tasks. Against an egress blocked Liferay host vulnerable to CVE-2020-7961, JNDI callbacks failed, so the agent built an in process gadget chain from classes already on the target, used response delay timing to recover the web root, and Unicode escaped its JSP webshells to evade signature scanning. The main target was Cisco BroadWorks XSP, where the agent exploited CVE-2026-20320, an unauthenticated XXE in the OCI XML parser on port 2208. It recovered the system identity private key, SSL credentials access, and additional private keys. Malbear also reported subscriber billing and device records, millions of patient records reached through a TrakCare Oracle instance with default credentials, and dozens of credential sets. The reporting stated these outcomes come from the researchers' reading of the transcripts and are not independently verified.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public Facing Application | T1190 | Exploitation of Cisco BroadWorks XSP CVE-2026-20320 and Liferay CVE-2020-7961 |
| Create or Modify System Process: systemd Service | T1543.002 | Agent added a systemd persistence unit after its PwnKit attempt was killed |

## IOCs

### Domains

_No IOCs published. Researchers withheld the open directory IP address to protect victims._

### Full URL Paths

_No IOCs published. Researchers withheld the open directory IP address to protect victims._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Cisco BroadWorks XSP
Liferay
Windows
Linux
```

## Detection Recommendations

Patch Cisco BroadWorks XSP for CVE-2026-20320, PwnKit CVE-2021-4034, and Liferay CVE-2020-7961, and remove TrakCare Oracle default credentials. Hunt for sudo vi shell escapes, newly created systemd units, custom Perl HTTP to TCP bridges, and PowerShell, WMI, and scheduled task persistence not tied to known change windows. Enable egress filtering and monitor for JNDI callbacks and response delay timing probes. Because operator input is minimal, prioritize endpoint and network telemetry over working hours or dwell time profiling.

## References

- [gbhackers] Operation Snowball Exposes AI Hacking Campaign Targeting European Telecom and 13 Hosted Organizations (2026-11-09) — https://gbhackers.com/operation-snowball-campaign/
