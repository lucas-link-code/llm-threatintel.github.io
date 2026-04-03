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
            def strip_number(line):
                return render_inline(re.sub(r'^\d+\.\s+', '', line).strip())
            items = "".join(f"<li>{strip_number(line)}</li>" for line in lines)
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
