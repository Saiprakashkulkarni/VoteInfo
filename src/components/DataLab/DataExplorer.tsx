import React from 'react';
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
import { Database } from 'lucide-react';
import { electionDatasets } from '../../data/electionData';

export const DataExplorer: React.FC = () => {
  return (
    <div className="data-explorer">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Database className="text-primary" /> Election Data Explorer
      </h2>
      
      <div className="data-grid">
        {/* Voter Turnout Trend */}
        <div className="data-card chart-card">
          <h4>Voter Turnout Trend (%)</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={electionDatasets.turnout}>
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
        <div className="data-card chart-card">
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
        <div className="data-card chart-card" style={{ gridColumn: 'span 2' }}>
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

      <div className="data-insight-box">
        <p><strong>Pro Tip:</strong> Notice the narrowing gender gap in 2019. Ask Voter Mitra "Explain the gender gap trends" for a deep dive analysis using Gemini's reasoning.</p>
      </div>
    </div>
  );
};
