# Unit 42: CL-CRI-1131 and CL-CRI-1163 Leave NextChat and SockTz Staging Open

**Date:** 2026-09-27
**TLP:** TLP:CLEAR
**Tags:** malware, phishing, apt

## Executive Summary

Unit 42 published on 2026-09-03 that CL-CRI-1131, aimed at a Mexican transportation organization plus federal ministries and municipal water utilities in Mexico and Ecuador, self hosted NextChat on 178.128.87.160 port 3000 and used living off the land scripts after SAM and NTDS dumps failed. A second cluster, CL-CRI-1163, phished Brazilian financial staff with resume lures and tried SockTz versions 1 through 9 inside two hours, with scripts named exploit_creative.py, exploit_careful.py, and rce_focused.py on an open directory at 167.148.195.53. Hunt the duckdns hosts, those two IPs, 62.171.185.97, and 165.22.184.26. Do not denylist NextChat as a product.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | CL-CRI-1131 Mexican transportation and government cluster. CL-CRI-1163 Brazilian financial cluster. SockTz Go SOCKS5 proxy used by CL-CRI-1163. Unit 42 said CloudSEK tracks the Mexican activity as Operation Escaneo |
| Actor / Attribution | Unit 42: two separate clusters that share SOCKS5 relay patterns and commercial LLM use. No national attribution and no group name beyond the CL-CRI identifiers. Confidence high that the activity is real. Confidence low that the clusters are one actor |
| Target | CL-CRI-1131: Mexican transportation, Mexican federal ministries, municipal water utilities in Mexico and Ecuador. CL-CRI-1163: Brazilian financial organizations |
| Vector | CL-CRI-1131: living off the land after access, with self hosted NextChat on attacker infrastructure. CL-CRI-1163: resume themed phishing attachment in February 2026, then custom RATs and SockTz |
| Status | Unit 42 described both as ongoing as of the 2026-09-03 report. Infrastructure documented from February through June 2026 |
| First Observed | CL-CRI-1131 certificate on 2026-02-27. CL-CRI-1163 resume phish in February 2026 |

## Detailed Findings

