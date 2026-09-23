# SportConnect – Sports Session & Match Management Platform

> **Find Players. Create Matches. Play Together.**

SportConnect is a production-quality, full-stack capstone application designed for campus sports, recreational leagues, and local athletic clubs. It enables users to discover open sports sessions, host matches, join team rosters, prevent double-bookings, and access real-time administrative analytics.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Demo Credentials](#demo-credentials)
- [Local Setup & Installation](#local-setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment Guide (Render & PostgreSQL)](#deployment-guide-render--postgresql)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

---

## Overview

SportConnect solves the common problem of organizing casual and competitive sports games. Players can browse upcoming matches filtered by sport or date, create sessions with capacity limits, and manage their roster. Administrators can dynamically create sports, view platform metrics, and analyze sports popularity and session completion rates using real database reporting.

---

## Features

### Player Features
- **User Authentication & Authorization**: Secure signup, login with JWT tokens, password hashing using bcrypt, and password update.
- **Player Dashboard**: Quick statistics, upcoming match cards, quick action buttons, and active registrations.
- **Create Sports Session**: Host matches by selecting from dynamic sports, specifying date, start time, venue location, and required additional players.
- **Browse & Search Sessions**: Real-time search by venue/sport/creator, dynamic filtering by sport category, date picker, status filter (`OPEN`, `FULL`, `CANCELLED`), and date sorting.
- **Join Session Guard**: Automatic slot deduction, duplicate join prevention, past date/time restriction, and time collision guard (prevents joining two sessions at the exact same time).
- **Session Details Modal**: View complete match metadata, host information, and full participant roster with timestamps.
- **Cancel Session**: Session creators can cancel matches with mandatory cancellation reasons stored in PostgreSQL and displayed to all participants.

### Admin Features
- **Admin Control Center**: Overview metrics covering total sports, total registered users, upcoming/completed/cancelled sessions.
- **Dynamic Sports Management**: Add new sports dynamically, edit sport descriptions, and enforce safe deletion guards (blocks deleting sports with active sessions).
- **Analytics & Reports**: Calculate real database session metrics over configurable time horizons (**Last 7 Days**, **Last 30 Days**, **Last 3 Months**, or **Custom Date Range**).
- **Visual Charts**: Interactive Recharts bar graph for sport popularity and pie/donut chart for session status distribution.
- **Dual Capability**: Admins possess full player privileges to host and participate in match sessions.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite) |
| **Styling & UI** | Tailwind CSS + Custom Glassmorphism Design Tokens |
| **Icons & Visuals** | Lucide React |
| **Analytics Charts** | Recharts |
| **Backend Runtime** | Node.js (ES Modules) |
| **Web Server** | Express.js |
| **Database** | PostgreSQL (Prisma ORM) / SQLite for local testing |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs |
| **Validation** | express-validator + Centralized Middleware |

---

## Architecture

```
                       +-------------------------------+
                       |   React 18 + Vite Frontend    |
                       |  (Axios, Tailwind, Recharts)  |
                       +---------------+---------------+
                                       |
                                HTTP REST API
                                       |
                       +---------------+---------------+
                       |    Express REST API Server    |
                       | (JWT Auth, Role Middleware)   |
                       +---------------+---------------+
                                       |
                                  Prisma ORM
                                       |
                       +---------------+---------------+
                       |   PostgreSQL / SQLite DB      |
                       |  (Normalized Relational Data) |
                       +-------------------------------+
```

---

## Screenshots

Place your captured screenshots inside the `docs/screenshots/` folder:

- `docs/screenshots/login.png` - User Login Screen with preset demo buttons
- `docs/screenshots/dashboard.png` - Player Dashboard with quick action pills and upcoming matches
- `docs/screenshots/create-session.png` - Create Session Form
- `docs/screenshots/sessions.png` - Browse Sessions Directory with search and filters
- `docs/screenshots/admin-reports.png` - Admin Analytics Reports with Recharts graphs

---

## Live Demo

- **Live Frontend**: `[ADD DEPLOYED FRONTEND URL HERE]`
- **Backend API**: `[ADD DEPLOYED BACKEND URL HERE]`

---

## Demo Credentials

> **Note**: These accounts are seeded automatically for immediate evaluation.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin Account** | `admin@sportconnect.com` | `Admin@123` |
| **Player 1 Account** | `player@sportconnect.com` | `Player@123` |
| **Player 2 Account** | `player2@sportconnect.com` | `Player@123` |

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Step 1: Clone Repository
```bash
git clone https://github.com/Akash0716/sport_connect.git
cd sport_connect
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` in the server directory:
```bash
cp server/.env.example server/.env
```

### Step 4: Run Database Migration & Seed
```bash
npm run db:push
npm run db:seed
```

### Step 5: Start Development Application
Run both the React frontend and Express backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Environment Variables

### Root / Server `.env`
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sportconnect?schema=public"
JWT_SECRET=super_secret_sportconnect_jwt_key_change_in_production_2026
JWT_EXPIRES_IN=7d
```

---

## API Documentation

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new player account
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/change-password` - Update account password

### Sports Routes (`/api/sports`)
- `GET /api/sports` - List all dynamic sports
- `POST /api/sports` - Create new sport (Admin Only)
- `PUT /api/sports/:id` - Edit sport details (Admin Only)
- `DELETE /api/sports/:id` - Delete sport if no active sessions exist (Admin Only)

### Sessions Routes (`/api/sessions`)
- `GET /api/sessions` - List sessions with search/filter/sort parameters
- `GET /api/sessions/my-created` - Get sessions created by current user
- `GET /api/sessions/my-joined` - Get sessions joined by current user
- `GET /api/sessions/:id` - Get detailed session metadata & roster
- `POST /api/sessions` - Create new session (validates future date/time)
- `POST /api/sessions/:id/join` - Join session (validates slot capacity & time collision)
- `POST /api/sessions/:id/cancel` - Cancel session with mandatory reason (Creator Only)

### Reports Routes (`/api/reports`)
- `GET /api/reports/stats` - Admin overview count statistics (Admin Only)
- `GET /api/reports/analytics` - Popularity & status breakdown calculations from PostgreSQL (Admin Only)

---

## Deployment Guide (Render & PostgreSQL)

### 1. PostgreSQL Database Setup (Neon / Render Postgres)
1. Provision a PostgreSQL instance on **Neon.tech** or **Render PostgreSQL**.
2. Copy the Connection URI (e.g. `postgresql://user:pass@ep-cool-123.us-east-2.aws.neon.tech/sportconnect?sslmode=require`).

### 2. Backend Web Service (Render)
1. Create a new **Web Service** on Render pointing to `server/`.
2. Set Build Command: `npm install && npx prisma db push && node prisma/seed.js`
3. Set Start Command: `npm start`
4. Environment Variables:
   - `DATABASE_URL`: Your cloud PostgreSQL URL
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: Your deployed frontend URL

### 3. Frontend Static Site (Render / Vercel / Netlify)
1. Create a **Static Site** pointing to `client/`.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Set Environment Variable `VITE_API_URL` to your deployed backend URL (e.g., `https://sportconnect-api.onrender.com/api`).

---

## Testing

Execute the automated backend integration test suite:
```bash
npm test
```
Tests cover:
- Authentication & JWT token validation
- Unauthorized role access blocking
- Admin sport creation & uniqueness
- Past session date rejection
- Session joining, slot deduction, and duplicate join prevention
- Time collision prevention
- Creator session cancellation with reason
- Real PostgreSQL analytics calculation

---

## Future Improvements

1. **In-App & Email Notifications**: Notify participants automatically when a match creator cancels a session.
2. **Weather API Integration**: Display real-time weather forecasts on venue location cards.
3. **Player Skill Rating System**: Allow hosts to set skill levels (Beginner, Intermediate, Advanced) for balanced matches.
