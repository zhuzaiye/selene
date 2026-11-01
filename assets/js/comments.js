/* Gitalk 1.8 adapter: keep authentication and Issues; add explicit reply relationships. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.document) {
    const start = () => api.mount(root.document);
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const marker = /(?:\r?\n)*<!-- tracelog-thread:v1 parent=([1-9]\d{0,15}) root=([1-9]\d{0,15}) -->\s*$/;

  function parseReply(body) {
    const match = String(body || '').match(marker);
    return match ? { parent: match[1], root: match[2] } : null;
  }
  function visibleBody(body) {
    let text = String(body || '');
    while (marker.test(text)) text = text.replace(marker, '');
    return text.trim();
  }
  function serializeReply(body, target) {
    const text = visibleBody(body);
    if (!text) throw new Error('请先写下留言内容。');
    if (!target) return text;
    if (!/^[1-9]\d{0,15}$/.test(String(target.parent)) || !/^[1-9]\d{0,15}$/.test(String(target.root))) {
      throw new Error('回复目标无效，请重新选择。');
    }
    return `${text}\n\n<!-- tracelog-thread:v1 parent=${target.parent} root=${target.root} -->`;
  }
  function older(a, b) {
    return /^[1-9]\d{0,15}$/.test(String(a)) && /^[1-9]\d{0,15}$/.test(String(b)) && BigInt(a) < BigInt(b);
  }
  function mergeComments(existing, incoming) {
    const map = new Map();
    [...existing, ...incoming].forEach(comment => {
      if (/^[1-9]\d{0,15}$/.test(String(comment.id))) map.set(String(comment.id), comment);
    });
    return [...map.values()].sort((a, b) => Number(a.id) - Number(b.id));
  }
  function buildThreads(comments) {
    const ordered = mergeComments([], comments);
    const byId = new Map(ordered.map(c => [String(c.id), c]));
    const groups = new Map();
    const membership = new Map();
    for (const comment of ordered) {
      const id = String(comment.id);
      const reply = parseReply(comment.body);
      const topic = reply && byId.get(reply.root);
      const parent = reply && byId.get(reply.parent);
      const valid = reply && older(reply.root, id) && older(reply.parent, id) && topic &&
        !parseReply(topic.body) && (!parent || membership.get(reply.parent) === reply.root);
      if (valid) {
        const group = groups.get(reply.root);
        group.replies.push({ comment, parent, missingParent: !parent });
        membership.set(id, reply.root);
      } else {
        groups.set(id, { comment, replies: [], unresolved: Boolean(reply) });
        membership.set(id, id);
      }
    }
    return { groups: [...groups.values()], byId, membership };
  }

  function element(doc, tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function safeURL(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function sanitizedHTML(doc, html) {
    const template = doc.createElement('template');
    template.innerHTML = html;
    const allowed = new Set('a p br hr blockquote pre code ul ol li em strong del s table thead tbody tfoot tr th td img span div details summary h1 h2 h3 h4 h5 h6 kbd sup sub'.split(' '));
    const dangerous = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input', 'button', 'textarea', 'link', 'meta']);
    const clean = parent => {
      for (const child of [...parent.childNodes]) {
        if (child.nodeType === 8) { child.remove(); continue; }
        if (child.nodeType !== 1) continue;
        const tag = child.tagName.toLowerCase();
        if (dangerous.has(tag)) { child.remove(); continue; }
        clean(child);
        if (!allowed.has(tag)) { child.replaceWith(...child.childNodes); continue; }
        for (const attr of [...child.attributes]) {
          if (!['href', 'src', 'alt', 'title', 'colspan', 'rowspan'].includes(attr.name)) child.removeAttribute(attr.name);
        }
        for (const attr of ['href', 'src']) {
          if (child.hasAttribute(attr)) {
            const url = safeURL(child.getAttribute(attr));
            if (url) child.setAttribute(attr, url);
            else child.removeAttribute(attr);
          }
        }
        if (tag === 'a') { child.target = '_blank'; child.rel = 'noopener noreferrer'; }
        if (tag === 'img') { child.loading = 'lazy'; child.decoding = 'async'; }
      }
    };
    clean(template.content);
    return template.content;
  }

  function loadGitalk(doc, url) {
    if (typeof window.Gitalk === 'function') return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = doc.createElement('script');
      const timer = setTimeout(() => fail(), 20000);
      const fail = () => { clearTimeout(timer); script.remove(); reject(new Error('评论组件加载失败，请重试。')); };
      script.src = url;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        clearTimeout(timer);
        if (typeof window.Gitalk === 'function') resolve();
        else fail();
      };
      script.onerror = fail;
      doc.head.append(script);
    });
  }

  class Threads {
    constructor(section, options, doc) {
      this.section = section;
      this.doc = doc;
      this.options = options;
      this.list = section.querySelector('[data-comment-threads]');
      this.status = section.querySelector('[data-comment-status]');
      this.statusRow = section.querySelector('[data-comment-status-row]');
      this.issueLink = section.querySelector('[data-comment-issue]');
      this.loadButton = section.querySelector('[data-comment-more]');
      this.retryButton = section.querySelector('[data-comment-retry]');
      this.composer = section.querySelector('[data-comment-composer]');
      this.home = section.querySelector('[data-comment-composer-home]');
      this.banner = section.querySelector('[data-comment-reply-label]');
      this.replyNote = section.querySelector('[data-comment-reply-note]');
      this.cancel = section.querySelector('[data-comment-cancel]');
      this.host = section.querySelector('#gitalk-container');
      this.open = new Set();
      this.target = null;
      this.drafts = {};
      this.page = 1;
      this.submitting = false;
      this.model = buildThreads([]);
      this.storageKey = `tracelog-comments:${options.owner}/${options.repo}:${options.id}`;
      this.restore();
      this.cancel.addEventListener('click', () => this.focus());
      this.retryButton.addEventListener('click', () => this.component ? this.retry() : this.start());
      this.loadButton.addEventListener('click', () => this.more());
      section.addEventListener('focusin', e => {
        if (this.composer.contains(e.target)) doc.body.classList.add('comment-editing');
      });
      section.addEventListener('focusout', () => requestAnimationFrame(() => {
        if (!this.composer.contains(doc.activeElement)) doc.body.classList.remove('comment-editing');
      }));
      window.addEventListener('pagehide', () => this.save());
    }
    restore() {
      try {
        const saved = JSON.parse(sessionStorage.getItem(this.storageKey));
        if (saved && typeof saved.drafts === 'object' && saved.drafts) {
          this.drafts = Object.fromEntries(Object.entries(saved.drafts).filter(([key, value]) =>
            (key === 'topic' || /^[1-9]\d{0,15}$/.test(key)) && typeof value === 'string'));
          if (saved.target && /^[1-9]\d{0,15}$/.test(saved.target.parent) && /^[1-9]\d{0,15}$/.test(saved.target.root)) this.target = { parent: String(saved.target.parent), root: String(saved.target.root) };
        }
      } catch { /* A disabled or full session store must not prevent commenting. */ }
    }
    save(text) {
      if (this.component) this.drafts[this.target?.parent || 'topic'] = text === undefined ? this.component.state.comment || '' : text;
      try { sessionStorage.setItem(this.storageKey, JSON.stringify({ target: this.target, drafts: this.drafts })); } catch { /* Keep the in-memory draft. */ }
    }
    async start() {
      if (this.starting || this.component) return;
      this.starting = true;
      this.status.textContent = '正在加载讨论…';
      this.statusRow.hidden = false;
      this.issueLink.hidden = true;
      this.retryButton.hidden = true;
      try {
        await loadGitalk(this.doc, this.section.dataset.gitalkSrc);
        const component = new window.Gitalk({ ...this.options, language: 'zh-CN', perPage: 50,
          pagerDirection: 'first', createIssueManually: true }).render(this.host);
        if (!component || typeof component.getIssue !== 'function' || typeof component.setState !== 'function') {
          throw new Error('评论组件接口不兼容，请在 GitHub 查看讨论。');
        }
        this.component = component;
        this.attach(component);
        this.sync();
      } catch (error) {
        this.status.textContent = error.message;
        this.issueLink.hidden = false;
        this.statusRow.hidden = false;
        this.retryButton.hidden = false;
      } finally { this.starting = false; }
    }
    attach(component) {
      const adapter = this;
      const setState = component.setState;
      component.setState = function (update, callback) {
        return setState.call(this, update, function () {
          if (callback) callback.call(this);
          adapter.sync();
        });
      };
      component.getIssueByLabels = () => this.findIssue();
      component.getIssueById = () => this.findIssue();
      component.getComments = issue => this.readComments(issue);
      component.comments = () => null;
      component.createComment = () => this.submit();
      const change = component.handleCommentChange;
      component.handleCommentChange = event => { this.notice = ''; change.call(component, event); this.save(event.target.value); };
      component.handleCommentPreview = () => this.preview();
      const login = component.handleLogin;
      component.handleLogin = () => { this.save(); login.call(component); };
      const create = component.handleCommentCreate;
      component.handleCommentCreate = event => {
        if (this.submitting || component.state.isCreating) return;
        if (!visibleBody(component.state.comment)) {
          event?.preventDefault();
          this.status.textContent = '请先写下留言内容。';
          this.statusRow.hidden = false;
          component.commentEL?.focus();
          return;
        }
        create.call(component, event);
      };
      const key = this.target?.parent || 'topic';
      if (Object.hasOwn(this.drafts, key)) component.setState({ comment: this.drafts[key] });
    }
    async request(path, init = {}, format = 'json') {
      const url = new URL(path, 'https://api.github.com');
      if (url.origin !== 'https://api.github.com') throw new Error('评论接口地址无效。');
      const token = this.component.accessToken;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(url, { ...init, credentials: 'omit', signal: controller.signal,
          headers: { Accept: format === 'text' ? 'application/vnd.github+json' : 'application/vnd.github.v3.full+json', ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `token ${token}` } : {}) } });
        if (!response.ok) {
          if (response.status === 401) throw new Error('登录状态已失效，请退出后重新登录 GitHub。');
          if (response.status === 403 || response.status === 429) throw new Error('暂时无法访问评论，请稍后重试或在 GitHub 查看。');
          if (response.status === 404) throw new Error('未找到评论仓库或讨论，请检查仓库配置。');
          throw new Error('评论请求未完成，请重试。');
        }
        return format === 'text' ? await response.text() : await response.json();
      } catch (error) {
        if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('评论网络连接失败，请重试。');
        throw error;
      } finally { clearTimeout(timer); }
    }
    async preview() {
      const c = this.component;
      const revision = (this.previewRevision || 0) + 1;
      this.previewRevision = revision;
      const show = !c.state.isPreview;
      c.setState({ isPreview: show, previewHtml: show ? '<p>正在生成预览…</p>' : '' });
      if (!show) return;
      const text = c.state.comment;
      if (!visibleBody(text)) { c.setState({ previewHtml: '<p>还没有输入内容。</p>' }); return; }
      try {
        const html = await this.request('/markdown', { method: 'POST', body: JSON.stringify({ text, mode: 'gfm', context: `${this.options.owner}/${this.options.repo}` }) }, 'text');
        if (this.previewRevision !== revision || !c.state.isPreview || c.state.comment !== text) return;
        const container = this.doc.createElement('div');
        container.append(sanitizedHTML(this.doc, html));
        c.setState({ previewHtml: container.innerHTML, isOccurError: false, errorMsg: '' });
      } catch (error) {
        if (this.previewRevision === revision) c.setState({ isPreview: false, isOccurError: true, errorMsg: error.message });
      }
    }
    apiPath(suffix) {
      return `/repos/${encodeURIComponent(this.options.owner)}/${encodeURIComponent(this.options.repo)}/${suffix}`;
    }
    async findIssue() {
      const number = this.options.number;
      let issue = null;
      if (Number.isInteger(number) && number > 0) issue = await this.request(this.apiPath(`issues/${number}`));
      else {
        const labels = [...(this.options.labels || ['Gitalk']), this.options.id].join(',');
        const query = new URLSearchParams({ labels, state: 'all', per_page: '100', sort: 'created', direction: 'asc' });
        const issues = await this.request(this.apiPath(`issues?${query}`));
        if (!Array.isArray(issues)) throw new Error('评论数据格式不正确，请重试。');
        issue = issues.find(item => !item.pull_request) || null;
      }
      this.component.setState({ issue, isNoInit: !issue });
      return issue;
    }
    async readComments(issue) {
      if (!issue) return [];
      const page = this.page;
      const query = new URLSearchParams({ per_page: '50', page: String(page) });
      const incoming = await this.request(this.apiPath(`issues/${issue.number}/comments?${query}`));
      if (!Array.isArray(incoming)) throw new Error('评论数据格式不正确，请重试。');
      const comments = mergeComments(this.component.state.comments, incoming);
      this.page = page + 1;
      this.component.setState({ comments, isLoadOver: incoming.length < 50 || comments.length >= issue.comments });
      return comments;
    }
    async submit() {
      if (this.submitting) throw new Error('留言正在发布，请稍候。');
      const component = this.component;
      const target = this.target && { ...this.target };
      if (!component.state.user || !component.accessToken) throw new Error('请先登录 GitHub。');
      if (target && !this.targetAvailable(target)) throw new Error('回复目标暂时不可用，请重试或发起新话题。');
      const body = serializeReply(component.state.comment, target);
      this.submitting = true;
      this.save();
      try {
        const issue = await component.getIssue();
        if (!issue) throw new Error('讨论尚未初始化，请由站点作者先初始化。');
        const comment = await this.request(this.apiPath(`issues/${issue.number}/comments`), { method: 'POST', body: JSON.stringify({ body }) });
        if (!comment?.id) throw new Error('发布结果无法确认，请刷新讨论后再检查。');
        delete this.drafts[target?.parent || 'topic'];
        this.target = null;
        this.notice = target ? '回复已发布。' : '留言已发布。';
        component.setState({ comment: this.drafts.topic || '', comments: mergeComments(component.state.comments, [comment]),
          issue: { ...issue, comments: issue.comments + 1 }, localComments: [], isPreview: false, previewHtml: '' });
        this.save();

      } finally { this.submitting = false; }
    }
    targetAvailable(target) {
      return this.model.byId.has(target.parent) && this.model.membership.get(target.parent) === target.root &&
        !parseReply(this.model.byId.get(target.root)?.body);
    }
    switchTarget(target) {
      if (!this.component || this.component.state.isCreating || this.submitting) return;
      this.save();
      this.notice = '';
      this.previewRevision = (this.previewRevision || 0) + 1;
      this.target = target;
      const text = this.drafts[target?.parent || 'topic'] || '';
      if (target) this.open.add(target.root);
      this.component.setState({ comment: text, isPreview: false, previewHtml: '' });
      this.save();
      this.renderThreads();
      this.sync();
      this.focusEditor();
    }
    focus() { this.switchTarget(null); }
    focusEditor() {
      const motion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.composer.scrollIntoView({ behavior: motion ? 'instant' : 'smooth', block: 'center' });
      requestAnimationFrame(() => {
        const input = this.host.querySelector('textarea');
        if (input) input.focus({ preventScroll: true });
        else this.host.querySelector('.gt-btn-login, .gt-no-init button')?.focus({ preventScroll: true });
      });
    }
    async more() {
      if (this.loadingMore || !this.component?.state.issue) return;
      this.loadingMore = true;
      this.sync();
      try {
        await this.readComments(this.component.state.issue);
        this.component.setState({ isOccurError: false, errorMsg: '' });
      } catch (error) { this.component.setState({ isOccurError: true, errorMsg: error.message }); }
      finally { this.loadingMore = false; this.sync(); }
    }
    async retry() {
      if (this.retrying || this.submitting) return;
      this.retrying = true;
      const component = this.component;
      this.page = 1;
      component.setState({ isIniting: true, isOccurError: false, errorMsg: '' });
      try {
        await component.getUserInfo();
        const issue = await this.findIssue();
        component.setState({ comments: [], isLoadOver: false });
        await this.readComments(issue);
        component.setState({ isIniting: false });
      } catch (error) { component.setState({ isIniting: false, isOccurError: true, errorMsg: error.message }); }
      finally { this.retrying = false; }
    }
    sync() {
      const c = this.component;
      if (!c) return;
      const s = c.state;
      this.loadButton.hidden = !s.issue || s.isIniting || s.isLoadOver || !s.comments.length;
      this.loadButton.disabled = Boolean(this.loadingMore);
      this.loadButton.textContent = this.loadingMore ? '正在加载…' : '加载更多讨论';
      this.retryButton.hidden = !s.isOccurError;
      this.retryButton.disabled = s.isIniting;
      this.composer.hidden = Boolean(s.isIniting);
      if (s.isIniting) this.status.textContent = '正在加载讨论…';
      else if (s.isOccurError) {
        const message = String(s.errorMsg || '').replace(/^Error:\s*/, '');
        this.status.textContent = /[\u3400-\u9fff]/.test(message) ? message : '讨论暂时无法加载，请重试或在 GitHub 查看。';
      }
      else if (s.isNoInit) this.status.textContent = '这篇文章的讨论尚未初始化。';
      else this.status.textContent = this.notice || (s.comments.length ? '' : '还没有留言，欢迎写下第一条。');
      if (s.issue) {
        this.issueLink.href = `https://github.com/${encodeURIComponent(this.options.owner)}/${encodeURIComponent(this.options.repo)}/issues/${s.issue.number}`;
        this.issueLink.textContent = '在 GitHub 查看';
      }
      if (this.lastComments !== s.comments || this.lastUser !== s.user?.login) {
        this.lastComments = s.comments;
        this.lastUser = s.user?.login;
        this.model = buildThreads(s.comments);
        this.renderThreads();
      }
      this.issueLink.hidden = !s.isOccurError;
      this.statusRow.hidden = !this.status.textContent && this.retryButton.hidden;
      this.placeComposer();
      const submit = this.host.querySelector('.gt-btn-public');
      if (submit) {
        submit.disabled = s.isCreating || this.submitting || !visibleBody(s.comment) || Boolean(this.target && !this.targetAvailable(this.target));
        const label = submit.querySelector('.gt-btn-text');
        if (label) label.textContent = this.target ? '发布回复' : '发布留言';
      }
      const input = this.host.querySelector('textarea');
      if (input) input.setAttribute('aria-label', this.target ? '回复内容' : '留言内容');
    }
    message(comment, rootId, replyTo) {
      const doc = this.doc;
      const id = String(comment.id);
      const row = element(doc, 'div', 'thread-message');
      row.id = `comment-${id}`;
      const user = comment.user;
      const login = user?.login || '已删除的用户';
      const avatar = element(doc, 'div', 'thread-avatar');
      const avatarURL = safeURL(user?.avatar_url);
      if (avatarURL) {
        const img = element(doc, 'img');
        img.src = avatarURL; img.alt = ''; img.width = 28; img.height = 28; img.loading = 'lazy';
        avatar.append(img);
      } else avatar.textContent = login.slice(0, 1);
      const card = element(doc, 'div', 'thread-message-card');
      const header = element(doc, 'div', 'thread-message-header');
      const name = element(doc, user?.login ? 'a' : 'span', 'thread-user', login);
      if (user?.login) { name.href = `https://github.com/${encodeURIComponent(user.login)}`; name.target = '_blank'; name.rel = 'noopener noreferrer'; }
      header.append(name);
      if ((this.options.admin || []).some(admin => admin.toLowerCase() === login.toLowerCase())) header.append(element(doc, 'span', 'thread-author', '作者'));
      const date = element(doc, 'time', 'thread-date');
      if (Number.isFinite(Date.parse(comment.created_at))) {
        date.dateTime = comment.created_at;
        date.textContent = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(comment.created_at));
      }
      header.append(date);
      const body = element(doc, 'div', 'thread-message-body');
      if (replyTo) body.append(element(doc, 'p', 'thread-reply-to', replyTo));
      if (comment.body_html) body.append(sanitizedHTML(doc, comment.body_html));
      else { const plain = element(doc, 'p', 'thread-plain', visibleBody(comment.body)); body.append(plain); }
      const actions = element(doc, 'div', 'thread-message-actions');
      const reply = element(doc, 'button', 'thread-text-button', '回复');
      reply.type = 'button';
      reply.disabled = Boolean(parseReply(this.model.byId.get(rootId)?.body));
      reply.setAttribute('aria-label', `回复 ${login}`);
      reply.addEventListener('click', () => this.switchTarget({ parent: id, root: rootId }));
      const permalink = element(doc, 'a', 'thread-permalink', '在 GitHub 查看');
      permalink.href = `${this.issueLink.href}#issuecomment-${id}`; permalink.target = '_blank'; permalink.rel = 'noopener noreferrer';
      actions.append(reply, permalink);
      card.append(header, body, actions);
      row.append(avatar, card);
      return row;
    }
    renderThreads() {
      // Move the mounted Gitalk host out before replacing any reply slots.
      this.home.append(this.composer);
      const fragment = this.doc.createDocumentFragment();
      for (const group of this.model.groups) {
        const rootId = String(group.comment.id);
        const thread = element(this.doc, 'article', 'comment-thread');
        thread.setAttribute('aria-label', `${group.comment.user?.login || '用户'} 发起的话题`);
        thread.append(this.message(group.comment, rootId));
        if (group.unresolved) thread.append(element(this.doc, 'p', 'thread-unresolved', '原话题尚未加载或已删除，暂时单独显示这条回复。'));
        const replies = element(this.doc, 'div', 'thread-replies');
        const expanded = this.open.has(rootId);
        group.replies.forEach(({ comment, parent, missingParent }, index) => {
          const label = missingParent ? '回复的留言已删除或暂未加载' : `回复 @${parent.user?.login || '已删除的用户'}`;
          const message = this.message(comment, rootId, label);
          if (!expanded && index >= 3) message.hidden = true;
          replies.append(message);
        });
        if (group.replies.length) thread.append(replies);
        if (group.replies.length > 3) {
          const toggle = element(this.doc, 'button', 'thread-toggle', expanded ? '收起回复' : `展开全部 ${group.replies.length} 条回复`);
          toggle.type = 'button'; toggle.setAttribute('aria-expanded', String(expanded));
          toggle.addEventListener('click', () => {
            if (expanded) this.open.delete(rootId); else this.open.add(rootId);
            this.renderThreads(); this.placeComposer();
          });
          thread.append(toggle);
        }
        const slot = element(this.doc, 'div', 'thread-reply-slot');
        slot.dataset.topicId = rootId;
        thread.append(slot);
        fragment.append(thread);
      }
      this.list.replaceChildren(fragment);
      this.placeComposer();
    }
    placeComposer() {
      const target = this.target;
      const comment = target && this.model.byId.get(target.parent);
      const name = comment?.user?.login || `留言 #${target?.parent}`;
      this.banner.textContent = target ? `回复 @${name}` : '写留言';
      this.replyNote.textContent = target && !this.targetAvailable(target) ? '回复目标暂时不可用，请重试或取消回复。' : '';
      this.cancel.hidden = !target;
      const slot = target && [...this.list.querySelectorAll('[data-topic-id]')].find(node => node.dataset.topicId === target.root);
      const destination = slot || this.home;
      if (this.composer.parentElement !== destination) destination.append(this.composer);
    }
  }

  function mount(doc) {
    const section = doc.querySelector('[data-threaded-comments]');
    if (!section || section.dataset.mounted) return;
    section.dataset.mounted = 'true';
    try {
      const options = JSON.parse(doc.getElementById('gitalk-options').textContent);
      const threads = new Threads(section, options, doc);
      window.tracelogComments = { focus: () => threads.focus() };
      threads.start();
    } catch {
      section.querySelector('[data-comment-status]').textContent = '评论配置无法读取，请在 GitHub 查看讨论。';
      section.querySelector('[data-comment-issue]').hidden = false;
    }
  }
  return { parseReply, visibleBody, serializeReply, mergeComments, buildThreads, sanitizedHTML, Threads, mount };
});
