# FBI FLASH Advisory Warns ARTEX Autonomous Pentest Framework Driving Global Attacks and ConnectWise Supply Chain Breach

**Date:** 2026-11-17
**Tags:** malicious-tool, supply-chain

## Executive Summary

The FBI issued a FLASH advisory warning that multiple threat actors have weaponized the ARTEX autonomous penetration testing framework since at least August 2026 to automate intrusions across financial, government, technology, defense, and healthcare sectors, including a ConnectWise supply chain breach that compromised Microsoft 365 customer environments. ARTEX chains techniques fast enough to move from initial targeting to privileged access in under three hours, and researchers counted more than 1,600 publicly exposed ARTEX consoles as of early November. Defenders should hunt for the framework's high volume reconnaissance traffic and review third party integration portals that ARTEX targets effectively.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | ARTEX autonomous framework abuse |
| Attribution | Multiple unattributed threat actors (confidence: low) |
| Target | Financial, government, technology, defense, healthcare, and other sectors, plus Microsoft 365 customer environments reached via a ConnectWise supply chain breach |
| Vector | Autonomous AI agent framework performing reconnaissance, vulnerability discovery, exploitation, privilege escalation, and data theft, including via third party integrations and partner portals |
| Status | active |
| First Observed | 2026-08 |

## Detailed Findings

According to [BleepingComputer](https://www.bleepingcomputer.com/news/security/fbi-warns-artex-ai-hacking-tool-is-powering-global-cyberattacks/), the FBI released a FLASH advisory stating that multiple threat actors have weaponized the open source ARTEX framework since at least August 2026, targeting organizations across the financial, government, technology, defense, and healthcare sectors, and that a recent ConnectWise supply chain breach compromised Microsoft 365 customer environments. The advisory states ARTEX reduces the time required to chain attack techniques, with some intrusions progressing from initial targeting to privileged access in under three hours, and that the framework enables threat actors with minimal technical expertise to conduct complex multi target operations simultaneously. ARTEX is an autonomous penetration testing framework written in Go that uses AI agents for reconnaissance, vulnerability discovery, exploitation, privilege escalation, and data theft, and it integrates external LLMs including Anthropic Claude, OpenAI GPT, DeepSeek, GLM, Grok, and Kimi rather than bundling its own model. BleepingComputer reported that ARTEX was originally released on GitHub in July 2026 by a developer known as Autumn-27, who removed the repository on October 8 after reports of abuse, yet the framework persists through community forks, archived copies, localized versions, and a commercial edition called ARTEX PRO. The FBI advisory notes ARTEX is especially effective against overlooked systems such as partner portals, employee applications, legacy services, and third party integrations, and as of early November researchers had identified more than 1,600 publicly exposed ARTEX consoles with the real number believed to be significantly higher.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Framework automates exploitation of partner portals, legacy services, and third party integrations |
| Valid Accounts | T1078 | Documented progression to privileged access enabling Microsoft 365 customer environment compromise |

## IOCs

### Domains

_No concrete IOCs published in the FBI FLASH summary as reported; exposed console count is an aggregate and not a machine actionable indicator._

### Full URL Paths

_No concrete IOCs published in the FBI FLASH summary as reported; exposed console count is an aggregate and not a machine actionable indicator._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
ConnectWise
Microsoft 365 customer environments
Internet facing partner portals, employee applications, and legacy services
```

## Detection Recommendations

Hunt for the large volumes of suspicious reconnaissance traffic ARTEX generates, which the FBI notes can trigger alerts but may leave too little response time. Monitor partner portals, employee facing applications, legacy services, and third party integrations for automated probing since those are the framework's favored entry points. Review ConnectWise and Microsoft 365 access logs for anomalous privileged activity and unexpected authentication chains. Consider scanning for exposed ARTEX consoles in your environment or supply chain.

## References

- [BleepingComputer] FBI warns ARTEX AI hacking tool is powering global cyberattacks (2026-11-15) — https://www.bleepingcomputer.com/news/security/fbi-warns-artex-ai-hacking-tool-is-powering-global-cyberattacks/
