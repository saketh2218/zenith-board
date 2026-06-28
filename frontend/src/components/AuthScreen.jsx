import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, LogIn, UserPlus } from 'lucide-react';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (isLogin) {
      if (!email || !password) {
        setFormError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }
      try {
        await login(email, password);
      } catch (err) {
        // Error handled in AuthContext, local catch to stop loader
      }
    } else {
      if (!name || !email || !password) {
        setFormError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }
      try {
        await signup(name, email, password);
      } catch (err) {
        // Error handled in AuthContext
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox} className="glass-panel animate-fade-in">
        <div style={styles.logoHeader}>
          <div style={styles.logoIcon}>🌌</div>
          <h1 style={styles.logoTitle}>Zenith Board</h1>
          <p style={styles.logoSubtitle}>Your Focused Productivity Workspace</p>
        </div>

        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabButton, ...(isLogin ? styles.activeTab : {})}} 
            onClick={() => { setIsLogin(true); setFormError(''); }}
          >
            <LogIn size={16} style={{marginRight: 6}} />
            Sign In
          </button>
          <button 
            style={{...styles.tabButton, ...(!isLogin ? styles.activeTab : {})}} 
            onClick={() => { setIsLogin(false); setFormError(''); }}
          >
            <UserPlus size={16} style={{marginRight: 6}} />
            Sign Up
          </button>
        </div>

        {(formError || error) && (
          <div style={styles.errorAlert}>
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary" style={styles.submitBtn}>
            {isSubmitting ? 'Authenticating...' : isLogin ? 'Access Workspace' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px'
  },
  authBox: {
    width: '100%',
    maxWidth: '440px',
    borderRadius: '16px',
    padding: '40px 30px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  logoHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  logoIcon: {
    fontSize: '44px',
    marginBottom: '8px'
  },
  logoTitle: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px'
  },
  logoSubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px'
  },
  tabContainer: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  tabButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    padding: '10px',
    borderRadius: '6px',
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--color-text-secondary)'
  },
  submitBtn: {
    marginTop: '8px',
    fontSize: '15px',
    fontWeight: '600',
    padding: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default AuthScreen;
