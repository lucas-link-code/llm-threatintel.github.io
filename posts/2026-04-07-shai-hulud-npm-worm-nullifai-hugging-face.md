# Shai-hulud npm Registry Worm and nullifAI Hugging Face Malware: AI Supply Chain Under Siege

**Date:** 2026-04-07
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

ReversingLabs documented Shai-hulud, the first self-replicating registry-native worm operating at scale within npm, compromising nearly 1,000 packages with over 100 million lifetime downloads across two waves. Separately, the nullifAI technique demonstrated that malicious ML models can bypass Hugging Face security scanning using corrupted Pickle files. Organizations consuming npm packages should audit lockfiles for compromised packages including @ctrl/tinycolor, @asyncapi/specs, ngx-bootstrap, and ng2-file-upload. ML teams loading models from Hugging Face should implement pre-execution scanning beyond platform-provided safety checks.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Shai-hulud npm Worm / nullifAI ML Model Malware |
| Attribution | Unknown (confidence: none) |
| Target | JavaScript/Node.js developers (Shai-hulud), ML engineers and data scientists (nullifAI) |
| Vector | Compromised npm developer accounts, malicious Hugging Face model uploads |
| Status | active |
| First Observed | 2025-09 |

## Detailed Findings

According to ReversingLabs, Shai-hulud represents the first known registry-native, self-propagating worm targeting the npm ecosystem. The worm exploits compromised npm developer accounts to inject malicious code into packages those accounts maintain, then spreads automatically via package interdependencies.

ReversingLabs documented two distinct attack waves. The first wave in September 2025 compromised hundreds of npm packages including @ctrl/tinycolor (2.2 million weekly downloads), ngx-bootstrap (300,000 weekly downloads), and ng2-file-upload (100,000 weekly downloads). A known compromised account is the highly reputed maintainer ~qix, whose credentials were obtained through phishing.

The second wave in November 2025, designated "Shai-hulud 2.0" or "The Second Coming," escalated dramatically, compromising 795 npm packages with over 100 million lifetime downloads. ReversingLabs identified the @asyncapi/specs package (100+ million lifetime downloads, 1.4 million weekly downloads) as "patient zero" for this wave. The 2.0 variant added wiper functionality that deletes user data folders in addition to the original credential harvesting capabilities.

The malware steals cloud service secrets and credentials for npm, GitHub, AWS, and GCP. It exfiltrates stolen tokens to attacker-controlled GitHub repositories and exposes private code repositories.

ReversingLabs' 2026 Software Supply Chain Security Report published January 27, 2026 found a 73% increase in malicious open-source packages in 2025, with malicious activity on npm more than doubling and accounting for nearly 90% of all detected open-source malware.

Separately, ReversingLabs discovered the nullifAI technique targeting ML models hosted on Hugging Face. The attack uses corrupted or "broken" Pickle files, a common but unsafe Python serialization format for ML models, to deliver malware that bypasses Hugging Face's Picklescan security scanning mechanisms. Two malicious ML models were identified on Hugging Face in early 2025 that were not flagged as "unsafe" by existing security tools. Hugging Face was notified and removed the affected models. While the discovered models appeared to be proof-of-concept, the technique demonstrates a viable attack path for arbitrary code execution through AI model distribution platforms.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies | T1195.001 | Compromised npm maintainer accounts used to inject worm code into legitimate packages |
| Supply Chain Compromise | T1195.002 | Malicious ML models uploaded to Hugging Face platform |
| Unsecured Credentials | T1552 | Harvesting npm, GitHub, AWS, GCP tokens from developer environments |
| Data Destruction | T1485 | Shai-hulud 2.0 wiper functionality deleting user data folders |
| Valid Accounts | T1078 | Phished maintainer credentials enabling package modifications |
| Automated Collection | T1119 | Self-propagating worm spreading through package dependency chains |

## IOCs

### Domains

*No specific C2 domains published by ReversingLabs. Exfiltration conducted via attacker-controlled GitHub repositories.*

### Full URL Paths

*No full URL paths published.*

### Splunk Format

*No domain or URL IOCs available for Splunk query.*

### File Hashes

*No specific file hashes published in the referenced reports.*

### Package Indicators

```
npm:@ctrl/tinycolor (compromised versions)
npm:@asyncapi/specs (compromised versions)
npm:ngx-bootstrap (compromised versions)
npm:ng2-file-upload (compromised versions)
```

## Detection Recommendations

Audit npm lockfiles and node_modules for packages maintained by known compromised accounts, particularly ~qix. Run npm audit and check for advisories related to Shai-hulud-linked packages. Monitor CI/CD pipeline logs for unexpected modifications to package-lock.json or yarn.lock files. In EDR telemetry, hunt for Node.js processes making outbound connections to GitHub API endpoints that are not part of normal development workflows. For Hugging Face model security, implement pre-execution scanning of Pickle files using tools beyond Picklescan, validate model integrity against known-good checksums, and restrict model loading to verified organization accounts. Monitor for anomalous data folder deletions on developer workstations that may indicate Shai-hulud 2.0 wiper execution.

## References

- [ReversingLabs] Shai-Hulud npm supply chain attack: What you need to know (2025-09) — https://www.reversinglabs.com/blog/shai-hulud-worm-npm
- [ReversingLabs] Shai-hulud 2.0 is spreading. Here is what you need to know (2025-11) — https://www.reversinglabs.com/blog/new-shai-hulud-worm-spreads-what-to-know
- [ReversingLabs] 2026 Software Supply Chain Security Report (2026-01-27) — https://www.reversinglabs.com/blog/sscs-report-2026-takeaways
- [ReversingLabs] Malicious ML models discovered on Hugging Face platform (2025-02) — https://reversinglabs.com/blog/rl-identifies-malware-ml-model-hosted-on-hugging-face
