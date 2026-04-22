# Zero-Day Discovery at Machine Speed and the Defensive Shift Ahead

Nicholas Carlini from Anthropic recently presented research suggesting that frontier large language models are beginning to demonstrate autonomous vulnerability discovery and exploitation capabilities.

In the demonstrated setup, the models did not require complex scaffolding or a human in the loop to identify and exploit zero-day vulnerabilities in real software targets. That potentially reduces the human bottleneck in parts of the exploit development lifecycle and could allow expert-level attack workflows to scale more quickly.

The research used a minimalist setup to demonstrate baseline capability. The agent was a frontier model, Claude, running in a virtual machine with permission to execute code and inspect the file system. Researchers tasked it with finding the most serious vulnerability in a repository and observed it identify and exploit critical bugs in mature projects.

## Unauthenticated credential theft in Ghost CMS

Ghost is a widely used content management system with more than fifty thousand GitHub stars and no widely known history of critical vulnerabilities of this type. The model autonomously found a blind SQL injection issue in which user input was concatenated into a database query.

It did not stop at discovery. It built a working exploit that exposed the administrative API key, password hashes, and session secrets from the production database without authentication. A skilled human could eventually build the same attack chain, but in this case the model handled discovery, logic validation, and exploit generation on its own.

## Deep kernel auditing

One of the strongest signals in the research is the discovery of remotely exploitable heap buffer overflows in the Linux kernel. That codebase is heavily hardened and continuously fuzzed by the global security community.

## The NFS v4 daemon case study

The model found a critical overflow in the Linux NFS v4 daemon. The bug involved a race between two cooperating adversarial clients.

Client A takes a lock with a specific 1024-byte owner string.

Client B tries to open the same lock; the server denies it.

The server response to Client B copies Client A's owner string into a fixed 112-byte buffer.

That produces a heap buffer overflow in kernel space.

The bug had existed in the kernel since 2003, before Git was adopted for kernel development. Traditional fuzzing did not uncover it for more than twenty years, likely because exploitation required precise multi-client interaction logic that current models appear increasingly able to reason through semantically. The model also produced technical flow schematics explaining how the bug manifests.

## The scaling problem

The capability trend appears to be improving rapidly. Models from mid-2025 were not yet demonstrating these capabilities. By early 2026, frontier models were reportedly succeeding at tasks that might take a human expert around fifteen hours, with roughly a fifty percent success rate in the research setting described.

The research suggests these capabilities may be improving on a timescale measured in months rather than years.

Similar concerns are now being raised in financially relevant environments, including smart contract ecosystems. In the smart contract space, models have reportedly demonstrated the ability to identify and exploit flaws with direct financial impact in live environments.

## Industry impact and defensive shift

Autonomous offensive use of frontier models could materially shift the balance between attackers and defenders. We appear to be entering a transitional period in which large legacy C and C++ codebases become increasingly searchable and, in some cases, exploitable by automated agents.

### 1. Shorter dwell time

If zero-day vulnerabilities can increasingly be identified and operationalised in minutes by AI agents, the window for traditional patch management and manual incident response could shrink significantly. Defenders should increasingly assume that code readable by capable models is becoming easier for attackers to analyse at scale.

### 2. Memory safety as an engineering priority

LLMs are beginning to surface memory corruption issues in the Linux kernel and other low-level systems with less effort than many defenders had previously assumed. That strengthens the case for memory-safe languages such as Rust, moving them from a long-term aspiration toward a more immediate engineering priority. Defense through obscurity or sheer complexity is becoming less reliable as a defensive assumption.

### 3. AI-augmented defense

Defenders will need comparable agentic workflows to audit their own repositories at speed. If defenders do not use similar automation to find and patch issues early, the gap may become increasingly difficult to close. That means considering how LLM-based security review can be integrated into CI/CD pipelines.

The next twelve months may be especially important for software security. As these models become more accessible to malicious actors, the volume of high-quality zero-day discovery and exploit development activity could increase materially. SOC analysts and security engineers should invest in proactive AI-driven threat hunting and faster retirement of vulnerable legacy stacks.

## Source

Full talk:
https://www.youtube.com/watch?v=1sd26pWhfmg&t=119
