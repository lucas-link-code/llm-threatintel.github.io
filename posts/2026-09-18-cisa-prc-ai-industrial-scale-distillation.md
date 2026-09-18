# CISA NSA FBI: DeepSeek, Moonshot, Alibaba, MiniMax, StepFun, and Z.AI Ran Industrial Scale Distillation Against US Frontier Models

**Date:** 2026-09-18
**Tags:** nation-state, llmjacking, prompt-injection

## Executive Summary

CISA, NSA, and FBI published joint advisory AA26-251A on 2026-09-08 stating that DeepSeek, Moonshot AI, Alibaba, MiniMax, StepFun, and Z.AI extracted billions of tokens from US frontier models including Claude, GPT, Gemini, and Grok variants since at least late 2024, likely with PRC government awareness. Pathways include native APIs, cloud relays, aggregators, and transfer station proxies that break geo restrictions. MiniMax used prompt injection to make Claude Code treat itself as a MiniMax product. US providers should hunt subscription to usage anomalies and shared premium seats. No domain, IP, or hash was published.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Industrial scale knowledge distillation against US frontier models. Not a malware family |
| Actor / Attribution | Named PRC companies DeepSeek, Moonshot AI, Alibaba, MiniMax, StepFun, and Z.AI per CISA, NSA, and FBI. Assessed likely with Chinese government awareness. Confidence as stated by the authoring agencies, not independently scored here |
| Target | US model providers and, indirectly, any tenant whose prompts or chain of thought traces are pulled into student training |
| Vector | Fraudulent and bulk API accounts, aggregator obfuscation, transfer station proxies, chain of thought extraction prompts, automated failover when blocked |
| Status | Active. Authoring agencies describe ongoing campaigns from at least late 2024 through 2026 |
| First Observed | Late 2024 per the advisory. Public joint advisory 2026-09-08 |

## Detailed Findings

According to [CISA](https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-251a), distillation is a legitimate training method, but the named PRC companies run it at industrial scale against restricted capabilities of US models, treating it as the core of development rather than a supplement. The advisory says DeepSeek, Moonshot AI, Alibaba, MiniMax, StepFun, and Z.AI extracted billions of tokens across millions of exchanges. Access is split across native APIs, remote cloud providers, and third party aggregators that hide user metadata. Transfer stations resell frontier access, bypass regional controls, and reduce traceability. Cost is cut by bulk premium subscriptions shared across developer teams. Quality pipelines detect degraded or honey responses so operators can fail over.

DeepSeek has run organized distillation since at least 2024 for R1 and V3, including Claude 3.7, Claude Sonnet 4, Claude Sonnet 4.5, Claude Opus 4.1, Gemini 2.5 Pro Preview, Gemini 2.5 Flash Preview, GPT-4, GPT-4o, GPT-4 Mini, GPT-4 Nano, GPT-5, and Grok 4. Targeted functions include legal specialization, API rule tasks, chain of thought writing, agentic functions, and supervised fine tuning. CISA says DeepSeek's public 5.6 million dollar training cost figure is misleading because it omits distilled data cost.

Moonshot AI, from at least mid 2025, distilled Claude Fable 5 into Kimi-K3 and GPT-4o into Kimi-K2, plus a long list of Claude, GPT, Gemini, Nano Banana, and Grok Code Fast-1 models for SFT, RL, software engineering, and math. Alibaba in late 2025 distilled Claude-4 family and GPT-5 for Qwen software engineering, customer service, and character creation. MiniMax distilled Claude Code, Claude Sonnet 4, Claude Opus, Gemini 1, Gemini 2.5 Pro, Gemini 3 Pro, and GPT-5 into M2, including chain of thought, RL, and SFT. CISA said MiniMax used prompt injections so Claude Code would believe it was a MiniMax product. StepFun distilled Claude Opus 4.1 and 4.5, Claude Sonnet 4.5, Claude Haiku 4.5, and GPT-5 Mini through GPT-5.2 into Step 4 coding and agentic functions. By mid 2026 Z.AI had distilled billions of tokens of GPT-5.5 and Claude Opus 4.8 for chain of thought.

The authoring agencies map TTPs to MITRE ATLAS, including AML.T0008 infrastructure, AML.T0040 inference API access, AML.T0051 and AML.T0054 prompt injection and jailbreak for hidden chain of thought, AML.TA0008 discovery, and AML.T0042 attack verification. MiniMax retargeted a new Claude model within 24 hours of release. This feed maps the same activity to enterprise ATT&CK below. ATLAS IDs stay in this paragraph as CISA wrote them.

This advisory is broader than Anthropic cluster GTG-16001 on this feed. GTG-16001 is DeepSeek silently relaying customer traffic to Claude Opus in July 2026. AA26-251A is US government attribution of multi company distillation since 2024, including labs Anthropic did not name in that cluster. Do not collapse the two records.

Recommended provider actions: detect anomalous prompts, accounts, networks, subscription to usage ratios, immediate max usage on new accounts, and enterprise scale throughput. Subtly alter responses to suspected distillation. Share indicators across providers, clouds, and aggregators. No network IOC list was published. Do not denylist Claude, GPT, Gemini, Grok, DeepSeek, or the other named products as platforms.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Obtain Capabilities: Artificial Intelligence | T1588.007 | Named PRC labs extract US model capabilities and chain of thought for student training |
| Valid Accounts | T1078 | Fraudulent and bulk API or premium subscription accounts, often shared across teams |
| Automated Collection | T1119 | Millions of coordinated exchanges, failover when blocked, quality checks against defensive degradation |
| Masquerading | T1036 | Aggregators and transfer stations hide operator identity and geography |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

On model provider and aggregator logs, hunt new accounts that immediately hit rate limits, many accounts sharing one payment instrument, and high volume identical or near identical prompts across Claude, GPT, Gemini, and Grok. Alert when a session tries to recover hidden chain of thought after a refusal, including imagine the internal reasoning prompts CISA attributes to DeepSeek. Correlate tenant IDs that bounce across aggregators after a block. MiniMax style prompt injection that tells Claude Code it is another vendor product belongs in coding harness logs, not in a domain denylist.

On enterprise side, treat unexpected bulk use of personal frontier subscriptions from corporate egress as possible transfer station or shared seat abuse. This advisory has no IP or domain list. Do not add DeepSeek, Moonshot, Alibaba, MiniMax, StepFun, Z.AI, Anthropic, OpenAI, Google, or xAI apex domains as IOCs.

## References

- [CISA] China-Based Artificial Intelligence Companies Conducting Industrial-Scale Distillation Campaigns Against U.S. AI Companies AA26-251A (2026-09-08): https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-251a
- [CISA] CISA, NSA and FBI Warn of China-Based AI Companies Targeting US AI Models with Industrial-Scale Knowledge Distillation Campaigns (2026-09-08): https://www.cisa.gov/news-events/news/cisa-nsa-and-fbi-warn-china-based-ai-companies-targeting-us-ai-models-industrial-scale-knowledge
