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

## 2. Project Boundaries & Rules

To optimize token usage, ensure quality, and keep the implementation aligned with requirements, the agent must adhere to the following execution constraints:

1. **Do Not Commit Code Yourself**
   - The agent must not run git commits or pushes. Code changes should be written to local files only, ready for user review.

2. **Do Not Run Any Commands Without Asking First**
   - No terminal commands, installs, server startup scripts, or build commands may be executed without direct confirmation and approval from the user.

3. **Do Not Write Code Without the Full Picture**
   - If any requirement, architectural detail, or context is unclear, stop and ask the user for clarification first. Do not make assumptions or write speculative code to avoid wasting API tokens and developing unwanted features.

4. **Only Create Maintainable Modular Code**
   - All written code must be modular, clean, type-safe, and documented. Avoid monolithic files; split logic into clear components and custom hooks.
