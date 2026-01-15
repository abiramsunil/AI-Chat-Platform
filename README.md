## Demo Video

Watch the AI chat platform in action:

[![Watch the demo](https://img.youtube.com/vi/Ke8E8vdvlUk/0.jpg)](https://youtu.be/Ke8E8vdvlUk)


# AI Chat Platform

A simple full-stack application that allows users to create project-based AI chatbots with customizable system instructions. Built as part of an internship assignment to demonstrate backend API design, authentication, database modeling, and OpenAI API integration.

## Features

- User registration and login (JWT authentication)
- Project-based chat organization
- Custom system instructions per project
- AI-powered chat responses using OpenAI API
- Simple web-based frontend
- Graceful fallback when OpenAI quota is unavailable

## Tech Stack

- Backend: Node.js, Express.js, Prisma ORM, SQLite, JWT Authentication, OpenAI API
- Frontend: HTML, CSS, Vanilla JavaScript

## Setup Instructions

### Backend

1. Open a terminal and navigate to the backend folder:

cd backend


2. Install dependencies:


npm install


3. Create a `.env` file from the example:

cp .env.example .env


4. Add your environment variables to `.env`:


OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret


5. Run database migrations:


npx prisma migrate dev --name init


6. Start the backend server:


node index.js


The server will now be running at:

http://localhost:4000


### Frontend

1. Open `frontend/frontend.html` in a web browser.
   (Optional: use VS Code Live Server for smoother API communication.)

2. Use the frontend to:

   * Register a new user
   * Log in
   * Create projects
   * Add bot instructions (prompts)
   * Chat with the AI

## Notes

* If OpenAI API quota is exceeded, the backend returns a **mock AI reply** to ensure the frontend still functions for demo purposes.
* Sensitive keys (OpenAI API, JWT secret) are stored in `.env` and **should not be committed**.


## Live Demo

You can try the fully functional AI chat platform here:

[Open Live Demo](https://abiramsunil.github.io/AI-Chat-Platform/)


**Backend API:** https://ai-chat-platform-t51m.onrender.com


