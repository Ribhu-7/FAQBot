import { join } from 'path';
import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import { z } from 'zod';

// Zod validation schemas
const requestSchema = z.object({
  question: z.string().min(1).max(500),
});

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const faqListSchema = z.array(faqItemSchema);

// Initialize OpenAI client
const openai = new OpenAI();

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Validate request payload
    const bodyValidation = requestSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({ error: 'Invalid request payload. Question must be a string up to 500 characters.' });
    }

    const { question } = bodyValidation.data;

    // 2. Load and validate faq.json from the public assets directory
    let faqData: string;
    try {
      const faqPath = join(process.cwd(), 'public', 'faq.json');
      faqData = await readFile(faqPath, 'utf-8');
    } catch (err) {
      console.error('Error reading faq.json:', err);
      return res.status(500).json({
        answer: "We couldn't find an answer to your question. Please contact us for help.",
        matched: false,
        error: 'FAQ list is missing or malformed'
      });
    }

    let rawFaqs: any;
    try {
      rawFaqs = JSON.parse(faqData);
    } catch (err) {
      console.error('Error parsing faq.json:', err);
      return res.status(500).json({
        answer: "We couldn't find an answer to your question. Please contact us for help.",
        matched: false,
        error: 'FAQ JSON parsing failed'
      });
    }

    const faqValidation = faqListSchema.safeParse(rawFaqs);
    if (!faqValidation.success) {
      console.error('FAQ Schema validation failed:', faqValidation.error);
      return res.status(500).json({
        answer: "We couldn't find an answer to your question. Please contact us for help.",
        matched: false,
        error: 'FAQ schema validation failed'
      });
    }

    const faqs = faqValidation.data;

    // 3. Construct system prompt containing the FAQ context
    const systemPrompt = `You are a helpful customer support assistant for an e-commerce store.
Answer the user's question using ONLY the FAQ list below.
If no FAQ entry answers the question with confidence, reply with exactly: "NO_MATCH".

FAQ List:
${JSON.stringify(faqs, null, 2)}

User Question: ${question}`;

    // 4. Call OpenAI Chat Completions API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: systemPrompt }
      ],
      temperature: 0.0,
    });

    const answer = completion.choices[0]?.message?.content?.trim() || 'NO_MATCH';

    // 5. Handle fallback and success matches
    if (answer === 'NO_MATCH') {
      return res.status(200).json({
        answer: "We couldn't find an answer to your question. Please contact us for help.",
        matched: false
      });
    }

    return res.status(200).json({
      answer,
      matched: true
    });

  } catch (error: any) {
    console.error('OpenAI or serverless execution error:', error);
    return res.status(500).json({
      answer: "We couldn't find an answer to your question. Please contact us for help.",
      matched: false,
      error: error.message || 'Internal Server Error'
    });
  }
}
