# FAQBot — Test Cases & Metric Verification Status

This document defines the core test cases for **FAQBot (v1)**. It tracks verification scenarios mapped to the project's Functional (F-x) and Business (B-x) KPIs, detailing their current implementation status based on code analysis.

---

## 1. Test Suite & Verification Matrix

### Functional Acceptance Criteria (Launch Gate)

| Test ID | Metric Ref | Test Scenario | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-F1-01** | **F-1** | Widget Load Performance | 1. Load host page containing the embeddable script.<br/>2. Measure script and asset load time using browser DevTools (Network tab). | The widget must initialize and render the floating action launcher button in **≤ 2 seconds**. | ⬜ **Pending** (Requires production build hosting environment) |
| **TC-F2-01** | **F-2** | Known FAQ Direct Match | 1. Type *"What is your return policy?"* in the chat input.<br/>2. Send the message. | The backend matches the query and returns the exact answer from `faq.json` (KPI accuracy target **≥ 90%**). | ⬜ **Pending** (Requires running E2E test/API server verification) |
| **TC-F3-01** | **F-3** | Out-of-Scope Query Rejection | 1. Type unrelated questions (e.g. *"What is the capital of France?"*).<br/>2. Send the message. | The LLM detects no match, returns `"NO_MATCH"`. The UI displays the **"Contact Support" fallback CTA card** with 100% confidence. | ⬜ **Pending** (Requires running E2E test/API server verification) |
| **TC-F4-01** | **F-4** | Client Security Check | 1. Search build bundles (`dist/`) for `sk-` keys.<br/>2. Inspect outbound API requests in the browser Network tab. | The **`OPENAI_API_KEY` is not present** in compile-time assets or client headers. All AI processing is proxied. | 🟢 **Pass** (Verified: API key resides strictly in `api/chat.ts` environment variable) |
| **TC-F5-01** | **F-5** | Cross-Browser Compatibility | Render and interact with the widget on: Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome. | Widget layout adjusts to full-screen (as configured) and behaves smoothly without rendering bugs. | ⬜ **Pending** (Requires E2E multi-browser user-agent test runs) |

---

### Business KPIs (Post-Launch - 30 to 60 Day Window)

| Test ID | Metric Ref | Success Target | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-B1-01** | **B-1** | Deflection Rate **≥ 60%** | Compute: `(matched sessions) / (total chat sessions)` | ⬜ **Pending** (Measured over 30 days post-launch) |
| **TC-B2-01** | **B-2** | Fallback Rate **≤ 40%** | Compute: `(fallback sessions) / (total chat sessions)` | ⬜ **Pending** (Measured over 30 days post-launch) |
| **TC-B3-01** | **B-3** | Email Reduction **↓ 20%** | Compare daily support email counts pre-launch vs. 60-day post-launch. | ⬜ **Pending** (Measured over 60 days post-launch) |

---

## 2. Technical Code Analysis & Verification Notes

### F-4: API Key Security Verification
* **Implementation Source:**
  * In [api/chat.ts](file:///Users/neosoft/Documents/FAQBot/api/chat.ts#L18-L19), the OpenAI SDK client is initialized strictly on the backend:
    ```typescript
    const openai = new OpenAI(); // Automatically reads process.env.OPENAI_API_KEY server-side
    ```
  * In [useChat.ts](file:///Users/neosoft/Documents/FAQBot/src/hooks/useChat.ts#L36-L42), the frontend sends queries to `/api/chat` using relative paths without carrying authorization headers or secrets.
* **Verdict:** **Pass**.

### F-3: Out-of-Scope Fallback Verification
* **Implementation Source:**
  * In [api/chat.ts](file:///Users/neosoft/Documents/FAQBot/api/chat.ts#L75-L83), the system prompt instructs the model:
    ```text
    Answer the user's question using ONLY the FAQ list below.
    If no FAQ entry answers the question with confidence, reply with exactly: "NO_MATCH".
    ```
  * In [MessageList.tsx](file:///Users/neosoft/Documents/FAQBot/src/components/MessageList.tsx#L129-L160), if `matched === false`, the UI renders a customized Contact Support card:
    ```tsx
    <a href="mailto:support@brand.com" className="w-full flex items-center ...">Contact Support</a>
    ```
* **Verdict:** **Pending E2E Run** (Mechanisms are fully built and code-correct).
