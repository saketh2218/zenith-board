import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
  const { user, authHeader } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Fetch initial tasks and notes when user logs in
  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchNotes();
    } else {
      setTasks([]);
      setNotes([]);
    }
  }, [user]);

  // TASK OPERATIONS
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await fetch('/api/tasks', {
        headers: authHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [newTask, ...prev]);
        return newTask;
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => (t._id === id || t.id === id ? { ...t, ...updates } : t)));

      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(updates)
      });
      
      if (!res.ok) {
        // Rollback on error
        fetchTasks();
      } else {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t._id === id || t.id === id ? updated : t)));
      }
    } catch (err) {
      console.error('Error updating task:', err);
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    try {
      setTasks(prev => prev.filter(t => t._id !== id && t.id !== id));
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      fetchTasks();
    }
  };

  // NOTE OPERATIONS
  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const res = await fetch('/api/notes', {
        headers: authHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const addNote = async (noteData = {}) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(noteData)
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes(prev => [newNote, ...prev]);
        return newNote;
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const updateNote = async (id, updates) => {
    try {
      // Optimistic update
      setNotes(prev => prev.map(n => (n._id === id || n.id === id ? { ...n, ...updates } : n)));

      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(updates)
      });
      
      if (!res.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Error updating note:', err);
      fetchNotes();
    }
  };

  const deleteNote = async (id) => {
    try {
      setNotes(prev => prev.filter(n => n._id !== id && n.id !== id));
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      fetchNotes();
    }
  };

  return (
    <BoardContext.Provider value={{
      tasks, notes, loadingTasks, loadingNotes,
      addTask, updateTask, deleteTask, fetchTasks,
      addNote, updateNote, deleteNote, fetchNotes
    }}>
      {children}
    </BoardContext.Provider>
  );
};
