import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, 
  Database, 
  Settings, 
  LogIn,
  User
} from 'lucide-react';

// Components
import { ElectionTimeline } from './components/Journey/Timeline';
import { DataExplorer } from './components/DataLab/DataExplorer';
import { VoterSimulator } from './components/Simulator/VoterSimulator';
import { ChatAssistant } from './components/Chat/ChatAssistant';

// Services
import { signInWithGoogle, logEvent } from './lib/firebase';

type Tab = 'journey' | 'data' | 'simulator';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('journey');
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    logEvent('page_view', { tab: activeTab });
  }, [activeTab]);

  const handleLogin = async () => {
    const result = await signInWithGoogle();
    if (result.user) {
      setUser(result.user);
      logEvent('login_success');
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>VoteInfo AI</h1>
          <p>The Intelligent Guide to the Indian Electoral Process</p>
        </motion.div>
        
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {user ? (
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '2rem' }}>
              <User size={18} />
              <span>{user.name}</span>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="login-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '2rem', cursor: 'pointer' }}
            >
              <LogIn size={18} /> Sign in with Google
            </button>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'journey' ? 'active' : ''}`} 
          onClick={() => setActiveTab('journey')}
          aria-selected={activeTab === 'journey'}
        >
          <Vote size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Election Journey
        </button>
        <button 
          className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`} 
          onClick={() => setActiveTab('data')}
          aria-selected={activeTab === 'data'}
        >
          <Database size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Data Lab
        </button>
        <button 
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('simulator')}
          aria-selected={activeTab === 'simulator'}
        >
          <Settings size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Voter Simulator
        </button>
      </nav>

      {/* Left Column: Feature Content */}
      <motion.main 
        className="glass-panel"
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ElectionTimeline />
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DataExplorer />
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <VoterSimulator />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Right Column: AI Assistant */}
      <motion.aside 
        className="glass-panel chat-aside"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ChatAssistant />
      </motion.aside>

      {/* Footer Branding */}
      <footer style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p>&copy; 2026 VoteInfo AI. Empowering voters with Generative AI Reasoning.</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Accessibility Statement</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
