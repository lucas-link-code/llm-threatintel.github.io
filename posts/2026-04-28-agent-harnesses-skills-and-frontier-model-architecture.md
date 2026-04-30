# How Agent Harnesses, Skills, and Tool Runtimes Turn LLMs into Task Systems

The modern frontier model is no longer a standalone chatbot. In practical deployments, the model is only one layer in a much larger system made up of orchestration logic, tool discovery, execution runtimes, security boundaries, memory handling, and approval controls. That surrounding system is what actually turns a model into an agent.

This is where a lot of the public discussion still falls short. People often compare OpenAI, Google, and Anthropic as if the model alone determines what an agent can do. In reality, the harness determines a large part of the outcome. The same model class can feel radically different depending on whether it runs through a hosted sandbox, a local CLI, a programmatic tool runner, a multi agent protocol, or a tightly restricted enterprise control plane.

As of early 2026, that architectural layer has become the real differentiator.

The shift is significant. The industry has moved beyond simple JSON function calling and server side chatbot APIs. Frontier models now sit inside systems that can discover tools dynamically, orchestrate remote MCP servers, write code to call APIs, operate terminals, browse the web, or interact with graphical interfaces. Some architectures optimise for managed state and provider hosted execution. Others optimise for inter agent interoperability. Others optimise for local execution, strict sandboxing, and extreme context efficiency.

If you want to understand how to use these systems properly, the right question is no longer just which model is best. The better question is: what harness is this model running inside, where do the tools execute, how is state handled, and what security boundary actually exists around the task?

That is the real architecture of modern agent systems.

## The mental model: what an agent harness actually is

An agent harness is the runtime environment that surrounds the model and translates reasoning into action.

At minimum, the harness usually contains:

1. a model interface
2. a tool registry
3. an orchestration layer
4. an execution runtime
5. a state or memory layer
6. a policy and approval layer
7. an observation loop for receiving tool output and continuing execution

The model itself does not run a terminal, open a browser, authenticate to an API, or edit a file. It emits structured intent. The harness turns that intent into real execution.

That distinction matters because it defines the trust boundary.

If the harness executes tools locally, the developer owns the execution risk. If the harness delegates execution to a provider hosted sandbox, the trust boundary shifts toward the vendor. If the harness supports remote MCP servers or A2A agents, the model is no longer just invoking a function. It is interacting with external systems whose schemas, policies, and data quality all influence the outcome.

So when people say a frontier model has tools, what they usually mean is that the harness can expose tools to the model and then execute them according to a defined contract.

That contract is where architecture begins.

## The core layers behind a frontier model

### 1. Model layer

This is the reasoning engine. It evaluates prompts, tracks the active context, decides whether a tool is needed, and generates the next action.

The model can:
- answer directly
- request a tool call
- generate code for a tool runner
- produce intermediate reasoning that shapes later actions
- resume generation after tool output is returned

This is the visible intelligence layer, but it is not the whole system.

### 2. Orchestration layer

The orchestration layer is the control plane that manages the loop between model output and real execution.

Its job is to:
- expose tool schemas
- receive model requests for tool use
- execute the requested tool
- capture the result
- feed the result back into the model
- decide whether the loop continues or ends

In some ecosystems this layer is heavily provider managed. In others it is implemented by the client application or CLI. In practice, this is the layer that determines whether the agent feels smooth, stateful, fast, and safe or brittle, noisy, and expensive.

### 3. Tool layer

The tool layer is the set of capabilities visible to the model. That can include:

- simple JSON style function calls
- local shell commands
- code execution environments
- remote MCP servers
- connectors to external systems
- file access
- browser automation
- desktop automation
- web search
- internal enterprise APIs
- handoff mechanisms to other agents

At this layer, the same broad concept appears under different names.

OpenAI uses tools, connectors, skills, and sandbox capabilities. Google layers functions, extensions, Agent Registry records, and A2A remote agents. Anthropic exposes tool use, programmatic tool calling, MCP integration, and local execution through Claude Code.

The naming differs, but the architectural question stays the same: what capabilities are exposed, how are they discovered, and where do they execute?

### 4. Execution runtime

This is the environment where the work actually happens.

That may be:
- a provider hosted container
- a local Docker or Podman runtime
- a Unix shell
- a gVisor isolated environment
- a macOS Seatbelt process
- a Bubblewrap sandbox
- a cloud VM
- a local CLI process
- a remote agent reachable over HTTP and SSE

