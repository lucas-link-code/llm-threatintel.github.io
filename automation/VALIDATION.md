# LLM ThreatIntel Validation Gate

This repository uses `scripts/validate_site.py` as the shared data quality gate for Intel Feed reports, blog metadata, actors, and IOCs.

The validator is read-only for intelligence content. It reports problems and never deletes, rewrites, merges, normalizes, or cleans up reports, IOCs, actors, or blog posts automatically.

There are two publication modes:

- Local/manual agent work remains gate-first: stop on validation failures or review-required findings unless Lucas explicitly approves report-only publication.
- Scheduled GitHub collection is report-only: it publishes collection output and commits validation reports even when validation finds issues, so Lucas can review and assign remediation afterwards.

## When To Run

Run strict validation after any edit to:

- `posts/*.md`
- `data/posts-index.json`
- `data/blog-index.json`
- `data/actors.json`
- `data/iocs.json`

```bash
python scripts/validate_site.py --mode strict --write-report
```

If you create or materially change an Intel Feed report, run:

```bash
python scripts/validate_site.py --mode full --changed-only-evidence --write-report --update-validation-state
```

If validation fails or returns review-required findings:

- stop
- do not commit
- do not push
- do not delete reports or IOCs to make validation pass
- review `validation-reports/latest-validation-report.md`
- ask Lucas whether to add/confirm a source, add a manual evidence override, revise supported claims, keep for review, or remove content only with explicit approval

## Modes

```bash
python scripts/validate_site.py --mode audit
python scripts/validate_site.py --mode structural
python scripts/validate_site.py --mode strict
python scripts/validate_site.py --mode evidence
python scripts/validate_site.py --mode full
```

- `audit`: first-run baseline mode. Reports findings and exits successfully unless the validator itself cannot run.
- `structural`: JSON/data contracts, dates, tags, TLP, IOC formats, duplicate IDs, file references, conflicting IOC types, bare AI vendor platform domains, and bare shared infrastructure hosts. No network.
- `strict`: structural plus Markdown hygiene, placeholder checks, source section detection, URL syntax extraction, duplicate IOC warnings, and orphan Markdown warnings. No network.
- `evidence`: source URL checks for reports whose content hash is missing or changed in `validation/validated-reports.json`.
- `full`: strict plus evidence.

Shared infrastructure IOC rule: `validation/policy.json` → `shared_infrastructure_domain_denylist` hard-fails bare cloud storage, CDN, registry, code hosting, PaaS, tunnel, messaging, paste, and shortener apex domains such as `storage.googleapis.com`, `github.com`, `vercel.app`, or `t.me`. Match is exact after normalisation. Attacker-controlled subdomains and specific paths remain valid, for example `grok-code-session-traces.storage.googleapis.com`, `maliciousapp.vercel.app`, or `storage.googleapis.com/bucket-name/`. The same list is enforced at insert time by `scripts/collect.py`.

Legitimate AI vendor platform IOC rule: `validation/policy.json` → `legitimate_platform_iocs_deny_list` hard-fails bare vendor hosts and generic feature paths such as `huggingface.co`, `claude.ai`, `openrouter.ai`, and `openrouter.com`. Match is exact after normalisation. Usage of a legitimate router or model host in a report is not an indicator. Attacker-controlled subdomains and specific malicious paths remain valid, for example `openrouter.ai/user/attacker-controlled-id`. The same list is enforced at insert time by `scripts/collect.py`.

Options commonly used:

```bash
--changed-only-evidence
--write-report
--update-validation-state
--fail-on-review-required
--no-network
```

## Validation State

`validation/validated-reports.json` stores report content hashes and evidence status. A report is new or changed when its current content hash is missing from that state file or no longer matches.

The content hash includes:

- Markdown report content
- matching `data/posts-index.json` metadata
- related IOC records where campaign mapping is clear

Unchanged reports skip expensive evidence URL checks. Structural and strict checks still run across the repository.

For first adoption, run an audit baseline and update the state:

```bash
python scripts/validate_site.py --mode audit --write-report --update-validation-state
```

Baseline entries are explicitly marked as non-network-checked audit entries. Future report changes still trigger evidence validation.

## Manual Evidence Overrides

Manual overrides live in `validation/manual-evidence-overrides.json`.

Example:

```json
{
  "reports": {
    "2026-05-10-example-report": {
      "approved_by": "Lucas",
      "approved_at": "2026-05-11",
      "reason": "Primary source blocks GitHub Actions but loads manually. Alternate source confirms report.",
      "supporting_sources": [
        "https://example.com/alternate-report"
      ]
    }
  }
}
```

Overrides can satisfy evidence review. They do not bypass structural failures such as bad JSON, unknown tags, invalid IOC values, duplicate IDs, or unresolved placeholders.

## Reports

Generated reports are written to:

- `validation-reports/latest-validation-report.md`
- `validation-reports/latest-validation-report.json`

Scheduled collection commits these reports so Lucas can review them directly in GitHub:

- `validation-reports/latest-validation-report.md`
- `validation-reports/latest-validation-report.json`
- `validation-reports/index.md`
- `validation-reports/runs/YYYY/MM/*.md`
- `validation-reports/runs/YYYY/MM/*.json`
- `validation-reports/review-required/*.md` when the validator exit code is non-zero
- `validation-reports/review-required/*.json` when the validator exit code is non-zero

GitHub Actions also uploads the same reports as artifacts for convenience.

Every report includes the statement:

```text
No files were removed or destructively modified.
```

## GitHub Actions

`.github/workflows/validate.yml` runs on push, pull request, and manual dispatch:

```bash
python scripts/validate_site.py --mode strict --write-report --no-network
```

The daily collection workflow runs after collection:

```bash
python scripts/validate_site.py --mode full --changed-only-evidence --write-report --update-validation-state --fail-on-review-required
```

The collection workflow captures the validator exit code and continues. It commits the latest report, a timestamped run report, and a report index. If the validator exit code is non-zero, it also commits a copy under `validation-reports/review-required/`.

`validate.yml` remains strict and non-networked. It can still fail push or pull request checks because it is a quality check, not the scheduled report-only publisher.

## Reviewing Reports From GitHub Mobile

Open:

1. `validation-reports/index.md`
2. the latest linked run report under `validation-reports/runs/`
3. any linked report under `validation-reports/review-required/`

The Markdown report includes counts, findings, duplicate IOC warnings, source review findings, and a human review queue. GitHub Actions artifacts also contain the same Markdown and JSON reports.

## External Agent Safety

For local Claude Code, cloud Claude Code, Cursor, and other external agents:

1. Make report/data changes.
2. Run the validator.
3. Stop on validation failure or review-required findings. Do not commit, push, or delete content to make validation pass.
4. Commit and push directly to `main` for routine work Lucas has reviewed in session. Pushing to `main` triggers deployment through `.github/workflows/deploy.yml`.
5. Use a branch and pull request instead when the change is large or risky: policy or schema redesign, bulk IOC or report removal, validator logic rewrites, workflow changes, or anything Lucas has not already reviewed.
6. State which of the two routes is being taken before pushing. Do not switch an agent run to the branch and pull request route without saying so up front, because a branch push does not deploy.
7. On the branch route, let GitHub Actions validate again and merge only after Lucas review and passing checks.
