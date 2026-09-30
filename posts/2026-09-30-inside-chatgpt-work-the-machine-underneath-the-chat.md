# Inside ChatGPT Work: The Machine Underneath the Chat

I had a look underneath a ChatGPT Work thread, because I wanted to know what my tasks were actually running in.

Underneath it is a Linux filesystem with a shell, a C compiler, and a network connection for its commands that is controlled separately from web search. It’s impressive how much Cloud infrastructure is invested into every chat thread and surprising that OpenAI does not seem to mind if you keep old chat conversations from 3 years ago in history.

Mine had a working directory of `/workspace/scratch/<session-id>/` and my attachments beneath it in `upload/`. I found it by having Work run commands acting as a bash terminal rather than answer questions about itself. That was a cloud session in September 2026, and afterwards I checked what came back against OpenAI's documentation.

The documentation has no single word for what I was looking at. It simply describes  a task as a defined outcome ChatGPT or Codex works toward, a thread as the object holding turns and stored conversation history, and a sandbox as an enforced boundary limiting what commands can access or modify. It does not define session, workspace or container. So in my session I could see: one filesystem, my uploads on it, and my commands running against it.

## Not always a fresh machine

I had assumed each task got a clean machine. OpenAI's cloud security page for Work says otherwise. Tasks run in sandboxes backed by virtual machines, and Work can reuse an environment across tasks, or replace it while preserving eligible state. The page adds that this does not mean every task receives a new container.

Codex, OpenAI's coding agent, is more specific about its own cloud environments. It runs the setup script once, caches the resulting container for up to 12 hours, and starts new tasks from that saved state. The cache is cleared when the setup script, maintenance script, environment variables or secrets change.

A sandbox limits what a process can reach. It does not promise that nothing was prepared before the task started, so I do not treat a cloud task as a clean slate. The documentation does not spell out what eligible state includes for Work, and I have not tested whether files from one task can reach the next.

## The software already installed

Codex runs its cloud tasks in a default container image called `universal`, with common languages, packages and tools already installed. OpenAI publishes a similar image in the `openai/codex-universal` repository, and anyone with Docker can fetch it:

```text
docker pull ghcr.io/openai/codex-universal:latest
```

The repository says plainly that this is not an identical environment, only close enough for debugging and development. It covers Python, Node.js, Rust, Go, Swift, Ruby, PHP and Java. It shows roughly what a Codex task starts with, but it does not tell me which image a Work task runs.

For Work, I checked from the inside instead. My session had Python and Node.js for scripts, Pandoc for document conversion, Tesseract for reading text from images, FFmpeg for audio and video, Git and a C compiler. One check showed visible limits equivalent to 8 processors and 14 GiB of memory. That is what the sandbox reports to a process inside it, not a guaranteed allocation and not the hardware running the model.

## Web proxy

In my first session the model could search the web and read pages, but downloading a page from the shell failed. I assumed the sandbox had no internet. It has, but web search and shell commands reach it by different routes, and each route has its own rules.

Web search is a hosted tool that OpenAI runs outside the sandbox. Commands inside the sandbox, such as `curl`, go out through the sandbox's own connection. So one route can answer while the other is closed. For Codex cloud environments, OpenAI says all outbound traffic from commands passes through an HTTP and HTTPS proxy.

In ChatGPT Work the switch is under Settings, Data controls, Work network access. It decides whether code and shell commands can reach the public internet. Turning it off does not turn off web search, connected apps or the cloud browser. Commands can also still reach the OpenAI destinations Work needs in order to run.

Codex cloud environments offer finer control, set by whoever configures the environment, usually a developer or an admin rather than someone typing into a chat. They can allow named hosts or wildcards, and a deny rule always beats an allow. Hostnames that resolve to private addresses are blocked, so a request cannot be bounced into an internal network, the trick behind SSRF and DNS rebinding attacks. Requests can also be limited to `GET`, `HEAD` and `OPTIONS`, which blocks `POST`, `PUT`, `PATCH` and `DELETE`.

