/* ============================================================
   LLM ThreatIntel — Core Application JavaScript
   Routing, content loading, rendering, IOC feeds, modals
   ============================================================ */

const App = {
  postsIndex: null,
  actorsData: null,
  iocsData: null,
  blogIndex: null,
  currentFilter: 'all',
  homeTagOrder: ['malicious-tool', 'supply-chain', 'malware', 'shadow-ai', 'llmjacking', 'nation-state', 'apt'],
  actorFilter: 'all',
  actorSearch: '',
  selectedActorId: null,
  lastFocusedActorTrigger: null,
  cleanupHomeFilterBar: null,
  scrollTopButtonHandler: null,
  scrollTopButtonBound: false,
  metaDefaults: {
    siteName: 'LLM ThreatIntel',
    siteUrl: 'https://llm-threatintel.com',
    description: 'Threat intelligence tracking malicious LLM tools, GenAI-assisted malware, supply chain compromises, LLMjacking operations, shadow AI risks, and nation-state GenAI adoption.',
    image: 'https://llm-threatintel.com/assets/og/llm-threatintel-home.png'
  },

  async init() {
    await this.loadData();
    this.setupNav();
    this.initScrollTopButton();
    this.route();
    window.addEventListener('hashchange', () => this.route());
  },

  async loadData() {
    try {
      const [posts, actors, iocs, blog] = await Promise.all([
        fetch('data/posts-index.json').then(r => r.json()),
        fetch('data/actors.json').then(r => r.json()),
        fetch('data/iocs.json').then(r => r.json()),
        fetch('data/blog-index.json').then(r => r.json()).catch(() => ({ posts: [] }))
      ]);
      this.postsIndex = posts;
      this.actorsData = actors;
      this.iocsData = iocs;
      this.blogIndex = blog;
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  },

  setupNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }
    document.querySelectorAll('.site-nav a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  },

  upsertMeta(attrName, attrValue, content) {
    let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  },

  upsertLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  },

  setRouteMeta({ title, description, url, type = 'website', image = null }) {
    const finalTitle = title || `${this.metaDefaults.siteName} | GenAI Threat Intelligence`;
    const finalDescription = description || this.metaDefaults.description;
    const finalUrl = url || `${this.metaDefaults.siteUrl}/`;
    const finalImage = image || this.metaDefaults.image;

    document.title = finalTitle;
    this.upsertMeta('name', 'description', finalDescription);
    this.upsertMeta('property', 'og:title', finalTitle);
    this.upsertMeta('property', 'og:description', finalDescription);
    this.upsertMeta('property', 'og:url', finalUrl);
    this.upsertMeta('property', 'og:type', type);
    this.upsertMeta('property', 'og:image', finalImage);
    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:title', finalTitle);
    this.upsertMeta('name', 'twitter:description', finalDescription);
    this.upsertMeta('name', 'twitter:image', finalImage);
    this.upsertLink('canonical', finalUrl);
  },

  route() {
    const hash = window.location.hash || '#home';
    const [page, ...params] = hash.slice(1).split('/');

    this.cleanupHomeFilterBar?.();
    this.cleanupHomeFilterBar = null;

    document.querySelectorAll('.site-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + page);
    });

    const content = document.getElementById('app-content');

    switch (page) {
      case 'home':
        this.setRouteMeta({
          title: 'LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI',
          description: this.metaDefaults.description,
          url: `${this.metaDefaults.siteUrl}/`
        });
        this.renderHome(content);
        break;
      case 'post':
        this.renderPost(content, params.join('/'));
        break;
      case 'actors':
        this.setRouteMeta({
          title: 'Threat Actor Tracker | LLM ThreatIntel',
          description: 'Searchable tracker of malicious LLM tools, threat actors, malware families, and campaigns in the GenAI and LLM threat landscape.',
          url: `${this.metaDefaults.siteUrl}/#actors`
        });
        this.renderActors(content);
        break;
      case 'ioc-feed':
        this.setRouteMeta({
          title: 'IOC Feed | LLM ThreatIntel',
          description: 'Copy-paste ready IOC feed with defanged indicators, Splunk/LogScale OR format, and comma-separated quoted formats.',
          url: `${this.metaDefaults.siteUrl}/#ioc-feed`
        });
        this.renderIOCFeed(content);
        break;
      case 'blog':
        if (params.length > 0) {
          this.renderBlogPost(content, params.join('/'));
        } else {
          this.setRouteMeta({
            title: 'Blog | LLM ThreatIntel',
            description: 'Analysis, commentary, and research notes on the GenAI threat landscape.',
            url: `${this.metaDefaults.siteUrl}/#blog`
          });
          this.renderBlog(content);
        }
        break;
      case 'about':
        this.setRouteMeta({
          title: 'About | LLM ThreatIntel',
          description: this.metaDefaults.description,
          url: `${this.metaDefaults.siteUrl}/#about`
        });
        this.renderAbout(content);
        break;
      default:
        this.setRouteMeta({
          title: 'LLM ThreatIntel | GenAI Threat Intelligence, Malicious LLM Tools, LLMjacking, Shadow AI',
          description: this.metaDefaults.description,
          url: `${this.metaDefaults.siteUrl}/`
        });
        this.renderHome(content);
    }
    window.scrollTo(0, 0);
    this.scrollTopButtonHandler?.();
  },

  initScrollTopButton() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn || this.scrollTopButtonBound) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const toggleVisibility = () => {
      const shouldShow = window.scrollY > 400;
      btn.classList.toggle('visible', shouldShow);
      btn.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
      btn.tabIndex = shouldShow ? 0 : -1;
    };

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    this.scrollTopButtonHandler = toggleVisibility;
    this.scrollTopButtonBound = true;
    toggleVisibility();
  },

  // ---- DEFANGING ----
  defangDomain(d) {
    if (typeof d !== 'string') return d;
    if (d.includes('[.]')) return d;
    const lastDot = d.lastIndexOf('.');
    if (lastDot === -1) return d;
    return d.substring(0, lastDot) + '[.]' + d.substring(lastDot + 1);
  },

  defangIP(ip) {
    if (typeof ip !== 'string') return ip;
    if (ip.includes('[.]')) return ip;
    const lastDot = ip.lastIndexOf('.');
    if (lastDot === -1) return ip;
    return ip.substring(0, lastDot) + '[.]' + ip.substring(lastDot + 1);
  },

  defangURL(url) {
    if (typeof url !== 'string') return url;
    if (url.includes('[.]')) return url;
    const slashIdx = url.indexOf('/');
    if (slashIdx === -1) return this.defangDomain(url);
    const domain = url.substring(0, slashIdx);
    const path = url.substring(slashIdx);
    return this.defangDomain(domain) + path;
  },

  defangIOC(ioc) {
    if (ioc.type === 'domain') return this.defangDomain(ioc.value);
    if (ioc.type === 'ip') return this.defangIP(ioc.value);
    if (ioc.type === 'url_path') return this.defangURL(ioc.value);
    return ioc.value;
  },

  isHashType(t) {
    return t === 'sha256' || t === 'sha1' || t === 'md5' || t === 'hash';
  },

  // ---- COPY WITH FALLBACK ----
  copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => this.flashCopied(btn))
        .catch(() => this.fallbackCopy(text, btn));
    } else {
      this.fallbackCopy(text, btn);
    }
  },

  fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.flashCopied(btn);
    } catch (e) {
      if (btn) {
        btn.textContent = 'Selected — Ctrl+C';
        setTimeout(() => { btn.textContent = 'Copy'; }, 3000);
      }
    }
    document.body.removeChild(ta);
  },

  flashCopied(btn) {
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  },

  copyFeedById(id, btn) {
    const el = document.getElementById(id);
    if (el) this.copyText(el.textContent, btn);
  },

  // ---- IOC MODAL ----
  showIOCModal(type) {
    if (!this.iocsData) return;
    const iocs = this.iocsData.iocs;
    let filtered;
    let title;

    if (type === 'all') {
      filtered = iocs.filter(i => i.status === 'active');
      title = 'All Active IOCs';
    } else if (type === 'hash') {
      filtered = iocs.filter(i => this.isHashType(i.type) && i.status === 'active');
      title = 'File Hash IOCs';
    } else if (type === 'package') {
      filtered = iocs.filter(i => i.type === 'package' && i.status === 'active');
      title = 'Package IOCs';
    } else {
      filtered = iocs.filter(i => i.type === type && i.status === 'active');
      title = type === 'domain' ? 'Domain IOCs' : type === 'url_path' ? 'URL Path IOCs' : type === 'ip' ? 'IP Address IOCs' : 'IOCs';
    }

    const defangedList = filtered.map(i => this.defangIOC(i)).join('\n');
    const splunkList = filtered.map(i => '"' + i.value + '"').join(' OR ');
    const csvList = filtered.map(i => '"' + i.value + '"').join(', ');

    const mc = document.getElementById('modal-content');
    mc.innerHTML = `
      <h2 id="modal-title">${title} (${filtered.length})</h2>
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
            <thead><tr><th>Indicator</th><th>Context</th><th>Campaign</th></tr></thead>
            <tbody>${filtered.map(i => `<tr>
              <td style="font-family:var(--fm);font-size:.76rem;word-break:break-all">${this.escapeHtml(this.defangIOC(i))}</td>
              <td style="font-size:.8rem;color:var(--t2)">${this.escapeHtml(i.context)}</td>
              <td><span class="ttp-tag">${this.escapeHtml(i.campaign)}</span></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    `;
    const overlay = document.getElementById('modal-overlay');
    overlay.querySelector('.modal').setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const modal = overlay.querySelector('.modal');
    overlay.classList.remove('open');
    modal.classList.remove('modal--wide');
    modal.setAttribute('aria-hidden', 'true');
    if (this.lastFocusedActorTrigger) {
      this.lastFocusedActorTrigger.focus();
      this.lastFocusedActorTrigger = null;
    }
  },

  // ---- HOME PAGE ----
  renderHome(container) {
    if (!this.postsIndex) {
      container.innerHTML = '<div class="loading">Loading intel feed...</div>';
      return;
    }

    const posts = this.postsIndex.posts;
    const activeIOCs = this.iocsData ? this.iocsData.iocs.filter(i => i.status === 'active').length : 0;
    const activeActors = this.actorsData ? this.actorsData.entries.filter(e => e.status === 'active').length : 0;
    const discoveredTags = [...new Set(posts.flatMap(p => p.tags))];
    const allTags = [
      ...this.homeTagOrder.filter(tag => discoveredTags.includes(tag)),
      ...discoveredTags.filter(tag => !this.homeTagOrder.includes(tag))
    ];
    const activeFilter = this.currentFilter === 'all' || allTags.includes(this.currentFilter)
      ? this.currentFilter
      : 'all';

    this.currentFilter = activeFilter;

    container.innerHTML = `
      <div class="status-bar">
        <div class="status-item"><span class="status-dot"></span><span class="status-value">OPERATIONAL</span></div>
        <div class="status-item"><span class="status-label">Updated</span><span class="status-value">${this.iocsData?.last_updated || 'N/A'}</span></div>
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
      <p class="page-subtitle">Automated GenAI and LLM threat intelligence feed for defenders</p>
      <div class="filter-bar-wrap">
        <div class="filter-bar" role="group" aria-label="Post category filters" aria-controls="posts-grid">
          <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
          ${allTags.map(tag => `<button class="filter-btn ${activeFilter === tag ? 'active' : ''}" data-filter="${tag}">${this.formatTag(tag)}</button>`).join('')}
        </div>
      </div>
      <div class="posts-grid" id="posts-grid">${this.renderPostCards(posts)}</div>
      <div class="feed-disclaimer" aria-label="Feed disclaimer">
        <h2 class="about-section-title">Disclaimer</h2>
        <p>This news feed is automated. The data comes from public reports only and open source community. Validate IOCs before production blocking.</p>
      </div>
    `;

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterPosts();

        if (window.innerWidth <= 768) {
          this.scrollActiveFilterIntoView(container);
        }
      });
    });

    this.filterPosts();
    this.setupHomeFilterBar(container);
  },

  scrollActiveFilterIntoView(container, smooth = true) {
    const activeBtn = container?.querySelector('.filter-bar .filter-btn.active');
    const bar = container?.querySelector('.filter-bar-wrap.is-stuck .filter-bar');

    if (!activeBtn || !bar) return;

    activeBtn.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      inline: 'center',
      block: 'nearest'
    });
  },

  setupHomeFilterBar(container) {
    const wrap = container.querySelector('.filter-bar-wrap');
    const bar = wrap?.querySelector('.filter-bar');
    if (!wrap || !bar) return;
    const getTopOffset = () => {
      return document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    };

    let wasStuck = false;
    let stateTimer = null;

    const syncFilterBar = () => {
      wrap.style.setProperty('--filter-bar-height', `${bar.offsetHeight}px`);

      const topDelta = wrap.getBoundingClientRect().top - getTopOffset();
      const isMobile = window.innerWidth <= 768;
      const enterThreshold = isMobile ? -10 : 0;
      const exitThreshold = isMobile ? 16 : 0;

      const isStuck = wasStuck
        ? topDelta <= exitThreshold
        : topDelta <= enterThreshold;

      if (isMobile && isStuck !== wasStuck) {
        wrap.classList.add('is-animating');
        window.clearTimeout(stateTimer);
        stateTimer = window.setTimeout(() => {
          wrap.classList.remove('is-animating');
        }, 220);
      }

      wrap.classList.toggle('is-stuck', isStuck);

      if (window.innerWidth <= 768 && isStuck && !wasStuck) {
        this.scrollActiveFilterIntoView(container, false);
      }

      wasStuck = isStuck;
    };

    const handleScroll = () => syncFilterBar();
    const handleResize = () => syncFilterBar();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => syncFilterBar());
      resizeObserver.observe(bar);
    }

    requestAnimationFrame(syncFilterBar);

    this.cleanupHomeFilterBar = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      window.clearTimeout(stateTimer);
      wrap.classList.remove('is-stuck');
      wrap.classList.remove('is-animating');
      wrap.style.removeProperty('--filter-bar-height');
    };
  },

  renderPostCards(posts) {
    return posts.map(post => `
      <div class="post-card" data-tags="${post.tags.join(',')}" data-title="${post.title.toLowerCase()}" onclick="window.location.hash='post/${post.id}'">
        <div class="post-meta">
          <span class="post-date">${post.date}</span>
          ${post.tags.map(t => `<span class="post-tag tag-${t}">${this.formatTag(t)}</span>`).join('')}
          <span class="post-tag tlp-clear">${post.tlp}</span>
        </div>
        <div class="post-title">${post.title}</div>
        <div class="post-excerpt">${this.truncateExcerpt(post.excerpt, 220)}</div>
      </div>
    `).join('');
  },

  filterPosts() {
    document.querySelectorAll('.post-card').forEach(card => {
      const tags = card.dataset.tags;
      const matchesFilter = this.currentFilter === 'all' || tags.includes(this.currentFilter);
      card.style.display = matchesFilter ? '' : 'none';
    });
  },

  // ---- SINGLE POST ----
  async renderPost(container, postId) {
    container.innerHTML = '<div class="loading">Loading report...</div>';
    const postMeta = this.postsIndex?.posts.find(p => p.id === postId);
    if (!postMeta) {
      this.setRouteMeta({
        title: 'Post Not Found | LLM ThreatIntel',
        description: this.metaDefaults.description,
        url: `${this.metaDefaults.siteUrl}/`
      });
      container.innerHTML = '<a href="#home" class="back-link">&larr; Back to feed</a><div class="post-content"><p>Post not found.</p></div>';
      return;
    }

    const postHtml = postMeta.file.replace(/\.md$/i, '.html');
    this.setRouteMeta({
      title: `${postMeta.title} | LLM ThreatIntel`,
      description: postMeta.excerpt || this.metaDefaults.description,
      url: `${this.metaDefaults.siteUrl}/posts/${postHtml}`,
      type: 'article'
    });

    try {
      const response = await fetch(`posts/${postMeta.file}`);
      if (!response.ok) throw new Error('Post file not found');
      const markdown = await response.text();
      const html = this.renderMarkdown(markdown);
      container.innerHTML = `
        <a href="#home" class="back-link">&larr; Back to feed</a>
        <div class="post-meta" style="margin-bottom:1rem">
          <span class="post-date">${postMeta.date}</span>
          ${postMeta.tags.map(t => `<span class="post-tag tag-${t}">${this.formatTag(t)}</span>`).join('')}
          <span class="post-tag tlp-clear">${postMeta.tlp}</span>
        </div>
        <div class="post-content">${html}</div>
      `;
      this.addCopyButtons(container);
    } catch (e) {
      container.innerHTML = `<a href="#home" class="back-link">&larr; Back</a><div class="post-content"><p>Error: ${e.message}</p></div>`;
    }
  },

  blogPostBylineHtml() {
    return '';
  },

  blogPostFooterAsideHtml() {
    return `
    <div class="post-footer-aside">
      <h2 class="about-section-title">Project Notes</h2>
      <p>LLM ThreatIntel is maintained independently as a personal defensive-research project focused on the generative AI and LLM threat landscape.</p>
      <p>Report a bug: <a href="mailto:support@llm-threatintel.com">support@llm-threatintel.com</a></p>
      <h2 class="about-section-title">Disclaimer</h2>
      <p>Independent personal project. Blog section analysis, and research are my own and do not represent any employer.</p>
    </div>`;
  },

  stripBlogPostFooterMarkdown(md) {
    return md.replace(/\r?\n---\s*\r?\n\s*## (?:Support LLM ThreatIntel|Project Notes)[\s\S]*$/m, '').trim();
  },

  renderMarkdown(md) {
    const codeBlocks = [];
    let html = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({ lang: lang || '', code: code.trim() });
      return `\n\nCODEBLOCKPLACEHOLDER_${idx}\n\n`;
    });
    html = html
      .replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n)*)/gm, (match, header, body) => {
        const headers = header.split('|').map(h => h.trim()).filter(Boolean);
        const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(Boolean));
        return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      })
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^---$/gm, '<hr>')
      .replace(/^(?!<[hlutbp]|<\/|<li|<block|<hr)(.[^\n]+)$/gm, '<p>$1</p>');
    html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');
    html = html.replace(/<p>\s*<\/p>/g, '');
    const preHtml = (idx) => {
      const b = codeBlocks[Number(idx)];
      const lang = this.escapeHtml(b.lang);
      return `<pre><code class="language-${lang}">${this.escapeHtml(b.code)}</code></pre>`;
    };
    html = html.replace(/<p>CODEBLOCKPLACEHOLDER_(\d+)<\/p>/g, (_, idx) => preHtml(idx));
    html = html.replace(/CODEBLOCKPLACEHOLDER_(\d+)/g, (_, idx) => preHtml(idx));
    return html;
  },

  addCopyButtons(container) {
    container.querySelectorAll('pre').forEach(pre => {
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = pre.querySelector('code');
        this.copyText(code.textContent, btn);
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  },

  // ---- ACTORS ----
  getActorBucket(actor) {
    if (actor.type === 'malicious_llm_tool') return 'malicious_tools';
    if (actor.type === 'malware' || actor.type === 'supply_chain_campaign') return 'malware';
    if (actor.type === 'threat_group' || (actor.type || '').includes('nation')) return 'threat_groups';
    return 'other';
  },

  stripHtml(value) {
    return String(value || '').replace(/<[^>]*>/g, '').trim();
  },

  getActorSummary(actor, max = 180) {
    const cleanDescription = this.stripHtml(actor.description);
    if (cleanDescription) return this.truncateExcerpt(cleanDescription, max);

    const parts = [];
    if (actor.type) parts.push(this.formatType(actor.type));
    if (actor.status) parts.push(`status: ${actor.status}`);
    if (actor.distribution?.length) parts.push(`distribution: ${actor.distribution.slice(0, 2).join(', ')}`);
    if (actor.ttps?.length) parts.push(`TTPs: ${actor.ttps.slice(0, 2).map(t => t.split(' - ')[0]).join(', ')}`);

    return this.truncateExcerpt(parts.join(' · '), max) || 'No summary available yet.';
  },

  getFilteredActors() {
    const term = this.actorSearch.trim().toLowerCase();

    return (this.actorsData?.entries || []).filter(actor => {
      const matchesFilter =
        this.actorFilter === 'all' || this.getActorBucket(actor) === this.actorFilter;

      const searchBlob = [
        ...(actor.names || []),
        actor.attribution || '',
        actor.description || '',
        ...(actor.ttps || []),
        ...(actor.distribution || [])
      ].join(' ').toLowerCase();

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

    const tableHtml = filtered.length === 0
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
              ${filtered.map(actor => `
                <tr
                  data-actor-id="${this.escapeHtml(actor.id)}"
                  tabindex="0"
                  role="button"
                  aria-label="View details for ${this.escapeHtml(actor.names[0])}"
                >
                  <td>
                    <div class="actor-name">${this.escapeHtml(actor.names[0])}</div>
                    ${actor.names.length > 1 ? `<div class="actor-aliases">aka: ${this.escapeHtml(actor.names.slice(1).join(', '))}</div>` : ''}
                    ${actor.attribution ? `<div class="actor-aliases">Attr: ${this.escapeHtml(this.stripHtml(actor.attribution))}</div>` : ''}
                    <div class="actor-summary">${this.escapeHtml(this.getActorSummary(actor))}</div>
                    <span class="actor-row-cta">View details &rarr;</span>
                  </td>
                  <td><span class="ttp-tag">${this.escapeHtml(this.formatType(actor.type))}</span></td>
                  <td><span class="actor-status status-${this.escapeHtml(actor.status)}">${this.escapeHtml(actor.status.toUpperCase())}</span></td>
                  <td style="font-family:var(--fm);font-size:.78rem;color:var(--t2)">${this.escapeHtml(actor.first_seen || '')}</td>
                  <td style="font-size:.82rem;color:var(--t2)">${this.escapeHtml((actor.distribution || []).join(', '))}</td>
                  <td>${(actor.ttps || []).slice(0, 3).map(t => `<span class="mitre-badge">${this.escapeHtml(t.split(' - ')[0])}</span>`).join(' ')}</td>
                </tr>
              `).join('')}
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
        <div class="stat-card actor-filter-card ${this.actorFilter === 'all' ? 'active-filter' : ''}" data-filter="all">
          <div class="stat-value">${actors.filter(a => a.status === 'active').length}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-card actor-filter-card ${this.actorFilter === 'malicious_tools' ? 'active-filter' : ''}" data-filter="malicious_tools">
          <div class="stat-value">${actors.filter(a => a.type === 'malicious_llm_tool').length}</div>
          <div class="stat-label">Malicious Tools</div>
        </div>
        <div class="stat-card actor-filter-card ${this.actorFilter === 'threat_groups' ? 'active-filter' : ''}" data-filter="threat_groups">
          <div class="stat-value">${actors.filter(a => a.type === 'threat_group' || (a.type || '').includes('nation')).length}</div>
          <div class="stat-label">Threat Groups</div>
        </div>
        <div class="stat-card actor-filter-card ${this.actorFilter === 'malware' ? 'active-filter' : ''}" data-filter="malware">
          <div class="stat-value">${actors.filter(a => a.type === 'malware' || a.type === 'supply_chain_campaign').length}</div>
          <div class="stat-label">Malware</div>
        </div>
      </div>

      <p class="actor-list-instruction">Click any actor row to open the full detail panel.</p>

      ${tableHtml}
    `;

    const searchInput = container.querySelector('#search-actors');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.actorSearch = e.target.value;
        this.renderActors(container);
        const next = container.querySelector('#search-actors');
        if (next) {
          next.focus();
          next.setSelectionRange(this.actorSearch.length, this.actorSearch.length);
        }
      });
    }

    container.querySelectorAll('.actor-filter-card').forEach(card => {
      card.addEventListener('click', () => {
        this.actorFilter = card.dataset.filter;
        this.renderActors(container);
      });
    });

    container.querySelectorAll('#actor-table tbody tr').forEach(row => {
      const open = () => {
        this.selectedActorId = row.dataset.actorId;
        this.openActorDetailModal(row.dataset.actorId, row);
      };
      row.addEventListener('click', open);
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  },

  // ---- IOC FEED ----
  renderIOCFeed(container) {
    if (!this.iocsData) { container.innerHTML = '<div class="loading">Loading...</div>'; return; }
    const iocs = this.iocsData.iocs;
    const active = iocs.filter(i => i.status === 'active');
    const domains = active.filter(i => i.type === 'domain');
    const urls = active.filter(i => i.type === 'url_path');
    const ips = active.filter(i => i.type === 'ip');
    const hashes = active.filter(i => this.isHashType(i.type));
    const packages = active.filter(i => i.type === 'package');

    const defangedDomains = domains.map(d => this.defangDomain(d.value)).join('\n');
    const defangedUrls = urls.map(u => this.defangURL(u.value)).join('\n');
    const defangedIPs = ips.map(ip => this.defangIP(ip.value)).join('\n');
    const hashList = hashes.map(h => h.value).join('\n');
    const packageList = packages.map(p => p.value).join('\n');
    const allValues = active.map(i => i.value);
    const splunkFeed = allValues.map(v => '"' + v + '"').join(' OR ');
    const csvFeed = allValues.map(v => '"' + v + '"').join(', ');

    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> IOC Feed</h1>
      <p class="page-subtitle">Click tiles to filter by type. All formats copy-paste ready for your tools.</p>
      <div class="stats-row">
        <div class="stat-card" onclick="App.showIOCModal('domain')"><div class="stat-value">${domains.length}</div><div class="stat-label">Domains</div></div>
        <div class="stat-card" onclick="App.showIOCModal('url_path')"><div class="stat-value">${urls.length}</div><div class="stat-label">URLs</div></div>
        <div class="stat-card" onclick="App.showIOCModal('ip')"><div class="stat-value">${ips.length}</div><div class="stat-label">IPs</div></div>
        <div class="stat-card" onclick="App.showIOCModal('hash')"><div class="stat-value">${hashes.length}</div><div class="stat-label">Hashes</div></div>
        <div class="stat-card" onclick="App.showIOCModal('package')"><div class="stat-value">${packages.length}</div><div class="stat-label">Packages</div></div>
        <div class="stat-card" onclick="App.showIOCModal('all')"><div class="stat-value">${active.length}</div><div class="stat-label">All Active</div></div>
      </div>
      <div class="feed-card"><h3>Defanged Domains</h3><div class="feed-description">Last dot before TLD replaced with [.]</div><div class="feed-output" id="fd1">${this.escapeHtml(defangedDomains || 'No domain IOCs')}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd1',this)">Copy</button></div></div>
      <div class="feed-card"><h3>Defanged URLs</h3><div class="feed-description">Full paths with defanged domain</div><div class="feed-output" id="fd2">${this.escapeHtml(defangedUrls || 'No URL IOCs')}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd2',this)">Copy</button></div></div>
      ${ips.length > 0 ? `<div class="feed-card"><h3>Defanged IPs</h3><div class="feed-description">Last octet dot replaced with [.]</div><div class="feed-output" id="fd3">${this.escapeHtml(defangedIPs)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd3',this)">Copy</button></div></div>` : ''}
      ${hashes.length > 0 ? `<div class="feed-card"><h3>File Hashes</h3><div class="feed-description">SHA256, SHA1, MD5 file hashes from campaign reports</div><div class="feed-output" id="fd_hash">${this.escapeHtml(hashList)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd_hash',this)">Copy</button></div></div>` : ''}
      ${packages.length > 0 ? `<div class="feed-card"><h3>Package Indicators</h3><div class="feed-description">npm, PyPI, and other ecosystem package identifiers</div><div class="feed-output" id="fd_pkg">${this.escapeHtml(packageList)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd_pkg',this)">Copy</button></div></div>` : ''}
      <div class="feed-card"><h3>Splunk / LogScale — OR Delimited</h3><div class="feed-description">Clean values, quoted, OR delimited. Paste into SPL or LQL.</div><div class="feed-output" id="fd4">${this.escapeHtml(splunkFeed)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd4',this)">Copy</button></div></div>
      <div class="feed-card"><h3>Comma-Separated Quoted</h3><div class="feed-description">For CSV, SOAR, or script ingestion</div><div class="feed-output" id="fd5">${this.escapeHtml(csvFeed)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd5',this)">Copy</button></div></div>
    `;
  },

  // ---- BLOG ----
  renderBlog(container) {
    if (!this.blogIndex || !this.blogIndex.posts || this.blogIndex.posts.length === 0) {
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
        ${posts.map(post => `
          <div class="post-card" onclick="window.location.hash='blog/${post.id}'">
            <div class="post-meta">
              <span class="post-date">${post.date}</span>
              <span class="post-tag tag-blog">${post.category}</span>
              <span class="post-tag tag-read-time">${post.readTime}</span>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-excerpt">${this.truncateExcerpt(post.excerpt, 200)}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async renderBlogPost(container, postId) {
    container.innerHTML = '<div class="loading">Loading blog post...</div>';
    const postMeta = this.blogIndex?.posts.find(p => p.id === postId);
    if (!postMeta) {
      this.setRouteMeta({
        title: 'Post Not Found | LLM ThreatIntel',
        description: this.metaDefaults.description,
        url: `${this.metaDefaults.siteUrl}/`
      });
      container.innerHTML = '<a href="#blog" class="back-link">&larr; Back to blog</a><div class="post-content"><p>Blog post not found.</p></div>';
      return;
    }

    this.setRouteMeta({
      title: `${postMeta.title} | LLM ThreatIntel`,
      description: postMeta.excerpt || this.metaDefaults.description,
      url: `${this.metaDefaults.siteUrl}/#blog/${postId}`,
      type: 'article'
    });

    try {
      const response = await fetch(`posts/${postMeta.file}`);
      if (!response.ok) throw new Error('Blog post file not found');
      const markdown = await response.text();
      const bodyMd = this.stripBlogPostFooterMarkdown(markdown);
      const html = this.renderMarkdown(bodyMd) + this.blogPostBylineHtml() + this.blogPostFooterAsideHtml();
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
        <p class="about-note">Independent personal project. Blog section analysis, and research are my own and do not represent any employer.</p>
        <h2 class="about-section-title">Sources</h2>
        <ul class="source-list">
          <li><a href="https://www.reversinglabs.com/blog" target="_blank">ReversingLabs</a></li>
          <li><a href="https://socket.dev/blog" target="_blank">Socket.dev</a></li>
          <li><a href="https://blog.phylum.io" target="_blank">Phylum Research</a></li>
          <li><a href="https://www.mandiant.com/resources/blog" target="_blank">Mandiant / Google Threat Intelligence</a></li>
          <li><a href="https://unit42.paloaltonetworks.com" target="_blank">Unit 42</a></li>
          <li><a href="https://www.recordedfuture.com/blog" target="_blank">Recorded Future</a></li>
          <li><a href="https://sysdig.com/blog" target="_blank">Sysdig Threat Research</a></li>
          <li><a href="https://www.bleepingcomputer.com" target="_blank">BleepingComputer</a></li>
          <li><a href="https://thehackernews.com" target="_blank">The Hacker News</a></li>
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
    return text.substring(0, max).replace(/\s+\S*$/, '') + '...';
  },

  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  formatTag(tag) {
    const map = {
      'supply-chain': 'Supply Chain', 'malicious-tool': 'Malicious Tool',
      'nation-state': 'Nation State', 'shadow-ai': 'Shadow AI',
      'llmjacking': 'LLMjacking', 'malware': 'Malware', 'apt': 'APT'
    };
    return map[tag] || tag;
  },

  formatType(type) {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  },

  // ---- ACTOR DETAIL MODAL ----
  openActorDetailModal(actorId, triggerEl) {
    const actor = (this.actorsData?.entries || []).find(a => a.id === actorId);
    if (!actor) return;

    const mc = document.getElementById('modal-content');
    mc.innerHTML = this.renderActorDetailModal(actor);

    const overlay = document.getElementById('modal-overlay');
    const modal = overlay.querySelector('.modal');
    modal.classList.add('modal--wide');
    modal.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');

    this.lastFocusedActorTrigger = triggerEl || null;
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  },

  renderActorDetailModal(actor) {
    const name = this.escapeHtml(actor.names[0]);
    const aliases = actor.names.length > 1
      ? `<div class="actor-modal-aliases">aka: ${this.escapeHtml(actor.names.slice(1).join(', '))}</div>`
      : '';
    const attribution = actor.attribution
      ? `<div class="actor-modal-aliases">Attribution: ${this.escapeHtml(this.stripHtml(actor.attribution))}</div>`
      : '';
    const fullDescription = this.escapeHtml(this.stripHtml(actor.description) || 'No description available.');
    const distributionHtml = (actor.distribution || [])
      .map(d => `<span class="ttp-tag">${this.escapeHtml(d)}</span>`).join('');
    const ttpHtml = (actor.ttps || [])
      .map(t => `<span class="mitre-badge">${this.escapeHtml(t)}</span>`).join('');

    return `
      <div class="actor-modal-header">
        <h2 id="modal-title">${name}</h2>
        <span class="ttp-tag">${this.escapeHtml(this.formatType(actor.type))}</span>
        <span class="actor-status status-${this.escapeHtml(actor.status)}">${this.escapeHtml(actor.status.toUpperCase())}</span>
        <span class="mitre-badge">First seen ${this.escapeHtml(actor.first_seen || 'unknown')}</span>
      </div>
      ${aliases}
      ${attribution}
      <p class="actor-modal-description">${fullDescription}</p>
      ${distributionHtml ? `
        <div class="actor-modal-section-label">Distribution</div>
        <div class="actor-modal-meta">${distributionHtml}</div>
      ` : ''}
      ${ttpHtml ? `
        <div class="actor-modal-section-label">MITRE ATT&amp;CK</div>
        <div class="actor-modal-ttps">${ttpHtml}</div>
      ` : ''}
    `;
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());

// Modal close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') App.closeModal(); });
