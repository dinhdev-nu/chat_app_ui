<div align="center">

# 💬 CommuniHub - Real-Time Chat Application

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-latest-FF0055?style=for-the-badge&logo=framer" alt="Framer Motion" />
</p>

<p align="center">
  A modern, feature-rich real-time chat application with beautiful UI/UX, built with Next.js 15, React 19, and WebSocket technology.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-integration">API</a>
</p>

</div>

---

## 🔗 Backend Server

This frontend connects to a high-performance Go backend:

**[🚀 Server Realtime Chat App](https://github.com/dinhdev-nu/chat_realtime_go)**

---

## ✨ Features

### 🎨 **Modern Landing Page**
- ✅ Stunning hero section with animated gradients
- ✅ Interactive feature showcase
- ✅ Pricing plans with smooth animations
- ✅ Responsive design for all devices
- ✅ Newsletter subscription
- ✅ Modern footer with social links

### 💬 **Real-Time Messaging**
- ✅ Instant message delivery via WebSocket
- ✅ Private 1-on-1 conversations
- ✅ Group chat rooms with multiple participants
- ✅ Message read receipts (delivered/read status)
- ✅ Typing indicators
- ✅ Online/offline/away status
- ✅ Message reactions and emojis
- ✅ File sharing support
- ✅ Image preview

### 👥 **User Management**
- ✅ User registration with validation
- ✅ Secure login with JWT authentication
- ✅ User profile with avatar
- ✅ User discovery and search
- ✅ Friend requests
- ✅ User status management

### 🎯 **Chat Features**
- ✅ Create and manage chat rooms
- ✅ Group creation with member selection
- ✅ Channel sidebar with conversations
- ✅ Message history and pagination
- ✅ Unread message counter
- ✅ Notification center
- ✅ Emote panel
- ✅ User discovery panel

### 🎨 **UI/UX Excellence**
- ✅ Beautiful gradient animations
- ✅ Smooth transitions with Framer Motion
- ✅ Dark mode optimized
- ✅ Responsive mobile design
- ✅ Skeleton loaders for better UX
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Custom scrollbars

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### **Styling & UI**
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons

### **State & Data Management**
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Axios](https://axios-http.com/)** - HTTP client for API requests
- **[date-fns](https://date-fns.org/)** - Modern date utility library

### **Real-Time Communication**
- **WebSocket** - Bi-directional real-time communication
- Custom WebSocket hooks for chat functionality
- Event-driven architecture

### **Additional Libraries**
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[React Intersection Observer](https://github.com/thebuilder/react-intersection-observer)** - Lazy loading
- **[cmdk](https://cmdk.paco.me/)** - Command palette
- **[Recharts](https://recharts.org/)** - Charting library
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component

---

## 🚀 Getting Started

### **Prerequisites**

Make sure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ ([Install](https://pnpm.io/installation))

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/dinhdev-nu/chat_app_ui.git
cd chat_app_ui
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# Local Storage Keys
NEXT_PUBLIC_SESSION_KEY=chat_session
NEXT_PUBLIC_USER_KEY=chat_user

# App Configuration
NEXT_PUBLIC_APP_NAME=CommuniHub
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Build for Production**

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

---

## 📁 Project Structure

```
chat_app_ui/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 (auth)/                   # Authentication routes
│   │   ├── layout.tsx               # Auth layout
│   │   ├── 📂 login/                # Login page
│   │   └── 📂 signup/               # Signup page
│   │
│   ├── 📂 chat/                     # Chat application
│   │   ├── page.tsx                 # Main chat interface
│   │   ├── 📂 conversation/         # Conversation routes
│   │   └── 📂 discord/              # Discord-style chat
│   │
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   ├── globals.css                  # Global styles
│   └── client-wrapper.tsx           # Client-side wrappers
│
├── 📂 components/                   # React components
│   ├── 📂 chat/                     # Chat-specific components
│   │   ├── chat-header.tsx          # Chat header
│   │   ├── chat-messages.tsx        # Message list
│   │   ├── chat-sidebar.tsx         # Sidebar with conversations
│   │   ├── conversation-item.tsx    # Conversation list item
│   │   ├── emote-panel.tsx          # Emoji/emote selector
│   │   ├── group-chat-messages.tsx  # Group chat messages
│   │   ├── group-creation-modal.tsx # Create group modal
│   │   ├── immersive-chat-interface.tsx # Main chat UI
│   │   ├── notification-center.tsx  # Notifications
│   │   ├── skeleton-loaders.tsx     # Loading states
│   │   └── user-discovery.tsx       # Find users
│   │
│   ├── 📂 ui/                       # shadcn/ui components
│   │   ├── button.tsx               # Button component
│   │   ├── card.tsx                 # Card component
│   │   ├── dialog.tsx               # Dialog/Modal
│   │   ├── input.tsx                # Input field
│   │   ├── avatar.tsx               # Avatar component
│   │   ├── badge.tsx                # Badge component
│   │   ├── toast.tsx                # Toast notifications
│   │   └── ...                      # 40+ UI components
│   │
│   ├── navbar.tsx                   # Navigation bar
│   ├── hero.tsx                     # Hero section
│   ├── footer.tsx                   # Footer
│   ├── chat-interface.tsx           # Landing chat demo
│   ├── community-features.tsx       # Features section
│   ├── join-community.tsx           # CTA section
│   ├── login-form.tsx               # Login form
│   ├── registration-form.tsx        # Signup form
│   └── ...                          # Other components
│
├── 📂 config/                       # Configuration files
│   └── axios.config.ts              # Axios instance with auth
│
├── 📂 hooks/                        # Custom React hooks
│   ├── use-toast.ts                 # Toast hook
│   ├── use-mobile.tsx               # Mobile detection
│   └── use-media-query.ts           # Media query hook
│
├── 📂 lib/                          # Shared utilities
│   ├── 📂 api/                      # API functions
│   │   └── chat.ts                  # Chat API calls
│   │
│   ├── 📂 hooks/                    # Advanced hooks
│   │   ├── use-init-chat.ts         # Initialize chat
│   │   └── use-get-group.ts         # Fetch groups
│   │
│   ├── utils.ts                     # Utility functions
│   ├── mock-data.ts                 # Mock data for demo
│   └── mock-notifications-data.ts   # Mock notifications
│
├── 📂 types/                        # TypeScript type definitions
│   ├── auth.ts                      # Auth types
│   ├── chat.ts                      # Chat & message types
│   └── user.ts                      # User types
│
├── 📂 public/                       # Static assets
│   └── ...                          # Images, icons, etc.
│
├── 📂 styles/                       # Additional styles
│   └── globals.css                  # Extra global styles
│
├── .env.local                       # Environment variables (local)
├── .gitignore                       # Git ignore rules
├── components.json                  # shadcn/ui config
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Dependencies & scripts
├── pnpm-lock.yaml                   # Lockfile
├── postcss.config.mjs               # PostCSS config
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

---

## 🎨 Key Components

### **Main Chat Interface**
The heart of the application with all chat features:
```typescript
// components/chat/immersive-chat-interface.tsx
- WebSocket connection management
- Real-time message handling
- User status tracking
- Typing indicators
- Message read receipts
- Group & private conversations
```

### **Authentication**
Secure login and registration:
```typescript
// components/login-form.tsx & registration-form.tsx
- Form validation with Zod
- JWT token management
- Protected routes
- Auto-redirect after login
```

### **Landing Page**
Beautiful, animated landing page:
```typescript
// components/hero.tsx, community-features.tsx, join-community.tsx
- Framer Motion animations
- Gradient effects
- Responsive design
- Interactive elements
```

---

## 🌐 API Integration

### **Authentication Endpoints**
```typescript
POST /api/v1/auth/register  // User registration
POST /api/v1/auth/login     // User login
GET  /api/v1/auth/me        // Get current user
```

### **Chat Endpoints**
```typescript
POST /api/v1/chat/create-room        // Create chat room
GET  /api/v1/chat/get-messages       // Fetch messages
POST /api/v1/chat/set-status         // Update read status
GET  /api/v1/chat/search-user        // Search users
GET  /api/v1/chat/get-groups         // Fetch user groups
```

### **WebSocket Events**
```typescript
// Client -> Server
message      // Send message
typing       // Typing indicator
read         // Mark as read
subscribe    // Subscribe to user updates
status       // Update user status

// Server -> Client
message      // Receive message
typing       // User typing
read         // Message read
status       // User status update
ack          // Message acknowledgment
room_created // New room notification
```

---

## 🎯 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:8080/ws` |
| `NEXT_PUBLIC_SESSION_KEY` | LocalStorage key for session | `chat_session` |
| `NEXT_PUBLIC_USER_KEY` | LocalStorage key for user data | `chat_user` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `CommuniHub` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |

---

## 📱 Responsive Design

The application is fully responsive across all devices:

- 📱 **Mobile** (< 768px) - Optimized touch interface
- 📱 **Tablet** (768px - 1024px) - Adaptive layout
- 💻 **Desktop** (> 1024px) - Full feature set

---

## 🎨 Customization

### **Colors**
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
colors: {
  primary: '#6366f1',    // Indigo
  secondary: '#a855f7',  // Purple
  accent: '#ec4899',     // Pink
}
```

### **Fonts**
Modify `app/layout.tsx` to change fonts:
```typescript
import { Inter } from 'next/font/google'
```

### **Animations**
Adjust animation timings in `app/globals.css`:
```css
.animate-gradient {
  animation: gradient-shift 15s ease infinite;
}
```

---

## 🧪 Development Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm dev --turbo      # Start with Turbopack

# Building
pnpm build            # Create production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**dinhdev-nu**

- GitHub: [@dinhdev-nu](https://github.com/dinhdev-nu)
- Email: truongbadinh13579@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

If you have any questions or need help, feel free to:

- 📧 Email: truongbadinh13579@gmail.com
- 🐛 [Open an issue](https://github.com/dinhdev-nu/chat_app_ui/issues)
- 💬 [Start a discussion](https://github.com/dinhdev-nu/chat_app_ui/discussions)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by dinhdev-nu**

</div>
