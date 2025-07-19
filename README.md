# Chat App UI

A frontend user interface for a real-time chat application with authenticated users, built using Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

-- This UI connects to the backend server implemented in Go:
[Server Realtime Chat App](https://github.com/dinhdev-nu/chat_realtime_go)

---

## Demo

---

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS and shadcn/ui
- TypeScript
- Access Token Authentication
- WebSocket for real-time messaging

---

## Features

- User login and registration
- Real-time chat interface
- Chat room management
- Typing indicators and dynamic message updates
- Modular UI components for maintainability

---

## Directory Structure

```bash
chat_app_ui/
├── app/                         # App Router pages
│   ├── (auth)/                  # Auth pages (login, register)
│   ├── (chat)/                  # Chat rooms and chat page
│   └── page.tsx                 # Landing page
│
├── components/                 # Reusable UI components
│   ├── chat/                   # Chat-specific components
│   └── ui/                     # Shared UI components (shadcn/ui)
│
├── config/                     # Configuration (WebSocket, API endpoints)
├── hooks/                      # Custom React hooks (e.g., useChat)
├── lib/                        # Utilities and shared functions
├── public/                     # Static assets (images, icons, etc.)
├── styles/                     # Global styles (Tailwind setup, base CSS)
├── types/                      # Global TypeScript types
├── utils/                      # Helper functions (formatting, parsing, etc.)
├── .env.example                # Sample environment variables
├── README.md                   # Project documentation
├── package.json                # Project metadata and scripts
└── tsconfig.json               # TypeScript configuration

```

## 🛠️ Settings

```bash
git clone https://github.com/dinhdev-nu/chat_app_ui.git
cd chat_app_ui
pnpm install
pnpm dev
```
