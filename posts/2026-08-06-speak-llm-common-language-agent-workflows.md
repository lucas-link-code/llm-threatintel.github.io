# Speak LLM: A Practical Glossary for Better Agent Outcomes

Working with coding agents and chat models is not only about context and prompts. Language matters too, vocabulary to be specific. A large share of bad outcomes comes from vague instructions.

As security analysts and engineers we already use dense acronyms and abbreviations for IOC, TDS, SSRF, FP false positive. Agent workflows have their own shorthands too. It's worth learning it, we talk to that software increasingly more.

Here is how you can steer the models with fewer words and less rework. This post is a field guide to LLM's language. It covers meaning of useful phrases, why they change behaviour, and ready to paste asks you can use in Codex, ChatGPT, Cursor, Claude Code, or any other agentic harness.

## Why vocabulary changes outcomes

Models respond to constraints more reliably than to vague instructions.

If you say "test it", the model may run one check, and do nothing useful. If you say "smoke test the main entrypoint, then run the regression harness", the target is clear: one shallow live check, then a structured comparison against known good output.

If you say "fix it carefully", the model may refactor half the module. If you say "minimal additive fix, small blast radius, do not change the public interface", the edit stays narrow.

The phrases below are examples of compressed and focused expressions models are trained to understand. Used well, they reduce ambiguity in the same way precise malware family names reduce ambiguity in intel work.

## Core operating modes

These phrases set the rules of engagement before the task starts.

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Read-only | Inspect and report. Do not edit files. | "Read-only pass. Do not change any code." |
| Plan first | Design before coding. Wait for approval. | "Make a plan. Wait for my approval before editing." |
| Implement | Make the changes now. | "Implement the plan as specified." |
| Out of scope | Explicitly do not touch this area. | "Out of scope: parser, exporter, batch mode." |
| In scope | Must cover this. | "In scope: quiet mode and JSON output only." |
| Blast radius | How much else a change could affect. | "Keep blast radius small." |
| Additive | Add behaviour. Do not rewrite existing paths. | "Additive only. Do not rename return fields." |
| Narrow fix / minimal fix | Smallest change that solves the bug. | "Minimal fix. No refactor." |
| Follow-up | Extra work after the main result. | "Any follow-ups needed?" |
| Cleanup | Stop leftover processes and temp artifacts. | "Cleanup background processes when done." |

Example ask:

```text
Read-only pass.
Root cause for why the export file is not created when results are empty.
No fixes.
Concise verdict first.
```

## Testing language

Testing phrases tell the model how deep to go and what "done" means.

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Smoke test | Tiny sanity check that the system is alive. | "Do a smoke test: start the tool, run one sample input." |
| Thorough pass | Broad coverage across flags and options. | "Thorough pass of all CLI flags and config options." |
| Spot check | Quick look at a few important cases. | "Spot check one empty result and one hit result." |
| Matrix | Grid of combinations to run. | "Run a flag matrix for timeout and recurse." |
| Happy path | Normal successful use. | "Verify the happy path still works." |
| Edge case | Unusual but valid input. | "Cover edge cases: empty body, denied response, redirects." |
| Negative path | Bad input on purpose. | "Negative path: bad auth token, unsupported scheme, broken JSON." |
| Regression | Something that used to work and now fails. | "Check for regressions against the baseline." |
| Diff / drift | Difference from expected output. | "Diff against baseline. Report any drift." |
| Gate / verification gate | Check that must pass before continuing. | "Verification gate: baseline_check must pass." |
| Harness | Scripts that drive the tool and compare results. | "Run the fixture harness." |
| Baseline | Saved known-good output for later comparison. | "Compare to baseline before claiming success." |
| Fixture | Controlled fake site or sample data for tests. | "Test against the local fixture data." |
| PASS / FAIL | Result of one check. | "Report a PASS/FAIL matrix. Do not fix." |
| Flaky | Passes sometimes, fails sometimes. | "Is that check flaky?" |

Smoke test deserves a plain English explanation. The term comes from hardware: power the device on and see if smoke comes out. In software it means a short check after a change. Not exhaustive. Just: does the main path still respond.

Example asks:

```text
Thorough pass of the CLI and config options.
Read-only.
Report PASS/FAIL.
Do not fix anything.
```

```text
After the fix:
1. Smoke test the main entrypoint
2. Run the regression harness
3. Spot check one empty result and one hit result
```

## Change and design language

