Live demo: https://careercompass-ruddy.vercel.app

<div align="center">

<img src="client/public/logo.png" alt="CareerCompass logo" width="120" />

# CareerCompass

**An AI-powered career mentor for students and fresh graduates.**

Find your skill gaps, get a personalized learning roadmap, and prepare for internships and placements with a mentor that actually knows you.

</div>

---

## Overview

Many students struggle to decide which skills to learn, which projects to build, and how to turn a career goal into a plan. General AI chatbots can answer questions, but they don't remember who you are, track your progress, or build a long-term plan.

**CareerCompass** turns AI into a structured career-management system. It stores each student's profile, compares their skills with the target role, generates a personalized roadmap, tracks progress, and offers a mentor chatbot that already knows the student's profile and roadmap.

## Features

- **Secure authentication**: signup and login with hashed passwords (bcrypt) and JWT sessions
- **Student profile**: branch, year, current skills, interests, target role, and target company
- **Skill-gap analysis**: compares current skills with the target role and rates each gap by priority
- **Personalized roadmap**: ordered learning steps with durations, plus project ideas that match the goal
- **Progress tracking**: tick off roadmap steps and watch the progress bar on the dashboard
- **AI career mentor**: a chatbot that knows the student's profile and progress, with saved chat history and a "New chat" option
- **Resume analysis**: paste resume text to get a score, strengths, improvements, and missing keywords (the text is not stored)
- **Interview preparation**: technical, behavioral, and company-specific practice questions with hints
- **Dashboard**: stats, next recommended step, skills overview, and a motivation line that changes on every refresh
- **Dark and light themes**: your choice is remembered in the browser, with no flash on reload

## Tech Stack

| Layer          | Technology                                                                   |
| -------------- | ---------------------------------------------------------------------------- |
| Frontend       | React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, Lucide icons |
| Backend        | Node.js, Express                                                             |
| Database       | MongoDB Atlas with Mongoose                                                  |
| Authentication | JSON Web Tokens (JWT), bcryptjs                                              |
| AI             | Google Gemini API                                                            |
| Tools          | Git, GitHub, VS Code                                                         |

## How It Works

```
 React app (Vite)  --->  Express API  --->  MongoDB Atlas
   (client)               (server)            (users, roadmaps, chats)
                              |
                              v
                         Gemini API
```

1. The student signs up, logs in, and fills in a profile.
2. The server reads the profile from MongoDB and sends it to Gemini with clear instructions.
3. Gemini returns skill gaps, roadmap steps, and project ideas as JSON, which the server saves.
4. For the mentor chat, the server adds the student's profile and progress as background context to every conversation, then saves each message.

## Project Structure

```
careercompass/
├── client/                 # React frontend
│   ├── public/             # logo and favicon
│   └── src/
│       ├── components/     # Navbar, MotivationTile
│       ├── context/        # Theme and Auth providers
│       └── pages/          # Landing, Login, Signup, Dashboard,
│                           # Profile, Roadmap, Chat, Tools
└── server/                 # Express backend
    ├── middleware/         # JWT auth check
    ├── models/             # User, Roadmap, Conversation
    ├── routes/             # auth, profile, ai, tools
    ├── services/           # Gemini helper with retries
    └── index.js
```

## API Overview

| Method       | Endpoint                        | Description                      |
| ------------ | ------------------------------- | -------------------------------- |
| POST         | `/api/auth/signup`              | Create an account                |
| POST         | `/api/auth/login`               | Log in and receive a token       |
| GET / PUT    | `/api/profile`                  | Read or save the student profile |
| GET / POST   | `/api/ai/roadmap`               | Get or generate the roadmap      |
| PATCH        | `/api/ai/roadmap/steps/:stepId` | Tick or untick a roadmap step    |
| POST         | `/api/ai/chat`                  | Send a message to the AI mentor  |
| GET          | `/api/ai/conversations`         | List saved chats                 |
| GET / DELETE | `/api/ai/conversations/:id`     | Open or delete a chat            |
| POST         | `/api/tools/resume`             | Analyze pasted resume text       |
| POST         | `/api/tools/interview`          | Generate interview questions     |

All routes except signup and login require a valid JWT.

## Getting Started

### Prerequisites

- Node.js (LTS) and npm
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/kushalpurohit1165/careercompass.git
cd careercompass
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a file named `.env` inside `server/`:

| Variable         | Description                              |
| ---------------- | ---------------------------------------- |
| `PORT`           | Port for the API (for example `5000`)    |
| `MONGO_URI`      | Your MongoDB Atlas connection string     |
| `JWT_SECRET`     | A long random string used to sign tokens |
| `GEMINI_API_KEY` | Your Gemini API key                      |
| `GEMINI_MODEL`   | The Gemini model name to use             |

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`).

## Security Notes

- Passwords are hashed with bcrypt and never stored in plain text
- Protected routes check a signed JWT on every request
- Secrets live in `.env`, which is excluded from Git
- The database user has read and write access only, with no admin rights
- Pasted resume text is processed and not stored

## Future Improvements

- Upload resumes as PDF files
- Weekly progress reminders by email
- Company-specific preparation plans
- Mock interview mode with spoken answers
- Public deployment with a locked-down database network

## Author

**Kushal Purohit**<br>
B.Tech Information Technology student at SKIT, Jaipur <br>
GitHub: [@kushalpurohit1165](https://github.com/kushalpurohit1165)

Built as an 5th semester ITR project.
