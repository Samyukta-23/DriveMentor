# 🚗 DriveMentor – Drive With Confidence, Not Fear

> **From Licensed Driver to Confident Driver**

A premium, hackathon-ready full-stack web application for the Indian market that connects licensed but unconfident drivers with verified local driving mentors.

---

## 🎯 Features

| Feature | Description |
|---|---|
| **Mentor Marketplace** | Filter by city, language, vehicle type, experience, and rating |
| **Booking System** | Date, time slot, and skill-focus selection with Razorpay-style checkout |
| **Driver Dashboard** | Animated Speedometer gauge, Recharts radar chart, weekly goal tracker |
| **AI Feedback Engine** | Local rule-based feedback generation post-session |
| **Progress Tracker** | Recharts line charts tracking confidence growth over time |
| **Achievement Badges** | First Drive, Parking Expert, Traffic Warrior, Highway Hero, Safe Driver |
| **Mentor Dashboard** | Uber-style earnings, pending/upcoming/past session management |
| **Admin Panel** | Platform analytics, mentor verification, city-wise charts |
| **JWT Authentication** | Email + Password login with role-based protected routes |

---

## 🏗️ Architecture

```
drive-mentor/
├── backend/       # Java Spring Boot (Port 8080)
└── frontend/      # React + Vite + Tailwind (Port 5173)
```

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios
- **Backend**: Java 21, Spring Boot 4.x, Spring Security 6, Hibernate, JPA
- **Database**: PostgreSQL
- **Auth**: JWT (HS256, 24hr expiry)

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL (running on port 5432)

### 1. Database Setup
```sql
-- Create the database
CREATE DATABASE drive_mentor;
```
Database tables and seed data are created automatically on first startup.

### 2. Backend Setup
```powershell
cd drive-mentor/backend
.\mvnw spring-boot:run
```
Backend starts on **http://localhost:8080**

### 3. Frontend Setup
```powershell
cd drive-mentor/frontend
npm install
npm run dev
```
Frontend starts on **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Driver** | driver1@drivementor.com | password |
| **Driver** | driver2@drivementor.com | password |
| **Mentor** | mentor1@drivementor.com | password |
| **Mentor** | mentor2@drivementor.com | password |
| **Admin** | admin@drivementor.com | admin123 |

---

## 📊 Seeded Demo Data

Automatically seeded on first startup:
- **1** Admin account
- **20** Driver accounts with varied confidence scores (45–83%)
- **10** Mentor accounts across 10 Indian cities (8 verified, 2 pending)
- **100** Booking sessions (completed, pending, accepted)
- **50+** Feedback records with AI-generated coaching suggestions
- **Historical progress** snapshots for 5 drivers (showing chart growth)
- **Achievement badges** unlocked based on seed stats

---

## 🌆 Supported Cities
Chennai · Coimbatore · Madurai · Bengaluru · Hyderabad · Mumbai · Delhi · Pune · Kochi · Ahmedabad

---

## 🏆 Achievement System

| Badge | Criteria |
|---|---|
| 🏅 First Drive | Complete 1 mentorship session |
| 🛡️ Safe Driver | Confidence Score ≥ 80% |
| 🅿️ Parking Expert | Parking Score ≥ 85% |
| 🚦 Traffic Warrior | Traffic Handling Score ≥ 85% |
| 🛣️ Highway Hero | Highway Driving Score ≥ 85% |

---

## 🔌 API Overview

### Auth
- `POST /api/auth/register` – Register Driver or Mentor
- `POST /api/auth/login` – Login and receive JWT
- `GET /api/auth/me` – Get current user

### Driver
- `GET /api/drivers/dashboard` – Full dashboard data
- `GET /api/drivers/progress` – Historical progress snapshots

### Mentors
- `GET /api/mentors` – Search/filter marketplace
- `GET /api/mentors/dashboard` – Mentor earnings and sessions

### Bookings
- `POST /api/bookings` – Create booking
- `GET /api/bookings/driver` – Driver's booking list
- `PUT /api/bookings/{id}/status` – Accept/Reject/Complete
- `POST /api/bookings/{id}/feedback` – Submit mentor evaluation

### Admin
- `GET /api/admin/analytics` – Platform metrics
- `GET /api/admin/mentors/pending` – Unverified mentors
- `PUT /api/admin/mentors/{id}/verify` – Approve mentor

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Background | `#0F172A` (Deep Navy) |
| Secondary BG | `#111827` (Dark Gray) |
| Accent Blue | `#3B82F6` (Electric Blue) |
| Accent Cyan | `#06B6D4` |
| Success Green | `#22C55E` |
| Typography | Outfit, Inter (Google Fonts) |

**Design patterns**: Glassmorphism cards · Speedometer gauge · Neon glow effects · Framer Motion animations

---

*Built for hackathon demo · Powered by real Spring Boot + PostgreSQL*
