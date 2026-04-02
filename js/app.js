/* ============================================================
   LLM ThreatIntel — Core Application JavaScript
   Routing, content loading, rendering, IOC feeds, modals
   ============================================================ */

const App = {
  postsIndex: null,
  actorsData: null,
  iocsData: null,
  currentFilter: 'all',

  async init() {
    await this.loadData();
    this.setupNav();
    this.route();
    window.addEventListener('hashchange', () => this.route());
  },

  async loadData() {
    try {
      const [posts, actors, iocs] = await Promise.all([
        fetch('data/posts-index.json').then(r => r.json()),
        fetch('data/actors.json').then(r => r.json()),
        fetch('data/iocs.json').then(r => r.json())
      ]);
      this.postsIndex = posts;
      this.actorsData = actors;
      this.iocsData = iocs;
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

  route() {
    const hash = window.location.hash || '#home';
    const [page, ...params] = hash.slice(1).split('/');

    document.querySelectorAll('.site-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + page);
    });

    const content = document.getElementById('app-content');

    switch (page) {
      case 'home': this.renderHome(content); break;
      case 'post': this.renderPost(content, params.join('/')); break;
      case 'actors': this.renderActors(content); break;
      case 'ioc-feed': this.renderIOCFeed(content); break;
      case 'blog': this.renderBlog(content); break;
      case 'about': this.renderAbout(content); break;
      default: this.renderHome(content);
    }
    window.scrollTo(0, 0);
  },

  // ---- DEFANGING ----
  defangDomain(d) {
    const lastDot = d.lastIndexOf('.');
    if (lastDot === -1) return d;
    return d.substring(0, lastDot) + '[.]' + d.substring(lastDot + 1);
  },

  defangIP(ip) {
    const lastDot = ip.lastIndexOf('.');
    if (lastDot === -1) return ip;
    return ip.substring(0, lastDot) + '[.]' + ip.substring(lastDot + 1);
  },

  defangURL(url) {
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
    } else {
      filtered = iocs.filter(i => i.type === type);
      title = type === 'domain' ? 'Domain IOCs' : type === 'url_path' ? 'URL Path IOCs' : type === 'ip' ? 'IP Address IOCs' : 'IOCs';
    }

    const defangedList = filtered.map(i => this.defangIOC(i)).join('\n');
    const splunkList = filtered.map(i => '"' + i.value + '"').join(' OR ');
    const csvList = filtered.map(i => '"' + i.value + '"').join(', ');

    const mc = document.getElementById('modal-content');
    mc.innerHTML = `
      <h2>${title} (${filtered.length})</h2>
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
    document.getElementById('modal-overlay').classList.add('open');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
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
    const allTags = [...new Set(posts.flatMap(p => p.tags))];

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
      <div class="filter-bar">
        <button class="filter-btn active" data-filter="all">All</button>
        ${allTags.map(tag => `<button class="filter-btn" data-filter="${tag}">${this.formatTag(tag)}</button>`).join('')}
      </div>
      <div class="posts-grid" id="posts-grid">${this.renderPostCards(posts)}</div>
    `;

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterPosts();
      });
    });
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
      container.innerHTML = '<a href="#home" class="back-link">&larr; Back to feed</a><div class="post-content"><p>Post not found.</p></div>';
      return;
    }
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

  renderMarkdown(md) {
    let html = md
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`)
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
  renderActors(container) {
    if (!this.actorsData) { container.innerHTML = '<div class="loading">Loading...</div>'; return; }
    const actors = this.actorsData.entries;
    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> Threat Actor Tracker</h1>
      <p class="page-subtitle">${actors.length} entries tracked across malicious tools, malware, campaigns, and nation-state programs</p>
      <div class="search-input-wrap"><input type="text" class="search-input" placeholder="Search actors, aliases, TTPs..." id="search-actors"></div>
      <div class="stats-row">
        <div class="stat-card"><div class="stat-value">${actors.filter(a => a.status === 'active').length}</div><div class="stat-label">Active</div></div>
        <div class="stat-card"><div class="stat-value">${actors.filter(a => a.type === 'malicious_llm_tool').length}</div><div class="stat-label">Malicious Tools</div></div>
        <div class="stat-card"><div class="stat-value">${actors.filter(a => a.type.includes('nation') || a.type === 'threat_group').length}</div><div class="stat-label">Threat Groups</div></div>
        <div class="stat-card"><div class="stat-value">${actors.filter(a => a.type === 'malware' || a.type === 'supply_chain_campaign').length}</div><div class="stat-label">Malware</div></div>
      </div>
      <div class="actor-table-wrap">
        <table class="actor-table" id="actor-table">
          <thead><tr><th>Name / Aliases</th><th>Type</th><th>Status</th><th>First Seen</th><th>Distribution</th><th>Key TTPs</th></tr></thead>
          <tbody>${actors.map(actor => `
            <tr data-search="${[...actor.names, actor.description, ...actor.ttps, ...(actor.distribution || [])].join(' ').toLowerCase()}">
              <td><div class="actor-name">${actor.names[0]}</div>${actor.names.length > 1 ? `<div class="actor-aliases">aka: ${actor.names.slice(1).join(', ')}</div>` : ''}${actor.attribution ? `<div class="actor-aliases">Attr: ${actor.attribution}</div>` : ''}</td>
              <td><span class="ttp-tag">${this.formatType(actor.type)}</span></td>
              <td><span class="actor-status status-${actor.status}">${actor.status.toUpperCase()}</span></td>
              <td style="font-family:var(--fm);font-size:.78rem;color:var(--t2)">${actor.first_seen}</td>
              <td style="font-size:.82rem;color:var(--t2)">${(actor.distribution || []).join(', ')}</td>
              <td>${actor.ttps.slice(0, 3).map(t => `<span class="mitre-badge">${t.split(' - ')[0]}</span>`).join(' ')}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
    const searchInput = document.getElementById('search-actors');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll('#actor-table tbody tr').forEach(row => {
          row.style.display = !term || row.dataset.search.includes(term) ? '' : 'none';
        });
      });
    }
  },

  // ---- IOC FEED ----
  renderIOCFeed(container) {
    if (!this.iocsData) { container.innerHTML = '<div class="loading">Loading...</div>'; return; }
    const iocs = this.iocsData.iocs;
    const domains = iocs.filter(i => i.type === 'domain');
    const urls = iocs.filter(i => i.type === 'url_path');
    const ips = iocs.filter(i => i.type === 'ip');
    const active = iocs.filter(i => i.status === 'active');

    const defangedDomains = domains.map(d => this.defangDomain(d.value)).join('\n');
    const defangedUrls = urls.map(u => this.defangURL(u.value)).join('\n');
    const defangedIPs = ips.map(ip => this.defangIP(ip.value)).join('\n');
    const allValues = iocs.map(i => i.value);
    const splunkFeed = allValues.map(v => '"' + v + '"').join(' OR ');
    const csvFeed = allValues.map(v => '"' + v + '"').join(', ');

    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> IOC Feed</h1>
      <p class="page-subtitle">Click tiles to filter by type. All formats copy-paste ready for your tools.</p>
      <div class="stats-row">
        <div class="stat-card" onclick="App.showIOCModal('domain')"><div class="stat-value">${domains.length}</div><div class="stat-label">Domains</div></div>
        <div class="stat-card" onclick="App.showIOCModal('url_path')"><div class="stat-value">${urls.length}</div><div class="stat-label">URLs</div></div>
        <div class="stat-card" onclick="App.showIOCModal('ip')"><div class="stat-value">${ips.length}</div><div class="stat-label">IPs</div></div>
        <div class="stat-card" onclick="App.showIOCModal('all')"><div class="stat-value">${active.length}</div><div class="stat-label">All Active</div></div>
      </div>
      <div class="feed-card"><h3>Defanged Domains</h3><div class="feed-description">Last dot before TLD replaced with [.]</div><div class="feed-output" id="fd1">${this.escapeHtml(defangedDomains || 'No domain IOCs')}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd1',this)">Copy</button></div></div>
      <div class="feed-card"><h3>Defanged URLs</h3><div class="feed-description">Full paths with defanged domain</div><div class="feed-output" id="fd2">${this.escapeHtml(defangedUrls || 'No URL IOCs')}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd2',this)">Copy</button></div></div>
      ${ips.length > 0 ? `<div class="feed-card"><h3>Defanged IPs</h3><div class="feed-description">Last octet dot replaced with [.]</div><div class="feed-output" id="fd3">${this.escapeHtml(defangedIPs)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd3',this)">Copy</button></div></div>` : ''}
      <div class="feed-card"><h3>Splunk / LogScale — OR Delimited</h3><div class="feed-description">Clean values, quoted, OR delimited. Paste into SPL or LQL.</div><div class="feed-output" id="fd4">${this.escapeHtml(splunkFeed)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd4',this)">Copy</button></div></div>
      <div class="feed-card"><h3>Comma-Separated Quoted</h3><div class="feed-description">For CSV, SOAR, or script ingestion</div><div class="feed-output" id="fd5">${this.escapeHtml(csvFeed)}</div><div class="feed-actions"><button class="btn" onclick="App.copyFeedById('fd5',this)">Copy</button></div></div>
    `;
  },

  // ---- BLOG ----
  renderBlog(container) {
    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> Blog</h1>
      <p class="page-subtitle">Analysis, commentary, and research notes on the GenAI threat landscape</p>
      <div id="blog-posts">
        <p style="color:var(--t3);font-size:.85rem;font-style:italic">Blog posts are added manually. Check back for new content.</p>
      </div>
    `;
    // Blog posts would be loaded from a blog-index.json file when available
  },

  // ---- ABOUT ----
  renderAbout(container) {
    container.innerHTML = `
      <h1 class="page-title"><span class="title-accent">//</span> About LLM ThreatIntel</h1>
      <div class="about-content">
        <p>LLM ThreatIntel is an automated threat intelligence feed focused on the generative AI and LLM threat landscape. Tracking malicious LLM tools, GenAI-assisted malware, AI supply chain compromises, LLMjacking, shadow AI risks, and nation-state GenAI programs.</p>
        <p>Intelligence collected via Claude Code automated searches. Reports include structured IOCs in multiple copy-paste formats, MITRE ATT&CK mappings, and inline source attribution.</p>
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
        <h2 class="about-section-title">Disclaimer</h2>
        <p>Maintained for defensive security research. All intelligence from public reports. Validate IOCs before production blocking.</p>
      </div>
    `;
  },

  // ---- HELPERS ----
  truncateExcerpt(text, max) {
    if (!text || text.length <= max) return text;
    return text.substring(0, max).replace(/\s+\S*$/, '') + '...';
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());

// Modal close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') App.closeModal(); });
