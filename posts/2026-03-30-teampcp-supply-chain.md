# TeamPCP Supply Chain Campaign Targets LiteLLM and Telnyx PyPI Packages

**Date:** 2026-03-30  
**Tags:** Supply Chain, PyPI, LLM Orchestration  

## Executive Summary

An active supply chain campaign tracked as TeamPCP is distributing malicious Python packages on PyPI that impersonate legitimate LLM orchestration libraries. The campaign targets developers working with LiteLLM and Telnyx, embedding backdoors that exfiltrate environment variables, API keys, and credentials from development machines.

## Detailed Findings

The campaign was first identified by ReversingLabs in early March 2026 and independently confirmed by Socket.dev. At least three malicious packages have been identified on PyPI, all using typosquatting and namespace confusion techniques to masquerade as official libraries.

The malicious packages execute a post-install hook that collects environment variables, with particular focus on variables containing API keys for LLM providers such as OPENAI_API_KEY, ANTHROPIC_API_KEY, AWS_ACCESS_KEY_ID, and AZURE_OPENAI_KEY. Collected data is exfiltrated over HTTPS to attacker-controlled infrastructure.

The targeting is precise. By impersonating LiteLLM, which is a popular proxy layer for routing requests across multiple LLM providers, the attackers position themselves directly in the workflow of teams building GenAI applications. A compromised developer machine running a LiteLLM proxy would expose API keys for every LLM provider the organization uses.

### Distribution Mechanism

All packages were uploaded to PyPI using newly created accounts. Package names were chosen to create confusion with the legitimate litellm and telnyx packages:

- litellm-proxy-server
- litellm-client
- telnyx-ai

### Post-Install Behavior

The setup.py in each package contains a custom install class that executes during pip install. The payload performs the following actions:

1. Enumerates all environment variables and filters for keys matching patterns such as API_KEY, SECRET, TOKEN, PASSWORD
2. Collects system information including hostname, username, OS version, and Python version
3. Reads .env files, .bashrc, and cloud provider credential files if present
4. Exfiltrates all collected data via HTTPS POST to a hardcoded C2 endpoint
5. Establishes persistence by writing a cron job or scheduled task that re-exfiltrates on a recurring basis

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Software Dependencies | T1195.001 | Malicious PyPI packages impersonating AI libraries |
| Command and Scripting Interpreter: Python | T1059.006 | Post-install Python execution via setup.py |
| Unsecured Credentials: Credentials in Files | T1552.001 | Harvesting .env files and cloud credential stores |
| Data from Local System | T1005 | Environment variable and config file collection |
| Exfiltration Over C2 Channel | T1041 | HTTPS POST exfiltration of stolen credentials |
| Scheduled Task/Job | T1053 | Persistence via cron or scheduled task |

## IOCs

### Domains

```
litellm-proxy-server[.]com
telnyx-ai-api[.]com
pypi-cdn-mirror[.]net
```

### Full URL Paths

```
hxxps://litellm-proxy-server[.]com/api/collect
hxxps://telnyx-ai-api[.]com/v1/register
hxxps://pypi-cdn-mirror[.]net/upload/data
```

### Splunk Format

```
"litellm-proxy-server.com/api/collect" OR "telnyx-ai-api.com/v1/register" OR "pypi-cdn-mirror.net/upload/data"
```

### Package Indicators

```
PyPI Package: litellm-proxy-server (all versions)
PyPI Package: litellm-client (all versions)
PyPI Package: telnyx-ai (all versions)
SHA256: pending confirmation from source reports
```

## Detection Recommendations

Monitor pip install logs and package management audit trails for the listed package names. Review CI/CD pipeline dependencies for unexpected additions. Rotate any API keys that may have been exposed on machines where these packages were installed.

For Splunk environments, query web proxy logs for the listed C2 domains. For endpoint detection, look for Python processes spawning network connections during package installation outside of expected pip operations.

## References

- ReversingLabs: TeamPCP Supply Chain Analysis (March 2026)
- Socket.dev: Malicious PyPI Packages Targeting LLM Developers (March 2026)
- MITRE ATT&CK: T1195.001, T1059.006, T1552.001
