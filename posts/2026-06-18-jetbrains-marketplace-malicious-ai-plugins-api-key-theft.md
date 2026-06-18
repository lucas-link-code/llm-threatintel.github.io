# JetBrains Marketplace: 15 Malicious AI Coding Plugins Steal Developer API Keys from 70,000 Installs

**Date:** 2026-06-18
**Tags:** supply-chain, malicious-tool

## Executive Summary

Aikido Security identified 15 malicious plugins on the JetBrains Marketplace, all posing as AI coding assistants powered by DeepSeek, OpenAI, and SiliconFlow. Each plugin functioned as advertised while silently exfiltrating any AI provider API key entered in settings to a hardcoded server at 39.107.60[.]51 over plain HTTP. Combined install count across all 15 plugins reached approximately 70,000 before removal. JetBrains removed all plugins, banned the seven associated publisher accounts, and triggered a remote kill-switch disabling extensions across installed IDEs on June 16, 2026. Developers who used any of these plugins must treat any API key entered as compromised and rotate immediately.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | JetBrains AI plugin credential theft campaign |
| Actor / Attribution | Unknown; operates under vendor accounts CodePilot, StackSmith, CodeCrafter, CodeWeaver, JetCode, DailyCode, ZenCoder |
| Target | Developers using JetBrains IDEs with AI coding assistants; OpenAI, DeepSeek, SiliconFlow API key holders |
| Vector | Malicious third-party plugins on JetBrains Marketplace masquerading as AI coding assistants and Git utilities |
| Status | disrupted (plugins removed June 16-17, 2026; C2 server status unknown) |
| First Observed | 2025-10-31 |

## Detailed Findings

According to Aikido Security, all 15 malicious plugins share a nearly identical codebase, repackaged and renamed across different listings to evade detection and inflate the apparent diversity of the campaign. The plugins operate exactly as documented: code review runs, commit messages generate, bug reports fire. The malicious logic hooks the settings save handler. When a developer enters an API key and clicks Apply, the `save()` method runs two operations: it stores the key locally as expected, and it sends it via HTTP POST to `39.107.60[.]51/api/software/key` over port 80 in plaintext. The destination IP is hardcoded in the plugin binary and authenticated with a static token hardcoded alongside it.

According to JetBrains' incident disclosure on June 16, 2026, their security teams received reports about the campaign and acted the same day: all 15 plugins were purged from Marketplace, the seven underlying publisher accounts were permanently banned, and a remote kill-switch was triggered across JetBrains' backend systems to disable the extensions in all installed IDEs on the next relaunch.

According to Aikido Security, the earliest variants appeared in late October 2025, with new plugin versions still being published through June 10, 2026. The two most recent plugins (CodeGPT AI Assistant and DeepSeek AI Assist) were published on June 9 and June 10, 2026 respectively, and together accumulated over 53,000 of the campaign's approximately 70,000 total installs, indicating the operator deliberately released high-volume plugins close to detection to maximize key collection before removal.

### Affected Plugin List

| Plugin Name | Plugin ID | Downloads |
|---|---|---|
| DeepSeek Junit Test | org.sm.yms.toolkit | 1,121 |
| DeepSeek Git Commit | com.json.simple.kit | 1,894 |
| DeepSeek FindBugs | org.bug.find.tools | 1,485 |
| DeepSeek AI Chat | org.translate.ai.simple | 1,317 |
| DeepSeek Dev AI | com.yy.test.ai.simple | 740 |
| DeepSeek AI Coding | com.dev.ai.toolkit | 450 |
| AI FindBugs | com.json.view.simple | 623 |
| AI Git Commitor | com.my.git.ai.kit | 301 |
| AI Coder Review | org.check.ai.ds | 735 |
| DeepSeek Coder AI | com.review.tool.code | (unlisted) |
| AI Coder Assistant | org.code.assist.dev.tool | 319 |
| DeepSeek Code Review | com.coder.ai.dpt | 278 |
| CodeGPT AI Assistant | com.my.code.tools | 25,571 |
| DeepSeek AI Assist | ord.cp.code.ai.kit | 27,727 |
| Coding Simple Tool | com.dp.git.ai.tool | 3,121 |

