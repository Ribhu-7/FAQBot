# FAQBot — Project Boundary Document

This document outlines the project summary, directory structure, and execution boundaries for **FAQBot (v1)**.

---

## 1. Project Summary

FAQBot is a lightweight, self-service AI chat widget embedded on an e-commerce storefront. It semantically matches user questions against a static set of Q&A pairs stored in a static JSON file (`faq.json`), leveraging OpenAI's Chat Completions API via a secure serverless backend proxy.

- **Frontend:** React 18, TypeScript, Vite (bundled into a single UMD file), and Tailwind CSS.
- **Backend:** Stateless serverless functions (Vercel/Netlify) running Node.js 18+.
- **Database:** None (completely stateless, powered by the static FAQ list).
- **Core AI:** Semantic matching using `gpt-4o-mini` or `gpt-3.5-turbo` with strict system prompt constraints.

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

## 3. Project Boundaries & Rules

To optimize token usage, ensure quality, and keep the implementation aligned with requirements, the agent must adhere to the following execution constraints:

1. **Do Not Commit Code Yourself**
   - The agent must not run git commits or pushes. Code changes should be written to local files only, ready for user review.

2. **Do Not Run Any Commands Without Asking First**
   - No terminal commands, installs, server startup scripts, or build commands may be executed without direct confirmation and approval from the user.

3. **Do Not Write Code Without the Full Picture**
   - If any requirement, architectural detail, or context is unclear, stop and ask the user for clarification first. Do not make assumptions or write speculative code to avoid wasting API tokens and developing unwanted features.

4. **Only Create Maintainable Modular Code**
   - All written code must be modular, clean, type-safe, and documented. Avoid monolithic files; split logic into clear components and custom hooks.
