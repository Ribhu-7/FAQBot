/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

// Ensure fetch is defined
const mockFetch = jest.fn();
window.fetch = mockFetch;

describe('useChat hook', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockFetch.mockReset();
  });

  test('initializes with default welcome message', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].sender).toBe('bot');
    expect(result.current.messages[0].text).toContain("I'm your FAQ Assistant");
  });

  test('toggles open state', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(false);
  });

  test('sendMessage appends user message and bot response from API', async () => {
    const mockResponse = { answer: 'Mocked return policy answer', matched: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('What is your return policy?');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
    expect(result.current.messages).toHaveLength(3); // welcome + user + bot
    expect(result.current.messages[1].sender).toBe('user');
    expect(result.current.messages[1].text).toBe('What is your return policy?');
    expect(result.current.messages[2].sender).toBe('bot');
    expect(result.current.messages[2].text).toBe('Mocked return policy answer');
  });

  test('sendMessage falls back to local simulation on fetch failure', async () => {
    // API call fails
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    // Local /faq.json fallback fetch succeeds
    const mockFaq = [
      { question: 'What is your return policy?', answer: 'Returns allowed within 30 days.' }
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFaq,
    } as Response);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('return policy');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].sender).toBe('bot');
    expect(result.current.messages[2].text).toBe('Returns allowed within 30 days.');
    expect(result.current.messages[2].matched).toBe(true);
  });
});
