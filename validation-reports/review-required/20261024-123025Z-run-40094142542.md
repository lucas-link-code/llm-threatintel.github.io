# LLM ThreatIntel Validation Report

- Run time UTC: `2026-10-24T12:30:25+00:00`
- Commit SHA: `6c6c9501661bab91ad3061d0a5fc7902761a73e8`
- Mode: `full`
- Validation version: `1.0.0`
- Overall result: `fail`
- Hard failures: `1`
- Warnings: `4`
- Review required: `0`
- Reports checked: `2`
- Reports skipped: `359`
- Reports newly validated: `2`
- IOC duplicates found: `0`
- Source URLs checked: `4`

No files were removed or destructively modified.

## Findings

- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-08-19-hugging-face-autonomous-agent-breach-openai-gpt`: post excerpt is long (911 characters)
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-08-15-taiwan-autonomous-ai-agent-nuclear-attack-hermes-openclaw`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-07-26-nation-state-llm-operationalization-gtig-2026`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-06-30-cordyceps-cicd-github-actions-supply-chain-vulnerability-june-2026`: post excerpt is long (1205 characters)
- **FAIL** `ioc-hash-format` `data/iocs.json` `785`: hash IOC must be hex: sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e

## Hard Failure Queue

```text
File: data/iocs.json
Record: 785
Problem: ioc-hash-format
Validator finding: hash IOC must be hex: sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
IOC value: sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
IOC type: hash
Status: active
Campaign: microsoft-litellm-1-107-0-python-startup-hook-credential-theft
Source: Microsoft Security Blog
Context: Microsoft Analyzes LiteLLM 1.107.0 Credential Theft Through Python Startup Hooks
Recommended action:
[ ] Correct the structured value/type
[ ] Remove non-actionable narrative labels from IOC data
[ ] Add a policy exception only if Lucas explicitly approves it
```
