import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  Users, 
  MapPin, 
  Vote, 
  ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { 
    id: 1, 
    title: "Registration", 
    icon: UserCheck, 
    desc: "The foundation of voting. Ensure you are 18+ and an Indian citizen. Apply via National Voter's Service Portal (NVSP) or Form 6.",
    details: ["Requires Age Proof", "Requires Address Proof", "Online/Offline options available"]
  },
  { 
    id: 2, 
    title: "Roll Verification", 
    icon: FileText, 
    desc: "Having a card isn't enough! Verify your name in the electoral roll. Use the 'Voter Helpline' app or visit electoralsearch.in.",
    details: ["Check Part Number", "Check Serial Number", "Verify Constituency"]
  },
  { 
    id: 3, 
    title: "Know Your Candidate", 
    icon: Users, 
    desc: "Be an informed voter. Check candidate affidavits, criminal records, and educational background via the KYC app.",
    details: ["Criminal Antecedents", "Assets and Liabilities", "Educational Qualifications"]
  },
  { 
    id: 4, 
    title: "Booth Preparation", 
    icon: MapPin, 
    desc: "Find your polling station. Note the timing (usually 7 AM to 6 PM) and carry your Voter ID or valid alternate documents.",
    details: ["Voter Information Slip", "12 Approved Photo IDs", "Check Queue Status if available"]
  },
  { 
    id: 5, 
    title: "Casting the Vote", 
    icon: Vote, 
    desc: "The moment of truth. Verify your details, get the ink, press the button on EVM, and confirm via VVPAT slip.",
    details: ["Indelible Ink", "EVM Beep", "7-second VVPAT view"]
  }
];

export const ElectionTimeline: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <div className="timeline-container">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Vote className="text-primary" /> Your Election Journey
      </h2>
      
      <div className="vertical-timeline" role="list">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isExpanded = expandedStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className={`timeline-step ${isExpanded ? 'expanded' : ''}`}
              role="listitem"
            >
              <div 
                className="step-header" 
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                aria-expanded={isExpanded}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setExpandedStep(step.id)}
              >
                <div className="step-icon-wrapper">
                  <Icon size={20} />
                </div>
                <div className="step-title-area">
                  <h3>{step.title}</h3>
                  {!isExpanded && <p className="truncate-text">{step.desc}</p>}
                </div>
                <ChevronDown className={`chevron ${isExpanded ? 'rotate' : ''}`} size={18} />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="step-body"
                  >
                    <p>{step.desc}</p>
                    <ul className="step-details">
                      {step.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
