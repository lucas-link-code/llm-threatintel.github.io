/* ============================================================
   LLM ThreatIntel — Core Application JavaScript
   Routing, content loading, rendering, IOC feeds, modals
   ============================================================ */

const App = {
  postsIndex: null,
  actorsData: null,
  iocsData: null,
  blogIndex: null,
  currentFilter: "all",
  homeTagOrder: [
    "malicious-tool",
    "supply-chain",
    "malware",
    "shadow-ai",
    "llmjacking",
    "nation-state",
    "apt",
    "phishing",
    "model-poisoning",
    "prompt-injection",
    "mcp-security",
  ],
  actorFilter: "all",
  actorSearch: "",
  selectedActorId: null,
  lastFocusedActorTrigger: null,
  cleanupHomeFilterBar: null,
  scrollTopButtonHandler: null,
  scrollTopButtonBound: false,
  feedSearchTerm: "",
  feedSearchIndex: {},
  feedSearchIndexReady: false,
  feedSearchIndexBuilding: false,
  feedSearchDebounce: null,
  feedIndexHideTimer: null,
  lastFocusedSearchTrigger: null,
  iocSearch: "",
  iocTypeFilter: "all",
  iocStatusFilter: "active",
  iocCampaignFilter: "all",
  iocSourceFilter: "all",
  iocSort: "newest",
  trendReportWindow: "all-time",
  metaDefaults: {
    siteName: "LLM ThreatIntel",
    siteUrl: "https://llm-threatintel.com",
    description:
      "Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption.",
    image: "https://llm-threatintel.com/assets/og/llm-threatintel-home.png",
  },

  async init() {
    await this.loadData();
    this.setupNav();
    this.updateBlogNewBadges();
    this.setupSearchControls();
    this.buildFeedSearchIndex();
    this.initScrollTopButton();
    this.lastRoutedHash = null;
    this.route();
    window.addEventListener("hashchange", () => {
      const currentHash = window.location.hash || "#home";
      if (currentHash === this.lastRoutedHash) return;
      this.route();
    });
    window.addEventListener("popstate", () => {
      const currentHash = window.location.hash || "#home";
      if (currentHash !== this.lastRoutedHash) {
        this.route();
      }
    });
  },

  async loadData() {
    try {
      const [posts, actors, iocs, blog] = await Promise.all([
        fetch("data/posts-index.json").then((r) => r.json()),
        fetch("data/actors.json").then((r) => r.json()),
        fetch("data/iocs.json").then((r) => r.json()),
        fetch("data/blog-index.json")
          .then((r) => r.json())
          .catch(() => ({ posts: [] })),
      ]);
      this.postsIndex = posts;
      this.actorsData = actors;
      this.iocsData = iocs;
      this.blogIndex = blog;
    } catch (e) {
      console.error("Failed to load data:", e);
    }
  },

  setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const logo = document.querySelector(".site-logo");
    if (toggle && nav) {
      toggle.addEventListener("click", () => nav.classList.toggle("open"));
    }
    document.querySelectorAll(".site-nav a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("open"));
    });
    if (logo) {
      logo.addEventListener("click", (e) => {
        nav?.classList.remove("open");
        const { page } = this.parseHash(window.location.hash);
        if (page === "home" && window.location.hash === "#home") {
          e.preventDefault();
          this.scrollToTop();
        }
      });
    }
  },

  getRecentBlogPost(days = 14) {
    const posts = this.blogIndex?.posts;
    if (!Array.isArray(posts) || posts.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowMs = days * 24 * 60 * 60 * 1000;

    return posts.reduce((newest, post) => {
      if (!post?.date || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return newest;
      const postDate = new Date(`${post.date}T00:00:00`);
      if (Number.isNaN(postDate.getTime()) || postDate > today) return newest;
      if (today - postDate > windowMs) return newest;
      if (!newest || postDate > newest.date) return { date: postDate, post };
      return newest;
    }, null);
  },

  updateBlogNewBadges() {
    const recentPost = this.getRecentBlogPost();
    const showBadge = Boolean(recentPost);
    document.querySelectorAll(".new-badge").forEach((badge) => {
      badge.hidden = !showBadge;
    });

    const toggle = document.querySelector(".nav-toggle");
    if (toggle) {
      const label = showBadge
        ? "Toggle navigation, new blog posts available"
        : "Toggle navigation";
      toggle.setAttribute("aria-label", label);
    }
  },

  upsertMeta(attrName, attrValue, content) {
    let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  },

  upsertLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  },

  setRouteMeta({ title, description, url, type = "website", image = null }) {
    const finalTitle =
      title || `${this.metaDefaults.siteName} | GenAI Threat Intelligence`;
    const finalDescription = description || this.metaDefaults.description;
    const finalUrl = url || `${this.metaDefaults.siteUrl}/`;
    const finalImage = image || this.metaDefaults.image;

    document.title = finalTitle;
    this.upsertMeta("name", "description", finalDescription);
    this.upsertMeta("property", "og:title", finalTitle);
    this.upsertMeta("property", "og:description", finalDescription);
    this.upsertMeta("property", "og:url", finalUrl);
    this.upsertMeta("property", "og:type", type);
    this.upsertMeta("property", "og:image", finalImage);
    this.upsertMeta("name", "twitter:card", "summary_large_image");
    this.upsertMeta("name", "twitter:title", finalTitle);
    this.upsertMeta("name", "twitter:description", finalDescription);
    this.upsertMeta("name", "twitter:image", finalImage);
    this.upsertLink("canonical", finalUrl);
  },

  parseHash(hash) {
    const raw = (hash || "#home").slice(1);
    const qIdx = raw.indexOf("?");
    const pathPart = qIdx === -1 ? raw : raw.substring(0, qIdx);
    const paramStr = qIdx === -1 ? "" : raw.substring(qIdx + 1);
    const [page, ...pathParams] = pathPart.split("/");
    const queryParams = new URLSearchParams(paramStr);
    return { page: page || "home", pathParams, queryParams };
  },

  buildHash(page, pathParams, queryParams) {
    let h = "#" + page;
    if (pathParams && pathParams.length) h += "/" + pathParams.join("/");
    if (queryParams) {
      const str = queryParams.toString();
      if (str) h += "?" + str;
    }
    return h;
  },

  updateHashParams(params, { push = true } = {}) {
    const { page, pathParams } = this.parseHash(window.location.hash);
    const newHash = this.buildHash(page, pathParams, params);
    if (window.location.hash === newHash) return;
    this.lastRoutedHash = newHash;
    if (push) {
      history.pushState(null, "", newHash);
    } else {
      history.replaceState(null, "", newHash);
    }
  },

  route() {
    this.lastRoutedHash = window.location.hash || "#home";
    const {
      page,
      pathParams: params,
      queryParams,
    } = this.parseHash(window.location.hash);

    this.cleanupHomeFilterBar?.();
    this.cleanupHomeFilterBar = null;

    document.querySelectorAll(".site-nav a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + page);
    });

    const content = document.getElementById("app-content");

    this.applyUrlParams(page, queryParams);

    switch (page) {
      case "home":
        this.setRouteMeta({
          title:
            "LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI",
          description: this.metaDefaults.description,
          url: `${this.metaDefaults.siteUrl}/`,
        });
        this.renderHome(content);
        break;
      case "post":
        this.renderPost(content, params.join("/"));
        break;
      case "brief":
        this.setRouteMeta({
          title: "Executive Brief | LLM ThreatIntel",
          description:
            "Concise executive-level summary generated from the current LLM ThreatIntel reports, threat actors, and IOCs.",
          url: `${this.metaDefaults.siteUrl}/#brief`,
        });
        this.renderBrief(content);
        break;
      case "trends":
        this.setRouteMeta({
          title: "Trends Dashboard | LLM ThreatIntel",
          description:
            "Current trends across LLM ThreatIntel reports, threat actors, and IOCs, with analyst pivots into reports, actors, and indicators.",
          url: `${this.metaDefaults.siteUrl}/#trends`,
        });
        this.renderTrends(content);
        break;
      case "actors":
        this.setRouteMeta({
          title: "Threat Actor Tracker | LLM ThreatIntel",
          description:
            "Searchable tracker of malicious LLM tools, threat actors, malware families, and campaigns in the GenAI and LLM threat landscape.",
          url: `${this.metaDefaults.siteUrl}/#actors`,
        });
        this.renderActors(content);
        break;
      case "ioc-feed":
        this.setRouteMeta({
          title: "IOC Feed | LLM ThreatIntel",
          description:
            "Copy-paste ready IOC feed with defanged indicators, Splunk/LogScale OR format, and comma-separated quoted formats.",
          url: `${this.metaDefaults.siteUrl}/#ioc-feed`,
        });
        this.renderIOCFeed(content);
        break;
      case "blog":
        if (params.length > 0) {
          this.renderBlogPost(content, params.join("/"));
        } else {
          this.setRouteMeta({
            title: "Blog | LLM ThreatIntel",
            description:
              "Analysis, commentary, and research notes on the GenAI threat landscape.",
            url: `${this.metaDefaults.siteUrl}/#blog`,
          });
          this.renderBlog(content);
        }
        break;
      case "about":
        this.setRouteMeta({
          title: "About | LLM ThreatIntel",
          description: this.metaDefaults.description,
          url: `${this.metaDefaults.siteUrl}/#about`,
        });
        this.renderAbout(content);
        break;
      default:
        this.setRouteMeta({
          title:
            "LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI",
          description: this.metaDefaults.description,
          url: `${this.metaDefaults.siteUrl}/`,
        });
        this.renderHome(content);
    }
    window.scrollTo(0, 0);
    this.scrollTopButtonHandler?.();
  },

  applyUrlParams(page, queryParams) {
    if (page === "home") {
      this.currentFilter = queryParams.get("tag") || "all";
      this.feedSearchTerm = queryParams.get("q") || "";
      this.syncSearchInputs();
    } else if (page === "ioc-feed") {
      this.iocTypeFilter = queryParams.get("type") || "all";
      this.iocStatusFilter = queryParams.get("status") || "active";
      this.iocCampaignFilter = queryParams.get("campaign") || "all";
      this.iocSourceFilter = queryParams.get("source") || "all";
      this.iocSearch = queryParams.get("q") || "";
    } else if (page === "actors") {
      this.actorSearch = queryParams.get("q") || "";
      this.actorFilter = queryParams.get("filter") || "all";
    } else if (page === "trends") {
      const w = queryParams.get("window");
      if (w) this.trendReportWindow = w;
    }
  },

  initScrollTopButton() {
    const btn = document.getElementById("scroll-top-btn");
    if (!btn || this.scrollTopButtonBound) return;

    let rafScheduled = false;
    let lastShown = false;

    const toggleVisibility = () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow === lastShown) return;
      lastShown = shouldShow;
      btn.classList.toggle("visible", shouldShow);
      btn.setAttribute("aria-hidden", shouldShow ? "false" : "true");
      btn.tabIndex = shouldShow ? 0 : -1;
    };

    const handleScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        toggleVisibility();
      });
    };

    btn.addEventListener("click", () => this.scrollToTop());

    window.addEventListener("scroll", handleScroll, { passive: true });

    this.scrollTopButtonHandler = toggleVisibility;
    this.scrollTopButtonBound = true;
    toggleVisibility();
  },

  scrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    this.scrollTopButtonHandler?.();
  },

  // ---- DEFANGING ----
  defangDomain(d) {
    if (typeof d !== "string") return d;
    if (d.includes("[.]")) return d;
    const lastDot = d.lastIndexOf(".");
    if (lastDot === -1) return d;
    return d.substring(0, lastDot) + "[.]" + d.substring(lastDot + 1);
  },

  defangIP(ip) {
    if (typeof ip !== "string") return ip;
    if (ip.includes("[.]")) return ip;
    const lastDot = ip.lastIndexOf(".");
    if (lastDot === -1) return ip;
    return ip.substring(0, lastDot) + "[.]" + ip.substring(lastDot + 1);
  },

  defangURL(url) {
    if (typeof url !== "string") return url;
    if (url.includes("[.]")) return url;
    const protoMatch = url.match(/^(https?):\/\/([^/]+)(.*)$/i);
    if (protoMatch) {
      const proto = protoMatch[1].toLowerCase() === "https" ? "hxxps" : "hxxp";
      return `${proto}://${this.defangDomain(protoMatch[2])}${protoMatch[3] || ""}`;
    }
    const slashIdx = url.indexOf("/");
    if (slashIdx === -1) return this.defangDomain(url);
    const domain = url.substring(0, slashIdx);
    const path = url.substring(slashIdx);
    return this.defangDomain(domain) + path;
  },

  defangIOC(ioc) {
    if (ioc.type === "domain") return this.defangDomain(ioc.value);
    if (ioc.type === "ip") return this.defangIP(ioc.value);
    if (ioc.type === "url_path") return this.defangURL(ioc.value);
    return ioc.value;
  },

  isHashType(t) {
    return t === "sha256" || t === "sha1" || t === "md5" || t === "hash";
  },

  // ---- IOC ENRICHMENT + AGE ----
  getEnrichmentLinks(ioc) {
    const raw = this.getIOCValue(ioc);
    if (!raw) return [];
    const bucket = this.getIOCTypeBucket(ioc);
    const enc = encodeURIComponent(raw);
    const links = [];

    if (bucket === "domain") {
      links.push({
        label: "VirusTotal",
        url: `https://www.virustotal.com/gui/domain/${enc}`,
      });
      links.push({
        label: "urlscan.io",
        url: `https://urlscan.io/search/#domain:${enc}`,
      });
      links.push({
        label: "AbuseIPDB",
        url: `https://www.abuseipdb.com/check/${enc}`,
      });
    } else if (bucket === "ip") {
      links.push({
        label: "VirusTotal",
        url: `https://www.virustotal.com/gui/ip-address/${enc}`,
      });
      links.push({
        label: "AbuseIPDB",
        url: `https://www.abuseipdb.com/check/${enc}`,
      });
      links.push({ label: "Shodan", url: `https://www.shodan.io/host/${enc}` });
    } else if (bucket === "hash") {
      const hashType = String(ioc?.type || "").toLowerCase();
      links.push({
        label: "VirusTotal",
        url: `https://www.virustotal.com/gui/file/${enc}`,
      });
      if (hashType === "sha256") {
        links.push({
          label: "MalwareBazaar",
          url: `https://bazaar.abuse.ch/browse.php?search=sha256:${enc}`,
        });
      } else if (hashType === "md5") {
        links.push({
          label: "MalwareBazaar",
          url: `https://bazaar.abuse.ch/browse.php?search=md5:${enc}`,
        });
      } else {
        links.push({
          label: "MalwareBazaar",
          url: `https://bazaar.abuse.ch/browse.php?search=sha256:${enc}`,
        });
      }
      links.push({
        label: "Hybrid Analysis",
        url: `https://www.hybrid-analysis.com/search?query=${enc}`,
      });
    } else if (bucket === "url_path") {
      links.push({
        label: "urlscan.io",
        url: `https://urlscan.io/search/#page.url:${enc}`,
      });
      links.push({
        label: "VirusTotal",
        url: `https://www.virustotal.com/gui/search/${enc}`,
      });
    } else if (bucket === "package") {
      const pkgVal = raw;
      if (pkgVal.startsWith("npm:")) {
        const name = pkgVal.replace(/^npm:/, "").replace(/@[^@/]+$/, "");
        const nameEnc = encodeURIComponent(name);
        links.push({
          label: "npm",
          url: `https://www.npmjs.com/package/${nameEnc}`,
        });
        links.push({
          label: "Socket",
          url: `https://socket.dev/npm/package/${nameEnc}`,
        });
        links.push({
          label: "Snyk",
          url: `https://security.snyk.io/package/npm/${nameEnc}`,
        });
      } else if (pkgVal.startsWith("pypi:")) {
        const name = pkgVal.replace(/^pypi:/, "").replace(/@[^@/]+$/, "");
        const nameEnc = encodeURIComponent(name);
        links.push({
          label: "PyPI",
          url: `https://pypi.org/project/${nameEnc}/`,
        });
        links.push({
          label: "Socket",
          url: `https://socket.dev/pypi/package/${nameEnc}`,
        });
        links.push({
          label: "Snyk",
          url: `https://security.snyk.io/package/pip/${nameEnc}`,
        });
      } else {
        links.push({
          label: "Socket",
          url: `https://socket.dev/npm/package/${enc}`,
        });
        links.push({
          label: "Snyk",
          url: `https://security.snyk.io/package/npm/${enc}`,
        });
      }
    } else {
      links.push({
        label: "VirusTotal",
        url: `https://www.virustotal.com/gui/search/${enc}`,
      });
    }
    return links;
  },

  renderEnrichmentLinks(ioc) {
    const links = this.getEnrichmentLinks(ioc);
    if (!links.length) return "";
    return `<span class="ioc-enrichment">${links
      .map(
        (l) =>
          `<a href="${this.escapeAttr(l.url)}" target="_blank" rel="noopener" class="ioc-enrich-link" aria-label="Look up IOC in ${this.escapeAttr(l.label)}" title="${this.escapeAttr(l.label)}">${this.escapeHtml(l.label)}</a>`,
      )
      .join("")}</span>`;
  },

  getAgeBadge(ioc) {
    const firstSeen = ioc?.first_seen;
    if (!firstSeen || typeof firstSeen !== "string") return null;
    const seenDate = new Date(firstSeen + "T00:00:00Z");
    if (isNaN(seenDate.getTime())) return null;
    const now = new Date();
    const diffMs = now.getTime() - seenDate.getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days < 0) return null;
    if (days < 14) return { label: "New", cls: "age-new", days };
    if (days < 45) return { label: "Recent", cls: "age-recent", days };
    return { label: "Older", cls: "age-older", days };
  },

  renderAgeBadge(ioc) {
    const badge = this.getAgeBadge(ioc);
    if (!badge) return "";
    return `<span class="ioc-age-badge ${badge.cls}" title="First seen ${badge.days} day${badge.days === 1 ? "" : "s"} ago">${badge.label}</span>`;
  },

  // ---- COPY WITH FALLBACK ----
  copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => this.flashCopied(btn))
        .catch(() => this.fallbackCopy(text, btn));
    } else {
      this.fallbackCopy(text, btn);
    }
  },

  fallbackCopy(text, btn) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      this.flashCopied(btn);
    } catch (e) {
      if (btn) {
        btn.textContent = "Selected — Ctrl+C";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 3000);
      }
    }
    document.body.removeChild(ta);
  },

  flashCopied(btn) {
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove("copied");
    }, 2000);
  },

  copyFeedById(id, btn) {
    if (btn?.disabled) return;
    const el = document.getElementById(id);
    if (el) this.copyText(el.textContent, btn);
  },

  // ---- IOC MODAL ----
  showIOCModal(type) {
    if (!this.iocsData) return;
    const iocs = this.iocsData.iocs;
    let filtered;
    let title;

    if (type === "all") {
      filtered = iocs.filter((i) => i.status === "active");
      title = "All Active IOCs";
    } else if (type === "hash") {
      filtered = iocs.filter(
        (i) => this.isHashType(i.type) && i.status === "active",
      );
      title = "File Hash IOCs";
    } else if (type === "package") {
      filtered = iocs.filter(
        (i) => i.type === "package" && i.status === "active",
      );
      title = "Package IOCs";
    } else {
      filtered = iocs.filter((i) => i.type === type && i.status === "active");
      title =
        type === "domain"
          ? "Domain IOCs"
          : type === "url_path"
            ? "URL Path IOCs"
            : type === "ip"
              ? "IP Address IOCs"
              : "IOCs";
    }

    const defangedList = filtered.map((i) => this.defangIOC(i)).join("\n");
    const { exportable, skipped } = this.getExportableIOCs(filtered);
    const splunkList = exportable
      .map((i) => '"' + this.getIOCValue(i) + '"')
      .join(" OR ");
    const csvList = exportable
      .map((i) => this.csvEscapeValue(this.getIOCValue(i)))
      .join(", ");
    const exportWarning = skipped.length
      ? `<p class="misp-export-status ioc-export-warning" role="alert">Some indicators are not export-safe (${skipped.length} skipped from SIEM and CSV exports).</p>`
      : "";

    const mc = document.getElementById("modal-content");
    mc.innerHTML = `
      <h2 id="modal-title">${title} (${filtered.length})</h2>
      ${exportWarning}
      <div class="feed-card" style="margin-bottom:1rem">
        <h3 style="font-size:.85rem">Defanged — One Per Line</h3>
        <div class="feed-output" id="modal-defanged" style="max-height:160px">${this.escapeHtml(defangedList)}</div>
        <div class="feed-actions"><button class="btn" onclick="App.copyFeedById('modal-defanged',this)">Copy</button></div>
      </div>
      <div class="feed-card" style="margin-bottom:1rem">
        <h3 style="font-size:.85rem">Splunk / LogScale — OR Delimited</h3>
        <div class="feed-output" id="modal-splunk" style="max-height:100px">${this.escapeHtml(splunkList)}</div>
        <div class="feed-actions"><button class="btn" onclick="App.copyFeedById('modal-splunk',this)">Copy</button></div>
      </div>
      <div class="feed-card" style="margin-bottom:1rem">
        <h3 style="font-size:.85rem">Comma-Separated Quoted</h3>
        <div class="feed-output" id="modal-csv" style="max-height:100px">${this.escapeHtml(csvList)}</div>
        <div class="feed-actions"><button class="btn" onclick="App.copyFeedById('modal-csv',this)">Copy</button></div>
      </div>
      <div class="feed-card">
        <h3 style="font-size:.85rem">Detail</h3>
        <div style="overflow-x:auto">
          <table class="actor-table" style="min-width:480px">
            <thead><tr><th>Indicator</th><th>Lookup</th><th>Context</th><th>Campaign</th></tr></thead>
            <tbody>${filtered
              .map(
                (i) => `<tr>
              <td style="font-family:var(--fm);font-size:.76rem;word-break:break-all">${this.escapeHtml(this.defangIOC(i))}</td>
              <td>${this.renderEnrichmentLinks(i)}</td>
              <td style="font-size:.8rem;color:var(--t2)">${this.escapeHtml(i.context)}</td>
              <td><span class="ttp-tag">${this.escapeHtml(i.campaign)}</span></td>
            </tr>`,
              )
              .join("")}</tbody>
          </table>
        </div>
      </div>
    `;
    const overlay = document.getElementById("modal-overlay");
    overlay.querySelector(".modal").setAttribute("aria-hidden", "false");
    overlay.classList.add("open");
  },

  closeModal() {
    const overlay = document.getElementById("modal-overlay");
    const modal = overlay.querySelector(".modal");
    overlay.classList.remove("open");
    modal.classList.remove("modal--wide");
    modal.setAttribute("aria-hidden", "true");
    if (this.lastFocusedActorTrigger) {
      this.lastFocusedActorTrigger.focus();
      this.lastFocusedActorTrigger = null;
    }
  },

  buildPostMetadataBlob(post) {
    return [
      post.id,
      post.title,
      post.date,
      post.author,
      (post.tags || []).join(" "),
      post.tlp,
      post.excerpt,
      post.file,
    ]
      .filter(Boolean)
      .join(" \n ")
      .toLowerCase();
  },

  async buildFeedSearchIndex() {
    if (!this.postsIndex || this.feedSearchIndexBuilding) return;
    this.feedSearchIndexBuilding = true;
    this.feedSearchIndex = {};
    const posts = this.postsIndex.posts || [];
    posts.forEach((p) => {
      this.feedSearchIndex[p.id] = this.buildPostMetadataBlob(p);
    });

    const loaded = await this.loadPrebuiltSearchIndex();
    if (loaded) {
      this.feedSearchIndexReady = true;
      this.feedSearchIndexBuilding = false;
      this.updateIndexingIndicator("ready");
      if (document.getElementById("posts-grid")) this.filterPosts();
      return;
    }

    this.updateIndexingIndicator("building");
    await Promise.all(
      posts.map(async (p) => {
        try {
          const r = await fetch(`posts/${p.file}`);
          if (!r.ok) return;
          const md = await r.text();
          this.feedSearchIndex[p.id] += " \n " + md.toLowerCase();
        } catch (_) {
          /* keep metadata-only */
        }
      }),
    );

    this.feedSearchIndexReady = true;
    this.feedSearchIndexBuilding = false;
    this.updateIndexingIndicator("ready");
    if (document.getElementById("posts-grid")) this.filterPosts();
  },

  async loadPrebuiltSearchIndex() {
    try {
      this.updateIndexingIndicator("loading");
      const r = await fetch("data/search-index.json");
      if (!r.ok) return false;
      const data = await r.json();
      if (!data || !Array.isArray(data.posts)) return false;
      for (const entry of data.posts) {
        if (!entry.id) continue;
        const blob = [
          entry.id || "",
          entry.title || "",
          entry.date || "",
          entry.file || "",
          entry.excerpt || "",
          entry.body || "",
          (entry.tags || []).join(" "),
          (entry.cves || []).join(" "),
          (entry.actors || []).join(" "),
          (entry.iocs || []).join(" "),
        ]
          .join(" \n ")
          .toLowerCase();
        this.feedSearchIndex[entry.id] = blob;
      }
      return true;
    } catch (e) {
      console.warn(
        "search-index.json load failed, falling back to per-file indexing:",
        e.message,
      );
      return false;
    }
  },

  updateIndexingIndicator(state) {
    const el = document.getElementById("feed-index-status");
    if (!el) return;
    window.clearTimeout(this.feedIndexHideTimer);
    if (state === "loading") {
      el.textContent = "Search index loading";
      el.classList.remove("is-hidden");
      return;
    }
    if (state === "building") {
      el.textContent = "Indexing reports...";
      el.classList.remove("is-hidden");
      return;
    }
    if (state === "ready") {
      el.textContent = "Full-text search ready";
      el.classList.remove("is-hidden");
      this.feedIndexHideTimer = window.setTimeout(() => {
        el.classList.add("is-hidden");
      }, 2500);
    }
  },

  getFilteredFeedPosts() {
    const posts = this.postsIndex?.posts || [];
    const term = (this.feedSearchTerm || "").trim().toLowerCase();
    const terms = term ? term.split(/\s+/).filter(Boolean) : [];
    const filter = this.currentFilter;

    return posts.filter((p) => {
      const tagOk = filter === "all" || (p.tags || []).includes(filter);
      if (!tagOk) return false;
      if (!terms.length) return true;
      const blob = this.feedSearchIndex[p.id] || this.buildPostMetadataBlob(p);
      return terms.every((t) => blob.includes(t));
    });
  },

  setFeedSearchTerm(term, { route = true } = {}) {
    this.feedSearchTerm = term ?? "";
    this.syncSearchInputs();
    const { page } = this.parseHash(window.location.hash);
    const onHome = page === "home" || page === "";
    if (route && !onHome) {
      const p = this.buildRouteParams("home");
      window.location.hash = this.buildHash("home", [], p);
      return;
    }
    this.filterPosts();
    this.updateHashParams(this.buildRouteParams("home"), { push: false });
  },

  clearFeedSearch() {
    this.setFeedSearchTerm("", { route: false });
  },

  setFeedSearchImmediate(term) {
    window.clearTimeout(this.feedSearchDebounce);
    this.feedSearchTerm = term ?? "";
    this.syncSearchInputs();
  },

  syncSearchInputs() {
    const v = this.feedSearchTerm;
    const desk = document.getElementById("header-search-input");
    const mob = document.getElementById("mobile-search-input");
    if (desk && desk.value !== v) desk.value = v;
    if (mob && mob.value !== v) mob.value = v;
    const clear = document.querySelector(".header-search-clear");
    if (clear) clear.hidden = !v;
  },

  setupSearchControls() {
    const input = document.getElementById("header-search-input");
    const clear = document.querySelector(".header-search-clear");
    if (input) {
      input.addEventListener("input", (e) => {
        const v = e.target.value;
        window.clearTimeout(this.feedSearchDebounce);
        this.feedSearchDebounce = window.setTimeout(
          () => this.setFeedSearchTerm(v),
          240,
        );
        if (clear) clear.hidden = !v;
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          window.clearTimeout(this.feedSearchDebounce);
          this.setFeedSearchTerm(input.value);
        }
        if (e.key === "Escape" && input.value) {
          input.value = "";
          this.setFeedSearchTerm("");
        }
      });
    }
    if (clear && input) {
      clear.addEventListener("click", () => {
        input.value = "";
        this.setFeedSearchTerm("");
        input.focus();
      });
    }

    const openBtn = document.getElementById("mobile-search-btn");
    if (openBtn)
      openBtn.addEventListener("click", () => this.openSearchModal());

    document
      .getElementById("mobile-search-apply")
      ?.addEventListener("click", () => this.applyMobileSearch());
    document
      .getElementById("mobile-search-clear")
      ?.addEventListener("click", () => {
        const mob = document.getElementById("mobile-search-input");
        if (mob) mob.value = "";
        this.setFeedSearchTerm("", { route: false });
      });
    document
      .getElementById("mobile-search-close")
      ?.addEventListener("click", () => this.closeSearchModal());
    document
      .getElementById("mobile-search-input")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.applyMobileSearch();
        }
      });
  },

  openSearchModal() {
    this.lastFocusedSearchTrigger = document.activeElement;
    this.searchModalScrollY = window.scrollY || 0;
    document.body.classList.add("search-modal-open");
    const overlay = document.getElementById("search-modal-overlay");
    const input = document.getElementById("mobile-search-input");
    if (!overlay || !input) return;
    input.value = this.feedSearchTerm || "";
    const modal = overlay.querySelector(".search-modal");
    if (modal) modal.setAttribute("aria-hidden", "false");
    overlay.classList.add("open");
    window.setTimeout(() => input.focus(), 0);
  },

  closeSearchModal() {
    const overlay = document.getElementById("search-modal-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    const modal = overlay.querySelector(".search-modal");
    if (modal) modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-modal-open");
    if (typeof this.searchModalScrollY === "number") {
      window.scrollTo(0, this.searchModalScrollY);
    }
    if (
      this.lastFocusedSearchTrigger &&
      typeof this.lastFocusedSearchTrigger.focus === "function"
    ) {
      this.lastFocusedSearchTrigger.focus();
    }
    this.lastFocusedSearchTrigger = null;
  },

  applyMobileSearch() {
    const input = document.getElementById("mobile-search-input");
    const v = input ? input.value : "";
    this.closeSearchModal();
    this.setFeedSearchTerm(v);
  },

  renderFeedStatusLine(count) {
    const term = (this.feedSearchTerm || "").trim();
    const hasSearch = term.length > 0;
    const filter = this.currentFilter;
    const totalAll = this.postsIndex?.posts?.length ?? 0;

    if (!hasSearch && filter === "all") {
      return "";
    }

    let line = "";
    if (hasSearch) {
      line = `Showing ${count} reports matching "${this.escapeHtml(term)}"`;
      if (filter !== "all") {
        line += ` (${this.escapeHtml(this.formatTag(filter))})`;
      }
    } else {
      line = `Showing ${count} of ${totalAll} reports tagged ${this.escapeHtml(this.formatTag(filter))}`;
    }

    const clearBtn = hasSearch
      ? ` <button type="button" class="btn feed-status-clear-btn" onclick="App.clearFeedSearch()">Clear search</button>`
      : "";

    return `<div class="feed-status-inner">${line}${clearBtn}</div>`;
  },

  renderEmptyFeedState() {
    const term = (this.feedSearchTerm || "").trim();
    const filter = this.currentFilter;
    if (term) {
      return `
        <div class="feed-empty" role="status">
          <p>No reports matched "${this.escapeHtml(term)}". Try another keyword or <button type="button" class="btn feed-empty-clear-btn" onclick="App.clearFeedSearch()">clear the search</button>.</p>
        </div>
      `;
    }
    if (filter !== "all") {
      return `
        <div class="feed-empty" role="status">
          <p>No reports tagged ${this.escapeHtml(this.formatTag(filter))}. Pick another tag or choose All.</p>
        </div>
      `;
    }
    return '<div class="feed-empty" role="status"><p>No reports available.</p></div>';
  },

  // ---- TRENDS DASHBOARD ----
  normalizeTrendText(value) {
    const text = String(value ?? "").trim();
    return text || "Unknown";
  },

  countBy(items, keyFn) {
    const counts = new Map();
    items.forEach((item) => {
      const key = this.normalizeTrendText(keyFn(item));
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  },

  sortCounts(counts, { chronological = false } = {}) {
    const entries = [...counts.entries()].map(([key, count]) => ({
      key,
      count,
    }));
    if (chronological) {
      return entries.sort((a, b) => a.key.localeCompare(b.key));
    }
    return entries.sort(
      (a, b) => b.count - a.count || a.key.localeCompare(b.key),
    );
  },

  getCampaignSlugFromPost(post) {
    return String(post?.id || "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  },

  getPostCampaignLookup() {
    const lookup = new Map();
    (this.postsIndex?.posts || []).forEach((post) => {
      const slug = this.getCampaignSlugFromPost(post);
      if (slug) lookup.set(slug, post);
    });
    return lookup;
  },

  getPostTrendBlob(post) {
    return [
      post?.id,
      post?.title,
      post?.date,
      post?.excerpt,
      ...(post?.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  },

  escapeRegExp(value) {
    return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  trendTermMatches(blob, term) {
    const cleanTerm = String(term || "")
      .trim()
      .toLowerCase();
    if (!cleanTerm) return false;
    if (/^[a-z0-9][a-z0-9\s.-]*[a-z0-9]$/i.test(cleanTerm)) {
      return new RegExp(
        `(^|[^a-z0-9])${this.escapeRegExp(cleanTerm)}([^a-z0-9]|$)`,
        "i",
      ).test(blob);
    }
    return blob.includes(cleanTerm);
  },

  getTrendKeywordMaps() {
    return {
      platforms: {
        npm: ["npm", "node package", "package.json"],
        PyPI: ["pypi", "python package", "pip install"],
        GitHub: ["github", "github actions", "repository"],
        "VS Code / Open VSX": [
          "vscode",
          "visual studio code",
          "open vsx",
          "extension",
        ],
        MCP: ["mcp", "model context protocol"],
        Kubernetes: ["kubernetes", "k8s", "daemonset"],
        "Cloud AI APIs": [
          "openai api",
          "anthropic api",
          "gemini api",
          "bedrock",
          "azure openai",
        ],
        "AI Coding Assistants": [
          "claude code",
          "cursor",
          "windsurf",
          "copilot",
          "ai coding assistant",
        ],
        "Browser Extensions": [
          "browser extension",
          "chrome extension",
          "chromium extension",
        ],
      },
      themes: {
        "Supply Chain": [
          "supply chain",
          "trojanized",
          "package compromise",
          "dependency",
          "registry",
        ],
        "Credential Theft / LLMjacking": [
          "credential",
          "api key",
          "token",
          "secret",
          "llmjacking",
          "exfiltrat",
        ],
        "Prompt Injection": [
          "prompt injection",
          "indirect prompt",
          "context poisoning",
        ],
        "MCP / Agent Abuse": ["mcp", "agentic", "ai agent", "tool poisoning"],
        "RCE / Exploitation": [
          "rce",
          "remote code execution",
          "cve",
          "exploited",
          "vulnerability",
        ],
        "Malware / Backdoor": [
          "malware",
          "backdoor",
          "rat",
          "stealer",
          "worm",
          "dropper",
        ],
        "Nation-State / APT": [
          "apt",
          "dprk",
          "north korean",
          "nation-state",
          "russia",
          "iran",
        ],
        "Phishing / Social Engineering": [
          "phishing",
          "bec",
          "deepfake",
          "social engineering",
          "fake installer",
        ],
      },
    };
  },

  getTrendRepresentativeSearch(kind, label) {
    const maps = this.getTrendKeywordMaps();
    if (kind === "platform") return maps.platforms[label]?.[0] || label;
    if (kind === "theme") return maps.themes[label]?.[0] || label;
    return label;
  },

  getTrendPostBlobs(posts, iocs) {
    const iocsByCampaign = new Map();
    iocs.forEach((ioc) => {
      const campaign = String(ioc?.campaign || "").trim();
      if (!campaign) return;
      if (!iocsByCampaign.has(campaign)) iocsByCampaign.set(campaign, []);
      iocsByCampaign
        .get(campaign)
        .push(
          [ioc.value, ioc.context, ioc.source, ioc.type]
            .filter(Boolean)
            .join(" "),
        );
    });

    return posts.map((post) => {
      const slug = this.getCampaignSlugFromPost(post);
      const iocContext = (iocsByCampaign.get(slug) || []).join(" ");
      return {
        post,
        blob: `${this.getPostTrendBlob(post)} ${iocContext}`.toLowerCase(),
      };
    });
  },

  countKeywordMap(postBlobs, keywordMap) {
    const counts = new Map();
    Object.entries(keywordMap).forEach(([label, keywords]) => {
      let count = 0;
      postBlobs.forEach(({ blob }) => {
        if (keywords.some((keyword) => this.trendTermMatches(blob, keyword)))
          count += 1;
      });
      if (count > 0) counts.set(label, count);
    });
    return this.sortCounts(counts);
  },

  isGenericActorTrendName(name) {
    const normalized = String(name || "")
      .trim()
      .toLowerCase();
    const denylist = new Set([
      "unknown",
      "unknown threat actor",
      "unknown threat actors",
      "potential threat actors",
      "research community",
      "unknown / opportunistic",
      "unknown / multiple",
      "unknown / mass scanning infrastructure",
      "unattributed threat actors",
    ]);
    return (
      denylist.has(normalized) ||
      normalized.startsWith("unknown /") ||
      normalized.startsWith("unknown-") ||
      normalized.includes("research community") ||
      normalized.includes("potential threat actors")
    );
  },

  getActorMentionCounts(posts, actors, iocs = []) {
    const postBlobs = this.getTrendPostBlobs(posts, iocs);
    const counts = new Map();

    actors.forEach((actor) => {
      const names = [...new Set(actor?.names || [])]
        .map((name) => String(name || "").trim())
        .filter((name) => name && !this.isGenericActorTrendName(name));
      if (!names.length) return;

      let count = 0;
      postBlobs.forEach(({ blob }) => {
        if (names.some((name) => this.trendTermMatches(blob, name))) count += 1;
      });
      if (count > 0) counts.set(names[0], count);
    });

    return this.sortCounts(counts).slice(0, 10);
  },

  getReportWindowContext(posts) {
    const validMonths = posts
      .map((post) => String(post.date || "").match(/^\d{4}-\d{2}/)?.[0])
      .filter(Boolean);
    const latestReportMonth = validMonths.length
      ? [...validMonths].sort().at(-1)
      : "Unknown";
    const monthIndex = (month) => {
      const match = String(month || "").match(/^(\d{4})-(\d{2})$/);
      return match ? Number(match[1]) * 12 + Number(match[2]) : null;
    };
    const latestMonthIndex = monthIndex(latestReportMonth);
    const latestMonthPosts = posts.filter(
      (post) => String(post.date || "").slice(0, 7) === latestReportMonth,
    );
    const lastSixMonthPosts =
      latestMonthIndex === null
        ? []
        : posts.filter((post) => {
            const idx = monthIndex(String(post.date || "").slice(0, 7));
            return (
              idx !== null &&
              idx >= latestMonthIndex - 5 &&
              idx <= latestMonthIndex
            );
          });

    return {
      latestReportMonth,
      windows: {
        "latest-month": {
          key: "latest-month",
          label: "Latest Month",
          detail: latestReportMonth,
          posts: latestMonthPosts,
        },
        "last-six-months": {
          key: "last-six-months",
          label: "Last 6 Months",
          detail: "Rolling from latest report month",
          posts: lastSixMonthPosts,
        },
        "all-time": {
          key: "all-time",
          label: "All Time",
          detail: "Tracked reports",
          posts,
        },
      },
    };
  },

  getTrendWindowDescription(data) {
    const selected = data?.reportWindows?.selected;
    if (!selected) return "current reports";
    if (selected.key === "latest-month")
      return `reports from ${selected.detail}`;
    if (selected.key === "last-six-months")
      return "reports from the latest six-month window";
    return "all tracked reports";
  },

  getTrendsData() {
    const posts = this.postsIndex?.posts || [];
    const actors = this.actorsData?.entries || [];
    const iocs = this.iocsData?.iocs || [];
    const keywordMaps = this.getTrendKeywordMaps();
    const windowContext = this.getReportWindowContext(posts);
    const selectedWindowKey = windowContext.windows[this.trendReportWindow]
      ? this.trendReportWindow
      : "all-time";
    this.trendReportWindow = selectedWindowKey;
    const selectedWindow = windowContext.windows[selectedWindowKey];
    const windowPosts = selectedWindow.posts;
    const postBlobs = this.getTrendPostBlobs(windowPosts, iocs);

    return {
      totals: {
        reports: posts.length,
        activeIocs: iocs.filter((ioc) => ioc.status === "active").length,
        totalIocs: iocs.length,
        activeActors: actors.filter((actor) => actor.status === "active")
          .length,
      },
      reportWindows: {
        selected: {
          key: selectedWindow.key,
          label: selectedWindow.label,
          detail: selectedWindow.detail,
          count: selectedWindow.posts.length,
        },
        latestMonth: windowContext.latestReportMonth,
        latestMonthReports: windowContext.windows["latest-month"].posts.length,
        lastSixMonthReports:
          windowContext.windows["last-six-months"].posts.length,
        totalReports: posts.length,
      },
      reportsByTag: this.sortCounts(
        this.countBy(
          windowPosts.flatMap((post) => post.tags || []),
          (tag) => tag,
        ),
      ),
      reportsByMonth: this.sortCounts(
        this.countBy(
          windowPosts.filter((post) =>
            /^\d{4}-\d{2}/.test(String(post.date || "")),
          ),
          (post) => String(post.date).slice(0, 7),
        ),
        { chronological: true },
      ),
      iocTypes: this.sortCounts(this.countBy(iocs, (ioc) => ioc.type)),
      iocStatuses: this.sortCounts(this.countBy(iocs, (ioc) => ioc.status)),
      iocSources: this.sortCounts(
        this.countBy(iocs, (ioc) => ioc.source),
      ).slice(0, 10),
      actorTypes: this.sortCounts(this.countBy(actors, (actor) => actor.type)),
      actorStatuses: this.sortCounts(
        this.countBy(actors, (actor) => actor.status),
      ),
      actorMentions: this.getActorMentionCounts(windowPosts, actors, iocs),
      affectedPlatforms: this.countKeywordMap(postBlobs, keywordMaps.platforms),
      attackThemes: this.countKeywordMap(postBlobs, keywordMaps.themes),
    };
  },

  renderTrendStatCards(data) {
    const cards = [
      [
        "total-reports",
        data.totals.reports,
        "Total Reports",
        "Open Intel Feed",
      ],
      [
        "active-iocs",
        data.totals.activeIocs,
        "Active IOCs",
        "Open active IOCs",
      ],
      ["total-iocs", data.totals.totalIocs, "Total IOCs", "Open all IOCs"],
      [
        "active-actors",
        data.totals.activeActors,
        "Active Actors",
        "Open Threat Actors",
      ],
    ];

    return `
      <div class="stats-row trends-stat-row">
        ${cards
          .map(
            ([key, value, label, ariaLabel]) => `
          <button
            type="button"
            class="stat-card trend-stat-card stat-card-button"
            data-trend-stat="${this.escapeAttr(key)}"
            aria-label="${this.escapeAttr(ariaLabel)}"
            onclick="${this.escapeAttr(`App.openTrendStatPivot('${key}')`)}"
          >
            <div class="stat-value">${this.escapeHtml(value)}</div>
            <div class="stat-label">${this.escapeHtml(label)}</div>
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  },

  renderTrendReportWindows(data) {
    const windows = [
      [
        "latest-month",
        data.reportWindows.latestMonthReports,
        "Latest Month",
        data.reportWindows.latestMonth,
      ],
      [
        "last-six-months",
        data.reportWindows.lastSixMonthReports,
        "Last 6 Months",
        "Rolling from latest report month",
      ],
      [
        "all-time",
        data.reportWindows.totalReports,
        "All Time",
        "Tracked reports",
      ],
    ];

    return `
      <div class="trend-period-row" aria-label="Report time windows">
        ${windows
          .map(
            ([key, value, label, detail]) => `
          <button
            type="button"
            class="trend-period-card ${data.reportWindows.selected.key === key ? "active" : ""}"
            data-trend-period="${this.escapeAttr(key)}"
            aria-pressed="${data.reportWindows.selected.key === key ? "true" : "false"}"
            aria-label="Show Trends report charts for ${this.escapeAttr(label)}"
            onclick="${this.escapeAttr(`App.setTrendReportWindow('${key}')`)}"
          >
            <span class="trend-period-value">${this.escapeHtml(value)}</span>
            <span class="trend-period-label">${this.escapeHtml(label)}</span>
            <span class="trend-period-detail">${this.escapeHtml(detail)}</span>
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  },

  getIOCTypePivotValue(type) {
    if (["domain", "url_path", "ip", "package", "hash"].includes(type))
      return type;
    return null;
  },

  trendPivotOnClick(type, value) {
    return this.escapeAttr(
      `App.openTrendPivot(${JSON.stringify(type)},${JSON.stringify(value)})`,
    );
  },

  briefPivotOnClick(type, value) {
    return this.escapeAttr(
      `App.openBriefPivot(${JSON.stringify(type)},${JSON.stringify(value)})`,
    );
  },

  renderTrendBarList({
    title,
    description,
    section,
    items,
    labeler = (value) => value,
    pivotType = null,
    pivotValue = (value) => value,
    pivotHandler = "trend",
  }) {
    const max = Math.max(...items.map((item) => item.count), 1);
    const rows = items.length
      ? items
          .map((item) => {
            const width = Math.max(4, Math.round((item.count / max) * 100));
            const label = labeler(item.key);
            const targetValue = pivotType ? pivotValue(item.key) : null;
            const onClick =
              pivotHandler === "brief"
                ? this.briefPivotOnClick(pivotType, targetValue)
                : this.trendPivotOnClick(pivotType, targetValue);
            const rowInner = `
          <div class="trend-bar-meta">
            <span class="trend-bar-label">${this.escapeHtml(label)}</span>
            <span class="trend-bar-count">${this.escapeHtml(item.count)}</span>
          </div>
          <div class="trend-bar-track" aria-hidden="true">
            <span class="trend-bar-fill" style="width:${width}%"></span>
          </div>
        `;
            if (!pivotType || !targetValue) {
              return `
          <div class="trend-bar-row" data-trend-key="${this.escapeAttr(item.key)}" data-trend-count="${this.escapeAttr(item.count)}">
            ${rowInner}
          </div>
          `;
            }
            return `
          <button
            type="button"
            class="trend-bar-row trend-bar-button"
            data-trend-key="${this.escapeAttr(item.key)}"
            data-trend-count="${this.escapeAttr(item.count)}"
            data-trend-pivot="${this.escapeAttr(pivotType)}"
            data-trend-pivot-value="${this.escapeAttr(targetValue)}"
            aria-label="Open ${this.escapeAttr(label)} trend pivot"
            onclick="${onClick}"
          >
            ${rowInner}
          </button>
        `;
          })
          .join("")
      : '<p class="feed-description">No data available.</p>';

    return `
      <section class="trend-card" data-trend-section="${this.escapeAttr(section)}">
        <div class="trend-card-header">
          <h2>${this.escapeHtml(title)}</h2>
          ${description ? `<p>${this.escapeHtml(description)}</p>` : ""}
        </div>
        <div class="trend-bar-list">
          ${rows}
        </div>
      </section>
    `;
  },

  renderRouteWithCurrentState(route) {
    const content = document.getElementById("app-content");
    if (!content) return;
    if (route === "home") {
      this.renderHome(content);
    } else if (route === "ioc-feed") {
      this.renderIOCFeed(content);
    } else if (route === "actors") {
      this.renderActors(content);
    } else if (route === "trends") {
      this.renderTrends(content);
    } else if (route === "brief") {
      this.renderBrief(content);
    }
    window.scrollTo(0, 0);
    this.scrollTopButtonHandler?.();
  },

  navigateOrRender(route, params) {
    const qp = params || this.buildRouteParams(route);
    const target = this.buildHash(route, [], qp);
    if (window.location.hash === target) {
      this.renderRouteWithCurrentState(route);
    } else {
      window.location.hash = target;
    }
  },

  buildRouteParams(route) {
    const p = new URLSearchParams();
    if (route === "home") {
      if (this.currentFilter && this.currentFilter !== "all")
        p.set("tag", this.currentFilter);
      if (this.feedSearchTerm) p.set("q", this.feedSearchTerm);
    } else if (route === "ioc-feed") {
      if (this.iocTypeFilter && this.iocTypeFilter !== "all")
        p.set("type", this.iocTypeFilter);
      if (this.iocStatusFilter && this.iocStatusFilter !== "active")
        p.set("status", this.iocStatusFilter);
      if (this.iocCampaignFilter && this.iocCampaignFilter !== "all")
        p.set("campaign", this.iocCampaignFilter);
      if (this.iocSourceFilter && this.iocSourceFilter !== "all")
        p.set("source", this.iocSourceFilter);
      if (this.iocSearch) p.set("q", this.iocSearch);
    } else if (route === "actors") {
      if (this.actorSearch) p.set("q", this.actorSearch);
    } else if (route === "trends") {
      if (this.trendReportWindow && this.trendReportWindow !== "all-time")
        p.set("window", this.trendReportWindow);
    }
    return p;
  },

  setTrendReportWindow(windowKey) {
    const allowed = new Set(["latest-month", "last-six-months", "all-time"]);
    if (!allowed.has(windowKey)) return;
    this.trendReportWindow = windowKey;
    this.navigateOrRender("trends");
  },

  openTrendStatPivot(key) {
    switch (key) {
      case "total-reports":
        this.currentFilter = "all";
        this.setFeedSearchImmediate("");
        this.navigateOrRender("home");
        break;
      case "active-iocs":
        this.iocSearch = "";
        this.iocTypeFilter = "all";
        this.iocStatusFilter = "active";
        this.iocCampaignFilter = "all";
        this.iocSourceFilter = "all";
        this.iocSort = "newest";
        this.navigateOrRender("ioc-feed");
        break;
      case "total-iocs":
        this.iocSearch = "";
        this.iocTypeFilter = "all";
        this.iocStatusFilter = "all";
        this.iocCampaignFilter = "all";
        this.iocSourceFilter = "all";
        this.iocSort = "newest";
        this.navigateOrRender("ioc-feed");
        break;
      case "active-actors":
        this.actorSearch = "";
        this.actorFilter = "all";
        this.navigateOrRender("actors");
        break;
      default:
        break;
    }
  },

  openTrendPivot(type, value) {
    const cleanValue = String(value || "").trim();
    if (!cleanValue) return;

    switch (type) {
      case "report-tag":
        this.setFeedSearchImmediate("");
        this.currentFilter = cleanValue;
        this.navigateOrRender("home");
        break;
      case "report-month":
      case "platform":
      case "theme":
        this.currentFilter = "all";
        this.setFeedSearchImmediate(cleanValue);
        this.navigateOrRender("home");
        break;
      case "ioc-type":
        this.iocSearch = "";
        this.iocTypeFilter = cleanValue;
        this.iocStatusFilter = "all";
        this.iocCampaignFilter = "all";
        this.iocSourceFilter = "all";
        this.navigateOrRender("ioc-feed");
        break;
      case "ioc-source":
        this.iocSearch = "";
        this.iocTypeFilter = "all";
        this.iocStatusFilter = "all";
        this.iocCampaignFilter = "all";
        this.iocSourceFilter = cleanValue;
        this.navigateOrRender("ioc-feed");
        break;
      case "ioc-status":
        this.iocSearch = "";
        this.iocTypeFilter = "all";
        this.iocStatusFilter = cleanValue;
        this.iocCampaignFilter = "all";
        this.iocSourceFilter = "all";
        this.navigateOrRender("ioc-feed");
        break;
      case "actor-search":
        this.actorSearch = cleanValue;
        this.actorFilter = "all";
        this.navigateOrRender("actors");
        break;
      default:
        break;
    }
  },

  // ---- EXECUTIVE BRIEF ----
  getBriefThemeKeywords() {
    return {
      "Supply Chain": [
        "supply chain",
        "npm",
        "pypi",
        "package",
        "dependency",
        "registry",
      ],
      "Credential Theft / LLMjacking": [
        "credential",
        "token",
        "api key",
        "secret",
        "llmjacking",
        "unauthorized ai access",
      ],
      "MCP / Agent Abuse": [
        "mcp",
        "model context protocol",
        "tool poisoning",
        "agent abuse",
      ],
      "Prompt Injection": [
        "prompt injection",
        "indirect prompt injection",
        "jailbreak",
      ],
      "AI Coding Tools": [
        "cursor",
        "claude code",
        "copilot",
        "coding agent",
        "ai coding",
      ],
      "Nation-State / APT": [
        "nation-state",
        "dprk",
        "russia",
        "apt",
        "state-sponsored",
      ],
      "Phishing / Social Engineering": [
        "phishing",
        "clickfix",
        "fake captcha",
        "social engineering",
      ],
    };
  },

  getRecentPosts(days = 30) {
    const posts = this.postsIndex?.posts || [];
    const datedPosts = posts
      .map((post) => ({
        post,
        time: Date.parse(`${post?.date || ""}T00:00:00Z`),
      }))
      .filter((item) => Number.isFinite(item.time));
    if (!datedPosts.length) return [];

    const latestTime = Math.max(...datedPosts.map((item) => item.time));
    const startTime = latestTime - (days - 1) * 24 * 60 * 60 * 1000;
    return datedPosts
      .filter((item) => item.time >= startTime && item.time <= latestTime)
      .map((item) => item.post);
  },

  getBriefThemeMix(posts) {
    const iocs = this.iocsData?.iocs || [];
    return this.countKeywordMap(
      this.getTrendPostBlobs(posts || [], iocs),
      this.getBriefThemeKeywords(),
    );
  },

  getLatestDateLabel(...values) {
    const dates = values
      .map((value) => String(value || "").match(/^\d{4}-\d{2}-\d{2}/)?.[0])
      .filter(Boolean)
      .sort();
    return dates.at(-1) || "Unknown";
  },

  getBriefThemeSearchTerm(theme) {
    const representativeTerms = {
      "Supply Chain": "supply chain",
      "Credential Theft / LLMjacking": "api key",
      "MCP / Agent Abuse": "mcp",
      "Prompt Injection": "prompt injection",
      "AI Coding Tools": "ai coding",
      "Nation-State / APT": "apt",
      "Phishing / Social Engineering": "phishing",
    };
    return representativeTerms[theme] || theme;
  },

  getBriefPosture(data) {
    const recentReports = data?.totals?.recentReports || 0;
    const activeIocs = data?.totals?.activeIocs || 0;
    const activeActors = data?.totals?.activeActors || 0;
    let label = "Stable";

    if (recentReports >= 5 && activeIocs >= 20) {
      label = "Elevated";
    } else if (recentReports >= 2 || activeIocs >= 10) {
      label = "Active";
    } else if (activeActors > 0 || activeIocs > 0) {
      label = "Watch";
    }

    return {
      label,
      rationale:
        "Posture is based on current reporting volume, recent activity, and active IOC count.",
      caveat:
        "This is a tracking-data posture indicator, not an enterprise risk rating.",
    };
  },

  getBriefData() {
    const posts = this.postsIndex?.posts || [];
    const actors = this.actorsData?.entries || [];
    const iocs = this.iocsData?.iocs || [];
    const activeIocs = iocs.filter((ioc) => ioc.status === "active");
    const recentPosts = this.getRecentPosts(30);
    const themeSourcePosts = recentPosts.length >= 2 ? recentPosts : posts;
    const themeFallback = recentPosts.length < 2 && posts.length > 0;
    const themeMix = this.getBriefThemeMix(themeSourcePosts);
    const iocTypes = this.sortCounts(
      this.countBy(activeIocs, (ioc) => ioc.type),
    );
    const iocSources = this.sortCounts(
      this.countBy(activeIocs, (ioc) => ioc.source),
    );
    const validDates = posts
      .map((post) => String(post?.date || "").match(/^\d{4}-\d{2}-\d{2}/)?.[0])
      .filter(Boolean)
      .sort();
    const latestReportDate = validDates.at(-1) || "";

    const data = {
      windowLabel: "Window: Last 30 days",
      lastUpdated: this.getLatestDateLabel(
        latestReportDate,
        this.iocsData?.last_updated,
        this.actorsData?.last_updated,
      ),
      latestReportDate: latestReportDate || "Unknown",
      themeFallback,
      totals: {
        recentReports: recentPosts.length,
        totalReports: posts.length,
        activeIocs: activeIocs.length,
        activeActors: actors.filter((actor) => actor.status === "active")
          .length,
      },
      themeMix,
      topTheme: themeMix[0]?.key || "No theme signal",
      topIocType: iocTypes[0]?.key || "Unknown",
      topIocSources: iocSources.slice(0, 3),
    };

    data.posture = this.getBriefPosture(data);
    return data;
  },

  generateExecutiveSummary(data) {
    const topTheme = data?.topTheme || "tracked activity";
    const topIocType = this.formatType(data?.topIocType || "Unknown");
    const posture = String(data?.posture?.label || "Watch").toLowerCase();
    const article = /^[aeiou]/i.test(posture) ? "an" : "a";
    return [
      `The current tracking data shows ${article} ${posture} directional signal across tracked reports, actors, and indicators.`,
      `Recent reporting is most concentrated around ${topTheme}, based on conservative keyword matching across the tracked reports.`,
      `Active IOC volume remains represented in the feed, with ${topIocType} indicators prominent in the current dataset.`,
      "The strongest defender focus is monitoring AI credential exposure, reviewing agent and tool permissions, and tracking package ecosystem infrastructure.",
      "This page summarizes tracked reporting only and does not measure global prevalence or organization-specific risk.",
    ].join(" ");
  },

  generateRecommendedFocus() {
    return [
      {
        title: "Credential Exposure",
        text: "Monitor AI API key exposure and LLM gateway abuse.",
      },
      {
        title: "Agent Permissions",
        text: "Review MCP, agent, and AI coding assistant permission boundaries.",
      },
      {
        title: "Supply Chain Indicators",
        text: "Track package ecosystem indicators and supply chain reporting.",
      },
    ];
  },

  renderBriefStatTiles(data) {
    const cards = [
      [
        "recent-reports",
        data.totals.recentReports,
        "Reports, Last 30 Days",
        "Open Intel Feed",
      ],
      [
        "total-reports",
        data.totals.totalReports,
        "Total Reports",
        "Open Intel Feed",
      ],
      [
        "active-iocs",
        data.totals.activeIocs,
        "Active IOCs",
        "Open active IOCs",
      ],
      [
        "active-actors",
        data.totals.activeActors,
        "Active Actors",
        "Open Threat Actors",
      ],
    ];

    return `
      <div class="stats-row brief-stat-row">
        ${cards
          .map(
            ([key, value, label, ariaLabel]) => `
          <button
            type="button"
            class="stat-card brief-stat-card stat-card-button"
            data-brief-stat="${this.escapeAttr(key)}"
            aria-label="${this.escapeAttr(ariaLabel)}"
            onclick="${this.escapeAttr(`App.openBriefStatPivot('${key}')`)}"
          >
            <div class="stat-value">${this.escapeHtml(value)}</div>
            <div class="stat-label">${this.escapeHtml(label)}</div>
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  },

  renderBriefThemeChart(data) {
    const description = data.themeFallback
      ? "Limited recent data, showing all tracked reports. Keyword-based themes are counted once per report."
      : "Keyword-based themes counted once per recent report.";

    return `
      <section class="brief-main-chart">
        ${this.renderTrendBarList({
          title: "Threat Theme Mix, Last 30 Days",
          description,
          section: "brief-theme-mix",
          items: data.themeMix,
          pivotType: "theme",
          pivotValue: (value) => this.getBriefThemeSearchTerm(value),
          pivotHandler: "brief",
        })}
      </section>
    `;
  },

  getBriefThemeSignal(theme) {
    const signals = {
      "Supply Chain":
        "Recent reporting continues to cluster around package ecosystems, dependency trust, and registry abuse.",
      "Credential Theft / LLMjacking":
        "Recent reporting keeps credential exposure, token theft, and unauthorized AI access in view.",
      "MCP / Agent Abuse":
        "Recent reporting points to agent tooling, MCP exposure, and tool permission boundaries.",
      "Prompt Injection":
        "Recent reporting includes prompt and context manipulation as a directional concern.",
      "AI Coding Tools":
        "Recent reporting includes AI coding assistants and developer workflow exposure.",
      "Nation-State / APT":
        "Recent reporting includes state-aligned or APT-labelled activity in the tracked dataset.",
      "Phishing / Social Engineering":
        "Recent reporting includes social engineering and lure-driven access paths.",
    };
    return (
      signals[theme] ||
      "Recent reporting shows a directional signal in the tracked dataset."
    );
  },

  renderBriefSignalCards(data) {
    const cards = [
      {
        key: "theme",
        title: "Most Active Theme",
        value: data.topTheme,
        text: this.getBriefThemeSignal(data.topTheme),
      },
      {
        key: "ioc-type",
        title: "Top IOC Type",
        value: this.formatType(data.topIocType),
        text: "The active IOC feed is currently led by this indicator category.",
      },
      {
        key: "ioc-sources",
        title: "Top IOC Sources",
        value: data.topIocSources.length
          ? data.topIocSources
              .map((item) => `${item.key} (${item.count})`)
              .join(", ")
          : "Unknown",
        text: "Leading active IOC source labels, shown as a mix instead of a single headline source.",
      },
    ];

    return `
      <section class="brief-section">
        <div class="trend-section-heading">
          <h2>Recent Signals</h2>
          <p>Short directional readouts from the current tracked reporting.</p>
        </div>
        <div class="brief-card-grid brief-signal-grid">
          ${cards
            .map(
              (card) => `
            <article class="brief-mini-card" data-brief-signal="${this.escapeAttr(card.key)}">
              <span class="brief-card-kicker">${this.escapeHtml(card.title)}</span>
              <h3>${this.escapeHtml(card.value)}</h3>
              <p>${this.escapeHtml(card.text)}</p>
            </article>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  },

  renderBriefActionCards(data) {
    const meaningCards = [
      {
        key: "leadership",
        title: "Leadership",
        text: "Prioritize visibility into AI tooling, API key exposure, and third-party package risk.",
      },
      {
        key: "soc",
        title: "SOC / Threat Hunting",
        text: "Use IOC Feed pivots to hunt active domains, URLs, hashes, IPs, and package indicators.",
      },
      {
        key: "engineering",
        title: "Engineering",
        text: "Review agent and tool permissions, MCP server exposure, and package dependency controls.",
      },
    ];
    const focusItems = this.generateRecommendedFocus(data);

    return `
      <section class="brief-section">
        <div class="trend-section-heading">
          <h2>What This Means</h2>
          <p>Three operational takeaways for different audiences.</p>
        </div>
        <div class="brief-card-grid brief-meaning-grid">
          ${meaningCards
            .map(
              (card) => `
            <article class="brief-mini-card" data-brief-meaning="${this.escapeAttr(card.key)}">
              <span class="brief-card-kicker">${this.escapeHtml(card.title)}</span>
              <p>${this.escapeHtml(card.text)}</p>
            </article>
          `,
            )
            .join("")}
        </div>
      </section>
      <section class="brief-section">
        <div class="trend-section-heading">
          <h2>Recommended Focus</h2>
          <p>Concise priorities for the next review cycle.</p>
        </div>
        <div class="brief-card-grid brief-focus-grid">
          ${focusItems
            .map(
              (item, index) => `
            <article class="brief-mini-card" data-brief-focus="${this.escapeAttr(index + 1)}">
              <span class="brief-card-kicker">Priority ${this.escapeHtml(index + 1)}</span>
              <h3>${this.escapeHtml(item.title)}</h3>
              <p>${this.escapeHtml(item.text)}</p>
            </article>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  },

  renderBriefPivotActions() {
    const actions = [
      ["trends", "Open Trends"],
      ["home", "Open Intel Feed"],
      ["ioc-feed", "Open IOC Feed"],
      ["actors", "Open Threat Actors"],
    ];

    return `
      <section class="brief-section brief-pivot-section">
        <div class="trend-section-heading">
          <h2>Analyst Pivots</h2>
          <p>Open the detailed views for deeper review.</p>
        </div>
        <div class="brief-pivot-actions">
          ${actions
            .map(
              ([route, label]) => `
            <button
              type="button"
              class="btn"
              data-brief-pivot="${this.escapeAttr(route)}"
              aria-label="${this.escapeAttr(label)}"
              onclick="${this.escapeAttr(`App.openBriefPivot('route','${route}')`)}"
            >${this.escapeHtml(label)}</button>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  },

  openBriefStatPivot(key) {
    switch (key) {
      case "recent-reports":
      case "total-reports":
        this.openBriefPivot("route", "home");
        break;
      case "active-iocs":
        this.openBriefPivot("route", "ioc-feed");
        break;
      case "active-actors":
        this.openBriefPivot("route", "actors");
        break;
      default:
        break;
    }
  },

  openBriefPivot(type, value) {
    const cleanValue = String(value || "").trim();
    if (!cleanValue) return;

    if (type === "route") {
      if (cleanValue === "home") {
        this.currentFilter = "all";
        this.setFeedSearchImmediate("");
      } else if (cleanValue === "ioc-feed") {
        this.iocSearch = "";
        this.iocTypeFilter = "all";
        this.iocStatusFilter = "active";
        this.iocCampaignFilter = "all";
        this.iocSourceFilter = "all";
        this.iocSort = "newest";
      } else if (cleanValue === "actors") {
        this.actorSearch = "";
        this.actorFilter = "all";
      }
      this.navigateOrRender(cleanValue);
      return;
    }

    if (type === "theme") {
      this.currentFilter = "all";
      this.setFeedSearchImmediate(this.getBriefThemeSearchTerm(cleanValue));
      this.navigateOrRender("home");
      return;
    }

    this.openTrendPivot(type, cleanValue);
  },

  renderBrief(container) {
    const data = this.getBriefData();
    const summary = this.generateExecutiveSummary(data);

    container.innerHTML = `
      <div class="brief-dashboard">
        <div class="brief-header">
          <h1 class="page-title"><span class="title-accent">//</span> Executive Brief</h1>
          <p class="page-subtitle">Concise leadership view of current GenAI and LLM threat activity across tracked reporting.</p>
          <div class="brief-meta-row" aria-label="Page metadata">
            <span class="mitre-badge" data-brief-window>${this.escapeHtml(data.windowLabel)}</span>
            <span class="mitre-badge" data-brief-updated>Updated ${this.escapeHtml(data.lastUpdated)}</span>
          </div>
        </div>
        <p class="brief-methodology-note">This page is generated from current LLM ThreatIntel reporting. Derived themes are keyword-based and directional, not definitive attribution or organization-specific risk scoring.</p>
        <div class="brief-overview-grid">
          <section class="brief-summary-card" data-brief-summary>
            <h2>Executive Summary</h2>
            <p>${this.escapeHtml(summary)}</p>
          </section>
          <section class="brief-posture-card" data-brief-posture="${this.escapeAttr(data.posture.label)}">
            <div class="brief-posture-summary">
              <div class="brief-posture-metric">
                <h2>Current Threat Posture</h2>
                <div class="brief-posture-label">${this.escapeHtml(data.posture.label)}</div>
              </div>
              <div class="brief-posture-metric brief-posture-theme">
                <span>Leading threat theme</span>
                <strong>${this.escapeHtml(data.topTheme)}</strong>
              </div>
            </div>
            <div class="brief-posture-copy">
              <p>${this.escapeHtml(data.posture.rationale)}</p>
              <p class="brief-caveat">${this.escapeHtml(data.posture.caveat)}</p>
            </div>
          </section>
        </div>
        ${this.renderBriefStatTiles(data)}
        ${this.renderBriefThemeChart(data)}
        ${this.renderBriefSignalCards(data)}
        ${this.renderBriefActionCards(data)}
        ${this.renderBriefPivotActions()}
      </div>
    `;
  },

  renderTrends(container) {
    const data = this.getTrendsData();

    container.innerHTML = `
      <div class="trends-dashboard">
        <h1 class="page-title"><span class="title-accent">//</span> Trends Dashboard</h1>
        <p class="page-subtitle">Trends across current reports, threat actors, and IOCs. Use the pivots to jump into filtered reports, actors, or indicators.</p>

        ${this.renderTrendStatCards(data)}

        <section class="trend-section">
          <div class="trend-section-heading">
            <h2>Reports</h2>
            <p>Exact metrics from ${this.escapeHtml(this.getTrendWindowDescription(data))}. Use the time-window tiles to update the report-derived charts.</p>
          </div>
          ${this.renderTrendReportWindows(data)}
          <div class="trend-grid">
            ${this.renderTrendBarList({
              title: "Reports by Tag",
              description: "Counts each tag assigned to current reports.",
              section: "reports-by-tag",
              items: data.reportsByTag,
              labeler: (value) => this.formatTag(value),
              pivotType: "report-tag",
            })}
            ${this.renderTrendBarList({
              title: "Reports by Month",
              description: "Counts reports by publication month.",
              section: "reports-by-month",
              items: data.reportsByMonth,
              pivotType: "report-month",
            })}
          </div>
        </section>

        <section class="trend-section">
          <div class="trend-section-heading">
            <h2>IOCs</h2>
            <p>Exact metrics from the IOC database.</p>
          </div>
          <div class="trend-grid">
            ${this.renderTrendBarList({
              title: "IOC Type Mix",
              description: "Counts explicit IOC type values.",
              section: "ioc-types",
              items: data.iocTypes,
              labeler: (value) => this.formatType(value),
              pivotType: "ioc-type",
              pivotValue: (value) => this.getIOCTypePivotValue(value),
            })}
            ${this.renderTrendBarList({
              title: "IOC Status Mix",
              description: "Counts explicit IOC status values.",
              section: "ioc-statuses",
              items: data.iocStatuses,
              labeler: (value) => this.formatType(value),
              pivotType: "ioc-status",
            })}
            ${this.renderTrendBarList({
              title: "Top IOC Sources",
              description: "Top source labels represented in IOC records.",
              section: "ioc-sources",
              items: data.iocSources,
              pivotType: "ioc-source",
            })}
          </div>
        </section>

        <section class="trend-section">
          <div class="trend-section-heading">
            <h2>Threat Actors</h2>
            <p>Exact metrics from actor records.</p>
          </div>
          <div class="trend-grid">
            ${this.renderTrendBarList({
              title: "Actor Type Mix",
              description: "Counts explicit actor type values.",
              section: "actor-types",
              items: data.actorTypes,
              labeler: (value) => this.formatType(value),
            })}
            ${this.renderTrendBarList({
              title: "Actor Status Mix",
              description: "Counts explicit actor status values.",
              section: "actor-statuses",
              items: data.actorStatuses,
              labeler: (value) => this.formatType(value),
            })}
          </div>
        </section>

        <section class="trend-section">
          <div class="trend-section-heading">
            <h2>Most Mentioned Actors</h2>
            <p>Keyword-based actor mentions across current report metadata and campaign-linked IOC context.</p>
          </div>
          <div class="trend-grid">
            ${this.renderTrendBarList({
              title: "Actor Mentions",
              description:
                "Counts at most one mention per report for each actor name or alias.",
              section: "actor-mentions",
              items: data.actorMentions,
              pivotType: "actor-search",
            })}
          </div>
        </section>

        <section class="trend-section">
          <div class="trend-section-heading">
            <h2>Derived Intelligence Themes</h2>
            <p>Derived sections are based on current public-source reports and conservative keyword matching. Treat them as directional pivots, not definitive attribution.</p>
          </div>
          <div class="trend-grid">
            ${this.renderTrendBarList({
              title: "Top Affected Platforms",
              description:
                "Keyword-based platform references counted once per report.",
              section: "affected-platforms",
              items: data.affectedPlatforms,
              pivotType: "platform",
              pivotValue: (value) =>
                this.getTrendRepresentativeSearch("platform", value),
            })}
            ${this.renderTrendBarList({
              title: "Attack Themes",
              description: "Keyword-based themes counted once per report.",
              section: "attack-themes",
              items: data.attackThemes,
              pivotType: "theme",
              pivotValue: (value) =>
                this.getTrendRepresentativeSearch("theme", value),
            })}
          </div>
        </section>
      </div>
    `;
  },

  // ---- HOME PAGE ----
  renderHome(container) {
    if (!this.postsIndex) {
      container.innerHTML = '<div class="loading">Loading intel feed...</div>';
      return;
    }

    const posts = this.postsIndex.posts;
    const activeIOCs = this.iocsData
      ? this.iocsData.iocs.filter((i) => i.status === "active").length
      : 0;
    const activeActors = this.actorsData
      ? this.actorsData.entries.filter((e) => e.status === "active").length
      : 0;
    const discoveredTags = [...new Set(posts.flatMap((p) => p.tags))];
    const allTags = [
      ...this.homeTagOrder.filter((tag) => discoveredTags.includes(tag)),
      ...discoveredTags.filter((tag) => !this.homeTagOrder.includes(tag)),
    ];
    const activeFilter =
      this.currentFilter === "all" || allTags.includes(this.currentFilter)
        ? this.currentFilter
        : "all";

    this.currentFilter = activeFilter;

    container.innerHTML = `
      <div class="status-bar">
        <div class="status-item"><span class="status-dot"></span><span class="status-value">OPERATIONAL</span></div>
        <div class="status-item"><span class="status-label">Updated</span><span class="status-value">${this.iocsData?.last_updated || "N/A"}</span></div>
        <div class="status-item"><span class="status-label">Active IOCs</span><span class="status-value">${activeIOCs}</span></div>
        <div class="status-item"><span class="status-label">Actors</span><span class="status-value">${activeActors}</span></div>
      </div>
      <div class="stats-row">
        <div class="stat-card" onclick="window.location.hash='#home'"><div class="stat-value">${posts.length}</div><div class="stat-label">Intel Reports</div></div>
        <div class="stat-card" onclick="window.location.hash='#actors'"><div class="stat-value">${activeActors}</div><div class="stat-label">Threat Actors</div></div>
        <div class="stat-card" onclick="App.showIOCModal('all')"><div class="stat-value">${activeIOCs}</div><div class="stat-label">Active IOCs</div></div>
        <div class="stat-card" onclick="window.location.hash='#ioc-feed'"><div class="stat-value">${this.iocsData ? this.iocsData.iocs.length : 0}</div><div class="stat-label">Total IOCs</div></div>
      </div>
      <h1 class="page-title"><span class="title-accent">//</span> Latest Intelligence</h1>
      <p class="page-subtitle">GenAI and LLM threat intelligence feed for defenders</p>
      <div class="filter-bar-wrap">
        <div class="filter-bar" role="group" aria-label="Post category filters" aria-controls="posts-grid">
          <button class="filter-btn ${activeFilter === "all" ? "active" : ""}" data-filter="all">All</button>
          ${allTags.map((tag) => `<button class="filter-btn ${activeFilter === tag ? "active" : ""}" data-filter="${tag}">${this.formatTag(tag)}</button>`).join("")}
        </div>
      </div>
      <div id="feed-index-status" class="feed-index-status is-hidden" aria-live="polite"></div>
      <div id="feed-status" class="feed-status"></div>
      <div class="posts-grid" id="posts-grid"></div>
      <div class="feed-disclaimer" aria-label="Feed disclaimer">
        <h2 class="about-section-title">Disclaimer</h2>
        <p>This news feed is automated. The data comes from public reports only and open source community. Validate IOCs before production blocking.</p>
      </div>
    `;

    container.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentFilter = btn.dataset.filter;
        container
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterPosts();
        this.updateHashParams(this.buildRouteParams("home"), { push: true });

        if (window.innerWidth <= 768) {
          this.scrollActiveFilterIntoView(container);
        }
      });
    });

    this.filterPosts();
    this.syncSearchInputs();
    if (this.feedSearchIndexBuilding) this.updateIndexingIndicator("building");
    this.setupHomeFilterBar(container);
  },

  scrollActiveFilterIntoView(container, smooth = true) {
    const activeBtn = container?.querySelector(
      ".filter-bar .filter-btn.active",
    );
    const bar = container?.querySelector(
      ".filter-bar-wrap.is-stuck .filter-bar",
    );

    if (!activeBtn || !bar) return;

    activeBtn.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
  },

  setupHomeFilterBar(container) {
    const wrap = container.querySelector(".filter-bar-wrap");
    const bar = wrap?.querySelector(".filter-bar");
    if (!wrap || !bar) return;
    const getTopOffset = () => {
      return (
        document.querySelector(".site-header")?.getBoundingClientRect()
          .height || 0
      );
    };

    let wasStuck = false;
    let stateTimer = null;
    let rafScheduled = false;
    let prevBarHeight = 0;

    const syncFilterBar = () => {
      const h = bar.offsetHeight;
      if (h !== prevBarHeight) {
        wrap.style.setProperty("--filter-bar-height", `${h}px`);
        prevBarHeight = h;
      }

      const topDelta = wrap.getBoundingClientRect().top - getTopOffset();
      const isMobile = window.innerWidth <= 768;
      const enterThreshold = isMobile ? -10 : 0;
      const exitThreshold = isMobile ? 16 : 6;

      const isStuck = wasStuck
        ? topDelta <= exitThreshold
        : topDelta <= enterThreshold;

      if (isStuck !== wasStuck) {
        if (isMobile) {
          wrap.classList.add("is-animating");
          window.clearTimeout(stateTimer);
          stateTimer = window.setTimeout(() => {
            wrap.classList.remove("is-animating");
          }, 220);
        }
        wrap.classList.toggle("is-stuck", isStuck);
        if (isMobile && isStuck) {
          this.scrollActiveFilterIntoView(container, false);
        }
        wasStuck = isStuck;
      }
    };

    const handleScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        syncFilterBar();
      });
    };
    const handleResize = () => syncFilterBar();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    let resizeObserver = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => syncFilterBar());
      resizeObserver.observe(bar);
    }

    requestAnimationFrame(syncFilterBar);

    this.cleanupHomeFilterBar = () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      window.clearTimeout(stateTimer);
      wrap.classList.remove("is-stuck");
      wrap.classList.remove("is-animating");
      wrap.style.removeProperty("--filter-bar-height");
    };
  },

  renderPostCards(posts) {
    return posts
      .map(
        (post) => `
      <div class="post-card" data-tags="${post.tags.join(",")}" data-title="${post.title.toLowerCase()}" onclick="window.location.hash='post/${post.id}'">
        <div class="post-meta">
          <span class="post-date">${post.date}</span>
          ${post.tags.map((t) => `<span class="post-tag tag-${t}">${this.formatTag(t)}</span>`).join("")}
          <span class="post-tag tlp-clear">${post.tlp}</span>
        </div>
        <div class="post-title">${post.title}</div>
        <div class="post-excerpt">${this.truncateExcerpt(post.excerpt, 220)}</div>
      </div>
    `,
      )
      .join("");
  },

  filterPosts() {
    const grid = document.getElementById("posts-grid");
    const status = document.getElementById("feed-status");
    if (!grid) return;
    const filtered = this.getFilteredFeedPosts();
    grid.innerHTML = filtered.length
      ? this.renderPostCards(filtered)
      : this.renderEmptyFeedState();
    if (status) status.innerHTML = this.renderFeedStatusLine(filtered.length);
  },

  // ---- SINGLE POST ----
  async renderPost(container, postId) {
    container.innerHTML = '<div class="loading">Loading report...</div>';
    const postMeta = this.postsIndex?.posts.find((p) => p.id === postId);
    if (!postMeta) {
      this.setRouteMeta({
        title: "Post Not Found | LLM ThreatIntel",
        description: this.metaDefaults.description,
        url: `${this.metaDefaults.siteUrl}/`,
      });
      container.innerHTML =
        '<a href="#home" class="back-link">&larr; Back to feed</a><div class="post-content"><p>Post not found.</p></div>';
      return;
    }

    const postHtml = postMeta.file.replace(/\.md$/i, ".html");
    this.setRouteMeta({
      title: `${postMeta.title} | LLM ThreatIntel`,
      description: postMeta.excerpt || this.metaDefaults.description,
      url: `${this.metaDefaults.siteUrl}/posts/${postHtml}`,
      type: "article",
    });

    try {
      const response = await fetch(`posts/${postMeta.file}`);
      if (!response.ok) throw new Error("Post file not found");
      const markdown = await response.text();
      const html = this.renderMarkdown(markdown);
      const relatedHtml = this.renderRelatedReports(postMeta, markdown);
      container.innerHTML = `
        <a href="#home" class="back-link">&larr; Back to feed</a>
        <div class="post-meta" style="margin-bottom:1rem">
          <span class="post-date">${postMeta.date}</span>
          ${postMeta.tags.map((t) => `<span class="post-tag tag-${t}">${this.formatTag(t)}</span>`).join("")}
          <span class="post-tag tlp-clear">${postMeta.tlp}</span>
        </div>
        <div class="post-content">${html}</div>
        ${relatedHtml}
      `;
      this.addCopyButtons(container);
    } catch (e) {
      container.innerHTML = `<a href="#home" class="back-link">&larr; Back</a><div class="post-content"><p>Error: ${e.message}</p></div>`;
    }
  },

  computeRelatedPosts(currentPost, markdown) {
    const posts = this.postsIndex?.posts || [];
    const currentId = currentPost.id;
    const scores = new Map();

    const cves = markdown.match(/CVE-\d{4}-\d{4,7}/g) || [];
    const uniqueCves = [...new Set(cves)];

    const actorNames = [];
    const entries = this.actorsData?.entries || [];
    const mdLower = markdown.toLowerCase();
    for (const actor of entries) {
      for (const name of actor.names || []) {
        if (name.length > 3 && mdLower.includes(name.toLowerCase())) {
          actorNames.push(name.toLowerCase());
        }
      }
    }

    const currentIocs = (this.iocsData?.iocs || [])
      .filter(
        (i) =>
          i.type === "package" &&
          (i.campaign === currentId ||
            i.campaign === currentId.replace(/^\d{4}-\d{2}-\d{2}-/, "")),
      )
      .map((i) =>
        i.value
          .replace(/^(?:npm:|pypi:)/, "")
          .replace(/@[^@/]+$/, "")
          .toLowerCase(),
      );

    for (const post of posts) {
      if (post.id === currentId) continue;
      let score = 0;

      const postBlob = (
        post.title +
        " " +
        post.excerpt +
        " " +
        post.id
      ).toLowerCase();

      for (const cve of uniqueCves) {
        if (postBlob.includes(cve.toLowerCase())) {
          score += 3;
        }
      }

      for (const pkgName of currentIocs) {
        if (pkgName.length > 3 && postBlob.includes(pkgName)) {
          score += 3;
        }
      }

      for (const actorName of actorNames) {
        if (postBlob.includes(actorName)) {
          score += 2;
        }
      }

      if (score > 0) scores.set(post.id, score);
    }

    const threshold = 3;
    const results = [...scores.entries()]
      .filter(([, s]) => s >= threshold)
      .sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))
      .slice(0, 5)
      .map(([id]) => posts.find((p) => p.id === id))
      .filter(Boolean);

    return results;
  },

  renderRelatedReports(postMeta, markdown) {
    const related = this.computeRelatedPosts(postMeta, markdown);
    if (!related.length) return "";
    return `
      <div class="related-reports">
        <h2 class="related-reports-title">Related Reports</h2>
        <ul class="related-reports-list">
          ${related.map((p) => `<li><a href="#post/${this.escapeAttr(p.id)}">${this.escapeHtml(p.title)}</a><span class="related-date">${p.date}</span></li>`).join("")}
        </ul>
      </div>
    `;
  },

  blogPostBylineHtml() {
    return "";
  },

  blogPostFooterAsideHtml() {
    return `
    <div class="post-footer-aside">
      <h2 class="about-section-title">Project Notes</h2>
      <p>LLM ThreatIntel is maintained independently as a personal defensive research project focused on the generative AI and LLM threat landscape.</p>
      <p>Report a bug: <a href="mailto:support@llm-threatintel.com">support@llm-threatintel.com</a></p>
      <h2 class="about-section-title">Disclaimer</h2>
      <p>Independent personal project. Blog section analysis, and research are my own and do not represent any employer.</p>
    </div>`;
  },

  stripBlogPostFooterMarkdown(md) {
    return md
      .replace(
        /\r?\n---\s*\r?\n\s*## (?:Support LLM ThreatIntel|Project Notes)[\s\S]*$/m,
        "",
      )
      .trim();
  },

  renderMarkdown(md) {
    const codeBlocks = [];
    let html = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({ lang: lang || "", code: code.trim() });
      return `\n\nCODEBLOCKPLACEHOLDER_${idx}\n\n`;
    });
    html = html
      .replace(
        /^\|(.+)\|[ \t]*\n\|[-| :]+[ \t]*\n((?:\|.+\|[ \t]*\n)*)/gm,
        (match, header, body) => {
          const headers = header
            .split("|")
            .map((h) => h.trim())
            .filter(Boolean);
          const rows = body
            .trim()
            .split("\n")
            .map((row) =>
              row
                .split("|")
                .map((c) => c.trim())
                .filter(Boolean),
            );
          return `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>\n\n`;
        },
      )
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>',
      )
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
      .replace(/^---$/gm, "<hr>");
    html = html
      .split(/\n\s*\n/)
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        const first = trimmed.split("\n")[0].trim();
        if (
          /^<(h[1-3]|table|pre|ul|ol|li|blockquote|hr|p)\b/i.test(first) ||
          first.startsWith("CODEBLOCKPLACEHOLDER_") ||
          first.startsWith("</")
        ) {
          return trimmed;
        }
        const lines = trimmed
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        return `<p>${lines.join("<br>")}</p>`;
      })
      .join("\n");
    html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, "<ul>$1</ul>");
    html = html.replace(/<p>\s*<\/p>/g, "");
    const preHtml = (idx) => {
      const b = codeBlocks[Number(idx)];
      const lang = this.escapeHtml(b.lang);
      return `<pre><code class="language-${lang}">${this.escapeHtml(b.code)}</code></pre>`;
    };
    html = html.replace(/<p>CODEBLOCKPLACEHOLDER_(\d+)<\/p>/g, (_, idx) =>
      preHtml(idx),
    );
    html = html.replace(/CODEBLOCKPLACEHOLDER_(\d+)/g, (_, idx) =>
      preHtml(idx),
    );
    return html;
  },

  addCopyButtons(container) {
    container.querySelectorAll("pre").forEach((pre) => {
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = pre.querySelector("code");
        this.copyText(code.textContent, btn);
      });
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  },

  // ---- ACTORS ----
  getActorBucket(actor) {
    if (actor.type === "malicious_llm_tool") return "malicious_tools";
    if (actor.type === "malware" || actor.type === "supply_chain_campaign")
      return "malware";
    if (actor.type === "threat_group" || (actor.type || "").includes("nation"))
      return "threat_groups";
    return "other";
  },

  stripHtml(value) {
    return String(value || "")
      .replace(/<[^>]*>/g, "")
      .trim();
  },

  getActorSummary(actor, max = 180) {
    const cleanDescription = this.stripHtml(actor.description);
    if (cleanDescription) return this.truncateExcerpt(cleanDescription, max);

    const parts = [];
    if (actor.type) parts.push(this.formatType(actor.type));
    if (actor.status) parts.push(`status: ${actor.status}`);
    if (actor.distribution?.length)
      parts.push(`distribution: ${actor.distribution.slice(0, 2).join(", ")}`);
    if (actor.ttps?.length)
      parts.push(
        `TTPs: ${actor.ttps
          .slice(0, 2)
          .map((t) => t.split(" - ")[0])
          .join(", ")}`,
      );

    return (
      this.truncateExcerpt(parts.join(" · "), max) ||
      "No summary available yet."
    );
  },

  getFilteredActors() {
    const term = this.actorSearch.trim().toLowerCase();

    return (this.actorsData?.entries || []).filter((actor) => {
      const matchesFilter =
        this.actorFilter === "all" ||
        this.getActorBucket(actor) === this.actorFilter;

      const searchBlob = [
        ...(actor.names || []),
        actor.attribution || "",
        actor.description || "",
        ...(actor.ttps || []),
        ...(actor.distribution || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || searchBlob.includes(term);
      return matchesFilter && matchesSearch;
    });
  },

  renderActors(container) {
    if (!this.actorsData) {
      container.innerHTML = '<div class="loading">Loading...</div>';
      return;
    }

    const actors = this.actorsData.entries;
    const filtered = this.getFilteredActors();

    const tableHtml =
      filtered.length === 0
        ? '<p class="page-subtitle">No actors match the current filter or search.</p>'
        : `
        <div class="actor-table-wrap">
          <table class="actor-table" id="actor-table">
            <thead>
              <tr>
                <th>Name / Aliases</th>
                <th>Type</th>
                <th>Status</th>
                <th>First Seen</th>
                <th>Distribution</th>
                <th>Key TTPs</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                  (actor) => `
                <tr
                  data-actor-id="${this.escapeHtml(actor.id)}"
                  tabindex="0"
                  role="button"
                  aria-label="View details for ${this.escapeHtml(actor.names[0])}"
                >
                  <td>
                    <div class="actor-name">${this.escapeHtml(actor.names[0])}</div>
                    ${actor.names.length > 1 ? `<div class="actor-aliases">aka: ${this.escapeHtml(actor.names.slice(1).join(", "))}</div>` : ""}
                    ${actor.attribution ? `<div class="actor-aliases">Attr: ${this.escapeHtml(this.stripHtml(actor.attribution))}</div>` : ""}
                    <div class="actor-summary">${this.escapeHtml(this.getActorSummary(actor))}</div>
                    <span class="actor-row-cta">View details &rarr;</span>
                  </td>
                  <td><span class="ttp-tag">${this.escapeHtml(this.formatType(actor.type))}</span></td>
                  <td><span class="actor-status status-${this.escapeHtml(actor.status)}">${this.escapeHtml(actor.status.toUpperCase())}</span></td>
                  <td style="font-family:var(--fm);font-size:.78rem;color:var(--t2)">${this.escapeHtml(actor.first_seen || "")}</td>
                  <td style="font-size:.82rem;color:var(--t2)">${this.escapeHtml((actor.distribution || []).join(", "))}</td>
                  <td>${(actor.ttps || [])
                    .slice(0, 3)
                    .map(
                      (t) =>
                        `<span class="mitre-badge">${this.escapeHtml(t.split(" - ")[0])}</span>`,
                    )
                    .join(" ")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> Threat Actor Tracker</h1>
      <p class="page-subtitle">${actors.length} entries tracked across malicious tools, malware, campaigns, and nation-state programs</p>

      <div class="search-input-wrap">
        <input
          type="text"
          class="search-input"
          placeholder="Search actors, aliases, TTPs..."
          id="search-actors"
          value="${this.escapeHtml(this.actorSearch)}"
        >
      </div>

      <div class="stats-row actor-filter-row">
        <div class="stat-card actor-filter-card ${this.actorFilter === "all" ? "active-filter" : ""}" data-filter="all">
          <div class="stat-value">${actors.filter((a) => a.status === "active").length}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-card actor-filter-card ${this.actorFilter === "malicious_tools" ? "active-filter" : ""}" data-filter="malicious_tools">
          <div class="stat-value">${actors.filter((a) => a.type === "malicious_llm_tool").length}</div>
          <div class="stat-label">Malicious Tools</div>
        </div>
        <div class="stat-card actor-filter-card ${this.actorFilter === "threat_groups" ? "active-filter" : ""}" data-filter="threat_groups">
          <div class="stat-value">${actors.filter((a) => a.type === "threat_group" || (a.type || "").includes("nation")).length}</div>
          <div class="stat-label">Threat Groups</div>
        </div>
        <div class="stat-card actor-filter-card ${this.actorFilter === "malware" ? "active-filter" : ""}" data-filter="malware">
          <div class="stat-value">${actors.filter((a) => a.type === "malware" || a.type === "supply_chain_campaign").length}</div>
          <div class="stat-label">Malware</div>
        </div>
      </div>

      <p class="actor-list-instruction">Click any actor row to open the full detail panel.</p>

      ${tableHtml}
    `;

    const searchInput = container.querySelector("#search-actors");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.actorSearch = e.target.value;
        this.renderActors(container);
        const next = container.querySelector("#search-actors");
        if (next) {
          next.focus();
          next.setSelectionRange(
            this.actorSearch.length,
            this.actorSearch.length,
          );
        }
      });
    }

    container.querySelectorAll(".actor-filter-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.actorFilter = card.dataset.filter;
        this.renderActors(container);
      });
    });

    container.querySelectorAll("#actor-table tbody tr").forEach((row) => {
      const open = () => {
        this.selectedActorId = row.dataset.actorId;
        this.openActorDetailModal(row.dataset.actorId, row);
      };
      row.addEventListener("click", open);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  },

  // ---- IOC FEED ----
  getIOCRecords() {
    return Array.isArray(this.iocsData?.iocs) ? this.iocsData.iocs : [];
  },

  getIOCValue(ioc) {
    return String(ioc?.value ?? "").trim();
  },

  isExportSafePackageValue(value) {
    const v = String(value || "").trim();
    if (!v) return false;
    if (/[()]/.test(v)) return false;
    if (/\s/.test(v)) return false;
    if (/,/.test(v)) return false;
    if (/[<>]=?|==/.test(v)) return false;
    if (/\badditional packages\b/i.test(v)) return false;
    if (/\ball versions\b/i.test(v)) return false;
    return true;
  },

  isExportSafeIoc(ioc) {
    const value = this.getIOCValue(ioc);
    if (!value) return false;
    if (this.getIOCTypeBucket(ioc) === "package") {
      return this.isExportSafePackageValue(value);
    }
    return true;
  },

  getExportableIOCs(iocs) {
    const exportable = [];
    const skipped = [];
    for (const ioc of iocs) {
      if (this.isExportSafeIoc(ioc)) exportable.push(ioc);
      else skipped.push(ioc);
    }
    if (skipped.length) {
      console.warn(
        "IOC export skipped non-export-safe indicators:",
        skipped.map((i) => this.getIOCValue(i)),
      );
    }
    return { exportable, skipped };
  },

  getIOCTypeBucket(ioc) {
    const explicit = String(ioc?.type || "")
      .trim()
      .toLowerCase();
    if (explicit === "domain") return "domain";
    if (explicit === "url_path" || explicit === "url") return "url_path";
    if (explicit === "ip" || explicit === "ipv4" || explicit === "ipv6")
      return "ip";
    if (explicit === "package") return "package";
    if (this.isHashType(explicit)) return "hash";

    const value = this.getIOCValue(ioc).toLowerCase();
    if (
      /^[a-f0-9]{64}$/.test(value) ||
      /^[a-f0-9]{40}$/.test(value) ||
      /^[a-f0-9]{32}$/.test(value)
    )
      return "hash";
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) return "ip";
    return explicit || "unknown";
  },

  getIOCSearchBlob(ioc) {
    return [
      ioc?.value,
      ioc?.type,
      ioc?.status,
      ioc?.campaign,
      ioc?.source,
      ioc?.context,
      ioc?.first_seen,
    ]
      .filter((v) => v !== null && v !== undefined)
      .join(" ")
      .toLowerCase();
  },

  sortIOCs(iocs) {
    const sorted = [...iocs];
    const text = (v) => String(v || "").toLowerCase();
    const byText = (field) =>
      sorted.sort(
        (a, b) =>
          text(a[field]).localeCompare(text(b[field])) ||
          text(a.value).localeCompare(text(b.value)),
      );

    switch (this.iocSort) {
      case "type":
        sorted.sort(
          (a, b) =>
            this.getIOCTypeBucket(a).localeCompare(this.getIOCTypeBucket(b)) ||
            text(a.value).localeCompare(text(b.value)),
        );
        break;
      case "campaign":
        byText("campaign");
        break;
      case "source":
        byText("source");
        break;
      case "value":
        byText("value");
        break;
      case "newest":
      default:
        sorted.sort(
          (a, b) =>
            text(b.first_seen).localeCompare(text(a.first_seen)) ||
            text(a.value).localeCompare(text(b.value)),
        );
        break;
    }
    return sorted;
  },

  getFilteredIOCs() {
    const term = this.iocSearch.trim().toLowerCase();
    const terms = term ? term.split(/\s+/).filter(Boolean) : [];

    const filtered = this.getIOCRecords().filter((ioc) => {
      const typeBucket = this.getIOCTypeBucket(ioc);
      const status = String(ioc?.status || "unknown").toLowerCase();
      const campaign = String(ioc?.campaign || "").trim();
      const source = String(ioc?.source || "").trim();

      if (this.iocTypeFilter !== "all" && typeBucket !== this.iocTypeFilter)
        return false;
      if (this.iocStatusFilter !== "all" && status !== this.iocStatusFilter)
        return false;
      if (
        this.iocCampaignFilter !== "all" &&
        campaign !== this.iocCampaignFilter
      )
        return false;
      if (this.iocSourceFilter !== "all" && source !== this.iocSourceFilter)
        return false;
      if (terms.length) {
        const blob = this.getIOCSearchBlob(ioc);
        if (!terms.every((t) => blob.includes(t))) return false;
      }
      return true;
    });

    return this.sortIOCs(filtered);
  },

  escapeExportValue(value) {
    return String(value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
  },

  csvEscapeValue(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  },

  shouldWildcardSIEMExport() {
    return this.iocTypeFilter !== "ip" && this.iocTypeFilter !== "hash";
  },

  buildIOCExports(
    iocs,
    { wildcardSIEM = this.shouldWildcardSIEMExport() } = {},
  ) {
    const { exportable, skipped } = this.getExportableIOCs(iocs);
    const jsonRows = exportable.map((ioc) => ({
      value: this.getIOCValue(ioc),
      type: ioc?.type || "unknown",
      status: ioc?.status || "unknown",
      first_seen: ioc?.first_seen || "",
      campaign: ioc?.campaign || "",
      source: ioc?.source || "",
      context: ioc?.context || "",
    }));

    return {
      count: exportable.length,
      skippedCount: skipped.length,
      skippedValues: skipped.map((ioc) => this.getIOCValue(ioc)),
      defanged: exportable
        .map((ioc) => this.defangIOC({ ...ioc, value: this.getIOCValue(ioc) }))
        .join("\n"),
      siem: exportable
        .map((ioc) => {
          const value = this.escapeExportValue(this.getIOCValue(ioc));
          return wildcardSIEM ? `"*${value}*"` : `"${value}"`;
        })
        .join(" OR "),
      csv: exportable
        .map((ioc) => this.csvEscapeValue(this.getIOCValue(ioc)))
        .join(", "),
      json: JSON.stringify(jsonRows, null, 2),
    };
  },

  getCampaignPostId(campaign) {
    const campaignValue = String(campaign || "").trim();
    if (!campaignValue) return null;
    const posts = this.postsIndex?.posts || [];
    if (posts.some((p) => p.id === campaignValue)) return campaignValue;

    const matches = posts.filter((p) => {
      const stripped = String(p.id || "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      return stripped === campaignValue;
    });
    return matches.length === 1 ? matches[0].id : null;
  },

  getIOCDisplayValue(ioc) {
    const value = this.getIOCValue(ioc);
    if (!value) return "No value";
    return this.defangIOC({ ...ioc, value });
  },

  getIOCFilterOptions(field) {
    return [
      ...new Set(
        this.getIOCRecords()
          .map((ioc) => String(ioc?.[field] || "").trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));
  },

  renderSelectOptions(values, selected, labeler = (v) => v) {
    return values
      .map(
        (value) => `
      <option value="${this.escapeAttr(value)}" ${value === selected ? "selected" : ""}>${this.escapeHtml(labeler(value))}</option>
    `,
      )
      .join("");
  },

  resetIOCWorkbench() {
    this.iocSearch = "";
    this.iocTypeFilter = "all";
    this.iocStatusFilter = "active";
    this.iocCampaignFilter = "all";
    this.iocSourceFilter = "all";
    this.iocSort = "newest";
  },

  bindIOCWorkbenchControls(container) {
    const rerender = (focusSelector = null) => {
      this.renderIOCFeed(container);
      if (focusSelector) {
        const el = container.querySelector(focusSelector);
        if (el && typeof el.focus === "function") {
          el.focus();
          if (el.id === "ioc-search") {
            el.setSelectionRange(this.iocSearch.length, this.iocSearch.length);
          }
        }
      }
    };

    container.querySelector("#ioc-search")?.addEventListener("input", (e) => {
      this.iocSearch = e.target.value;
      rerender("#ioc-search");
    });
    container
      .querySelector("#ioc-type-filter")
      ?.addEventListener("change", (e) => {
        this.iocTypeFilter = e.target.value;
        rerender("#ioc-type-filter");
      });
    container
      .querySelector("#ioc-status-filter")
      ?.addEventListener("change", (e) => {
        this.iocStatusFilter = e.target.value;
        rerender("#ioc-status-filter");
      });
    container
      .querySelector("#ioc-campaign-filter")
      ?.addEventListener("change", (e) => {
        this.iocCampaignFilter = e.target.value;
        rerender("#ioc-campaign-filter");
      });
    container
      .querySelector("#ioc-source-filter")
      ?.addEventListener("change", (e) => {
        this.iocSourceFilter = e.target.value;
        rerender("#ioc-source-filter");
      });
    container.querySelector("#ioc-sort")?.addEventListener("change", (e) => {
      this.iocSort = e.target.value;
      rerender("#ioc-sort");
    });
    container
      .querySelector("#ioc-clear-filters")
      ?.addEventListener("click", () => {
        this.resetIOCWorkbench();
        rerender("#ioc-search");
      });
  },

  renderIOCExportCard({ title, description, id, value, disabled }) {
    const output = disabled ? "No matching IOCs" : value;
    return `
      <div class="feed-card ioc-export-card">
        <h3>${this.escapeHtml(title)}</h3>
        <div class="feed-description">${this.escapeHtml(description)}</div>
        <div class="feed-output" id="${this.escapeAttr(id)}">${this.escapeHtml(output)}</div>
        <div class="feed-actions">
          <button class="btn" type="button" onclick="App.copyFeedById('${this.escapeAttr(id)}',this)" ${disabled ? "disabled" : ""}>Copy</button>
        </div>
      </div>
    `;
  },

  renderIOCCampaignCell(campaign) {
    const clean = String(campaign || "").trim();
    if (!clean) return '<span class="ioc-muted">Unknown</span>';
    const postId = this.getCampaignPostId(clean);
    if (!postId) return this.escapeHtml(clean);
    return `<a href="#post/${this.escapeAttr(postId)}">${this.escapeHtml(clean)}</a>`;
  },

  renderIOCTable(iocs) {
    if (!iocs.length) {
      return `
        <div class="feed-empty ioc-empty-state" role="status">
          <p>No matching IOCs. Adjust filters or clear the workbench.</p>
        </div>
      `;
    }

    return `
      <div class="ioc-table-wrap">
        <table class="ioc-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Type</th>
              <th>Status</th>
              <th>First Seen</th>
              <th>Lookup</th>
              <th>Campaign</th>
              <th>Source</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody>
            ${iocs
              .map((ioc) => {
                const status = String(ioc?.status || "unknown").toLowerCase();
                const type = String(ioc?.type || "unknown");
                return `
                <tr>
                  <td data-label="Indicator"><span class="ioc-value">${this.escapeHtml(this.getIOCDisplayValue(ioc))}</span></td>
                  <td data-label="Type"><span class="ttp-tag">${this.escapeHtml(this.formatType(type))}</span></td>
                  <td data-label="Status"><span class="actor-status status-${this.escapeAttr(status)}">${this.escapeHtml(status.toUpperCase())}</span></td>
                  <td data-label="First Seen"><span class="ioc-mono">${this.escapeHtml(ioc?.first_seen || "Unknown")}</span> ${this.renderAgeBadge(ioc)}</td>
                  <td data-label="Lookup">${this.renderEnrichmentLinks(ioc)}</td>
                  <td data-label="Campaign">${this.renderIOCCampaignCell(ioc?.campaign)}</td>
                  <td data-label="Source">${this.escapeHtml(ioc?.source || "Unknown")}</td>
                  <td data-label="Context">${this.escapeHtml(ioc?.context || "")}</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  renderIOCFeed(container) {
    if (!this.iocsData) {
      container.innerHTML = '<div class="loading">Loading...</div>';
      return;
    }
    const iocs = this.iocsData.iocs;
    const active = iocs.filter((i) => i.status === "active");
    const domains = active.filter((i) => i.type === "domain");
    const urls = active.filter((i) => i.type === "url_path");
    const ips = active.filter((i) => i.type === "ip");
    const hashes = active.filter((i) => this.isHashType(i.type));
    const packages = active.filter((i) => i.type === "package");

    const filtered = this.getFilteredIOCs();
    const exports = this.buildIOCExports(filtered);
    const noMatches = filtered.length === 0 || exports.count === 0;
    const total = this.getIOCRecords().length;
    const campaigns = this.getIOCFilterOptions("campaign");
    const sources = this.getIOCFilterOptions("source");

    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> IOC Feed</h1>
      <p class="page-subtitle">Filter indicators by value, type, status, campaign, or source. Exports below always match the visible result set.</p>
      <div class="stats-row">
        <div class="stat-card" onclick="App.showIOCModal('domain')"><div class="stat-value">${domains.length}</div><div class="stat-label">Domains</div></div>
        <div class="stat-card" onclick="App.showIOCModal('url_path')"><div class="stat-value">${urls.length}</div><div class="stat-label">URLs</div></div>
        <div class="stat-card" onclick="App.showIOCModal('ip')"><div class="stat-value">${ips.length}</div><div class="stat-label">IPs</div></div>
        <div class="stat-card" onclick="App.showIOCModal('hash')"><div class="stat-value">${hashes.length}</div><div class="stat-label">Hashes</div></div>
        <div class="stat-card" onclick="App.showIOCModal('package')"><div class="stat-value">${packages.length}</div><div class="stat-label">Packages</div></div>
        <div class="stat-card" onclick="App.showIOCModal('all')"><div class="stat-value">${active.length}</div><div class="stat-label">All Active</div></div>
      </div>
      <div class="ioc-workbench" aria-label="IOC workbench filters">
        <div class="ioc-control ioc-control-search">
          <label for="ioc-search">Search</label>
          <input id="ioc-search" type="search" value="${this.escapeAttr(this.iocSearch)}" placeholder="Value, context, source..." autocomplete="off" spellcheck="false">
        </div>
        <div class="ioc-control">
          <label for="ioc-type-filter">Type</label>
          <select id="ioc-type-filter">
            ${this.renderSelectOptions(["all", "domain", "url_path", "ip", "hash", "package"], this.iocTypeFilter, (v) => (v === "all" ? "All Types" : v === "url_path" ? "URLs" : v === "ip" ? "IPs" : v === "hash" ? "Hashes" : this.formatType(v)))}
          </select>
        </div>
        <div class="ioc-control">
          <label for="ioc-status-filter">Status</label>
          <select id="ioc-status-filter">
            ${this.renderSelectOptions(["active", "removed", "all"], this.iocStatusFilter, (v) => (v === "all" ? "All Statuses" : this.formatType(v)))}
          </select>
        </div>
        <div class="ioc-control">
          <label for="ioc-campaign-filter">Campaign</label>
          <select id="ioc-campaign-filter">
            <option value="all">All Campaigns</option>
            ${this.renderSelectOptions(campaigns, this.iocCampaignFilter)}
          </select>
        </div>
        <div class="ioc-control">
          <label for="ioc-source-filter">Source</label>
          <select id="ioc-source-filter">
            <option value="all">All Sources</option>
            ${this.renderSelectOptions(sources, this.iocSourceFilter)}
          </select>
        </div>
        <div class="ioc-control">
          <label for="ioc-sort">Sort</label>
          <select id="ioc-sort">
            ${this.renderSelectOptions(["newest", "type", "campaign", "source", "value"], this.iocSort, (v) => (v === "newest" ? "Newest" : this.formatType(v)))}
          </select>
        </div>
        <div class="ioc-control ioc-control-action">
          <label aria-hidden="true">&nbsp;</label>
          <button class="btn" id="ioc-clear-filters" type="button">Clear</button>
        </div>
      </div>
      <div class="ioc-result-status" id="ioc-result-status" role="status">Showing ${filtered.length} of ${total} IOCs</div>
      ${exports.skippedCount > 0 ? `<div class="misp-export-status ioc-export-warning" role="alert">Some indicators are not export-safe (${exports.skippedCount} skipped from export blocks).</div>` : ""}
      <div class="ioc-export-grid">
        ${this.renderIOCExportCard({
          title: "Defanged Indicators",
          description:
            "Domains, URLs, and IPs defanged where appropriate. Hashes and packages remain raw.",
          id: "ioc-export-defanged",
          value: exports.defanged,
          disabled: noMatches,
        })}
        ${this.renderIOCExportCard({
          title: "SIEM Wildcard OR",
          description: this.shouldWildcardSIEMExport()
            ? "Raw values, wildcard wrapped, quote/backslash escaped for SPL or LogScale pivots."
            : "Raw exact values without wildcards for IP and hash searches.",
          id: "ioc-export-siem",
          value: exports.siem,
          disabled: noMatches,
        })}
        ${this.renderIOCExportCard({
          title: "Comma-Separated Quoted",
          description: "Raw values for CSV, SOAR, and script ingestion.",
          id: "ioc-export-csv",
          value: exports.csv,
          disabled: noMatches,
        })}
        ${this.renderIOCExportCard({
          title: "JSON",
          description:
            "Raw IOC records from the current filtered set without changing the source schema.",
          id: "ioc-export-json",
          value: exports.json,
          disabled: noMatches,
        })}
      </div>
      <div class="ioc-misp-export">
        <button class="btn misp-export-btn" id="misp-export-btn" ${noMatches ? "disabled" : ""}>Export MISP Event JSON</button>
        <span class="misp-export-status" id="misp-export-status"></span>
      </div>
      <h2 class="ioc-section-title">Matching Indicators</h2>
      ${this.renderIOCTable(filtered)}
    `;
    this.bindIOCWorkbenchControls(container);
    this.bindMISPExport(container, filtered);
  },

  // ---- MISP EXPORT ----
  getMISPAttributeType(ioc) {
    const bucket = this.getIOCTypeBucket(ioc);
    const type = String(ioc?.type || "").toLowerCase();
    if (bucket === "domain")
      return { type: "domain", category: "Network activity" };
    if (bucket === "ip")
      return { type: "ip-dst", category: "Network activity" };
    if (type === "sha256")
      return { type: "sha256", category: "Payload delivery" };
    if (type === "md5") return { type: "md5", category: "Payload delivery" };
    if (type === "sha1") return { type: "sha1", category: "Payload delivery" };
    if (bucket === "hash")
      return { type: "sha256", category: "Payload delivery" };
    if (bucket === "url_path")
      return { type: "url", category: "Network activity" };
    if (bucket === "package") return { type: "text", category: "Other" };
    return null;
  },

  buildMISPEvent(iocs) {
    const now = new Date().toISOString().split("T")[0];
    const filterDesc = [];
    if (this.iocTypeFilter !== "all") filterDesc.push(this.iocTypeFilter);
    if (this.iocStatusFilter !== "active")
      filterDesc.push(this.iocStatusFilter);
    const suffix = filterDesc.length ? filterDesc.join("-") : "all";

    const attributes = [];
    const skipped = [];

    for (const ioc of iocs) {
      const raw = this.getIOCValue(ioc);
      if (!raw || !this.isExportSafeIoc(ioc)) {
        skipped.push(ioc);
        continue;
      }
      const mapping = this.getMISPAttributeType(ioc);
      if (!mapping) {
        skipped.push(ioc);
        continue;
      }

      const attr = {
        type: mapping.type,
        category: mapping.category,
        value: raw,
        to_ids: true,
        comment: ioc.context || "",
      };

      if (mapping.type === "text" && ioc.type === "package") {
        attr.comment = `Package indicator: ${raw}. ${ioc.context || ""}`.trim();
      }

      attributes.push(attr);
    }

    const event = {
      Event: {
        info: `LLM ThreatIntel IOC Export - ${now} - ${suffix}`,
        threat_level_id: "2",
        analysis: "2",
        distribution: "0",
        Tag: [{ name: "tlp:clear" }],
        Attribute: attributes,
      },
    };

    return {
      event,
      exported: attributes.length,
      skipped: skipped.length,
      filename: `llm-threatintel-misp-export-${now}-${suffix}.json`,
    };
  },

  bindMISPExport(container, filtered) {
    const btn = container.querySelector("#misp-export-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!filtered || !filtered.length) return;
      const { event, exported, skipped, filename } =
        this.buildMISPEvent(filtered);
      if (exported === 0) return;

      const json = JSON.stringify(event, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      const status = container.querySelector("#misp-export-status");
      if (status) {
        const msg =
          skipped > 0
            ? `Exported ${exported} IOCs. ${skipped} skipped (unsupported format).`
            : `Exported ${exported} IOCs.`;
        status.textContent = msg;
        setTimeout(() => {
          status.textContent = "";
        }, 5000);
      }
    });
  },

  // ---- BLOG ----
  renderBlog(container) {
    if (
      !this.blogIndex ||
      !this.blogIndex.posts ||
      this.blogIndex.posts.length === 0
    ) {
      container.innerHTML = `
        <h1 class="page-title"><span class="title-accent">//</span> Blog</h1>
        <p class="page-subtitle">Analysis, commentary, and research notes on the GenAI threat landscape</p>
        <div id="blog-posts">
          <p style="color:var(--t3);font-size:.85rem;font-style:italic">Blog posts are added manually. Check back for new content.</p>
        </div>
      `;
      return;
    }

    const posts = this.blogIndex.posts;
    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> Blog</h1>
      <p class="page-subtitle">Analysis, commentary, and research notes on the GenAI threat landscape</p>
      <div class="posts-grid">
        ${posts
          .map(
            (post) => `
          <div class="post-card" onclick="window.location.hash='blog/${post.id}'">
            <div class="post-meta">
              <span class="post-date">${post.date}</span>
              <span class="post-tag tag-blog">${post.category}</span>
              <span class="post-tag tag-read-time">${post.readTime}</span>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-excerpt">${this.truncateExcerpt(post.excerpt, 200)}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  },

  async renderBlogPost(container, postId) {
    container.innerHTML = '<div class="loading">Loading blog post...</div>';
    const postMeta = this.blogIndex?.posts.find((p) => p.id === postId);
    if (!postMeta) {
      this.setRouteMeta({
        title: "Post Not Found | LLM ThreatIntel",
        description: this.metaDefaults.description,
        url: `${this.metaDefaults.siteUrl}/`,
      });
      container.innerHTML =
        '<a href="#blog" class="back-link">&larr; Back to blog</a><div class="post-content"><p>Blog post not found.</p></div>';
      return;
    }

    this.setRouteMeta({
      title: `${postMeta.title} | LLM ThreatIntel`,
      description: postMeta.excerpt || this.metaDefaults.description,
      url: `${this.metaDefaults.siteUrl}/#blog/${postId}`,
      type: "article",
    });

    try {
      const response = await fetch(`posts/${postMeta.file}`);
      if (!response.ok) throw new Error("Blog post file not found");
      const markdown = await response.text();
      const bodyMd = this.stripBlogPostFooterMarkdown(markdown);
      const html =
        this.renderMarkdown(bodyMd) +
        this.blogPostBylineHtml() +
        this.blogPostFooterAsideHtml();
      container.innerHTML = `
        <a href="#blog" class="back-link">&larr; Back to blog</a>
        <div class="post-meta" style="margin-bottom:1rem">
          <span class="post-date">${postMeta.date}</span>
          <span class="post-tag tag-blog">${postMeta.category}</span>
          <span class="post-tag tag-read-time">${postMeta.readTime}</span>
        </div>
        <div class="post-content">${html}</div>
      `;
      this.addCopyButtons(container);
    } catch (e) {
      container.innerHTML = `<a href="#blog" class="back-link">&larr; Back</a><div class="post-content"><p>Error: ${e.message}</p></div>`;
    }
  },

  // ---- ABOUT ----
  renderAbout(container) {
    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> About LLM ThreatIntel</h1>
      <div class="about-content">
        <p>LLM ThreatIntel is an automated threat intelligence feed focused on the generative AI and LLM threat landscape. Tracking malicious LLM tools, GenAI-assisted malware, AI supply chain compromises, LLMjacking, shadow AI risks, and nation-state GenAI programs.</p>
        <p>All intelligence news posts are collected from public reports via automated searches. Reports include structured IOCs in multiple copy-paste formats, MITRE ATT&CK mappings, and inline source attribution.</p>
        <h2 class="about-section-title">Sources</h2>
        <ul class="source-list">
          <li><a href="https://www.reversinglabs.com/blog" target="_blank">ReversingLabs</a></li>
          <li><a href="https://socket.dev/blog" target="_blank">Socket.dev</a></li>
          <li><a href="https://www.mandiant.com/resources/blog" target="_blank">Mandiant / Google Threat Intelligence</a></li>
          <li><a href="https://unit42.paloaltonetworks.com" target="_blank">Unit 42</a></li>
          <li><a href="https://www.recordedfuture.com/blog" target="_blank">Recorded Future</a></li>
          <li><a href="https://sysdig.com/blog" target="_blank">Sysdig Threat Research</a></li>
          <li><a href="https://www.bleepingcomputer.com" target="_blank">BleepingComputer</a></li>
          <li><a href="https://thehackernews.com" target="_blank">The Hacker News</a></li>
          <li><a href="https://www.securityweek.com" target="_blank">SecurityWeek</a></li>
          <li><a href="https://www.theregister.com" target="_blank">The Register</a></li>
          <li><a href="https://www.ox.security/blog" target="_blank">OX Security</a></li>
          <li><a href="https://www.stepsecurity.io/blog" target="_blank">StepSecurity</a></li>
          <li><a href="https://blog.phylum.io" target="_blank">Phylum Research</a></li>
        </ul>
        <h2 class="about-section-title">Support</h2>
        <p>Report a bug: <a href="mailto:support@llm-threatintel.com">support@llm-threatintel.com</a></p>
        <h2 class="about-section-title">Disclaimer</h2>
        <p>Independent personal project. Blog section analysis, and research are my own and do not represent any employer.</p>
        <p>Maintained for defensive security research. All intelligence news is automated and comes from public reports. Validate IOCs before production blocking.</p>
      </div>
    `;
  },

  // ---- HELPERS ----
  truncateExcerpt(text, max) {
    if (!text || text.length <= max) return text;
    return text.substring(0, max).replace(/\s+\S*$/, "") + "...";
  },

  escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  escapeAttr(str) {
    return this.escapeHtml(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },

  formatTag(tag) {
    const map = {
      "supply-chain": "Supply Chain",
      "malicious-tool": "Malicious Tool",
      "nation-state": "Nation State",
      "shadow-ai": "Shadow AI",
      llmjacking: "LLMjacking",
      malware: "Malware",
      apt: "APT",
      phishing: "Phishing",
      "model-poisoning": "Model Poisoning",
      "prompt-injection": "Prompt Injection",
      "mcp-security": "MCP Security",
    };
    if (map[tag]) return map[tag];
    return String(tag || "")
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  },

  formatType(type) {
    return String(type || "unknown")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  },

  // ---- ACTOR DETAIL MODAL ----
  openActorDetailModal(actorId, triggerEl) {
    const actor = (this.actorsData?.entries || []).find(
      (a) => a.id === actorId,
    );
    if (!actor) return;

    const mc = document.getElementById("modal-content");
    mc.innerHTML = this.renderActorDetailModal(actor);

    const overlay = document.getElementById("modal-overlay");
    const modal = overlay.querySelector(".modal");
    modal.classList.add("modal--wide");
    modal.setAttribute("aria-hidden", "false");
    overlay.classList.add("open");

    this.lastFocusedActorTrigger = triggerEl || null;
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  },

  renderActorDetailModal(actor) {
    const name = this.escapeHtml(actor.names[0]);
    const aliases =
      actor.names.length > 1
        ? `<div class="actor-modal-aliases">aka: ${this.escapeHtml(actor.names.slice(1).join(", "))}</div>`
        : "";
    const attribution = actor.attribution
      ? `<div class="actor-modal-aliases">Attribution: ${this.escapeHtml(this.stripHtml(actor.attribution))}</div>`
      : "";
    const fullDescription = this.escapeHtml(
      this.stripHtml(actor.description) || "No description available.",
    );
    const distributionHtml = (actor.distribution || [])
      .map((d) => `<span class="ttp-tag">${this.escapeHtml(d)}</span>`)
      .join("");
    const ttpHtml = (actor.ttps || [])
      .map((t) => `<span class="mitre-badge">${this.escapeHtml(t)}</span>`)
      .join("");

    return `
      <div class="actor-modal-header">
        <h2 id="modal-title">${name}</h2>
        <span class="ttp-tag">${this.escapeHtml(this.formatType(actor.type))}</span>
        <span class="actor-status status-${this.escapeHtml(actor.status)}">${this.escapeHtml(actor.status.toUpperCase())}</span>
        <span class="mitre-badge">First seen ${this.escapeHtml(actor.first_seen || "unknown")}</span>
      </div>
      ${aliases}
      ${attribution}
      <p class="actor-modal-description">${fullDescription}</p>
      ${
        distributionHtml
          ? `
        <div class="actor-modal-section-label">Distribution</div>
        <div class="actor-modal-meta">${distributionHtml}</div>
      `
          : ""
      }
      ${
        ttpHtml
          ? `
        <div class="actor-modal-section-label">MITRE ATT&amp;CK</div>
        <div class="actor-modal-ttps">${ttpHtml}</div>
      `
          : ""
      }
    `;
  },
};

// Boot
document.addEventListener("DOMContentLoaded", () => App.init());

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const searchOv = document.getElementById("search-modal-overlay");
  if (searchOv?.classList.contains("open")) {
    App.closeSearchModal();
    return;
  }
  App.closeModal();
});
