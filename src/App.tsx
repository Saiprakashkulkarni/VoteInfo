import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, 
  Database, 
  Settings, 
  LogIn,
  User,
  Loader2,
  Mic,
  MicOff
} from 'lucide-react';

// Components
import { ElectionTimeline } from './components/Journey/Timeline';
import { ChatAssistant } from './components/Chat/ChatAssistant';

// Lazy load heavy components for Efficiency
const DataExplorer = lazy(() => import('./components/DataLab/DataExplorer').then(m => ({ default: m.DataExplorer })));
const VoterSimulator = lazy(() => import('./components/Simulator/VoterSimulator').then(m => ({ default: m.VoterSimulator })));

// Services
import { signInWithGoogle, logEvent } from './lib/firebase';

type Tab = 'journey' | 'data' | 'simulator' | 'auth';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('journey');
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    logEvent('page_view', { tab: activeTab });
  }, [activeTab]);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        setUser(result.user);
        logEvent('login_success');
      }
    } catch (error) {
      console.error("Login failed", error);
      logEvent('login_error');
    }
  };

  const LoadingFallback = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-secondary)' }}>
      <Loader2 className="animate-spin" size={32} />
      <span style={{ marginLeft: '1rem' }}>Loading module...</span>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header" role="banner">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>VoteInfo AI</h1>
          <p>The Intelligent Guide to the Indian Electoral Process</p>
        </motion.div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-nav" role="tablist">
        <button 
          id="tab-journey"
          role="tab"
          className={`tab-btn ${activeTab === 'journey' ? 'active' : ''}`} 
          onClick={() => setActiveTab('journey')}
          aria-selected={activeTab === 'journey'}
          aria-controls="panel-journey"
        >
          <Vote size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} aria-hidden="true" />
          Election Journey
        </button>
        <button 
          id="tab-data"
          role="tab"
          className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`} 
          onClick={() => setActiveTab('data')}
          aria-selected={activeTab === 'data'}
          aria-controls="panel-data"
        >
          <Database size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} aria-hidden="true" />
          Data Lab
        </button>
        <button 
          id="tab-simulator"
          role="tab"
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('simulator')}
          aria-selected={activeTab === 'simulator'}
          aria-controls="panel-simulator"
        >
          <Settings size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} aria-hidden="true" />
          Voter Simulator
        </button>
        <button 
          id="tab-auth"
          role="tab"
          className={`tab-btn ${activeTab === 'auth' ? 'active' : ''}`} 
          onClick={() => setActiveTab('auth')}
          aria-selected={activeTab === 'auth'}
          aria-controls="panel-auth"
        >
          {user ? <User size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> : <LogIn size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />}
          {user ? 'My Profile' : 'Sign In'}
        </button>
      </nav>

      {/* Left Column: Feature Content */}
      <motion.main 
        className="glass-panel"
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {activeTab === 'journey' && (
              <motion.div
                key="journey"
                id="panel-journey"
                role="tabpanel"
                aria-labelledby="tab-journey"
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
                id="panel-data"
                role="tabpanel"
                aria-labelledby="tab-data"
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
                id="panel-simulator"
                role="tabpanel"
                aria-labelledby="tab-simulator"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <VoterSimulator />
              </motion.div>
            )}

            {activeTab === 'auth' && (
              <motion.div
                key="auth"
                id="panel-auth"
                role="tabpanel"
                aria-labelledby="tab-auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ textAlign: 'center', padding: '3rem 1rem' }}
              >
                {user ? (
                  <div>
                    <div style={{ width: '80px', height: '80px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <User size={40} color="white" />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {user.name}!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{user.email}</p>
                    <button 
                      onClick={() => setUser(null)}
                      className="tab-btn"
                      style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div>
                    <LogIn size={64} className="text-primary" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: '1rem' }}>Secure Voter Portal</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                      Sign in with your Google account to save your readiness score, track your voting checklist, and get personalized election updates.
                    </p>
                    <button 
                      onClick={handleLogin}
                      className="login-btn"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '2rem', cursor: 'pointer', margin: '0 auto', fontSize: '1.1rem', fontWeight: 600 }}
                    >
                      <LogIn size={20} /> Sign in with Google
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </motion.main>

      {/* Right Column: AI Assistant */}
      <motion.aside 
        className="glass-panel chat-aside"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        aria-label="AI Assistant Sidebar"
      >
        <ChatAssistant />
      </motion.aside>

      {/* Footer Branding */}
      <footer role="contentinfo" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
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
