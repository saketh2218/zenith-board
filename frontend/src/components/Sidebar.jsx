import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trello, FileText, LogOut, User } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <aside style={styles.sidebar} className="glass-panel">
      <div style={styles.header}>
        <span style={styles.logoIcon}>🌌</span>
        <h2 style={styles.logoText}>Zenith</h2>
      </div>

      <nav style={styles.nav}>
        <button
          style={{...styles.navItem, ...(activeTab === 'board' ? styles.activeNavItem : {})}}
          onClick={() => setActiveTab('board')}
        >
          <Trello size={18} style={styles.icon} />
          Kanban Board
        </button>
        
        <button
          style={{...styles.navItem, ...(activeTab === 'notes' ? styles.activeNavItem : {})}}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={18} style={styles.icon} />
          Focus Notes
        </button>
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            <User size={16} />
          </div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>{user?.name || 'Developer'}</div>
            <div style={styles.userEmail}>{user?.email || 'dev@zenith.com'}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Logout
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
    borderRight: '1px solid var(--border-glass)'
  },
  header: {
    padding: '30px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px'
  },
  nav: {
    flex: 1,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    borderRadius: '10px',
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none'
  },
  activeNavItem: {
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#fff',
    fontWeight: '600',
    border: '1px solid rgba(99, 102, 241, 0.25)'
  },
  icon: {
    marginRight: '12px',
    color: 'inherit'
  },
  footer: {
    padding: '20px 16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 6px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-glass)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-secondary)'
  },
  userDetails: {
    overflow: 'hidden'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  userEmail: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    padding: '10px',
    color: '#fca5a5',
    fontSize: '13px',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease'
  }
};

export default Sidebar;
