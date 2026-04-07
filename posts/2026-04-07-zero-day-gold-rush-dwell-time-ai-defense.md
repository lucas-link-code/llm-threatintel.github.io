# Zero day gold rush, collapse of dwell time and AI augmented defense

Nicholas Carlini from Anthropic recently demonstrated that frontier large language models have crossed into autonomous vulnerability discovery and exploitation. These models no longer need complex scaffolding or a human in the loop to identify and exploit zero day vulnerabilities in production software. That removes the human bottleneck in the exploit development lifecycle and allows expert level attacks to scale at machine speed.

The research used a minimalist setup to show baseline capability. The agent is a frontier model, Claude, running in a virtual machine with permission to execute code and scan file systems. Researchers prompted it to find the most serious vulnerability in a repository and watched it discover and weaponize critical bugs in mature projects.

## Unauthenticated credential theft in Ghost CMS

Ghost is a content management system with more than fifty thousand GitHub stars and no prior history of critical vulnerabilities in this vein. The LLM autonomously found a blind SQL injection where user input was concatenated into a database query.

It did not stop at discovery. It built a working exploit to leak the administrative API key, password hashes, and session secrets from the production database without authentication. A skilled human could eventually build that attack; the LLM ran the full chain, discovery, logic verification, and exploit generation, on its own.

## Deep kernel auditing

The strongest signal of the shift is remotely exploitable heap buffer overflows in the Linux kernel. That stack is heavily hardened and continuously fuzzed by the global security community.

## The NFS v4 daemon case study

The model found a critical overflow in the Linux NFS v4 daemon. The bug involved a race between two cooperating adversarial clients.

Client A takes a lock with a specific 1024 byte owner string.

Client B tries to open the same lock; the server denies it.

The server response to Client B copies Client A's owner string into a fixed 112 byte buffer.

That produces a heap buffer overflow in kernel space.

The bug lived in the kernel since 2003, before Git was used for kernel development. Traditional fuzzing did not find it for over twenty years because exploitation needs precise multi client interaction logic that LLMs can now reason through semantically. The model also produced technical flow schematics to explain how the bug manifests.

## The scaling problem

Capability is on an exponential curve. Models from mid 2025 could not do these tasks. By early 2026, frontier models succeed at work that takes a human expert about fifteen hours with roughly half success rate. The doubling time for these capabilities is estimated at about four months.

The same scaling shows up against financial targets. In the smart contract space, models have shown they can find and exploit flaws to move large sums from live contracts.

## Industry impact and defensive shift

Autonomous black hat LLMs mean the balance between attackers and defenders over the last two decades is ending. We are in a transitionary period where a huge backlog of legacy C and C++ code becomes searchable and exploitable by automated agents.

### 1. The collapse of dwell time

When a zero day can be found and weaponized in minutes by an AI agent, the window for traditional patch management and manual incident response shrinks toward zero. We should assume any code an LLM can read is effectively transparent to an attacker.

### 2. Mandatory memory safety

LLMs can surface memory corruption in the Linux kernel and other low level systems with little friction. That pushes memory safe languages such as Rust from nice to have toward mandatory. Defense through obscurity or sheer complexity is not a strategy anymore.

### 3. AI augmented defense

Defenders need the same agentic workflows to audit their own repositories. If we do not find and patch with AI before attackers do, the gap becomes hard to close. That means wiring LLM based security reviewers into CI and CD pipelines.

The next twelve months will matter a lot for software security. As these models spread to malicious actors, the volume of high quality zero day exploits will jump by orders of magnitude. SOC analysts and security engineers need to lean into proactive AI driven threat hunting and fast retirement of vulnerable legacy stacks.

Full talk:

http://www.youtube.com/watch?v=1sd26pWhfmg&t=119
