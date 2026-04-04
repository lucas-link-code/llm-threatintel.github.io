# LLM ThreatIntel — Metadata / SEO / Social Sharing Implementation Bundle

Repository: `lucas-link-code/llm-threatintel.github.io`
Branch assumed: `main`
Domain: `https://llm-threatintel.com`

This bundle is repo-specific and based on the current structure observed in the repository:
- `index.html` is the single HTML shell with a minimal `<head>`.
- `js/app.js` handles hash-based routing and client-side rendering.
- `data/posts-index.json` provides post metadata.
- `CNAME` already contains `llm-threatintel.com`.
- `.github/workflows/deploy.yml` uploads the repo root directly to GitHub Pages.

## What these changes do

There are two classes of changes in this bundle.

### 1. Background-only changes
These do not materially change what a visitor sees on the site:
- homepage metadata
- Open Graph / Twitter card metadata
- canonical and robots directives
- JSON-LD structured data
- `robots.txt`
- `sitemap.xml`
- `rss.xml`
- `site.webmanifest`
- social preview images

### 2. Structural but low-visibility changes
These are the highest-value SEO/shareability improvements, especially for LinkedIn and other social platforms:
- generating static HTML post pages under `/posts/*.html`
- generating `sitemap.xml` and `rss.xml` during deploy

These changes do **not** require redesigning the site. They are additive and can coexist with the current SPA/hash-routed app.

## Why this is needed

The current site is a client-rendered SPA shell. That is fine for users, but it limits:
- per-post search indexing
- per-post social sharing previews
- LinkedIn / Slack / Teams / X previews for specific reports

Homepage metadata alone is not enough. The strongest improvement is to generate real per-post HTML pages that carry their own `<title>`, description, Open Graph image, canonical URL, and JSON-LD.

---

# Implementation order

Recommended rollout order:

1. Update `index.html` head metadata
2. Add `robots.txt`
3. Add `site.webmanifest`
4. Add `scripts/build_meta.py`
5. Update `.github/workflows/deploy.yml`
6. Add homepage social image asset at `assets/og/llm-threatintel-home.png`
7. Optionally update `js/app.js` for route-aware runtime metadata updates

---

# 1) Update `index.html`

## Purpose
Improve homepage SEO, homepage share previews, canonicalization, RSS discovery, and structured data.

## Expected visible impact
None, other than better tab title / better link previews when shared.

## Diff

```diff
--- a/index.html
+++ b/index.html
@@
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
-  <title>LLM ThreatIntel — GenAI Threat Intelligence</title>
-  <meta name="description" content="Automated threat intelligence feed tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, and shadow AI risks.">
+  <title>LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI</title>
+  <meta name="description" content="Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption.">
+  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
+  <meta name="author" content="LLM ThreatIntel">
   <meta name="theme-color" content="#0c0a12">
+  <link rel="canonical" href="https://llm-threatintel.com/">
+  <link rel="alternate" type="application/rss+xml" title="LLM ThreatIntel RSS" href="https://llm-threatintel.com/rss.xml">
+  <link rel="manifest" href="/site.webmanifest">
   <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%238b5cf6'/><text x='16' y='21' text-anchor='middle' font-family='monospace' font-weight='bold' font-size='11' fill='white'>LLM</text></svg>">
+
+  <meta property="og:type" content="website">
+  <meta property="og:title" content="LLM ThreatIntel">
+  <meta property="og:description" content="Automated GenAI and LLM threat intelligence covering malicious tools, AI-enabled malware, supply chain compromise, LLMjacking, and shadow AI risks.">
+  <meta property="og:url" content="https://llm-threatintel.com/">
+  <meta property="og:site_name" content="LLM ThreatIntel">
+  <meta property="og:image" content="https://llm-threatintel.com/assets/og/llm-threatintel-home.png">
+  <meta property="og:image:width" content="1200">
+  <meta property="og:image:height" content="630">
+  <meta property="og:image:alt" content="LLM ThreatIntel homepage preview">
+
+  <meta name="twitter:card" content="summary_large_image">
+  <meta name="twitter:title" content="LLM ThreatIntel">
+  <meta name="twitter:description" content="Threat intelligence for malicious LLM tools, GenAI malware, shadow AI, supply chain compromise, and LLMjacking operations.">
+  <meta name="twitter:image" content="https://llm-threatintel.com/assets/og/llm-threatintel-home.png">
+
+  <script type="application/ld+json">
+  {
+    "@context": "https://schema.org",
+    "@graph": [
+      {
+        "@type": "Organization",
+        "name": "LLM ThreatIntel",
+        "url": "https://llm-threatintel.com/"
+      },
+      {
+        "@type": "WebSite",
+        "name": "LLM ThreatIntel",
+        "url": "https://llm-threatintel.com/",
+        "description": "Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption.",
+        "inLanguage": "en",
+        "publisher": {
+          "@type": "Organization",
+          "name": "LLM ThreatIntel"
+        }
+      }
+    ]
+  }
+  </script>
   <link rel="stylesheet" href="css/style.css">
 </head>
```

