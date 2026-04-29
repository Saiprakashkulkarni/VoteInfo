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

  const reset = () => {
    setState({
      isRegistered: 'yes',
      location: 'home',
      hasID: true,
      knowsPhase: false
    });
    logEvent('simulator_reset');
  };

  return (
    <div className="voter-simulator">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings className="text-primary" /> Voter Readiness Simulator
      </h2>

      <div className="simulator-grid">
        <div className="controls-panel">
          <div className="input-field">
            <label htmlFor="reg-status">Registration Status</label>
            <select 
              id="reg-status"
              value={state.isRegistered} 
              onChange={(e) => setState({...state, isRegistered: e.target.value})}
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

          <div className="checkbox-group">
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

          <button className="reset-btn" onClick={reset}>
            <RefreshCcw size={16} /> Reset Scenario
          </button>
        </div>

        <div className="results-panel">
          <div className="readiness-gauge">
            <div className="gauge-header">
              <h4>Readiness Score</h4>
              <span className={`score-badge ${readinessScore > 80 ? 'good' : 'warning'}`}>
                {readinessScore}%
              </span>
            </div>
            <div className="gauge-bar">
              <div 
                className="gauge-fill" 
                style={{ width: `${readinessScore}%` }} 
              />
            </div>
          </div>

          <div className="recommendations">
            <h4><ShieldCheck size={18} className="text-primary" /> Your Checklist</h4>
            {getRecommendations().length === 0 ? (
              <div className="success-msg">
                <CheckCircle2 size={16} /> You are fully prepared to vote!
              </div>
            ) : (
              <ul className="rec-list">
                {getRecommendations().map((rec, i) => (
                  <li key={i}><AlertCircle size={14} /> {rec}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="security-notice">
        <p><AlertCircle size={12} /> <strong>Note:</strong> This simulator does not collect personal data. Your selections are processed locally for educational purposes only.</p>
      </div>
    </div>
  );
};
