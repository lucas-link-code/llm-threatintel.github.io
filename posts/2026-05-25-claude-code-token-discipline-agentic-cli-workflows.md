# Claude Code Token Discipline: Keeping Agentic CLI Sessions Fast, Cheap, and Useful

Claude Code is not expensive because the prompt you typed is long. It becomes expensive because the working set around that prompt keeps growing.

Every serious agentic coding session accumulates conversation history, file contents, command output, project instructions, memory, tool schemas, MCP server context, screenshots, test logs, and partial plans. The next turn does not happen in isolation. It is evaluated against the active context window. That means the thirtieth message in a messy session is not comparable to the first message in a fresh session.

Strictly speaking, this is not magic exponential billing. If the context grows steadily, the cumulative cost bends upward because each new turn carries more previous material. Operationally, it feels exponential because a small amount of context waste early in the session gets paid for repeatedly.

That is the core mental model: context is not storage. Context is recurring rent.

The quality problem follows the same curve. Long sessions make the model slower, more expensive, and easier to steer off course. Important constraints from the middle of the conversation become easier to lose. Old tool output competes with current requirements. The model has more to reconcile before it can act.

Token discipline is therefore not only a cost-control habit. It is a quality-control habit.

## What actually fills the context window

The visible conversation is only part of the working set.

The obvious context is your instruction, the assistant's previous responses, files Claude has read, diffs, logs, test results, screenshots, and command output.

The less obvious context is project and tool overhead: `CLAUDE.md`, memory, loaded skills, system instructions, configured MCP servers, browser state, subagent summaries, and anything else the harness needs to make the next step possible.

This is why two sessions that look similar in the terminal can behave very differently. A fresh session in a small repo with one focused file reference is cheap. A long session with a large `CLAUDE.md`, several connectors, three failed test runs, pasted logs, and broad exploratory reads is not.

The practical fix is to treat context like an operational budget. Measure it, reduce it, and clear it when the task changes.

## Start with a small map

Run `/init` when you start using Claude Code in a project. The point is not to create a massive project manual. The point is to create a compact routing layer that tells Claude where the important things live, what conventions matter, and which commands are authoritative.

The mistake is letting `CLAUDE.md` become a dumping ground.

I would keep it under roughly 150-200 lines. It should contain the rules that apply to nearly every session:

1. project purpose
2. key directories
3. build and test commands
4. coding conventions
5. security constraints
6. deployment or validation gotchas
7. links to deeper documents

Everything else should live in separate Markdown files, skills, or normal project documentation. `CLAUDE.md` should point to those files. It should not inline them.

A concise `CLAUDE.md` acts like a constitution. It captures repeated decisions and recurring mistakes so you do not have to re-explain them, but it does not drag unrelated detail into every task.

If the instruction matters for every session, keep it in `CLAUDE.md`. If it only matters for one workflow, move it to a skill, command, or referenced document.

## Measure before optimising

The first command I would run in a serious session is `/context`.

That shows what is consuming the current window. It makes invisible overhead visible: project memory, loaded files, tool output, MCP context, and conversation history. Without that view you are guessing.

For spend and usage, use `/usage`; `/cost` is an alias in current Claude Code builds. The exact display depends on whether you are using API billing, Claude Pro, Claude Max, Team, Enterprise, or a cloud provider route, but the habit is the same. Check the meter before the session feels slow.

Then configure `/statusline`.

A status line that shows model, context percentage, git branch, and usage gives you constant feedback without interrupting the work. It changes behaviour because you stop treating the context window as an abstract limit and start treating it as a visible resource.

The minimum useful status line for me would show:

1. active model
2. current directory or branch
3. context window percentage
4. session usage or cost
5. whether the worktree is dirty

That is enough to catch context rot early.

## Clear between unrelated tasks

Use `/clear` when the next task is not a continuation of the current one.

This is the simplest optimisation and the one people avoid because it feels like losing progress. It is not losing progress. It is removing irrelevant baggage. Previous conversations remain resumable, and persistent project guidance still comes from `CLAUDE.md`.

Do not carry a frontend layout discussion into a backend auth refactor. Do not carry an incident-response write-up into a dependency upgrade. Do not carry a failed experiment into the final implementation pass unless the failure itself matters.

Context that does not help the current task is not neutral. It competes with the current task.

## Compact before the model is forced to compact

Auto-compaction exists, but I prefer manual compaction after a logical phase completes. Around 60-70 percent context usage is a good operating range. Waiting until the session is almost full leaves less room to preserve nuance.

Use `/compact` with instructions:

```
/compact focus on final implementation decisions, changed files, failed approaches to avoid, and remaining test failures
```

The instruction matters. A generic compact can preserve the wrong things. A focused compact tells Claude what to retain for the next phase.

After several compacts, stop and clear. A compacted session is useful, but it is still a summary of a summary after enough cycles. If the work has become important, ask Claude to produce a concise handoff summary, clear the session, and restart from that summary plus the current repo state.

A clean new session with a good handoff is often better than a tired long session with a long memory trail.

