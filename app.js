import Quill from 'https://cdn.jsdelivr.net/npm/quill@1.3.7/+esm';

class NotepadApp {
    constructor() {
        this.initEditor();
        this.bindEvents();
        this.initTinyToolbar();
    }

    initEditor() {
        const toolbarOptions = [
            ['font', ['serif', 'monospace']],
            ['size', ['small', 'normal', 'large', 'huge']],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ];

        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        this.quill.on('text-change', () => this.updateWordCount());
    }

    bindEvents() {
        document.getElementById('save-file').addEventListener('click', () => this.saveFile());
        document.getElementById('new-file-btn').addEventListener('click', () => this.createNewFile());
        document.getElementById('toggle-tiny-toolbar').addEventListener('click', () => this.toggleTinyToolbar());
        // Additional event bindings for other toolbar functions
    }

    initTinyToolbar() {
        const tinyToolbar = document.getElementById('tiny-toolbar');
        const miniButtons = tinyToolbar.querySelectorAll('.mini-btn');
        
        miniButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                if (format === 'list') {
                    this.quill.format('list', btn.dataset.value);
                } else {
                    const currentValue = this.quill.getFormat()[format];
                    this.quill.format(format, !currentValue);
                    
                    // Toggle active state
                    if (format !== 'list') {
                        btn.classList.toggle('active', !currentValue);
                    }
                }
            });
        });

        // Update button states when selection changes
        this.quill.on('selection-change', (range) => {
            if (range) {
                const formats = this.quill.getFormat();
                miniButtons.forEach(btn => {
                    const format = btn.dataset.format;
                    if (format !== 'list') {
                        btn.classList.toggle('active', !!formats[format]);
                    } else {
                        btn.classList.toggle('active', formats.list === btn.dataset.value);
                    }
                });
            }
        });
    }

    toggleTinyToolbar() {
        const tinyToolbar = document.getElementById('tiny-toolbar');
        tinyToolbar.classList.toggle('hidden');
    }

    updateWordCount() {
        const text = this.quill.getText();
        const wordCount = text.trim().split(/\s+/).length;
        document.getElementById('word-count').textContent = `Words: ${wordCount}`;
    }

    saveFile() {
        const content = this.quill.root.innerHTML;
        // Implement file saving logic
    }

    createNewFile() {
        this.quill.setText('');
    }
}

new NotepadApp();