The execution runtime is not just an implementation detail. It determines what the model can touch, what data it can access, and how much damage a compromised workflow can do.

### 5. State and memory

Some harnesses are designed around persistent workspaces and memory distillation. Others are closer to stateless orchestration with stronger separation between agents.

This affects:
- repeatability
- context pressure
- continuity across long tasks
- auditability
- risk of stale or poisoned context

Persistent memory can make agents more useful, but it also expands the attack surface. The more state the harness carries forward, the more careful the system must be about what gets remembered, summarized, or reloaded.

### 6. Policy and approval plane

This is where safe deployment either happens or fails.

A serious agent harness needs controls around:
- file access
- shell execution
- network egress
- allowed tools
- secret injection
- human approvals
- telemetry
- domain allowlists
- destructive actions
- remote server trust

Without this layer, the model is being trusted to obey instructions in natural language. That is not a security control.

### 7. Observation loop

The last critical layer is the feedback loop. The harness must observe the result of execution and hand the right representation back to the model.

That might be:
- JSON from a REST call
- shell stdout and stderr
- a screenshot
- a DOM snapshot
- a file diff
- a filtered summary
- a generated artifact
- a structured task state from another agent

The quality of this observation loop strongly influences agent performance. Poorly shaped tool output pollutes context and increases token costs. Good harnesses reduce and structure the output before it returns to the model.

That is one reason the major providers have moved beyond simple function calling into richer orchestration designs.

## What are skills, connectors, extensions, and tool servers?

A lot of confusion comes from treating these terms as interchangeable. They are related, but not identical.

### Tools

A tool is a callable capability exposed to the model. It might fetch data, search a codebase, run a shell command, or return browser state.

### Skills

A skill is usually a packaged workflow rather than a single tool. In the OpenAI ecosystem, skills are versioned bundles that can include instructions, manifests, scripts, and reusable procedures. They are meant to let the model pull in an established operating pattern when a certain class of task appears.

That is different from a one shot function call. A skill is closer to reusable task logic.

### Extensions and connectors

These usually describe managed connections to external systems. They can provide live data access, enterprise integrations, or standardized access paths to APIs and services.

### MCP servers

The Model Context Protocol provides a standardized way to expose tools and resources from external servers to models and clients. Instead of hard coding every tool into a single application, the harness can discover and use remote MCP servers dynamically.

This changes the architecture in an important way. The model is no longer limited to tools bundled into one monolithic app. The harness can become a gateway into a broader ecosystem of tool servers.

### Agent cards and registries

In Google's architecture, the discovery problem is pushed further toward multi agent interoperability. A remote agent advertises capabilities through an Agent Card, and the orchestrator can query a registry to discover who can do what.

At that point, the model is not just selecting a function. It is participating in a distributed system.

That is a major shift from the old chatbot model.

## Three architectural philosophies behind frontier model harnesses

The three major ecosystems point to three distinct design philosophies.

## OpenAI: managed state, hosted execution, and packaged workflows

OpenAI's current architecture is built around strong provider managed orchestration. The model layer, Responses API, and Agents SDK together create a system where hosted tools, managed sandboxes, packaged skills, and structured memory handling all fit into one coordinated flow.

The important design bias here is centralization.

The model chooses tools, but the orchestration story increasingly lives inside provider managed infrastructure. Built in tools such as web search, file search, and hosted shell execute within OpenAI controlled systems. Sandbox agents introduce isolated workspaces that can persist across runs long enough to support useful workflow continuity. Memory handling is not just an afterthought. The system explicitly distills prior execution traces into reusable summaries and workspace state.

That makes OpenAI's harnesses attractive for tasks where continuity, managed state, and integrated execution matter.

It also means the trust model leans heavily toward provider hosted orchestration.

From a system design perspective, OpenAI is treating the frontier model as the center of a managed workflow engine. Skills reinforce that pattern. They package reusable logic, scripts, and instructions into bundles that the harness can expose selectively, allowing the model to activate a richer procedure when needed without loading everything into context all at once.

This is a practical way to scale capability without destroying the context window.

The tradeoff is obvious. The more orchestration the provider manages, the more the enterprise must trust the provider side control plane, secret handling pattern, and sandbox implementation.

## Google: distributed interoperability and agent to agent negotiation

Google's direction is different.

The Gemini and enterprise agent platform architecture treats agents less like internal tool users and more like collaborating services. The A2A model is the clearest signal of that philosophy. Instead of assuming one large orchestrator with a big tool list, Google makes room for independent agents that advertise capabilities, negotiate tasks, and exchange results over a structured protocol.

