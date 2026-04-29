import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ElectionTimeline } from './Timeline';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ElectionTimeline Component', () => {
  it('renders all timeline steps titles', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText(/Registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Roll Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/Know Your Candidate/i)).toBeInTheDocument();
  });

  it('expands a step on click and shows details', () => {
    render(<ElectionTimeline />);
    // Step 2 is usually not expanded by default if I recall, 
    // but the code says setExpandedStep(1) by default.
    // Let's click Step 2 (Roll Verification)
    const stepHeader = screen.getByText(/Roll Verification/i);
    fireEvent.click(stepHeader);
    
    expect(screen.getByText(/visit electoralsearch\.in/i)).toBeInTheDocument();
    expect(screen.getByText(/Check Part Number/i)).toBeInTheDocument();
  });
});
