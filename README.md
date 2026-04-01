# LLM ThreatIntel

Automated threat intelligence feed tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption.

## What This Is

LLM ThreatIntel is a static website hosted on GitHub Pages that serves as a living threat intelligence blog. It focuses exclusively on threats in the GenAI and LLM space. The site is built with plain HTML, CSS, and JavaScript with no build tools, no frameworks, and no dependencies.

The site has five sections:

1. **Intel Feed** — Reverse-chronological threat intelligence reports with IOCs, MITRE ATT&CK mappings, and source attribution
2. **Threat Actors** — Searchable tracker of GenAI threat actors, malware families, and campaigns with aliases, TTPs, and distribution channels
3. **IOC Feed** — Copy-paste ready indicators in multiple formats: defanged one-per-line, Splunk/LogScale OR format, and comma-separated quoted
4. **Blog** — Manual posts for analysis, commentary, and research notes
5. **About** — Project description, sources, and methodology

Intelligence collection is automated using either Claude Code CLI or the Anthropic API via GitHub Actions. When new intelligence is found, the automation creates a Markdown blog post, updates the threat actor tracker, updates the IOC database, and commits everything to GitHub. GitHub Actions then rebuilds and deploys the site automatically.

## Project Structure

```
llm-threatintel/
├── index.html                  # Site entry point
├── css/style.css               # Dark purple theme
├── js/
│   ├── app.js                  # Core application (routing, rendering, IOC feeds)
│   └── neural-bg.js            # Animated neural network background
├── data/
│   ├── posts-index.json        # Blog post metadata
│   ├── actors.json             # Threat actor / malware tracker
│   └── iocs.json               # IOC database
├── posts/                      # Markdown blog posts
│   ├── 2026-03-30-teampcp-supply-chain.md
│   ├── 2026-03-28-lamehug-llm-malware.md
│   └── ...
├── scripts/
│   └── collect.py              # Anthropic API collection script
├── automation/
│   ├── claude-code-task.md     # Claude Code task prompt
│   └── cowork-workflow.md      # Cowork app workflow guide
├── logs/                       # Collection run logs (gitignored)
├── .github/workflows/
│   ├── deploy.yml              # GitHub Pages deployment
│   └── collect.yml             # Scheduled daily collection
├── .gitignore
└── README.md
```

## Deployment Guide — From Zero to Live Site

### Prerequisites

You need:
- A GitHub account (free tier is fine)
- Git installed on your machine
- A text editor
- Optional: an Anthropic API key (for automated collection)
- Optional: a custom domain (about $10-15/year)

### Step 1: Download and Extract

Download the llm-threatintel.zip file and extract it. You should see a folder called `llm-threatintel` containing all the files listed above.

### Step 2: Create the GitHub Repository

1. Go to https://github.com/new
2. Repository name: `llm-threatintel`
3. Set it to **Public** (required for free GitHub Pages)
4. Do NOT initialize with a README (we already have one)
5. Click **Create repository**

### Step 3: Push the Code to GitHub

Open a terminal, navigate into the extracted folder, and run:

```bash
cd llm-threatintel

git init
git add -A
git commit -m "initial: LLM ThreatIntel launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/llm-threatintel.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

If you use SSH instead of HTTPS for Git:
```bash
git remote add origin git@github.com:YOUR_USERNAME/llm-threatintel.git
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu bar)
3. Click **Pages** (left sidebar under "Code and automation")
4. Under **Source**, select **GitHub Actions**
5. The deploy.yml workflow included in the repository will handle deployment

### Step 5: Verify Deployment

1. Go to **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually under 1 minute)
4. Your site is now live at: `https://YOUR_USERNAME.github.io/llm-threatintel/`

### Step 6: Test the Site

Visit your live URL and verify:
- The home page loads with the neural network background animation
- The status bar shows "OPERATIONAL"
- The four stat tiles are clickable (Active IOCs opens a modal)
- All five navigation tabs work: Intel Feed, Threat Actors, IOC Feed, Blog, About
- Copy buttons work on the IOC Feed page
- The threat actor table is searchable

## Setting Up Automated Collection

You have two options for automated intelligence collection. Choose one or use both.

### Option A: Claude Code CLI (Recommended)

This runs Claude Code on your local machine or a server. Claude Code has direct filesystem access and can search the web, write files, and push to Git natively.

**Install Claude Code:**
```bash
npm install -g @anthropic-ai/claude-code
```

**Set your API key:**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Test a manual run:**
```bash
cd /path/to/llm-threatintel
claude --task automation/claude-code-task.md
```

Claude Code will search the web for new GenAI threat intelligence, create blog posts, update the data files, and push to GitHub.

**Schedule daily runs with cron:**
```bash
crontab -e
```

Add this line (runs at 6:10 AM EST / 11:10 UTC daily):
```
10 11 * * * cd /path/to/llm-threatintel && ANTHROPIC_API_KEY=sk-ant-xxx claude --task automation/claude-code-task.md >> logs/collection.log 2>&1
```

**Requirements:** Node.js 18+, Git configured with push credentials, ANTHROPIC_API_KEY set.

### Option B: GitHub Actions + Anthropic API

This runs entirely in GitHub's infrastructure using a Python script. No local machine needed.

**Step 1: Add your API key as a repository secret**
1. Go to your repository Settings
2. Click **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `ANTHROPIC_API_KEY`
5. Value: your Anthropic API key (sk-ant-...)
6. Click **Add secret**

