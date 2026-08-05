# CrowdStrike 2026 Threat Hunting Report: STARDUST CHOLLIMA DPRK Supply Chain Campaign Targets Mastra AI Framework via npm Poisoning

**Date:** 2026-08-05
**Tags:** supply-chain, nation-state, malware

## Executive Summary

DPRK-nexus STARDUST CHOLLIMA injected a malicious npm package into 131 trusted Mastra AI frameworks. During 1H 2026, 87% of identified software registry threats involved malicious npm packages. This represents a nation-state supply chain attack targeting AI agent infrastructure used by developers globally.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | STARDUST CHOLLIMA npm Supply Chain Campaign |
| Attribution | DPRK-nexus threat actor (CrowdStrike attribution) (confidence: high) |
| Target | Developers using Mastra AI framework; organizations deploying AI agent infrastructure |
| Vector | Malicious npm package injection into Mastra framework dependencies |
| Status | active |
| First Observed | 2026-08 |

## Detailed Findings

AI Is a Tool, Target, and Force Multiplier for Adversaries: Threat actors used AI to generate payloads and shell commands, exploit AI infrastructure, and abuse enterprise LLMs – including one campaign that sent nearly 200,000 AI model requests in two minutes. CrowdStrike OverWatch also observed AI agent-triggered detection leads grew at 2.5x the rate of human-triggered leads, showing how AI is accelerating the volume and velocity of activity security teams must investigate. The STARDUST CHOLLIMA campaign demonstrates how nation-state actors are targeting the AI development supply chain, with 131 instances of poisoned Mastra framework deployments detected.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Malicious npm package targeting Mastra AI framework dependencies |
| Exploit Public-Facing Application | T1190 | DPRK nation-state actor leveraging npm package distribution channel |
| Stage Capabilities: Upload Malware | T1608.001 | Placement of malicious code in npm registry |

## IOCs

### Domains

_CrowdStrike 2026 Threat Hunting Report identifies 131 compromised instances. 87% of registry threats in H1 2026 involved npm packages._

### Full URL Paths

_CrowdStrike 2026 Threat Hunting Report identifies 131 compromised instances. 87% of registry threats in H1 2026 involved npm packages._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
{'name': 'mastra', 'registry': 'npm', 'version': 'affected', 'note': '131 instances of poisoned Mastra framework packages identified'}
```

### Affected Platforms

```
npm registry
Mastra AI framework
Node.js development environments
```

## Detection Recommendations

Monitor npm package updates for Mastra and related AI framework dependencies for unexpected changes. Implement package integrity verification using npm audit and supply chain scanning tools. Block unsigned or untrusted npm packages. Monitor for unusual outbound network activity from npm-installed dependencies. Implement Software Bill of Materials (SBOM) tracking for all AI framework dependencies. Review recent Mastra installations for indicators of compromise.

## References

- [CrowdStrike Holdings, Inc.] CrowdStrike 2026 Threat Hunting Report: AI is Now Embedded Across Modern Adversary Operations (2026-08-03) — https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-2026-threat-hunting-report-ai-now-embedded-across