Use these when you want controlled edits instead of opportunistic rewrites.

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Wire / wired | A flag is parsed and actually used by runtime code. | "Is --depth wired, or parsed and ignored?" |
| Surface | Public options and fields callers can see. | "Document the full public interface." |
| Contract | Agreed shape of inputs and outputs. | "Do not break the public interface contract." |
| Schema | Structure of JSON or records. | "Did the output schema change?" |
| Side effect | Extra behaviour change beyond the goal. | "List side effects before implementing." |
| Breaking change | Existing clients must update. | "Call out any breaking change." |
| Backwards compatible | Old clients still work. | "Keep it backwards compatible." |
| Idempotent | Doing it twice equals doing it once. | "Make the export idempotent." |
| Dead code / dead rule | Present but never executes. | "Is that pattern dead at load time?" |
| Stub | Minimal placeholder output or record. | "Write a clean stub into the export file." |
| Gate behind a flag | Feature stays off unless a flag enables it. | "Gate local targets behind --allow-local." |
| Default | Value used when the option is omitted. | "What is the default for timeout?" |
| Override | Per-request value wins over startup default. | "Can the request override startup defaults?" |
| Coerce | Convert a value into the expected type. | "Coerce string true/false to bool." |
| Clamp | Force a number into a min/max range. | "Clamp timeout to 1 to 300." |
| Defang | Make URLs and IPs safe to display. | "Defang by default. Option to disable." |
| Normalize | Standardize messy input into a canonical form. | "Normalize hostnames to full URLs." |

Example ask:

```text
Plan a minimal fix for the two CLI output bugs.
Small blast radius.
Additive if possible.
Do not change parsing or export behaviour.
Think through side effects, then wait for approval.
```

## Debugging and security language

These phrases keep investigation honest and scoped.

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Root cause | The real reason it fails. | "Root cause only. No speculative fixes yet." |
| Symptom | What you observe, not why. | "That is a symptom. Find the root cause." |
| Repro | Exact steps that recreate the bug. | "Give me a repro command." |
| Intermittent | Not reproducible every run. | "Is it intermittent?" |
| False positive | Alert on benign activity. | "Too many false positives on the sample corpus." |
| False negative | Missed real malicious activity. | "Any false negatives from the size cap?" |
| Noise | Low-value alerts that bury signal. | "Reduce noise from low confidence rules." |
| Coverage | How much of the attack surface you actually check. | "Does recurse improve coverage?" |
| SSRF | Tricking a server into fetching internal hosts. | "Confirm private destinations are blocked on every hop." |
| ReDoS | Regex that can hang via catastrophic backtracking. | "Any ReDoS risk in that pattern?" |
| TOCTOU | Time of check versus time of use race. | "Document the resolve then connect limitation." |
| Validate / sanitize | Reject or clean unsafe input. | "Validate URL scheme before fetch." |
| Auth asymmetry | Some routes need auth, some do not. | "Document auth asymmetry for status check vs action route." |

Example ask:

```text
Read-only.
Root cause for quiet mode emptying JSON stdout.
Include the exact code path.
No edits.
```

## Process language for agent sessions

Agent harnesses work better when you define the workflow explicitly.

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Pass / round | One cycle of work. | "Do a read-only pass first." |
| Plan | Written approach before edits. | "Build a solid plan. Give it a second pass for side effects." |
| Approval | Human must confirm before edits. | "Wait for approval before changing code." |
| Implement the plan | Execute the written plan, nothing else. | "Implement the plan as specified. Do not edit the plan file." |
| Mark todos | Track progress against a checklist. | "Mark todos in_progress as you work." |
| Do not stop until | Finish the whole checklist. | "Do not stop until all todos are completed." |
| Concise | Short answer. | "Be concise. No filler." |
| High density | Maximum facts, few words. | "High density technical notes." |
| Verdict | Bottom-line result up front. | "Start with the verdict." |
| No extras | Do not expand scope. | "No extras. No drive-by refactors." |

Example ask:

```text
Implement the plan as specified.
Do not edit the plan file.
Mark todos as you go.
Verify with smoke + harness.
No extras.
```

## Runtime and operations language

Useful when the agent starts services, runs tools, or pipes output.

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Background | Keep a process running while other work continues. | "Start the local service in the background." |
| Port | TCP listen number such as 3000. | "Bind the service to the configured port." |
| Bind | Address the service listens on. | "Bind to 127.0.0.1 only." |
| Localhost / loopback | This machine only. | "Block loopback unless --allow-local." |
| Timeout | Abort after N seconds. | "Use timeout 10 for batch runs." |
| Proxy | Send traffic through another host. | "Negative path: unreachable proxy, no traceback." |
| Exit code | Process return status. 0 usually means success. | "Confirm exit code 0. 143 means we killed it on purpose." |
| Stdout / stderr | Normal output stream versus diagnostics stream. | "JSON on stdout. Warnings on stderr." |
| Pipe | Chain one command into another. | "Pipe quiet JSON output into a JSON parse check." |

## Performance language

