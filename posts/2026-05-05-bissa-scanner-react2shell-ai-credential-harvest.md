# Bissa Scanner: AI-Assisted CVE-2025-55182 Mass Exploitation Harvests 30,000+ .env Files and AI Provider Credentials Across 900 Organizations

**Date:** 2026-05-05
**Tags:** malware, llmjacking, supply-chain, Phishing

## Executive Summary

The DFIR Report disclosed on April 22, 2026, that an exposed attacker server revealed a large-scale AI-assisted exploitation operation, dubbed Bissa Scanner, that weaponized CVE-2025-55182 (React2Shell, CVSS 10.0) to scan millions of targets, confirm 900+ successful compromises, and exfiltrate over 30,000 .env files spanning April 10–21, 2026. The operator embedded Claude Code and OpenClaw AI agents directly into the attack pipeline for codebase analysis, troubleshooting, and workflow orchestration, and AI provider credentials—keys for Anthropic, OpenAI, Google, Mistral, OpenRouter, Groq, Replicate, DeepSeek, and HuggingFace—were the single largest credential category stolen. Organizations running React 19.x or Next.js 15.x/16.x App Router that have not patched CVE-2025-55182 should treat any deployment as potentially compromised and rotate all AI API keys, cloud credentials, and secrets immediately.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Bissa Scanner |
| Actor / Attribution | Unattributed; moniker "bissapwned"; operator leveraged Claude Code and OpenClaw AI tools |
| Target | React 19.x / Next.js 15.x–16.x App Router deployments; secondary focus on financial, cryptocurrency, and retail sectors |
| Vector | Internet-wide scanning for CVE-2025-55182 (React2Shell) using custom scanner harness; single HTTP POST exploit |
| Status | Active (April 10–21, 2026 observed window; infrastructure persists) |
| First Observed | September 2025 (Filebase bissa bucket); mass campaign from April 10, 2026 |

## Detailed Findings

### CVE-2025-55182 (React2Shell) as Primary Exploit Primitive

According to The DFIR Report (April 22, 2026), the Bissa Scanner operation relied entirely on CVE-2025-55182, a CVSS 10.0 unauthenticated remote code execution vulnerability in React Server Components' "Flight" protocol serialization scheme. The vulnerability was publicly disclosed on December 3, 2025 and affects React versions 19.0–19.2.0 and Next.js 15.x/16.x when App Router is enabled. The exploit requires a single crafted HTTP POST to the RSC endpoint; the server deserializes attacker-controlled data without type checking, resolving arbitrary anonymous function references that execute in the web server process context.

The DFIR Report documented that the attacker used THC's target feed infrastructure, downloading ZIP archives from cs2.ip.thc[.]org and assigning the `cve_2025_55182` module to scan targets. The scanner harness automated target enumeration, exploitation, .env file extraction, cloud metadata collection (AWS IMDS, GCP metadata, Azure IMDS), and Kubernetes service account token enumeration.

### Scale and Infrastructure

The DFIR Report found the exposed server contained more than 13,000 files across 150+ directories covering exploitation staging, victim data, access validation scripts, and operator workflow artifacts. The full corpus in S3-compatible Filebase storage contained 400+ raw `env-batch-*.zip` archives and over 30,000 distinct .env filenames spanning April 10–21, 2026.

Filebase bucket history, according to The DFIR Report, reveals at least three storage phases: bucket "bissa" from September 2025, "bissa2" from November 2025, and "bissapromax" from December 2025 onward, indicating the operation ran for at least seven months prior to the observed mass collection phase. The scanner was configured to watch its local results/ directory, batch .env files into ZIP archives, and upload them to `s3.filebase[.]com` under the `bissapromax/archives/` prefix.

### Telegram C2 and Triage Pipeline

The DFIR Report found runner scripts across the Bissa harness with a hardcoded Telegram bot token tied to @bissapwned_bot (operator user ID 8798206332, chat ID 1609309278). Each bot message delivered a structured single-line triage record per confirmed CVE-2025-55182 hit, summarizing victim identity, runtime context, privilege level, cloud posture, and recoverable secret surface for rapid operator review. A separate @bissa_scan_bot handle was identified inside the AI control subsystem.

### AI Provider Credentials as Primary Target

According to The DFIR Report, AI providers constituted the single largest credential category in the harvested .env files. Keys were recovered for Anthropic (Claude API), OpenAI, Google (Gemini/Vertex AI), Mistral, OpenRouter, Groq, Replicate, DeepSeek, and HuggingFace. This targeting profile is consistent with LLMjacking monetization: stolen AI API keys are sold on black market marketplaces (Discord, Telegram) and used to resell access to LLM services at discounted rates.

Cloud infrastructure credentials (AWS, GCP, Azure), payment processor keys, database credentials, and CI/CD tokens also appeared in the harvested files across financial, cryptocurrency, and retail organizations.

### AI-Assisted Attacker Workflow

The DFIR Report found Claude project transcripts under a `/bissascanner/` project directory on the exposed server. These transcripts show the operator using Claude Code to read the scanner codebase, understand lease and acknowledgement flow in the collection harness, troubleshoot missed exploit hits, review benchmark output across target batches, and document the acquisition layer sufficiently to rebuild components. OpenClaw was also present in the operator's toolchain for orchestration and pipeline refinement.

This is a materially different use of AI from simple script generation: the operator maintained an ongoing AI coding session across operational phases, treating Claude Code as an embedded development resource rather than a one-shot tool.

### Post-Compromise Triage and Targeting

