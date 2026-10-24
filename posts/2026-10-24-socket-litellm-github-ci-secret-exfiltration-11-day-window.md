# Socket Finds LiteLLM GitHub CI Secret Exfiltration 11 Days Before Malicious Release

**Date:** 2026-10-24
**Tags:** supply-chain, malicious-tool

## Executive Summary

Socket threat research found malicious GitHub Actions workflows exfiltrating the BerriAI/litellm organization CI secrets on October 10 and October 12, 2026, eleven days before the malicious v1.107.0 release, placing attacker access to the repository weeks earlier than the public disclosure. LiteLLM corroborated the finding and traced initial access to an Agent Platform master key committed to a public repository in May that was never revoked. Maintainers of AI and developer tooling repositories should audit Actions workflow history, org audit logs, and token approval events, and rotate long lived CI tokens.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | LiteLLM GitHub Organization Pre-Release Access |
| Attribution | Unknown (confidence: low) |
| Target | BerriAI/litellm repository, its CI secrets, and downstream release pipeline consumers |
| Vector | Malicious GitHub Actions workflow added to short lived branches, plus use of a leaked Agent Platform master key to obtain a GitHub org owner token |
| Status | removed |
| First Observed | 2026-10-10 |

## Detailed Findings

Socket reported that two malicious commits each added a workflow at .github/workflows/cache.yml under the subject ci: bump cache config. The first, b69bc36fd4e23b23ea09f4ce63a92b07258f5044, was committed on October 10, 2026 at 22:11:45 UTC on branch ci-tmp-a351cc and ran successfully before the branch was deleted the same day. The second, 1a6e3c1e41f1b5c8eeaeeb2ae94bcd95390fa891, followed on October 12, 2026 at 12:16 UTC on branch ci-tmp-4d8517 with a six job workflow that also ran successfully and was deleted that day. Socket assessed a compromise window of at least eleven days, from October 10 through the October 21 release attack, during which workflows built to collect and transmit the organization CI secrets ran undetected, and noted the file was absent from main at commit f2118fc. According to LiteLLM, initial access traced to an Agent Platform master key accidentally committed to a public repository in May and never revoked; the attacker used it to retrieve a GitHub organization owner token, then ran malicious workflows to steal more maintainer credentials, and audit logs link the GH_TOKEN stolen by the October 10 workflow to approval of the October 21 malicious release.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Valid Accounts | T1078 | Reused a leaked master key and stolen org owner token and GH_TOKEN to act as trusted maintainer accounts |
| Compromise Software Supply Chain | T1195.002 | Stolen maintainer credentials were used to approve the malicious v1.107.0 release |

## IOCs

### Domains

_Two values are git commit SHAs of the malicious cache.yml commits reported by Socket, not file hashes. Branches ci-tmp-a351cc and ci-tmp-4d8517 were deleted the same day each workflow ran._

### Full URL Paths

_Two values are git commit SHAs of the malicious cache.yml commits reported by Socket, not file hashes. Branches ci-tmp-a351cc and ci-tmp-4d8517 were deleted the same day each workflow ran._

### Splunk Format

_No IOCs available for Splunk query_

### File Hashes

```
b69bc36fd4e23b23ea09f4ce63a92b07258f5044
1a6e3c1e41f1b5c8eeaeeb2ae94bcd95390fa891
```

### Affected Platforms

```
GitHub Actions
GitHub organization CI secrets
BerriAI/litellm repository
```

## Detection Recommendations

Review GitHub Actions workflow run history and organization audit logs for cache.yml additions on deleted ci-tmp branches and for unexpected GH_TOKEN usage or release approval events. Audit secrets committed to public repositories and revoke any long lived master keys or platform tokens still active. Enforce branch protection and required reviewer checks on release tags, shorten CI token lifetimes, and alert on workflow files created on ephemeral branches that are deleted within the same day.

## References

- [Socket] New Evidence Shows LiteLLM Secret-Stealing Workflows Ran 11 Days Before Supply Chain Attack (2026-10-23) — https://socket.dev/blog/litellm-attack-timeline
- [LiteLLM] Contained: Oct 21, 2026 LiteLLM release v1.107.0 Compromised (2026-10-21) — https://docs.litellm.ai/blog/security-incident-oct-21-2026
