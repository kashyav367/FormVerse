# ⛩ FormVerse — Full-Stack Type-Safe Form Builder Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-2596be?style=flat-square&logo=trpc)](https://trpc.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-c5f74f?style=flat-square)](https://orm.drizzle.team/)
[![Scalar Docs](https://img.shields.io/badge/Scalar-API_Docs-18b69b?style=flat-square)](https://formverse-1.onrender.com/docs)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PNPM Workspace](https://img.shields.io/badge/Turborepo-Monorepo-ef4444?style=flat-square&logo=turborepo)](https://turbo.build/)

> **FormVerse** is an enterprise-grade full-stack form building platform engineered with Next.js 15, Express.js backend, tRPC v11, Drizzle ORM, and Scalar OpenAPI documentation.

---

## 🌐 Live Deployments & API Documentation

| Service | Live Link | Description |
| :--- | :--- | :--- |
| 🚀 **Web Application** | [form-verse-web-6yyg.vercel.app](https://form-verse-web-6yyg.vercel.app) | Production Next.js 15 Web Client on Vercel |
| ⚡ **Backend Express API** | [formverse-1.onrender.com](https://formverse-1.onrender.com) | Express tRPC & OpenAPI Server on Render |
| 📖 **Scalar API Reference** | [formverse-1.onrender.com/docs](https://formverse-1.onrender.com/docs) | Interactive Scalar OpenAPI Docs (18+ Procedures) |

---

## 🔑 Demo Account Credentials

Use the pre-seeded demo account to explore full creator dashboard functionality instantly:

* 📧 **Email**: `demo@formverse.com`
* 🔑 **Password**: `Password123!`

---

## ✨ Key Features & Architectural Upgrades

### 🧠 Dynamic Zod Validation Engine
- **Runtime Schema Generation**: Dynamically compiles runtime Zod schemas (`buildDynamicFormZodSchema`) from custom form fields, rules (min/max length, min/max numbers, custom regex patterns), and conditional logic without requiring manual schema redeployments.
- **Conditional Visibility**: Supports `equals`, `not_equals`, `contains`, `greater_than`, and `less_than` rule evaluation.

### 🗄 Entity-Attribute-Value (EAV) Database Schema
- **Normalized Querying**: Stores responses in primary JSON format while normalizing field answers into the `response_answers` EAV table (`value_text`, `value_number`, `value_json`) for real-time aggregation and analytics.
- **Cascade Deletes & Integrity**: All forms, fields, submissions, and analytics events enforce `onDelete: "cascade"` foreign key relationships.

### 🎨 Custom Theme Presets (Glassmorphism & Ambient Light)
- 🕷️ **Spider-Man Web Suit** (Dark Red & Web Blue)
- 🦸‍♂️ **Superman Shield** (Metropolis Royal Blue & Gold)
- 🥷 **Ninja Hattori** (Iga Ninja Shadow Navy)
- 🐱 **Doraemon Pocket** (Gadget Sky Blue Light)
- 🎮 **Discord Dark** (Official Discord #313338 Dark)
- ⚡ **Aurora Cyber** (Midnight Cyan/Fuchsia Glass)
- 🌌 **Synthwave Cyberpunk** (Neon Pink Vaporwave)
- 🌸 **Sakura Blossom** (Rose Gold Japanese Minimal)
- 🍏 **Apple Studio White** (Pure Minimalist White)
- 🍃 **Emerald Mint** (Sage Green Paper Light)

### 🛡 Production Security & Spam Protection
- **Rate Limiting**: In-memory sliding window rate limiter (60 requests/minute per IP).
- **Honeypot Bot Trap**: Silent bot trap filter on all public form submissions.
- **JWT & HTTP-Only Cookies**: Secure cross-site session management with Bearer authorization header fallback.

### 📊 Analytics & Export Engine
- **Real-Time Analytics**: Tracks Views, Starts, Submissions, Conversion Rate, and Average Completion Time.
- **CSV Data Export**: One-click raw response CSV generation for spreadsheet analysis.

---

## 🛠 Tech Stack

### Frontend App (`apps/web`)
- **Framework**: Next.js 15 (App Router, Server Components, Turbopack)
- **State & Data**: React Query v5, tRPC React Client
- **Styling**: TailwindCSS, Glassmorphism, Google Fonts (Plus Jakarta Sans, Playfair Display, Fira Code)
- **Forms & Validation**: React Hook Form, Zod

### Backend API (`apps/api`)
- **Server**: Express.js
- **API Protocol**: tRPC v11 Server + `trpc-to-openapi`
- **Documentation**: `@scalar/express-api-reference`

### Database & Monorepo (`packages/database`, `packages/services`, `packages/trpc`)
- **Database**: PostgreSQL (Hosted on Neon DB)
- **ORM**: Drizzle ORM + Drizzle Kit
- **Monorepo Architecture**: Turborepo + PNPM Workspaces

---

## 📂 Monorepo Structure

```bash
FormVerse/
├── apps/
│   ├── api/             # Express server with tRPC, OpenAPI, Scalar Docs & Rate Limiter
│   └── web/             # Next.js 15 web client (Dashboard, Builder, Themes, Form Pages)
├── packages/
│   ├── database/        # Drizzle ORM models, migrations, and seed script
│   ├── services/        # Form, Submission, Field, Theme, Analytics & Export services
│   ├── trpc/            # tRPC v11 router definitions, context, and OpenAPI decorators
│   ├── logger/          # Shared Winston logger package
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/# Shared TSConfig definitions
├── package.json
└── turbo.json
```

---

## ⚙️ Local Development Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/kashyav367/FormVerse.git
cd FormVerse
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://neondb_owner:...@ep-sparkling-firefly...aws.neon.tech/neondb?sslmode=require
JWT_SECRET=superman1234
NODE_ENV=development
BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/trpc
```

### 3. Database Migration & Seeding

Push database schema to PostgreSQL and seed sample data:

```bash
pnpm db:push
pnpm db:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

- Web Client: `http://localhost:3000`
- API Server: `http://localhost:8000`
- Scalar API Docs: `http://localhost:8000/docs`

---

## 📖 API Documentation Reference

FormVerse features auto-generated Scalar OpenAPI documentation for all 7 tRPC routers:

- 🔑 **Authentication Router**: `/trpc/auth.createUserWithEmailAndPassword`, `/trpc/auth.signInUserWithEmailAndPassword`, `/trpc/auth.getLoggedInUserInfo`
- 📋 **Form Router**: `/trpc/form.createForm`, `/trpc/form.listForms`, `/trpc/form.getFormById`, `/trpc/form.duplicateForm`, `/trpc/form.deleteForm`
- 🧩 **Form Field Router**: `/trpc/formField.addField`, `/trpc/formField.listFields`, `/trpc/formField.reorderFields`
- 📥 **Form Submission Router**: `/trpc/formSubmission.submitForm`, `/trpc/formSubmission.getSubmissions`
- 📊 **Analytics Router**: `/trpc/analytics.trackEvent`, `/trpc/analytics.getOverviewStats`, `/trpc/analytics.getFieldWiseAnalytics`
- 💾 **Export Router**: `/trpc/export.exportSubmissionsToCSV`

Visit **[https://formverse-1.onrender.com/docs](https://formverse-1.onrender.com/docs)** to test endpoints live in your browser.

---

## 👨‍💻 Author

**Ankit Kumar Singh**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.