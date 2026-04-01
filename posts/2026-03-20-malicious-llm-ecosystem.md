# The Malicious LLM Ecosystem: WormGPT, FraudGPT, GhostGPT and Beyond

**Date:** 2026-03-20
**TLP:** TLP:CLEAR
**Tags:** Malicious Tool, Underground Economy

## Executive Summary

The underground market for malicious LLM tools has expanded steadily since mid-2023, with at least a dozen distinct offerings identified across Telegram channels and dark web forums. This report maps the current ecosystem, tracking tool availability, pricing, capabilities, and the evolution from simple jailbreak wrappers to purpose-built offensive AI platforms.

## Detailed Findings

The malicious LLM market emerged in July 2023 with WormGPT, a service built on the GPT-J 6B model with safety guardrails removed. WormGPT was marketed primarily for business email compromise content generation and demonstrated that removing alignment constraints from open-weight models created a commercially viable underground product.

FraudGPT followed within weeks, offering a subscription model at $200/month and positioning itself as a general-purpose offensive AI tool. Its capabilities included phishing page generation, malware code writing, and social engineering content creation. The tool's operator, going by the handle "CanadianKingpin," promoted it aggressively across multiple dark web marketplaces.

GhostGPT emerged in early 2024 as a Telegram-native service, lowering the barrier to entry by eliminating the need for dark web access. Users interact with a Telegram bot that proxies requests to a jailbroken LLM backend. The convenience of Telegram as a distribution channel has made GhostGPT one of the more widely adopted tools in the ecosystem.

### Evolution of the Market

The ecosystem has evolved along several axes. Early tools were simple jailbreak wrappers around existing models. Current offerings increasingly use fine-tuned models trained specifically on offensive security content, red team playbooks, and exploitation code. Some operators have moved from single-model offerings to multi-model platforms that route requests to whichever backend model performs best for the specific task.

Pricing ranges from $50/month for basic access to $500+ for premium tiers with dedicated infrastructure and higher request limits. Some operators offer pay-per-query models for occasional users.

### Tool Inventory

Currently tracked malicious LLM tools include WormGPT (v1 through v3), FraudGPT, GhostGPT, DarkGPT, EvilGPT, DarkBARD, XXXGPT, WolfGPT, and several unnamed Telegram bot services. The proliferation of offerings suggests demand is strong and the barrier to creating new services remains low, particularly as more capable open-weight models become available.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Attachment | T1566.001 | BEC and phishing content generation |
| User Execution: Malicious Link | T1204.001 | Phishing page creation |
| Command and Scripting Interpreter | T1059 | Malware code generation |
| Obfuscated Files or Information | T1027 | Code obfuscation assistance |

## IOCs

### Domains

```
wormgpt.ai
fraudgpt.com
ghostgpt.chat
darkgpt.bot
```

### Splunk Format

```
"wormgpt.ai" OR "fraudgpt.com" OR "ghostgpt.chat" OR "darkgpt.bot"
```

## Detection Recommendations

Monitor for access to known malicious LLM service domains and Telegram bot APIs from corporate networks. DNS and proxy log analysis for the listed domains provides the most straightforward detection path. Browser history forensics on compromised or suspect machines should include checks for these domains.

## References

- SlashNext: WormGPT Analysis (2023)
- Netenrich: FraudGPT Investigation (2023)
- Abnormal Security: GhostGPT Report (2024)
- Multiple dark web forum monitoring reports
