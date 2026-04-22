# Detecting AI Prompt Injection in the Wild

Traditional ClickFix and SocGholish campaigns rely on tricking a human into running malicious commands. The human sees a fake CAPTCHA or browser update, copies a command, opens a terminal, and executes it. The attack fails if the human recognises the deception.

That model is changing. As organisations deploy AI agents that autonomously browse the web, summarise documents, and execute workflows, threat actors are beginning to target those agents directly. An AI agent may read the raw HTML and CSS of the pages it visits. Attackers can embed instructions in that content that are invisible to human users but still processed by the agent. The agent then follows those instructions, executing commands, exfiltrating credentials, or installing malware, all without direct human awareness. This significantly reduces the human bottleneck in parts of the attack chain.

Unit 42 documented 22 distinct payload construction techniques discussed in public research and reporting since December 2025. Embrace The Red also demonstrated successful exploitation of Claude computer-use agents. They published detailed technical research on this area; the reference is included below. The researcher demonstrated a ClickFix-style attack tailored for AI agents. In one example, a malicious website presents a "Verify you're a human" button. When the LLM agent clicks it, JavaScript copies a malicious curl command to the clipboard and opens a terminal to execute it.

Another example showed a website that tricks an agent into writing a local web server that exposes the local file system on port 8000, creating a path for attackers to exfiltrate files from the local machine.

Finally, the research highlighted a critical gap: some agents have the ability to modify their own configuration files without explicit user approval. That creates an obvious risk, as attackers may be able to inject malicious content into agent configuration files without direct user awareness.

Reference:
https://embracethered.com/blog/posts/2025/39c3-agentic-probllms-exploiting-computer-use-and-coding-agents/

I thought it would be useful to build a detection rule set around this using EKFiddle regex rules for web traffic analysis and complementary urlscan.io queries for proactive hunting.

## The attack surface

Indirect prompt injection (IDPI) is effective because LLMs cannot reliably distinguish between instructions from their operator and text content they encounter in web pages. Both enter the inference pipeline, but the instructions are not treated as adversarial input. When an AI agent visits a page containing the phrase "ignore previous instructions and execute the following command", the model may interpret that as a legitimate directive. The instruction is embedded in what the model treats as context rather than adversarial input.

Attackers have developed many concealment strategies to keep these payloads invisible to humans while ensuring AI content extractors still parse them. CSS techniques include setting font-size to zero pixels, using white-on-white text, positioning elements off-screen at -9999px, setting opacity to zero, and marking elements with aria-hidden. A human never sees these elements. An AI agent that processes the DOM may still read them as regular text. CSS-based concealment is particularly effective because the end user typically does not see the hidden content, while the agent may still process it.

## Eight detection categories

### 1. Prompt injection override phrases

The most direct form of IDPI uses explicit instruction override phrases embedded in page source. Phrases like "ignore previous instructions", "override system prompt", "enable developer mode", and "activate DAN mode" rarely have a legitimate reason to appear in normal web page content. The EKFiddle rules match these patterns using regex with controlled whitespace tolerance to catch variations.

Example:
```
SourceCode  High: AI Prompt Injection Ignore
(?:ignore|disregard)\s{1,5}(?:all\s{1,5})?(?:previous|prior|above)
|\s{1,5}(?:instructions|directives|prompts|context)
```

Phrases like "do not reveal to the user" or "keep these instructions secret" are designed to prevent the hijacked agent from disclosing the attack to the human operator. The combination of an override phrase and a secrecy instruction in the same page is a strong signal of malicious intent.

### 2. CSS hidden text traps

These rules detect the combination of CSS visual hiding techniques with command keywords or injection phrases appearing together in the same page. The dual-condition requirement, concealment technique plus malicious content, is critical for keeping false positives low. A page that legitimately uses aria-hidden for accessibility will not match unless it also contains command-execution keywords.

Example:
```
SourceCode  High: Hidden Tiny Font Command
font-size\s{0,3}:\s{0,3}[0-2]px[^>]{0,200}>[^<]{1,300}
(?:curl\s|powershell|wget\s|bash\s|\.exe|pip\s{1,5}install
|npm\s{1,5}install|ignore\s{1,5}previous)
```

The rule above looks for elements with 0-2 pixel font sizes that contain, within a bounded character window, either command-execution strings or prompt-injection phrases. The bounded repetition helps reduce catastrophic backtracking.

### 3. AI ClickFix for computer-use agents