---

# 2) Add `robots.txt`

## Purpose
Give crawlers an explicit allow rule and advertise the sitemap.

## Expected visible impact
None.

## New file: `robots.txt`

```txt
User-agent: *
Allow: /

Sitemap: https://llm-threatintel.com/sitemap.xml
```

---

# 3) Add `site.webmanifest`

## Purpose
Improve installability and browser metadata hygiene.

## Expected visible impact
None in normal browsing.

## New file: `site.webmanifest`

```json
{
  "name": "LLM ThreatIntel",
  "short_name": "LLM ThreatIntel",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0c0a12",
  "theme_color": "#0c0a12",
  "description": "Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption."
}
```

---

# 4) Add `scripts/build_meta.py`

## Purpose
Generate:
- static post pages at `/posts/*.html`
- `sitemap.xml`
- `rss.xml`

This is the most important improvement for per-post SEO and LinkedIn/social sharing.

## Expected visible impact
No redesign. These are additive files.

## New file: `scripts/build_meta.py`

```python
#!/usr/bin/env python3
from pathlib import Path
import json
import re
import html
from datetime import datetime, timezone
from email.utils import format_datetime
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
POSTS_DIR = ROOT / "posts"
INDEX_FILE = DATA_DIR / "posts-index.json"
CNAME_FILE = ROOT / "CNAME"

DEFAULT_SITE_URL = "https://llm-threatintel.com"
DEFAULT_OG_PATH = "/assets/og/llm-threatintel-home.png"

SITE_NAME = "LLM ThreatIntel"
SITE_DESCRIPTION = (
    "Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, "
    "supply chain compromises, LLMjacking operations, shadow AI risks, and "
    "nation-state GenAI adoption."
)

FAVICON_DATA_URI = (
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"
    "<rect width='32' height='32' rx='8' fill='%238b5cf6'/>"
    "<text x='16' y='21' text-anchor='middle' font-family='monospace' "
    "font-weight='bold' font-size='11' fill='white'>LLM</text></svg>"
)


def get_site_url() -> str:
    if CNAME_FILE.exists():
        cname = CNAME_FILE.read_text(encoding="utf-8").strip()
        if cname:
            return f"https://{cname}"
    return DEFAULT_SITE_URL


SITE_URL = get_site_url()
DEFAULT_OG_URL = f"{SITE_URL}{DEFAULT_OG_PATH}"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def parse_date(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def post_slug(post: dict) -> str:
    return Path(post["file"]).stem


def post_html_filename(post: dict) -> str:
    return f"{post_slug(post)}.html"


def post_output_path(post: dict) -> Path:
    return POSTS_DIR / post_html_filename(post)


def post_url(post: dict) -> str:
    return f"{SITE_URL}/posts/{post_html_filename(post)}"


def post_og_url(post: dict) -> str:
    slug = post_slug(post)
    og_dir = ROOT / "assets" / "og"
    for ext in ("png", "jpg", "jpeg", "webp"):
        candidate = og_dir / f"{slug}.{ext}"
        if candidate.exists():
            return f"{SITE_URL}/assets/og/{slug}.{ext}"
    return DEFAULT_OG_URL


def escape_attr(value: str) -> str:
    return html.escape(value, quote=True)


def render_inline(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<a href="\2" target="_blank" rel="noopener">\1</a>',
        text,
    )
    return text


def render_table_block(block: str) -> str:
    lines = [line.strip() for line in block.strip().splitlines() if line.strip()]
    if len(lines) < 2:
        return f"<p>{render_inline(block)}</p>"

    headers = [c.strip() for c in lines[0].strip("|").split("|")]
    rows = []
    for line in lines[2:]:
        row = [c.strip() for c in line.strip("|").split("|")]
        rows.append(row)

    thead = "".join(f"<th>{render_inline(h)}</th>" for h in headers)
    tbody = ""
    for row in rows:
        tbody += "<tr>" + "".join(f"<td>{render_inline(c)}</td>" for c in row) + "</tr>"

    return f"<table><thead><tr>{thead}</tr></thead><tbody>{tbody}</tbody></table>"


def render_markdown(md: str) -> str:
    md = md.replace("\r\n", "\n").strip()

    code_blocks = []

    def stash_code(match):
        lang = match.group(1) or ""
        code = html.escape(match.group(2).strip())
        idx = len(code_blocks)
        code_blocks.append(f'<pre><code class="language-{lang}">{code}</code></pre>')
        return f"@@CODEBLOCK{idx}@@"

    md = re.sub(r"```(\w*)\n([\s\S]*?)```", stash_code, md)

    blocks = re.split(r"\n\s*\n", md)
    rendered = []

    for block in blocks:
        stripped = block.strip()
        if not stripped:
            continue

        if stripped.startswith("@@CODEBLOCK") and stripped.endswith("@@"):
            rendered.append(stripped)
            continue

        if re.match(r"^\|.+\|\n\|[-| :]+\|", stripped):
            rendered.append(render_table_block(stripped))
            continue

        lines = stripped.splitlines()

        if all(line.startswith("- ") for line in lines):
            items = "".join(f"<li>{render_inline(line[2:].strip())}</li>" for line in lines)
            rendered.append(f"<ul>{items}</ul>")
            continue

        if all(re.match(r"^\d+\. ", line) for line in lines):
            items = "".join(
                f"<li>{render_inline(re.sub(r'^\d+\.\s+', '', line).strip())}</li>"
                for line in lines
            )
            rendered.append(f"<ol>{items}</ol>")
            continue

        if all(line.startswith("> ") for line in lines):
            content = " ".join(render_inline(line[2:].strip()) for line in lines)
            rendered.append(f"<blockquote>{content}</blockquote>")
            continue

        if stripped == "---":
            rendered.append("<hr>")
            continue

        m = re.match(r"^(#{1,3})\s+(.+)$", stripped)
        if m and len(lines) == 1:
            level = len(m.group(1))
            text = render_inline(m.group(2).strip())
            rendered.append(f"<h{level}>{text}</h{level}>")
            continue

        paragraph = "<br>".join(render_inline(line) for line in lines)
        rendered.append(f"<p>{paragraph}</p>")

    html_out = "\n".join(rendered)

    for idx, code_html in enumerate(code_blocks):
        html_out = html_out.replace(f"@@CODEBLOCK{idx}@@", code_html)

    return html_out


def build_post_html(post: dict, markdown: str) -> str:
    title = post["title"].strip()
    description = post.get("excerpt", SITE_DESCRIPTION).strip()
    published = parse_date(post["date"])
    updated = published
    canonical = post_url(post)
    og_url = post_og_url(post)
    tags = post.get("tags", [])
    tags_meta = "\n".join(
        f'  <meta property="article:tag" content="{escape_attr(tag)}">'
        for tag in tags
    )
    json_ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "datePublished": published.isoformat().replace("+00:00", "Z"),
        "dateModified": updated.isoformat().replace("+00:00", "Z"),
        "author": {"@type": "Organization", "name": SITE_NAME},
        "publisher": {"@type": "Organization", "name": SITE_NAME},
        "mainEntityOfPage": canonical,
        "keywords": tags,
    }

    content_html = render_markdown(markdown)
    tags_html = "".join(
        f'<span class="post-tag tag-{escape_attr(tag)}">{html.escape(tag.replace("-", " ").title())}</span>'
        for tag in tags
    )

    return f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>{escape_attr(title)} | {SITE_NAME}</title>
  <meta name=\"description\" content=\"{escape_attr(description)}\">
  <meta name=\"robots\" content=\"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1\">
  <meta name=\"author\" content=\"{SITE_NAME}\">
  <meta name=\"theme-color\" content=\"#0c0a12\">
  <link rel=\"canonical\" href=\"{escape_attr(canonical)}\">
  <link rel=\"icon\" href=\"{FAVICON_DATA_URI}\">
  <link rel=\"stylesheet\" href=\"/css/style.css\">

  <meta property=\"og:type\" content=\"article\">
  <meta property=\"og:title\" content=\"{escape_attr(title)}\">
  <meta property=\"og:description\" content=\"{escape_attr(description)}\">
  <meta property=\"og:url\" content=\"{escape_attr(canonical)}\">
  <meta property=\"og:site_name\" content=\"{SITE_NAME}\">
  <meta property=\"og:image\" content=\"{escape_attr(og_url)}\">
  <meta property=\"og:image:alt\" content=\"{escape_attr(title)}\">
  <meta property=\"article:published_time\" content=\"{published.isoformat().replace('+00:00', 'Z')}\">
  <meta property=\"article:modified_time\" content=\"{updated.isoformat().replace('+00:00', 'Z')}\">
{tags_meta}

  <meta name=\"twitter:card\" content=\"summary_large_image\">
  <meta name=\"twitter:title\" content=\"{escape_attr(title)}\">
  <meta name=\"twitter:description\" content=\"{escape_attr(description)}\">
  <meta name=\"twitter:image\" content=\"{escape_attr(og_url)}\">

  <script type=\"application/ld+json\">
{json.dumps(json_ld, indent=2)}
  </script>
</head>
<body>
  <header class=\"site-header\">
    <div class=\"header-inner\">
      <a href=\"/\" class=\"site-logo\">
        <span class=\"logo-mark\">LLM</span>
        <span>LLM <span class=\"logo-accent\">ThreatIntel</span></span>
      </a>
      <nav class=\"site-nav\">
        <a href=\"/\">Intel Feed</a>
        <a href=\"/#actors\">Threat Actors</a>
        <a href=\"/#ioc-feed\">IOC Feed</a>
        <a href=\"/#blog\">Blog</a>
        <a href=\"/#about\">About</a>
      </nav>
    </div>
  </header>

  <main class=\"main-content\" id=\"app-content\">
    <a href=\"/\" class=\"back-link\">&larr; Back to feed</a>
    <div class=\"post-meta\" style=\"margin-bottom:1rem\">
      <span class=\"post-date\">{html.escape(post['date'])}</span>
      {tags_html}
      <span class=\"post-tag tlp-clear\">{html.escape(post.get('tlp', 'TLP:CLEAR'))}</span>
    </div>
    <div class=\"post-content\">{content_html}</div>
  </main>

  <footer class=\"site-footer\">
    <span class=\"footer-brand\">LLM ThreatIntel</span> &mdash; Automated GenAI Threat Intelligence
    <div class=\"footer-links\">
      Defensive research only <span>&middot;</span> TLP:CLEAR <span>&middot;</span> Automated via Claude Code <span>&middot;</span> llm-threatintel.com
    </div>
  </footer>

  <script>
  document.querySelectorAll('pre').forEach(pre => {{
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {{
      const code = pre.querySelector('code');
      const text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(() => {{
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      }});
    }});
    pre.style.position = 'relative';
    pre.appendChild(btn);
  }});
  </script>
</body>
</html>
"""


def build_sitemap(posts: list[dict]) -> str:
    latest_date = posts[0]["date"] if posts else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    items = [
        f"""  <url>
    <loc>{xml_escape(SITE_URL + "/")}</loc>
    <lastmod>{latest_date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>"""
    ]

    for post in posts:
        items.append(
            f"""  <url>
    <loc>{xml_escape(post_url(post))}</loc>
    <lastmod>{post["date"]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>"""
        )

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(items)
        + "\n</urlset>\n"
    )


def build_rss(posts: list[dict]) -> str:
    items = []
    for post in posts[:20]:
        pub_date = format_datetime(parse_date(post["date"]))
        title = xml_escape(post["title"])
        link = xml_escape(post_url(post))
        description = xml_escape(post.get("excerpt", ""))
        guid = link

        items.append(
            f"""    <item>
      <title>{title}</title>
      <link>{link}</link>
      <guid>{guid}</guid>
      <pubDate>{pub_date}</pubDate>
      <description>{description}</description>
    </item>"""
        )

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>{xml_escape(SITE_NAME)}</title>
    <link>{xml_escape(SITE_URL + "/")}</link>
    <description>{xml_escape(SITE_DESCRIPTION)}</description>
    <language>en-gb</language>
    <lastBuildDate>{format_datetime(datetime.now(timezone.utc))}</lastBuildDate>
{"".join(items)}
  </channel>
</rss>
"""


def main():
    posts_data = read_json(INDEX_FILE)
    posts = posts_data.get("posts", [])
    posts.sort(key=lambda p: p.get("date", ""), reverse=True)

    POSTS_DIR.mkdir(parents=True, exist_ok=True)

    for post in posts:
        md_path = POSTS_DIR / post["file"]
        if not md_path.exists():
            print(f"[WARN] Missing markdown file: {md_path}")
            continue

        markdown = md_path.read_text(encoding="utf-8")
        output_html = build_post_html(post, markdown)
        post_output_path(post).write_text(output_html, encoding="utf-8")
        print(f"[OK] Generated {post_output_path(post).relative_to(ROOT)}")

    (ROOT / "sitemap.xml").write_text(build_sitemap(posts), encoding="utf-8")
    print("[OK] Generated sitemap.xml")

    (ROOT / "rss.xml").write_text(build_rss(posts), encoding="utf-8")
    print("[OK] Generated rss.xml")


if __name__ == "__main__":
    main()
```

