Personas:

# Role
You are a technical project architect specializing in AI-powered customer support widgets.
# Task
Generate detailed personas for **frontend** and **backend** developers responsible for building the **FAQBot** application described below. Include for each persona:
- Role title
- Key responsibilities (bullet points)
- Recommended tech stack (specific libraries, frameworks, APIs)
#Context
## Application: FAQBot
A small e-commerce brand answers the same 20 questions daily via email. They need a chat widget on their website that automatically answers FAQs using their own Q&A list.
## Functional Requirements
- Upload or paste FAQ list (Q&A pairs)
- Chat widget UI embedded on the site
- AI matches user question to the most relevant FAQ using OpenAI API with a simple prompt containing FAQ context
- Fallback: "Contact us" message if no confident match
- Example interaction: user asks "What is your return policy?" → bot answers from FAQ list
- No backend database — FAQ data stored in a static JSON file
##Technical Constraints
- Frontend: React-based chat widget
- Backend: Minimal (stateless API proxy for OpenAI) to protect API keys; no database, just read the FAQ JSON
- OpenAI API usage: simple prompt engineering with FAQ context (e.g., embed all Q&As in the prompt or use embeddings with similarity search — but keep simple per requirements)
- Deployment: static hosting for frontend (Netlify/Vercel) + serverless function for backend (same platform)
#Format
Provide the output in .md file format with two main headings:
- `## Frontend Persona`
- `## Backend Persona`
Under each heading, include:
- **Role** (title)
- **Responsibilities** (as a bullet list)
- **Tech Stack** (as a bullet list with explanations where needed)

------------------

# PRD:
## Role
You are a technical product manager specializing in AI-powered customer support tools for small e-commerce brands.
## Task
Write a Product Requirements Document (PRD) for the **FAQBot** application described below. The PRD must include the following sections:
1. Problem Statement
2. Solution Overview
3. User Flow
4. API Design
5. Edge Cases
6. KPIs (Success Metrics or Acceptance Criteria)
7. Limitations
## Context
## Application: FAQBot
A small e-commerce brand answers the same 20 questions daily via email. They want a chat widget on their website that automatically answers FAQs using their own Q&A list.
##Functional Requirements
- Upload or paste FAQ list (Q&A pairs)
- Chat widget UI embedded on the site
- AI matches user question to the most relevant FAQ using OpenAI API with a simple prompt containing FAQ context
- Fallback: "Contact us" message if no confident match
- Example: user asks "What is your return policy?" → bot answers from FAQ list
## Technical Constraints
- Frontend: React-based chat widget
- Backend: Minimal stateless API proxy for OpenAI (protects API keys)
- No backend database — FAQ stored in a static JSON file
- Deployment: serverless functions (Vercel/Netlify) for backend, static hosting for frontend
## Target Audience
The PRD will be read by a frontend developer, a backend developer, and a non-technical stakeholder (e-commerce brand owner).
## Format
Provide the output as a .md file with the exact seven headings listed above. Under each heading, use clear bullet points or short paragraphs. Keep the language concise and actionable. Do not include extra commentary outside the PRD.

-------------------


# Token optimizer:
[save_token.md](file;file:///Users/neosoft/Documents/FAQBot/Prompts/save_token.md) kindly refer to this file and follow the process for this project

# KPI:
[prd.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/prd.md) refering to this file kindly make the kpi file in tabular format with this kpi tables columns 1. KPI Number
2. KPI Name
3. verification method
4. status

# Scope:
[prd.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/prd.md) [kpi.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/kpi.md)  by refering this create one project scope document within that you need to ensure
// functional + non-functional requirement //stopping point.// in scope development portion.
by considering this create project_scope.md.

# Boundary:
[kpi.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/kpi.md) [prd.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/prd.md) by refering this create project_boundary.md which consists the overall summary of my project,Project boundaries:
1. Do not commit code yourself.
2. Do not run any commands without asking me first.
3. Do not write code unless you have full picture. If you have any questions, ask me first. Lets not waste tokens and build something we do not want.
4. Only create maintainable modular code.

# Frontend:
refer to [frontend_persona.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/frontend_persona.md) take Title: FAQBot Design System & Interface
ID: projects/2534138631142238984  from stitch ui and make the ui accordingly

# Faq:
[prd.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/prd.md) [kpi.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/kpi.md) [project_scope.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/project_scope.md) [backend_persona.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/backend_persona.md) refer to this files and make faq.json
kindly add more questions in faq.json approx 20 questions

# Development:
[Agents](directory;file:///Users/neosoft/Documents/FAQBot/Agents) by refering all files in this folder just start the project .

# Test cases:
[FAQBot](directory;file:///Users/neosoft/Documents/FAQBot) kindly create crisp test cases file for this project and also refer to the files and give test case status for each different metric

## Optimization:
can i implement something like if the user writes the question in a different order then also it should give the required response , if yes then please build it accordingly 

## Enhancements:
[FAQBot](directory;file:///Users/neosoft/Documents/FAQBot) refer to this project and tell me what more improvements and enhancements can be done 
 
## Test Case check:
 [project_test_cases.md](file;file:///Users/neosoft/Documents/FAQBot/Agents/project_test_cases.md) refer to this file and run all test cases , and update the status accordingly
