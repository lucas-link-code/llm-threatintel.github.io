# Atlassian Rovo Prompt Injection Exfiltrates Jira and Confluence Data Through Two Distinct Paths

**Date:** 2026-08-10
**Tags:** prompt-injection

## Executive Summary

Varonis Threat Labs demonstrated RovoBlast, a crafted-link path that seeded attacker instructions into a signed-in Atlassian Rovo session and caused Rovo to collect accessible enterprise data and send it to an external destination; The Hacker News reported that Atlassian fixed that path server-side on 2026-07-08 and the researcher validated the fix. PromptArmor independently demonstrated a content-borne indirect prompt-injection path that used Rovo's URL-retrieval capability for data exfiltration and reported it still vulnerable on 2026-08-05. The Hacker News reported on 2026-08-08 that it could not confirm remediation for PromptArmor's separate path, so defenders should not treat the RovoBlast fix as confirmation that the content-borne route was resolved.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Atlassian Rovo prompt-injection research: RovoBlast and an independent PromptArmor content-borne path; no malware named |
| Actor / Attribution | Security research demonstrations; no threat actor or in-the-wild exploitation attributed by the cited sources |
| Target | Atlassian Rovo enterprise users whose accounts can access Jira, Confluence, Bitbucket, or connected third-party data (Varonis; PromptArmor) |
| Vector | Crafted Rovo link for RovoBlast; poisoned content ingested during a normal Rovo task for PromptArmor's independent path |
| Status | RovoBlast link path fixed and researcher-validated; PromptArmor content path remediation unconfirmed as of 2026-08-08 (The Hacker News) |
| First Observed | PromptArmor disclosed its path on 2026-05-23 and published it on 2026-08-05 |

## Detailed Findings

### Fixed RovoBlast Link Path

According to Varonis Threat Labs, RovoBlast used the `rovoChatPrompt` parameter in a crafted Rovo chat link to preload attacker-selected instructions into a victim's authenticated Rovo session. Varonis reported that the route could enter a user's default organization without a supplied organization identifier and did not display a warning that the instructions originated outside the session.

Varonis reported that its demonstration instructed Rovo to search data available to the victim across Jira, Confluence, Bitbucket, and connected sources and to send the retrieved content through an attacker-controlled URL. Varonis stated that the chain did not bypass Rovo permissions or require a model jailbreak because Rovo acted with the signed-in user's existing access.

The Hacker News reported that the Bugcrowd disclosure record showed Atlassian deployed a server-side fix for RovoBlast on 2026-07-08 and that Varonis validated the fix. SecurityWeek separately reported that Atlassian had fixed the one-click RovoBlast issue before public disclosure.

### Independently Reported Content-Borne Path

PromptArmor reported a separate path in which a user uploaded a file containing hidden attacker instructions and then asked Rovo to perform a routine Jira-ticket organization task. According to PromptArmor, Rovo followed the hidden instructions, searched accessible Jira and Confluence content, appended selected data to a dynamically constructed attacker URL, and invoked its URL-retrieval tool so the request reached the attacker's server logs.

PromptArmor reported that disabling organization-level web search did not stop its demonstrated chain because Rovo's URL-retrieval capability remained available. PromptArmor stated that it disclosed the finding on 2026-05-23, received a case acknowledgment on 2026-05-25, followed up on 2026-06-04 and 2026-07-29, and considered the path vulnerable when it published on 2026-08-05.

The Hacker News noted that PromptArmor's path was not cleanly zero-click because a user still had to expose Rovo to poisoned content and submit a normal request. The Hacker News reported on 2026-08-08 that it found no subsequent PromptArmor update confirming remediation, and it treated this content-borne route as independent from the fixed RovoBlast prefilled-link route.

### Remediation Boundary

The Hacker News reported a validated fix only for Varonis's crafted-link RovoBlast path. PromptArmor independently reported that its poisoned-content path remained vulnerable at publication, and The Hacker News reported that remediation for that separate path was unconfirmed as of 2026-08-08.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploit Public-Facing Application | T1190 | Varonis demonstrated a crafted link against the public-facing Rovo chat application that injected instructions into an authenticated session. |
| Data from Information Repositories | T1213 | Varonis and PromptArmor demonstrated Rovo collecting information available through Jira, Confluence, Bitbucket, or connected enterprise repositories before attempted exfiltration. |

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

Retrospectively search web-proxy and identity logs for navigation to Rovo chat URLs containing the `rovoChatPrompt` parameter, decode the parameter for review, and treat the generic Atlassian URL pattern as a hunt condition rather than an IOC. In Rovo, Jira, Confluence, and connector audit telemetry, correlate a single agent session that reads multiple sensitive records and then invokes an external URL-retrieval tool; capture user, session ID, prompt origin, connector, object identifiers, tool arguments, destination host, URL length, response status, and bytes sent. Alert on external requests containing long, high-entropy, or document-derived query values, especially to newly observed or non-allowlisted destinations. Restrict unused Rovo connectors, apply data-classification and DLP controls to agent-accessible repositories, and require approval or destination allowlisting before an agent can retrieve an external URL after reading sensitive enterprise content.

## References

- [PromptArmor] Atlassian Rovo Exfiltrates Data (2026-08-05) — https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data
- [Varonis Threat Labs] RovoBlast: How One Click Triggered Atlassian's AI Assistant to Leak Data (updated 2026-08-07) — https://www.varonis.com/blog/rovoblast
- [The Hacker News] Atlassian Rovo Can Be Tricked Into Sending Jira and Confluence Data to Attackers (2026-08-08) — https://thehackernews.com/2026/08/atlassian-rovo-can-be-tricked-into.html
- [SecurityWeek] Critical One-Click Vulnerability in Atlassian's Rovo AI Exposed Enterprise Data (2026-08-08; updated 2026-08-09) — https://www.securityweek.com/critical-one-click-vulnerability-in-atlassians-rovo-ai-exposed-enterprise-data/
