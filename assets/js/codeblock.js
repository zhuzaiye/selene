// A separate toolbar keeps actions visible while code scrolls horizontally.
document.addEventListener('DOMContentLoaded', () => {
    const copyIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
    const successIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
    const errorIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
    const expandIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    const collapseIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
    const names = {sh: 'Shell', bash: 'Bash', python: 'Python', js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', html: 'HTML', css: 'CSS', json: 'JSON', makefile: 'Makefile', text: '纯文本', plaintext: '纯文本'};

    document.querySelectorAll('pre > code').forEach((code, index) => {
        const pre = code.parentElement;
        if (pre.closest('.code-block') || pre.classList.contains('mermaid')) return;

        // Keep the original whitespace intact when copying, including indentation.
        const source = code.textContent;
        const lineCount = source.replace(/\r?\n$/, '').split('\n').length;
        // Chroma already wraps highlighted lines. Give plain code the same shape.
        if (!code.querySelector(':scope > .line')) {
            const lines = (source.match(/[^\n]*\n|[^\n]+$/g) || ['']).map(text => {
                const line = document.createElement('span');
                line.className = 'line';
                const content = document.createElement('span');
                content.className = 'cl';
                content.textContent = text;
                line.append(content);
                return line;
            });
            code.replaceChildren(...lines);
        }

        const language = code.dataset.lang || [...code.classList].find(name => name.startsWith('language-'))?.slice(9) || 'text';
        const block = document.createElement('div');
        block.className = 'code-block';
        pre.before(block);

        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';
        const info = document.createElement('div');
        info.className = 'code-info';
        const label = document.createElement('span');
        label.className = 'code-language';
        label.textContent = names[language] || language;
        info.append(label);

        const actions = document.createElement('div');
        actions.className = 'code-actions';
        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'code-action code-copy';
        copy.innerHTML = copyIcon;
        copy.setAttribute('aria-label', '复制代码');
        const status = document.createElement('span');
        status.className = 'code-copy-status';
        status.setAttribute('role', 'status');
        let reset;
        copy.addEventListener('click', async () => {
            clearTimeout(reset);
            try {
                await navigator.clipboard.writeText(source);
                copy.innerHTML = successIcon;
                copy.setAttribute('aria-label', '已复制');
                status.textContent = '代码已复制';
            } catch {
                copy.innerHTML = errorIcon;
                copy.setAttribute('aria-label', '复制失败，请重试');
                status.textContent = '复制失败，请手动选择代码复制';
            }
            reset = setTimeout(() => {
                copy.innerHTML = copyIcon;
                copy.setAttribute('aria-label', '复制代码');
                status.textContent = '';
            }, 2000);
        });
        actions.append(copy);
        toolbar.append(info, actions);
        pre.id = pre.id || `code-content-${index}`;
        pre.setAttribute('aria-label', `${label.textContent} 代码`);
        block.append(toolbar, pre, status);

        // Short snippets stay compact. Longer samples initially show a preview.
        if (lineCount > 24) {
            block.classList.add('is-collapsed');
            const expand = document.createElement('button');
            expand.type = 'button';
            expand.className = 'code-expand';
            expand.innerHTML = expandIcon;
            expand.setAttribute('aria-label', '展开代码');
            expand.setAttribute('aria-expanded', 'false');
            expand.setAttribute('aria-controls', pre.id);
            expand.addEventListener('click', () => {
                const collapsed = block.classList.toggle('is-collapsed');
                expand.setAttribute('aria-expanded', String(!collapsed));
                expand.innerHTML = collapsed ? expandIcon : collapseIcon;
                const action = collapsed ? '展开代码' : '收起代码';
                expand.setAttribute('aria-label', action);
                if (collapsed) block.scrollIntoView({block: 'nearest'});
            });
            block.append(expand);
        }
    });
});
