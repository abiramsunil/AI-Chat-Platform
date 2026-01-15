
# AI Chat Platform – Architecture Overview

The application follows a **client-server architecture** with a frontend, backend, database, and OpenAI integration.

Frontend (browser)
│
▼
Express.js Backend (Node.js + Prisma)
│
├─ JWT Authentication
├─ Project & Prompt Management
└─ OpenAI Responses API Integration
│
▼
SQLite Database (via Prisma)



## Components

### 1. Frontend
- Built with HTML, CSS, and vanilla JavaScript.
- Provides interfaces for:
  - Registering and logging in users
  - Creating and selecting projects
  - Adding bot instructions (prompts)
  - Chatting with the AI assistant
- Communicates with backend via **fetch API** and JWT token.

### 2. Backend
- **Express.js server** exposing REST endpoints:
  - `/register` and `/login` for authentication
  - `/projects` and `/projects/:id/prompts` for project management
  - `/projects/:id/chat` for AI chat
- **Auth middleware** protects routes and validates JWTs.
- **OpenAI integration** via Responses API (`openai.responses.create`) with:
  - System prompts loaded from database
  - User messages combined into a request
- **Fallback mechanism** returns mock AI replies if quota is exceeded.

### 3. Database
- **SQLite** used with Prisma ORM.
- Tables:
  - `User` – stores user credentials (hashed passwords)
  - `Project` – stores project metadata linked to users
  - `Prompt` – stores system instructions for projects
- Prisma handles migrations and database queries.

### 4. OpenAI Integration
- Uses **Responses API** for chat completion.
- Backend constructs a request with system prompts + user message.
- Returns AI-generated reply to frontend.
- If API quota is exceeded, a **mock response** is sent instead.

---

## Data Flow

1. User interacts with frontend → sends request to backend with JWT.
2. Backend validates request via middleware.
3. Project or prompt data is read/written to the SQLite database.
4. Chat request:
   - Backend fetches project prompts
   - Sends combined message to OpenAI Responses API
   - Receives AI reply (or mock fallback)
   - Sends reply back to frontend
5. Frontend displays AI response in chat interface.

---

## Key Design Decisions

- **JWT-based authentication** keeps backend stateless.
- **Project-based prompts** allow multiple AI “personalities” per user.
- **Fallback mechanism** ensures demo works even with OpenAI quota limitations.
- **Simple frontend** ensures reviewers can test functionality without environment setup issues.

---

This design ensures a **modular, maintainable, and demo-ready application**.
```

---

