# Token Economics in Claude Code: Context Window Discipline for Agentic Workflows

Claude Code is an agentic CLI tool that reads, writes, and executes code from the terminal. It is one of the more capable developer-facing agent harnesses available in 2026. It is also expensive to operate carelessly.

The cost model is not intuitive. Each turn is evaluated against the active context window: conversation history, file contents, command output, `CLAUDE.md`, memory, loaded skills, system instructions, and tool context. That means message thirty in a messy session is not comparable to message one in a fresh session. It carries the weight of everything that came before it.

Strictly speaking, this is not magic exponential billing. If context grows steadily, cumulative spend bends upward because each new turn pays for more previous material. Operationally, it feels exponential because early context waste gets paid for repeatedly.

That dynamic makes token discipline a core operational skill, not an afterthought.

This post consolidates techniques for managing context window pressure, reducing token waste, and maintaining model performance across long Claude Code sessions. The material is based on the supplied video notes and checked against current Claude Code documentation where command behaviour matters.

## Why token costs compound

Three factors drive the compounding cost problem in agentic CLI tools.

### Compounding cost per message

Claude Code does not process each message in isolation. Later messages are more expensive because they carry the weight of the active session before them. A 30-message session does not cost 30 times the price of a single short message. It costs more because the later turns include accumulated context as input.

### Invisible overhead

Before you type a single character, the context window is already partially consumed. System instructions, `CLAUDE.md`, memory, loaded skills, and configured tools all contribute to baseline overhead. Current Claude Code builds defer MCP tool definitions more efficiently than older descriptions of the product, but connected servers still add tool surface and can load additional context when used. A large `CLAUDE.md` plus unnecessary connectors is still wasted context.

### Loss in the middle

LLMs pay disproportionate attention to the beginning and end of their context window. As sessions grow longer, information in the middle of the conversation degrades in influence. This is not a billing problem. It is a performance problem. Long unmanaged sessions produce worse output because the model effectively loses track of mid-session decisions and constraints.

## Session initialization and configuration

### Run init on every project

The `/init` command scans the codebase and generates a `CLAUDE.md` file that maps architecture, conventions, and key files. This eliminates the need to re-explain project context in every session. For new projects, outline the tech stack and goals so Claude generates the file with useful structure.

### Configure the status line

The `/statusline` command sets up a persistent dashboard at the bottom of the terminal. At minimum it should show active model, context percentage, branch, and usage. This is the fastest way to notice context pressure building before it degrades output quality.

### Establish your baseline overhead

Run `/context` to see what is consuming the active window. Run `/usage` for usage and spend visibility; `/cost` is an alias in current Claude Code builds. These commands should be among the first things you run in any session where cost or quality matters. They reveal how much of the context window is already consumed before work begins.

### Keep the usage dashboard open

The Claude usage dashboard on the Anthropic console shows cumulative spend and pacing against rate limits. Monitor it to avoid hitting reset windows unexpectedly during heavy sessions.

## CLAUDE.md management

The `CLAUDE.md` file loads into every conversation. Its size directly impacts baseline context across the entire session.

### Keep it under 200 lines

Treat `CLAUDE.md` as an index, not a data dump. It should point to larger documentation files rather than including full text inline. A 500-line `CLAUDE.md` means hundreds of lines of context carried into sessions where most of that detail may not matter.

### Use modular documentation routing

Store detailed style guides, business logic, and API references in separate `.md` files. `CLAUDE.md` links to them. Claude can load the referenced files only when relevant, rather than carrying everything in context permanently.

### Log decisions continuously

After resolving an architectural question or discovering a project-specific pattern, add it to `CLAUDE.md` as a concise bullet. This prevents re-explaining the same decisions across sessions. Over time, `CLAUDE.md` becomes a project constitution that encodes accumulated knowledge and prevents repeated mistakes.

## Context window discipline

### Clear between unrelated tasks

Use `/clear` when switching from one task domain to another. Context from task A is noise for task B. Carrying it forward wastes tokens and can confuse the model's reasoning about the new task.

### Compact at 60 percent capacity

Run `/compact` manually when context usage approaches 60-70 percent or after a logical phase completes. This compresses the conversation history while retaining essential logic. Specify what to preserve with a targeted instruction, for example:

