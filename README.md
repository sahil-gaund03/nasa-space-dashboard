<div align="center">

# 🛰️ NASA Space Dashboard

### *Mission Control for the Cosmos — Real-Time Space Intelligence, Powered by NASA APIs & AI*

[![Live Demo](https://img.shields.io/badge/▶%20Live%20Demo-nasa--space--dashboard.vercel.app-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white)](https://nasa-space-dashboard.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-sahil--gaund03%2Fnasa--space--dashboard-181717?style=for-the-badge&logo=github)](https://github.com/sahil-gaund03/nasa-space-dashboard)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-22c55e?style=flat-square)

<br/>

> A production-grade, full-stack space intelligence platform integrating live NASA APIs, AI-powered analysis via Google Gemini, real-time ISS tracking, and interactive 3D visualizations — all in a single unified mission control interface.

<br/>

[![](https://img.shields.io/badge/🚀%20Open%20Live%20Demo-nasa--space--dashboard.vercel.app-0ea5e9?style=for-the-badge)](https://nasa-space-dashboard.vercel.app)

</div>

---

## 📡 Product Overview

NASA Space Dashboard is not a weekend side project — it's a **production-deployed, AI-augmented space data platform** built with modern engineering practices at its core.

The problem it solves is real: NASA's open APIs expose a wealth of scientifically significant data — asteroid proximity alerts, solar weather events, Mars rover photography, ISS telemetry — but this data is scattered across incompatible endpoints with no unified consumer-facing interface. This platform unifies those streams into a real-time, visually rich mission control dashboard.

**Who it's built for:**
- Space enthusiasts who want live data, not Wikipedia articles
- Developers and engineers studying NASA API integration patterns
- Recruiters and engineers evaluating full-stack product systems
- Educators building context around astronomy and space science

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔭 **Astronomy Picture of the Day** | Daily NASA APOD with AI-generated summaries (Gemini 2.5 Flash), favorites persistence, and HD image viewer |
| ☄️ **Asteroid Radar** | Live NeoWs feed with hazard classification, proximity scoring, velocity data, and close-approach date tracking |
| 🌌 **ISS Live Tracker** | Real-time International Space Station position via live telemetry, rendered on an interactive 3D Earth globe (Three.js) |
| 🔴 **Mars Rover Gallery** | Perseverance & Curiosity photo feeds by sol and camera type, with AI image analysis via Gemini Vision |
| 🚀 **SpaceX Launch Feed** | Upcoming and historical SpaceX mission data with mission profiles and launch details |
| 🌞 **Space Weather Monitor** | NASA DONKI solar flare classification, Coronal Mass Ejection (CME) tracking, and geomagnetic storm probability |
| 🤖 **AI Space Assistant** | Persistent conversational AI assistant (Gemini) for space Q&A with full chat history stored via PostgreSQL |
| 📊 **Telemetry Grid** | Live mission telemetry dashboard with real-time system metrics and status indicators |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Next.js 15 App Router · React 19 · Tailwind v4 · Three.js      │
│  Zustand Store · Framer Motion · Recharts · shadcn/ui            │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP / SSE
┌────────────────────────▼────────────────────────────────────────┐
│                      API ROUTE LAYER                             │
│   /api/apod   /api/asteroids   /api/mars   /api/iss              │
│   /api/weather   /api/launches   /api/chat   /api/telemetry      │
│                    Next.js Route Handlers                         │
└──────┬──────────────────┬──────────────────┬────────────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼──────────────────┐
│  NASA APIs  │  │  Gemini AI API  │  │  SpaceX REST API        │
│  APOD       │  │  gemini-2.5-    │  │  Launches / Missions    │
│  NeoWs      │  │  flash          │  └────────────────────────┘
│  Mars Rover │  │  APOD Summaries │
│  DONKI      │  │  Image Analysis │
│  ISS TLE    │  │  Chat / Q&A     │
└─────────────┘  └────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  Redis (Upstash)          PostgreSQL (Prisma ORM)               │
│  ├─ API Response Cache    ├─ APOD History & Favorites           │
│  ├─ 1hr / 1day TTLs       ├─ Chat History Persistence          │
│  └─ Rate limit shielding  └─ Mars Photo Cache & AI Analyses    │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. Client requests a resource (e.g., APOD)
2. API route checks Redis cache (fast path, TTL: 1 day)
3. On miss, checks PostgreSQL (persistent fallback)
4. On miss, fetches from NASA API with NextJS `revalidate` caching
5. AI summary generated via Gemini on first load, stored to DB
6. Result cached in Redis; response returned to client

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React Server Components)
- [React 19](https://react.dev/) with latest concurrent features
- [TypeScript 5](https://www.typescriptlang.org/) — strict mode throughout
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) — accessible component primitives
- [Framer Motion](https://www.framer.com/motion/) — production-grade animations
- [Three.js](https://threejs.org/) — 3D WebGL Earth globe for ISS tracking
- [Recharts](https://recharts.org/) — composable data visualization
- [Zustand](https://zustand-demo.pmnd.rs/) — lightweight global state

**Backend & APIs**
- [NASA Open APIs](https://api.nasa.gov/) — APOD, NeoWs, Mars Rover Photos, DONKI
- [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) — AI summaries, image analysis, chat
- [SpaceX REST API](https://github.com/r-spacex/SpaceX-API) — launch data
- [Open Notify ISS API](http://open-notify.org/) — live ISS position
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL — persistent storage
- [Upstash Redis](https://upstash.com/) — serverless caching layer
- [Zod](https://zod.dev/) — runtime schema validation

**Infrastructure**
- [Vercel](https://vercel.com/) — edge deployment, serverless functions
- [Prisma Accelerate / pg adapter](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections) — connection pooling

---

## 🌐 Live Data Sources

| Source | Endpoint | Data | Cache TTL |
|---|---|---|---|
| NASA APOD | `/planetary/apod` | Astronomy Picture of the Day + metadata | 24h |
| NASA NeoWs | `/neo/rest/v1/feed` | Near-Earth asteroid proximity + hazard scores | 2h |
| NASA Mars Rover | `/mars-photos/api/v1/rovers/{rover}/photos` | Perseverance & Curiosity sol imagery | 24h |
| NASA DONKI | `/DONKI/FLR`, `/DONKI/CME` | Solar flares, CME events (7-day window) | 1h |
| SpaceX API | `api.spacexdata.com/v4/launches` | Mission data, launch windows, vehicle info | 1h |
| Open Notify | `api.open-notify.org/iss-now` | Real-time ISS lat/lon + altitude | Live |
| Google Gemini | `generativelanguage.googleapis.com` | AI summaries, image analysis, chat | — |

---

## ⚡ Quick Start

### Prerequisites

- Node.js `>=18`
- PostgreSQL database (local or hosted)
- Upstash Redis account (or local Redis)
- API keys: NASA, Google Gemini

### 1. Clone & Install

```bash
git clone https://github.com/sahil-gaund03/nasa-space-dashboard.git
cd nasa-space-dashboard
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# NASA
NASA_API_KEY=your_nasa_api_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://user:password@host:5432/nasa_dashboard

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

> Get your free NASA API key at [api.nasa.gov](https://api.nasa.gov/)

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to your database
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the dashboard is live.

### 5. Production Build

```bash
npm run build
npm start
```

---

## 🖥️ Usage Guide

Once the dashboard loads, you're presented with a mission control layout:

**Sidebar navigation** routes between modules — APOD, ISS Tracker, Mars Rover, Asteroid Radar, Space Weather, SpaceX Launches, and the AI Assistant.

**APOD Module** — today's astronomy image loads automatically with an AI-generated Sagan-style summary. Use the date picker to browse historical entries. Heart any image to save it to your favorites.

**ISS Tracker** — the 3D globe renders the ISS's current position in real time. Lat/lon coordinates and altitude update on a live feed.

**Asteroid Radar** — today's near-Earth object list is sorted by closest approach distance. High-hazard asteroids are flagged in red with velocity and miss-distance data.

**Space Weather** — the last 7 days of solar flares are listed by classification (A/B/C/M/X). CME events display ejection speed and angular spread.

**AI Assistant** — type any space question. The assistant has context about current dashboard data and maintains conversation history across sessions.

---

## 🖼️ UI Preview

| Dashboard Overview | ISS Globe Tracker |
|---|---|
| ![Hero Dashboard](public/assets/earth-hero.jpg) | *(3D WebGL Globe)* |

| Mars Rover Gallery | APOD Viewer |
|---|---|
| ![Mars Surface](public/assets/mars-1.jpg) | ![APOD](public/assets/apod.jpg) |

> 📸 Full screenshot gallery and demo video at [nasa-space-dashboard.vercel.app](https://nasa-space-dashboard.vercel.app)

---

## 🚀 Performance & Optimization

**Multi-Layer Caching Architecture**

The platform implements a three-tier cache to minimize NASA API rate limit exposure and maximize response speed:

- **Redis (Upstash)** — hot cache for all active API responses with endpoint-specific TTLs (1h space weather → 24h APOD)
- **PostgreSQL** — cold cache and permanent store for APOD history, Mars photos, AI-generated summaries, and chat logs
- **Next.js `revalidate`** — CDN-level HTTP caching with incremental static regeneration per endpoint

**Frontend Performance**
- React Server Components for zero-JS server-rendered content where applicable
- Turbopack for sub-second HMR in development
- Lazy loading for heavy components (3D Globe, image galleries)
- `next/image` with automatic WebP conversion and responsive sizes
- Framer Motion animations scoped to GPU-composited layers only

**AI Cost Optimization**
- Gemini summaries generated once per APOD, stored to DB — never re-generated for the same date
- Mars photo AI analysis results cached per `rover/sol/camera` key
- Chat history persisted to PostgreSQL, reducing context re-processing overhead

---

## 🛣️ Roadmap

Planned enhancements in priority order:

- [ ] **Real-time ISS crew manifest** — display current crew names, nationalities, and mission duration
- [ ] **Asteroid alert system** — push notifications for high-hazard NEOs crossing configurable distance thresholds
- [ ] **3D solar system orrery** — interactive Three.js visualization of planetary positions and asteroid orbits
- [ ] **Exoplanet archive integration** — NASA Exoplanet Archive API for confirmed planets and host star data
- [ ] **EPIC Earth imagery** — DSCOVR satellite daily full-disc Earth photos
- [ ] **Mission timeline explorer** — chronological browser of all NASA missions from Mercury to Artemis
- [ ] **AI-powered space news digest** — Gemini-summarized daily briefing from NASA, ESA, and SpaceX news feeds
- [ ] **Multi-rover comparison view** — side-by-side Curiosity vs. Perseverance data panels
- [ ] **User authentication** — Clerk/NextAuth login with persistent favorites and alert preferences

---

## 🤝 Contributing

Contributions are welcome and appreciated. This project follows a standard fork-based workflow.

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/nasa-space-dashboard.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git commit -m "feat: describe your change clearly"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request against main
```

Please ensure your PR includes a clear description of the problem solved, any new environment variables required, and passing `npm run lint` output.

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

NASA imagery and data are in the public domain per [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).

---

## 👤 Author

**Sahil Gaund**

[![GitHub](https://img.shields.io/badge/GitHub-sahil--gaund03-181717?style=flat-square&logo=github)](https://github.com/sahil-gaund03)
[![Live Project](https://img.shields.io/badge/Live-nasa--space--dashboard.vercel.app-0ea5e9?style=flat-square&logo=vercel)](https://nasa-space-dashboard.vercel.app)

---

<div align="center">

*Built with curiosity, caffeine, and a deep appreciation for the cosmos.*

**⭐ Star this repository if it helped you — it means a lot.**

</div>
