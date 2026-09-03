# LLM ThreatIntel Validation Report

- Run time UTC: `2026-09-02T16:37:18+00:00`
- Commit SHA: `8d1807e79a54`
- Mode: `full`
- Validation version: `1.0.0`
- Overall result: `pass`
- Hard failures: `0`
- Warnings: `4`
- Review required: `3`
- Reports checked: `5`
- Reports skipped: `236`
- Reports newly validated: `5`
- IOC duplicates found: `0`
- Source URLs checked: `19`

No files were removed or destructively modified.

## Findings

- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-08-19-hugging-face-autonomous-agent-breach-openai-gpt`: post excerpt is long (911 characters)
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-08-15-taiwan-autonomous-ai-agent-nuclear-attack-hermes-openclaw`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-07-26-nation-state-llm-operationalization-gtig-2026`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-06-30-cordyceps-cicd-github-actions-supply-chain-vulnerability-june-2026`: post excerpt is long (1205 characters)
- **REVIEW** `evidence-url-review` `posts/2026-08-30-claude-opus-gym-booking-api-exploit-aug-25.md` `2026-08-30-claude-opus-gym-booking-api-exploit-aug-25`: 1 source URL(s) require review
- **REVIEW** `evidence-url-review` `posts/2026-08-30-claude-opus-4-6-jailbreak-sexual-content-aug-21.md` `2026-08-30-claude-opus-4-6-jailbreak-sexual-content-aug-21`: 2 source URL(s) require review
- **REVIEW** `evidence-url-review` `posts/2026-08-30-tamperbench-open-weight-llm-safety-removal-aug-2026.md` `2026-08-30-tamperbench-open-weight-llm-safety-removal-aug-2026`: 1 source URL(s) require review

## Human Review Queue

```text
Report: 2026-08-30-claude-opus-gym-booking-api-exploit-aug-25
Problem: evidence-url-review
Validator finding: 1 source URL(s) require review
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```

```text
Report: 2026-08-30-claude-opus-4-6-jailbreak-sexual-content-aug-21
Problem: evidence-url-review
Validator finding: 2 source URL(s) require review
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```

```text
Report: 2026-08-30-tamperbench-open-weight-llm-safety-removal-aug-2026
Problem: evidence-url-review
Validator finding: 1 source URL(s) require review
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```
