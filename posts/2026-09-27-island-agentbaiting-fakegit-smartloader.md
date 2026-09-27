# AgentBaiting: FakeGit Repositories Pose as AI Skills and MCP Servers and Deliver SmartLoader

**Date:** 2026-09-27
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware, mcp-security

## Executive Summary

Island published on 2026-07-20 that FakeGit had about 7,600 malicious GitHub repositories, more than 800 of them posing as AI Skills or MCP servers, and that Claude Code, Gemini, and ChatGPT surfaced campaign repositories from ordinary capability searches without being given a link. The ZIP files are SmartLoader packages that lead to StealC. BleepingComputer reported on 2026-07-21 that Island's download figure is 14,084,688 events across 335 Release assets in 211 repositories, including repeats and automation, not a count of infections. Block the repository paths and ZIP hashes below. Do not denylist github.com.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | FakeGit, with the discovery technique Island calls AgentBaiting. Payload chain is SmartLoader then StealC |
| Actor / Attribution | Island did not name a cluster. BleepingComputer described the operation as considered a continuation of an older Lumma Stealer campaign that Trend Micro tracks as Water Kurita. That name is not in Island's blog. Confidence in a Water Kurita link: low |
| Target | Developers and enterprises installing Skills or MCP servers, including Gmail, WhatsApp, Databricks, Jenkins, and Docker themed lures. Agents that search for those capabilities are part of the delivery path |
| Vector | Copied GitHub projects, lookalike profiles, README install steps, and a Windows ZIP. Public Skill and MCP registries republish the README |
| Status | Active as of Island's July 2026 research. AI themed repository creation peaked in April 2026 |
| First Observed | Island: FakeGit predates the AI wave. AI themed repositories built through March 2026 and peaked in April 2026. Public report 2026-07-20 |

## Detailed Findings

According to [Island](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware), the operation used about 7,600 malicious GitHub repositories from about 6,600 profiles. About 1,400 of those repositories were tied to AI tools, agents, or workflows, and more than 800 posed as Skills or MCP servers. Island counted more than 600 listings of those repositories on public catalogs including LobeHub, Glama, MCP.so, and MCP Market. Island could not say whether each listing was submitted or crawled. Some registry pages copied the attacker README, including the download link.

Island's blog described more than 14 million downloads of GitHub Release assets in about 200 repositories, and gave examples of 149,015 for Zilts345890/Golang-html-parsing, 120,872 for MRX-slayer/ai-resume-parser, and 69,969 for huizuohaode/AI-Image-Generator. [BleepingComputer](https://www.bleepingcomputer.com/news/security/fakegit-campaign-uses-7-600-github-repos-to-push-smartloader-malware/) on 2026-07-21 quoted Island researcher Oleg Zaytsev that the precise counter was 14,084,688 cumulative download events for 335 unique Release assets across 211 repositories, and that the figure includes repeated requests and automated activity. It is not an infection count. Thousands of other repositories embedded ZIPs in the project where GitHub does not publish a download count.

Island said the AI wave built through March 2026 and peaked in April 2026, when nearly 300 AI related repositories were created. Mann1988/awesome-claude-skills copied the name of ComposioHQ/awesome-claude-skills and offered awesome-skills-claude-3.3.zip. Naveenkm007 is one character off the developer name Naveenkm07 and published spaceship-mcp. 45d5r/databricks-mcp-server claimed 263 Databricks tools. The Windows ZIP server_databricks_mcp_1.6.zip contains application.cmd, luau.exe, and ico64.txt. The launcher command is `start luau.exe ico64.txt`. Island said the text file is an obfuscated Lua program of about 300 KB, not an icon. The same three part layout, a cmd or bat launcher, a LuaJIT style runtime, and a Lua payload named like text, an icon, a license, or data, repeats across the campaign.

Island, citing Derp.ca analysis of other FakeGit samples, said later stages hide the console, read the current command server from a Polygon smart contract, persist with scheduled tasks under %LOCALAPPDATA%, pull encrypted stages from GitHub, and use a PE crypter to inject StealC. StealC collects browser passwords, cookies, sessions, extension data, email and remote access credentials, screenshots, and host information. Island's blog did not print the contract address. This feed does not import contract addresses from older SmartLoader papers that described a smaller repository set.

Island's AgentBaiting tests did not give the models a link. Claude Code, asked for a free cinematic prompt skill, opened the benign OSideMedia/higgsfield-ai-prompt-skill repository and the malicious adlaiponderous700/claude-skill-cinematic-prompt repository. In one run it repeated the malicious README steps, including downloading an exe and choosing Run anyway if a prompt appeared. In other runs it inspected the repository and refused. Gemini, asked for a free Walmart MCP server, returned DomingosNgongo/walmart-mcp first. ChatGPT listed that same repository and called it the best place to start. The ZIP mcp-walmart-2.2.zip is a confirmed SmartLoader package. BleepingComputer added that Island, in limited testing, saw Claude Code clone malicious repositories and download the files, then stop before execution after it noticed suspicious contents. Island told BleepingComputer those tests were not a detection rate.

