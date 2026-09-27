# Mini Shai-Hulud GitHub Actions Came Back Online With Malicious Tags Still Set

**Date:** 2026-09-27
**TLP:** TLP:CLEAR
**Tags:** supply-chain, malware

## Executive Summary

Socket published on 2026-09-24 that GitHub Actions actions-cool/issues-helper and actions-cool/maintain-one-comment, disabled on 2026-05-19 after the May Mini Shai-Hulud compromise, became reachable again on 2026-09-16 while release tags still pointed at the May 18 malicious commits. Workflows that reference those actions by tag, including issues-helper at v2.2.1, downloaded the payload and ran it with Bun. Socket updated the post on 2026-09-25: GitHub disabled both repositories again. Review workflow runs from 2026-09-16 through 2026-09-25 and rotate secrets those jobs could read.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | Mini Shai-Hulud re exposure of actions-cool/issues-helper and actions-cool/maintain-one-comment |
| Actor / Attribution | Mini Shai-Hulud cluster, tracked on this feed as TeamPCP and by GTIG as UNC6780. Socket said this is the May payload becoming downloadable again, not a new compromise. The Hacker News cited overlap with exfiltration host t.m-kosche.com from the May @antv wave. Confidence high for campaign linkage |
| Target | Repositories whose workflows reference either action by a mutable tag. Socket said the issues-helper dependency graph lists about 15,000 repositories |
| Vector | GitHub re enabled both repositories between 09:09 and 16:16 UTC on 2026-09-16. Tags still resolved to malicious commits from 2026-05-18. No new exploit was required |
| Status | Both repositories disabled again on 2026-09-25. Workflows now fail at job setup. Secrets exposed during the window still need rotation |
| First Observed | Malicious content introduced 2026-05-18. This re exposure 2026-09-16. Socket report 2026-09-24 |

## Detailed Findings

