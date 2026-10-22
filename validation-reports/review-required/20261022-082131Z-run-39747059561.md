# LLM ThreatIntel Validation Report

- Run time UTC: `2026-10-22T08:21:31+00:00`
- Commit SHA: `23b0b589743241e84c457f2a721ce42b76814066`
- Mode: `full`
- Validation version: `1.0.0`
- Overall result: `fail`
- Hard failures: `1`
- Warnings: `4`
- Review required: `1`
- Reports checked: `4`
- Reports skipped: `353`
- Reports newly validated: `3`
- IOC duplicates found: `0`
- Source URLs checked: `4`

No files were removed or destructively modified.

## Findings

- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-08-19-hugging-face-autonomous-agent-breach-openai-gpt`: post excerpt is long (911 characters)
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-08-15-taiwan-autonomous-ai-agent-nuclear-attack-hermes-openclaw`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-07-26-nation-state-llm-operationalization-gtig-2026`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-06-30-cordyceps-cicd-github-actions-supply-chain-vulnerability-june-2026`: post excerpt is long (1205 characters)
- **FAIL** `ioc-hash-format` `data/iocs.json` `784`: hash IOC must be hex: sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
- **REVIEW** `evidence-source-review-required` `posts/2026-10-19-stable-diffusion-webui-cve-2026-111986-yaml-sidecar-rce.md` `2026-10-19-stable-diffusion-webui-cve-2026-111986-yaml-sidecar-rce`: no source URL was accessible; manual review or alternate evidence is required

## Hard Failure Queue

```text
File: data/iocs.json
Record: 784
Problem: ioc-hash-format
Validator finding: hash IOC must be hex: sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
IOC value: sha256:1bbcb1443bc962e45f5aad53fe3d2c30600e0379715fb6c664cdd3ac126c339e
IOC type: hash
Status: active
Campaign: litellm-release-pipeline-compromise-v1-107-0
Source: LiteLLM
Context: LiteLLM Release Pipeline Compromise Pushes Malicious v1.107.0 to PyPI, Docker Hub, and GHCR
Recommended action:
[ ] Correct the structured value/type
[ ] Remove non-actionable narrative labels from IOC data
[ ] Add a policy exception only if Lucas explicitly approves it
```

## Human Review Queue

```text
Report: 2026-10-19-stable-diffusion-webui-cve-2026-111986-yaml-sidecar-rce
Problem: evidence-source-review-required
Validator finding: no source URL was accessible; manual review or alternate evidence is required
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```
