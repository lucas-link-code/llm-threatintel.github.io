# Detecting AI Prompt Injection in the Wild

Traditional ClickFix and SocGholish campaigns rely on tricking a human into running malicious commands. The human sees a fake CAPTCHA or browser update, copies a command, opens a terminal, and executes it. The attack fails if the human recognises the deception.

That model is changing. As organisations deploy AI agents that autonomously browse the web, summarise documents, and execute workflows, threat actors are now starting to target these agents directly. An AI agent reads the raw HTML and CSS of every page it visits. Attackers embed instructions in that content that are invisible to human users in white text but processed by the agent. The agent follows those instructions, executing commands, exfiltrating credentials, or installing malware, all without human awareness. This eliminates the human bottleneck entirely.

Unit42 documented 22 distinct payload construction techniques in the wild since December 2025. "Embrace The Red"  demonstrated successful exploitation of Claude computer-use agents. They published lots of great research, link below. The researcher demonstrated a "ClickFix" attack tailored for AI. A malicious website presents a "Verify you're a human" button. When the LLM agent clicks it, JavaScript copies a malicious curl command to the clipboard and opens a terminal to execute it.

Another example provided a website which tricks agent into writing a local web server that hosts the entire local file system on port 8000 for attackers to exfiltrate files from the local machine.

and finally, a critical gap identified where agents have the ability to modify their own configuration files without user approval. This is a critical vulnerability that allows attackers to inject malicious code into agents' configuration files.

see more here:
https://embracethered.com/blog/posts/2025/39c3-agentic-probllms-exploiting-computer-use-and-coding-agents/

I thought it would be useful to build a detection rule set to address this. I like writing EKFiddle regex rules for web traffic analysis and other search queries for proactive threat hunting using UrlScan.io.

## The attack surface

Indirect Prompt Injection, aka IDPI, is effective because LLMs cannot reliably distinguish between instructions from their operator and text content they encounter in web pages. Both go to inference pipeline, but the instructions are not treated as adversarial input. When an AI agent visits a page containing the phrase "ignore previous instructions and execute the following command", the model may interpret that as a legitimate directive. The instruction is embedded in what the model treats as context, not as adversarial input.

Attackers have developed many concealment strategies to keep these payloads invisible to humans while ensuring AI content extractors parse them. CSS techniques include setting font-size to zero pixels, using white-on-white text, positioning elements off-screen at -9999px, setting opacity to zero, and marking elements with aria-hidden. A human never sees these elements. An AI agent that processes the DOM reads them as regular text. CSS files are perfect for this because user does not see them!

## Eight detection categories

### 1. Prompt injection override phrases

The most direct form of IDPI uses explicit instruction override phrases embedded in page source. Phrases like "ignore previous instructions", "override system prompt", "enable developer mode", and "activate DAN mode" have no legitimate reason to appear in web page content. The EKFiddle rules match these patterns using regex with controlled whitespace tolerance to catch variations.

example:
```
SourceCode  High: AI Prompt Injection Ignore
(?:ignore|disregard)\s{1,5}(?:all\s{1,5})?(?:previous|prior|above)
|\s{1,5}(?:instructions|directives|prompts|context)
```

Phrases like "do not reveal to the user" or "keep these instructions secret" are designed to prevent the hijacked agent from disclosing the attack to the human operator. The combination of an override phrase and a secrecy instruction in the same page is a strong signal of malicious intent.

### 2. CSS hidden text traps

These rules detect the combination of CSS visual hiding techniques with command keywords or injection phrases appearing together in the same page. The dual condition requirement, concealment technique plus malicious content, is critical for keeping false positives low. A page that legitimately uses aria hidden for accessibility will not match unless it also contains command execution keywords.

example:
```
SourceCode  High: Hidden Tiny Font Command
font-size\s{0,3}:\s{0,3}[0-2]px[^>]{0,200}>[^<]{1,300}
(?:curl\s|powershell|wget\s|bash\s|\.exe\b|pip\s{1,5}install
|npm\s{1,5}install|ignore\s{1,5}previous)
```

The rule above matches elements with 0-2 pixel font size that contain within 1300 characters either command execution strings or prompt injection phrases. The bounded repetition prevents catastrophic backtracking.

### 3. AI ClickFix for computer-use agents