---

# 5) Update `.github/workflows/deploy.yml`

## Purpose
Run the generator at deploy time so the Pages artifact contains the generated post pages, sitemap, and RSS feed.

## Expected visible impact
None.

## Diff

```diff
--- a/.github/workflows/deploy.yml
+++ b/.github/workflows/deploy.yml
@@
 jobs:
   deploy:
     environment:
       name: github-pages
       url: ${{ steps.deployment.outputs.page_url }}
     runs-on: ubuntu-latest
     steps:
       - name: Checkout
         uses: actions/checkout@v4
+
+      - name: Setup Python
+        uses: actions/setup-python@v5
+        with:
+          python-version: '3.12'
 
       - name: Setup Pages
         uses: actions/configure-pages@v4
+
+      - name: Build sitemap, RSS, and static post pages
+        run: python scripts/build_meta.py
 
       - name: Upload artifact
         uses: actions/upload-pages-artifact@v3
         with:
           # Since this is plain HTML/JS, upload the entire repo root
           path: '.'
```

---

# 6) Optional update to `js/app.js`

## Purpose
Improve in-browser route metadata updates for the SPA side of the site.

## Important note
This is **not** the main SEO fix. The static post pages are the main fix.

## Expected visible impact
Only better browser tab titles / cleaner metadata updates during navigation.

