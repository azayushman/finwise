# FinWise v1.0.0 Release Notes

We are thrilled to announce the official release of **FinWise v1.0.0**, the ultimate AI-driven personal finance platform. This release marks the transition from beta to a fully hardened, production-ready application.

## 🚀 Key Features

* **Comprehensive Financial Calculators**: Evaluate your future with highly accurate SIP, Compound Interest, and EMI calculators, complete with amortization schedules and visual growth charts.
* **Zero-Based Budget Planner**: Take control of your monthly spending. Group your expenses by category, adhere to the 50/30/20 rule, and visually track your remaining budget.
* **Financial Literacy Quiz**: Test your knowledge across multiple categories (Budgeting, Investing, Debt Management) with an interactive, gamified quiz system.
* **AI Financial Assistant**: Chat directly with a context-aware AI (powered by Google Gemini) to get insights on your budget and savings goals.
* **Global Multi-Currency Support**: Switch seamlessly between USD ($), EUR (€), GBP (£), and INR (₹), featuring native locale-aware formatting.
* **Progressive Web App (PWA)**: Install FinWise directly to your mobile or desktop device for a native app experience with offline-ready manifest support.

## 🛡️ Security & Hardening Highlights

* **B7.2 Guardrails**: Fully implemented rigorous validation on all user inputs, clamping values to safe minimum/maximum ranges to prevent integer overflows.
* **Privacy-Safe Error Boundaries**: A polished liquid-glass `error.tsx` fallback UI that intercepts render crashes without leaking server stack traces or database schema details in production mode.
* **Content Security Policy (CSP)**: Strict headers deployed in `vercel.json` (and handled natively by Next.js) to defend against XSS vulnerabilities.
* **Environment Scoping**: Ensured strict separation of `NEXT_PUBLIC_` client keys and server-only secrets.

## 📦 Deployment Instructions

FinWise is bundled natively as a Next.js 15 application using React 19, enabling seamless edge and containerized deployments.

### Vercel Deployment (Recommended)
1. Push the `main` branch to your GitHub repository.
2. Connect the repository to Vercel.
3. Configure the following environment variables in the Vercel dashboard:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `GEMINI_API_KEY`
4. The deployment will automatically use `vercel.json` for edge caching and security headers.

### Docker / Cloud Run Deployment
FinWise has been configured to build as a self-contained `standalone` node server.
1. Build the multi-stage image:
   ```bash
   docker build -t finwise-app .
   ```
2. Run the container, passing in runtime environment variables:
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL="your-url" \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
     -e GEMINI_API_KEY="your-key" \
     finwise-app
   ```
3. The server will run unprivileged on port 3000.

---
*Built with Next.js, Tailwind CSS, Supabase, and Google Gemini.*
