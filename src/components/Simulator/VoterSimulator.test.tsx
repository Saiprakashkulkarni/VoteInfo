import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VoterSimulator } from './VoterSimulator';
import React from 'react';

// Mock framer-motion to avoid layout issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mocking logEvent
vi.mock('../../lib/firebase', () => ({
  logEvent: vi.fn(),
}));

describe('VoterSimulator Component', () => {
  it('renders correctly and shows default readiness score', () => {
    render(<VoterSimulator />);
    // Use findByText or more flexible regex if needed
    expect(screen.getByText(/Voter Readiness Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/80%/i)).toBeInTheDocument(); 
  });

  it('decreases score when unchecking ID requirement', () => {
    render(<VoterSimulator />);
    const idCheckbox = screen.getByLabelText(/I have a valid Photo ID/i);
    fireEvent.click(idCheckbox); // Uncheck it (default was true)
    
    // 80 - 30 = 50
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
    expect(screen.getByText(/Gather 1 of the 12 alternate photo IDs/i)).toBeInTheDocument();
  });

  it('resets score on reset button click', () => {
    render(<VoterSimulator />);
    const idCheckbox = screen.getByLabelText(/I have a valid Photo ID/i);
    fireEvent.click(idCheckbox); // Uncheck
    
    const resetBtn = screen.getByLabelText(/Reset all simulator inputs/i);
    fireEvent.click(resetBtn);
    
    expect(screen.getByText(/80%/i)).toBeInTheDocument();
  });

  it('shows the map search results when requested', () => {
    render(<VoterSimulator />);
    const input = screen.getByPlaceholderText(/e\.g\., Bangalore South/i);
    const searchBtn = screen.getByText(/Search/i);
    
    fireEvent.change(input, { target: { value: 'Mumbai' } });
    fireEvent.click(searchBtn);
    
    const map = screen.getByTitle(/Polling Station Map/i);
    expect(map).toBeInTheDocument();
    expect(map.getAttribute('src')).toContain('Mumbai');
  });
});
