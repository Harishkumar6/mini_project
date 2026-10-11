# PrepPilot – Personalized Placement Training Platform

> **Tagline:** "Your Personalized Path to Placement Success"

PrepPilot is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to guide students through campus recruitment preparation. It combines structured learning materials, practice questions, coding challenges, timed mock assessments, dynamic analytics, and a rule-based **Personalized Learning Roadmap Engine**.

---

## 🌟 Key Features

### 🎓 Student Experience
- **Structured Learning Modules**: Aptitude, Logical Problem Solving, and Communication Skills with concepts, formulas, and solved examples.
- **Interactive Practice System**: Topic-wise practice questions with instant options evaluation, correct answer highlights, and explanations.
- **Coding Practice Sandbox**: Standard technical interview coding challenges with test case evaluation.
- **Timed Mock Assessments**: Simulated exams with live countdown timer, question navigator grid, and score breakdown.
- **Personalized Learning Roadmap (Rule-Based Engine)**: Automatically calculates weak topics (< 50% target threshold) and generates prioritized study actions based on real user performance.
- **Progress Analytics**: Visual Recharts graphs including score trends, category mastery, and topic strengths vs weaknesses.
- **Gamification & Badges**: XP points, learning streaks, and unlocked achievements.
- **Student Profile**: College, department, and academic year tracking.

### 🛡️ Admin Management Panel
- **System Overview Dashboard**: Monitor registered students, active learners, total question bank, and overall assessment averages.
- **Student Roster Management**: Search, filter by department, view progress, and enable/disable student accounts.
- **Content CRUD Suite**: Full CRUD for Categories, Topics, Learning Materials, Practice Questions, Coding Problems, and Assessments.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Lucide Icons, Recharts, Custom Glassmorphic CSS System.
- **Backend**: Node.js, Express.js, JWT Authentication, BcryptJS Password Hashing.
- **Database**: MongoDB with Mongoose Schema Modeling (includes automatic in-memory fallback for seamless demonstration out of the box).

---

## 🔑 Demo Credentials (Final-Year Project Review)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo Student** | `student@preppilot.com` | `student123` |
| **System Admin** | `admin@preppilot.com` | `admin123` |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- NPM

### 1. Install Dependencies
Run the command below from the project root directory:
```bash
npm run install:all
```

### 2. Seed Sample Database
Initialize the database with rich placement learning materials, practice question bank, coding problems, assessments, and demo accounts:
```bash
npm run seed
```

### 3. Launch Development Server
Start both Express backend (Port 5000) and React Vite frontend (Port 3000):
```bash
npm run dev
```

Open your browser and navigate to: `http://localhost:3000`

---

## 📁 Project Architecture

```
PrepPilot/
├── package.json               # Root scripts & runner
├── .env.example               # Environment variables template
├── server/                    # Express Backend
│   ├── config/                # DB Connection & Memory Server
│   ├── controllers/           # REST API Controllers
│   ├── middleware/            # Auth & Error Middlewares
│   ├── models/                # Mongoose Schemas (User, Topic, Assessment, etc.)
│   ├── routes/                # Express Endpoint Handlers
│   ├── services/              # Roadmap Engine & Achievement Engine
│   ├── seed/                  # Seeder Script & Mock Data
│   └── server.js              # Server Entry Point
└── client/                    # React Frontend
    ├── index.html
    ├── src/
    │   ├── components/        # Navbar, Sidebar, Modal, StatCard, ProgressBar, etc.
    │   ├── context/           # AuthContext, ToastContext
    │   ├── pages/             # Landing, Dashboard, Learn, Practice, Assessments, Roadmap, etc.
    │   ├── services/          # Axios API Service Layer
    │   ├── App.jsx            # React Router Architecture
    │   ├── main.jsx           # React Entry
    │   └── index.css          # Modern EdTech Design System
```

---

## 📡 Key REST APIs

- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current session details
- `GET /api/topics` - Placement topics
- `GET /api/questions/practice` - Practice question set
- `POST /api/questions/practice/submit` - Verify answer & record attempt
- `POST /api/assessments/submit` - Submit exam paper & calculate score
- `GET /api/roadmap` - Fetch personalized learning roadmap
- `POST /api/roadmap/recalculate` - Trigger rule engine recalculation
- `GET /api/analytics` - Student visual analytics dataset
- `GET /api/admin/stats` - Admin overview statistics

---

## 🔮 Future Enhancements

1. AI-assisted explanation generation using Google Gemini API.
2. WebRTC mock peer-to-peer technical video interviews.
3. Automated resume analyzer with ATS keyword scoring.