BleepingComputer also wrote that the campaign is considered a continuation of an older operation that used Lumma Stealer and that Trend Micro tracks as Water Kurita. Island's own blog does not use that name. Treat the Water Kurita link as a news characterization, not an Island attribution.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Masquerading: Match Legitimate Name or Location | T1036.005 | Repositories and profiles copy real Skill collections, MCP servers, and developer names |
| User Execution: Malicious File | T1204.002 | README tells the user or the agent to download a ZIP and run a cmd launcher |
| Command and Scripting Interpreter | T1059 | luau.exe runs an obfuscated Lua file shipped as ico64.txt or a similar decoy name |
| Scheduled Task/Job: Scheduled Task | T1053.005 | Island, citing Derp.ca: persistence via scheduled tasks under %LOCALAPPDATA% |
| Web Service | T1102 | Encrypted follow on stages retrieved from GitHub. C2 address read from a Polygon contract. Address not published in the Island blog |
| Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | StealC collects browser passwords, cookies, and sessions |

## IOCs

Paths are defanged for display. JSON stores clean values. Hashes are ZIP SHA256 values Island printed next to each repository. Do not denylist github.com, glama.ai, lobehub.com, or mcp.so.

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
github[.]com/hfgwygey/yu-ai-agent
github[.]com/Mann1988/awesome-claude-skills
github[.]com/h4vzz/awesome-ai-agent-skills
github[.]com/StanLeyJ03/mcp-for-security
github[.]com/xbim08/awesome-claude-code-plugins
github[.]com/DomingosNgongo/walmart-mcp
github[.]com/45d5r/databricks-mcp-server
github[.]com/MauManto/jenkins-mcp-server
github[.]com/waynestimulative605/docker-mcp-gateway
github[.]com/lucaducapuca/alibabacloud-bigdata-skills
github[.]com/adlaiponderous700/claude-skill-cinematic-prompt
github[.]com/Naveenkm007/spaceship-mcp
github[.]com/hahaha-saygex/gmail-mcp
```

### Splunk Format

```
"github.com/DomingosNgongo/walmart-mcp" OR "github.com/Mann1988/awesome-claude-skills" OR "github.com/45d5r/databricks-mcp-server" OR "github.com/adlaiponderous700/claude-skill-cinematic-prompt" OR "c15693106682f2ddb26649cab6e1962a64537627cde4c5d3c79d5a0be8c1b5a8" OR "91e5dbfaf45edf25fbc2168f92083e05dfa427afa7633e991392e33cc7427dad" OR "66afc7d87d10dbe392898c4e5c613e0442fabb396415c2bef3a5ef2ac752c5ad"
```

### File Hashes

```
216a2c99fd42c00f9323d8b16dd19f622f7f4778b2b1d7cf07a3de5621fd1546
91e5dbfaf45edf25fbc2168f92083e05dfa427afa7633e991392e33cc7427dad
498fe8fb806cd0e6685f97fc7d74de769dae5a28cdc821557b7585ad5ad83147
62744baa8077bb8be237647fd78e3bea2ca0932bf4be3d5618600f97118095f8
1da8df487d30b988f3c350c065206726aaa13f079a07151cd42ab5579994b9de
c15693106682f2ddb26649cab6e1962a64537627cde4c5d3c79d5a0be8c1b5a8
66afc7d87d10dbe392898c4e5c613e0442fabb396415c2bef3a5ef2ac752c5ad
a33f40cab1ab7f971d3464af3e7595918107332b9e83342007571842b9e22826
3c858facbad66f5479e2c4add171421dc1b6488b36f33e7cff073aba585954a7
fc1278f419e611bf40ca414099bfd9ad98a31ffb054371e8cb65a84849b00eaf
```

### Package Indicators

```
No package IOCs published by source
```

## Detection Recommendations

On endpoints, alert when a process named luau.exe, or a renamed LuaJIT binary, is started by application.cmd or a similar one line launcher with an argument that is a .txt file. Hash match the ten ZIP SHA256 values. Hunt browser downloads and agent workspaces for the ZIP names Island listed, including mcp-walmart-2.2.zip, server_databricks_mcp_1.6.zip, and awesome-skills-claude-3.3.zip.

On GitHub and coding agent logs, alert when Claude Code, Gemini, ChatGPT, or a similar assistant clones or recommends github.com paths in the list above, especially after a prompt that asks for a free MCP server or Skill. A ZIP inside a repository that claims to be an MCP server, with no manifest and with luau.exe plus a text payload, is the Island package shape. Reject that install even if a registry page on Glama, LobeHub, MCP.so, or MCP Market repeats the README.

If SmartLoader ran, isolate the host and revoke browser sessions, OAuth grants, and API tokens. StealC takes live sessions. A password reset alone does not close the account. Do not block github.com. Island did not publish a Polygon contract address in this paper, so do not block polygon RPC endpoints from this report.

## References

- [Island] AgentBaiting: How 800+ Fake AI Skills and MCP Servers Delivered Malware (2026-07-20): https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware
- [BleepingComputer] FakeGit campaign uses 7,600 GitHub repos to push SmartLoader malware (2026-07-21): https://www.bleepingcomputer.com/news/security/fakegit-campaign-uses-7-600-github-repos-to-push-smartloader-malware/
- [The Hacker News] FakeGit Campaign Uses 7,600 GitHub Repositories to Spread SmartLoader Malware (2026-07-20): https://thehackernews.com/2026/07/fakegit-campaign-uses-7600-github.html
