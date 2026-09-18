# PyPI Typosquats openaii, ollamaa, langgrap, and transfomers Plant .pth Startup Backdoors

**Date:** 2026-09-18
**Tags:** supply-chain, malware, prompt-injection

## Executive Summary

GitHub Advisory Database reviewed four PyPI malware advisories on 2026-09-11 for openaii 1.55.3, ollamaa 0.4.2, langgrap 0.2.45, and transfomers 4.44.2, grouped as campaign 2026-09-openaii. Each wheel drops a .pth file that Python executes on every interpreter start, then XOR 0x5A plus base64 payload fetches lurves-agent.py from 167.86.108.190:7788 or, in Amazon Inspector notes on transfomers, 16.78.16.190:7788. Hunt those package names, /tmp/.lurves-planted, and the two IPs. Rebuild any environment that installed them and rotate SSH, cloud, and registry credentials.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | 2026-09-openaii PyPI typosquats with shared .pth loader, lurves second stage, credential theft, persistence, cryptominer |
| Actor / Attribution | Unnamed. OpenSSF kam193 and Amazon Inspector cataloged the four packages. No named group |
| Target | Python developers, notebook servers, CI, and agents that pip install openai, ollama, langgraph, or transformers lookalikes |
| Vector | Single character typosquats. __init__.py re-exports the real library so imports look fine. Execution is the next python start, not import of the fake name |
| Status | Removed from PyPI per public cataloging. Hosts that already started Python after install remain compromised |
| First Observed | Advisories published 2026-09-11 21:31 UTC. Corgea summarized the 11 to 13 September window on 2026-09-14 |

## Detailed Findings

