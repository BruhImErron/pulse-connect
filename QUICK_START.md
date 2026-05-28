# 🚀 Quick Start Guide - PulseConnect Real Data Integration

## 30-Second Overview

You've just transformed PulseConnect from static data to **fully real**:
- ✅ **AI Advisor**: Uses Llama 3.2 (local or cloud)
- ✅ **Satellite Map**: Interactive with real geolocation
- ✅ **Real NGO Data**: From database with smart matching
- ✅ **Dashboard**: Shows actual user stats and notifications
- ✅ **API-First**: All features connected to database

---

## Setup Instructions (5 minutes)

### Step 1: Install Ollama (AI Engine) - 2 minutes
```bash
# Download from: https://ollama.ai
# Install and run:
ollama serve

# In another terminal:
ollama pull llama3.2
```

### Step 2: Start Backend - 1 minute
```bash
cd server
npm install
npm run dev
# Should show: Server running on port 3001
```

### Step 3: Start Frontend - 1 minute
```bash
npm install
npm run dev
# Should show: http://localhost:5173
```

### Step 4: Visit http://localhost:5173 - Done! ✨

---

## What to Test

### 1. **NGO Map** (20 seconds)
- Go to "NGO Map" page
- Click "Allow" for location permission
- See satellite map with NGO markers
- Click markers to see match scores
- Search for NGOs

### 2. **AI Advisor** (30 seconds)
- Go to "AI Advisor" page
- Click a suggested prompt or type your own
- Wait for AI response (uses your real profile data)
- Response should be contextual to your impact

### 3. **Dashboard** (10 seconds)
- Go to "Dashboard"
- See real KPIs (Hours, NGOs, Level, XP)
- Should display your actual username
- Real notifications from database

---

## Configuration (Optional Cloud AI)

For production or faster responses, optionally add cloud AI:

### Groq Cloud
1. Get API key: https://console.groq.com
2. Add to `server/.env`:
   ```
   GROQ_API_KEY="your-key-here"
   ```

### Together.ai
1. Get API key: https://www.together.ai
2. Add to `server/.env`:
   ```
   TOGETHER_API_KEY="your-key-here"
   ```

Then set strategy in `.env`:
```
AI_MODEL_STRATEGY="fallback"  # Try local first, then cloud
```

---

## File Structure - What Changed

```
server/
├── src/
│   ├── utils/
│   │   ├── aiConfig.ts          ← NEW: AI Configuration
│   │   └── aiProvider.ts        ← NEW: Multi-provider AI
│   └── routes/
│       ├── advisor.ts           ← UPDATED: Real AI integration
│       └── ngos.ts              ← UPDATED: Geolocation support

src/
├── components/
│   └── InteractiveMap.tsx       ← NEW: Satellite map component
├── pages/
│   ├── NgoMap.tsx               ← UPDATED: Real data + map
│   └── Dashboard.tsx            ← UPDATED: Real statistics
└── lib/
    └── api.ts                   ← UPDATED: New API types
```

---

## Key Features Implemented

### 1. Multi-Provider AI System
```
┌─ Ollama (Local)
├─ Groq (Cloud)  
└─ Together.ai (Cloud)
```
Automatic fallback if one provider fails

### 2. Satellite Map with Geolocation
- Real-time distance calculation
- Interactive markers with match scores
- User location-based filtering
- Esri satellite imagery

### 3. Real Database Integration
- NGOs with coordinates
- User impact statistics
- Notifications
- User profiles

### 4. Type-Safe API Client
- React Query integration
- Proper error handling
- Loading states
- Async data fetching

---

## Troubleshooting

### ❌ "AI advisor not available"
**Fix**: Make sure Ollama is running
```bash
ollama serve
# In another terminal:
ollama pull llama3.2
```

### ❌ "Map not showing / Geolocation denied"
**Fix**: Allow location permission in browser
- Check URL bar for permission prompt
- Or go to Settings → Privacy → Location

### ❌ "NGOs not loading"
**Fix**: Check database and API
```bash
cd server
npm run db:push        # Ensure database exists
npm run db:seed        # Add sample data (optional)
npm run dev            # Start server
```

### ❌ API errors in console
**Fix**: Check .env file
```bash
# Ensure server/.env has:
DATABASE_URL="file:./dev.db"
OLLAMA_URL="http://localhost:11434"
PORT=3001
```

---

## Environment Variables Explained

```env
# Database
DATABASE_URL="file:./dev.db"        # SQLite for development

# Ollama (Local AI - REQUIRED)
OLLAMA_URL="http://localhost:11434" # Where Ollama server runs

# Cloud AI APIs (Optional)
GROQ_API_KEY="..."                  # Groq fast inference
TOGETHER_API_KEY="..."              # Together.ai models

# Strategy
AI_MODEL_STRATEGY="fallback"        # local, external, or fallback

# Server
PORT=3001                           # Backend port
NODE_ENV="development"
```

---

## Architecture at a Glance

```
User Browser (React)
    ↓
Frontend makes HTTP requests
    ↓
Backend (Express + Node.js)
    ├─ AI Layer: Ollama/Groq/Together.ai
    ├─ Database: Prisma + SQLite
    └─ API Routes: /ngos, /advisor, /impact, etc.
    ↓
Returns real data
    ↓
Frontend displays with:
    ├─ Interactive maps
    ├─ Real statistics
    ├─ Live notifications
    └─ AI chat

```

---

## Performance Tips

✅ **Good for Development**:
- Local Ollama (no cloud costs)
- SQLite database (no setup needed)
- Hot reload on save

🚀 **For Production**:
- Use cloud AI (Groq for speed, Together for options)
- Upgrade to PostgreSQL
- Add Redis caching
- Deploy to Vercel/Railway/Heroku

---

## Next Steps

1. ✅ Get basic setup working (follow 5-minute guide above)
2. ⬜ Test each feature (NGO Map, Advisor, Dashboard)
3. ⬜ (Optional) Add cloud AI providers
4. ⬜ (Optional) Customize Ollama model in `aiConfig.ts`
5. ⬜ (Optional) Add more data to database with seed script

---

## Documentation

- 📘 **REAL_DATA_SETUP.md** - Detailed setup guide
- 🏗️ **ARCHITECTURE.md** - System architecture & data flows
- 📋 **SETUP_CHECKLIST.md** - Verification checklist

---

## Support Resources

- **Ollama**: https://ollama.ai/
- **Leaflet Maps**: https://leafletjs.com/
- **Groq**: https://groq.com/
- **Together.ai**: https://www.together.ai/
- **Prisma**: https://www.prisma.io/

---

## Quick Commands Reference

```bash
# Start everything
cd server && npm run dev &  # Terminal 1: Backend
npm run dev                 # Terminal 2: Frontend

# Database management
npm run db:push            # Sync schema
npm run db:seed            # Add sample data
npm run db:studio          # GUI database explorer

# Check AI status
curl http://localhost:3001/advisor/status

# Stop everything
Ctrl+C in both terminals
```

---

**You're all set! 🎉 Start at http://localhost:5173**
