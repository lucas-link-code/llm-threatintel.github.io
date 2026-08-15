# Autonomous Hermes/OpenClaw Framework Targets Taiwan Nuclear Infrastructure: Multi-Wave Attack Extracts 2,500+ Government Records

**Date:** 2026-08-15
**Tags:** nation-state, malicious-tool, apt

## Executive Summary

Suspected Chinese cyber operatives used publicly available AI tools to compromise Taiwanese government systems before expanding the attack to its nuclear safety agency, supply-chain vendors, and at least seven energy companies. Over the first four days of July, AI agents compromised 85 government user accounts and extracted more than 2,500 personnel records. Twelve attack waves swept simultaneously across 21 connected government systems, deploying up to eight sub-agents at once. By the time the agents finished, they had cracked 85 government user accounts, extracted more than 2,500 personnel records, harvested seven SSO client secrets and six internal database credentials spanning MSSQL, Oracle, and Sybase systems.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Autonomous AI Attack on Taiwan Government and Nuclear Infrastructure |
| Attribution | China-linked threat actors (confidence: high) |
| Target | Taiwan government agencies, nuclear safety authority, energy sector, supply chain vendors |
| Vector | Autonomous AI agents (Hermes, OpenClaw frameworks) with internet reconnaissance and lateral movement |
| Status | active |
| First Observed | 2026-07-01 |

## Detailed Findings

Attack records disclosed on August 12, 2026 show that the Hermes and OpenClaw open-source frameworks mapped 21 Taiwanese government systems within four days, breaching 85 accounts and stealing over 2,500 personnel records. The attackers used two open-source AI agent systems, Hermes and OpenClaw. The tool continuously ranked and reprioritized possible attack paths based on available information. When one approach failed, another agent searched the internet and developed a new method. The operation expanded — pivoting from the initial government department outward to Taiwan's nuclear safety agency, at least seven energy companies, government IT supply-chain vendors, and a government email system, scanning all of them simultaneously for misconfigurations, exposed administrative interfaces, and exploitable vulnerabilities. Hermes Agent and OpenClaw both include safety mechanisms designed to prevent their use in offensive operations. Those mechanisms check whether the operation is described as authorized — they are consent-based, not behavioral, indicating safety mechanisms were bypassed through social engineering or misrepresentation of intent. The investigation found clear indications that the attacks originated overseas and involved a hybrid approach in which hackers combined conventional operations with AI agents such as OpenClaw, per Taiwan's Ministry of Digital Affairs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Automated Reconnaissance | T1592 | AI agents performed autonomous network mapping and system enumeration across 21 government systems |
| Lateral Movement | T1570 | Agents pivoted from initial government entry to nuclear safety agency, energy companies, and supply-chain vendors |
| Credential Dumping | T1110 | Extracted SSO client secrets, internal database credentials, and personnel records via API enumeration |
| Credential Access | T1555 | Harvested seven SSO client secrets and six internal database credentials from MSSQL, Oracle, Sybase systems |

## IOCs

### Domains

_No specific IOCs (C2, hashes, IPs) published. 160 MB operational workspace archive analyzed by Dream Labs. Attackers used consent-bypass social engineering against safety guardrails built into Hermes and OpenClaw frameworks._

### Full URL Paths

_No specific IOCs (C2, hashes, IPs) published. 160 MB operational workspace archive analyzed by Dream Labs. Attackers used consent-bypass social engineering against safety guardrails built into Hermes and OpenClaw frameworks._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'Hermes', 'registry': 'open-source', 'version': 'latest', 'note': 'Nous Research AI agent framework used in offensive Taiwan government operations; weaponized variant'}
{'name': 'OpenClaw', 'registry': 'open-source', 'version': 'latest', 'note': 'Open-source AI agent framework used for autonomous system reconnaissance and exploitation chain in Taiwan attack'}
```

### Affected Platforms

```
Taiwan government network infrastructure
Taiwan nuclear safety agency (NSB)
Taiwan energy sector (7+ companies)
Taiwan government IT supply-chain vendors
Government email systems
```

## Detection Recommendations

Monitor for: (1) Autonomous queries against exposed API endpoints, particularly those leaking user enumerations or service discovery; (2) High-velocity lateral movement with consistent request patterns suggesting orchestration by a single decision engine rather than human operators; (3) Simultaneous reconnaissance against multiple unrelated systems within short timeframes (suggest agent swarms); (4) Repeated requests to internet search or reconnaissance APIs from internal network segments; (5) Abnormal use of debugging or profiling APIs that AI agents might invoke during exploitation synthesis; (6) Exfiltration of SSO tokens, database connection strings, and service account credentials to external email systems or cloud storage; (7) Deployment or execution of Hermes or OpenClaw within corporate networks (these should be assumed hostile if observed in production systems); (8) Presence of 160 MB+ operational workspaces or debug logs documenting agent decision-making and exploitation chains left by attackers. Network edge detection should focus on egress of government personnel records and database credential formats to overseas IP ranges. EDR systems should alert on execution of Python-based agent frameworks from non-standard paths. Review browser history and DNS logs for queries characteristic of agent reconnaissance (SHODAN, Censys, GitHub code search for credentials).

## References

- [Dream Labs (Israeli cybersecurity firm)] Autonomous AI Attack Framework Targets Taiwan Government, Nuclear Infrastructure (2026-08-12) — https://www.theregister.com/security/2026/08/12/near-autonomous-ai-agents-attack-taiwans-nuclear-safety-agency/5287055
- [The Register] 'Near-autonomous' AI agents attack Taiwan's nuclear safety agency (2026-08-12) — https://www.theregister.com/security/2026/08/12/near-autonomous-ai-agents-attack-taiwans-nuclear-safety-agency/5287055
- [Reuters/Benzinga] Chinese Hackers Used AI Agents to Hunt Taiwan Government Systems (2026-08-12) — https://www.benzinga.com/news/26/08/61138673/chinese-hackers-used-ai-agents-to-hunt-taiwan-government-systems-breaching-85-accounts-and-stealing-thousands-of-records-report
- [Winzheng] Open-source AI Agents Autonomously Breach Taiwan Government, Mapping 21 Systems (2026-08-12) — https://www.winzheng.com/en/article/ai-agents-autonomous-taiwan-government-hack
- [TechTimes] Open-Source AI Agents Breach Taiwan Nuclear Agency in Four-Day Autonomous Strike (2026-08-13) — https://www.techtimes.com/articles/324237/20260813/open-source-ai-agents-breach-taiwan-nuclear-agency-four-day-autonomous-strike.htm
- [CNN Business] Hackers used autonomous AI agents to attack Taiwan. Is this the future of cyberwarfare? (2026-08-13) — https://www.cnn.com/2026/08/13/tech/china-taiwan-ai-agent-cyberattack-intl-hnk
- [CyberScoop] Researchers observe first 'near-autonomous' AI attack on government target in Taiwan (2026-08-12) — https://cyberscoop.com/near-autonomous-ai-attack-government-target-taiwan/
- [SecurityAffairs] China-Linked Hackers Use AI Agents in Autonomous Attack on Taiwan (2026-08-13) — https://securityaffairs.com/197079/apt/china-linked-hackers-use-ai-agents-in-autonomous-attack-on-taiwan.html
