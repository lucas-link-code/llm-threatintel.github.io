# Package IOC Audit

Generated: 2026-06-13
Package IOCs reviewed: 104

## pypi:eth-security-auditor@0.1.0
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: first observed malicious package (uploaded May 22, 2026 20:20 UTC), auto-executes on import and downloads remote JavaScript for credential theft

## pypi:cryptowallet-safety
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious PyPI package posing as crypto wallet safety tool, downloads and executes remote JavaScript payload via node -e

## sui-move-build-helper
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious Crates.io package targeting Sui/Move developers, build.rs script extracts wallet keystores and exfiltrates via GitHub Gists using XOR key cargo-build

## sui-sdk-build-utils
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious Crates.io package targeting Sui ecosystem developers

## sui-framework-helpers
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious Crates.io package targeting Sui framework developers

## move-analyzer-build
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious Crates.io package targeting Move language developers

## move-compiler-tools
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious Crates.io package targeting Move language developers

## move-project-builder
- campaign: trapdoor-cross-ecosystem-crypto-stealer-ai-assistant-persistence
- source: Socket
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: TrapDoor cross-ecosystem crypto stealer: malicious Crates.io package targeting Move language developers

## praisonai
- campaign: cve-2026-44338-praisonai-auth-bypass-rapid-exploitation
- source: GitHub Advisory GHSA-6rmh-7xcm-cpxj / Sysdig Threat Research
- status: active
- first_seen: 2026-05-11
- classification: keep_clean
- proposed_action: keep_clean
- context: CVE-2026-44338 PraisonAI legacy Flask api_server.py authentication bypass; AUTH_ENABLED=False hard-coded; unauthenticated GET /agents and POST /chat on TCP/8080; affects versions 2.5.6 through 4.6.33;

## doris-mcp-server
- campaign: akamai-mcp-back-end-vulnerabilities-doris-pinot-alibaba-rds
- source: Akamai Security Intelligence Group / GitHub Advisory Database / Apache
- status: active
- first_seen: 2026-05-13
- classification: keep_clean
- proposed_action: keep_clean
- context: CVE-2025-66335 (CVSS 5.3, GHSA-qhfq-gvvc-5q6q) Apache Doris MCP Server SQL injection via exec_query db_name parameter concatenation; affects versions 0.1.0 through 0.6.0; patched in 0.6.1

## alibabacloud-rds-openapi-mcp-server
- campaign: akamai-mcp-back-end-vulnerabilities-doris-pinot-alibaba-rds
- source: Akamai Security Intelligence Group
- status: active
- first_seen: 2026-05-13
- classification: keep_clean
- proposed_action: keep_clean
- context: Unauthenticated information disclosure in Alibaba Cloud RDS OpenAPI MCP Server; RAG tool serves vector-index metadata (table names, schemas) without authenticating the caller; vendor declined to fix; 

## pypi:mistralai@2.4.6
- campaign: mini-shai-hulud-tanstack-mistral-ai-teampcp-may-2026
- source: Safedep / Microsoft / The Hacker News
- status: removed
- first_seen: 2026-05-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud Wave 5 trojanized Mistral AI Python SDK; malicious code in __init__.py executes on import, downloads stealer from 83.142.209.194, includes geofenced rm -rf / for Israel/Iran systems

## pypi:guardrails-ai@0.10.1
- campaign: mini-shai-hulud-tanstack-mistral-ai-teampcp-may-2026
- source: Safedep / The Hacker News
- status: removed
- first_seen: 2026-05-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud Wave 5 trojanized Guardrails AI validation framework; malicious code executes on import

## npm:mbt@1.2.48
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Aikido Security
- status: removed
- first_seen: 2026-04-29
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized SAP Cloud MTA Build Tool npm package

## npm:@cap-js/db-service@2.10.1
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Aikido Security
- status: removed
- first_seen: 2026-04-29
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized SAP CAP db-service npm package

## npm:@cap-js/postgres@2.2.2
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Aikido Security
- status: removed
- first_seen: 2026-04-29
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized SAP CAP postgres adapter npm package