## Diff

```diff
--- a/js/app.js
+++ b/js/app.js
@@
 const App = {
   postsIndex: null,
   actorsData: null,
   iocsData: null,
   currentFilter: 'all',
+  metaDefaults: {
+    siteName: 'LLM ThreatIntel',
+    siteUrl: 'https://llm-threatintel.com',
+    description: 'Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption.',
+    image: 'https://llm-threatintel.com/assets/og/llm-threatintel-home.png'
+  },
@@
   setupNav() {
@@
   },
+
+  upsertMeta(attrName, attrValue, content) {
+    let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
+    if (!el) {
+      el = document.createElement('meta');
+      el.setAttribute(attrName, attrValue);
+      document.head.appendChild(el);
+    }
+    el.setAttribute('content', content);
+  },
+
+  upsertLink(rel, href) {
+    let el = document.head.querySelector(`link[rel="${rel}"]`);
+    if (!el) {
+      el = document.createElement('link');
+      el.setAttribute('rel', rel);
+      document.head.appendChild(el);
+    }
+    el.setAttribute('href', href);
+  },
+
+  setRouteMeta({ title, description, url, type = 'website', image = null }) {
+    const finalTitle = title || `${this.metaDefaults.siteName} | GenAI Threat Intelligence`;
+    const finalDescription = description || this.metaDefaults.description;
+    const finalUrl = url || `${this.metaDefaults.siteUrl}/`;
+    const finalImage = image || this.metaDefaults.image;
+
+    document.title = finalTitle;
+    this.upsertMeta('name', 'description', finalDescription);
+    this.upsertMeta('property', 'og:title', finalTitle);
+    this.upsertMeta('property', 'og:description', finalDescription);
+    this.upsertMeta('property', 'og:url', finalUrl);
+    this.upsertMeta('property', 'og:type', type);
+    this.upsertMeta('property', 'og:image', finalImage);
+    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
+    this.upsertMeta('name', 'twitter:title', finalTitle);
+    this.upsertMeta('name', 'twitter:description', finalDescription);
+    this.upsertMeta('name', 'twitter:image', finalImage);
+    this.upsertLink('canonical', finalUrl);
+  },
 
   route() {
     const hash = window.location.hash || '#home';
     const [page, ...params] = hash.slice(1).split('/');
@@
     const content = document.getElementById('app-content');
 
     switch (page) {
-      case 'home': this.renderHome(content); break;
-      case 'post': this.renderPost(content, params.join('/')); break;
-      case 'actors': this.renderActors(content); break;
-      case 'ioc-feed': this.renderIOCFeed(content); break;
-      case 'blog': this.renderBlog(content); break;
-      case 'about': this.renderAbout(content); break;
-      default: this.renderHome(content);
+      case 'home':
+        this.setRouteMeta({
+          title: 'LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI',
+          description: this.metaDefaults.description,
+          url: `${this.metaDefaults.siteUrl}/`
+        });
+        this.renderHome(content);
+        break;
+      case 'post':
+        this.renderPost(content, params.join('/'));
+        break;
+      case 'actors':
+        this.setRouteMeta({
+          title: 'Threat Actor Tracker | LLM ThreatIntel',
+          description: 'Searchable tracker of malicious LLM tools, threat actors, malware families, and campaigns in the GenAI and LLM threat landscape.',
+          url: `${this.metaDefaults.siteUrl}/#actors`
+        });
+        this.renderActors(content);
+        break;
+      case 'ioc-feed':
+        this.setRouteMeta({
+          title: 'IOC Feed | LLM ThreatIntel',
+          description: 'Copy-paste ready IOC feed with defanged indicators, Splunk/LogScale OR format, and comma-separated quoted formats.',
+          url: `${this.metaDefaults.siteUrl}/#ioc-feed`
+        });
+        this.renderIOCFeed(content);
+        break;
+      case 'blog':
+        this.setRouteMeta({
+          title: 'Blog | LLM ThreatIntel',
+          description: 'Analysis, commentary, and research notes on the GenAI threat landscape.',
+          url: `${this.metaDefaults.siteUrl}/#blog`
+        });
+        this.renderBlog(content);
+        break;
+      case 'about':
+        this.setRouteMeta({
+          title: 'About | LLM ThreatIntel',
+          description: this.metaDefaults.description,
+          url: `${this.metaDefaults.siteUrl}/#about`
+        });
+        this.renderAbout(content);
+        break;
+      default:
+        this.setRouteMeta({
+          title: 'LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI',
+          description: this.metaDefaults.description,
+          url: `${this.metaDefaults.siteUrl}/`
+        });
+        this.renderHome(content);
     }
     window.scrollTo(0, 0);
   },