```
/compact focus on API integration decisions, changed files, failed approaches to avoid, and remaining test failures
```

After three or four compacts in a single session, quality begins to degrade. At that point, clear the session entirely and provide a brief summary of completed work to start fresh with a clean context.

### Respect the cache timeout

Prompt caching reduces repeated-input cost, but it should not be treated as a reason to keep a bloated session alive. If you are stepping away from a large session, compact or clear before the break. Assume the next turn may be more expensive than the previous cached turn.

### Use rewind for clean undo

The `/rewind` command rolls back the conversation to a previous state without requiring a session restart. This is faster and cheaper than letting the model continue down a wrong path and then correcting it with additional messages.

## Input and output hygiene

### Surgical pasting

Do not paste entire files when only a single function is relevant. Every character pasted enters the context window and stays there for the remainder of the session. Be precise about what you feed in.

### Use specific file references

Instead of asking Claude to find a bug across the repository, reference the exact file or function name when you know it. This constrains the search space and prevents the model from reading unnecessary files into context.

### Batch prompts

One complex, well-structured message is cheaper than three separate messages. Each separate correction creates another turn with the accumulated context. If the model starts in the wrong direction, interrupt early, rewind where appropriate, and restate the corrected task cleanly.

### Limit command output

Shell command outputs enter the context window in full. A git log with 200 commits or a verbose test output can consume thousands of tokens instantly. Pipe output through head, tail, or grep to limit what enters the context.

### Watch the output

Do not walk away during execution. If Claude enters a loop, pursues a dead end, or starts generating incorrect code, hit Escape immediately. Every token generated on a wrong path compounds the cost of the session and pollutes the context for subsequent messages.

## Planning and execution patterns

### Start in plan mode

Toggle plan mode with Shift+Tab or use `/plan` before starting any significant task. In plan mode, Claude reads, researches, outlines steps, and asks clarifying questions without altering code. Once the plan is approved, switch to execution mode. This workflow prevents runaway code generation on incorrect assumptions and reduces revision cycles.

### Prompt with problems, not solutions

Present the problem rather than dictating a specific implementation. Instead of writing a function that does X, frame it as how should we handle X given these constraints. This forces the model to reason through trade-offs and assumptions, producing higher quality architectural choices.

### Enforce clarification

Instruct Claude to seek alignment before proceeding by stating something like: continuously ask me questions until you are 95 percent confident you understand exactly what I need. This reduces costly back-and-forth revision cycles on ambiguous work.

### Intervene early

If Claude hallucinates or takes the wrong approach, do not wait for completion. Hit Escape, correct the course, and re-prompt. Every token spent on a wrong path is waste that compounds through the rest of the session.

### Challenge mediocre output

Reject weak code explicitly. Instruct Claude to try a different approach or produce a more elegant version. Models typically produce significantly better code on the second iteration when the bar is raised. Instruct it to log the correction in CLAUDE.md or a skill file so the pattern is not repeated.

## Quality assurance integration

### Embed verification in task lists

Instruct Claude to build verification steps directly into its generated to-do lists. For frontend work, this means building the component, taking a screenshot to verify the layout, and checking Chrome DevTools for console errors before moving to the next task. Add a rule: do not move on until you are 95 percent confident the current to-do is correct.

### Use visual verification

Claude's vision capabilities allow feeding it error screenshots, UI inspiration images, or using a self-check loop where it designs, screenshots, analyzes, and fixes iteratively. This produces polished output in fewer iterations than text-only feedback cycles.

### Integrate Chrome DevTools

Claude can operate a browser to interact with applications, click buttons, fill forms, and verify functionality. This is effective for frontend QA and for automating verification of tasks that lack explicit APIs.

## Subagent delegation and model tiering

### Deploy parallel subagents

Instruct the main session to use subagents for parallel processing when the task naturally decomposes. Claude can delegate isolated work with separate context windows to research, write tests, or explore approaches. Each subagent should report concise findings back to the main thread without polluting the primary context with intermediate work.

### Tier models by task complexity

Assign the right model to the right job. Use Sonnet for most primary coding tasks. Use Haiku where available for subagents handling file reading, data processing, or basic formatting. Reserve Opus for high-level architectural planning and complex debugging where maximum reasoning depth matters.

