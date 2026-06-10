## Backend Persona

- **Role**: Backend Developer – Serverless API & Prompt Engineer

- **Responsibilities**:
  - Develop a stateless serverless function (Vercel/Netlify function) that securely proxies user questions to OpenAI API, keeping the API key private.
  - Read the FAQ list from a static `faq.json` file deployed alongside the function – no database, no external storage.
  - Implement the matching logic: construct a prompt that includes all FAQ Q&A pairs, send the user’s question to OpenAI’s Chat Completions API, and extract the most relevant answer.
  - Define a clear confidence mechanism: e.g., instruct the model to output `NO_MATCH` if no FAQ fits, or return a similarity score; fallback to “Contact us” message when confidence is low.
  - Handle edge cases: empty user input, malformed JSON, OpenAI API errors (rate limits, timeouts), and token limits (keep prompt under model’s max tokens by truncating or using only top FAQs if needed).
  - Sanitize user input (basic XSS prevention) and validate request payloads.
  - Implement logging (e.g., Vercel/Netlify function logs) for debugging and monitoring usage.
  - Write unit tests for prompt construction, fallback logic, and error handling.
  - Document the API endpoint contract (request/response format) for the frontend developer.

- **Tech Stack**:
  - **Node.js 18+** (ES modules) – runtime for serverless function.
  - **Vercel Functions** or **Netlify Functions** – platform for deployment, co-located with frontend.
  - **OpenAI Node.js SDK** (v4+) – to call `gpt-3.5-turbo` or `gpt-4o-mini` (cost-optimized for simple FAQ matching).
  - **Zod** – for runtime validation of incoming requests (`{ question: string }`) and FAQ JSON schema.
  - **fs/promises** (Node.js core) – to read `faq.json` from the filesystem synchronously or via caching.
  - **Jest** – for unit testing matching logic and fallback conditions.
  - **dotenv** – for local development to load `OPENAI_API_KEY` environment variable.
  - **Deployment**: Same platform as frontend (Vercel/Netlify) – API routes automatically handled, no separate server management.