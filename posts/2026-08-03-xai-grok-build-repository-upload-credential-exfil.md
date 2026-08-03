# xAI Grok Build CLI Covert Repository Upload: Unredacted Secrets and Git History Exfiltrated to Google Cloud Storage

**Date:** 2026-08-03
**Tags:** malicious-tool, shadow-ai, supply-chain

## Executive Summary

xAI's Grok Build CLI was silently uploading developers' entire code repositories—including unredacted API keys, database credentials, and full Git commit histories—to a Google Cloud Storage bucket, according to a wire-level analysis published by independent AI safety researcher Cereblab on July 12. In one test, a 12GB repo saw the model request just 192KB of content, while the storage channel exfiltrated 5.10GiB — a 27,800x gap between declared read scope and actual data sent. User-facing privacy control—the 'Improve the model' toggle—had no effect on the repository uploads.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Grok Build Credential Exfiltration |
| Attribution | xAI (Unintentional Design / Implementation Vulnerability) (confidence: high) |
| Target | Developers using xAI Grok Build CLI (public beta since May 2026) |
| Vector | AI coding assistant automatically uploading entire Git repositories during model inference to cloud storage |
| Status | active |
| First Observed | 2026-05-01 |

## Detailed Findings

The findings, first published by security researcher Cereblab on July 12th, documented that Grok Build CLI version 0.2.93 was silently uploading complete local Git repositories to a GCS bucket called grok-code-session-traces, managed by xAI. The uploads included untracked files, full commit histories, and unredacted secrets. The submitted data was stored in a bucket called 'grok-code-session-traces' on Google Cloud Storage. Furthermore, disabling the 'Use for model improvement' setting in Grok did not stop the repository upload.

As of July 13, 2026, xAI has not issued a formal public statement about the incident. There's been no disclosure about the scope of affected users, no clarification on data retention policies for the material already uploaded, and no confirmation that previously collected repositories and secrets have been deleted from the grok-code-session-traces bucket. The mitigation was applied remotely and invisibly, with no client-side software update, no changelog entry, and no public announcement. The official changelog listed version 0.2.98 as the latest release on July 12 — the day before the shutdown — without any reference to repository-upload behavior.

In a comparison test, cereblab found that Claude Code, Codex CLI, and Gemini sent only the files their agents opened during a coding task — none transmitted a whole-repository Git bundle, establishing Grok Build as a documented outlier in credential-handling practices across AI coding assistants.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Unsecured Credentials | T1552.001 | Developer credentials in .env files and Git history automatically uploaded without user consent or knowledge |
| Exfiltration Over Unencrypted/Obfuscated Non-C2 Protocol | T1048.003 | Repository data transmitted to Google Cloud Storage bucket via unencrypted HTTP/JSON protocol with no explicit user authorization |
| Staging Data in Cloud Storage | T1537 | Full Git repositories including secrets staged in GCS bucket grok-code-session-traces for potential exfiltration or training data |

## IOCs

### Domains

```
grok-code-session-traces.storage.googleapis.com
```

### Full URL Paths

```
storage.googleapis.com/grok-code-session-traces/
```

### Splunk Format

```
"grok-code-session-traces.storage.googleapis.com" OR "storage.googleapis.com/grok-code-session-traces/"
```

### Package Indicators

```
{'name': 'grok-build', 'registry': 'cargo', 'version': '0.2.93', 'note': 'Vulnerable version that exfiltrated repositories; fixed server-side July 13, 2026; open-sourced July 15 via GitHub xai-org/grok-build'}
```

### Affected Platforms

```
macOS (primary testing platform)
Linux (inferred from CI/CD integration)
Windows (potential via WSL/Cloud)
```

## Detection Recommendations

Defenders should: (1) Audit Git repositories and cloud credential stores for any commits made prior to July 13, 2026 on machines running Grok Build v0.2.93 or earlier; (2) Rotate all API keys, database passwords, SSH keys, and cloud tokens that were present in tracked Git files or commit history on machines running Grok Build before mitigation date; (3) Review outbound traffic from development machines to grok-code-session-traces.storage.googleapis.com or any xAI-owned GCS buckets during May–July 2026 to estimate scope of exposure; (4) Treat all credentials in Git history (including those deleted in later commits) as potentially exfiltrated; (5) Implement network-level monitoring for GCS bucket access patterns and volume exfiltration to identify similar data-leakage patterns in other AI coding assistants; (6) Require explicit user consent (not buried in EULA) and UI-level transparency for AI tools that access local source code or secrets.

## References

- [Cereblab (Security Researcher)] xAI's Grok Build CLI Caught Uploading Entire Codebases to Google Cloud Without Consent (2026-07-12) — https://cryptobriefing.com/xai-grok-build-cli-private-code-leak/
- [TechTimes] Grok Build Shipped Entire Codebases to xAI Cloud; Privacy Toggle Did Nothing (2026-07-14) — https://www.techtimes.com/articles/320420/20260714/grok-build-shipped-entire-codebases-xai-cloud-privacy-toggle-did-nothing.htm
- [CTOL Digital Solutions] The Invisible Exfiltration: xAI's Grok Build Is Quietly Uploading Your Entire Codebase (2026-07-15) — https://www.ctol.digital/news/the-invisible-exfiltration-xai-grok-build-quietly-uploading-your-entire-codebase/
- [Cybernews] Grok Build uploaded entire Git repositories, researcher finds (2026-07-12) — https://cybernews.com/ai-news/grok-build-git-repository-upload/
- [The Register] Grok Build open-sourced after covert upload (2026-07-16) — https://www.techtimes.com/articles/320671/20260716/grok-build-open-sourced-after-covert-upload-code-exfiltrate-repos-stays.htm
- [MLQ News] xAI's Grok Build CLI Caught Uploading Entire Codebases to Google Cloud Without Consent (2026-07-12) — https://mlq.ai/news/xais-grok-build-cli-caught-uploading-entire-codebases-to-google-cloud-without-consent/