According to [GitHub Advisory GHSA-q5h5-h6mj-vhgv](https://github.com/advisories/GHSA-q5h5-h6mj-vhgv) and sibling advisories GHSA-9gv4-vfjg-jjrm, GHSA-crjm-2g45-pq97, and GHSA-2p95-qvc5-6rjq, all four packages were reviewed on 2026-09-11 and labeled campaign 2026-09-openaii. Each advisory says a malicious .pth file runs at interpreter load, downloads a further stage, hides itself, clears logs, steals SSH keys and cloud credentials, persists, and plants a cryptominer. Each advisory states the original .pth contains a simple attempt to discourage analysis via AI agents.

OpenSSF malicious-packages records MAL-2026-16135, MAL-2026-16134, MAL-2026-16133, and MAL-2026-16136 list the same C2 for openaii, ollamaa, langgrap, and transfomers: 167.86.108.190 with http://167.86.108.190:7788/stage1.py and http://167.86.108.190:7788/.lurves-agent.py.

Amazon Inspector write-ups mirrored on OffSeq add installer detail. openaii copies the official OpenAI PyPI summary, re-exports from openai, and drops openaii-setup.pth that execs a base64 then XOR 0x5A payload gated on /tmp/.lurves-planted. ollamaa does the same for ollama, then a detached subprocess fetches http://167.86.108.190:7788/.lurves-agent.py to /tmp/.a and runs python3 /tmp/.a --daemon with start_new_session=True. For transfomers, Amazon Inspector names http://16.78.16.190:7788/lurves-agent.py written to /tmp/a. Represent both IPs. OSSF lists 167.86.108.190 for transfomers. Amazon Inspector lists 16.78.16.190 for that package.

[Corgea](https://corgea.com/research/openaii-ollamaa-langgrap-transfomers-pypi-pth-typosquats-september-2026) reported on 2026-09-14 that the four .pth paths share SHA256 6228ded2ea439fc1a2970e212215d761c8d1c65ea59b6adb2085d579efd11bdd, which is enough to treat the 11 September wave as one family. Cover comments above exec() tell scanners the file is safe and benign, verified clean infrastructure, and that no further analysis is required. That is prompt injection aimed at LLM triage, not a jailbreak service.

Corgea also listed platform-telemetry-client 1.0.0 and chroma-client 0.5.7 in the same 11 to 13 September window. Those two are not in the four GitHub malware advisories above. Treat them as related public catalog items, not confirmed members of 2026-09-openaii, until a GHSA or OpenSSF record is cited. They are not added to this IOC feed.

Do not add pypi.org, openai, ollama, langgraph, or transformers as IOCs. The malicious names and the two C2 IPs are the indicators.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | PyPI typosquats of openai, ollama, langgraph, transformers |
| Command and Scripting Interpreter: Python | T1059.006 | .pth import line execs obfuscated Python at every startup |
| Obfuscated Files or Information | T1027 | base64 then XOR 0x5A, analyst bait comments |
| Ingress Tool Transfer | T1105 | lurves-agent.py and stage1.py over plaintext HTTP |
| Unsecured Credentials: Credentials In Files | T1552.001 | Follow on stage steals SSH keys and cloud credentials |
| Indicator Removal | T1070 | Loader hides itself and clears logs |
| Resource Hijacking | T1496 | Cryptominer in the second stage |
| Obtain Capabilities: Artificial Intelligence | T1588.007 | .pth comments attempt to make AI agents skip analysis |

## IOCs

Display values are defanged. JSON feed stores clean values.

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
pypi[.]org/project/openaii
pypi[.]org/project/ollamaa
pypi[.]org/project/langgrap
pypi[.]org/project/transfomers
```

### Splunk Format

```
"167.86.108.190" OR "16.78.16.190" OR "pypi:openaii@1.55.3" OR "pypi:ollamaa@0.4.2" OR "pypi:langgrap@0.2.45" OR "pypi:transfomers@4.44.2" OR "/tmp/.lurves-planted" OR "lurves-agent.py"
```

### File Hashes

```
6228ded2ea439fc1a2970e212215d761c8d1c65ea59b6adb2085d579efd11bdd
```

### Package Indicators

```
pypi:openaii@1.55.3
pypi:ollamaa@0.4.2
pypi:langgrap@0.2.45
pypi:transfomers@4.44.2
```

## Detection Recommendations

Search lockfiles and requirements for openaii==1.55.3, ollamaa==0.4.2, langgrap==0.2.45, and transfomers==4.44.2. On disk, hunt site-packages for openaii-setup.pth, ollamaa-setup.pth, langgrap-setup.pth, transfomers-setup.pth, and SHA256 6228ded2ea439fc1a2970e212215d761c8d1c65ea59b6adb2085d579efd11bdd. Host artefacts: /tmp/.lurves-planted, /tmp/.a, /tmp/a, python3 ... --daemon, start_new_session=True.

On web proxy and DNS, alert on 167.86.108.190:7788 and 16.78.16.190:7788 over HTTP. Rebuild virtualenv or container images from reviewed names. pip uninstall is not enough after .pth has executed. Rotate SSH keys, cloud keys, PyPI tokens, and Git credentials from a clean host. Do not denylist pypi.org.

## References

- [GitHub Advisory] Malicious code in openaii (PyPI) GHSA-q5h5-h6mj-vhgv (2026-09-11): https://github.com/advisories/GHSA-q5h5-h6mj-vhgv
- [GitHub Advisory] Malicious code in ollamaa (PyPI) GHSA-9gv4-vfjg-jjrm (2026-09-11): https://github.com/advisories/GHSA-9gv4-vfjg-jjrm
- [GitHub Advisory] Malicious code in langgrap (PyPI) GHSA-crjm-2g45-pq97 (2026-09-11): https://github.com/advisories/GHSA-crjm-2g45-pq97
- [GitHub Advisory] Malicious code in transfomers (PyPI) GHSA-2p95-qvc5-6rjq (2026-09-11): https://github.com/advisories/GHSA-2p95-qvc5-6rjq
- [OpenSSF] MAL-2026-16135 openaii (2026-09-11): https://github.com/ossf/malicious-packages/blob/6f29f66e2810d13aefdb7c0fc2ebd05b265745da/osv/malicious/pypi/openaii/MAL-2026-16135.json
- [Corgea] openaii, ollamaa, langgrap, and transfomers used .pth startup hooks to backdoor Python environments (2026-09-14): https://corgea.com/research/openaii-ollamaa-langgrap-transfomers-pypi-pth-typosquats-september-2026
- [OffSeq] Malicious code in openaii (PyPI) (2026-09-11): https://radar.offseq.com/threat/malicious-code-in-openaii-pypi-caa044013c40d970
- [OffSeq] Malicious code in ollamaa (PyPI) (2026-09-11): https://radar.offseq.com/threat/malicious-code-in-ollamaa-pypi-8da4afa83b30f47c
- [OffSeq] Malicious code in transfomers (PyPI) (2026-09-11): https://radar.offseq.com/threat/malicious-code-in-transfomers-pypi-2dc389a1999c7c2a