The DFIR Report documented that artifacts on the server show the operator triaged victim access post-exploitation, validated stolen data, and concentrated deeper collection and follow-on activity on organizations meeting a clear value threshold—particularly those in financial services, cryptocurrency, and retail. Validated high-value targets received additional attacker attention including lateral movement and deeper credential extraction.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Active Scanning: Vulnerability Scanning | T1595.002 | Internet-wide scanning for CVE-2025-55182 RSC endpoints using custom scanner harness with THC target feeds |
| Exploit Public-Facing Application | T1190 | CVE-2025-55182 (CVSS 10.0) single-HTTP-request RCE against React 19.x / Next.js App Router |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Exploit payload executes arbitrary JavaScript in the React server process via deserialization chain |
| File and Directory Discovery | T1083 | Automated .env file enumeration and collection from compromised web server filesystem |
| Unsecured Credentials: Credentials In Files | T1552.001 | Bulk .env file harvesting across 900+ compromised hosts; AI provider API keys dominant category |
| Data from Cloud Storage Object | T1530 | AWS IMDS, GCP metadata server, Azure IMDS, Kubernetes service account token enumeration |
| Exfiltration Over C2 Channel | T1041 | Telegram bot (@bissapwned_bot) receives structured triage records per confirmed compromise |
| Transfer Data to Cloud Account | T1537 | .env ZIPs uploaded to Filebase S3-compatible storage bucket (bissapromax) |
| Obtain Capabilities: Exploits | T1588.005 | CVE-2025-55182 weaponized within months of December 2025 public disclosure |
| Resource Hijacking | T1496 | AI API credentials harvested for downstream LLMjacking resale |
| Automated Collection | T1119 | Scanner harness automated scanning, exploitation, collection, and archival end-to-end without operator intervention |

## IOCs

### Domains

```
s3.filebase[.]com
cs2.ip.thc[.]org
```

### Full URL Paths

```
s3.filebase[.]com/bissapromax/archives/
cs2.ip.thc[.]org
```

### Splunk Format

```
"s3.filebase.com/bissapromax" OR "cs2.ip.thc.org" OR "bissapwned_bot" OR "bissapromax"
```

### File Hashes

```
No file hash IOCs published by source
```

## Detection Recommendations

**Web Application Layer — CVE-2025-55182 Exploit Traffic:**
Monitor web application and proxy logs for HTTP POST requests targeting RSC Flight endpoints. Suspicious patterns include requests to `/_next/static/chunks/`, `/__nextjs_original-stack-frames`, or paths containing `.rsc` that contain serialized data payloads. Look for abnormal response patterns (unexpected process spawning) following RSC endpoint requests.

```
index=web sourcetype=access_combined
| where like(uri_path, "%/_next%") AND http_method="POST"
| where like(request_body, "%__esModule%") OR like(request_body, "%__proto__%")
| stats count by src_ip, uri_path, http_status
| where count > 5
```

**Endpoint — Web Server Process Spawning System Commands:**
Any Node.js process (`node`, `npm`, `next`) spawning `sh`, `bash`, `curl`, `wget`, or `python` is a strong indicator of CVE-2025-55182 exploitation.

```
index=endpoint (process_name="node" OR process_name="npm" OR parent_process="next")
| where match(process, "(?i)(bash|sh|curl|wget|python|id|whoami|env)")
| table _time, ComputerName, user, parent_process, process
```

**Network — Filebase S3 Upload Exfiltration:**
Alert on outbound HTTPS connections to `s3.filebase[.]com` from web application servers. Filebase is a legitimate service, so alert based on originating process (node/npm) rather than destination alone.

```
index=proxy
| where like(url_host, "%filebase.com%") AND http_method="PUT"
| join src_ip [search index=endpoint process_name="node"]
| table _time, src_ip, url, user_agent
```

**Credential Hygiene — AI Provider API Key Rotation:**
Any organization running React 19.0–19.2.0 or Next.js 15.x/16.x (App Router) that deployed .env files containing AI API keys (ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_API_KEY, HF_TOKEN, MISTRAL_API_KEY, GROQ_API_KEY) should rotate those keys immediately. The Bissa Scanner collected .env files from all compromised hosts; exposure is not contingent on the attacker completing post-exploitation triage.

**Cloud Credential Rotation:**
Rotate AWS IAM credentials, GCP service account keys, and Azure service principal secrets accessible from compromised deployments. Check CloudTrail, GCP Audit Logs, and Azure Activity Logs for API calls from unexpected source IPs or during off-hours.

## References

- [The DFIR Report] Bissa Scanner Exposed: AI-Assisted Mass Exploitation and Credential Harvesting (April 22, 2026) — https://thedfirreport.com/2026/04/22/bissa-scanner-exposed-ai-assisted-mass-exploitation-and-credential-harvesting/
- [Trend Micro] CVE-2025-55182: React2Shell Analysis, Proof-of-Concept Chaos, and In-the-Wild Exploitation — https://www.trendmicro.com/en_us/research/25/l/CVE-2025-55182-analysis-poc-itw.html
- [Google Cloud / Mandiant] Multiple Threat Actors Exploit React2Shell (CVE-2025-55182) — https://cloud.google.com/blog/topics/threat-intelligence/threat-actors-exploit-react2shell-cve-2025-55182
- [GreyNoise] CVE-2025-55182 (React2Shell) Opportunistic Exploitation In The Wild — https://www.greynoise.io/blog/cve-2025-55182-react2shell-opportunistic-exploitation-in-the-wild-what-the-greynoise-observation-grid-is-seeing-so-far
- [Penligent] React2Shell, Telegram Bots, and the Bissa Scanner Breach Pipeline — https://www.penligent.ai/hackinglabs/react2shell-telegram-bots-and-the-bissa-scanner-breach-pipeline/
- [CyberExpress] Bissa Scanner, An AI-Assisted Credential Harvesting Factory — https://thecyberexpress.com/bissa-scanner-ai-assisted-credential-factory/