## Use plan mode before high-blast-radius work

For non-trivial changes, start with `/plan`.

Plan mode is not bureaucracy. It is cost control. It prevents the most expensive failure mode in Claude Code: confident implementation in the wrong direction followed by a long correction chain.

A good planning prompt should define:

1. the problem
2. constraints
3. files or components likely involved
4. expected output
5. validation requirements
6. what not to change

For example:

```
/plan Refactor the blog rendering path so Markdown posts support tables and code copy buttons. Inspect the existing JS renderer first. Do not change the intel feed renderer unless required. Propose the smallest implementation and verification steps before editing.
```

That kind of prompt narrows the search space. It also gives you a chance to reject the approach before any edits happen.

For ambiguous work, ask Claude to keep asking questions until it is confident enough to proceed. That is not about making the model timid. It is about preventing it from filling gaps with assumptions that later become expensive to unwind.

## Be surgical with file references

Do not ask Claude to "look through the repo" when you already know the likely file.

Point it at the file, function, route, component, test, or log slice that matters. If the task involves a specific function, name it. If the bug is in one UI path, describe the route and interaction. If the failure comes from a test, provide the failing test name and the relevant output.

Broad prompts trigger broad exploration. Broad exploration reads more files. More files increase context. Increased context increases cost and reduces precision.

This applies to pasted material as well. Do not paste a whole file when one function is relevant. Do not paste a whole GitHub Actions log when the last 80 lines contain the failure. Do not paste 200 commits when the last five are enough.

The better pattern is:

```
The failure is in `renderBlogPost` in `js/app.js`. Inspect that function and the Markdown renderer only. The symptom is that fenced code blocks render correctly but table rows do not preserve inline code. Propose a minimal fix and test command.
```

That prompt is cheaper and produces better work than "fix blog rendering".

## Keep shell output out of the transcript unless it matters

Shell output is context.

If Claude runs `git log` with hundreds of commits, that output becomes part of the session. If it runs a noisy test suite and dumps every passing test, that output becomes part of the session. If it prints a minified bundle, that output becomes part of the session.

Use bounded commands:

```
git log --oneline -20
npm test -- --runInBand 2>&1 | tail -120
pytest -q 2>&1 | tail -120
rg -n "pattern" path/to/dir
```

The point is not to hide evidence from the model. The point is to feed it the evidence it can actually use.

When a command is expected to be noisy, tell Claude up front to summarise or filter it. If the same noisy command appears often, move the filtering into a hook or a project skill so it happens consistently.

## Watch the run and interrupt early

Do not walk away from an agentic coding run until the direction is clearly correct.

The first few tool calls tell you whether Claude understood the task. If it starts editing the wrong subsystem, reading irrelevant files, generating broad refactors, or retrying the same failing command, stop it immediately with Escape.

Early interruption saves tokens, but the bigger win is avoiding poisoned momentum. A bad approach creates code, output, explanations, and test failures that all enter the session. Then the model has to reason around its own debris.

Claude Code gives you `/rewind` and checkpoints for a reason. Use them. A clean rollback plus a sharper prompt is usually cheaper than repairing a wandering implementation.

## Batch intent, not confusion

One complete prompt is usually better than three vague ones.

Do not send:

```
Fix the auth bug.
Also use the existing helper.
Actually do not touch middleware.
Also add tests.
```

Send:

```
Fix the auth bug in `auth/session.ts`. Use the existing token parser in `auth/token.ts`. Do not change middleware behaviour. Add or update the focused unit tests only. Before editing, identify the likely failure path and show the minimal plan.
```

The second version is cheaper because the model receives the complete task in one coherent frame. It is also safer because the constraints arrive before implementation begins.

If the model makes a minor mistake, prefer interrupting, rewinding, or restating the corrected task cleanly over building a long correction thread.

## Treat MCP servers as context-bearing dependencies

MCP is useful, but every connected server is part of the agent harness. It can add tool surface, permissions, schema overhead, latency, and risk.

Current Claude Code builds defer MCP tool definitions more efficiently than older versions, but that does not make MCP free. Run `/mcp` and `/context` to see what is loaded. Disable servers you are not actively using.

There is also a practical rule: if a normal CLI can do the job, prefer the CLI.

For GitHub, `gh` may be cheaper than loading a broad MCP server. For cloud resources, `aws`, `gcloud`, or `az` may be more efficient than exposing a large tool catalogue. For a one-off API query, a direct script can be cheaper than connecting an entire workspace integration.

This is not an argument against MCP. It is an argument against keeping every possible connector active in every session.

## Use subagents to contain noisy work

Subagents are useful because they have separate context windows. That makes them a good fit for work that is necessary but noisy:

1. reading a large file tree
2. comparing multiple implementation options
3. summarising long logs
4. researching API documentation
5. scanning for repeated patterns
6. drafting tests before the main implementation

The main session should receive a compressed result, not every intermediate read.

