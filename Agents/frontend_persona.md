## Frontend Persona

- **Role**: Frontend Developer – Chat Widget UI Specialist

- **Responsibilities**:
  - Develop a lightweight, embeddable React chat widget that can be injected into any e-commerce site with a single script tag.
  - Implement the chat interface: message input, conversation history bubbles, typing indicators, and clear error states.
  - Handle user question submission to the backend proxy and display the bot’s response (either the FAQ answer or the fallback “Contact us” message).
  - Manage local UI state (e.g., loading, success, error) without external state management libraries to keep bundle size small.
  - Ensure the widget is responsive, accessible (WCAG 2.1 AA compliant), and does not conflict with the host site’s CSS.
  - Provide a simple configuration API (e.g., `initFAQBot({ apiEndpoint: '...', position: 'bottom-right' })`) for site owners.
  - Bundle the widget as a single UMD file with all dependencies included or externalized React if the host site already uses it.
  - Test the widget across different browsers and devices (Chrome, Firefox, Safari, mobile viewports).

- **Tech Stack**:
  - **React 18** (with functional components and hooks) – core UI library.
  - **TypeScript** – for type-safe props and API contract with the backend.
  - **Vite** – for fast development and optimized production build, configured to output a UMD module.
  - **Tailwind CSS** – for utility-first styling with minimal footprint; scope styles via `@layer` or CSS-in-JS alternative like **Emotion** if needed.
  - **Fetch API** (native) – to call the serverless backend endpoint (no extra HTTP client needed).
  - **React Testing Library** + **Jest** – for unit and integration testing of chat components.
  - **ESLint** + **Prettier** – for code quality and consistency.
  - **Deployment**: Static hosting on **Vercel** or **Netlify** (frontend bundle served via CDN).