| Phrase | Meaning | Say this |
|--------|---------|----------|
| Bottleneck | The slowest part of the path. | "Where is the bottleneck?" |
| Cap / ceiling | Hard upper limit. | "Keep the content size cap." |
| Truncate | Cut content that exceeds a limit. | "Report truncated true when capped." |
| Cache | Reuse expensive work. | "Cache decoded content per item." |
| Precompile | Compile once at load, reuse later. | "Precompile patterns at startup." |
| Throughput | How many jobs per unit time. | "Optimise for throughput on the sample corpus." |
| Latency | Time for one request. | "Keep batch latency low." |
| Lever | A dial that trades speed for coverage. | "Which lever helps most: skip recurse or size cap?" |

Example ask:

```text
Read-only.
Find the matching bottleneck.
Measure before proposing a fix.
No code changes yet.
```

## Phrases people say that are too vague

| Vague ask | Clearer ask |
|-----------|-------------|
| Test it | Smoke test the main entrypoint, or thorough pass of all flags |
| Check everything | Matrix of CLI flags and config options. Report PASS/FAIL |
| Make sure nothing broke | Regression check against baseline. Run the harness |
| Quick look | Spot check or smoke test |
| Fix it carefully | Minimal fix, small blast radius, additive if possible |
| Don't change other stuff | Out of scope: parser, exporter, batch mode |
| Is it working? | Happy path smoke: start the tool and run one sample |
| Test bad stuff | Negative path: bad auth, unsupported scheme, broken JSON |
| Optimize it | Find the bottleneck, measure, propose one lever |
| Clean this up | Narrow refactor with explicit file list, or leave it out of scope |

## Ready-to-paste templates

### Investigate

```text
Read-only.
Root cause for <problem>.
No fixes.
Verdict first, then evidence.
```

### Plan

```text
Make a plan to fix <problem>.
Small blast radius.
Think through side effects on existing modules.
Wait for my approval before implementing.
```

### Implement

```text
Implement the plan as specified.
Do not edit the plan file.
Mark todos in_progress as you work.
Do not stop until all todos are completed.
Verify with smoke + harness.
No extras.
```

### Test without fixing

```text
Thorough pass of all CLI flags and config options.
Read-only.
Report a PASS/FAIL matrix.
Do not fix issues. Propose a plan only if asked.
```

### Safe change

```text
Minimal additive fix.
Do not change the public interface contract.
Run the regression gate after.
Report side effects explicitly.
```

### Security review

```text
Read-only security pass.
Check private destination controls, auth, and input validation.
List findings by severity.
No code changes.
```

### Performance

```text
Read-only.
Identify the bottleneck.
Measure before and after candidates if you propose a fix.
Prefer the smallest lever that recovers most latency.
```

### Docs

```text
Update docs to match actual behaviour.
Direct technical tone.
No marketing language.
High density.
```

## Mini dialogues

Vague:

```text
You: Can you check the auth module?
Model: Starts changing code, or runs one random request, or both.
```

Precise:

```text
You: Read-only thorough pass of the CLI and config options.
Report PASS/FAIL.
Do not fix.

Model: Runs auth, validation, option coercion, private destination checks, happy path.
Returns a matrix. No edits.
```

Vague:

```text
You: Fix the output bugs carefully.
Model: Refactors printers, quiet mode, reports, and maybe the exporter.
```

Precise:

```text
You: Two failures only:
1. quiet mode empties JSON stdout
2. export file missing when results are empty
Minimal fix. Small blast radius.
Do not change parsing or export behaviour.
Plan first for approval.
```

## How to adopt this without overdoing it

You do not need every term in every prompt.

Use three layers:

1. Mode: read-only, plan, or implement
2. Scope: in scope and out of scope
3. Proof: smoke, harness, matrix, or repro

That alone removes most ambiguity.

Then add domain terms when the task needs them: SSRF, regression, contract, blast radius, defang, coerce, clamp.

If the model drifts, do not argue with it in prose. Reset the operating rules:

```text
Stop.
You are outside scope.
Return to the plan.
No extras.
Show the verification commands you will run.
```

## One takeaway

Better agent outcomes can result from better communication, not just bigger models.
Here is my own example I paste into a prompt when I want a small fix without the risk of model destroying my own code. I always worry that because I write code differently, much differently than LLMs, agent may start to refactor my function immediately because its not in their style of writing. So I enter this:

```text
Make sure the plan includes checks for regressions. Keep blast radius small.
Do a thorough pass and a smoke test of all features. Make it additive.
Do not change unnecessary functions. Minimal fix. Do not refactor.
Plan should include testing and checks for regressions against the baseline.
```

You may have noticed, I always ask to create a plan first! Then I review it carefully.
I like to add this as well in my very own simple words:

```text
Once written, look at your plan and think through it again,
give it another pass to consider any possible implications it may have on existing modules and dependencies.
I don't want anything to break or to be negatively affected by this implementation.
```

Learn a small set of these phrases, reuse the templates, and your sessions get shorter, cheaper, and more reliable.
Always give it mode, scope, constraints, and a definition of done.