For cost control, use cheaper models for simple subagent work where available. Haiku is suitable for basic summarisation, extraction, and formatting. Sonnet is the default choice for most coding. Opus should be reserved for architecture, difficult debugging, and decisions where the cost of a wrong answer is high.

Agent teams and broad parallel execution need more discipline. They can be powerful, but each teammate has its own context and usage profile. More agents means more windows, more tool calls, and more opportunities to duplicate work. Keep the spawn prompt narrow and clean up the team when the work is done.

## Move repeated workflows into skills

If you ask Claude to perform the same procedure more than twice, make it a skill.

Project skills in `.claude/skills/` are useful for repeatable operating procedures:

1. technical debt scans
2. PR review style
3. release validation
4. frontend screenshot QA
5. threat intel report formatting
6. detection rule generation
7. dependency upgrade checks

The benefit is not only convenience. A skill makes the workflow explicit and reusable. It reduces repeated prompt text, avoids forgetting steps, and lets you keep specialised instructions out of the always-loaded project memory.

For sensitive or high-risk skills, be deliberate with allowed tools and permissions. A skill that can run shell commands is operational code. Treat it like code.

## Build verification into the task

The cheapest bug is the one Claude catches before you review the output.

For frontend work, ask for the full loop:

1. implement the change
2. run the app
3. open it in a browser
4. take a screenshot
5. inspect console errors
6. compare the screenshot against the intended layout
7. fix visible issues before stopping

For backend work, define the test command, expected failing case, and success condition. For documentation, define the target format and ask Claude to check internal consistency before returning.

Do not leave verification implicit. If you want tests, screenshots, linting, or CLI validation, put that in the original prompt. Otherwise you pay for a second loop.

## Use hooks for guardrails and output shaping

Hooks are one of the better places to enforce habits that humans forget.

A hook can block destructive commands, filter noisy test output, inject environment context, play a notification when a long task finishes, or add extra checks before tool use. That shifts repeatable control logic out of the prompt and into deterministic local configuration.

The security angle matters. Do not run Claude Code with broad skip-permission modes just to save clicks. Configure allow rules for commands you trust and deny rules for destructive operations. The deny list should win. Speed is useful only if the agent still has boundaries.

For long-running sessions, notification hooks are also practical. They let you step away without ignoring the run completely. The important habit is still the same: watch the early direction, then let the boring part run.

## Timing is capacity management, not a strategy

Some users plan heavy Claude Code work outside peak usage windows because subscription limits and provider capacity can vary by time, plan, and current policy. That can help during periods where off-peak usage is treated more favourably.

I would not build the workflow around a fixed clock rule.

Anthropic changes usage policies, promotions, model availability, and limits. Treat timing as an operational convenience, not an architectural dependency. The durable controls are still context discipline, model selection, smaller prompts, compact sessions, filtered output, and fewer unnecessary tools.

Use the dashboard, `/usage`, and your status line to manage the actual session you are in.

## The working checklist

This is the checklist I would actually use:

1. Run `/init` once per repo, then prune `CLAUDE.md`.
2. Keep `CLAUDE.md` under roughly 200 lines and use it as an index.
3. Configure `/statusline` with model, context percentage, branch, and usage.
4. Run `/context` at the start of serious sessions.
5. Use `/clear` between unrelated tasks.
6. Use `/plan` before high-blast-radius changes.
7. Reference exact files, functions, routes, or tests.
8. Limit shell output with `head`, `tail`, `rg`, and focused test commands.
9. Interrupt bad direction early with Escape.
10. Use `/compact` around 60-70 percent context with explicit retention instructions.
11. After several compacts, generate a handoff summary and start clean.
12. Disable unused MCP servers.
13. Prefer CLIs or direct API calls for one-off operations.
14. Delegate noisy reading and summarisation to subagents.
15. Use Sonnet for most coding, Haiku for simple delegated work, and Opus for hard architecture.
16. Move repeated workflows into skills.
17. Use hooks for output filtering, notifications, and permission guardrails.
18. Verify inside the task: tests, screenshots, console checks, or command output.

The common theme is narrowness. Narrow session. Narrow prompt. Narrow file set. Narrow command output. Narrow tool surface. Narrow persistence.

Claude Code works best when the harness gives the model just enough state to act and not enough stale context to drift.

## Source notes

- User-provided notes from the video: `18 Claude Code Token Hacks in 18 Minutes`
- Anthropic Claude Code commands reference: https://code.claude.com/docs/en/commands
- Anthropic Claude Code costs guide: https://code.claude.com/docs/en/costs
- Anthropic Claude Code architecture guide: https://code.claude.com/docs/en/how-claude-code-works
- Anthropic Claude Code status line guide: https://code.claude.com/docs/en/statusline
- Anthropic Claude Code sessions guide: https://code.claude.com/docs/en/sessions
- Anthropic Claude Code scheduled tasks guide: https://code.claude.com/docs/en/scheduled-tasks
- Anthropic Claude Code hooks reference: https://code.claude.com/docs/en/hooks

<p class="blog-post-byline">Author: Lucas L.</p>
