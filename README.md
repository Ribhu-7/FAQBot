# FAQBot

AI-powered FAQ chatbot for e-commerce websites built with React/Next.js and OpenAI.

## Features

- AI-powered FAQ matching
- Floating chat widget
- FAQ fallback handling
- Responsive design
- OpenAI integration
- Serverless API support
- Fast and lightweight architecture

---

## Prerequisites

Before running the project, ensure you have:

- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- Git installed

Verify installation:

```bash
node -v
npm -v
git --version
```

---

## Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project folder:

```bash
cd <PROJECT_FOLDER_NAME>
```

Example:

```bash
git clone https://github.com/username/faqbot.git

cd faqbot
```

---

## Install Dependencies

Run:

```bash
npm install
```

This will install all required packages listed in `package.json`.

---

## Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
OPENAI_API_KEY=your_openai_api_key
```

If additional environment variables are required, refer to the `.env.example` file.

---

## Run the Development Server

Start the application:

```bash
npm run dev
```

You should see output similar to:

```bash
ready - started server on http://localhost:3000
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Create Production Build

```bash
npm run build
```

### Run Production Build Locally

```bash
npm run start
```

### Run Linter

```bash
npm run lint
```

---

## Project Structure

```text
faqbot/
│
├── public/
│   └── faq.json
│
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   └── styles/
│
├── .env.local
├── package.json
├── next.config.js
└── README.md
```

---

## FAQ Configuration

FAQs are stored in:

```text
public/faq.json
```

Example:

```json
[
  {
    "question": "What is your return policy?",
    "answer": "We accept returns within 30 days."
  },
  {
    "question": "How long does shipping take?",
    "answer": "Shipping takes 5-7 business days."
  }
]
```

---

## Troubleshooting

### Module Not Found

Delete dependencies and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already In Use

Run on a different port:

```bash
npm run dev -- -p 3001
```

### Environment Variable Not Detected

- Ensure `.env.local` exists in project root.
- Restart the development server after updating environment variables.

---

## Deployment

Build the application:

```bash
npm run build
```

Deploy using:

- Vercel
- Netlify
- AWS Amplify
- Any Node.js-compatible hosting platform

---

## Contributing

1. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

2. Commit changes

```bash
git add .
git commit -m "Add new feature"
```

3. Push branch

```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

---

## License

This project is licensed under the MIT License.