## npm:@cap-js/sqlite@2.2.2
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Aikido Security
- status: removed
- first_seen: 2026-04-29
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized SAP CAP sqlite adapter npm package

## npm:intercom-client@7.0.4
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Socket
- status: removed
- first_seen: 2026-04-30
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized Intercom JS SDK; introduced setup.mjs and router_runtime.js absent in 7.0.3

## pypi:lightning@2.6.2
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Socket
- status: removed
- first_seen: 2026-04-30
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized PyTorch Lightning PyPI release; hidden _runtime directory and start.py loader

## pypi:lightning@2.6.3
- campaign: mini-shai-hulud-sap-cap-claude-code-sessionstart-persistence
- source: Socket
- status: removed
- first_seen: 2026-04-30
- classification: keep_clean
- proposed_action: keep_clean
- context: Mini Shai-Hulud trojanized PyTorch Lightning PyPI release; hidden _runtime directory and start.py loader

## npm:@bitwarden/cli@2026.4.0
- campaign: bitwarden-cli-teampcp-ai-coding-assistant-credential-theft
- source: Bitwarden / Socket / Palo Alto Networks Unit 42
- status: removed
- first_seen: 2026-04-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Trojanized Bitwarden CLI npm release; AI coding assistant credential targeting (Claude Code, Cursor, Aider, Kiro, Codex CLI, Gemini CLI)

## npm:kube-health-tools
- campaign: gpt-proxy-backdoor-npm-pypi-chinese-llm-relay
- source: Aikido Security
- status: active
- first_seen: 2026-05-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious npm package deploying GPT-Proxy LLM relay implant targeting Kubernetes environments

## pypi:kube-node-health
- campaign: gpt-proxy-backdoor-npm-pypi-chinese-llm-relay
- source: Snyk
- status: active
- first_seen: 2026-05-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious PyPI package deploying GPT-Proxy LLM relay implant targeting Kubernetes environments

## npm:gemini-ai-checker
- campaign: ottercookie-fake-gemini-npm-ai-coding-tool-theft
- source: GBHackers
- status: removed
- first_seen: 2026-05-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Fake Gemini token verifier npm package delivering OtterCookie backdoor targeting AI coding tools

## npm:express-flowlimit
- campaign: ottercookie-fake-gemini-npm-ai-coding-tool-theft
- source: Cyber and Ramen
- status: active
- first_seen: 2026-05-01
- classification: keep_clean
- proposed_action: keep_clean
- context: OtterCookie sibling malicious npm package sharing same Vercel C2 infrastructure

## npm:chai-extensions-extras
- campaign: ottercookie-fake-gemini-npm-ai-coding-tool-theft
- source: Cyber and Ramen
- status: active
- first_seen: 2026-05-01
- classification: keep_clean
- proposed_action: keep_clean
- context: OtterCookie sibling malicious npm package sharing same Vercel C2 infrastructure

## nginx-ui
- campaign: cve-2026-33032-mcpwn-nginx-ui-mcp-auth-bypass
- source: Rapid7
- status: active
- first_seen: 2026-05-01
- classification: keep_clean
- proposed_action: keep_clean
- context: CVE-2026-33032 MCPwn: nginx-ui versions <=2.3.5 vulnerable to unauthenticated MCP tool invocation

## npm:@ctrl/tinycolor
- campaign: shai-hulud-npm-worm-nullifai-hugging-face
- source: ReversingLabs
- status: active
- first_seen: 2025-09-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Shai-hulud worm compromised package with 2.2M weekly downloads

## npm:@asyncapi/specs
- campaign: shai-hulud-npm-worm-nullifai-hugging-face
- source: ReversingLabs
- status: active
- first_seen: 2025-11-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Shai-hulud 2.0 patient zero package with 100M+ lifetime downloads

## ngx-bootstrap
- campaign: shai-hulud-npm-worm-nullifai-hugging-face
- source: ReversingLabs
- status: active
- first_seen: 2025-09-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Shai-hulud worm compromised package with 300K weekly downloads

## ng2-file-upload
- campaign: shai-hulud-npm-worm-nullifai-hugging-face
- source: ReversingLabs
- status: active
- first_seen: 2025-09-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Shai-hulud worm compromised package with 100K weekly downloads