This is a more decentralized view of agent architecture.

Agent Cards, registries, JSON RPC task flows, and modality negotiation all point to one big idea: the future agent system is not one model with many tools. It is many agents cooperating across explicit boundaries.

That changes the optimization target. The harness is not only solving tool calling. It is solving discovery, interoperability, and state integrity across separate entities.

Thought Signatures are particularly interesting in that context. The system requires the client to preserve and return accumulated reasoning state markers across steps. Architecturally, this is an attempt to protect the integrity of the reasoning chain even when execution is distributed or asynchronous.

That makes the design feel much more like a protocol stack than a simple assistant runtime.

For enterprise use, this is powerful when tasks naturally decompose across specialist agents or services. It is less about one model being smarter in isolation and more about creating a fabric where agents can cooperate without exposing internal logic or memory unnecessarily.

## Anthropic: local execution, context efficiency, and zero trust isolation

Anthropic's architecture points in a third direction.

The defining themes are:
- reduce context waste
- execute deterministic logic outside the model when possible
- keep strong local isolation
- make tool orchestration cheaper and more precise

Programmatic Tool Calling is the clearest expression of that idea. Instead of forcing the model to emit multiple JSON tool calls and reingest every intermediate result, the harness allows the model to write a short script that orchestrates tools locally, processes large responses, loops through data, and returns only the distilled result to the model context.

That is not just a performance trick. It is a different philosophy of agent design.

The model is used for high value reasoning, planning, and summary, while the harness uses code execution to absorb the repetitive or bulky parts of the job. That reduces token consumption, latency, and context pollution.

Anthropic also pushes hard on local security boundaries. Claude Code's OS level isolation on macOS and Linux reflects a zero trust assumption about model generated commands. That is the right instinct. If the model can issue shell actions, then the system needs real sandboxing, real filesystem restrictions, real network mediation, and explicit approval loops.

This makes Anthropic's architecture especially compelling where:
- local data sensitivity is high
- intermediate datasets are large
- tool orchestration would otherwise flood the context window
- execution must happen behind a tighter local boundary

The tradeoff is that the surrounding harness matters even more. If the sandbox is relaxed or the network proxy rules are too broad, the benefits collapse quickly.

## Why harness choice now matters as much as model choice

If two teams use the same frontier model family but different harnesses, they may get very different operational results.

That happens because task performance now depends on more than raw reasoning quality. It depends on:

- where execution happens
- how tools are exposed
- how much state is preserved
- whether intermediate data is returned to the model or processed outside it
- whether approvals and network boundaries exist
- whether the harness supports local, hosted, or distributed workflows

This is why model evaluation in 2026 has to be architectural.

A model may look excellent in a benchmark and still be the wrong operational choice for a task if the surrounding harness has the wrong execution model.

## A practical way to think about task optimization

The simplest way to optimize an agent workflow is to stop asking which model is smartest and start asking what the task really is.

## 1. Is the task mostly reasoning, or mostly orchestration?

If the task is mostly reasoning over a moderate amount of context, the model matters more.

If the task is mostly orchestrating tools, managing files, running code, or executing workflows, the harness matters at least as much as the model.

## 2. Where must execution happen?

This is often the first gating question.

If the task can run safely in provider managed infrastructure, hosted sandboxes may be a good fit.

If the task involves sensitive repositories, internal systems, or local analysis pipelines, local execution with strong sandboxing may be the better fit.

If the task spans many organizational services or agent domains, distributed interoperability may matter more than local execution.

## 3. How large are the intermediate results?

This is where many agent systems become expensive or sloppy.

If the workflow returns large intermediate payloads, the wrong design will keep dumping them back into the model context. That increases latency, token cost, and noise.

Programmatic orchestration patterns are stronger here because they let the harness reduce large results locally and return only what the model actually needs.

## 4. How dynamic is the tool universe?

If the tool set is small and stable, direct tool registration may be fine.

If the tool universe is large, dynamic discovery matters. Skills, deferred tool loading, search tools, registries, and MCP gateways are all responses to the same problem: context cannot hold every tool schema all the time.

## 5. How strong must the security boundary be?

This is the question that should dominate enterprise deployment.

If the model can read files, execute code, or browse untrusted content, then the harness must define:
- secret scoping
- filesystem boundaries
- network egress restrictions
- allowed domains
- approval loops
- tool allowlists
- observability and audit

