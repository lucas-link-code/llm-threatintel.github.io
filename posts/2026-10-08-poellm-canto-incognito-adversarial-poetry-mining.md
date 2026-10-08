# PoeLLM and Canto Incognito Abuses Adversarial Poetry to Mine Crypto on 3,400+ AI Servers

**Date:** 2026-10-08
**Tags:** malware, llmjacking

## Executive Summary

Lumen Black Lotus Labs tracked the PoeLLM malware, active since at least April 2026, which infected more than 3,400 servers by abusing exposed AI services and derives command addresses from a poem hosted on GitHub. Most victims ran vulnerable internet facing versions of LiteLLM and Ollama, with additional targets running Gotenberg, Gitea, and possibly Ivanti Sentry via CVE-2026-10520. Defenders should patch and authenticate internet facing LiteLLM, Ollama, Gotenberg, and Gitea deployments and hunt for XMRig or Iron miners.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Canto Incognito |
| Attribution | Italian speaking financially motivated criminal (confidence: medium) |
| Target | Internet facing AI and developer services, primarily in the US and Western Europe |
| Vector | Exploitation of vulnerable exposed services plus adversary controlled code retrieved through a poem on GitHub |
| Status | active |
| First Observed | 2026-04 |

## Detailed Findings

According to [theregister.com](https://www.theregister.com/security/2026/10/07/poetry-is-the-new-ai-security-threat-as-poellm-malware-infects-3k-servers/5301672), Lumen Black Lotus Labs has tracked the PoeLLM malware since at least April 2026, when the campaign began, and it has impacted more than 3,000 servers primarily in the US and Western Europe, reaching more than 800 active infections per day at peak. [gbhackers.com](https://gbhackers.com/poellm-malware/) reported the count at more than 3,400 servers. The Register reported this is the first real world case of adversarial poetry, a jailbreak technique that hides harmful prompts in poems, that Black Lotus Labs has observed. The malware retrieves its control instructions from On the Nature of Connection, a poem embedded in a file named dash.css within a fork of the Node.js website repository, according to gbhackers.com. The Register reported most victims ran vulnerable internet facing versions of LiteLLM and Ollama, with hundreds also running the Gotenberg PDF converter and the Gitea software development platform, and possible targeting of Ivanti Sentry. Black Lotus Labs first spotted the malware while investigating Ivanti Sentry vulnerability CVE-2026-10520. The malware deploys XMRig and Iron miners and connects victims to Kryptex mining infrastructure. Black Lotus Labs attributed the campaign to an Italian speaking criminal, named it Canto Incognito, and stated Italian language comments appear in the malware and on the attacker GitHub pages, with netflow suggesting an Italy location. The Register reported the researchers believe the poem itself was written by AI.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Scanning and exploitation of exposed LiteLLM, Ollama, Gotenberg, Gitea, and Ivanti Sentry services |
| Resource Hijacking | T1496 | Deployment of XMRig and Iron miners connected to Kryptex mining infrastructure |

## IOCs

### Domains

_No domain, hash, or IP IOCs published in the cited sources. The C2 address is derived from the poem file dash.css in a fork of the Node.js website repository, referenced in detection guidance. CVE-2026-10520 relates to Ivanti Sentry._

### Full URL Paths

_No domain, hash, or IP IOCs published in the cited sources. The C2 address is derived from the poem file dash.css in a fork of the Node.js website repository, referenced in detection guidance. CVE-2026-10520 relates to Ivanti Sentry._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
LiteLLM
Ollama
Gotenberg
Gitea
Ivanti Sentry
```

## Detection Recommendations

Patch and require authentication on all internet facing LiteLLM, Ollama, Gotenberg, and Gitea deployments, and prioritize Ivanti Sentry patching for CVE-2026-10520. Hunt for XMRig or Iron miner processes and for outbound connections to Kryptex mining infrastructure. Monitor GitHub forks of the Node.js website repository for unexpected dash.css content, since the C2 address is hidden inside the poem. Alert on anomalous outbound netflow from AI inference hosts.

## References

- [The Register] Poetry is the new AI security threat as PoeLLM malware infects 3K+ servers (2026-10-07) — https://www.theregister.com/security/2026/10/07/poetry-is-the-new-ai-security-threat-as-poellm-malware-infects-3k-servers/5301672
- [GBHackers] PoeLLM Malware Hijacks 3,400+ Servers for Crypto Mining and Botnet Expansion (2026-10-08) — https://gbhackers.com/poellm-malware/
