# LLM ThreatIntel Validation Report

- Run time UTC: `2026-05-21T12:03:35+00:00`
- Commit SHA: `e0e0b7050d71`
- Mode: `full`
- Validation version: `1.0.0`
- Overall result: `pass`
- Hard failures: `0`
- Warnings: `43`
- Review required: `0`
- Reports checked: `1`
- Reports skipped: `113`
- Reports newly validated: `1`
- IOC duplicates found: `5`
- Source URLs checked: `0`

No files were removed or destructively modified.

## Findings

- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-05-21-cve-2026-42208-litellm-sql-injection-active-exploit-may-2026`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-05-08-million-exposed-ai-services-security-assessment`: post excerpt is long (1019 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-05-08-claude-code-autonomous-attack-mexico-water`: post excerpt is long (1215 characters)
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-04-24-canistersprawl-teampcp-npm-lvm-platform-credential-theft`: post excerpt is long (984 characters)
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-04-17-azure-devops-mcp-auth-bypass-cve-2026-32211`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-04-17-flowise-cve-2025-59528-active-rce-exploitation`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-tlp-public-warning` `data/posts-index.json` `2026-04-05-mercor-data-vendor-ai-training-breach`: public feed post uses non-clear TLP: TLP:AMBER
- **WARN** `post-excerpt-long` `data/posts-index.json` `2026-04-05-mcp-security-crisis-30-cves-437k-downloads`: post excerpt is long (976 characters)
- **WARN** `ioc-weak-source` `data/iocs.json` `62`: IOC has weak source label: OSINT
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `117`: legacy IOC format exception retained without modifying data: namastex/automagik-genie
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `118`: legacy IOC format exception retained without modifying data: namastex/pgserve
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `120`: legacy IOC format exception retained without modifying data: xinference==2.6.0
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `121`: legacy IOC format exception retained without modifying data: xinference==2.6.1
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `122`: legacy IOC format exception retained without modifying data: xinference==2.6.2
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `123`: legacy IOC format exception retained without modifying data: chrome-extension:fnmihdojmnkclgjpcoonokmkhjpjechg
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `124`: legacy IOC format exception retained without modifying data: chrome-extension:inhcgfpbfdjbjogdfjbclgolkmhnooop
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `127`: legacy IOC format exception retained without modifying data: LiteLLM <1.83.7
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `128`: legacy IOC format exception retained without modifying data: ipfs-url-validator.vercel.app (exfiltration endpoint for early variants)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `129`: legacy IOC format exception retained without modifying data: @solana-launchpad/sdk (bait package, no malicious code)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `130`: legacy IOC format exception retained without modifying data: @validate-sdk/v2 (payload, infostealer)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `131`: legacy IOC format exception retained without modifying data: @hash-validator/v2 (early variant, JavaScript infostealer)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `132`: legacy IOC format exception retained without modifying data: aes-create-ipheriv (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `133`: legacy IOC format exception retained without modifying data: jito-proper-excutor (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `134`: legacy IOC format exception retained without modifying data: jito-sub-aes-ipheriv (rotated payload)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `135`: legacy IOC format exception retained without modifying data: scraper-npm (PyPI variant, February 2026)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `136`: legacy IOC format exception retained without modifying data: langflow (all versions)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `143`: legacy IOC format exception retained without modifying data: semantic-kernel<1.39.4 (Python)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `144`: legacy IOC format exception retained without modifying data: semantic-kernel<1.71.0 (.NET)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `145`: legacy IOC format exception retained without modifying data: beta.context.ai (no longer accessible as of April 20, 2026)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `155`: legacy IOC format exception retained without modifying data: huggingface:Open-OSS/privacy-filter
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `159`: legacy IOC format exception retained without modifying data: litellm>=1.81.16,<1.83.7
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `161`: legacy IOC format exception retained without modifying data: Open-OSS/privacy-filter (Hugging Face)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `162`: legacy IOC format exception retained without modifying data: 575+ trojanized OpenClaw agent skills
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `163`: legacy IOC format exception retained without modifying data: 352,000+ unsafe/suspicious Hugging Face models
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `164`: legacy IOC format exception retained without modifying data: semantic-kernel<1.39.4 (Python SDK)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `182`: legacy IOC format exception retained without modifying data: Open-OSS/privacy-filter (Hugging Face repository)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `183`: legacy IOC format exception retained without modifying data: OpenClaw ClawHub malicious skills (575 identified)
- **WARN** `ioc-legacy-format-exception` `data/iocs.json` `184`: legacy IOC format exception retained without modifying data: litellm (versions 1.81.16 to 1.83.6)
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: flowise appears 2 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: huggingface.co/open-oss/privacy-filter appears 3 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: huggingface.co/open-oss/privacy-filter/blob/main/loader.py appears 2 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: openui appears 2 times
- **WARN** `ioc-duplicate-review` `data/iocs.json`: duplicate IOC review required: recargapopular.com appears 2 times

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

### `openui`
- `OpenUI` type `package` campaign `million-exposed-ai-services-security-assessment` source `The Hacker News`
- `openui` type `package` campaign `intruder-1-million-exposed-ai-services-may-2026` source `Intruder Security`

### `recargapopular.com`
- `recargapopular.com` type `domain` campaign `open-oss-privacy-filter-huggingface-sefirah-typosquat` source `BleepingComputer`
- `recargapopular.com` type `domain` campaign `hugging-face-fake-openai-privacy-filter-sefirah-may-2026` source `HiddenLayer`