### Detection Evasion

JetBrains states that all plugins undergo manual review within two business days, including automated checks for suspicious activity. The malicious logic passed review because the plugins functioned correctly in all visible behavior. The credential exfiltration is a hooked save handler with no visible side effects: no network request fires during plugin load or plugin use, only during the settings save operation that a reviewer testing core functionality would not trigger through normal product evaluation. According to Aikido Security, the malicious code was not visible in a surface-level functionality test.

### Scope and Attribution

The campaign collected API keys for OpenAI, DeepSeek, and SiliconFlow. The stolen keys enable LLMjacking (unauthorized use of the victim's paid API quota), credential resale on underground markets, and use of the victim's identity for attribution-resistant LLM queries. The actor has not been attributed to a known threat group. The operation across seven vendor accounts over eight months suggests deliberate infrastructure separation to avoid bulk bans.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Software Supply Chain | T1195.002 | Malicious third-party plugins distributed through official JetBrains Marketplace |
| Credentials from Password Stores | T1555 | API keys extracted from IDE plugin settings storage on developer machines |
| Exfiltration Over C2 Channel | T1041 | Stolen API keys sent via HTTP POST to hardcoded IP 39.107.60.51 over port 80 |
| Masquerading | T1036 | Plugins impersonate legitimate AI coding assistant products from known providers |
| Resource Hijacking | T1496 | Stolen AI provider API keys used for unauthorized LLM compute consumption |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
39.107.60.51/api/software/key
```

### Splunk Format

```
"39.107.60.51/api/software/key"
```

### IP Addresses

```
39.107.60.51
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

EDR: Alert on JetBrains IDE processes (idea, intellij, goland, pycharm, webstorm, rider, clion, datagrip, rubymine) spawning or initiating HTTP connections to non-JetBrains, non-AI-provider IP addresses immediately after a settings save event. The exfiltration fires on the `save()` method invocation, not on plugin load.

Network proxy: Block or alert on outbound HTTP (port 80) traffic from developer workstations to 39.107.60.51. Log any connections to this IP from any host — the server is not associated with any legitimate AI provider.

IDE plugin audit: Run `grep -r "39.107.60.51" ~/.config/JetBrains/ ~/.local/share/JetBrains/ ~/Library/Application\ Support/JetBrains/` to check for any cached plugin configuration referencing the C2 IP.

Remediation: Any developer who used a plugin from the list above must revoke and regenerate API keys for OpenAI (platform.openai.com/api-keys), DeepSeek (platform.deepseek.com), and SiliconFlow (cloud.siliconflow.cn). Revoke, do not merely rotate, since keys may have been cached or used.

Broader monitoring: Review AI API spend dashboards for OpenAI, DeepSeek, and SiliconFlow for anomalous usage patterns, particularly from unfamiliar IPs or at unusual hours, in the period since October 2025 when the campaign began.

## References

- [Aikido Security] Multiple JetBrains IDE plugins caught stealing AI keys (2026-06-16) — https://www.aikido.dev/blog/multiple-jetbrains-ide-plugins-caught-stealing-ai-keys
- [JetBrains] Marketplace Ecosystem Security Update: Addressing Malicious Third-Party AI Plugins (2026-06-16) — https://blog.jetbrains.com/platform/2026/06/marketplace-ecosystem-security-update-malicious-ai-plugins/
- [BleepingComputer] Malicious JetBrains Marketplace plugins steal AI API keys from developers (2026-06-17) — https://www.bleepingcomputer.com/news/security/malicious-jetbrains-marketplace-plugins-steal-ai-api-keys-from-developers/
