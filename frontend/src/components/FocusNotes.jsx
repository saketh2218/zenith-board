import React, { useState, useEffect, useRef } from 'react';
import { useBoard } from '../context/BoardContext';
import { Plus, Trash2, Save, Cloud, Loader2 } from 'lucide-react';

const FocusNotes = () => {
  const { notes, addNote, updateNote, deleteNote } = useBoard();
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  
  // Note editing states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef(null);

  const colors = [
    { code: '#3b82f6', name: 'Blue' },
    { code: '#10b981', name: 'Green' },
    { code: '#f59e0b', name: 'Amber' },
    { code: '#ef4444', name: 'Red' },
    { code: '#8b5cf6', name: 'Purple' }
  ];

  const selectedNote = notes.find(n => n._id === selectedNoteId || n.id === selectedNoteId);

  // Load note content into editing states when selection changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setColor(selectedNote.color || '#3b82f6');
    } else {
      setTitle('');
      setContent('');
      setColor('#3b82f6');
    }
  }, [selectedNoteId, notes]);

  // Handle Note Auto-saving (Debounced)
  const triggerAutoSave = (field, value) => {
    if (!selectedNoteId) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    setSaving(true);

    saveTimeout.current = setTimeout(async () => {
      const updates = {
        title: field === 'title' ? value : title,
        content: field === 'content' ? value : content,
        color: field === 'color' ? value : color
      };
      
      await updateNote(selectedNoteId, updates);
      setSaving(false);
    }, 800);
  };

  const handleCreateNote = async () => {
    const newNote = await addNote({
      title: 'New Focus Note',
      content: '',
      color: '#3b82f6'
    });
    if (newNote) {
      setSelectedNoteId(newNote._id || newNote.id);
    }
  };

  const handleDeleteNote = async (id, e) => {
    e.stopPropagation();
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    await deleteNote(id);
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.sidebar} className="glass-panel">
        <div style={styles.sidebarHeader}>
          <h3>My Notes</h3>
          <button style={styles.addBtn} onClick={handleCreateNote}>
            <Plus size={16} />
          </button>
        </div>

        <div style={styles.notesList}>
          {notes.length === 0 ? (
            <div style={styles.emptyState}>No notes created yet. Click '+' to start.</div>
          ) : (
            notes.map(note => (
              <div
                key={note._id || note.id}
                style={{
                  ...styles.noteItem, 
                  ...(selectedNoteId === (note._id || note.id) ? styles.activeNoteItem : {})
                }}
                onClick={() => setSelectedNoteId(note._id || note.id)}
              >
                <div style={{...styles.colorIndicator, backgroundColor: note.color}} />
                <div style={styles.noteItemDetails}>
                  <div style={styles.noteItemTitle}>{note.title || 'Untitled Note'}</div>
                  <div style={styles.noteItemSnippet}>
                    {note.content ? note.content.substring(0, 40) + (note.content.length > 40 ? '...' : '') : 'Empty note'}
                  </div>
                </div>
                <button 
                  style={styles.deleteBtn}
                  onClick={(e) => handleDeleteNote(note._id || note.id, e)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.editorArea}>
        {selectedNoteId ? (
          <div style={styles.editor} className="glass-panel">
            <div style={styles.editorHeader}>
              <div style={styles.colorPicker}>
                {colors.map(c => (
                  <button
                    key={c.code}
                    style={{
                      ...styles.colorDot, 
                      backgroundColor: c.code,
                      border: color === c.code ? '2px solid #fff' : '2px solid transparent'
                    }}
                    onClick={() => {
                      setColor(c.code);
                      triggerAutoSave('color', c.code);
                    }}
                  />
                ))}
              </div>
              
              <div style={styles.saveIndicator}>
                {saving ? (
                  <>
                    <Loader2 size={14} style={styles.spin} />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={14} style={{color: 'var(--accent-success)'}} />
                    <span>Saved</span>
                  </>
                )}
              </div>
            </div>

            <input
              type="text"
              style={styles.noteTitleInput}
              value={title}
              placeholder="Note Title"
              onChange={(e) => {
                setTitle(e.target.value);
                triggerAutoSave('title', e.target.value);
              }}
            />

            <textarea
              style={styles.noteBodyTextarea}
              value={content}
              placeholder="Start drafting thoughts, goals, or meeting minutes here..."
              onChange={(e) => {
                setContent(e.target.value);
                triggerAutoSave('content', e.target.value);
              }}
            />
          </div>
        ) : (
          <div style={styles.noSelection} className="glass-panel">
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📓</div>
            <h3>No Note Selected</h3>
            <p>Select a note from the panel or tap '+' to create a brand new text workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 30px',
    display: 'flex',
    gap: '24px',
    height: 'calc(100vh - 80px)',
    maxHeight: '85vh'
  },
  sidebar: {
    width: '280px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  sidebarHeader: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  addBtn: {
    background: 'rgba(99,102,241,0.15)',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(99,102,241,0.25)'
  },
  notesList: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px'
  },
  emptyState: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    marginTop: '40px',
    lineHeight: '1.5'
  },
  noteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    position: 'relative',
    group: 'true'
  },
  activeNoteItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  colorIndicator: {
    width: '6px',
    height: '30px',
    borderRadius: '3px',
    flexShrink: 0
  },
  noteItemDetails: {
    flex: 1,
    overflow: 'hidden'
  },
  noteItemTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  noteItemSnippet: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: '2px'
  },
  deleteBtn: {
    background: 'transparent',
    color: 'var(--color-text-muted)',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: '6px'
  },
  editorArea: {
    flex: 1,
    height: '100%'
  },
  editor: {
    height: '100%',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column'
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  colorPicker: {
    display: 'flex',
    gap: '6px'
  },
  colorDot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  saveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)'
  },
  spin: {
    animation: 'spin 1.5s linear infinite'
  },
  noteTitleInput: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    border: 'none',
    background: 'transparent',
    padding: '0 0 12px 0',
    marginBottom: '16px',
    borderBottom: '1px dashed rgba(255,255,255,0.05)',
    borderRadius: 0,
    outline: 'none'
  },
  noteBodyTextarea: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    resize: 'none',
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--color-text-primary)',
    padding: 0,
    outline: 'none'
  },
  noSelection: {
    height: '100%',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    padding: '40px'
  }
};

export default FocusNotes;
