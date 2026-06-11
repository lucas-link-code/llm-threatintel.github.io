# Miasma Supply Chain Attack: Azure Repositories Disabled, Credential-Stealing Worm in Red Hat npm Packages

**Date:** 2026-06-11
**Tags:** supply-chain, malware

## Executive Summary

The Miasma supply chain attack crossed two new boundaries between June 5 and June 7, 2026. On June 5, a recompromised contributor account pushed a malicious commit into Microsoft's Azure/durabletask GitHub repository, planting configuration files that execute a credential-harvesting payload the moment a developer opens the repository in Claude Code, Gemini CLI, Cursor, or VS Code. GitHub's automated enforcement disabled 73 repositories across four Microsoft GitHub organizations in a 105-second sweep. On 1 June 2026, Wiz Research identified a supply chain compromise affecting multiple packages published under the @redhat-cloud-services npm namespace. Investigation revealed that at least 32 package releases contained unauthorized modifications.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Miasma: The Spreading Blight |
| Attribution | Mini Shai-Hulud lineage; TeamPCP (primary), possible copycat actors from open-sourced code (May 12, 2026) (confidence: high) |
| Target | Red Hat npm ecosystem users (80,000-117,000 weekly downloads), Microsoft Azure infrastructure and developers, npm package maintainers with OIDC publishing rights, cloud and CI/CD teams |
| Vector | Compromised GitHub employee account + OIDC-based publishing; npm preinstall hooks and GitHub Actions workflows; MCP configuration poisoning via repository files |
| Status | active |
| First Observed | 2026-06-01 |

## Detailed Findings

On June 1, 2026, researchers identified malicious code embedded in at least 32 package releases published under the @redhat-cloud-services npm namespace, a set of frontend components and API clients that power the Red Hat Hybrid Cloud Console. The compromised releases carry a preinstall script that runs an obfuscated payload the moment a package is installed, harvesting developer and cloud credentials and attempting to spread itself to other packages the victim can publish. Microsoft Threat Intelligence identified a large-scale npm supply chain attack affecting 32 maliciously modified packages across more than 90 versions under the @redhat-cloud-services npm scope. The compromise originated from the upstream RedHatInsights/javascript-clients Continuous Integration and Continuous Delivery (CI/CD) pipeline, allowing attackers to publish trojanized packages through the legitimate GitHub Actions OpenID Connect (OIDC) publishing workflow. As a result, the malicious packages carried authentic provenance signatures while embedding the campaign marker "Miasma: The Spreading Blight." Once installed, the trojanized packages triggered an npm preinstall hook that executed a heavily obfuscated 4.29 MB dropper script. One of the main changes in this new variant is the addition of new data collectors focused on cloud identities. Specifically, collectors for GCP and Azure identities were added that collect all identities the infected machine has access to. While previous versions of the malware primarily focused on extracting secrets from these environments, this variant suggests an increased attacker focus on gaining and leveraging access to the cloud itself. A recompromised contributor account pushed a malicious commit into Microsoft's Azure/durabletask GitHub repository, planting configuration files that execute a credential-harvesting payload the moment a developer opens the repository in Claude Code, Gemini CLI, Cursor, or VS Code. The Hades variant uses Python .pth startup hooks to execute a Bun-powered JavaScript credential stealer on every Python interpreter startup, without the victim ever importing the compromised package.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise | T1195 | Compromised GitHub employee account and OIDC publishing workflow used to inject malicious code into npm packages and GitHub repositories |
| Trusted Relationship | T1199 | Abuse of GitHub Actions OIDC identity token (id-token: write) and trusted publishing mechanism to mint valid SLSA provenance attestations for malicious packages |
| Credential Dumping | T1110.004 | 4.29 MB obfuscated payload harvests GitHub, npm, PyPI, AWS, Azure, GCP, Kubernetes, SSH, Docker, Vault credentials; scrapy GitHub Actions runner memory for ephemeral secrets |
| Code Execution via Package Manager Hook | T1547.004 | npm preinstall hook executes malicious JavaScript before standard package initialization; npm binding.gyp abuse in second wave |
| Repository Hijacking and Worm Propagation | T1098 | Malware enumerates /user/repos and /user/orgs, spreads to additional repositories with forged SLSA provenance, plants destructive triggers ('IfYouInvalidateThisTokenItWillNukeTheComputerOfTheOwner') |

## IOCs

### Domains

_First wave June 1 ~10:53 UTC, second wave ~13:44 UTC, third wave ~14:23 UTC. PyPI removed malicious versions; npm implemented namespace protections. GitHub repositories marked with description 'Miasma: The Spreading Blight' used for exfiltration._

### Full URL Paths

_First wave June 1 ~10:53 UTC, second wave ~13:44 UTC, third wave ~14:23 UTC. PyPI removed malicious versions; npm implemented namespace protections. GitHub repositories marked with description 'Miasma: The Spreading Blight' used for exfiltration._

### Splunk Format

_No IOCs available for Splunk query_

### Package Indicators

```
@redhat-cloud-services/frontend-components (7.7.2–7.7.5, 7.7.7–7.7.9)
@redhat-cloud-services/compliance-client (4.0.3–4.0.6)
@redhat-cloud-services/rbac-client (9.0.3, 9.0.4, 9.0.6)
29 additional packages in @redhat-cloud-services namespace (96 total versions)
```

## Detection Recommendations

New, unexpected repositories in your GitHub org, especially any with the description Miasma: The Spreading Blight. Unrecognized GitHub Actions workflows, particularly minimal ones that request id-token: write and trigger on push to any branch. Newly created personal access tokens, deploy keys, or npm tokens you did not create. Anomalous reads of GCP and Azure identity metadata from build runners. Monitor for npm preinstall hook execution and binding.gyp modifications during package installation. Detect GitHub Actions OIDC token requests with id-token: write permission in workflows that lack code review enforcement. Flag orphan commits that bypass branch protection rules. Scan for outbound connections to attacker-controlled GitHub repositories or hardcoded Anthropic API endpoints. Implement npm install with --ignore-scripts to prevent preinstall hooks. Use provenance verification and SBOM scanning to detect supply chain compromises.

## References

- [Wiz] Miasma: Supply Chain Attack Targeting RedHat npm Packages (2026-06-04) — https://www.wiz.io/blog/miasma-supply-chain-attack-targeting-redhat-npm-packages
- [Microsoft Security Blog] Preinstall to persistence: Inside the Red Hat npm Miasma credential-stealing campaign (2026-06-02) — https://www.microsoft.com/en-us/security/blog/2026/06/02/preinstall-persistence-inside-red-hat-npm-miasma-credential-stealing-campaign/
- [Snyk] Miasma Attack Hits Red Hat npm Packages (2026-06-01) — https://snyk.io/blog/miasma-supply-chain-attack-malicious-code-redhat-cloud-services-npm-packages/
- [Phoenix Security] Miasma Worm Reaches Microsoft Azure and PyPI: 73 Repositories Disabled, Hades Wave Drops 37 Malicious Python Wheels (2026-06-09) — https://phoenix.security/miasma-azure-hades-pypi-supply-chain-worm-2026/