That last setting is the one I would switch on first. It stops the agent sending a request body out, although a determined leak can still ride in the URL of a GET request.

## Setup scripts and internet access

I had not thought about the setup script until I read how Codex cloud environments start a job. There are two stages. First a setup script installs whatever the project needs, then the agent starts work. The agent's internet access is off by default, but the setup script still runs with it on, because it has to download packages.

Both stages use the same filesystem. Anything the setup script downloads is already on disk when the agent starts, and the agent's network rules have no say over it. If a setup script installs a compromised package, an allowlist on the agent does not help.

The stages also run in separate shell sessions. A variable set with `export` during setup is gone by the time the agent runs. Keeping it means writing it into `~/.bashrc` or the environment settings. That matches what I saw in my own session, where files survived from one command to the next and variables did not.

## Local or cloud

Cloud Work runs on OpenAI's infrastructure. Its programs and working files live there, not on the device showing the conversation. Opening the task in the desktop app does not give it access to that computer.

Local Work is the opposite. It runs on the Mac itself, inside a sandbox built from the operating system's own controls. On macOS that is Seatbelt, with commands run through `sandbox-exec`. On Linux it is `bwrap` with `seccomp`, and on Windows either the native Windows sandbox or the Linux version under WSL2. By default the agent can read and edit files in its workspace and use `/tmp`. Editing anything outside the workspace, or going online, needs my approval.

## Where each app runs

```text
Surface              Runs on                  Suited to
---------------------------------------------------------------------------------------------
Mac app, Local       Your Mac                 Local folders, installed programs, desktop apps
Mac app, Cloud       OpenAI cloud computers   A job that continues after the Mac is off
Browser, Work        OpenAI cloud computers   Research, uploaded files, finished documents
iPhone, cloud Work   OpenAI cloud computers   Starting a cloud job and reviewing progress
iPhone, Remote       The connected computer   A job needing that computer's files and tools
```

Through Remote the iPhone drives work on a connected computer, which has to stay awake and online. A cloud task carries on with the Mac switched off. What is available still depends on account and workspace settings, and local Work still sends content to OpenAI's models for processing. Again, its mind blowing how well it is actually integrated allowing you to swap from one device to another. And, you can use /local, /cloud commands to chooses where the chat runs, when both environments are available while you working on your desktop.

The app on screen does not decide where a job runs. The Local or Cloud choice does, and I make it by asking which computer the job needs to touch.

## Uploading files and folders

A local project can point at real folders on the Mac. A ChatGPT project is different: it holds uploaded files, instructions and connected sources. Uploading one page from a website does not bring its images, style files or build settings, even when they sit next to it on disk.

So I keep a task local when it depends on a folder structure that already exists. For cloud Work I upload the folder as an archive with its internal paths intact. Work lists the files before it edits anything, and results go to a separate output folder. If output never lands in the same place as input, a bad run cannot damage the originals.

## Saving your results

Scratch storage is where a task works, not where its results should live. OpenAI's Agents API, which gives developers hosted sandboxes of their own, shows one way this is handled. Files written to `/workspace/outputs` are published when a turn completes and stay downloadable after the sandbox is gone. A sandbox left idle for an hour can be deleted. I have not confirmed that Work follows the same rules, and my Work session used a different path.

So I save results to a named destination such as Google Drive, and keep the script, package versions and setup steps with any job I want to repeat. Before a large batch, I have Work prove the pipeline on a small sample.

## Tools and connectors

The cloud tool catalogue I inspected listed 425 registered actions, 45 for Google Drive and 89 for GitHub. These are separate operations such as reading, searching and writing, not installed software. The count left out tools exposed separately, such as web search, and it did not show which actions were actually connected or authorised for my account.

GitHub shows the difference. The command-line program `gh` was not installed, yet GitHub actions were listed. A connector can act on a service without that service's own program being present in the sandbox.

Skills, plugins and packages are different things too. A skill adds instructions and supporting resources. A plugin can bundle skills with external tools such as MCP servers. Installing a Python package adds software to the sandbox. Each extends Work in its own way, with its own access.

