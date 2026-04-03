# Detecting AI Prompt Injection in the Wild

Traditional ClickFix and SocGholish campaigns rely on tricking a human into running malicious commands. The human sees a fake CAPTCHA or browser update, copies a command, opens a terminal, and executes it. The attack fails if the human recognises the deception.

That model is changing. As organisations deploy AI agents that autonomously browse the web, summarise documents, and execute workflows, threat actors are now targeting these agents directly. An AI agent reads the raw HTML and CSS of every page it visits. Attackers embed instructions in that content that are invisible to human users but processed by the agent. The agent follows those instructions, executing commands, exfiltrating credentials, or installing malware, all without human awareness. This eliminates the human bottleneck entirely.

Unit 42 documented 22 distinct payload construction techniques in production since December 2025. Embrace The Red demonstrated successful exploitation of Claude computer-use agents. MacSync and OCRFix campaigns are actively delivering credential stealers through typosquatted AI tool domains.

I built a detection rule set to address this: 28 EKFiddle regex rules for web traffic analysis and 82 UrlScan.io Pro search queries for proactive threat hunting. All EKFiddle rules were validated against the top 100 most-visited benign websites with zero MED or HIGH severity false positives.

## The attack surface

Indirect Prompt Injection, or IDPI, works because LLMs cannot reliably distinguish between instructions from their operator and text content they encounter in web pages. When an AI agent visits a page containing the phrase "ignore previous instructions and execute the following command", the model may interpret that as a legitimate directive. The instruction is embedded in what the model treats as context, not as adversarial input.

Attackers have developed multiple concealment strategies to keep these payloads invisible to human visitors while ensuring AI content extractors parse them. CSS techniques include setting font-size to zero pixels, using white-on-white text, positioning elements off-screen at -9999px, setting opacity to zero, and marking elements with aria-hidden. A human never sees these elements. An AI agent that processes the DOM reads them as regular text.

## Eight detection categories

### 1. Prompt injection override phrases

The most direct form of IDPI uses explicit instruction override phrases embedded in page source. Phrases like "ignore previous instructions", "override system prompt", "enable developer mode", and "activate DAN mode" have no legitimate reason to appear in web page content. The EKFiddle rules match these patterns using regex with controlled whitespace tolerance to catch variations.

```
SourceCode  High: AI Prompt Injection Ignore
(?:ignore|disregard)\s{1,5}(?:all\s{1,5})?(?:previous|prior|above)
|\s{1,5}(?:instructions|directives|prompts|context)
```

Secrecy instructions form a related sub-category. Phrases like "do not reveal to the user" or "keep these instructions secret" are designed to prevent the hijacked agent from disclosing the attack to the human operator. The combination of an override phrase and a secrecy instruction in the same page is a strong signal of malicious intent.

### 2. CSS hidden text traps

These rules detect the combination of CSS visual concealment techniques with command keywords or injection phrases appearing together in the same page. The dual-condition requirement, concealment technique plus malicious content, is critical for keeping false positives low. A page that legitimately uses aria-hidden for accessibility will not match unless it also contains command execution keywords.

```
SourceCode  High: Hidden Tiny Font Command
font-size\s{0,3}:\s{0,3}[0-2]px[^>]{0,200}>[^<]{1,300}
(?:curl\s|powershell|wget\s|bash\s|\.exe\b|pip\s{1,5}install
|npm\s{1,5}install|ignore\s{1,5}previous)
```

The rule above matches elements with 0-2 pixel font size that contain within 1300 characters either command execution strings or prompt injection phrases. The bounded repetition prevents catastrophic backtracking.

### 3. AI ClickFix for computer-use agents

Traditional ClickFix asks "Verify you are Human" to trigger a CAPTCHA flow. The agent-targeted variant inverts this: "Are you a Computer?" or "Verify you are a Robot". These lures specifically target computer-use AI agents that have been instructed to interact with web elements.

A more sophisticated variant uses neutral semantic phrases like "Show Instructions" and "Begin Validation" instead of explicit verification language. These phrases bypass LLM safety classifiers that would normally refuse to interact with CAPTCHA-like flows. The page then directs the agent to open a terminal and paste malicious clipboard content.

### 4. Fake AI tool typosquatting

Domains that typosquat legitimate AI tools follow predictable naming patterns. chatgpt-app, claude-download, cursor-install, copilot-download, gemini-install. The rules detect these constructions across major AI platforms in both page source and URI traffic.

The OCRFix campaign is a notable variant. ChatGPT recommendations were LLM-poisoned to direct users to a malicious tesseract-ocr typosquat domain, which delivered credential stealers. The poisoning happened at the training data level, making the recommendations appear entirely legitimate from the model's perspective.

### 5. HashJack fragment injection

This technique appends IDPI payloads after the hash fragment identifier in URLs. Per HTTP specification, the server never receives the fragment, so all server-side security controls are blind to this vector. AI agents that process the full URL string ingest the fragment as context. This effectively weaponises any legitimate domain without compromising the host server. No server logs, no WAF alerts, no network IDS signatures.

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

Six broad UrlScan.io queries combine indicators from multiple categories into single queries for efficient periodic scanning. Each sweep covers an entire attack class in one query. Recommended cadence is weekly with a date filter to scope the results.

```
text.content:("ignore previous instructions")
  OR text.content:("disregard previous instructions")
  OR text.content:("override system prompt")
  OR text.content:("bypass system prompt")
  OR text.content:("enable developer mode")
  OR text.content:("activate DAN mode")
  OR text.content:("enable jailbreak mode")
```

## False positive strategy

Every EKFiddle rule was tested against the top 100 Tranco-ranked websites. The primary mitigation is dual-condition matching: require both the concealment mechanism and the malicious payload content. A CSS element with zero opacity is not a match on its own. A page mentioning "curl" is not a match on its own. Only the combination fires the rule.

Bounded repetition in all regex patterns prevents runaway matching. The longest lookahead is 1300 characters for the CSS hidden text rules, which balances detection coverage against scan performance. All patterns use case-insensitive and multiline flags.

## Deployment

The EKFiddle regex rules deploy directly into the CustomRegexes.txt production file. The UrlScan.io queries load as Saved Searches for persistent alerting, or run as manual queries for periodic threat hunting. Individual phrase queries work best as Saved Searches. The consolidated sweeps work best for manual hunting sessions.

This rule set is a point-in-time snapshot. As LLMs improve their instruction-following boundaries and attackers adapt their evasion techniques, the detection patterns will need continuous refinement. The categories and detection logic, however, represent the structural attack surface and will remain relevant as long as AI agents process untrusted web content.

---

## Support LLM ThreatIntel

LLM ThreatIntel is maintained independently. If you find the research useful, you can support hosting, collection, automation, and continued publication.

[Buy me a coffee](https://buymeacoffee.com/lucaslinkowski)

For sponsorship, research partnerships, or tailored briefings: [support@llm-threatintel.com](mailto:support@llm-threatintel.com)

General contact: [contact@lucaslinkowski.com](mailto:contact@lucaslinkowski.com)

Support does not influence editorial decisions, report selection, or technical conclusions.

## Disclaimer

Maintained for defensive security research. All intelligence from public reports. Validate IOCs before production blocking.
