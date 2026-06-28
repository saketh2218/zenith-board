import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BoardProvider } from './context/BoardContext';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import FocusNotes from './components/FocusNotes';
import AuthScreen from './components/AuthScreen';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('board');

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}>🌌</div>
        <div style={styles.loadingText}>Initializing Zenith Workspace...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <BoardProvider>
      <div style={styles.appContainer}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={styles.mainContent}>
          {activeTab === 'board' ? <KanbanBoard /> : <FocusNotes />}
        </main>
      </div>
    </BoardProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

const styles = {
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0b0f19',
    color: '#fff'
  },
  spinner: {
    fontSize: '48px',
    animation: 'spin 3s linear infinite',
    marginBottom: '16px'
  },
  loadingText: {
    fontSize: '14px',
    color: '#9ca3af',
    fontFamily: 'var(--font-family-heading)'
  },
  appContainer: {
    display: 'flex',
    minHeight: '100vh'
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px', // Matches sidebar width
    minHeight: '100vh',
    overflowY: 'auto'
  }
};

export default App;