According to [Unit 42](https://unit42.paloaltonetworks.com/ai-tool-use-targeting-latam-orgs/), CL-CRI-1131 operators in an April 2026 intrusion failed repeated attempts to dump the SAM hive and the domain controller NTDS.dit file, then created volume shadow copies and copied files from them. They ran numbered batch scripts and added a permissions check before writing the collection directory. Unit 42 reads that trial and error as consistent with LLM use. After collection problems they troubleshot connectivity to 62.171.185.97, which Unit 42 ties to exfiltration.

Pivoting on that IP produced a Let's Encrypt certificate for m-doxa-apodo.duckdns.org. Unit 42 said a February 2026 single name certificate for m-doxa-apodo was followed in April and June by certificates with five subject alternative names. The published host names are m-doxa-apodo, m-doxa-geo, m-doxa-intel, m-doxa-repuve, m-doxa-sre, and m-doxa-vacunas, all under duckdns.org. Unit 42 glossed apodo as alias, geo as geolocation, intel as intelligence, and vacunas as vaccines. The February certificate SHA256 7d766942ef34542cee39c852286599958c4c2e23187010c4d38dbf88fcb40bf8 sat on 165.22.184.26. The April hash 4e218e70afdbb116209ec0ebe8fc556e296e69648aa4e0425b83c0e863a8fee5 and the June hash 46ac289ce0c13666de616446f5d5a68da8bd150f4f065c3bec02f63776d3899c sat on 178.128.87.160. Those three values are TLS certificate fingerprints, not malware file hashes, so they are not in the hash block.

Unit 42 said 178.128.87.160, used in the April and June 2026 activity, hosted NextChat on TCP 3000. NextChat is an open source web UI for talking to more than one model from attacker controlled infrastructure. Unit 42 assessed that the operators used it to generate the workaround scripts after the dump failures. Unit 42 pointed at an earlier Gambit writeup of February 2026 Mexican government activity that described multiple LLMs, including Claude and GPT-4.1, and at CloudSEK reporting that tracks the same Mexican activity as Operation Escaneo. This feed does not merge those papers into a single actor name.

CL-CRI-1163 is the Brazilian financial cluster. Unit 42 said initial access in February 2026 was a resume themed phishing attachment, followed by custom RATs. Install attempts for SockTz versions 1 through 8 came from a compromised WordPress site. Version 8 was named socktz_v8.exe. After that path failed, the operators pulled socktz_v9 from their own infrastructure. Unit 42 said researchers had already tied SockTz and 167.148.195.53 to JBoss targeting, but this case attempted versions 1 through 9 inside a two hour window. An open directory on that host held the installers and hundreds of scripts. Unit 42 named exploit_creative.py, exploit_careful.py, and rce_focused.py, plus files with an _output suffix, as signs of language model driven iteration. The published download is 167.148.195.53:8888/socktz_v9.exe. Unit 42 published two SHA256 samples for the Brazilian campaign: a38b2cf8beff32a276eed8783723ecf8cc53d7dc88669e1b998dddc4db6fe996 and 87bf8bc8b4a2cf34f0af1afe161f123a3d200e77f6c6f41b81bf6ae66ee172ec. The article lists the second hash immediately before the socktz_v9.exe URL.

Unit 42 kept the clusters separate. Shared traits are SOCKS5 relays and commercial LLM use, not a single group name. Unit 42's point for defenders is the exposed NextChat service and the open staging directory, which exposed the playbook.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Phishing: Spearphishing Attachment | T1566.001 | CL-CRI-1163 February 2026 resume themed attachment |
| OS Credential Dumping: Security Account Manager | T1003.002 | CL-CRI-1131 repeated failed SAM hive dumps |
| OS Credential Dumping: NTDS | T1003.003 | Failed NTDS.dit collection, then volume shadow copies |
| Command and Scripting Interpreter: Windows Command Shell | T1059.003 | Numbered batch scripts for collection |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | Self hosted NextChat on 178.128.87.160:3000 used to work around collection failures |
| Proxy | T1090 | SockTz reverse SOCKS5 proxy, versions 1 through 9 |
| Ingress Tool Transfer | T1105 | socktz_v8.exe from a compromised WordPress site, then socktz_v9.exe from 167.148.195.53:8888 |
| Exfiltration Over C2 Channel | T1041 | Unit 42 tied CL-CRI-1131 exfiltration troubleshooting to 62.171.185.97 |

## IOCs

Domains are defanged for display. Certificate fingerprints stay in the narrative and are not file hashes. Do not block duckdns.org or the NextChat project.

### Domains

```
m-doxa-apodo[.]duckdns[.]org
m-doxa-geo[.]duckdns[.]org
m-doxa-intel[.]duckdns[.]org
m-doxa-repuve[.]duckdns[.]org
m-doxa-sre[.]duckdns[.]org
m-doxa-vacunas[.]duckdns[.]org
```

### Full URL Paths

```
167.148.195[.]53:8888/socktz_v9.exe
```

### Splunk Format

```
"m-doxa-apodo.duckdns.org" OR "m-doxa-geo.duckdns.org" OR "m-doxa-intel.duckdns.org" OR "m-doxa-repuve.duckdns.org" OR "m-doxa-sre.duckdns.org" OR "m-doxa-vacunas.duckdns.org" OR "62.171.185.97" OR "165.22.184.26" OR "178.128.87.160" OR "167.148.195.53" OR "167.148.195.53:8888/socktz_v9.exe" OR "a38b2cf8beff32a276eed8783723ecf8cc53d7dc88669e1b998dddc4db6fe996" OR "87bf8bc8b4a2cf34f0af1afe161f123a3d200e77f6c6f41b81bf6ae66ee172ec"
```

### File Hashes

```
a38b2cf8beff32a276eed8783723ecf8cc53d7dc88669e1b998dddc4db6fe996
87bf8bc8b4a2cf34f0af1afe161f123a3d200e77f6c6f41b81bf6ae66ee172ec
```

### IP Addresses

```
62.171.185.97
165.22.184.26
178.128.87.160
167.148.195.53
```

### Package Indicators

```
No package IOCs published by source
```

## Detection Recommendations

On Mexican and regional government or transport endpoints, alert on failed reg save or ntdsutil style dumps of SAM and NTDS.dit followed by vssadmin or wmic shadow copy creation and a series of numbered .bat files. On the network, alert on TLS or DNS for the six m-doxa duckdns names, and on connections to 62.171.185.97 and 165.22.184.26. Treat 178.128.87.160:3000 as a NextChat panel only in combination with those names or with the certificate timeline. A lone NextChat install on an approved admin host is not this cluster.

For Brazilian finance, hunt email gateways for resume themed attachments in the February 2026 window if mail is still retained, then endpoint creation of socktz_v1.exe through socktz_v9.exe. Block or alert on 167.148.195.53 and on 167.148.195.53:8888/socktz_v9.exe. Hash match the two SHA256 values. An open directory full of exploit_*.py names with adjective suffixes, or files ending in _output, is the Unit 42 fingerprint for this staging host. Do not denylist duckdns.org.

## References

- [Unit 42] Attackers Expose Ongoing AI Tool Use Targeting Organizations in Latin America (2026-09-03): https://unit42.paloaltonetworks.com/ai-tool-use-targeting-latam-orgs/