## axios@1.14.1
- campaign: axios-npm-supply-chain-unc1069-waveshaper-2026
- source: Google Cloud Security
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Axios npm Supply Chain Attack: North Korea-Linked UNC1069 Deploys Cross-Platform RAT via Hijacked Maintainer Account

## axios@0.30.4
- campaign: axios-npm-supply-chain-unc1069-waveshaper-2026
- source: Google Cloud Security
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Axios npm Supply Chain Attack: North Korea-Linked UNC1069 Deploys Cross-Platform RAT via Hijacked Maintainer Account

## plain-crypto-js@4.2.1
- campaign: axios-npm-supply-chain-unc1069-waveshaper-2026
- source: Google Cloud Security
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: Axios npm Supply Chain Attack: North Korea-Linked UNC1069 Deploys Cross-Platform RAT via Hijacked Maintainer Account

## litellm@1.82.7
- campaign: teampcp-supply-chain-campaign-ai-infrastructure-2026
- source: Datadog Security Labs
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: TeamPCP Multi-Stage Supply Chain Campaign Targets AI Infrastructure: LiteLLM, Telnyx, and Trivy Compromised

## litellm@1.82.8
- campaign: teampcp-supply-chain-campaign-ai-infrastructure-2026
- source: Datadog Security Labs
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: TeamPCP Multi-Stage Supply Chain Campaign Targets AI Infrastructure: LiteLLM, Telnyx, and Trivy Compromised

## telnyx@4.87.1
- campaign: teampcp-supply-chain-campaign-ai-infrastructure-2026
- source: Datadog Security Labs
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: TeamPCP Multi-Stage Supply Chain Campaign Targets AI Infrastructure: LiteLLM, Telnyx, and Trivy Compromised

## telnyx@4.87.2
- campaign: teampcp-supply-chain-campaign-ai-infrastructure-2026
- source: Datadog Security Labs
- status: active
- first_seen: 2026-04-01
- classification: keep_clean
- proposed_action: keep_clean
- context: TeamPCP Multi-Stage Supply Chain Campaign Targets AI Infrastructure: LiteLLM, Telnyx, and Trivy Compromised

## claude-code@2.1.88
- campaign: claude-code-source-leak-adversa-post-leak-rce
- source: SecurityWeek
- status: active
- first_seen: 2026-04-05
- classification: keep_clean
- proposed_action: keep_clean
- context: Claude Code Source Leak Followed by Critical Post-Leak RCE: Sourcemap Exposure and Prompt Injection Vulnerability (CVE Pending)

## marimo
- campaign: marimo-preauth-rce-ai-dev-infrastructure
- source: Cloud Security Alliance AI Safety Initiative
- status: active
- first_seen: 2026-04-13
- classification: keep_clean
- proposed_action: keep_clean
- context: Marimo Pre-Authentication RCE (CVE-2026-39987): Critical AI Development Toolchain Compromise via WebSocket Terminal

## praisonaiagents
- campaign: praisonaiagents-ssrf-cloud-metadata
- source: OffSeq Threat Radar
- status: active
- first_seen: 2026-04-13
- classification: keep_clean
- proposed_action: keep_clean
- context: PraisonAIAgents SSRF Vulnerability (CVE-2026-40160): Cloud Metadata Access via Malicious URL Crawling

## sub2api
- campaign: malicious-llm-router-credential-theft-crypto-wallet-drain
- source: arXiv
- status: active
- first_seen: 2026-04-16
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious LLM Router Infrastructure Compromise: 26 Routers Injecting Malicious Code and Stealing Credentials via AI Agent Intermediaries

## new-api
- campaign: malicious-llm-router-credential-theft-crypto-wallet-drain
- source: arXiv
- status: active
- first_seen: 2026-04-16
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious LLM Router Infrastructure Compromise: 26 Routers Injecting Malicious Code and Stealing Credentials via AI Agent Intermediaries

## one-api
- campaign: malicious-llm-router-credential-theft-crypto-wallet-drain
- source: arXiv
- status: active
- first_seen: 2026-04-16
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious LLM Router Infrastructure Compromise: 26 Routers Injecting Malicious Code and Stealing Credentials via AI Agent Intermediaries

