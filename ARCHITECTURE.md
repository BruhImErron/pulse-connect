# PulseConnect Architecture - Real Data Integration

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐                                        │
│  │   React Frontend     │                                        │
│  │  (Vite + TypeScript) │                                        │
│  └──────────────────────┘                                        │
│           │                                                       │
│  ┌────────▼─────────────────────────────────────────────────┐   │
│  │            Page Components                               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • NgoMap        → Interactive Satellite Map             │   │
│  │ • Dashboard     → Real Impact Statistics               │   │
│  │ • Advisor       → AI Chat Interface                    │   │
│  │ • Feed          → Real Posts (future)                  │   │
│  └────────┬─────────────────────────────────────────────────┘   │
│           │                                                       │
│  ┌────────▼──────────────────────┐                              │
│  │   API Client (lib/api.ts)     │                              │
│  │  • Type-safe requests         │                              │
│  │  • Token management           │                              │
│  │  • Error handling             │                              │
│  └────────┬──────────────────────┘                              │
│           │                                                       │
│           └─────────────────────────────────────────────────┐   │
└─────────────────────────────────────────────────────────────┼───┘
                                                              │
                                        ┌─────────────────────┘
                                        │HTTP/HTTPS
                                        │
┌───────────────────────────────────────▼───────────────────────┐
│                   BACKEND SERVER                              │
│                  (Node.js + Express)                          │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │            API ROUTES                                   │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ POST   /auth/register          Auth Management         │  │
│  │ POST   /auth/login                                     │  │
│  │ GET    /auth/me                                        │  │
│  │                                                         │  │
│  │ POST   /advisor                 AI Integration        │  │
│  │ GET    /advisor/status          Provider Status        │  │
│  │                                                         │  │
│  │ GET    /ngos?lat=X&lon=Y        Real NGO Data         │  │
│  │ POST   /ngos/:id/apply          (Geolocation)         │  │
│  │                                                         │  │
│  │ GET    /impact                  User Statistics        │  │
│  │ GET    /notifications           Real Notifications     │  │
│  │ GET    /posts                   Real Posts (future)    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼──────────────────────────────────────┐ │
│  │           AI PROVIDER LAYER                              │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  aiProvider.ts: Multi-Provider with Fallback           │ │
│  │  ┌──────────────┐    ┌──────────┐    ┌────────────┐   │ │
│  │  │ Ollama Local │──▶│   Groq   │──▶│ Together.ai│   │ │
│  │  │ (Primary)    │    │(Secondary)    │ (Tertiary) │   │ │
│  │  └──────────────┘    └──────────┘    └────────────┘   │ │
│  │                                                           │ │
│  │  Config: aiConfig.ts (models, timeouts, API keys)      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                       │                                         │
│  ┌────────────────────▼──────────────────────────────────────┐ │
│  │            DATABASE LAYER                               │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │         Prisma ORM + SQLite                            │ │
│  │  ┌──────────────┐    ┌──────────┐    ┌────────────┐   │ │
│  │  │ User Model   │    │ NGO      │    │ Impact     │   │ │
│  │  ├──────────────┤    │ ├────────┤    │ ├─────────┤   │ │
│  │  │ • Email      │    │ │• Name  │    │ │• Hours  │   │ │
│  │  │ • Password   │    │ │• Location    │ │• Donated │   │ │
│  │  │ • Profile    │    │ │• Score │    │ │• Level  │   │ │
│  │  │ • Stats      │    │ │• Tags  │    │ │• XP     │   │ │
│  │  │ • Posts      │    │ │• Lat/Lng    │ │• Streak │   │ │
│  │  │ • Applications    │ │• Relation    │ │• Carbon │   │ │
│  │  └──────────────┘    │ │to Posts     │ └────────────┘ │ │
│  │                      │ │& Donations  │               │ │
│  │  ┌──────────────┐    │ └──────────┘    ┌────────────┐ │ │
│  │  │ Post Model   │    │                 │ Notification    │ │
│  │  ├──────────────┤    │ ┌──────────┐    │ ├─────────┤ │ │
│  │  │• Content     │    │ │Volunteer │    │ │• Title  │ │ │
│  │  │• Author      │    │ │Hour      │    │ │• Message │ │ │
│  │  │• Likes       │    │ │├────────┤    │ │• Type   │ │ │
│  │  │• Comments    │    │ │• Hours  │    │ │• Read   │ │ │
│  │  │• Created     │    │ │• Date   │    │ │• User   │ │ │
│  │  └──────────────┘    │ │• Desc   │    │ └────────────┘ │ │
│  │                      │ └────────┘    │               │ │
│  │                      │                │               │ │
│  │                      │ Like Model     │ Donation    │ │
│  │                      └──────────┘     │ Model       │ │
│  │                                       └──────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┬────────────────┐
         │             │             │                │
         ▼             ▼             ▼                ▼
    ┌────────┐  ┌─────────────┐ ┌────────┐  ┌──────────────┐
    │ Ollama │  │ Groq Cloud  │ │Together│  │ Other APIs   │
    │ Local  │  │ API         │ │.ai     │  │ (future)     │
    └────────┘  └─────────────┘ └────────┘  └──────────────┘