**Step 2: Enable write permissions**
1. Go to Settings > **Actions** > **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Click **Save**

**Step 3: Test the workflow**
1. Go to the **Actions** tab
2. Click **Daily Intelligence Collection** in the left sidebar
3. Click **Run workflow** > **Run workflow**
4. Watch the run complete and check for new posts

The workflow runs automatically every day at 11:10 UTC (6:10 AM EST). It calls the Anthropic API with web search enabled, parses the results, generates blog posts, updates data files, and pushes to the repository.

## Setting Up a Custom Domain (Optional)

### Step 1: Register a Domain

Register `llm-threatintel.com` (or your preferred domain) through a registrar like:
- Cloudflare Registrar (cheapest, no markup)
- Namecheap
- Google Domains

### Step 2: Create a CNAME File

Create a file called `CNAME` (no extension) in the root of your repository containing just your domain:

```
llm-threatintel.com
```

Commit and push this file.

### Step 3: Configure DNS

In your domain registrar's DNS settings, create a CNAME record:
- Type: CNAME
- Name: @ (or www)
- Value: `YOUR_USERNAME.github.io`

If your registrar requires A records instead of CNAME for the apex domain, use GitHub's IP addresses:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Step 4: Configure GitHub Pages

1. Go to Settings > Pages
2. Under **Custom domain**, enter your domain name
3. Click **Save**
4. Check **Enforce HTTPS** (after DNS propagation, may take a few minutes)

### Step 5: Wait for DNS Propagation

DNS changes take anywhere from a few minutes to 48 hours. You can check progress at https://dnschecker.org

## Adding Content Manually

### Adding a New Intel Report

1. Create a Markdown file in the `posts/` directory following the naming convention: `YYYY-MM-DD-slug.md`
2. Use existing posts as a template for formatting (executive summary, campaign table, MITRE mapping, IOC blocks, references)
3. Add the post metadata to `data/posts-index.json` at the beginning of the posts array
4. Update `data/actors.json` if the post covers new threat actors
5. Update `data/iocs.json` with any new indicators
6. Commit and push — GitHub Actions deploys automatically

### Adding a Blog Post

Blog posts go in the same `posts/` directory but are referenced from a blog index. The blog section currently loads from a placeholder. To add structured blog content, create a `data/blog-index.json` following the same pattern as `posts-index.json`.

### Updating the IOC Database

Edit `data/iocs.json` directly. Each IOC entry needs:

```json
{
  "value": "malicious-domain.com",
  "type": "domain",
  "context": "Brief description",
  "first_seen": "2026-03-30",
  "source": "Source name",
  "campaign": "campaign-slug",
  "status": "active"
}
```

Valid types: `domain`, `url_path`, `ip`, `sha256`, `md5`, `hash`, `package`

The site automatically defangs indicators for display (replacing the last dot with [.]) while keeping clean values in the Splunk/LogScale and comma-separated formats.

## IOC Output Formats

The IOC Feed page provides five formats:

| Format | Purpose | Example |
|--------|---------|---------|
| Defanged Domains | Safe for reports and tickets | `wormgpt[.]ai` |
| Defanged URLs | Full paths, safe for sharing | `pypi[.]org/project/litellm-proxy-server` |
| Defanged IPs | Last octet dot replaced | `185.234.72[.]19` |
| Splunk/LogScale | OR-delimited, paste into SPL or LQL | `"wormgpt.ai" OR "fraudgpt.com"` |
| Comma-Separated | For CSV, SOAR, or scripts | `"wormgpt.ai", "fraudgpt.com"` |

Clicking the stat tiles on the IOC Feed page opens a modal popup with filtered IOCs in all three copy-paste formats.

## Technology Stack

- Plain HTML, CSS, JavaScript (no build step, no dependencies)
- GitHub Pages for hosting (free)
- GitHub Actions for CI/CD (free)
- Anthropic Claude API for automated intelligence collection
- Outfit + DM Mono fonts
- Canvas API for neural network background animation

## Files Not to Edit

- `.github/workflows/deploy.yml` — deployment pipeline, works as-is
- `js/neural-bg.js` — background animation, tuned for performance
- `css/style.css` — the design system, edit only if you want to change the visual theme

## Files You Will Edit

- `data/posts-index.json` — add new post metadata here
- `data/actors.json` — add or update threat actors
- `data/iocs.json` — add new IOCs
- `posts/*.md` — write new intel reports
- `automation/claude-code-task.md` — tune the collection prompt if needed

## Troubleshooting

**Site shows blank page:** Check browser console for errors. Most likely a JSON syntax error in one of the data files. Validate your JSON at https://jsonlint.com

**GitHub Pages not deploying:** Check the Actions tab for failed workflows. Ensure Pages source is set to "GitHub Actions" not "Deploy from a branch".

**Collection script not finding new intel:** This is normal on quiet days. The script only creates posts when genuinely new intelligence is published. Check `logs/` for the raw API response.

**Copy buttons not working:** The clipboard API requires HTTPS. If testing locally over HTTP, the fallback method using execCommand should still work. On the live HTTPS site, both methods work.

**Custom domain not working:** DNS propagation takes time. Verify your CNAME record is correct using `dig YOUR_DOMAIN CNAME` or https://dnschecker.org. Ensure the CNAME file exists in the repository root.