## mcp-inspector
- campaign: anthropic-mcp-stdio-rce-7k-servers
- source: The Hacker News
- status: active
- first_seen: 2026-04-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Design Vulnerability Enables Unauthenticated RCE Across 7,000+ Servers

## librechat
- campaign: anthropic-mcp-stdio-rce-7k-servers
- source: The Hacker News
- status: active
- first_seen: 2026-04-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Design Vulnerability Enables Unauthenticated RCE Across 7,000+ Servers

## weknora
- campaign: anthropic-mcp-stdio-rce-7k-servers
- source: The Hacker News
- status: active
- first_seen: 2026-04-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Design Vulnerability Enables Unauthenticated RCE Across 7,000+ Servers

## npm:@akoskm/create-mcp-server-stdio
- campaign: anthropic-mcp-stdio-rce-7k-servers
- source: The Hacker News
- status: active
- first_seen: 2026-04-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Design Vulnerability Enables Unauthenticated RCE Across 7,000+ Servers

## cursor-mcp
- campaign: anthropic-mcp-stdio-rce-7k-servers
- source: The Hacker News
- status: active
- first_seen: 2026-04-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Design Vulnerability Enables Unauthenticated RCE Across 7,000+ Servers

## npm:namastex/automagik-genie
- campaign: canistersprawl-teampcp-npm-lvm-platform-credential-theft
- source: SC Media / Socket Research
- status: active
- first_seen: 2026-04-24
- classification: keep_clean
- proposed_action: keep_clean
- context: CanisterSprawl: TeamPCP npm Supply Chain Campaign Targeting LLM Platforms with 22 Compromised Packages

## npm:namastex/pgserve
- campaign: canistersprawl-teampcp-npm-lvm-platform-credential-theft
- source: SC Media / Socket Research
- status: active
- first_seen: 2026-04-24
- classification: keep_clean
- proposed_action: keep_clean
- context: CanisterSprawl: TeamPCP npm Supply Chain Campaign Targeting LLM Platforms with 22 Compromised Packages

## openclaw
- campaign: cve-2026-41349-openclaw-consent-bypass-agentic-rce
- source: The Hacker Wire
- status: active
- first_seen: 2026-04-24
- classification: keep_clean
- proposed_action: keep_clean
- context: CVE-2026-41349: OpenClaw Agentic Consent Bypass Allows Unauthorized Agent Execution Without User Approval

## pypi:xinference@2.6.0
- campaign: xinference-teampcp-self-propagating-stealer
- source: The Hacker News
- status: active
- first_seen: 2026-04-25
- classification: keep_clean
- proposed_action: keep_clean
- context: Xinference PyPI Poisoning: Self-Propagating Credential Stealer via TeamPCP Supply Chain Campaign

## pypi:xinference@2.6.1
- campaign: xinference-teampcp-self-propagating-stealer
- source: The Hacker News
- status: active
- first_seen: 2026-04-25
- classification: keep_clean
- proposed_action: keep_clean
- context: Xinference PyPI Poisoning: Self-Propagating Credential Stealer via TeamPCP Supply Chain Campaign

## pypi:xinference@2.6.2
- campaign: xinference-teampcp-self-propagating-stealer
- source: The Hacker News
- status: active
- first_seen: 2026-04-25
- classification: keep_clean
- proposed_action: keep_clean
- context: Xinference PyPI Poisoning: Self-Propagating Credential Stealer via TeamPCP Supply Chain Campaign

## chrome-extension:fnmihdojmnkclgjpcoonokmkhjpjechg
- campaign: malicious-browser-extensions-harvesting-llm-chats
- source: Cryptika Cybersecurity
- status: active
- first_seen: 2026-04-07
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious AI sidebar Chrome extension harvesting ChatGPT and DeepSeek chat histories

## chrome-extension:inhcgfpbfdjbjogdfjbclgolkmhnooop
- campaign: malicious-browser-extensions-harvesting-llm-chats
- source: Cryptika Cybersecurity
- status: active
- first_seen: 2026-04-07
- classification: keep_clean
- proposed_action: keep_clean
- context: Malicious AI sidebar Chrome extension harvesting ChatGPT and DeepSeek chat histories

