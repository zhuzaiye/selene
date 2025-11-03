// 笔记存储键名
const NOTES_STORAGE_KEY = 'quick_notes';

// 笔记数据模型
class NotesManager {
    constructor() {
        this.notes = this.loadNotes();
        this.currentNoteId = null;
        this.init();
    }

    // 初始化
    init() {
        this.bindEvents();
        this.renderNotes();
    }

    // 绑定事件
    bindEvents() {
        // 新建笔记
        const newNoteBtn = document.getElementById('new-note-btn');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => this.createNewNote());
        }

        // 保存笔记
        const saveNoteBtn = document.getElementById('save-note-btn');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => this.saveCurrentNote());
        }

        // 取消编辑
        const cancelNoteBtn = document.getElementById('cancel-note-btn');
        if (cancelNoteBtn) {
            cancelNoteBtn.addEventListener('click', () => this.cancelEdit());
        }

        // 删除笔记
        const deleteNoteBtn = document.getElementById('delete-note-btn');
        if (deleteNoteBtn) {
            deleteNoteBtn.addEventListener('click', () => this.deleteCurrentNote());
        }

        // 清空所有
        const clearAllBtn = document.getElementById('clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllNotes());
        }

        // 搜索
        const searchInput = document.getElementById('search-notes');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchNotes(e.target.value));
        }

        // 导出单个笔记
        const exportNoteBtn = document.getElementById('export-note-btn');
        if (exportNoteBtn) {
            exportNoteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.exportSingleNote();
            });
        }

        // 导出全部笔记
        const exportAllBtn = document.getElementById('export-all-btn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllNotes());
        }

        // 导入笔记
        const importBtn = document.getElementById('import-btn');
        const importFile = document.getElementById('import-file');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => this.importNotes(e));
        }

        // 快捷键保存 (Ctrl+S or Cmd+S)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const editor = document.getElementById('note-editor');
                const editingCard = document.querySelector('.note-card.editing');
                
                if (editingCard) {
                    // 内联编辑模式
                    const id = editingCard.getAttribute('data-id');
                    const titleInput = editingCard.querySelector('.note-title-input-inline');
                    const contentInput = editingCard.querySelector('.note-content-input-inline');
                    if (titleInput && contentInput) {
                        this.saveInlineNote(id, titleInput.value, contentInput.value);
                    }
                } else if (editor && !editor.classList.contains('hidden')) {
                    // 传统编辑器模式
                    this.saveCurrentNote();
                }
            }
        });
    }

    // 从localStorage加载笔记
    loadNotes() {
        try {
            const stored = localStorage.getItem(NOTES_STORAGE_KEY);
            if (stored) {
                const notes = JSON.parse(stored);
                // 按时间倒序排列
                return notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            }
        } catch (e) {
            console.error('Load notes failed:', e);
        }
        return [];
    }

    // 保存笔记到localStorage
    saveNotes() {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.notes));
        } catch (e) {
            console.error('Save notes failed:', e);
            alert('Save failed, maybe the storage space is full');
        }
    }

    // 创建新笔记
    createNewNote() {
        // 取消任何正在进行的编辑
        if (this.currentNoteId) {
            this.cancelInlineEdit();
        }
        
        this.currentNoteId = null;
        const editor = document.getElementById('note-editor');
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        const dateSpan = document.getElementById('note-date');
        const deleteBtn = document.getElementById('delete-note-btn');
        const exportBtn = document.getElementById('export-note-btn');

        editor.classList.remove('hidden');
        titleInput.value = '';
        contentInput.value = '';
        dateSpan.textContent = '';
        deleteBtn.classList.add('hidden');
        if (exportBtn) exportBtn.classList.add('hidden');

        // 聚焦到标题输入框
        setTimeout(() => titleInput.focus(), 100);
    }

    // 编辑笔记 - 就地编辑模式
    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        // 如果已经在编辑某个note，先取消
        if (this.currentNoteId && this.currentNoteId !== id) {
            this.cancelInlineEdit();
        }

        this.currentNoteId = id;
        const card = document.querySelector(`.note-card[data-id="${id}"]`);
        if (!card || card.classList.contains('editing')) return;

        // 将卡片转换为编辑模式
        const title = note.title;
        const content = note.content;
        const createdDate = this.formatDate(note.createdAt);
        const updatedDate = this.formatDate(note.updatedAt);

        card.classList.add('editing');
        card.innerHTML = `
            <div class="note-editor-inline">
                <div class="editor-header">
                    <input type="text" class="note-title-input-inline" value="${this.escapeHtml(title)}" placeholder="Title">
                    <div class="editor-actions">
                        <button class="btn btn-save-inline">Save</button>
                        <button class="btn btn-cancel-inline">Cancel</button>
                    </div>
                </div>
                <textarea class="note-content-input-inline" placeholder="Write your notes here...">${this.escapeHtml(content)}</textarea>
                <div class="note-meta">
                    <span class="note-date">Created: ${createdDate} | Updated: ${updatedDate}</span>
                    <div class="note-actions">
                        <button class="btn btn-export-inline">Export</button>
                        <button class="btn btn-delete-inline">Delete</button>
                    </div>
                </div>
            </div>
        `;

        // 绑定内联编辑器的事件
        const saveBtn = card.querySelector('.btn-save-inline');
        const cancelBtn = card.querySelector('.btn-cancel-inline');
        const deleteBtn = card.querySelector('.btn-delete-inline');
        const exportBtn = card.querySelector('.btn-export-inline');
        const titleInput = card.querySelector('.note-title-input-inline');
        const contentInput = card.querySelector('.note-content-input-inline');

        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.saveInlineNote(id, titleInput.value, contentInput.value);
        });

        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.cancelInlineEdit();
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this note?')) {
                this.notes = this.notes.filter(n => n.id !== id);
                this.saveNotes();
                this.renderNotes();
                this.currentNoteId = null;
            }
        });

        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.exportNoteById(id);
        });

        // 阻止卡片点击事件冒泡
        card.addEventListener('click', (e) => e.stopPropagation());

        // 聚焦到内容输入框
        setTimeout(() => contentInput.focus(), 100);
    }

    // 保存当前笔记（传统编辑器模式）
    saveCurrentNote() {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) {
            alert('Title and content cannot be empty');
            return;
        }

        const now = new Date().toISOString();

        if (this.currentNoteId) {
            // 更新现有笔记
            const note = this.notes.find(n => n.id === this.currentNoteId);
            if (note) {
                note.title = title || 'No title';
                note.content = content;
                note.updatedAt = now;
            }
        } else {
            // 创建新笔记
            const newNote = {
                id: Date.now().toString(),
                title: title || 'No title',
                content: content,
                createdAt: now,
                updatedAt: now
            };
            this.notes.unshift(newNote);
        }

        // 按更新时间排序
        this.notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        this.saveNotes();
        this.renderNotes();
        this.cancelEdit();
    }

    // 保存内联编辑的笔记
    saveInlineNote(id, title, content) {
        const titleValue = title.trim();
        const contentValue = content.trim();

        if (!titleValue && !contentValue) {
            alert('标题和内容不能同时为空');
            return;
        }

        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.title = titleValue || 'No title';
            note.content = contentValue;
            note.updatedAt = new Date().toISOString();
        }

        // 按更新时间排序
        this.notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        this.saveNotes();
        this.currentNoteId = null;
        this.renderNotes();
    }

    // 取消内联编辑
    cancelInlineEdit() {
        if (!this.currentNoteId) return;
        
        this.currentNoteId = null;
        this.renderNotes();
    }

    // 根据ID导出笔记
    exportNoteById(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const markdown = this.noteToMarkdown(note);
        const filename = this.sanitizeFilename(note.title) + '.md';
        this.downloadFile(markdown, filename, 'text/markdown');
    }

    // 删除当前笔记
    deleteCurrentNote() {
        if (!this.currentNoteId) return;

        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
            this.saveNotes();
            this.renderNotes();
            this.cancelEdit();
        }
    }

    // 取消编辑
    cancelEdit() {
        const editor = document.getElementById('note-editor');
        const exportBtn = document.getElementById('export-note-btn');
        editor.classList.add('hidden');
        this.currentNoteId = null;
        if (exportBtn) exportBtn.classList.add('hidden');
    }

    // 清空所有笔记
    clearAllNotes() {
        if (confirm('Are you sure you want to clear all notes? This action cannot be undone!')) {
            this.notes = [];
            this.saveNotes();
            this.renderNotes();
            this.cancelEdit();
        }
    }

    // 搜索笔记
    searchNotes(query) {
        const searchTerm = query.toLowerCase().trim();
        const noteCards = document.querySelectorAll('.note-card');
        
        if (!searchTerm) {
            noteCards.forEach(card => card.classList.remove('hidden'));
            return;
        }

        noteCards.forEach(card => {
            const id = card.getAttribute('data-id');
            const note = this.notes.find(n => n.id === id);
            
            if (!note) {
                card.classList.add('hidden');
                return;
            }

            const title = note.title.toLowerCase();
            const content = note.content.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // 渲染笔记列表
    renderNotes() {
        const notesList = document.getElementById('notes-list');
        const emptyState = document.getElementById('empty-state');

        if (!notesList) return;

        if (this.notes.length === 0) {
            notesList.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        // 保留当前展开状态
        const expandedNotes = new Set();
        notesList.querySelectorAll('.note-card.expanded').forEach(card => {
            const id = card.getAttribute('data-id');
            if (id) expandedNotes.add(id);
        });

        notesList.innerHTML = this.notes.map(note => {
            const isLongContent = note.content.length > 300;
            const isExpanded = expandedNotes.has(note.id);
            const displayContent = isLongContent && !isExpanded
                ? note.content.substring(0, 300) + '...'
                : note.content;

            return `
                <div class="note-card ${isExpanded ? 'expanded' : ''}" data-id="${note.id}">
                    <div class="note-card-header">
                        <h3 class="note-card-title">${this.escapeHtml(note.title)}</h3>
                        <span class="note-card-date">${this.formatDate(note.updatedAt)}</span>
                    </div>
                    <div class="note-card-content ${isLongContent && !isExpanded ? 'collapsed' : ''}">${this.escapeHtml(displayContent)}</div>
                    ${isLongContent ? `
                        <button class="note-toggle-btn" data-id="${note.id}">
                            <span class="toggle-text">${isExpanded ? '收起' : '展开'}</span>
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');

        // 绑定展开/收起按钮事件
        notesList.querySelectorAll('.note-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const card = document.querySelector(`.note-card[data-id="${id}"]`);
                if (!card) return;

                const isExpanded = card.classList.contains('expanded');
                const note = this.notes.find(n => n.id === id);
                if (!note) return;

                const contentEl = card.querySelector('.note-card-content');
                const toggleText = btn.querySelector('.toggle-text');

                if (isExpanded) {
                    // 收起
                    card.classList.remove('expanded');
                    contentEl.classList.add('collapsed');
                    const preview = note.content.length > 300 
                        ? note.content.substring(0, 300) + '...' 
                        : note.content;
                    contentEl.innerHTML = this.escapeHtml(preview);
                    toggleText.textContent = '展开';
                } else {
                    // 展开
                    card.classList.add('expanded');
                    contentEl.classList.remove('collapsed');
                    contentEl.innerHTML = this.escapeHtml(note.content);
                    toggleText.textContent = '收起';
                }
            });
        });

        // 绑定点击事件（编辑）
        notesList.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是展开/收起按钮，不触发编辑
                if (e.target.closest('.note-toggle-btn')) {
                    return;
                }
                const id = card.getAttribute('data-id');
                this.editNote(id);
            });
        });
    }

    // 格式化日期
    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 转义HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 导出单个笔记为Markdown
    exportSingleNote() {
        if (!this.currentNoteId) return;

        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note) return;

        const markdown = this.noteToMarkdown(note);
        const filename = this.sanitizeFilename(note.title) + '.md';
        this.downloadFile(markdown, filename, 'text/markdown');
    }

    // 导出所有笔记
    exportAllNotes() {
        if (this.notes.length === 0) {
            alert('No notes to export');
            return;
        }

        // 导出每个笔记为独立的MD文件
        this.notes.forEach((note, index) => {
            const markdown = this.noteToMarkdown(note);
            const filename = this.sanitizeFilename(note.title) + '.md';
            
            // 延迟下载以避免浏览器阻止多个下载
            setTimeout(() => {
                this.downloadFile(markdown, filename, 'text/markdown');
            }, index * 300); // 每个文件延迟300ms
        });

        // 提示用户
        setTimeout(() => {
            alert(`Exporting ${this.notes.length} notes as separate MD files...`);
        }, 100);
    }

    // 将笔记转换为Markdown格式
    noteToMarkdown(note) {
        const createdDate = new Date(note.createdAt).toLocaleString('zh-CN');
        const updatedDate = new Date(note.updatedAt).toLocaleString('zh-CN');
        
        return `---
title: "${note.title}"
created: ${createdDate}
updated: ${updatedDate}
---

${note.content}`;
    }

    // 导入笔记
    importNotes(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const fileName = file.name.toLowerCase();

                if (fileName.endsWith('.json')) {
                    // 导入JSON格式
                    const importedNotes = JSON.parse(content);
                    if (Array.isArray(importedNotes)) {
                        this.mergeNotes(importedNotes);
                    } else {
                        alert('JSON format is incorrect, should be an array of notes');
                    }
                } else if (fileName.endsWith('.md')) {
                    // 导入Markdown格式
                    const note = this.markdownToNote(content, file.name);
                    if (note) {
                        // 检查是否已存在（根据标题和时间判断）
                        const exists = this.notes.some(n => 
                            n.title === note.title && 
                            Math.abs(new Date(n.createdAt) - new Date(note.createdAt)) < 1000
                        );
                        
                        if (!exists) {
                            this.notes.unshift(note);
                            this.saveNotes();
                            this.renderNotes();
                            alert('Notes imported successfully!');
                        } else {
                            if (confirm('Similar notes found, do you still want to import? (will create a new note)')) {
                                // 修改ID和时间以避免冲突
                                note.id = Date.now().toString();
                                note.createdAt = new Date().toISOString();
                                note.updatedAt = new Date().toISOString();
                                this.notes.unshift(note);
                                this.saveNotes();
                                this.renderNotes();
                                alert('Notes imported successfully!');
                            }
                        }
                    }
                } else {
                    alert('Unsupported file format, please use .md or .json files');
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('Import failed: ' + error.message);
            }
        };
        reader.readAsText(file);
        
        // 重置文件输入
        event.target.value = '';
    }

    // 将Markdown转换为笔记对象
    markdownToNote(content, filename) {
        try {
            // 解析front matter
            const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
            const match = content.match(frontMatterRegex);

            let title = 'Imported notes';
            let createdAt = new Date().toISOString();
            let updatedAt = new Date().toISOString();
            let noteContent = content;

            if (match) {
                const frontMatter = match[1];
                noteContent = match[2];

                // 解析front matter中的字段
                const titleMatch = frontMatter.match(/title:\s*["']?(.+?)["']?$/m);
                const createdMatch = frontMatter.match(/created:\s*(.+?)$/m);
                const updatedMatch = frontMatter.match(/updated:\s*(.+?)$/m);

                if (titleMatch) title = titleMatch[1].trim();
                if (createdMatch) {
                    try {
                        createdAt = new Date(createdMatch[1].trim()).toISOString();
                    } catch (e) {
                        // 如果日期解析失败，使用当前时间
                    }
                }
                if (updatedMatch) {
                    try {
                        updatedAt = new Date(updatedMatch[1].trim()).toISOString();
                    } catch (e) {
                        updatedAt = createdAt;
                    }
                }
            } else {
                // 如果没有front matter，尝试使用文件名或第一行作为标题
                const lines = content.trim().split('\n');
                if (lines.length > 0 && lines[0].trim()) {
                    // 如果第一行看起来像标题（以#开头或较短），使用它
                    const firstLine = lines[0].trim();
                    if (firstLine.startsWith('# ')) {
                        title = firstLine.substring(2).trim();
                        noteContent = lines.slice(1).join('\n');
                    } else if (firstLine.length < 100 && !firstLine.includes('\n')) {
                        title = firstLine;
                        noteContent = lines.slice(1).join('\n');
                    } else {
                        // 使用文件名（去掉扩展名）
                        title = filename.replace(/\.md$/i, '').trim() || 'Imported notes';
                    }
                }
            }

            return {
                id: Date.now().toString(),
                title: title || 'Imported notes',
                content: noteContent.trim(),
                createdAt: createdAt,
                updatedAt: updatedAt
            };
        } catch (error) {
            console.error('Parse Markdown failed:', error);
            alert('Parse file failed: ' + error.message);
            return null;
        }
    }

    // 合并导入的笔记（避免重复）
    mergeNotes(importedNotes) {
        let addedCount = 0;
        importedNotes.forEach(importedNote => {
            // 检查是否已存在
            const exists = this.notes.some(n => n.id === importedNote.id);
            if (!exists) {
                this.notes.push(importedNote);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            // 按时间排序
            this.notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            this.saveNotes();
            this.renderNotes();
            alert(`Successfully imported ${addedCount} notes`);
        } else {
            alert('No new notes to import');
        }
    }

    // 下载文件
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 清理文件名（移除非法字符）
    sanitizeFilename(filename) {
        return filename
            .replace(/[<>:"/\\|?*]/g, '-')
            .replace(/\s+/g, '-')
            .substring(0, 100)
            .replace(/^-+|-+$/g, '') || 'note';
    }
}

// 初始化函数
function initNotesManager() {
    // 只在笔记页面初始化
    if (document.getElementById('notes-list')) {
        new NotesManager();
    }
}

// 当页面加载完成后初始化
// 支持两种情况：1. DOM 已加载完成；2. 等待 DOMContentLoaded
if (document.readyState === 'loading') {
    // DOM 还在加载中，等待 DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initNotesManager);
} else {
    // DOM 已经加载完成，直接初始化
    initNotesManager();
}

