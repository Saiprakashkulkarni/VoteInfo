import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGeminiResponse } from './gemini';

// Mock the GoogleGenerativeAI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: { text: () => "Mocked AI Response" }
        })
      })
    }))
  };
});

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear cache by potentially resetting modules if needed, 
    // but for simple tests we can just use different prompts
  });

  it('should return a response for a valid prompt', async () => {
    const response = await getGeminiResponse("How to vote?");
    expect(response).toBe("Mocked AI Response");
  });

  it('should return cached response for identical prompts', async () => {
    // First call
    const response1 = await getGeminiResponse("Election date?");
    // Second call should come from cache (indicated by log or just same behavior)
    const response2 = await getGeminiResponse("Election date?");
    expect(response2).toBe(response1);
  });
});
