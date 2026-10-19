# Any.Run Tracks 1,258 Fake Claude and ChatGPT Install Attacks Against Developers

**Date:** 2026-10-19
**Tags:** phishing, malware

## Executive Summary

Any.Run researchers traced 1,258 incidents over six months to fake AI tool attacks that impersonate Claude, ChatGPT, and Codex, with the employee performing the decisive step. The lures arrive through SEO poisoning, malicious ads, fake download pages, and shared LLM chats or artifacts, and often deliver fileless malware through pasted install commands. Defenders should treat brand styled AI install pages and shared AI chat links as untrusted and monitor developer endpoints for pasted shell commands.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | AI themed InstallFix and LLMshare cluster |
| Attribution | Unknown (confidence: none) |
| Target | Developers and employees installing AI coding and chat tools |
| Vector | SEO poisoning, malicious ads, fake download and install pages, and malicious shared AI chats or artifacts |
| Status | active |
| First Observed | 2026-10-19 |

## Detailed Findings

According to [darkreading.com](https://www.darkreading.com/application-security/fake-claude-chatgpt-attacks-developers-risk), Any.Run researchers analyzed 1,258 incidents traced to fake AI tool attacks over a six month period on the firm's platform. Campaigns most often impersonated Anthropic's Claude at 60 percent of analyses, with OpenAI's ChatGPT and Codex at 33 percent of analyses. Delivery used SEO poisoning, malicious ads, fake download pages, and AI themed artifacts. Any.Run reported that ClickFix type tactics made up nearly half of the studied campaigns, fake command line installers or InstallFix accounted for 27 percent, traditional ClickFix that began with fake download pages accounted for 17 percent, and chains that began with abused AI chats or malicious artifacts accounted for 25 percent. Any.Run stated the attacks share one trait, that the employee performs the decisive step by pasting an install command, running an installer, or signing in to a fake window, which can expose source code, cloud and AI API keys, active business sessions, ad accounts, and billing access. [pushsecurity.com](https://pushsecurity.com/blog/analyzing-the-latest-ai-themed-malware-delivery-attacks) reported the same InstallFix and LLMshare cluster, noting these attacks made up around 5 percent of all detections in its last quarterly snapshot and that most result in fileless delivery from legitimate execution surfaces, with Microsoft seeing a 96.3 percent ClickFix conversion rate to malware delivery. Push Security described an install command that prints Downloading Claude: https://claude.ai/install.sh in the Terminal while the real fetch after the && decodes a base64 URL.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| User Execution | T1204 | The victim pastes and runs the attacker install command or signs in to a fake AI tool window |
| Phishing | T1566 | Fake AI install pages, malicious ads, and poisoned search results lure the user to the payload |

## IOCs

### Domains

_No actionable IOCs published in these writeups. The claude.ai installer URL referenced by Push Security is a legitimate vendor host abused as a display string, not an attacker IOC._

### Full URL Paths

_No actionable IOCs published in these writeups. The claude.ai installer URL referenced by Push Security is a legitimate vendor host abused as a display string, not an attacker IOC._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
Windows
macOS
developer workstations
```

## Detection Recommendations

Block or alert on AI branded install domains that are not the official vendor host, and inspect shell history and endpoint telemetry for pasted install commands that chain curl or base64 decoding into a shell. Monitor developer endpoints for fileless execution from legitimate binaries and for outbound calls to newly observed AI lookalike domains. Treat links inside shared AI chats and artifacts as untrusted, and review egress for provider API key use from unexpected hosts.

## References

- [Dark Reading] Fake Claude, ChatGPT Attacks Surge, Putting Developers at Risk (2026-10-19) — https://www.darkreading.com/application-security/fake-claude-chatgpt-attacks-developers-risk
- [Push Security] Analyzing AI themed ClickFix, InstallFix and LLMshare attacks (2026-10-19) — https://pushsecurity.com/blog/analyzing-the-latest-ai-themed-malware-delivery-attacks
