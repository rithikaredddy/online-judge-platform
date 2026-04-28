# Online Judge Platform ⚖️

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-24-blue?style=for-the-badge&logo=docker)
![Express](https://img.shields.io/badge/Express-4-black?style=for-the-badge&logo=express)

> A full-stack competitive programming platform where users solve DSA problems, submit code in multiple languages, and receive real-time verdicts — built like a mini LeetCode.

---

## Features

- JWT Authentication (Register / Login / Protected routes)
- 10+ DSA Problems with hidden test cases
- Code execution in **Python, C++, Java** via isolated Docker containers
- Verdicts: ✅ Accepted / ❌ Wrong Answer / ⏱ Time Limit Exceeded / 💥 Runtime Error
- **Monaco Editor** (VS Code's editor) directly in the browser
- User Dashboard — solved count, submission history, streak
- Global Leaderboard ranked by problems solved

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Monaco Editor, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Code Execution | Docker (sandboxed containers per language) |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
online-judge-platform/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── context/           # Auth context (global state)
│   │   └── App.jsx
│   └── package.json
├── backend/                   # Express REST API
│   ├── routes/                # auth, problems, submissions
│   ├── models/                # Mongoose schemas
│   ├── middleware/            # JWT auth guard
│   ├── executor/              # Docker runner logic
│   └── server.js
├── docker/                    # Dockerfiles per language
├── problems/                  # Problem definitions (JSON)
├── docker-compose.yml
├── .env.example
└── GITHUB_STRATEGY.md
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- MongoDB running locally or MongoDB Atlas URI
- Docker installed and running

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/online-judge-platform
cd online-judge-platform
```

### 2. Backend setup
```bash
cd backend
npm install
cp ../.env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
# API running at http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm start
# UI running at http://localhost:3000
```

### 4. Docker (for code execution)
```bash
docker-compose up --build
```

---

## API Endpoints

```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login + get JWT token

GET    /api/problems              Get all problems
GET    /api/problems/:id          Get single problem

POST   /api/submissions           Submit code for a problem
GET    /api/submissions/me        Get current user's submissions

GET    /api/leaderboard           Get top users by solved count
```

---

## Resume Bullet Points

- Built a **full-stack Online Judge platform** (mini LeetCode) with React, Node.js, MongoDB, and Docker supporting Python, C++, and Java submissions
- Implemented **isolated code execution** using Docker containers with time-limit enforcement, returning AC / WA / TLE / RE verdicts
- Designed **JWT-based authentication**, RESTful problem/submission APIs, and a global leaderboard with user dashboards
- Integrated **Monaco Editor** (VS Code's editor) with multi-language support and live verdict feedback on the frontend

---

## Live Demo

🔗 [online-judge-platform-pi.vercel.app](https://online-judge-platform-pi.vercel.app)

---

## Future Improvements

- [ ] Add contest/timed challenge mode
- [ ] Code plagiarism detection
- [ ] Discussion forum per problem
- [ ] Admin panel to add problems via UI
- [ ] Support more languages (JavaScript, Go, Rust)
