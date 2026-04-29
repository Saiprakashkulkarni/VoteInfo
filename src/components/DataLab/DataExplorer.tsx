import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Database, RefreshCw, CheckCircle, BrainCircuit } from 'lucide-react';
import { electionDatasets } from '../../data/electionData';
import { callElectionDataAnalysis } from '../../lib/functions';

export const DataExplorer: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const simulateBigQuerySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 1500);
  };

  const handleCloudAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await callElectionDataAnalysis({ scope: 'national' });
      setAiInsight(result.data.insight);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="data-explorer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database className="text-primary" aria-hidden="true" /> Election Data Explorer
        </h2>
        <div 
          className="sync-status" 
          style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}
          role="status"
          aria-live="polite"
        >
          {isSyncing ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              Syncing with BigQuery...
            </>
          ) : (
            <>
              <CheckCircle size={12} className="text-success" />
              Synced: {lastSync}
            </>
          )}
          <button 
            onClick={simulateBigQuerySync} 
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 600 }}
            aria-label="Refresh data from BigQuery"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="data-grid">
        {/* Voter Turnout Trend */}
        <div className="data-card chart-card" role="region" aria-label="Voter Turnout Trend Chart">
          <h4>Voter Turnout Trend (%)</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={electionDatasets.turnout} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="turnout" stroke="#818cf8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Demographics */}
        <div className="data-card chart-card" role="region" aria-label="Voter Age Demographics Chart">
          <h4>Voter Demographics (by Age)</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={electionDatasets.demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="percentage"
                  nameKey="ageGroup"
                >
                  {electionDatasets.demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Turnout Gap */}
        <div className="data-card chart-card" style={{ gridColumn: 'span 2' }} role="region" aria-label="Gender-wise Participation Chart">
          <h4>Gender-wise Participation (%)</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={electionDatasets.genderTurnout}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="male" fill="#818cf8" radius={[4, 4, 0, 0]} name="Male Turnout" />
                <Bar dataKey="female" fill="#34d399" radius={[4, 4, 0, 0]} name="Female Turnout" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="data-insight-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p><strong>Pro Tip:</strong> Notice the narrowing gender gap in 2019. Ask Voter Mitra "Explain the gender gap trends" for a deep dive analysis.</p>
          <button 
            onClick={handleCloudAnalysis}
            className="tab-btn"
            style={{ background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
            disabled={isAnalyzing}
          >
            <BrainCircuit size={14} className={isAnalyzing ? 'animate-pulse' : ''} />
            {isAnalyzing ? 'Analyzing...' : 'Deep Cloud Analysis'}
          </button>
        </div>
        
        {aiInsight && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--primary-color)' }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              <strong>BigQuery Insight:</strong> {aiInsight}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