## Shortcut characters and commands

I already used three characters in the message box: `$`, `@` and `/`. What I had not appreciated is that each one behaves differently in browser Work, the desktop app and Codex in a terminal.

```text
Character   What it does                                          Example
-----------------------------------------------------------------------------------------------
$           Calls a skill by name, where supported                $blog-article-writing
@           Opens a picker for skills, and apps where available   Type @ and pick from the list
/           Opens the command menu for the app you are in         Type / on its own to see it
```

OpenAI documents `@` for choosing skills in ChatGPT and `$` for Codex, and the desktop app accepts `$` too. In my own chat, `$blog-article-writing` loaded that skill. Seeing the skill actually load is better proof than assuming every app behaves the same.

The desktop app also has a slash menu I did not know about. These are the commands from OpenAI's list I found most useful:

```text
Command          What it does
--------------------------------------------------------------------------
/status          Shows the chat ID, context usage and rate limits
/compact         Summarises older context to free up room
/plan            Switches planning mode on or off
/mcp             Shows connected tool servers
/side            Starts a temporary side chat without leaving the main one
```

Lists of slash commands online mix up the apps. Desktop and terminal commands do not all work in the browser, so I type `/` on its own and use what the menu offers. Codex in a terminal is also reported to take a line starting with `!` as a shell command, such as `!pwd`. I have not tried that, and in browser chat I simply ask for the command to be run.

Everything else I type is ordinary text formatting. A `#` starts a heading, two asterisks make text bold, `>` marks a quotation, single backticks mark a command or filename, and three backticks on their own lines fence off a block of code. Tags such as `<instructions>` help separate the parts of a long prompt, but they are only labels and grant no extra permission.

## Memory and chat logs

Inside the sandbox I also found files left by Codex: a memory database, a thread index and older conversation logs. The memory file was `memories_1.sqlite`, a 40,960-byte SQLite database. It held a table called `stage1_outputs`, with columns tying memory text and a session summary to a conversation.

The table was empty, which did not mean there was no memory. ChatGPT's own memory is stored separately from these Codex files. Codex also documents further memory files under `~/.codex/memories/`, holding summaries and supporting evidence, which are updated in the background once a chat has been idle for a while.

The thread index, `state_5.sqlite`, recorded `cwd`, `model` and `rollout_path` for each session. The logs were `.jsonl.zst` files, JSON Lines compressed with Zstandard. One expanded from 162,194 bytes to 704,631 bytes and held 101 records covering messages, tool calls, results and task events. So 101 records did not mean 101 chat messages. I could not tie that log to my own conversation.

## Context and deleting chats

Active context is what the model is given for its current turn, and it has a size limit. Compaction summarises older material so long work can continue, which means a saved transcript can hold details the model no longer has in front of it. The size of a history file says nothing about how much the model can currently read.

Deleting a chat does not settle everything either. Work keeps hosted execution state on a separate lifecycle from conversations, while deleted chats are generally scheduled for permanent deletion within 30 days. On the Mac, the optional Computer History feature adds a third record, built from interaction events and accessibility text. It leaves out screenshots and audio, and has its own pause and deletion controls.

## One takeaway

The app on screen does not decide where a task runs. The Local or Cloud choice decides the machine, and the network settings decide what that machine can reach.

Before a task I ask which computer it needs, whether its commands need the internet, and where the results should land.

After a task I assume more was written down than I could see. I would expect OpenAI to delete your chat conversations after a while and put some limit on the number of open threads, but I guess this is why the data centers topic.

## Source notes

ChatGPT Work overview, covering the Work network access setting and the cloud browser
Skills and plugins
https://learn.chatgpt.com/docs/skills-and-plugins

Memories, covering ChatGPT memory and local Codex memories
https://learn.chatgpt.com/docs/customization/memories

Slash commands in the desktop app
https://learn.chatgpt.com/docs/reference/slash-commands

<p class="blog-post-byline">Author: Lucas L.</p>
