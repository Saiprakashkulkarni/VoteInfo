import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatAssistant } from './ChatAssistant';
import * as geminiService from '../../lib/gemini';
import React from 'react';

// Mock the Gemini service
vi.mock('../../lib/gemini', () => ({
  getGeminiResponse: vi.fn(),
}));

// Mock Firebase
vi.mock('../../lib/firebase', () => ({
  logEvent: vi.fn(),
}));

describe('ChatAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ChatAssistant />);
    expect(screen.getByText(/Voter Mitra AI/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Type your question/i)).toBeDefined();
  });

  it('sends a message and displays the AI response', async () => {
    const mockResponse = "The election process starts with voter registration.";
    vi.mocked(geminiService.getGeminiResponse).mockResolvedValue(mockResponse);

    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText(/Type your question/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText(/How do I vote\?/i)).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeDefined();
    });
  });

  it('uses quick replies', async () => {
    const mockResponse = "Turnout has been increasing steadily.";
    vi.mocked(geminiService.getGeminiResponse).mockResolvedValue(mockResponse);

    render(<ChatAssistant />);
    // Match the first sample question
    const quickReply = screen.getByText(/How has voter turnout changed/i);
    fireEvent.click(quickReply);

    expect(screen.getByText(/How has voter turnout changed/i)).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeDefined();
    });
  });
});