@@
   async renderPost(container, postId) {
     container.innerHTML = '<div class="loading">Loading report...</div>';
     const postMeta = this.postsIndex?.posts.find(p => p.id === postId);
     if (!postMeta) {
+      this.setRouteMeta({
+        title: 'Post Not Found | LLM ThreatIntel',
+        description: this.metaDefaults.description,
+        url: `${this.metaDefaults.siteUrl}/`
+      });
       container.innerHTML = '<a href="#home" class="back-link">&larr; Back to feed</a><div class="post-content"><p>Post not found.</p></div>';
       return;
     }
+
+    const postHtml = postMeta.file.replace(/\.md$/i, '.html');
+    this.setRouteMeta({
+      title: `${postMeta.title} | LLM ThreatIntel`,
+      description: postMeta.excerpt || this.metaDefaults.description,
+      url: `${this.metaDefaults.siteUrl}/posts/${postHtml}`,
+      type: 'article'
+    });
+
     try {
       const response = await fetch(`posts/${postMeta.file}`);
```

---

# 7) Add homepage social preview image

## Purpose
Make the site look good when shared on LinkedIn, Slack, Teams, X, etc.

## Expected visible impact
None on-page, unless you choose to also use it in the UI.

## New asset
Create:
- `assets/og/llm-threatintel-home.png`

## Recommended image spec
- Size: `1200 x 630`
- Format: PNG
- Background: dark / purple to match site theme
- Large readable text:
  - `LLM ThreatIntel`
  - `GenAI Threat Intelligence`
- Optional subtitle:
  - `Malicious LLM tools • AI malware • LLMjacking • Shadow AI`

## Recommended per-post improvement
Optionally add post-specific images:
- `assets/og/<post-slug>.png`

The build script will automatically use a per-post OG image if present and fall back to the homepage OG image otherwise.

---

# Files that do not need changes right now

No change needed:
- `CNAME`
- `.github/workflows/collect.yml`
- `data/posts-index.json` for the initial rollout

The current `posts-index.json` schema is sufficient for the first version because it already provides:
- `title`
- `date`
- `tags`
- `excerpt`
- `file`

You can extend it later if you want richer post metadata.

---

# Optional future enhancements

These are useful, but not required for the first rollout:

1. Extend `data/posts-index.json` with:
   - `updated`
   - `slug`
   - `canonical_url`
   - `og_image`
   - `malware_families`
   - `threat_actors`
   - `ioc_count`

2. Create `data/site.json` to centralize defaults.

3. Generate actor pages as static HTML too.

4. Add a custom `404.html`.

5. Add an RSS icon/link in the visible UI.

---

# Validation checklist after implementation

## Homepage
- Open `https://llm-threatintel.com/`
- Confirm page title is updated
- Confirm page source contains canonical, OG, Twitter, JSON-LD, RSS link, manifest link

## Generated files
- Confirm these exist after deployment:
  - `https://llm-threatintel.com/robots.txt`
  - `https://llm-threatintel.com/sitemap.xml`
  - `https://llm-threatintel.com/rss.xml`

## Static post pages
- Open one generated page directly, for example:
  - `https://llm-threatintel.com/posts/2026-04-02-mcafee-vibe-coded-cryptominer-campaign-winupdatehelper.html`
- Confirm it renders properly
- Confirm page source has post-specific title, description, canonical, OG tags, JSON-LD

## LinkedIn / social preview testing
Use a share debugger or equivalent and confirm:
- correct title
- correct description
- correct image
- correct canonical URL

## GitHub Actions
- Confirm `Deploy to GitHub Pages` runs successfully
- Confirm `python scripts/build_meta.py` generates output without errors

---

# Risk / impact summary

## Low risk
- `index.html` head metadata
- `robots.txt`
- `site.webmanifest`
- OG image asset
- deploy-time generation of sitemap/RSS/static post pages

## Medium-low risk
- `js/app.js` runtime metadata updates
  - safe, but touches the SPA routing logic
  - still optional because the static post generation is the main fix

---

# Bottom line

If you only do three things, do these:
1. update `index.html` head
2. add `robots.txt`
3. add `scripts/build_meta.py` and wire it into `deploy.yml`

That gives you the biggest improvement in SEO and social sharing while keeping the site’s design and current app behavior intact.
