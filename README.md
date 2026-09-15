<div align="center">
  <img src="/public/icon-512.png" alt="FinWise Logo" width="120" />
  <h1>FinWise</h1>
  <p><strong>The ultimate AI-driven personal finance and literacy platform.</strong></p>
</div>

---

## 📖 Project Overview

**FinWise** is a modern, full-stack financial planning and educational web application designed to help users take control of their financial future. It combines highly accurate calculators, a zero-based budget planner, gamified financial literacy quizzes, and a context-aware AI assistant to provide a comprehensive, all-in-one dashboard for personal finance.

### 🏗️ Architecture & Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) using React 19.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) heavily customized with glassmorphism, fluid animations, and a bespoke "Liquid Glow" aesthetic.
- **Authentication & Database**: [Supabase](https://supabase.com/) for secure user management and high-performance Postgres storage.
- **AI Integration**: [Google Gemini](https://deepmind.google/technologies/gemini/) (with OpenAI fallback capabilities) for conversational financial coaching.
- **Testing**: [Vitest](https://vitest.dev/) for blazing-fast unit tests.

---

## 📸 Live Demo & Screenshots

**Live Demo**: [finwise.app](#) *(Placeholder link)*

> **Note**: Add screenshots of the Dashboard, AI Assistant, and Budget Planner here.
> 
> *Example:* `![Dashboard Screenshot](/docs/images/dashboard.png)`

---

## 🚀 Quick Start

Follow these steps to get a local development environment up and running.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/finwise.git
cd finwise
npm install
```

### 2. Environment Setup
Copy the template environment file to configure your local credentials:
```bash
cp .env.example .env.local
```
*Open `.env.local` and fill in your Supabase and Google Gemini API keys.*

### 3. Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test Suite
Run the Vitest test suite to verify all core financial algorithms:
```bash
npm run test
```

### 5. Production Build
To test the highly-optimized production bundle locally:
```bash
npm run build && npm run start
```

---

## 🛡️ Security & Disclaimers

### Security Features
FinWise employs rigorous security and privacy-first engineering:
- **Input Guardrails**: All financial calculations implement strict boundary clamps to prevent integer overflows and malformed injections.
- **Edge Rate Limiting**: The built-in proxy layer aggressively throttles sensitive API endpoints (like the AI assistant) to prevent abuse.
- **Privacy-Safe Errors**: Custom React error boundaries prevent sensitive server stack traces or database schema schemas from leaking into production.

### Educational Disclaimer
**FinWise is for educational and informational purposes only.**
The calculations, projections, and AI-generated insights provided by this application do not constitute professional financial, investment, or legal advice. Always consult with a certified financial planner or advisor before making major financial decisions.

---
*Built with ❤️ by the FinWise Team.*