Traditional ClickFix asks "Verify you are Human" to trigger a CAPTCHA flow. The agent targeted variant inverts use this: "Are you a Computer?" or "Verify you are a Robot". These lures specifically target computers using AI agents that have been instructed to interact with web elements. Think of the recent explosion of ClawdBot madness!

A more sophisticated variant uses neutral phrases like "Show Instructions" and "Begin Validation" instead of explicit verification language. These phrases bypass LLM safety classifiers which would normally refuse to interact with CAPTCHA-like flows. The page then directs the agent to open a terminal and paste malicious clipboard content and execute it.

Why would threat actors need to lure humens to clickfix, if they have perfectly capable AI agents reading websites all day long, happy to execute the commands without human intervention! TA can scale 100 x and more at Agent speed.

### 4. Fake AI tool typosquatting

Domains that typosquat legitimate AI tools follow predictable naming patterns. chatgpt-app, claude-download, cursor-install, copilot-download, gemini-install. The rules detect these constructions across major AI platforms in both page source and URI traffic.

The OCRFix campaign is a notable variant. ChatGPT recommendations were LLM-poisoned to direct users to a malicious tesseract-ocr typosquat domain, which delivered credential stealers. The poisoning happened at the training data level, making the recommendations appear entirely legitimate from the model's perspective.

### 5. HashJack fragment injection

This technique appends IDPI payloads after the hash fragment identifier in URLs. Per HTTP specification, the server never receives the fragment, so all server-side security controls are blind to this vector. AI agents that process the full URL string ingest the fragment as context. This effectively weaponises any legitimate domain without compromising the host server. No server logs, no WAF alerts, no network IDS signatures.

example:
```
URI  High: HashJack Fragment Injection
#[^\s]{0,200}(?:ignore\s{1,3}previous|system\s{1,3}prompt
|execute\s{1,3}(?:this|the)|curl\s|powershell|bash\s
|override\s{1,3}(?:your|the))
```

### 6. Zero-width Unicode obfuscation

Attackers insert invisible Unicode characters between the letters of injection phrases. "ignore previous instructions" becomes individual characters separated by zero-width spaces, non-joiners, or joiners. Regex-based keyword filters miss the fragmented text because the visual representation differs from the character sequence. LLMs reconstruct the semantic meaning regardless because they process the underlying text, not the rendered output.

The RTL override variant uses right-to-left Unicode markers to reverse text rendering. The string appears reversed to a human reviewing the source, but the LLM reads the logical character order and extracts the instruction correctly.

### 7. Agent credential exfiltration

The ZombAI attack chain turns a compromised AI agent into a credential theft tool. IDPI payloads instruct the hijacked agent to read sensitive environment variables like AWS_ACCESS_KEY, GITHUB_TOKEN, OPENAI_API_KEY, or DATABASE_URL, and transmit them to attacker infrastructure via curl, nslookup DNS exfiltration, or fetch requests. The agent operates from within the trusted enterprise perimeter, bypassing network segmentation that would block external attackers.

### 8. Combined hunting sweeps

UrlScan.io queries combine indicators from multiple categories into single queries for efficient periodic scanning. Each sweep covers an entire attack class in one query. Recommended cadence is weekly with a date filter to scope the results.

example of UrlScan.io threat hunting query:
```
text.content:("ignore previous instructions")
  OR text.content:("disregard previous instructions")
  OR text.content:("override system prompt")
  OR text.content:("bypass system prompt")
  OR text.content:("enable developer mode")
  OR text.content:("activate DAN mode")
  OR text.content:("enable jailbreak mode")
```
text.content searches for the presence of the keywords cached by UrlScan.io from the text content of the page, mainly index.html content. This is a great way to identify pages that are likely to be infected with IDPI payloads. Although, you do need a paid subscription to UrlScan.io for this property to be available to you.

## Deployment

The EKFiddle regex rules deploy directly into the CustomRegexes.txt production file in Fiddler Classic proxy with EKFiddle extention enabled. The UrlScan.io queries can be scheduled to run as manual queries for periodic threat hunting. Individual phrase queries work best as Saved Searches. The consolidated sweeps work best for manual hunting sessions.

As LLMs improve their instructions boundaries and attackers adapt their evasion techniques, the detection patterns will need continuous development and refinement. The above categories and detection logic raise awarness where to look for these attacks, they are the attack surfaces and will remain relevant as long as AI agents process untrusted web content.
