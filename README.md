# Marketing Dashboard

> AI Marketing Operations System — Your entire marketing team in one tool.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

**[Try Live Demo](https://ai-powered-marketing-4nlf.bolt.host)** | **[For Recruiters](#portfolio-analysis)** | **[For Businesses](#for-businesses)**

A [FutureCrafters](https://www.futurecrafters.ai) Flagship Project • Built by [Irvin Cruz](https://irvincruz.com)

---

## TL;DR (30-Second Scan)

**What:** 6 AI-powered marketing generators (SEO articles, email campaigns, social posts, lead magnets, content repurposing, images) with business context engine.

**Why Different:** Most AI tools are generic prompt wrappers. This understands marketing operations—ICP targeting, brand consistency, multi-channel strategy.

**For Recruiters:** Demonstrates marketing domain expertise + technical execution (AI Strategy Manager intersection).

**For Businesses:** Solo founders and agencies get consistent, on-brand content without hiring a team.

**Tech:** React 18 + TypeScript + Vite + OpenAI GPT-4 + DALL-E 3 + Offline-first (IndexedDB).

---

## The Problem

**Solo Founders:** Need marketing presence, can't afford $8K/month team.

**Agencies:** 10 clients = 10 brand voices. Generic AI tools produce off-brand content.

**Content Marketers:** 80% time thinking, 20% creating. Need 5x output without burnout.

**Current "solutions" fail:**
- ❌ Jasper/Copy.ai = Generic outputs (no ICP/brand context)
- ❌ ChatGPT = No consistency (everyone prompts differently)
- ❌ Manual = Slow, expensive, doesn't scale

**The gap:** Tools built by engineers who understand prompts but not why brand voice consistency matters.

---

## The Solution

### Business Context Engine

Configure once: ICP, brand voice, tone, keywords, guidelines.

Then **every piece of content is pre-aligned** to your strategy.

### 6 AI-Powered Generators

1. **SEO Articles** — 500-800 words, keyword-optimized, H2/H3 structure
2. **Email Campaigns** — 4 types (newsletter, promo, announcement, follow-up)
3. **Social Posts** — Platform-specific (Instagram, LinkedIn, Facebook, Twitter)
4. **Lead Magnets** — Guides, checklists, templates, calculators
5. **Content Repurposer** — Long-form → social snippets
6. **Images** — DALL-E 3 with cost tracking

### Asset Library

Centralized repository with status workflow (draft → review → published).

**Result:** Consistent, on-brand content across all channels.

**[Try it now →](https://ai-powered-marketing-4nlf.bolt.host)**

---

## Portfolio Analysis

> **For Recruiters & Hiring Managers**

### What This Project Demonstrates

#### 1. Marketing Domain Expertise

Real understanding of:
- ✅ **ICP vs Demographics** — Strategic targeting, not surface-level
- ✅ **Brand Voice vs Tone** — Consistency vs adaptation
- ✅ **Lead Funnel Stages** — Top/middle/bottom content strategy
- ✅ **Multi-Channel Orchestration** — Platform-specific execution

**Why this matters:** Most AI builders are engineers who understand prompts but not why CMOs care about brand guidelines.

#### 2. Technical Execution

Production-quality code:
- TypeScript (100% type coverage)
- Offline-first architecture (IndexedDB)
- React 18 + Vite (modern stack)
- Cost tracking (business awareness)
- Structured outputs (JSON validation)

**Why this matters:** Proves ability to build, not just strategize.

#### 3. AI Implementation Sophistication

Not "just call ChatGPT":
- Context injection (settings → system prompt)
- Structured outputs (enforced JSON schemas)
- Model selection (GPT-4 + DALL-E 3)
- Cost tracking ($0.04-$0.08 per image logged)

#### 4. Product Thinking

Complete user journey: Onboarding → Generate → Library → Workflow.

### For AI Strategy Manager Roles

**Most candidates show ONE:**
- Marketing knowledge (but can't build)
- Technical skill (but don't understand business)

**This project shows BOTH:**
- ✅ Deep marketing operations expertise
- ✅ Advanced technical implementation
- ✅ Product strategy thinking
- ✅ AI integration sophistication

**That's the AI Strategy Manager intersection.**

### Interview Talking Points

**2-Minute Story:**

> "I built Marketing Dashboard to prove most AI marketing tools fail because they're built by engineers who understand prompts but not why brand voice consistency matters.
>
> This system starts with business context—ICP, brand guidelines, tone—then injects that into every AI generation. Pre-aligned content that doesn't need heavy editing.
>
> Technically: React + TypeScript, offline-first, cost tracking, structured validation. Strategically: Domain expertise baked in, not bolted on.
>
> For AI Strategy Manager roles, this demonstrates the intersection: I understand marketing operations deeply AND execute technically. Most bring one—I bring both."

**Key Stats:**
- 6 AI-powered generators
- 27 TypeScript files (~3,500 LOC)
- Business context engine (ICP, brand, tone, keywords)
- Offline-first (no vendor lock-in)
- Cost tracking (business-aware)

---

## For Businesses

> **For Solo Founders, Agencies, Content Teams**

### Use Cases

**Solo Founders:** Define ICP once, generate daily. Professional marketing without hiring.

**Agencies:** Set up client profiles, switch between them. Scale production without headcount.

**Content Marketers:** Generate first drafts in seconds. 5x output, same team size.

**Startups:** Founder sets tone once, generates weekly. Market presence + product development in parallel.

### Get Started

**Option 1: Free (Self-Hosted)**
- Clone repo, add your OpenAI key
- Full source code access
- Customize as needed
- **Best for:** Technical founders

**Option 2: Managed Deployment ($497/month)**
- FutureCrafters hosts and maintains
- Custom domain + SSL
- Priority support
- **Best for:** Non-technical founders

**Option 3: White-Label ($4,997 + $197/month)**
- Your branding, custom generators
- CRM integrations
- Dedicated support
- **Best for:** Agencies, enterprise

**Pilot Program:** 30-day trial, free setup, 100 assets, full refund if unsatisfied.

**[Book Consultation](https://calendar.app.google/5of8AAhCW2FVV2Eg7)**

---

## Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind + Framer Motion

**State:** Zustand + LocalStorage

**Database:** Dexie.js (IndexedDB) — Offline-first

**AI:** OpenAI GPT-4 + DALL-E 3

**Quality:** 100% TypeScript coverage, ESLint, component architecture

---

## Quick Start

```bash
git clone https://github.com/IrvinCruzAI/Marketing_Dashboard.git
cd Marketing_Dashboard
npm install
npm run dev
```

**First-time setup:**
1. Configure business profile (ICP, brand voice, tone, keywords)
2. Add OpenAI API key (stored locally, never sent elsewhere)
3. Generate first asset
4. View in library

**[Try Live Demo →](https://ai-powered-marketing-4nlf.bolt.host)**

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # Overview & stats
│   ├── generators/     # 6 AI generators
│   ├── library/        # Asset management
│   ├── settings/       # Business config
│   └── ui/             # Layout components
├── lib/
│   ├── api.ts         # OpenAI integration
│   ├── db.ts          # Dexie database
│   └── openai.ts      # AI utilities
├── store/             # Zustand state
└── types/             # TypeScript definitions
```

---

## Why This Architecture?

**IndexedDB (Offline-First):**
- Works without internet
- No server costs
- Privacy-friendly (data on device)
- Fast (no network latency)

**TypeScript:**
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier maintenance

---

## About FutureCrafters

Marketing Dashboard is part of FutureCrafters' AI-powered business systems portfolio.

**More Projects:**
- [NewsGen AI](https://github.com/IrvinCruzAI/AI_News_Generator) — News-to-article generator
- Mission Control — Business intelligence dashboard
- Rory — AI content engine with custom voice
- Nexus — LinkedIn network intelligence
- Sol — 5-agent AI operating system

**Services:**
- AI Exploration Session ($500)
- Paid Diagnostic ($1,500)
- Control Layer Sprint ($5,000)
- FutureCrafters Labs ($2K-6K/mo)

### Get In Touch

**Portfolio/Hiring:**
- LinkedIn: [linkedin.com/in/irvincruzrodriguez](https://linkedin.com/in/irvincruzrodriguez)
- Website: [irvincruz.com](https://irvincruz.com)
- Email: irvin@futurecrafters.ai

**Product/Business:**
- 📞 [Book consultation](https://calendar.app.google/5of8AAhCW2FVV2Eg7)
- 📧 hello@futurecrafters.ai
- 🌐 [futurecrafters.ai](https://futurecrafters.ai)
- 💼 [LinkedIn Company](https://linkedin.com/company/futurecraftersai)

---

## Project Stats

| Metric | Value |
|--------|-------|
| TypeScript files | 27 |
| Components | 20+ |
| Generators | 6 |
| Lines of code | ~3,500 |

---

**⭐ Star this repo if you find it useful!**

**For recruiters:** Demonstrates AI Strategy Manager capabilities—marketing expertise + technical execution.

**For businesses:** [Book a consultation](https://calendar.app.google/5of8AAhCW2FVV2Eg7) to discuss implementation.

---

*A FutureCrafters Flagship Project • Built by [Irvin Cruz](https://irvincruz.com) ☀️*  
*Last Updated: February 2026*