```

## Data Flow Examples

### 1. NGO Map Feature
```
User Opens NgoMap
    ↓
Browser requests geolocation
    ↓
User approves (lat, lon received)
    ↓
Frontend calls: GET /ngos?lat=40.71&lon=-74.01
    ↓
Backend:
  ├─ Fetch all NGOs from database
  ├─ Calculate distance using Haversine formula
  ├─ Calculate match score (NGO score + user application bonus)
  └─ Return array of NGOs with distances
    ↓
Frontend receives NGO data array
    ↓
InteractiveMap component renders:
  ├─ Leaflet map with satellite imagery
  ├─ Markers for each NGO with scores
  ├─ Sidebar with searchable list
  └─ Click handlers for selection
    ↓
User sees interactive satellite map with NGOs near them
```

### 2. AI Advisor Feature
```
User types question
    ↓
Frontend calls: POST /advisor { message: "..." }
    ↓
Backend builds context:
  ├─ User profile (name, role, location, level)
  ├─ Impact stats (hours, donations, NGOs)
  ├─ Recent volunteer hours
  ├─ Recent posts
  └─ NGO applications
    ↓
Backend tries AI providers in order:
  ├─ Try 1: Ollama (http://localhost:11434)
  │         Response: Model uses user context for personalized advice
  │
  ├─ Try 2: Groq Cloud (if local fails & configured)
  │         Response: Cloud API for faster/higher quality responses
  │
  └─ Try 3: Together.ai (if all else fails & configured)
            Response: Fallback provider
    ↓
Backend returns { reply: "AI response..." }
    ↓
Frontend displays response in chat interface
    ↓
User sees contextual AI advice based on their real profile
```

### 3. Dashboard Feature
```
User navigates to Dashboard
    ↓
Frontend makes parallel requests:
  ├─ GET /impact → Impact statistics
  ├─ GET /notifications → Recent notifications
  └─ GET /auth/me → User profile
    ↓
Backend fetches from database:
  ├─ Sum volunteer hours
  ├─ Count NGOs applied to
  ├─ Sum donations and XP
  ├─ Calculate level
  ├─ Fetch recent notifications
  └─ Get user details
    ↓
Frontend receives data and updates state
    ↓
Dashboard renders with real data:
  ├─ KPI cards with actual numbers
  ├─ Personalized greeting (actual username)
  ├─ Real notification list
  ├─ Real statistics
  └─ Animated counters showing real progress
    ↓
User sees their actual impact and progress
```

## Database Schema Relationships

```
User (1)
├── (1:N) Posts
├── (1:N) Likes
├── (1:N) Donations → (N:1) NGO
├── (1:N) VolunteerHours → (N:1) NGO
├── (1:N) NgoApplications → (N:1) NGO
└── (1:N) Notifications

NGO (1)
├── (N:1) ← Donations from User
├── (N:1) ← VolunteerHours from User
└── (N:1) ← NgoApplications from User

Post (1)
├── (N:1) Author → User
└── (1:N) Likes ← User
```

## Component Hierarchy

```
App
├── AuthContext
├── DashboardLayout
│   ├── AppSidebar
│   ├── NavLink (multiple)
│   ├── ThemeToggle
│   ├── CustomCursor
│   └── Children (Pages)
│
├── Pages
│   ├── Advisor
│   │   ├── Query: advisor.ask(message)
│   │   └── InteractiveMap (future: show matching NGOs)
│   │
│   ├── NgoMap
│   │   ├── useQuery: ngos.list(lat, lon)
│   │   ├── useMutation: ngos.apply()
│   │   ├── InteractiveMap
│   │   └── Sidebar with search
│   │
│   ├── Dashboard
│   │   ├── useQuery: impact.get()
│   │   ├── useQuery: notifications.list()
│   │   └── KPI Cards with real data
│   │
│   └── Feed (etc.)
│
└── UI Components (shadcn)
    ├── Card, Button, Input
    ├── Dialog, Popover, Sheet
    └── Table, Form, etc.
```

## Configuration & Deployment

### Development
- **Frontend**: Vite on localhost:5173
- **Backend**: Express on localhost:3001
- **Database**: SQLite (dev.db)
- **AI**: Ollama on localhost:11434 (local development)

### Production
- **Frontend**: Build to static files, serve via CDN
- **Backend**: Deploy Node.js server to cloud (Vercel, Railway, Heroku)
- **Database**: Migrate to PostgreSQL or MongoDB
- **AI**: Use cloud providers (Groq, Together.ai) for scalability

## Security Considerations

✅ Implemented:
- Token-based JWT authentication
- Password hashing with bcryptjs
- Rate limiting on auth endpoints
- Helmet security headers
- CORS configuration
- Input validation with express-validator
- SQL injection prevention (Prisma ORM)

⚠️ To Implement:
- HTTPS only in production
- API key rotation
- Audit logging
- Data encryption at rest
- DDoS protection

## Performance Optimizations

✅ Implemented:
- React Query for caching
- Lazy component loading
- Async data fetching
- Geolocation caching

🔜 To Implement:
- Pagination for large datasets
- Image optimization
- Database indexing on coordinates
- Redis caching for frequently accessed data
- CDN for static assets
