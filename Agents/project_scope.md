# FAQBot — Project Scope Document

This document outlines the project scope, requirements, constraints, and boundaries for **FAQBot (v1)**, an AI-powered customer support chat widget. It is derived from the Product Requirements Document (PRD), KPI definitions, and development team personas.

---

## 1. Project Overview & Objective

FAQBot is a lightweight, embeddable, AI-powered chat widget designed for small e-commerce brands. It deflects repetitive customer support inquiries (e.g., return policies, shipping times, order status queries) by semantically matching user questions against a brand-specific static FAQ list using the OpenAI API.

- **Core Architecture:** Stateless serverless API proxy (backend) + lightweight embeddable chat widget (frontend).
- **Core Value:** Zero-database, zero-maintenance, cost-effective self-service support.

---

## 2. Directory & Folder Structure

```text
FAQBot/
├── Agents/                        # Project definition and scope documents
│   ├── backend_persona.md         # Backend engineer role & tech stack
│   ├── frontend_persona.md        # Frontend engineer role & tech stack
│   ├── kpi.md                     # Key Performance Indicators & verification
│   ├── prd.md                     # Product Requirements Document
│   ├── project_boundary.md        # [THIS FILE] Project summary & boundary guidelines
│   └── project_scope.md           # Scope boundaries & Definition of Done
│
├── Prompts/                       # Prompt guidelines and instructions
│   ├── Problem.md                 # Core problem definition
│   ├── Prompts.md                 # User instructions sequence
│   └── save_token.md              # Token optimization guidelines (Vibe Coding)
│
├── api/                           # Backend serverless proxy functions
│   └── chat.ts                    # POST /api/chat matching endpoint
│
├── public/                        # Static assets directory
│   ├── faq.json                   # Static Q&A dataset (configured by owner)
│   └── index.html                 # Dev testing host HTML page
│
├── src/                           # Frontend React source code
│   ├── components/                # Modular UI components
│   │   ├── ChatWidget.tsx         # Main sticky widget component
│   │   ├── MessageList.tsx        # Message history thread
│   │   └── MessageInput.tsx       # Text input field & validation
│   ├── hooks/                     # Custom React hooks
│   │   └── useChat.ts             # API request and state logic
│   ├── styles/                    # Stylesheets
│   │   └── index.css              # Custom Tailwind/Vanilla CSS configurations
│   ├── App.tsx                    # Root React component
│   ├── index.tsx                  # UMD entry point
│   └── vite-env.d.ts              # TypeScript definitions
│
├── .env.example                   # Template for environment variables (OPENAI_API_KEY)
├── package.json                   # Project scripts and dependencies
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundler configuration (UMD output)
```

---

## 3. In-Scope Development (V1)

The following components and features will be developed and delivered as part of the V1 scope:

### A. Frontend: Chat Widget UI
- **Floating Widget:** A sticky chat bubble/button fixed to the bottom-right corner of the host website.
- **Chat Interface:**
  - Modern, clean, and responsive design matching modern e-commerce aesthetics.
  - Interactive bubble-style message thread showing user queries and bot responses.
  - Typing indicator (micro-animation) during API requests.
  - Clear error messages (e.g., network timeout, API failure).
- **Script Embedding:** Compiled as a single UMD file (via Vite) that can be embedded into any HTML/e-commerce page using a single `<script>` tag.
- **Configuration API:** Initialization function (e.g., `initFAQBot({ apiEndpoint, position })`) to customize the widget's behavior and target API endpoint.
- **Input Validation:**
  - Prevent submission of empty or whitespace-only queries.
  - Character limit restriction (hard cap at 500 characters) with a visible countdown or frontend truncation.

### B. Backend: Serverless Proxy API
- **Stateless Endpoint:** A single POST endpoint (`/api/chat`) hosted on Vercel or Netlify Functions.
- **OpenAI Integration:**
  - Secure communication with OpenAI API using the official SDK (v4+).
  - Prompt construction combining the loaded FAQ context, the user's question, and instructions to return `NO_MATCH` if no relevant answer is found.
  - Model selection: `gpt-4o-mini` or `gpt-3.5-turbo` for cost and speed optimization.
- **FAQ Loading & Parsing:**
  - Read a static `faq.json` file from the `/public` folder of the deployment.
  - Validate the JSON structure using **Zod** at runtime/startup.