## npm:@solana-launchpad/sdk
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | bait package, no malicious code

## npm:@validate-sdk/v2
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | payload, infostealer

## npm:@hash-validator/v2
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | early variant, JavaScript infostealer

## aes-create-ipheriv
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | rotated payload

## jito-proper-excutor
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | rotated payload

## jito-sub-aes-ipheriv
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | rotated payload

## pypi:scraper-npm
- campaign: promptmink-famous-chollima-ai-agent-supply-chain
- source: ReversingLabs
- status: active
- first_seen: 2026-05-06
- classification: keep_clean
- proposed_action: keep_clean
- context: PromptMink: North Korean Supply Chain Campaign Weaponizes AI Coding Agents via LLM Optimization Abuse—Claude Opus Compromised to Install Malicious Dependencies | PyPI variant, February 2026

## gpt-researcher
- campaign: anthropic-mcp-stdio-rce-design-flaw
- source: OX Security Blog
- status: active
- first_seen: 2026-05-08
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Architectural RCE Flaw Exposes 150M+ Downloads and 7,000+ Servers to Command Injection

## upsonic
- campaign: anthropic-mcp-stdio-rce-design-flaw
- source: OX Security Blog
- status: active
- first_seen: 2026-05-08
- classification: keep_clean
- proposed_action: keep_clean
- context: Anthropic MCP Architectural RCE Flaw Exposes 150M+ Downloads and 7,000+ Servers to Command Injection

## n8n
- campaign: million-exposed-ai-services-security-assessment
- source: The Hacker News
- status: active
- first_seen: 2026-05-08
- classification: keep_clean
- proposed_action: keep_clean
- context: Massive Exposure of 1 Million AI Services Reveals Critical Misconfiguration and Security Debt in Production AI Infrastructure

## LangFlow
- campaign: million-exposed-ai-services-security-assessment
- source: The Hacker News
- status: active
- first_seen: 2026-05-08
- classification: keep_clean
- proposed_action: keep_clean
- context: Massive Exposure of 1 Million AI Services Reveals Critical Misconfiguration and Security Debt in Production AI Infrastructure

## grok
- campaign: grok-bankrbot-morse-code-prompt-injection-may-2026
- source: Security Boulevard
- status: active
- first_seen: 2026-05-16
- classification: keep_clean
- proposed_action: keep_clean
- context: xAI Grok chatbot exploited via Morse code prompt injection to trigger Bankrbot crypto theft of $175K

## bankrbot
- campaign: grok-bankrbot-morse-code-prompt-injection-may-2026
- source: Security Boulevard
- status: active
- first_seen: 2026-05-16
- classification: keep_clean
- proposed_action: keep_clean
- context: Bankrbot automated finance agent abused via prompt injection chained through Grok to drain $175K in cryptocurrency

## ollama
- campaign: intruder-1-million-exposed-ai-services-may-2026
- source: Intruder Security
- status: active
- first_seen: 2026-05-18
- classification: keep_clean
- proposed_action: keep_clean
- context: Massive Exposure of 1 Million AI Services—Intruder Security Scan Reveals Critical Misconfigurations and Authentication Gaps in Self-Hosted LLM Infrastructure

## Microsoft.SemanticKernel.Core
- campaign: microsoft-semantic-kernel-cve-2026-25592-26030-rce
- source: Microsoft Security Blog
- status: active
- first_seen: 2026-05-18
- classification: keep_clean
- proposed_action: keep_clean
- context: Microsoft Semantic Kernel Critical RCE Vulnerabilities (CVE-2026-25592, CVE-2026-26030)—Prompt Injection to Remote Code Execution in AI Agent Frameworks

## npm:@bankr/agent
- campaign: grok-bankrbot-morse-code-prompt-injection-may-2026
- source: Security Boulevard
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Encoded Prompt Injection Drains $175K–$200K from AI-Controlled Crypto Wallet: Grok + Bankrbot Morse Code Attack Reveals Excessive Agency Risk

