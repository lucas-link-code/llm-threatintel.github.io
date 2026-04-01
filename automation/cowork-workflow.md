# LLM ThreatIntel — Cowork Automation Workflow

## Overview

This document describes how to use the Anthropic Cowork desktop app as an alternative to Claude Code CLI for managing the LLM ThreatIntel intelligence pipeline.

## Setup

1. Install Cowork from https://claude.ai/download (desktop app)
2. Open the llm-threatintel repository folder in Cowork
3. Configure the automation task using the workflow below

## Daily Collection Workflow

### Step 1: Research Phase
Instruct Cowork to search the web for new GenAI and LLM threat intelligence using the same search criteria defined in automation/claude-code-task.md. Cowork will use its built-in web search capability to check the source list.

### Step 2: Content Generation
If new findings are identified, instruct Cowork to:
- Create a new Markdown file in the posts/ directory following the existing post template format
- Use the naming convention: YYYY-MM-DD-{slug}.md

### Step 3: Data Updates
Instruct Cowork to update the JSON data files:
- Add the new post metadata to data/posts-index.json (at the beginning of the posts array)
- Add any new threat actors or aliases to data/actors.json
- Add any new IOCs to data/iocs.json with proper type, context, and source fields

### Step 4: Git Operations
Cowork can execute git commands to commit and push changes. Instruct it to:
- Stage all modified files
- Commit with a descriptive message
- Push to the main branch

GitHub Actions will automatically rebuild and deploy the site after the push.

## Ad-Hoc Post Creation

For creating posts outside the daily automated cycle, such as when you finish a manual investigation, use Cowork to:

1. Describe your findings conversationally
2. Ask Cowork to format them as a ThreatIntel post using the template in the posts/ directory as a reference
3. Have Cowork update all the data files and commit

## Tips

- Cowork works best when you give it the full context of what you want in a single message
- Point it at existing posts as format examples
- Review generated IOCs before pushing, as automated extraction can produce false positives
- Use Cowork's file management capabilities to preview the Markdown before committing
