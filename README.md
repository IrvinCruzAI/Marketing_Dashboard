# Marketing Dashboard

> Enterprise-grade AI marketing operations platform. Generate SEO articles, email campaigns, social posts, lead magnets, and images—all aligned to your ICP, brand voice, and content guidelines.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

**A [FutureCrafters](https://www.futurecrafters.ai) Flagship Project** • Built by [Irvin Cruz](https://irvincruz.com)

*This project showcases both deep marketing domain expertise and advanced technical implementation—the intersection where AI Strategy Manager roles live.*

---

## 🎯 What Makes This Different

Most AI marketing tools are generic prompt wrappers. **This is a complete marketing operations system** that understands:

- ✅ **ICP Targeting** - Every piece of content generated is tailored to your ideal customer profile
- ✅ **Brand Voice Consistency** - Dos/don'ts guidelines ensure on-brand output every time  
- ✅ **Tone Management** - Professional, casual, technical—maintained across all channels
- ✅ **Multi-Channel Strategy** - SEO, email, social, lead gen—coordinated from one system
- ✅ **Content Workflow** - Draft → Review → Published status management
- ✅ **Offline-First Architecture** - Works without internet, syncs when online

**Built by someone who understands both marketing strategy AND technical implementation.**

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Marketing Expertise Showcase](#-marketing-expertise-showcase)
- [Technical Stack](#-technical-stack)
- [Quick Start](#-quick-start)
- [System Architecture](#-system-architecture)
- [Generators Deep-Dive](#-generators-deep-dive)
- [Use Cases](#-use-cases)
- [Why This Matters](#-why-this-matters)
- [About FutureCrafters](#-about-futurecrafters)

---

## ✨ Key Features

### 🎨 6 AI-Powered Generators

1. **SEO Article Generator**
   - Full blog posts with H2/H3 structure
   - Keyword optimization based on your target list
   - Auto-generated image prompts for hero images
   - Word count targeting (500-800 words)

2. **Email Campaign Generator**
   - 4 purpose types: Newsletter, Promotion, Announcement, Follow-up
   - Subject line + preview text optimization
   - HTML-formatted email body
   - ICP-targeted messaging

3. **Social Media Generator**
   - Platform-specific: Instagram, LinkedIn, Facebook, Twitter
   - Hashtag strategy per platform
   - Image prompts tailored to platform dimensions
   - Character limits respected

4. **Lead Magnet Generator**
   - 4 resource types: Guide, Checklist, Template, Calculator
   - Structured outlines + deliverable content
   - Developer handoff prompts for interactive versions
   - HTML-formatted for immediate use

5. **Content Repurposer**
   - Transform long-form → social snippets
   - Extract key points for thread format
   - Platform adaptation (LinkedIn → Twitter voice)
   - Maintains brand consistency

6. **Image Generator** *(OpenAI DALL-E integration)*
   - Platform-optimized dimensions
   - Style consistency across brand
   - Cost tracking per generation
   - Model version logging

### 🏢 Business Context Engine

**The Secret Sauce:** Every generator pulls from your business settings:

```typescript
{
  businessName: string;
  icp: string;                    // Who you're targeting
  tone: string;                   // How you sound
  keywords: string[];             // What you optimize for
  brandGuidelines: {
    dos: string[];                // Brand voice rules
    donts: string[];              // What to avoid
  }
}
```

**Result:** All content is pre-aligned to your strategy. No generic output.

### 📚 Asset Library

- Centralized repository for all generated content
- Status workflow: Draft → Review → Published
- Filter by type, status, date
- Full-text search across content
- Export individual assets or bulk
- Edit and regenerate capability

### 🎨 Professional UI/UX

- Dark mode with custom color palette
- Framer Motion animations
- Mobile-responsive design
- Keyboard shortcuts
- Toast notifications
- Loading states and error handling

---

## 🧠 Marketing Expertise Showcase

**This isn't just another AI tool.** It demonstrates understanding of:

### Strategic Marketing Concepts

**1. ICP-First Content**
Every piece of content starts with "Who is this for?" — not "What do I want to say?"

**2. Brand Voice Consistency**
Guidelines engine ensures every asset matches your established voice, even across different platforms and content types.

**3. Multi-Channel Orchestration**
Understands that LinkedIn voice ≠ Twitter voice, but both serve the same strategic goal.

**4. Content Workflow Management**
Draft/Review/Published states mirror real marketing team operations.

**5. Lead Generation Strategy**
Four lead magnet types cover different stages of the funnel:
- **Guides** → Top of funnel (education)
- **Checklists** → Middle funnel (action)
- **Templates** → Middle funnel (implementation)
- **Calculators** → Bottom funnel (personalization)

**6. SEO Understanding**
Keyword strategy, content structure (H2/H3), word count targets, image optimization.

**7. Email Marketing Best Practices**
Subject lines, preview text, purpose-driven content, HTML formatting.

### Why This Matters for AI Strategy Roles

**Most people who build AI tools are engineers.**  
They understand prompts, APIs, and UI—but not *why* a CMO cares about ICP vs. demographics, or why brand guidelines matter more than clever copy.

**This project proves domain expertise + technical execution.**

---

## 🎨 Technical Stack

### Frontend Framework
- **React 18** with TypeScript - Type-safe component architecture
- **Vite** - Lightning-fast dev/build pipeline
- **React Router DOM** - Multi-page SPA navigation
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Production-quality animations

### State Management
- **Zustand** - Lightweight, unopinionated state management
- Global stores for: API keys, theme, generating state
- LocalStorage persistence for settings

### Database
- **Dexie.js** - IndexedDB wrapper for client-side storage
- Offline-first architecture
- Relational queries on asset types
- Full-text search capability

### AI Integration
- **OpenAI API** - GPT-4 for content generation
- **DALL-E 3** - Image generation with cost tracking
- Custom prompt engineering per generator
- Structured JSON output parsing

### Utilities & Libraries
- **lucide-react** - Icon library (tree-shakeable)
- **react-markdown** - Markdown rendering for previews
- **clsx** + **tailwind-merge** - Conditional class utilities
- Custom utility functions (formatDate, generateId, copyToClipboard)

### Code Quality
- TypeScript throughout (100% type coverage)
- ESLint configuration
- Component-based architecture
- Custom hooks for reusability
- Separation of concerns (lib/, components/, types/)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/IrvinCruzAI/Marketing_Dashboard.git
cd Marketing_Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### First-Time Setup

1. **Settings** - Configure your business profile:
   - Business name
   - Your name
   - ICP description
   - Brand tone
   - Keywords list
   - Brand guidelines (dos/don'ts)

2. **API Key** - Add your OpenAI key:
   - Settings → API Key tab
   - Paste key (stored in browser, never sent anywhere except OpenAI)

3. **Generate** - Pick any generator and create your first asset

4. **Library** - View all generated content in one place

---

## 🏗️ System Architecture

### Component Hierarchy

```
App.tsx
└── BrowserRouter
    └── Layout
        ├── Sidebar (navigation)
        ├── Header (user info, theme toggle)
        └── Routes
            ├── Dashboard (overview + stats)
            ├── SeoGenerator
            ├── EmailGenerator
            ├── SocialGenerator
            ├── LeadMagnetGenerator
            ├── RepurposeGenerator
            ├── ImageGenerator
            ├── AssetLibrary
            └── Settings
```

### Data Flow

```
User Input
    ↓
Generator Component
    ↓
Load Business Settings (Dexie)
    ↓
Construct System Prompt (with ICP, tone, guidelines)
    ↓
OpenAI API Call
    ↓
Parse JSON Response
    ↓
Display Preview
    ↓
Save to Asset Library (Dexie)
    ↓
Status Workflow (draft → review → published)
```

### Database Schema

**Tables:**
- `settings` - Business configuration (singleton)
- `assets` - All generated content (polymorphic)

**Asset Types:**
```typescript
type Asset = 
  | SeoArticle 
  | EmailCampaign 
  | SocialPost 
  | LeadMagnet 
  | ImageAsset;
```

Each type has:
- Common fields: id, type, status, createdAt, updatedAt
- Type-specific data object

<details>
<summary><b>View Full Type Definitions</b></summary>

```typescript
type BusinessSettings = {
  businessName: string;
  name: string;
  logo?: string;
  tone: string;
  icp: string;
  brandGuidelines: {
    dos: string[];
    donts: string[];
  };
  keywords: string[];
  createdAt: string;
};

type SeoArticle = BaseAsset & {
  type: 'seo';
  data: {
    title: string;
    tags: string[];
    content: string;
    wordCount: number;
    imagePrompt: string;
  };
};

// See src/types/index.ts for complete definitions
```
</details>

### Prompt Engineering Strategy

Each generator follows this pattern:

1. **System Prompt** - Role definition + business context
2. **User Prompt** - Specific task
3. **JSON Schema** - Enforced output structure
4. **Validation** - Type-safe parsing

**Example (SEO Generator):**

```typescript
const systemPrompt = `
  You are an expert SEO content writer.
  
  Business context:
  - ICP: ${settings.icp}
  - Tone: ${settings.tone}
  - Keywords: ${settings.keywords}
  - Dos: ${settings.brandGuidelines.dos}
  - Don'ts: ${settings.brandGuidelines.donts}
  
  Output format: {"title": "", "tags": [], "content": "", ...}
`;
```

**Why this works:** Context injection ensures every generation is pre-aligned.

---

## 🔧 Generators Deep-Dive

### SEO Article Generator

**Input:**
- Topic
- Business settings (auto-loaded)

**AI Task:**
- Generate 500-800 word article
- Include H2/H3 structure
- Optimize for target keywords
- Follow brand guidelines
- Create hero image prompt

**Output:**
- Title (SEO-optimized)
- Tags (keyword list)
- Content (HTML formatted)
- Word count
- Image prompt

**Use Case:** Blog post creation that's pre-optimized and on-brand.

---

### Email Campaign Generator

**Input:**
- Topic
- Purpose (newsletter, promotion, announcement, follow-up)
- Business settings

**AI Task:**
- Write compelling subject line
- Craft preview text (50 chars)
- Generate email body (HTML)
- Include clear CTA
- Match purpose intent

**Output:**
- Subject line
- Preview line
- Body HTML
- Purpose tag

**Use Case:** Campaign creation without a copywriter.

---

### Social Media Generator

**Input:**
- Topic
- Platform (Instagram, LinkedIn, Facebook, Twitter)
- Business settings

**AI Task:**
- Platform-specific character limits
- Hashtag strategy per platform
- Visual composition prompt
- Voice adaptation (LinkedIn formal → Twitter casual)

**Output:**
- Copy (platform-optimized)
- Hashtags (5-10 relevant)
- Image prompt (dimensions noted)
- Platform tag

**Use Case:** Multi-platform posting from one idea.

---

### Lead Magnet Generator

**Input:**
- Topic
- Resource type (guide, checklist, template, calculator)
- Business settings

**AI Task:**
- Create valuable, downloadable resource
- Structure for easy consumption
- Include actionable steps
- For calculators: spec out interactive version

**Output:**
- Title
- Outline (structured sections)
- Deliverable HTML
- Developer prompt (for interactive versions)
- Resource type

**Use Case:** Lead generation asset creation in minutes.

---

### Content Repurposer

**Input:**
- Existing long-form content
- Target platform/format
- Business settings

**AI Task:**
- Extract key points
- Adapt voice for new platform
- Maintain brand consistency
- Suggest visual elements

**Output:**
- Repurposed content
- Platform tag
- Suggested images

**Use Case:** Maximize content ROI across channels.

---

### Image Generator

**Input:**
- Prompt
- Platform (optional - affects dimensions)
- Style preference
- Business settings

**AI Task:**
- Generate via DALL-E 3
- Optimize for platform dimensions
- Maintain brand visual consistency

**Output:**
- Image URL
- Generation cost ($0.04-$0.08)
- Model version
- Original prompt

**Use Case:** On-brand visuals without a designer.

---

## 📖 Use Cases

### For Solo Founders

**Problem:** Need consistent content but can't afford a marketing team.

**Solution:** Define your ICP and brand voice once, generate assets aligned to strategy daily.

**Result:** Professional marketing presence without hiring.

---

### For Marketing Agencies

**Problem:** Multiple clients, each with different brand guidelines and ICPs.

**Solution:** Set up client profiles, switch between them, generate on-brand content per account.

**Result:** Scale content production without adding headcount.

---

### For Content Marketers

**Problem:** Ideas bottleneck—spend more time thinking than creating.

**Solution:** Generate first drafts in seconds, spend time on editing and optimization.

**Result:** 5x content output with same team size.

---

### For Startups

**Problem:** Need to establish thought leadership but engineering team is busy building product.

**Solution:** Founder sets ICP/tone once, generates content weekly without taking engineering time.

**Result:** Market presence + product development happening in parallel.

---

## 🎓 Why This Matters

### What This Project Demonstrates

**1. Domain Expertise**
Understanding marketing operations isn't learned from tutorials. This shows real experience:
- ICP vs demographics
- Brand voice vs tone
- Content strategy vs tactics
- Lead funnel stages
- Multi-channel orchestration

**2. Product Thinking**
Complete user journey:
- Onboarding (settings)
- Core workflow (generate)
- Library management
- Status workflow
- Export/sharing

**3. Technical Execution**
Production-quality code:
- Type safety throughout
- Offline-first architecture
- Performance optimization
- Error handling
- User experience polish

**4. AI Implementation Strategy**
Not just "call ChatGPT":
- Context injection
- Structured outputs
- JSON validation
- Cost tracking
- Model selection

### For AI Strategy Manager Roles

**Most candidates show one:**
- ✅ Marketing knowledge (but can't build)
- ✅ Technical skill (but don't understand business)

**This project shows both:**
- ✅ Deep marketing domain expertise
- ✅ Advanced technical implementation
- ✅ Product strategy thinking
- ✅ AI integration experience

**That's the intersection where AI Strategy Manager roles live.**

---

## 🏢 About FutureCrafters

**Marketing Dashboard** is a flagship project from FutureCrafters' portfolio of practical AI systems for businesses.

We build AI-powered control layers that make operations 10x more efficient:
- **AI Strategy & Implementation** - Custom systems designed for your business
- **Control Layer Sprints** - 2-week rapid AI implementations  
- **AI Labs** - Monthly retainer for ongoing development
- **Custom Solutions** - White-label tools and enterprise integrations

**Founded by [Irvin Cruz](https://irvincruz.com)** - CAIO-certified AI strategist with 8+ years building business systems at Disney, Entercom, and beyond.

### Get In Touch

- 📞 **[Book a consultation](https://calendar.app.google/5of8AAhCW2FVV2Eg7)**
- 📧 **Email:** [hello@futurecrafters.ai](mailto:hello@futurecrafters.ai)
- 🌐 **Website:** [www.futurecrafters.ai](https://www.futurecrafters.ai)
- 💼 **LinkedIn:** [linkedin.com/company/futurecraftersai](https://linkedin.com/company/futurecraftersai)

<details>
<summary><b>More FutureCrafters Projects</b></summary>

- **[NewsGen AI](https://github.com/IrvinCruzAI/AI_News_Generator)** - Transform news headlines into articles in 10 seconds
- **Mission Control** - Business intelligence dashboard for solopreneurs
- **Rory** - AI content engine with custom voice modeling
- **Nexus** - Network intelligence for LinkedIn relationship management
- **Sol** - 5-agent AI operating system for business automation

Explore more: [github.com/IrvinCruzAI](https://github.com/IrvinCruzAI)
</details>

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| TypeScript files | 27 |
| Source code | 316KB |
| Components | 20+ |
| Asset types | 5 |
| Generators | 6 |
| Database tables | 2 |
| Dependencies | 15 |
| Lines of code | ~3,500 |

---

## 🛠️ Development

### Project Structure

```
Marketing_Dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/      # Overview & stats
│   │   ├── generators/     # 6 AI generators
│   │   ├── library/        # Asset management
│   │   ├── settings/       # Business config
│   │   └── ui/             # Layout components
│   ├── lib/
│   │   ├── api.ts          # OpenAI integration
│   │   ├── db.ts           # Dexie database
│   │   ├── openai.ts       # AI utilities
│   │   └── utils.ts        # Helper functions
│   ├── store/
│   │   └── index.ts        # Zustand state
│   ├── types/
│   │   └── index.ts        # TypeScript definitions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── package.json            # Dependencies
```

### Key Files

- `src/types/index.ts` - Complete type definitions
- `src/lib/db.ts` - Database schema and queries
- `src/lib/api.ts` - AI generation logic
- `src/components/generators/*` - Generator implementations

### Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production
npm run preview

# Lint
npm run lint
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with modern tools and frameworks:
- [React](https://react.dev) - UI framework
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Dexie.js](https://dexie.org) - IndexedDB wrapper
- [Zustand](https://zustand-demo.pmnd.rs) - State management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [OpenAI](https://openai.com) - AI models

---

**⭐ Star this repo if you find it useful!**

*Last Updated: February 2026 • A FutureCrafters Flagship Project*