The main thread running a more capable model can synthesise lightweight summaries from cheaper subagents, optimising cost without sacrificing output quality.

### Create reusable skills

Create `.md` files in `.claude/skills/` to automate standard operating procedures. A file like `tech-debt.md` can define exact steps to scan for technical debt. Skills can be invoked through Claude Code's skill mechanism or natural language, turning repeated multi-step workflows into reusable operations.

## Advanced configuration

### Disconnect unused MCP servers

Every active MCP server expands the tool surface and can add context once its tools are used. Current Claude Code builds defer definitions by default, but MCP still is not free. Disconnect any server not actively needed for the current task. If you only need a single function from a service, consider using the native CLI or a direct API call instead of initializing a broad MCP integration.

### Use direct API calls over MCP when capacity is critical

MCP servers are powerful, but they are not always the cheapest path. If token capacity is the constraint and you only need one specific operation, such as querying a single database or calling one endpoint, a direct API call or standard CLI command can avoid exposing a large tool catalogue to the session.

### Allocate maximum reasoning for hard problems

Use extended thinking deliberately. Reserve maximum reasoning for complex refactoring, system architecture design, or difficult debugging scenarios where shallow reasoning would produce incorrect results. For simpler tasks, reduce reasoning effort so you are not spending deep-thinking tokens on formatting or mechanical edits.

### Configure granular permissions

Avoid running with dangerously permissive skip-all settings. Instead, configure permissions explicitly. Place safe commands in the allow list and destructive commands like deletes and removes in the deny list. The deny list overrides the allow list, providing a safety net without sacrificing speed on routine operations.

### Use git worktrees for parallel sessions

To run multiple Claude Code sessions on the same repository without file overwrite conflicts, use git worktrees or Claude Code's worktree-based parallel features. Keep each large task in an isolated workspace on a separate branch, then merge deliberately once completed.

### Schedule recurring checks

Use the `/loop` command for recurring checks within a session, such as monitoring deployment status at regular intervals. For longer-term automation beyond the session, use routines, desktop scheduled tasks, cron, or CI.

### Set up notification hooks

Configure hooks to trigger a system notification when Claude finishes a task. This is useful when running multiple sessions in parallel or when stepping away from the terminal during a long execution.

## Timing and pacing

### Work off-peak when possible

Usage limits and effective pacing can vary by plan, provider route, capacity, and Anthropic policy changes. Some users schedule heavy work outside peak weekday windows when off-peak usage is treated more favourably. Treat this as capacity management, not a fixed rule. The durable controls are still smaller context, better model selection, fewer unnecessary tools, and cleaner session boundaries.

### Inject live documentation

Use live documentation only when the task needs it. A documentation MCP server can be valuable for current framework syntax, but it is still another connector. Load it for version-specific API work, then disconnect it when the session no longer needs that source.

## The operational pattern

The techniques above are not independent optimisations. They form a coherent operational discipline.

Start every session by checking `/context` and `/usage` to understand baseline overhead. Disconnect MCP servers that are not needed. Keep `CLAUDE.md` lean and modular. Use plan mode before execution. Batch prompts. Compact around 60-70 percent. Watch the output. Intervene early. Delegate bulk work to subagents on cheaper models. Clear between unrelated tasks.

The difference between a practitioner who follows these patterns and one who does not is substantial. It shows up in token costs, in output quality, and in the number of useful tasks that can be completed within a single rate limit window.

Agentic coding tools are powerful, but they are only as efficient as the operator's discipline around context management. The model is the reasoning engine. The context window is the constraint. Managing that constraint is the skill.

## Source

User-provided notes from:

- 18 Claude Code Token Hacks in 18 Minutes
- 32 Claude Code techniques breakdown

Official Claude Code references checked while preparing this post:

- Commands: https://code.claude.com/docs/en/commands
- Costs: https://code.claude.com/docs/en/costs
- How Claude Code works: https://code.claude.com/docs/en/how-claude-code-works
- Status line: https://code.claude.com/docs/en/statusline
- Sessions: https://code.claude.com/docs/en/sessions
- Scheduled tasks: https://code.claude.com/docs/en/scheduled-tasks
- Hooks: https://code.claude.com/docs/en/hooks

<p class="blog-post-byline">Author: Lucas L.</p>
