# FAQBot — Product Requirements Document

---

## 1. Problem Statement

- A small e-commerce brand receives approximately 20 repeated customer questions per day via email (e.g., return policy, shipping times, order tracking).
- Answering these manually consumes significant support time and delays customer responses.
- There is no self-service channel on the brand's website that can deflect these repetitive inquiries.
- Without automation, support burden scales linearly with site traffic and order volume.

---

## 2. Solution Overview

FAQBot is a lightweight, AI-powered chat widget embedded on the brand's website. It:

- Accepts a static FAQ list (Q&A pairs) provided by the brand owner via a JSON file or a paste interface.
- Displays a floating chat widget on the storefront where visitors can type questions in natural language.
- Uses the OpenAI API to semantically match the user's question against the FAQ list and return the most relevant answer.
- Falls back to a "Contact us" prompt when no sufficiently confident match is found.
- Requires no backend database, no user accounts, and minimal ongoing maintenance.

**Key design principle:** Keep the stack as simple as possible — static FAQ, stateless proxy, serverless deployment.

---

## 3. User Flow

### Brand Owner (Setup)
1. Brand owner prepares a list of FAQ pairs in JSON format (or pastes Q&A pairs into an admin input form).
2. The FAQ JSON file is saved to the frontend project's static assets folder (`/public/faq.json`).
3. On deployment, the widget automatically loads this FAQ file at runtime.

### End User (Chat Interaction)
1. Visitor lands on the e-commerce site and sees a floating chat button (bottom-right corner).
2. Visitor clicks the button; the chat widget opens.
3. Visitor types a question (e.g., *"What is your return policy?"*).
4. The widget sends the question to the backend proxy API.
5. The proxy constructs an OpenAI prompt containing the full FAQ list as context and the user's question, then calls the OpenAI Chat Completions API.
6. OpenAI returns the most relevant answer from the FAQ.
7. **Happy path:** The widget displays the matched answer to the user.
8. **Fallback path:** If OpenAI's response indicates no confident match (determined by prompt instruction or a confidence signal in the response), the widget displays: *"We couldn't find an answer to your question. Please [contact us](mailto:support@brand.com) for help."*
9. The conversation remains in the widget for the duration of the browser session; it resets on page refresh.

---

## 4. API Design

### Endpoint

| Property | Value |
|---|---|
| Method | `POST` |
| Path | `/api/chat` |
| Hosting | Serverless function (Vercel/Netlify) |
| Auth | None (rate limiting recommended) |

### Request Body

```json
{
  "question": "What is your return policy?"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | Yes | The raw question typed by the end user. Max 500 characters. |

### Response Body — Success

```json
{
  "answer": "We accept returns within 30 days of purchase with original receipt.",
  "matched": true
}
```

### Response Body — Fallback

```json
{
  "answer": "We couldn't find an answer to your question. Please contact us for help.",
  "matched": false
}
```

| Field | Type | Description |
|---|---|---|
| `answer` | string | The answer text to display in the widget. |
| `matched` | boolean | Whether a confident FAQ match was found. |

### OpenAI Prompt Structure (Backend)

The proxy constructs the following prompt before calling OpenAI:

```
System: You are a helpful customer support assistant for an e-commerce store.
Answer the user's question using ONLY the FAQ list below.
If no FAQ entry answers the question with confidence, reply with exactly: "NO_MATCH".

FAQ List:
{faq_json}

User Question: {question}
```

- If the model returns `"NO_MATCH"`, the proxy sets `matched: false` and returns the fallback message.
- The FAQ JSON is loaded from the static file at server startup (or on each cold start in serverless).
- The OpenAI API key is stored as an environment variable and never exposed to the frontend.

### FAQ JSON Schema

```json
[
  {
    "question": "What is your return policy?",
    "answer": "We accept returns within 30 days of purchase with the original receipt."
  },
  {
    "question": "How long does shipping take?",
    "answer": "Standard shipping takes 5–7 business days. Express shipping is 2 business days."
  }
]
```

---

## 5. Edge Cases

| Scenario | Handling |
|---|---|
| User submits an empty or whitespace-only message | Frontend validates input; disables send button if field is blank. |
| User question exceeds 500 characters | Frontend truncates or shows a character-limit warning before sending. |
| OpenAI API is unavailable or returns an error | Proxy catches the error and returns the fallback "Contact us" message with `matched: false`. A 500 status is returned; the widget displays a generic error message. |
| FAQ JSON file is missing or malformed | Proxy returns a 500 error on startup. Brand owner is notified via deployment logs. |
| User asks a question in a language other than English | Behavior is best-effort; OpenAI may still match if the FAQ contains equivalent content. No explicit multi-language support in v1. |
| User inputs potentially harmful or off-topic content | The system prompt restricts the model to FAQ-only answers. Off-topic inputs will trigger the `NO_MATCH` fallback. No content moderation layer in v1. |
| Very large FAQ list (>50 entries) | Long prompts increase latency and cost. Recommend capping FAQ at 50 entries in v1. Performance should be monitored. |
| Multiple rapid submissions from the same user | Implement basic rate limiting on the serverless function (e.g., 10 requests per minute per IP). |

---

## 6. KPIs (Success Metrics / Acceptance Criteria)

### Functional Acceptance Criteria (Launch Gate)
- [ ] Widget loads on the site within 2 seconds on a standard broadband connection.
- [ ] A question matching a known FAQ entry returns the correct answer with ≥ 90% accuracy in manual testing across all FAQ entries.
- [ ] The fallback message is shown for questions clearly outside the FAQ scope in 100% of test cases.
- [ ] The OpenAI API key is never exposed in browser network requests or frontend source code.
- [ ] The widget is functional on Chrome, Firefox, Safari, and mobile browsers (iOS/Android).

### Business KPIs (Post-Launch, measured over 30 days)
- **FAQ Deflection Rate:** ≥ 60% of chat sessions end with a matched answer (no need to contact support).
- **Fallback Rate:** ≤ 40% of sessions trigger the "Contact us" fallback. A sustained rate above 40% indicates the FAQ list needs expansion.
- **Support Email Volume:** 20% reduction in repeat-question support emails within 60 days of launch.
- **Widget Engagement Rate:** ≥ 10% of site visitors open the chat widget (indicates discoverability).
- **Average Response Time:** Bot responds in ≤ 3 seconds for 95% of queries under normal load.

---

## 7. Limitations

- **No conversation memory:** Each message is processed independently. The bot cannot handle multi-turn conversations or follow-up questions that reference prior context.
- **Static FAQ only:** The FAQ is defined at deploy time. Updating answers requires editing the JSON file and redeploying. There is no admin UI or CMS in v1.
- **No analytics dashboard:** Query logs and deflection metrics must be tracked manually or via third-party log tooling (e.g., Vercel logs). There is no built-in reporting.
- **OpenAI dependency:** The bot's accuracy and availability are directly tied to OpenAI's API. Outages or model changes may affect response quality.
- **No human handoff:** There is no live chat escalation path. The fallback is a static "Contact us" link only.
- **Cost exposure:** Every user query incurs an OpenAI API cost. High-traffic sites without rate limiting may face unexpected costs. No token-budgeting or caching is implemented in v1.
- **No spam or abuse protection:** Beyond basic rate limiting, there is no CAPTCHA or abuse detection.
- **English-optimized:** The system prompt and FAQ are assumed to be in English. Multilingual support is out of scope for v1.
