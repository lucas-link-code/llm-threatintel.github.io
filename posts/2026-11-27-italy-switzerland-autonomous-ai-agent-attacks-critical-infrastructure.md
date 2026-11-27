# Italy and Switzerland Issue Warnings on Autonomous AI Agent Attacks Against Critical Infrastructure

**Date:** 2026-11-27
**Tags:** malicious-tool

## Executive Summary

According to BleepingComputer, Swiss and Italian cybersecurity agencies warned about automated cyberattacks powered by AI agents targeting critical infrastructure organizations. BleepingComputer reported that CSIRT Italia detected large scale malicious campaigns using autonomous AI agents to exploit exposed endpoints, and Switzerland's National Cyber Security Center confirmed its first cases of successful AI assisted cyberattacks against organizations in at least two sectors. The two agencies urged organizations to reduce the number of systems exposed on the internet, prioritize patching, and monitor for unusual activity.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Autonomous AI driven cyberattacks |
| Attribution | Unattributed (confidence: none) |
| Target | Organizations and operators of critical infrastructure in Italy and Switzerland across at least two sectors |
| Vector | Autonomous AI agents exploiting vulnerabilities and misconfigurations on exposed endpoints, weak passwords, and known vulnerabilities |
| Status | active |
| First Observed | 2026-11-25 |

## Detailed Findings

According to BleepingComputer, Swiss and Italian cybersecurity agencies warned about automated cyberattacks powered by AI agents targeting organizations in the critical infrastructure sector. The two agencies listed four AI powered penetration testing and red teaming frameworks that have been involved in recent breaches and hacking incidents: ARTEX AI, CyberStrikeAI, DeepSeek Harness - Red Team, and PentAGI. Both agencies urged organizations to reduce the number of systems exposed on the internet, prioritize patching, and monitor for unusual activity.

CSIRT Italia says it detected large scale malicious campaigns that used autonomous AI agents to identify and exploit vulnerabilities and misconfigurations on exposed endpoints. In some cases, the agency observed multiple AI agents working in parallel to compromise a large number of systems within a few hours. In one instance involving a DeepSeek Harness setup, a coordinator assigned tasks to five AI agents that undertook a broad spectrum of operational stages, from information gathering to exploitation and persistence. The agents chained vulnerabilities, misconfigurations, and compromised credentials, using exposed systems as a foothold to reach internal networks. CSIRT Italia says autonomous agents demonstrated the ability to carry out complex sustained activity to detect misconfigurations, link even low impact vulnerabilities into complex attack chains, and dynamically adapt their operating modules. CSIRT Italia says they wrote malicious code in real time to evade endpoint defenses and carry out actions deeper within the infrastructure.

Switzerland's National Cyber Security Center warned of similar campaigns targeting organizations in Switzerland, confirming the first cases of successful AI assisted cyberattacks. According to the Swiss NCSC, various organizations and operators of critical infrastructure across at least two sectors have been affected by these cyberattacks. In all cyberattacks known to the NCSC, the use of AI agents led to the successful compromise of the victim's IT systems. The agency described rapid attacks in which agents exploited weak passwords and known vulnerabilities in exposed endpoints, using frameworks to verify weaknesses and independently decide what to do next. NCSC says the number of AI agents publicly and often freely available to cybercriminals has nearly doubled since October, resulting in massive waves against Swiss organizations, including critical infrastructure operators.

CSIRT Italia advises administrators to prioritize patching internet facing systems, focus on addressing flaws known to be actively exploited in the wild, and disable remote management interfaces if not needed. CSIRT Italia also recommends monitoring control plane operations, authentication sources, traffic to internal networks, and outbound server traffic. The Swiss NCSC recommends that administrators of internet facing systems patch critical vulnerabilities within 24 hours of release, add multi factor authentication or passkey protection, and enforce least privilege principles.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | AI agents identified and exploited vulnerabilities and misconfigurations on exposed internet facing endpoints in Italian and Swiss organizations. |
| Valid Accounts | T1078 | Swiss NCSC reported agents exploited weak passwords, and Italian CSIRT reported agents used compromised credentials as part of attack chains. |

## IOCs

### Domains

_No indicators of compromise were published in the BleepingComputer article or the agency statements it summarizes._

### Full URL Paths

_No indicators of compromise were published in the BleepingComputer article or the agency statements it summarizes._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Critical infrastructure IT systems
Internet facing systems
Exposed endpoints
Remote management interfaces
```

## Detection Recommendations

Reduce the number of systems exposed on the internet and disable remote management interfaces when they are not needed. Prioritize patching internet facing systems and address flaws known to be actively exploited in the wild. Monitor control plane operations, authentication sources, traffic to internal networks, and outbound server traffic. Patch critical vulnerabilities in internet facing systems within 24 hours of release, add multi factor authentication or passkey protection, and enforce least privilege principles.

## References

- [BleepingComputer] Italy and Switzerland warn of autonomous AI-driven cyberattacks (2026-11-25) — https://www.bleepingcomputer.com/news/security/italy-and-switzerland-warn-of-autonomous-ai-driven-cyberattacks/
