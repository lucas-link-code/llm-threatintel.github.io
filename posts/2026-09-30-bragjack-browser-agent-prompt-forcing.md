# BragJack: One Extension Can Force Prompts Into Five Built In Browser AI Agents

**Date:** 2026-09-30
**Tags:** prompt-injection

## Executive Summary

Forever Security reported on 2026-09-16 that a single browser extension can take over built in agents in Chrome Gemini Live, Perplexity Comet, Microsoft Edge, Opera Neon, and Claude in Chrome by abusing origins those agents already trust. BleepingComputer reported on 2026-09-19 that the research produced CVE-2026-0628 and CVE-2026-55945, and that Google and Microsoft have resolved the flaws assigned to them. The extension has to already be installed. Remove unknown extensions and keep Chrome and Edge current.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | BragJack, also called Prompt Forcing by Forever Security |
| Actor / Attribution | Gal Weizman, Forever Security, as a proof of concept. No criminal use was described (confidence: none for in the wild exploitation) |
| Target | Users of Chrome Gemini Live, Microsoft Edge Copilot actions, Opera Neon, Perplexity Comet, and Claude in Chrome |
| Vector | Installed extension using content scripts and declarativeNetRequest against a trusted agent origin |
| Status | Google and Microsoft resolved their assigned flaws, per BleepingComputer. Forever Security did not report a single patch level for Opera, Perplexity, or Anthropic |
| First Observed | 2026-09-16 public writeup. Forever Security said the Chrome issue was found earlier and previously published as GlicJack |

## Detailed Findings

According to Forever Security, the same class of flaw showed up in five products: a privileged browser component performs actions, and a web origin is allowed to tell it what to do. Forever Security calls the follow on technique Prompt Forcing. The extension supplies the whole prompt and later prompts, rather than hiding a sentence inside content the model was already reading. Forever Security said the extension must be installed first, and that the demonstrations required no further click. BleepingComputer independently described the same five targets, the same extension requirement, and the Prompt Forcing name.

Forever Security reported the following outcomes. On Chrome, declarativeNetRequest could still redirect a script loaded by the embedded Gemini app after direct script injection into that site was blocked, which yielded local file reads, screenshots, and a path toward the camera and microphone. Forever Security assigned that Chrome result to earlier GlicJack work and listed CVE-2026-0628 with a US$7,000 bounty. BleepingComputer reported the same CVE, the same bounty, and that Google has resolved the flaw.

On Opera Neon, Forever Security reported that opera.com did not block extension script injection, so the extension could send prompts to the built in agent, including a prompt to summarize finance emails and send the summary out. Forever Security said declarativeNetRequest was also used to hide that activity from the user, and listed a US$900 bounty.

On Microsoft Edge, Forever Security reported a marketing page that held a page scoped permission to open the agent with a prompt, plus a split between a Think mode that accepts prompts and a Do mode that can act. Forever Security described a race that sends the prompt in Think mode and switches to Do mode before the agent checks state. Microsoft assigned CVE-2026-55945. Forever Security listed a US$5,000 bounty. BleepingComputer reported the same race, the same CVE, and that Microsoft has resolved the flaw.

On Claude in Chrome, Forever Security reported a marketing page that could send arbitrary prompts into the side panel, and that an extension could run a content script on Anthropic's site because Anthropic does not control the browser. Forever Security said Anthropic rated the issue medium and paid US$600. Forever Security described this case as an extension attacking another extension, and said the agent could be told to summarize email.

On Perplexity Comet, Forever Security reported a leftover origin, testing.perplexity.com, that the agent trusted and that the browser redirected to perplexity.ai. Forever Security said an extension could strip that redirect, load the testing origin, and inject a script that talks to the agent. Forever Security reported screenshot access, browsing history, profile data, local file reads, and the ability to instruct the agent, and listed a US$7,000 bounty. BleepingComputer reported the same testing origin pattern without printing the hostname, and a demonstration in which the agent summarized email and sent the result to another address.

Forever Security summed the bounties as tens of thousands of dollars from Google, Anthropic, Microsoft, Perplexity, and Opera. The figures above total US$20,500. BleepingComputer reported more than US$20,000, with individual bounties from US$600 to US$7,000. BleepingComputer said only that Google and Microsoft have resolved the flaws assigned to them. This report does not treat Opera, Perplexity, or Anthropic as patched beyond the bounty acknowledgements Forever Security published.

testing.perplexity.com is a vendor testing origin named by Forever Security, not attacker infrastructure. It is not listed as an indicator.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Browser Extensions | T1176 | Forever Security and BleepingComputer said a malicious extension is required before the agent can be driven |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Content scripts and redirected script resources are how the extension reaches the trusted origin |
| Screen Capture | T1113 | Forever Security reported screenshot access against Chrome Gemini Live and Perplexity Comet |
| Data from Local System | T1005 | Forever Security reported local file reads against Chrome and Comet |

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

Inventory installed extensions that hold declarativeNetRequest plus broad host access, and remove extensions users do not recognize. In browser management logs, alert when an extension rewrites request or response headers for the origins that drive these agents, including Gemini page resources, copilot.microsoft.com, opera.com, perplexity.ai, and testing.perplexity.com. That last name is a product origin to monitor for unexpected extension traffic, not a denylist entry for the whole Perplexity service. Keep Chrome and Microsoft Edge on a version that includes the vendor fixes for CVE-2026-0628 and CVE-2026-55945. Endpoint tools that only score unsigned binaries will miss Prompt Forcing, because the visible actions come from the browser agent. Log agent tool use that reads local files or sends mailbox contents off box after an extension changes traffic to the agent origin.

## References

- [Forever Security] BragJack: How We Hijacked 5 Of The World's Most Popular Browsers Using Their Built-In AI Assistants (2026-09-16): https://forever.security/blog/bragjack-hijacking-5-browsers-via-built-in-ai-assistants/
- [BleepingComputer] BragJack attacks hijack AI browser agents through malicious extensions (2026-09-19): https://www.bleepingcomputer.com/news/security/bragjack-attacks-hijack-ai-browser-agents-through-malicious-extensions/
