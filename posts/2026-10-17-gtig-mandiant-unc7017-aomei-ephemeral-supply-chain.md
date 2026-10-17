# Google GTIG and Mandiant Attribute Ephemeral AOMEI Update Server Tampering to UNC7017

**Date:** 2026-10-17
**Tags:** supply-chain, apt

## Executive Summary

Google Threat Intelligence Group and Mandiant investigated a software supply chain compromise that tampered with AOMEI Technology update servers using repeated windows of only five to ten minutes, evading point in time triage and automated file scanning. The campaign delivered the CROSSROAD downloader and SHINYROAD backdoor and is attributed to a cluster tracked as UNC7017. Defenders should treat brief update server anomalies as potential supply chain tampering rather than noise.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | UNC7017 AOMEI Supply Chain Tampering |
| Attribution | UNC7017 (confidence: medium) |
| Target | Users of AOMEI Technology software update infrastructure |
| Vector | Repeated short burst tampering of AOMEI origin update servers to deliver a staged payload chain |
| Status | active |
| First Observed | 2026-04 |

## Detailed Findings

According to Google Threat Intelligence Group and Mandiant, the campaign targeted the update infrastructure belonging to AOMEI Technology between April 2026 and July 2026. Google reported that the threat actor conducted repeated, short burst configuration tampering against AOMEI origin servers, with each tampering window active for only five to ten minutes before reverting to authentic versions, which the researchers describe as the first time they encountered a software supply chain compromise implemented with such short windows, effectively evading traditional point in time triage and automated file scanning. Google stated that the campaign delivered a multi stage payload chain involving the newly tracked CROSSROAD downloader and SHINYROAD backdoor, and that the actor iteratively modified its tradecraft by pivoting staging infrastructure from cloud providers to dedicated domains and legitimate cloud storage, which makes infrastructure based blocking and network controls difficult. Google attributed the activity to a threat cluster tracked as UNC7017. Google noted the campaign was initially identified through collaborative research with the ManageEngine Threat Analysis Lab, part of Zoho Corporation, whose endpoint detection and response telemetry first detected the activity in late May across multiple customer environments.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Compromise Software Supply Chain | T1195.002 | The actor tampered with AOMEI origin update servers so installs and updates delivered the CROSSROAD downloader and SHINYROAD backdoor |
| Application Layer Protocol | T1071 | Staging infrastructure was moved to dedicated domains and legitimate cloud storage for command and control and payload retrieval |

## IOCs

### Domains

_No IOCs published in the summarized report. Refer to the Google Cloud blog for any staging domains, cloud storage paths, and file indicators tied to CROSSROAD and SHINYROAD._

### Full URL Paths

_No IOCs published in the summarized report. Refer to the Google Cloud blog for any staging domains, cloud storage paths, and file indicators tied to CROSSROAD and SHINYROAD._

### Splunk Format

_No IOCs available for Splunk query_

### Affected Platforms

```
AOMEI Technology software update infrastructure
```

## Detection Recommendations

Log and alert on update server configuration changes and short lived content differences even when point in time scans show clean files, since tampering windows lasted only five to ten minutes. Baseline AOMEI update traffic and block unexpected staging domains and cloud storage paths. Monitor endpoints for CROSSROAD downloader and SHINYROAD backdoor behavior. Re scan and re verify signed updates over time rather than trusting a single point in time hash.

## References

- [Google Cloud Blog] Investigating Ephemeral Supply Chain Tampering (2026-10-16) — https://cloud.google.com/blog/topics/threat-intelligence/investigating-ephemeral-supply-chain-tampering
