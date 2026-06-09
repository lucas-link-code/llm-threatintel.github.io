# LLM ThreatIntel Validation Report

- Run time UTC: `2026-06-09T06:54:19+00:00`
- Commit SHA: `662e6f11f8ae`
- Mode: `strict`
- Validation version: `1.0.0`
- Overall result: `pass`
- Hard failures: `0`
- Warnings: `32`
- Review required: `0`
- Reports checked: `0`
- Reports skipped: `0`
- Reports newly validated: `0`
- IOC duplicates found: `0`
- Source URLs checked: `0`

No files were removed or destructively modified.

## Findings

- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-06-01-marimo-cve-2026-39987-llm-agent-post-exploitation`: post excerpt is long (958 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-05-08-million-exposed-ai-services-security-assessment`: post excerpt is long (1019 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-05-08-claude-code-autonomous-attack-mexico-water`: post excerpt is long (1215 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-04-24-canistersprawl-teampcp-npm-lvm-platform-credential-theft`: post excerpt is long (984 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-04-05-mcp-security-crisis-30-cves-437k-downloads`: post excerpt is long (976 characters)
- **WARN** `ioc-weak-source` `data/iocs.json` `158`: IOC has weak source label: OSINT
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `213`: legacy IOC format exception retained without modifying data: namastex/automagik-genie
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `214`: legacy IOC format exception retained without modifying data: namastex/pgserve
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `216`: legacy IOC format exception retained without modifying data: xinference==2.6.0
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `217`: legacy IOC format exception retained without modifying data: xinference==2.6.1
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `218`: legacy IOC format exception retained without modifying data: xinference==2.6.2
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `219`: legacy IOC format exception retained without modifying data: chrome-extension:fnmihdojmnkclgjpcoonokmkhjpjechg
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `220`: legacy IOC format exception retained without modifying data: chrome-extension:inhcgfpbfdjbjogdfjbclgolkmhnooop
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `222`: legacy IOC format exception retained without modifying data: LiteLLM <1.83.7
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `223`: legacy IOC format exception retained without modifying data: ipfs-url-validator.vercel.app (exfiltration endpoint for early variants)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `224`: legacy IOC format exception retained without modifying data: @solana-launchpad/sdk (bait package, no malicious code)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `225`: legacy IOC format exception retained without modifying data: @validate-sdk/v2 (payload, infostealer)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `226`: legacy IOC format exception retained without modifying data: @hash-validator/v2 (early variant, JavaScript infostealer)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `227`: legacy IOC format exception retained without modifying data: aes-create-ipheriv (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `228`: legacy IOC format exception retained without modifying data: jito-proper-excutor (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `229`: legacy IOC format exception retained without modifying data: jito-sub-aes-ipheriv (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `230`: legacy IOC format exception retained without modifying data: scraper-npm (PyPI variant, February 2026)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `231`: legacy IOC format exception retained without modifying data: langflow (all versions)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `236`: legacy IOC format exception retained without modifying data: semantic-kernel<1.39.4 (Python)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `237`: legacy IOC format exception retained without modifying data: semantic-kernel<1.71.0 (.NET)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `238`: legacy IOC format exception retained without modifying data: beta.context.ai (no longer accessible as of April 20, 2026)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `248`: legacy IOC format exception retained without modifying data: huggingface:Open-OSS/privacy-filter
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `252`: legacy IOC format exception retained without modifying data: litellm>=1.81.16,<1.83.7
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `253`: legacy IOC format exception retained without modifying data: Open-OSS/privacy-filter (Hugging Face)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `254`: legacy IOC format exception retained without modifying data: semantic-kernel<1.39.4 (Python SDK)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `267`: legacy IOC format exception retained without modifying data: Open-OSS/privacy-filter (Hugging Face repository)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `268`: legacy IOC format exception retained without modifying data: litellm (versions 1.81.16 to 1.83.6)