- **Security & Rate Limiting:**
  - Hide the `OPENAI_API_KEY` behind backend environment variables (never exposed to the client).
  - Basic rate-limiting mechanism (e.g., 10 requests per minute per IP) to prevent denial-of-service and cost spikes.
- **Error Handling & Fallback:**
  - Catch API timeouts or exceptions from OpenAI and return a clean `500` response.
  - Standardize fallback response: if no confident match is found, return the `"NO_MATCH"` signal with a customizable fallback message: *"We couldn't find an answer to your question. Please contact us for help."*

### C. Configuration & Assets
- **`faq.json` Schema:** A simple structured JSON array containing question-answer pairs:
  ```json
  [
    {
      "question": "What is your return policy?",
      "answer": "We accept returns within 30 days of purchase with the original receipt."
    }
  ]
  ```

---

## 4. Out of Scope (Explicitly Excluded from V1)

To maintain a lightweight and maintainable structure, the following features are **explicitly out of scope** for the initial release:

- **No Admin Interface or CMS:** Brand owners must modify the static `faq.json` file in the source code repository and redeploy to update FAQs. No CRUD UI is provided.
- **No Database or Storage:** The system is entirely stateless. Query history, configuration, or user sessions are not stored in any database.
- **No Conversation Memory:** The chatbot processes each message as a single, isolated query. It does not support multi-turn conversations, follow-up questions, or chat history retrieval.
- **No Live Chat Escalation / Human Handoff:** There is no routing to live agents. The fallback is limited to a static "Contact us" mailto link or support form URL.
- **No Analytics Dashboard:** All query logs and deflection metrics must be inspected via serverless platform logs (e.g., Vercel Logs) or third-party log-draining services.
- **No Multi-Language Support:** The system prompt, UI text, and semantic matching are English-optimized. Non-English queries are handled on a best-effort basis without official support.
- **No Advanced Content Moderation:** Apart from the system prompt restricting responses to the FAQ scope, there is no separate content safety or toxic input filtering system.

---

## 4. Requirements

### Functional Requirements
1. **FAQ Parsing & Load:** The backend must load the static `faq.json` from the filesystem at startup and check for validity. If invalid, the service must report a startup validation error.
2. **Payload Validation:** The `/api/chat` endpoint must reject payloads that do not match `{ "question": string }` or exceed 500 characters.
3. **Semantic FAQ Match:** The backend must pass the Q&A context to OpenAI, which will return either a matched answer from the JSON or the exact string `NO_MATCH`.
4. **Fallback Handling:** If the backend receives `NO_MATCH` from OpenAI, it must return `matched: false` along with the standard email-escalation response.
5. **Widget Session State:** The frontend widget must display the conversation history for the duration of the current browser session. A page reload will reset the state.

### Non-Functional Requirements
1. **Performance (Latency):** The end-to-end response time for a user's question must not exceed 3 seconds under normal network conditions.
2. **Security:** The OpenAI API key must remain strictly on the backend. No client-side code, network requests, or bundle files may contain references to the key.
3. **Accessibility:** The chat widget UI must adhere to **WCAG 2.1 AA** standards (appropriate color contrast, keyboard navigable, screen reader readable).
4. **Compatibility:** The widget must render and function properly across major modern desktop and mobile browsers (Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome).
5. **Payload Size:** The widget bundle must be lightweight (target size < 50KB gzipped) to avoid slowing down host site page loads.

---

## 5. Stopping Points & Definition of Done (DoD)

The project will be considered complete and ready for handoff when the following criteria are met:

1. **Code Completeness:**
   - The React chat widget is successfully built and bundled into a single distributable script (UMD format).
   - The `/api/chat` serverless proxy function is implemented and fully functional.
2. **Verification & Testing:**
   - 100% of the unit tests for both frontend components (using React Testing Library) and backend matching/fallback logic (using Jest) pass successfully.
   - Manual end-to-end verification demonstrates correct response generation for known questions and correct fallback behavior for unknown questions.
   - The widget UI is verified against the WCAG 2.1 AA checklist.
3. **Security Sign-off:**
   - Security audit confirms that the `OPENAI_API_KEY` is not present in frontend assets, bundles, or client-side network calls.
4. **Documentation:**
   - API endpoints, setup instructions, configuration options, and deployment guides are completed in the codebase.
5. **Deployment Readiness:**
   - The code is ready for serverless deployment (e.g., via Vercel/Netlify), and the setup works out-of-the-box when the static asset `/public/faq.json` is updated.
