const mockCreate = jest.fn();

jest.mock('openai', () => {
  const mockOpenAIInstance = jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
  return {
    __esModule: true,
    default: mockOpenAIInstance,
  };
});

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

import handler from './chat';
import { readFile } from 'fs/promises';

describe('api/chat handler', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      method: 'POST',
      body: { question: 'What is your return policy?' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
  });

  test('returns 405 if method is not POST', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
  });

  test('returns 400 if question is missing', async () => {
    req.body = {};
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });

  test('returns 400 if question exceeds 500 characters', async () => {
    req.body = { question: 'a'.repeat(501) };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 500 if faq.json is missing or invalid', async () => {
    (readFile as jest.Mock).mockRejectedValueOnce(new Error('File not found'));
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      matched: false,
      error: 'FAQ list is missing or malformed',
    }));
  });

  test('returns 500 if faq.json is invalid JSON', async () => {
    (readFile as jest.Mock).mockResolvedValueOnce('invalid json');
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      matched: false,
      error: 'FAQ JSON parsing failed',
    }));
  });

  test('returns successful match response when OpenAI matches the FAQ', async () => {
    const mockFaq = [
      { question: 'What is your return policy?', answer: '30 days returns.' }
    ];
    (readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockFaq));
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '30 days returns.' } }],
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      answer: '30 days returns.',
      matched: true,
    });
  });

  test('returns fallback response when OpenAI returns NO_MATCH', async () => {
    const mockFaq = [
      { question: 'What is your return policy?', answer: '30 days returns.' }
    ];
    (readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockFaq));
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'NO_MATCH' } }],
    });

    req.body = { question: 'What is the capital of France?' };
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      answer: "We couldn't find an answer to your question. Please contact us for help.",
      matched: false,
    });
  });

  test('returns 500 if OpenAI API throws an error', async () => {
    const mockFaq = [
      { question: 'What is your return policy?', answer: '30 days returns.' }
    ];
    (readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockFaq));
    mockCreate.mockRejectedValueOnce(new Error('OpenAI Error'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      matched: false,
      error: 'OpenAI Error',
    }));
  });
});
