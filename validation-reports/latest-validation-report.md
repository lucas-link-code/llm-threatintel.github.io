# LLM ThreatIntel Validation Report

- Run time UTC: `2026-05-17T13:39:03+00:00`
- Commit SHA: `63a4503d6652`
- Mode: `full`
- Validation version: `1.0.0`
- Overall result: `pass`
- Hard failures: `0`
- Warnings: `41`
- Review required: `5`
- Reports checked: `5`
- Reports skipped: `96`
- Reports newly validated: `0`
- IOC duplicates found: `4`
- Source URLs checked: `28`

No files were removed or destructively modified.

## Findings

- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-05-08-million-exposed-ai-services-security-assessment`: post excerpt is long (1019 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-05-08-claude-code-autonomous-attack-mexico-water`: post excerpt is long (1215 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-04-24-canistersprawl-teampcp-npm-lvm-platform-credential-theft`: post excerpt is long (984 characters)
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-04-17-azure-devops-mcp-auth-bypass-cve-2026-32211`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-04-17-flowise-cve-2025-59528-active-rce-exploitation`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-04-05-mercor-data-vendor-ai-training-breach`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-04-05-mcp-security-crisis-30-cves-437k-downloads`: post excerpt is long (976 characters)
- **WARN** `ioc-weak-source` `data/iocs.json` `55`: IOC has weak source label: OSINT
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `110`: legacy IOC format exception retained without modifying data: namastex/automagik-genie
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `111`: legacy IOC format exception retained without modifying data: namastex/pgserve
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `113`: legacy IOC format exception retained without modifying data: xinference==2.6.0
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `114`: legacy IOC format exception retained without modifying data: xinference==2.6.1
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `115`: legacy IOC format exception retained without modifying data: xinference==2.6.2
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `116`: legacy IOC format exception retained without modifying data: chrome-extension:fnmihdojmnkclgjpcoonokmkhjpjechg
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `117`: legacy IOC format exception retained without modifying data: chrome-extension:inhcgfpbfdjbjogdfjbclgolkmhnooop
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `120`: legacy IOC format exception retained without modifying data: LiteLLM <1.83.7
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `121`: legacy IOC format exception retained without modifying data: ipfs-url-validator.vercel.app (exfiltration endpoint for early variants)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `122`: legacy IOC format exception retained without modifying data: @solana-launchpad/sdk (bait package, no malicious code)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `123`: legacy IOC format exception retained without modifying data: @validate-sdk/v2 (payload, infostealer)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `124`: legacy IOC format exception retained without modifying data: @hash-validator/v2 (early variant, JavaScript infostealer)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `125`: legacy IOC format exception retained without modifying data: aes-create-ipheriv (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `126`: legacy IOC format exception retained without modifying data: jito-proper-excutor (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `127`: legacy IOC format exception retained without modifying data: jito-sub-aes-ipheriv (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `128`: legacy IOC format exception retained without modifying data: scraper-npm (PyPI variant, February 2026)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `129`: legacy IOC format exception retained without modifying data: claude.ai/new?q=[INJECTION_PAYLOAD] (injection vector)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `130`: legacy IOC format exception retained without modifying data: claude.com/redirect/ (open redirect flaw, any URL parameter)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `131`: legacy IOC format exception retained without modifying data: api.anthropic.com/v1/files (Files API used for exfiltration)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `132`: legacy IOC format exception retained without modifying data: langflow (all versions)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `139`: legacy IOC format exception retained without modifying data: semantic-kernel<1.39.4 (Python)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `140`: legacy IOC format exception retained without modifying data: semantic-kernel<1.71.0 (.NET)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `141`: legacy IOC format exception retained without modifying data: beta.context.ai (no longer accessible as of April 20, 2026)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `151`: legacy IOC format exception retained without modifying data: huggingface:Open-OSS/privacy-filter
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `155`: legacy IOC format exception retained without modifying data: litellm>=1.81.16,<1.83.7
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `157`: legacy IOC format exception retained without modifying data: Open-OSS/privacy-filter (Hugging Face)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `158`: legacy IOC format exception retained without modifying data: 575+ trojanized OpenClaw agent skills
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `159`: legacy IOC format exception retained without modifying data: 352,000+ unsafe/suspicious Hugging Face models
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `160`: legacy IOC format exception retained without modifying data: semantic-kernel<1.39.4 (Python SDK)
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: flowise appears 2 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: huggingface.co/open-oss/privacy-filter appears 3 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: huggingface.co/open-oss/privacy-filter/blob/main/loader.py appears 2 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: recargapopular.com appears 2 times
- **REVIEW** `evidence-source-review-required` `posts/2026-05-17-comment-and-control-claude-code-gemini-github-copilot-prompt-injection.md` `2026-05-17-comment-and-control-claude-code-gemini-github-copilot-prompt-injection`: no source URL was accessible; manual review or alternate evidence is required
- **REVIEW** `evidence-source-review-required` `posts/2026-05-17-openai-tanstack-supply-chain-breach-may-2026.md` `2026-05-17-openai-tanstack-supply-chain-breach-may-2026`: no source URL was accessible; manual review or alternate evidence is required
- **REVIEW** `evidence-source-review-required` `posts/2026-05-16-mini-shai-hulud-tanstack-mistral-ai-teampcp-may-2026.md` `2026-05-16-mini-shai-hulud-tanstack-mistral-ai-teampcp-may-2026`: no source URL was accessible; manual review or alternate evidence is required
- **REVIEW** `evidence-source-review-required` `posts/2026-05-16-grok-bankrbot-morse-code-prompt-injection-may-2026.md` `2026-05-16-grok-bankrbot-morse-code-prompt-injection-may-2026`: no source URL was accessible; manual review or alternate evidence is required
- **REVIEW** `evidence-source-review-required` `posts/2026-05-16-google-ads-claude-ai-shared-chat-macos-malware-may-2026.md` `2026-05-16-google-ads-claude-ai-shared-chat-macos-malware-may-2026`: no source URL was accessible; manual review or alternate evidence is required

## Duplicate IOC Review

### `flowise`
- `flowise` type `package` campaign `flowise-rce-cve-2025-59528-april-2026` source `BleepingComputer`
- `Flowise` type `package` campaign `million-exposed-ai-services-security-assessment` source `The Hacker News`

### `huggingface.co/open-oss/privacy-filter`
- `huggingface.co/Open-OSS/privacy-filter` type `url_path` campaign `open-oss-privacy-filter-huggingface-sefirah-typosquat` source `HiddenLayer`
- `https://huggingface.co/Open-OSS/privacy-filter` type `url_path` campaign `openclawhugging-face-supply-chain-poisoning-malicious-skills-models` source `TechNext Web`
- `huggingface.co/Open-OSS/privacy-filter` type `url_path` campaign `hugging-face-fake-openai-privacy-filter-sefirah-may-2026` source `HiddenLayer`

### `huggingface.co/open-oss/privacy-filter/blob/main/loader.py`
- `huggingface.co/Open-OSS/privacy-filter/blob/main/loader.py` type `url_path` campaign `open-oss-privacy-filter-huggingface-sefirah-typosquat` source `HiddenLayer`
- `huggingface.co/Open-OSS/privacy-filter/blob/main/loader.py` type `url_path` campaign `hugging-face-fake-openai-privacy-filter-sefirah-may-2026` source `HiddenLayer`

### `recargapopular.com`
- `recargapopular.com` type `domain` campaign `open-oss-privacy-filter-huggingface-sefirah-typosquat` source `BleepingComputer`
- `recargapopular.com` type `domain` campaign `hugging-face-fake-openai-privacy-filter-sefirah-may-2026` source `HiddenLayer`

## Human Review Queue

```text
Report: 2026-05-17-comment-and-control-claude-code-gemini-github-copilot-prompt-injection
Problem: evidence-source-review-required
Validator finding: no source URL was accessible; manual review or alternate evidence is required
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```

```text
Report: 2026-05-17-openai-tanstack-supply-chain-breach-may-2026
Problem: evidence-source-review-required
Validator finding: no source URL was accessible; manual review or alternate evidence is required
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```

```text
Report: 2026-05-16-mini-shai-hulud-tanstack-mistral-ai-teampcp-may-2026
Problem: evidence-source-review-required
Validator finding: no source URL was accessible; manual review or alternate evidence is required
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```

```text
Report: 2026-05-16-grok-bankrbot-morse-code-prompt-injection-may-2026
Problem: evidence-source-review-required
Validator finding: no source URL was accessible; manual review or alternate evidence is required
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```

```text
Report: 2026-05-16-google-ads-claude-ai-shared-chat-macos-malware-may-2026
Problem: evidence-source-review-required
Validator finding: no source URL was accessible; manual review or alternate evidence is required
Recommended options:
[ ] Keep report and add/confirm valid source
[ ] Add manual evidence override
[ ] Rewrite report with supported claims only
[ ] Mark report as unverified
[ ] Remove report from feed after Lucas approval
```
