import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { Plus, Trash2, Calendar, AlertCircle, CheckSquare, Edit3, X, Check } from 'lucide-react';

const KanbanBoard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useBoard();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // New task form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [targetColumn, setTargetColumn] = useState('todo');

  const columns = [
    { id: 'todo', title: 'To Do', color: '#6366f1' },
    { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'done', title: 'Done', color: '#10b981' }
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, columnId) => {
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await updateTask(taskId, { status: columnId });
    }
  };

  const openAddModal = (columnId) => {
    setTargetColumn(columnId);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setShowAddModal(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title,
      description,
      priority,
      dueDate,
      status: targetColumn,
      subtasks: []
    });

    setShowAddModal(false);
  };

  const handleSaveEditTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    await updateTask(editingTask._id || editingTask.id, {
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
      dueDate: editingTask.dueDate,
      subtasks: editingTask.subtasks
    });

    setEditingTask(null);
  };

  const toggleSubtask = async (task, subtaskId) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st._id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    await updateTask(task._id || task.id, { subtasks: updatedSubtasks });
  };

  const addSubtaskEdit = (task) => {
    const newSubtask = { _id: Math.random().toString(36).substr(2, 9), title: '', completed: false };
    setEditingTask({
      ...task,
      subtasks: [...task.subtasks, newSubtask]
    });
  };

  const updateSubtaskText = (subtaskId, text) => {
    setEditingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => st._id === subtaskId ? { ...st, title: text } : st)
    }));
  };

  const removeSubtaskEdit = (subtaskId) => {
    setEditingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st._id !== subtaskId)
    }));
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case 'high': return 'rgba(239, 68, 68, 0.15)';
      case 'medium': return 'rgba(245, 158, 11, 0.15)';
      default: return 'rgba(16, 185, 129, 0.15)';
    }
  };

  const getPriorityText = (level) => {
    switch (level) {
      case 'high': return '#fca5a5';
      case 'medium': return '#fcd34d';
      default: return '#a7f3d0';
    }
  };

  return (
    <div style={styles.boardContainer} className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Workspace Board</h1>
          <p style={styles.subtitle}>Drag cards to update task statuses seamlessly</p>
        </div>
      </div>

      <div style={styles.grid}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);

          return (
            <div 
              key={col.id} 
              style={styles.column} 
              className="glass-panel"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div style={{...styles.columnHeader, borderTopColor: col.color}}>
                <div style={styles.columnTitleGroup}>
                  <div style={{...styles.dot, backgroundColor: col.color}} />
                  <span style={styles.columnTitle}>{col.title}</span>
                </div>
                <span style={styles.badge}>{colTasks.length}</span>
              </div>

              <div style={styles.cardContainer}>
                {colTasks.map(task => {
                  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;

                  return (
                    <div
                      key={task._id || task.id}
                      style={styles.card}
                      className="glass-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id || task.id)}
                    >
                      <div style={styles.cardHeader}>
                        <span style={{
                          ...styles.priorityBadge, 
                          backgroundColor: getPriorityColor(task.priority),
                          color: getPriorityText(task.priority)
                        }}>
                          {task.priority}
                        </span>
                        <div style={styles.cardActions}>
                          <button style={styles.actionIconBtn} onClick={() => setEditingTask(task)}>
                            <Edit3 size={14} />
                          </button>
                          <button style={styles.actionIconBtn} onClick={() => deleteTask(task._id || task.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 style={styles.cardTitle}>{task.title}</h4>
                      {task.description && <p style={styles.cardDesc}>{task.description}</p>}

                      {totalSubtasks > 0 && (
                        <div style={styles.subtaskProgress}>
                          <div style={styles.subtaskLabel}>
                            <CheckSquare size={12} style={{marginRight: 4}} />
                            <span>{completedSubtasks}/{totalSubtasks} Checklist</span>
                          </div>
                          <div style={styles.progressBarBg}>
                            <div style={{
                              ...styles.progressBarFill, 
                              width: `${(completedSubtasks / totalSubtasks) * 100}%`
                            }} />
                          </div>
                          <div style={styles.subtaskListInline}>
                            {task.subtasks.map(st => (
                              <div 
                                key={st._id} 
                                style={styles.subtaskInlineItem}
                                onClick={() => toggleSubtask(task, st._id)}
                              >
                                <div style={{
                                  ...styles.checkboxCustom, 
                                  borderColor: st.completed ? 'var(--accent-success)' : 'rgba(255,255,255,0.2)',
                                  background: st.completed ? 'var(--accent-success)' : 'transparent'
                                }}>
                                  {st.completed && <Check size={8} color="#000" strokeWidth={4} />}
                                </div>
                                <span style={{
                                  ...styles.subtaskInlineTitle,
                                  textDecoration: st.completed ? 'line-through' : 'none',
                                  color: st.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)'
                                }}>
                                  {st.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {task.dueDate && (
                        <div style={styles.cardFooter}>
                          <Calendar size={12} style={{marginRight: 4}} />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button style={styles.addBtn} onClick={() => openAddModal(col.id)}>
                <Plus size={16} style={{marginRight: 6}} />
                Add Card
              </button>
            </div>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="glass-panel">
            <div style={styles.modalHeader}>
              <h3>Create Task ({columns.find(c => c.id === targetColumn)?.title})</h3>
              <button style={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Task Title</label>
                <input 
                  type="text" 
                  placeholder="Summarize the action..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide further context or links..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

              <div style={styles.row}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.formLabel}>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.formLabel}>Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    style={styles.dateInput}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/DETAILS MODAL */}
      {editingTask && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="glass-panel">
            <div style={styles.modalHeader}>
              <h3>Edit Task Details</h3>
              <button style={styles.closeBtn} onClick={() => setEditingTask(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEditTask} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Task Title</label>
                <input 
                  type="text" 
                  value={editingTask.title} 
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} 
                  required 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea 
                  rows={3}
                  value={editingTask.description} 
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} 
                />
              </div>

              <div style={styles.row}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.formLabel}>Priority</label>
                  <select 
                    value={editingTask.priority} 
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.formLabel}>Due Date</label>
                  <input 
                    type="date" 
                    value={editingTask.dueDate} 
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})} 
                    style={styles.dateInput}
                  />
                </div>
              </div>

              {/* Subtasks checklist section */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Checklist Items</label>
                <div style={styles.subtaskEditList}>
                  {editingTask.subtasks?.map(st => (
                    <div key={st._id} style={styles.subtaskEditRow}>
                      <input 
                        type="text" 
                        value={st.title} 
                        placeholder="Subtask checklist item name..." 
                        onChange={(e) => updateSubtaskText(st._id, e.target.value)}
                        style={styles.subtaskEditInput}
                      />
                      <button 
                        type="button" 
                        style={styles.subtaskRemoveBtn}
                        onClick={() => removeSubtaskEdit(st._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    style={styles.subtaskAddBtn}
                    onClick={() => addSubtaskEdit(editingTask)}
                  >
                    <Plus size={12} style={{marginRight: 4}} /> Add Checklist Item
                  </button>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  boardContainer: {
    padding: '40px 30px'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff'
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    marginTop: '4px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start'
  },
  column: {
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80vh'
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    borderTop: '3px solid transparent',
    paddingTop: '4px'
  },
  columnTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  columnTitle: {
    fontSize: '15px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  badge: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--color-text-secondary)',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px 0',
    overflowY: 'auto',
    flex: 1
  },
  card: {
    padding: '16px',
    cursor: 'grab'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  priorityBadge: {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px'
  },
  cardActions: {
    display: 'flex',
    gap: '4px'
  },
  actionIconBtn: {
    background: 'transparent',
    color: 'var(--color-text-muted)',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '6px'
  },
  cardDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '14px'
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  addBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '12px',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    marginTop: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  modalContent: {
    width: '90%',
    maxWidth: '500px',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '16px'
  },
  closeBtn: {
    background: 'transparent',
    color: 'var(--color-text-secondary)'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  row: {
    display: 'flex',
    gap: '16px'
  },
  dateInput: {
    padding: '11px 16px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px'
  },
  subtaskProgress: {
    margin: '12px 0'
  },
  subtaskLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    marginBottom: '6px'
  },
  progressBarBg: {
    height: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressBarFill: {
    height: '100%',
    background: 'var(--accent-success)',
    transition: 'width 0.3s ease'
  },
  subtaskListInline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  subtaskInlineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  checkboxCustom: {
    width: '12px',
    height: '12px',
    border: '1px solid',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtaskInlineTitle: {
    fontSize: '11px'
  },
  subtaskEditList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  subtaskEditRow: {
    display: 'flex',
    gap: '8px'
  },
  subtaskEditInput: {
    padding: '8px 12px',
    fontSize: '13px'
  },
  subtaskRemoveBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '4px',
    width: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtaskAddBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    color: 'var(--accent-primary)',
    fontSize: '11px',
    padding: '4px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }
};

export default KanbanBoard;