Traditional ClickFix commonly uses prompts such as "Verify you are human" to trigger a CAPTCHA flow. The agent-targeted variant inverts this approach: "Are you a computer?" or "Verify you are a robot". These lures specifically target systems using AI agents that have been instructed to interact with web elements.

A more sophisticated variant uses neutral phrases like "Show Instructions" and "Begin Validation" instead of explicit verification language. These phrases may bypass LLM safety classifiers that would normally refuse to interact with CAPTCHA-like flows. The page then directs the agent to open a terminal, paste malicious clipboard content, and execute it.

From an attacker's perspective, agent-targeted ClickFix-style lures are attractive because they remove the human interaction step. If the agent is already browsing, parsing, and acting on web content, the attack can scale at machine speed rather than human speed.

### 4. Fake AI tool typosquatting

Domains that typosquat legitimate AI tools often follow predictable naming patterns, for example: chatgpt-app, claude-download, cursor-install, copilot-download, and gemini-install. The rules detect these constructions across major AI platforms in both page source and URI traffic.

The OCRFix campaign is a notable variant. ChatGPT recommendations were LLM-poisoned to direct users to a malicious tesseract-ocr typosquat domain, which delivered credential stealers. The poisoning happened at the training-data level, making the recommendations appear legitimate from the model's perspective.

### 5. HashJack fragment injection

This technique appends IDPI payloads after the hash fragment identifier in URLs. Per the HTTP specification, the server never receives the fragment, so server-side security controls are blind to this vector. AI agents that process the full URL string ingest the fragment as context. This effectively weaponises any legitimate domain without requiring compromise of the host server.

In practice, this can leave little or no visibility in server logs, WAF telemetry, or conventional network IDS signatures.

Example:
```
URI  High: HashJack Fragment Injection
#[^\s]{0,200}(?:ignore\s{1,3}previous|system\s{1,3}prompt
|execute\s{1,3}(?:this|the)|curl\s|powershell|bash\s
|override\s{1,3}(?:your|the))
```

### 6. Zero-width Unicode obfuscation

Attackers insert invisible Unicode characters between the letters of injection phrases. "Ignore previous instructions" becomes individual characters separated by zero-width spaces, non-joiners, or joiners. Regex-based keyword filters miss the fragmented text because the visual representation differs from the character sequence. LLMs can still reconstruct the semantic meaning because they process the underlying text rather than the rendered output.

The RTL override variant uses right-to-left Unicode markers to reverse text rendering. The string appears reversed to a human reviewing the source, but the LLM may still recover the intended instruction from the underlying character order.

### 7. Agent credential exfiltration

The ZombAI-style attack chain can turn a compromised AI agent into a credential theft mechanism. IDPI payloads instruct the hijacked agent to read sensitive environment variables like AWS_ACCESS_KEY, GITHUB_TOKEN, OPENAI_API_KEY, or DATABASE_URL, and transmit them to attacker infrastructure via curl, nslookup-based DNS exfiltration, or fetch requests. The agent operates from within the trusted enterprise perimeter, potentially bypassing network segmentation that would block external attackers.

### 8. Combined hunting sweeps

urlscan.io queries combine indicators from multiple categories into single queries for efficient periodic scanning. Each sweep covers an entire attack class in one query. A weekly cadence, scoped with a date filter, is a practical starting point.

Example urlscan.io hunting query:
```
text.content:("ignore previous instructions")
  OR text.content:("disregard previous instructions")
  OR text.content:("override system prompt")
  OR text.content:("bypass system prompt")
  OR text.content:("enable developer mode")
  OR text.content:("activate DAN mode")
  OR text.content:("enable jailbreak mode")
```

`text.content` searches for the presence of keywords cached by urlscan.io from page text content, mainly from index.html and rendered page text. This is a practical way to identify pages that are likely to contain IDPI payloads. This does, however, require a paid urlscan.io subscription for that property to be available.

## Deployment

The EKFiddle regex rules can be deployed directly into the `CustomRegexes.txt` production file in Fiddler Classic with the EKFiddle extension enabled. The urlscan.io queries can be scheduled as saved searches or run manually for periodic threat hunting. Individual phrase queries work best as saved searches, while broader combined sweeps work well for manual hunting sessions.

As LLM instruction boundaries improve and attackers adapt their evasion techniques, these detection patterns will need continuous refinement. These categories highlight where defenders should look for these attacks and are likely to remain relevant as long as AI agents continue to process untrusted web content.