## grok-bankr-integration
- campaign: grok-bankrbot-morse-code-prompt-injection-may-2026
- source: Security Boulevard
- status: active
- first_seen: 2026-05-22
- classification: keep_clean
- proposed_action: keep_clean
- context: Encoded Prompt Injection Drains $175K–$200K from AI-Controlled Crypto Wallet: Grok + Bankrbot Morse Code Attack Reveals Excessive Agency Risk

## npm:@tanstack/react-router@1.169.5
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: malicious version published via cache poisoning and OIDC token extraction on May 11, 2026

## npm:@tanstack/react-router@1.169.8
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: second malicious version published via cache poisoning and OIDC token extraction on May 11, 2026

## npm:@tanstack/vue-router@1.169.5
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: malicious version

## npm:@tanstack/vue-router@1.169.8
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: second malicious version

## npm:@tanstack/solid-router@1.169.5
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: malicious version

## npm:@tanstack/solid-router@1.169.8
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: second malicious version

## npm:@tanstack/start@1.169.5
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: malicious version

## npm:@tanstack/start@1.169.8
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack GitHub Actions Pwn Request supply chain attack: second malicious version

## npm:@mistralai/mistralai@2.4.6
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack & Mistral GitHub Actions Pwn Request supply chain attack: compromised Mistral AI npm SDK; multiple @mistralai scoped packages affected at version 2.4.6

## npm:@uipath/robot
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack & Mistral GitHub Actions Pwn Request supply chain attack: representative indicator for 65 compromised @uipath scoped npm packages

## npm:@squawk/cli
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack & Mistral GitHub Actions Pwn Request supply chain attack: representative indicator for 20 compromised @squawk scoped npm aviation data packages

## guardrails-ai@0.10.1
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack & Mistral GitHub Actions Pwn Request Supply Chain Attack: 170+ Packages Compromised via Cache Poisoning & OIDC Token Extraction

## mistralai@2.4.6
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack & Mistral GitHub Actions Pwn Request Supply Chain Attack: 170+ Packages Compromised via Cache Poisoning & OIDC Token Extraction

## npm:@opensearch-project/opensearch
- campaign: tanstack-mistral-github-actions-pwn-request-may-2026
- source: TanStack
- status: active
- first_seen: 2026-05-24
- classification: keep_clean
- proposed_action: keep_clean
- context: TanStack & Mistral GitHub Actions Pwn Request supply chain attack: compromised OpenSearch npm package (1.3M weekly downloads)

## ensmallen
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## bramin
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## cmd2func
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## coolbox
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## dynamo-release
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## executor-engine
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## executor-http
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## funcdesc
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## magique
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## langchain-core-mcp
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## spateo-release
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## gpt-pilot
- campaign: hades-campaign-pypi-credential-stealer-bun-payload
- source: StepSecurity
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Hades Campaign: PyPI Credential Stealer Worm Targeting AI/ML Ecosystem with Prompt-Injection Evasion

## npm:@redhat-cloud-services/frontend-components
- campaign: miasma-redhat-npm-azure-github-compromise
- source: Wiz
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Miasma Supply Chain Attack: Azure Repositories Disabled, Credential-Stealing Worm in Red Hat npm Packages

## npm:@redhat-cloud-services/compliance-client
- campaign: miasma-redhat-npm-azure-github-compromise
- source: Wiz
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Miasma Supply Chain Attack: Azure Repositories Disabled, Credential-Stealing Worm in Red Hat npm Packages

## npm:@redhat-cloud-services/rbac-client
- campaign: miasma-redhat-npm-azure-github-compromise
- source: Wiz
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: Miasma Supply Chain Attack: Azure Repositories Disabled, Credential-Stealing Worm in Red Hat npm Packages

## huggingface-hub
- campaign: cve-2026-4372-hugging-face-transformers-rce
- source: Threat-Modeling.com Vulnerability Intelligence Report
- status: active
- first_seen: 2026-06-11
- classification: keep_clean
- proposed_action: keep_clean
- context: CVE-2026-4372: Hugging Face Transformers Critical RCE via Malicious Model Config.json – 232 Million Downloads Exposed Pre-Patch