According to [Socket](https://socket.dev/blog/mini-shai-hulud-actions), GitHub disabled actions-cool/issues-helper and actions-cool/maintain-one-comment on 2026-05-19, one day after malicious content was introduced in the May Mini Shai-Hulud campaign. Disabling the repositories made downstream workflows fail while the runner was still resolving the action, before any step ran. The malicious release tags were not rewritten. They stayed in place for about 120 days.

On 2026-09-16 both repositories could be downloaded again. Socket could not say why. A maintainer request is one possibility Socket names and does not confirm. Socket timed the return from workflow history to a window between 11:09 and 18:16 GMT+2, which is 09:09 to 16:16 UTC. Before that window, runs failed in seconds with `Error: Repository access blocked` at `Getting action download info`. After it, the same workflows succeeded and ran for minutes.

Socket's example is issues-helper tag v2.2.1 resolving to commit a0c53dd42fc842d2f9276c5a1d4f9a26abe8713d, which contains the obfuscated payload in `index.js`. The job installs Bun via oven-sh/setup-bun and runs `bun run $GITHUB_ACTION_PATH/index.js`. oven-sh/setup-bun is a legitimate action used as a loader. It is not an IOC. A scheduled workflow in Moonofweisheng/wot-design-uni, file `issue-inactive.yml`, failed in seconds on September 14 and 15 and succeeded on September 16 at 18:16 GMT+2 as run 792, taking 9 minutes 34 seconds, with no change to that workflow file. Socket treats that pattern as the action becoming reachable again.

The dependency graph count Socket gives for issues-helper alone is about 15,000 repositories. Socket did not count how many of those pin a commit SHA versus a tag. Tag references such as `uses: actions-cool/issues-helper@v2.2.1` move when the tag moves. SHA pins of a commit from before 2026-05-18 are not affected. The action code runs with the workflow `GITHUB_TOKEN` and any secrets the job exposes. Issue and pull request triggers mean a user who can open an issue on a public repository can start a vulnerable workflow. Socket said both actions were disabled and re enabled together, so the same window applies to maintain-one-comment even though the run log example is issues-helper.

[The Hacker News](https://thehackernews.com/2026/09/compromised-github-actions-came-back.html) reported the same Socket research and said the activity links to Mini Shai-Hulud because the workflows and the May @antv npm packages share exfiltration domain t.m-kosche.com. That domain is already in this feed from the 2026-05-19 @antv wave. This update does not add a second copy. Socket's September IOC list names the two actions, not a new host. A September 25 update on the Socket post said GitHub disabled both repositories again, so new runs fail at job setup instead of executing the payload. Commits and tags were still malicious when Socket wrote. Disablement stops download. It does not delete the bad commit.

Prior Mini Shai-Hulud waves on this feed, including the May @antv npm burst and the Claude Code SessionStart hooks, are not repeated here. The new fact is the 2026-09-16 to 2026-09-25 window in which old tags executed again.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Mutable GitHub Action tags resolved again to the May 18 malicious commits |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Runner executes `bun run $GITHUB_ACTION_PATH/index.js` from the action directory |
| Obfuscated Files or Information | T1027 | Socket: obfuscated payload inside index.js at commit a0c53dd42fc842d2f9276c5a1d4f9a26abe8713d |
| Unsecured Credentials: Credentials In Files | T1552.001 | Action code can read secrets exposed to the workflow and the job GITHUB_TOKEN |
| Trusted Relationship | T1199 | Downstream repos kept a tag pin to a third party action that had already been disabled once |

## IOCs

The two action paths are the new indicators. t.m-kosche.com stays in the existing Mini Shai-Hulud IOC rows and is listed here so the hunt query is complete. JSON for this report adds only the GitHub paths. Do not denylist github.com.

### Domains

```
t.m-kosche[.]com
```

### Full URL Paths

```
github[.]com/actions-cool/issues-helper
github[.]com/actions-cool/maintain-one-comment
github[.]com/actions-cool/issues-helper/commit/a0c53dd42fc842d2f9276c5a1d4f9a26abe8713d
```

### Splunk Format

```
"t.m-kosche.com" OR "github.com/actions-cool/issues-helper" OR "github.com/actions-cool/maintain-one-comment" OR "github.com/actions-cool/issues-helper/commit/a0c53dd42fc842d2f9276c5a1d4f9a26abe8713d" OR "actions-cool/issues-helper" OR "actions-cool/maintain-one-comment"
```

### File Hashes

```
No hash IOCs published by source
```

### Package Indicators

```
No package IOCs published by source
```

## Detection Recommendations

Search every `.github/workflows/` file for `actions-cool/issues-helper@` and `actions-cool/maintain-one-comment@`. A tag reference is in scope. A full commit SHA that predates 2026-05-18 is not, if that commit was verified clean. Remove the actions or replace the tag with a known clean SHA.

In Actions run history from 2026-09-16 through 2026-09-25, flag jobs that used to fail in a few seconds at setup and then succeeded for several minutes, and runner logs that download oven-sh/setup-bun and execute `bun run $GITHUB_ACTION_PATH/index.js` inside either action. For every such run, rotate secrets that job could read and review the `GITHUB_TOKEN` permissions. Audit commits on those repositories after 2026-09-16.

Keep the existing DNS and proxy hunt for t.m-kosche.com, including `t.m-kosche.com:443/api/public/otel/v1/traces`. That path was published in the May wave, not restated as a new September URL. Do not block github.com. Block or alert on the two repository paths above if the proxy can match URL path.

## References

- [Socket] Re-Enabled GitHub Actions Expose Thousands of Repositories to Mini Shai-Hulud (2026-09-24, update 2026-09-25): https://socket.dev/blog/mini-shai-hulud-actions
- [The Hacker News] Compromised GitHub Actions Came Back Online and Resumed Executing Mini Shai-Hulud Malware (2026-09): https://thehackernews.com/2026/09/compromised-github-actions-came-back.html