Without those, a model with tools is just a privileged prompt injection target.

## Matching architectures to task types

### Codebase automation and repository work

For repository level work, managed sandboxes and local coding CLIs both make sense, but for different reasons.

A provider managed sandbox is useful when you want structured orchestration, hosted tooling, and smoother state handling.

A strict local CLI harness is useful when the codebase is sensitive, when local context matters more, or when the team wants stronger direct control over file access and shell behavior.

The right choice depends less on abstract model quality and more on where the repo may safely be executed.

### Large API workflows with bulky intermediate data

This is where programmatic orchestration shines.

If the job involves pulling large records, filtering them, applying logic, and returning only the final conclusion, the best architecture is usually not repeated JSON tool calling. It is a code execution path that lets the harness process the bulk data outside the active context.

### Multi agent enterprise systems

If the environment contains many independent services or specialist agents, a distributed agent protocol becomes more valuable than a giant monolithic tool list.

In that case, discoverability, negotiation, and task lifecycle control matter more than whether one model can call a single function elegantly.

### Desktop and browser automation

Computer use remains one of the most powerful and fragile agent patterns.

It is powerful because it lets the model operate legacy interfaces and real world workflows without bespoke API integration.

It is fragile because the observation loop is often vision based, token intensive, and sensitive to UI movement, hidden instructions, or screenshot level ambiguity.

This area needs the strongest approval loops and the strongest trust boundaries, because it is where prompt injection can directly steer user interface actions.

### Massive context analysis

If the workload depends on extremely large context windows or on coordinating across many long artifacts, the model context limit becomes a serious design variable. But raw context size alone is not enough. What matters is how the harness decides what to load, what to search, what to summarize, and what to keep out of the active prompt.

Large windows help. Good tool discovery and context discipline help more.

## The real security lesson: the harness defines the blast radius

The security story in modern agent systems is no longer just about model alignment. It is about containment.

### Secret handling

Secrets should never live in the model prompt. They should be injected into the execution environment as scoped, temporary credentials by the harness. If the model can read the secret as plain text, an injected prompt can usually try to exfiltrate it.

### Filesystem isolation

If the model can issue shell commands, local write boundaries matter. A harness that allows broad filesystem writes gives the model too much leverage if a malicious prompt succeeds.

### Network egress control

Filesystem isolation without network control is incomplete. A model that can read a local file and still make arbitrary outbound requests remains dangerous. Outbound traffic needs mediation and allowlists.

### Tool output as an injection surface

Untrusted tool results are not passive data. Web content, repository text, logs, issue trackers, and remote MCP responses can all carry instructions that attempt to hijack the model's next step. The harness needs structural separation between instructions, trusted context, and untrusted content.

### Remote server governance

MCP is powerful, but it expands the trust surface. If the harness can reach arbitrary remote MCP servers, then tool output quality, schema quality, and operator trust all become part of the risk model. A registry or allowlist is not optional in serious deployments.

## The bigger architectural shift

The industry is converging on a simple truth.

A frontier model by itself is not an agent.

An agent emerges when the model is placed inside a runtime that can:
- discover capabilities
- call tools
- execute safely
- preserve or reject state
- manage trust boundaries
- handle approvals
- observe outcomes
- continue reasoning from results

That is what the modern harness does.

The major providers are not converging on one implementation, but they are converging on one reality: the real system lives outside the model.

OpenAI is building around managed orchestration, packaged workflows, and persistent state.

Google is building around distributed interoperability, registries, and protocol driven agent collaboration.

Anthropic is building around token efficient orchestration, local execution, and strong sandbox boundaries.

Those are not cosmetic differences. They reflect different beliefs about where the execution should live, how tools should be discovered, and what the safest control plane looks like.

## Final takeaways

If you are trying to understand frontier model architecture in 2026, start with these points:

First, the model is the reasoning core, but the harness is the operational body.

Second, tools, skills, connectors, MCP servers, and agent protocols are all ways of expanding capability, but they do not create the same trust boundary.

Third, task optimization depends on execution location, tool topology, context shape, and security controls, not just benchmark intelligence.

Fourth, the most important architectural question is often not what can the model do but what can the harness safely allow it to do.

And finally, the best deployment choice is no longer universal. It depends on whether you need managed state, distributed interoperability, local execution, context efficiency, or strict sandboxing.

That is the shift. The frontier model still matters. But the harness is now where the system design really lives.
