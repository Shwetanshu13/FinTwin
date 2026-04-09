# FinTwin — App Report

Date: 2026-04-09  
Repository: FinTwin  
GitHub: https://github.com/Shwetanshu13/fintwin  
Tagline: **Think Before You Spend.**

---

## 1) Overview

FinTwin is a personal finance application that helps users understand the _future impact_ of their financial decisions.
Unlike classic expense trackers, FinTwin builds a **financial twin** (income, expenses, savings) and runs deterministic simulations to answer questions like:

- “Can I afford this one-time purchase?”
- “What happens if I take this EMI?”
- “How long will my savings last (runway)?”
- “Is this decision safe/risky/not advisable?”

The app supports scenario-style calculations and, optionally, can attach an AI-generated “decision summary” to results.

### About the app

FinTwin helps you determine your financial condition **after you make a spend**—whether a decision is affordable or not—based on your:

- Income list
- Expenses (fixed and variable)
- Savings

It can simulate outcomes such as:

- **Runway** if you lose your income source
- **Savings condition** over time
- Your finances after buying an item as a **one-time purchase** or via **EMI**

---

## 2) What The App Does (User-Facing)

### Core features

- **Authentication**: Register/Login with secure token-based sessions.
- **Financial records CRUD**:
  - Income items
  - Expense items
  - Savings items
- **Calculations (simulation engine)**:
  - Profile calculation
  - Runway calculation
  - Savings calculation
  - One-time purchase simulation
  - EMI purchase simulation
- **User profile management**:
  - View profile
  - Update username/email/fullName/phone

### Key experience design

- Users enter data manually (privacy-first; no bank/SMS permissions).
- Simulation results are computed on demand from stored inputs.
- The app UI is built with a consistent theme and keyboard-friendly form layouts.

---

## 3) High-Level Architecture

FinTwin is a 3-part system:

1. **Mobile App (Expo / React Native)**

- Handles UI, auth, and calls the backend API.
- Stores tokens securely on device.

2. **Backend API (Node.js + Express)**

- Exposes routes for auth, profile, records, and calculations.
- Verifies JWT access tokens for protected routes.

3. **Database + Engine**

- **PostgreSQL** persists user data.
- A deterministic **engine** computes outputs (runway, savings, purchase feasibility, etc.).

Optional:

- **Gemini decision helper** can generate user-friendly summaries to accompany deterministic results.

---

## 4) Tech Stack

### Mobile app

- **Expo** (SDK 54)
- **React Native** 0.81.x
- **React** 19.x
- Token storage: **expo-secure-store**
- UI utilities: safe-area, screens, svg, chart-kit

### Backend

- **Node.js** (ESM)
- **Express** 5.x
- **CORS** enabled
- Auth: **jsonwebtoken**, **bcryptjs**

### Database

- **PostgreSQL**
- ORM: **Drizzle ORM** (+ drizzle-kit)

### Optional AI

- **@google/generative-ai**
- Controlled via backend environment flags

---

## 5) Authentication & Session Flow

### Tokens

- On login/register, the backend returns:
  - `token.accessToken`
  - `token.refreshToken`
  - `userId`
  - `user` object (sanitized; no password hash)

### Client-side behavior

- Access/refresh tokens are persisted in secure storage.
- API requests include `Authorization: Bearer <accessToken>`.
- If the backend returns `401`, the app attempts a token refresh and retries once.

---

## 6) API Surface (Backend)

### Base URL & routing

- The backend supports routes mounted at both:
  - `/<route>` (e.g., `/profile`)
  - `/api/<route>` (e.g., `/api/profile`)

This helps deployments where a proxy/API gateway expects an `/api` prefix.

### Common response shapes

- Success returns JSON objects like `{ user }`, `{ income: [] }`, `{ ...calcResult, decision }`.
- Errors return JSON like `{ error: "SOME_CODE" }`.

### Routes

#### Health

- `GET /` → `{ ok: true, service: "fintwin-backend" }`
- `GET /health` → `{ ok: true }`

#### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me` (requires Bearer token)

#### Profile (requires Bearer token)

- `GET /profile`
- `PATCH /profile`

#### Records (requires Bearer token)

- Income:
  - `GET /records/income`
  - `POST /records/income`
  - `PATCH /records/income/:id`
  - `DELETE /records/income/:id`
- Expenses:
  - `GET /records/expenses`
  - `POST /records/expenses`
  - `PATCH /records/expenses/:id`
  - `DELETE /records/expenses/:id`
- Savings:
  - `GET /records/savings`
  - `POST /records/savings`
  - `PATCH /records/savings/:id`
  - `DELETE /records/savings/:id`

#### Calculations (requires Bearer token)

- `POST /calc/profile`
- `POST /calc/runway`
- `POST /calc/savings`
- `POST /calc/purchase/one-time`
- `POST /calc/purchase/emi`

Notes:

- Calculation routes can optionally include a `decision` object (AI summary). When disabled/unavailable, the backend returns `decision: null`.

---

## 7) App Screen Flow (Mobile)

### Typical user journey

1. **Register** (or Login)
2. Land on **Home**
3. Create and manage:
   - income items
   - expenses items
   - savings items
4. Navigate to **Calculations** to run simulations
5. Navigate to **Profile** to update user details and logout

### Navigation model

- The app uses a simple route state in `App.js` to switch between screens.

---

## 8) Environment Configuration

### Backend env (backend/.env)

Key variables (see `backend/.env.sample`):

- `PORT`
- `DB_URL`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY` / `REFRESH_TOKEN_EXPIRY`
- Gemini optional:
  - `GEMINI_ENABLED`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL`

### Mobile env (app/fintwin/.env)

Key variable:

- `EXPO_PUBLIC_API_BASE_URL`
  - Example local: `http://localhost:3000`
  - Android emulator: `http://10.0.2.2:3000`
  - ngrok example: `https://<id>.ngrok-free.app`

Recommendation:

- When using the backend’s `/api` mount, set:
  - `EXPO_PUBLIC_API_BASE_URL=https://.../api`

---

## 9) Local Setup & Run Steps

### Backend

1. Create `backend/.env` (copy from `.env.sample`)
2. Install deps:
   - `cd backend`
   - `pnpm install`
3. Start server:
   - `pnpm run dev`
4. Ensure Postgres is running and `DB_URL` is correct.

### Mobile app

1. Create `app/fintwin/.env` (copy from `.env.sample`)
2. Install deps:
   - `cd app/fintwin`
   - `npm install` (or your preferred package manager)
3. Run:
   - `npm start`

---

## 10) Postman Testing

A ready-to-import Postman collection exists in this repo:

- `postman/FinTwin.postman_collection.json`

Usage:

1. Import the collection into Postman
2. Set collection variable `baseUrl` (recommended: `http://localhost:3000/api` or `https://<ngrok>/api`)
3. Run **Auth → Login** (or Register)
4. Use Profile/Records/Calculations requests (they use `accessToken` automatically)

---

## 11) Known Limitations / Notes

- If you use ngrok or a reverse proxy, expect higher latency than localhost; profile loading times will reflect network round-trip.
- All engine outputs are computed on request; database stores primarily the user inputs.
- Gemini “decision” summaries are optional and should be treated as explanations, not the source of truth.

---

## 12) Appendix: Build & Release (EAS)

The Expo project includes `eas.json` with build profiles:

- `development` (development client)
- `preview` (internal distribution, Android APK)
- `production` (autoIncrement)

Typical flow:

- Configure once: `eas build:configure`
- Build: `eas build --profile preview --platform android` (example)

---
