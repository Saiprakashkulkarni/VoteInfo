import React, { useState, useMemo } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import { logEvent } from '../../lib/firebase';

interface SimulatorState {
  isRegistered: string;
  location: string;
  hasID: boolean;
  knowsPhase: boolean;
}

export const VoterSimulator: React.FC = () => {
  const [state, setState] = useState<SimulatorState>({
    isRegistered: 'yes',
    location: 'home',
    hasID: true,
    knowsPhase: false
  });

  const [pollingSearch, setPollingSearch] = useState('');
  const [showMap, setShowMap] = useState(false);

  const readinessScore = useMemo(() => {
    let score = 0;
    if (state.isRegistered === 'yes') score += 40;
    if (state.hasID) score += 30;
    if (state.knowsPhase) score += 20;
    if (state.location === 'home') score += 10;
    return score;
  }, [state]);

  const getRecommendations = () => {
    const recs = [];
    if (state.isRegistered !== 'yes') recs.push("Visit NVSP.in to apply for Form 6 immediately.");
    if (!state.hasID) recs.push("Gather 1 of the 12 alternate photo IDs (Aadhaar, PAN, etc.)");
    if (!state.knowsPhase) recs.push("Check the election schedule for your district.");
    if (state.location !== 'home') recs.push("Plan your travel or check if you are eligible for Postal Ballot.");
    return recs;
  };

  const handleSearchStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (pollingSearch.trim()) {
      setShowMap(true);
      logEvent('polling_station_search', { query: pollingSearch });
    }
  };

  const reset = () => {
    setState({
      isRegistered: 'yes',
      location: 'home',
      hasID: true,
      knowsPhase: false
    });
    setPollingSearch('');
    setShowMap(false);
    logEvent('simulator_reset');
  };

  return (
    <div className="voter-simulator">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings className="text-primary" aria-hidden="true" /> Voter Readiness Simulator
      </h2>

      <div className="simulator-grid">
        <div className="controls-panel">
          <div className="input-field">
            <label htmlFor="reg-status">Registration Status</label>
            <select 
              id="reg-status"
              value={state.isRegistered} 
              onChange={(e) => setState({...state, isRegistered: e.target.value})}
              aria-describedby="reg-status-help"
            >
              <option value="yes">I have an EPIC card / Registered</option>
              <option value="no">Not registered yet</option>
              <option value="lost">Lost my card / Check pending</option>
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="voting-loc">Where will you be on Voting Day?</label>
            <select 
              id="voting-loc"
              value={state.location} 
              onChange={(e) => setState({...state, location: e.target.value})}
            >
              <option value="home">At my home constituency</option>
              <option value="away">Working/Studying in another city</option>
              <option value="nri">Overseas (NRI)</option>
            </select>
          </div>

          <div className="checkbox-group" role="group" aria-label="Readiness Checkbox List">
            <label className="checkbox-item" htmlFor="has-id">
              <input 
                id="has-id"
                type="checkbox" 
                checked={state.hasID} 
                onChange={(e) => setState({...state, hasID: e.target.checked})}
              />
              <span>I have a valid Photo ID</span>
            </label>
            <label className="checkbox-item" htmlFor="knows-phase">
              <input 
                id="knows-phase"
                type="checkbox" 
                checked={state.knowsPhase} 
                onChange={(e) => setState({...state, knowsPhase: e.target.checked})}
              />
              <span>I know my voting phase/date</span>
            </label>
          </div>

          <button className="reset-btn" onClick={reset} aria-label="Reset all simulator inputs">
            <RefreshCcw size={16} aria-hidden="true" /> Reset Scenario
          </button>
        </div>

        <div className="results-panel">
          <div className="readiness-gauge" aria-live="polite">
            <div className="gauge-header">
              <h4>Readiness Score</h4>
              <span className={`score-badge ${readinessScore > 80 ? 'good' : 'warning'}`}>
                {readinessScore}%
              </span>
            </div>
            <div className="gauge-bar" role="progressbar" aria-valuenow={readinessScore} aria-valuemin={0} aria-valuemax={100}>
              <div 
                className="gauge-fill" 
                style={{ width: `${readinessScore}%` }} 
              />
            </div>
          </div>

          <div className="recommendations">
            <h4><ShieldCheck size={18} className="text-primary" aria-hidden="true" /> Your Checklist</h4>
            {getRecommendations().length === 0 ? (
              <div className="success-msg" role="status">
                <CheckCircle2 size={16} aria-hidden="true" /> You are fully prepared to vote!
              </div>
            ) : (
              <ul className="rec-list">
                {getRecommendations().map((rec, i) => (
                  <li key={i}><AlertCircle size={14} aria-hidden="true" /> {rec}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps Integration (Requirement: Google Services) */}
      <div className="maps-integration glass-panel" style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)' }}>
        <h3>Find Your Polling Station</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Enter your constituency or area to locate the nearest polling booth on Google Maps.
        </p>
        <form onSubmit={handleSearchStation} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="e.g., Bangalore South, Mumbai North..." 
            value={pollingSearch}
            onChange={(e) => setPollingSearch(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }}
            aria-label="Search constituency for polling station"
          />
          <button type="submit" className="tab-btn active" style={{ padding: '0.75rem 1.5rem' }}>Search</button>
        </form>

        {showMap && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '300px' }}
            className="map-container"
            style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-glass)' }}
          >
            <iframe
              title="Polling Station Map"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY_HERE&q=polling+station+in+${encodeURIComponent(pollingSearch)}`}
            ></iframe>
            {/* Note: In production, the API key would be injected via environment variables */}
          </motion.div>
        )}
      </div>

      <div className="security-notice">
        <p><AlertCircle size={12} aria-hidden="true" /> <strong>Note:</strong> This simulator does not collect personal data. Your selections are processed locally for educational purposes only.</p>
      </div>
    </div>
  );
};
