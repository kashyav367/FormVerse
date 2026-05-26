# ⛩ FormVerse

Build beautiful forms that feel effortless.

FormVerse is a modern AI-powered form building platform where users can create, customize, publish, and analyze forms with a clean and interactive experience.

---

## 🚀 Live Demo

🔗 Demo: [Add Vercel Link Here]

---

## ✨ Features

### Authentication & Security
- User Signup/Login
- Protected Dashboard Routes
- Create Form access only for authenticated users
- JWT Authentication
- Cookie-based session handling
- Logout functionality

### Form Builder
- Dynamic form creation
- Drag & Drop field management
- Add multiple field types:
  - Text
  - Email
  - Number
  - Checkbox
  - Select
  - Date
  - Password
  - Textarea
- Required field support
- Placeholder support
- Field deletion

### Form Management
- Dashboard for managing forms
- Publish/Unpublish forms
- Form themes
- Categories
- Templates
- Form visibility options

### Responses
- Collect responses
- View analytics
- Store response data in database

---

## 🛠 Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- TailwindCSS

### Backend
- tRPC
- Node.js
- Express

### Database
- PostgreSQL
- Drizzle ORM

### Authentication
- JWT
- Cookies

### Monorepo
- Turborepo
- PNPM

---

## 📂 Project Structure

```bash
FormVerse/
│
├── apps/
│   └── web
│
├── packages/
│   ├── database
│   ├── services
│   ├── trpc
│   └── ui
│
└── README.md
```

---

## ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/kashyav367/FormVerse.git
```

Move into project:

```bash
cd FormVerse
```

Install dependencies:

```bash
pnpm install
```

Setup environment:

```env
DATABASE_URL=

JWT_SECRET=

NEXT_PUBLIC_API_URL=
```

Run development server:

```bash
pnpm dev
```

---

## 🗄 Database Commands

Generate migration:

```bash
pnpm db:generate
```

Run migration:

```bash
pnpm db:migrate
```

Seed database:

```bash
pnpm db:seed
```

Open Drizzle Studio:

```bash
pnpm db:studio
```

---

## 🔄 Application Flow

```text
Landing Page
      ↓
Create Form
      ↓
Authentication
      ↓
Dashboard
      ↓
Create Form
      ↓
Publish Form
      ↓
Collect Responses
      ↓
Analytics
```

---

## 📸 Screenshots

Add screenshots here:

- Landing Page
- Dashboard
- Form Builder
- Responses Page

---

## 👨‍💻 Developer

Ankit Kumar Singh


GitHub:
https://github.com/kashyav367

---

## 📄 License

MIT License