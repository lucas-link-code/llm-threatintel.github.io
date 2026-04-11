# Project Glasswing: Anthropic's Claude Mythos Preview Identified Thousands of Zero-Day Vulnerabilities in Critical Software—Cybersecurity Capability Reshaping Defense and Offense

**Date:** 2026-04-11
**Tags:** nation-state

## Executive Summary

Anthropic formed Project Glasswing because of capabilities observed in a new frontier model trained by Anthropic called Claude Mythos2 Preview, a general-purpose, unreleased frontier model that reveals a stark fact: AI models have reached a level of coding capability where they can surpass all but the most skilled humans at finding and exploiting software vulnerabilities. Over the past few weeks, Anthropic used Claude Mythos Preview to identify thousands of zero-day vulnerabilities (that is, flaws that were previously unknown to the software's developers), many of them critical, in every major operating system and every major web browser, along with a range of other important pieces of software.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Project Glasswing |
| Attribution | Anthropic (defensive AI security initiative) (confidence: high) |
| Target | Critical software ecosystems (operating systems, browsers, infrastructure software); government and commercial cybersecurity organizations |
| Vector | AI-powered vulnerability discovery and exploit generation; gated distribution to select defense partners |
| Status | active |
| First Observed | 2026-04-10 |

## Detailed Findings

Over the past year, AI models have become increasingly effective at reading and reasoning about code—in particular, they show a striking ability to spot vulnerabilities and work out ways to exploit them. Claude Mythos Preview demonstrates a leap in these cyber skills—the vulnerabilities it has spotted have in some cases survived decades of human review and millions of automated security tests, and the exploits it develops are increasingly sophisticated. Announced as part of Anthropic's new Project Glasswing, a specialized AI model named Claude Mythos Preview is entering a gated release to help secure the world's most critical software. Because AI models capable of building working exploits carry inherent risks, AWS and Anthropic are taking a deliberately cautious approach to distribution. Anthropic said Amazon Web Services, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, the Linux Foundation, Microsoft, NVIDIA, and Palo Alto Networks would all "use Mythos Preview as part of their defensive security work." Anthropic is also working with more than 40 other organizations to allow them to use the tool. Cyberscoop reported that Mythos Preview had already identified thousands of previously unknown vulnerabilities. "While Mythos Preview was not trained specifically for cybersecurity purposes, its coding and reasoning capabilities have proven effective at identifying subtle security flaws that have eluded human analysts and conventional automated tools."

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Vulnerability Research | T1592 | AI-driven systematic vulnerability discovery across critical software; implications for both offensive and defensive capability asymmetry |

## IOCs

### Domains

_Claude Mythos Preview is not publicly available; gated access only. No IOCs applicable._

### Full URL Paths

_Claude Mythos Preview is not publicly available; gated access only. No IOCs applicable._

### Splunk Format

_No IOCs available for Splunk query_

## Detection Recommendations

For organizations not in gated access: assume that nation-states and well-resourced APT groups are developing or acquiring equivalent AI vulnerability discovery tools. Shift defense posture from reactive patching to proactive defense-in-depth: (1) Assume zero-days exist in your critical systems and implement compensating controls (network segmentation, EDR, behavioral monitoring) rather than relying on vulnerability-based defense. (2) Monitor for signs of coordinated vulnerability exploitation affecting multiple vendors simultaneously—a signature of AI-driven offense. (3) Implement security monitoring that detects anomalous patterns of vulnerability exploitation that suggest systematic reconnaissance rather than random targeting.

## References

- [Anthropic] Project Glasswing: Securing critical software for the AI era (2026-04-10) — https://www.anthropic.com/glasswing
- [Cybersecurity News] AWS and Anthropic Advancing AI-powered Cybersecurity With Claude Mythos (2026-04-09) — https://cybersecuritynews.com/aws-and-anthropic-ai-powered-cybersecurity/
- [ASIS Online] Project Glasswing: Anthropic's New Initiative to Use AI to Bolster Cyber Defenses (2026-04-09) — https://www.asisonline.org/security-management-magazine/latest-news/today-in-security/2026/april/project-glasswing/
