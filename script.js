// AtlasKit Notes - JavaScript functionality
class NotesApp {
    constructor() {
        this.notes = this.loadNotes();
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderNotes();
        this.updateStats();
    }

    bindEvents() {
        // Note form submission
        const noteForm = document.getElementById('noteForm');
        noteForm.addEventListener('submit', (e) => this.handleAddNote(e));

        // Clear form button
        const clearFormBtn = document.getElementById('clearForm');
        clearFormBtn.addEventListener('click', () => this.clearForm());

        // Search functionality
        const searchInput = document.getElementById('searchNotes');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Category filter
        const categoryFilter = document.getElementById('filterCategory');
        categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e.target.value));

        // Edit modal events
        const editForm = document.getElementById('editNoteForm');
        editForm.addEventListener('submit', (e) => this.handleEditNote(e));

        const cancelEditBtn = document.getElementById('cancelEdit');
        cancelEditBtn.addEventListener('click', () => this.closeEditModal());

        // Quick actions
        const exportBtn = document.getElementById('exportNotes');
        exportBtn.addEventListener('click', () => this.exportNotes());

        const clearAllBtn = document.getElementById('clearAllNotes');
        clearAllBtn.addEventListener('click', () => this.clearAllNotes());

        // Close modal when clicking outside
        const modal = document.getElementById('editModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeEditModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleAddNote(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const note = {
            id: Date.now().toString(),
            title: formData.get('noteTitle').trim(),
            content: formData.get('noteContent').trim(),
            category: formData.get('noteCategory'),
            isPinned: formData.has('isPinned'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!note.title || !note.content) {
            this.showNotification('Please fill in both title and content', 'error');
            return;
        }

        this.notes.unshift(note);
        this.saveNotes();
        this.renderNotes();
        this.updateStats();
        this.clearForm();
        this.showNotification('Note added successfully!', 'success');
    }

    handleEditNote(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const noteIndex = this.notes.findIndex(note => note.id === this.currentEditingId);
        
        if (noteIndex === -1) return;

        const updatedNote = {
            ...this.notes[noteIndex],
            title: formData.get('editNoteTitle').trim(),
            content: formData.get('editNoteContent').trim(),
            category: formData.get('editNoteCategory'),
            isPinned: formData.has('editIsPinned'),
            updatedAt: new Date().toISOString()
        };

        if (!updatedNote.title || !updatedNote.content) {
            this.showNotification('Please fill in both title and content', 'error');
            return;
        }

        this.notes[noteIndex] = updatedNote;
        this.saveNotes();
        this.renderNotes();
        this.updateStats();
        this.closeEditModal();
        this.showNotification('Note updated successfully!', 'success');
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.renderNotes();
            this.updateStats();
            this.showNotification('Note deleted successfully!', 'success');
        }
    }

    openEditModal(id) {
        const note = this.notes.find(note => note.id === id);
        if (!note) return;

        this.currentEditingId = id;
        
        document.getElementById('editNoteTitle').value = note.title;
        document.getElementById('editNoteContent').value = note.content;
        document.getElementById('editNoteCategory').value = note.category;
        document.getElementById('editIsPinned').checked = note.isPinned;
        
        document.getElementById('editModal').style.display = 'flex';
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.currentEditingId = null;
    }

    handleSearch(query) {
        const filteredNotes = this.getFilteredNotes();
        const searchResults = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        this.renderNotes(searchResults, query);
    }

    handleCategoryFilter(category) {
        const searchQuery = document.getElementById('searchNotes').value;
        this.handleSearch(searchQuery);
    }

    getFilteredNotes() {
        const categoryFilter = document.getElementById('filterCategory').value;
        
        if (categoryFilter === 'all') {
            return this.notes;
        }
        
        return this.notes.filter(note => note.category === categoryFilter);
    }

    renderNotes(notesToRender = null, searchQuery = '') {
        const container = document.getElementById('notesContainer');
        const noNotesMessage = document.getElementById('noNotesMessage');
        
        const notes = notesToRender || this.getFilteredNotes();
        
        // Sort notes: pinned first, then by date
        const sortedNotes = notes.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (sortedNotes.length === 0) {
            container.innerHTML = '';
            noNotesMessage.style.display = 'block';
            return;
        }

        noNotesMessage.style.display = 'none';
        container.innerHTML = sortedNotes.map(note => this.createNoteHTML(note, searchQuery)).join('');

        // Add event listeners to note actions
        this.bindNoteActions();
    }

    createNoteHTML(note, searchQuery = '') {
        const formattedDate = this.formatDate(note.createdAt);
        const isUpdated = note.updatedAt !== note.createdAt;
        const updatedDate = isUpdated ? this.formatDate(note.updatedAt) : '';
        
        const highlightText = (text) => {
            if (!searchQuery) return text;
            const regex = new RegExp(`(${searchQuery})`, 'gi');
            return text.replace(regex, '<span class="search-highlight">$1</span>');
        };

        return `
            <div class="note-item ${note.isPinned ? 'pinned' : ''}" data-id="${note.id}">
                ${note.isPinned ? '<div class="pinned-indicator" data-ak-tooltip="Pinned Note" data-ak-tooltip-position="left">📌</div>' : ''}
                
                <div class="note-header">
                    <h3 class="note-title">${highlightText(note.title)}</h3>
                    <div class="note-actions">
                        <button class="note-action-btn edit" onclick="notesApp.openEditModal('${note.id}')" data-ak-tooltip="Edit note" data-ak-tooltip-position="bottom">
                            <svg focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="note-action-btn delete" onclick="notesApp.deleteNote('${note.id}')" data-ak-tooltip="Delete note" data-ak-tooltip-position="bottom">
                            <svg focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="note-meta">
                    <span class="note-category ${note.category}">${note.category}</span>
                    <span class="note-date">
                        <svg focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Created: ${formattedDate}
                        ${isUpdated ? `<br>Updated: ${updatedDate}` : ''}
                    </span>
                </div>
                
                <p class="note-content">${highlightText(note.content)}</p>
            </div>
        `;
    }

    bindNoteActions() {
        // This function is called after rendering notes to ensure event listeners are attached
        // The onclick handlers are already set in the HTML, so this is mainly for future enhancements
    }

    updateStats() {
        const totalNotes = this.notes.length;
        const pinnedNotes = this.notes.filter(note => note.isPinned).length;
        
        document.getElementById('totalNotes').textContent = totalNotes;
        document.getElementById('pinnedNotes').textContent = pinnedNotes;
        
        this.updateCategoryStats();
    }

    updateCategoryStats() {
        const categories = {};
        this.notes.forEach(note => {
            categories[note.category] = (categories[note.category] || 0) + 1;
        });

        const categoryStatsContainer = document.getElementById('categoryStats');
        categoryStatsContainer.innerHTML = Object.entries(categories)
            .map(([category, count]) => `
                <div class="category-stat">
                    <span>${category}</span>
                    <strong>${count}</strong>
                </div>
            `).join('') || '<div class="category-stat"><span>No notes yet</span><strong>0</strong></div>';
    }

    clearForm() {
        document.getElementById('noteForm').reset();
    }

    exportNotes() {
        if (this.notes.length === 0) {
            this.showNotification('No notes to export', 'info');
            return;
        }

        const dataStr = JSON.stringify(this.notes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `atlaskit-notes-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Notes exported successfully!', 'success');
    }

    clearAllNotes() {
        if (this.notes.length === 0) {
            this.showNotification('No notes to clear', 'info');
            return;
        }

        if (confirm('Are you sure you want to delete ALL notes? This action cannot be undone.')) {
            this.notes = [];
            this.saveNotes();
            this.renderNotes();
            this.updateStats();
            this.showNotification('All notes cleared successfully!', 'success');
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N: Focus on new note title
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.getElementById('noteTitle').focus();
        }
        
        // Escape: Close modal if open
        if (e.key === 'Escape') {
            if (document.getElementById('editModal').style.display === 'flex') {
                this.closeEditModal();
            }
        }
        
        // Ctrl/Cmd + F: Focus on search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchNotes').focus();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 2) {
            return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString([], { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        switch (type) {
            case 'success':
                notification.style.background = '#006644';
                break;
            case 'error':
                notification.style.background = '#BF2600';
                break;
            case 'info':
            default:
                notification.style.background = '#0052CC';
                break;
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveNotes() {
        try {
            localStorage.setItem('atlaskit_notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Failed to save notes:', error);
            this.showNotification('Failed to save notes to local storage', 'error');
        }
    }

    loadNotes() {
        try {
            const saved = localStorage.getItem('atlaskit_notes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load notes:', error);
            this.showNotification('Failed to load notes from local storage', 'error');
            return [];
        }
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the app when DOM is loaded
let notesApp;
document.addEventListener('DOMContentLoaded', () => {
    notesApp = new NotesApp();
});

// Add some demo data for first-time users
if (!localStorage.getItem('atlaskit_notes')) {
    const demoNotes = [
        {
            id: '1',
            title: 'Welcome to AtlasKit Notes!',
            content: 'This is your first note! You can:\n\n• Create new notes with categories\n• Pin important notes to the top\n• Search through your notes\n• Filter by category\n• Edit and delete notes\n• Export all your notes\n\nTry creating your own note using the form above!',
            category: 'general',
            isPinned: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Meeting Notes - Project Kickoff',
            content: 'Attendees: John, Sarah, Mike\n\nKey points discussed:\n- Project timeline: 3 months\n- Budget approved: $50k\n- Next meeting: Friday 2pm\n\nAction items:\n- Sarah: Create project plan\n- Mike: Set up development environment\n- John: Stakeholder communication',
            category: 'work',
            isPinned: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            title: 'Book Recommendations',
            content: 'Books to read this year:\n\n1. "Atomic Habits" by James Clear\n2. "The Design of Everyday Things" by Don Norman\n3. "Sapiens" by Yuval Noah Harari\n4. "Clean Code" by Robert Martin\n\nCurrently reading: Atomic Habits (Chapter 3)',
            category: 'personal',
            isPinned: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    localStorage.setItem('atlaskit_notes', JSON.stringify(demoNotes));
}
