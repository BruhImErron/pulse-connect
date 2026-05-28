# ✅ Setup Verification Checklist

Use this checklist to verify that all parts of the PulseConnect real-data integration are working correctly.

## Pre-Setup (Before Running Anything)

### System Requirements
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v8+ installed (`npm --version`)
- [ ] Git installed (for version control)
- [ ] ~2GB free disk space (for dependencies + data)

### Ollama Installation
- [ ] Ollama downloaded from https://ollama.ai
- [ ] Ollama installed on your system
- [ ] Ollama can run (`ollama --version`)

---

## Installation Phase

### Backend Setup
- [ ] Navigated to `server` directory
- [ ] Ran `npm install` without errors
- [ ] `node_modules` folder created
- [ ] `package-lock.json` created

### Frontend Setup
- [ ] Returned to root directory
- [ ] Ran `npm install` without errors
- [ ] `node_modules` folder created
- [ ] `package-lock.json` created

### Environment Configuration
- [ ] Created `server/.env` file
- [ ] Set `DATABASE_URL="file:./dev.db"`
- [ ] Set `OLLAMA_URL="http://localhost:11434"`
- [ ] Set `PORT=3001`
- [ ] Set `AI_MODEL_STRATEGY="fallback"`
- [ ] Set `NODE_ENV="development"`

---

## Ollama Setup

### Ollama Service
- [ ] Opened terminal/PowerShell
- [ ] Ran `ollama serve`
- [ ] Saw message: "Listening on 127.0.0.1:11434"
- [ ] Left terminal running (Don't close!)

### Ollama Model
- [ ] Opened new terminal/PowerShell
- [ ] Ran `ollama pull llama3.2`
- [ ] Saw download progress and completion
- [ ] Model file downloaded (~5GB, may take time)

### Ollama Verification
- [ ] In same terminal, ran `curl http://localhost:11434/api/tags`
- [ ] Got JSON response with llama3.2 listed
- [ ] Ollama connection works ✅

---

## Database Setup

### Database Initialization
- [ ] In `server` directory
- [ ] Ran `npm run db:push`
- [ ] Saw: "Prisma schema has been successfully created"
- [ ] No errors in output

### Optional: Seed Data
- [ ] Ran `npm run db:seed` (optional)
- [ ] Saw sample data creation messages
- [ ] Has test data to work with

### Verification
- [ ] Ran `npm run db:studio`
- [ ] Prisma Studio opened in browser
- [ ] Can see database tables
- [ ] Close Prisma Studio (`Ctrl+C`)

---

## Backend Server Startup

### Starting Backend
- [ ] In `server` directory
- [ ] Ran `npm run dev`
- [ ] Saw: "Server running on port 3001"
- [ ] No errors in output
- [ ] Left terminal running

### Backend Verification
- [ ] Opened new terminal/PowerShell
- [ ] Ran: `curl http://localhost:3001/advisor/status`
- [ ] Got JSON response with available providers
- [ ] Backend is working ✅

---

## Frontend Startup

### Starting Frontend
- [ ] In root directory (NOT server)
- [ ] Ran `npm run dev`
- [ ] Saw: "VITE v5.x.x Ready in xxx ms"
- [ ] Saw: "➜ Local: http://localhost:5173"
- [ ] Left terminal running

### Frontend Verification
- [ ] Opened browser to http://localhost:5173
- [ ] Website loaded without errors
- [ ] Saw PulseConnect UI
- [ ] No red errors in browser console

---

## Feature Testing - NGO Map

### Map Page Access
- [ ] Clicked on "NGO Map" in navigation
- [ ] Page loaded successfully
- [ ] Sidebar appeared with NGO list

### Geolocation
- [ ] Browser asked for location permission
- [ ] Clicked "Allow"
- [ ] Saw "Loading map..." message
- [ ] Map loaded with satellite imagery

### Map Features
- [ ] NGO markers visible on map
- [ ] Each marker shows a match score (number)
- [ ] Can click markers
- [ ] Clicking marker highlights it in sidebar
- [ ] Selected NGO details show on right

### Search & Filter
- [ ] Typed in search box (e.g., "health")
- [ ] NGO list filtered in real-time
- [ ] Map updated to show only matching NGOs
- [ ] Tags are displayed for each NGO

### Apply to Volunteer
- [ ] Selected an NGO from list
- [ ] Clicked "Apply to Volunteer" button
- [ ] No errors appeared
- [ ] Button changed to "Already Applied" (optional state)

---

## Feature Testing - AI Advisor

### Advisor Page Access
- [ ] Clicked on "Advisor" in navigation
- [ ] Page loaded successfully
- [ ] Saw AI Health Advisor title
- [ ] Status showed "Online"

### Suggested Prompts
- [ ] Saw 6 suggested prompt buttons
- [ ] Can click on any suggestion
- [ ] Message appeared in chat
- [ ] "Advisor is typing..." animation showed

### AI Response
- [ ] AI response appeared after 2-10 seconds
- [ ] Response was contextual (mentioned user profile/activity)
- [ ] No errors in browser console
- [ ] Response was readable and helpful

### Custom Question
- [ ] Typed a custom question in input field
- [ ] Pressed Enter or clicked Send
- [ ] Message appeared in chat
- [ ] AI response came back
- [ ] Response was different from hardcoded ones

### Provider Status
- [ ] In terminal running backend, check logs
- [ ] Should see: "AI response generated using ollama"
- [ ] Confirms Ollama provider was used ✅

---

## Feature Testing - Dashboard

### Dashboard Page Access
- [ ] Clicked on "Dashboard" in navigation
- [ ] Page loaded successfully
- [ ] No loading spinner visible

### Real Data Display
- [ ] Your username appears in greeting (not "Alex")
- [ ] KPI cards show numbers (not all zeros ideally)
- [ ] "Hours Logged" has a value
- [ ] "NGOs Joined" has a value
- [ ] "Level" and "XP Points" displayed

### Animated Counters
- [ ] KPI numbers animate from 0 to value
- [ ] Animation is smooth
- [ ] Takes about 1 second to complete

### Real Notifications
- [ ] Scroll down to see notification list
- [ ] Notifications loaded from database
- [ ] Each shows title, message, date
- [ ] Not seeing hardcoded dummy data

### Charts & Graphics
- [ ] NGO Match Analysis chart displays
- [ ] Top Match section shows progress bars
- [ ] Profile Completion circle animates

---

## Error Diagnostics

### Check Browser Console (F12)
- [ ] No red error messages
- [ ] Network activity shows successful API calls (200, 201 status)
- [ ] No CORS errors
- [ ] No "undefined" errors

### Check Backend Terminal
- [ ] No error messages in logs
- [ ] Requests show as "GET /..." lines
- [ ] AI request shows successful response
- [ ] Database queries complete without errors

### Check Network Requests (DevTools → Network)
- [ ] requests to `http://localhost:3001/api/*`
- [ ] Status codes are 200 (success)
- [ ] Response contains expected data (JSON)
- [ ] No 404 (not found) errors
- [ ] No 500 (server error) responses

---

## Optional: Cloud AI Configuration

### Groq Setup (Optional)
- [ ] Registered at https://console.groq.com
- [ ] Got API key
- [ ] Added `GROQ_API_KEY="..."` to `.env`
- [ ] Restarted backend
- [ ] Can see "groq" in `/advisor/status`

### Together.ai Setup (Optional)
- [ ] Registered at https://together.ai
- [ ] Got API key
- [ ] Added `TOGETHER_API_KEY="..."` to `.env`
- [ ] Restarted backend
- [ ] Can see "together" in `/advisor/status`

### Fallback Testing
- [ ] Stop Ollama service
- [ ] Ask AI advisor a question
- [ ] Should fallback to Groq or Together
- [ ] Response still works (cloud provider)
- [ ] Restart Ollama for normal operation

---

## Performance Testing

### Map Performance
- [ ] Map tiles load within 2 seconds
- [ ] Can pan/zoom smoothly
- [ ] No lag when clicking markers
- [ ] Search updates instantly (<100ms)

### AI Performance
- [ ] First response takes 3-10 seconds
- [ ] Updated responses faster (maybe 5-8s)
- [ ] No timeouts (should complete or show error)

### Dashboard Performance
- [ ] Dashboard loads completely within 2 seconds
- [ ] All KPIs animate smoothly
- [ ] No lag when scrolling
- [ ] Chart renders without freezing

---

## Final Verification

### All Pages Accessible
- [ ] Dashboard works
- [ ] NGO Map works
- [ ] AI Advisor works
- [ ] Feed loads
- [ ] Other pages accessible

### No Console Errors
- [ ] Opened DevTools (F12)
- [ ] Went through each page
- [ ] Console shows no red error messages
- [ ] Only informational logs visible

### Database Connected
- [ ] Ran `npm run db:studio` in server
- [ ] Connected to database successfully
- [ ] Can see User, NGO, Post tables
- [ ] Has some or all sample data
- [ ] Closed without issues

### Backend Healthy
- [ ] Terminal shows active requests
- [ ] `/advisor/status` returns valid JSON
- [ ] No "localhost:3001" connection refused errors
- [ ] Process still running after 5+ minutes

### Frontend Healthy
- [ ] No blank screens
- [ ] UI elements render properly
- [ ] Navigation works
- [ ] Can navigate between pages
- [ ] No infinite loading spinners

---

## Success Indicators ✅

You've successfully implemented real data integration if:

1. **Map Works**: 
   - [ ] Satellite map loads
   - [ ] NGOs show with real database data
   - [ ] Distance calculations work

2. **AI Works**:
   - [ ] Advisor responds with context-aware advice
   - [ ] Uses your actual profile data
   - [ ] Shows which provider is being used

3. **Dashboard Works**:
   - [ ] Shows your real username
   - [ ] Displays actual statistics
   - [ ] Real notifications appear
   - [ ] Data comes from database

4. **API Connected**:
   - [ ] All requests return real data
   - [ ] No hardcoded mock data visible
   - [ ] Database contains actual information

5. **Performance**:
   - [ ] Pages load in <3 seconds
   - [ ] AI responds in <15 seconds
   - [ ] No console errors
   - [ ] Smooth interactions

---

## Troubleshooting Paths

### If NGO Map Doesn't Load
1. [ ] Check if `/ngos` endpoint returns data: `curl http://localhost:3001/api/ngos -H "Authorization: Bearer xxx"`
2. [ ] Check browser allows geolocation
3. [ ] Check Leaflet CSS loaded (DevTools → Network)
4. [ ] Check map component rendered (DevTools → Elements)

### If AI Advisor Doesn't Work
1. [ ] Check if Ollama is running: `curl http://localhost:11434/api/tags`
2. [ ] Check if model is available: `ollama list`
3. [ ] Check `/advisor/status` endpoint
4. [ ] Check backend logs for error message

### If Dashboard Data Missing
1. [ ] Check if database has data: Run `npm run db:studio`
2. [ ] Check if `/impact` endpoint works: `curl http://localhost:3001/api/impact -H "Authorization: Bearer xxx"`
3. [ ] Check if user is authenticated
4. [ ] Check browser Network tab for failed requests

### If Getting CORS Errors
1. [ ] Verify frontend URL is `http://localhost:5173`
2. [ ] Verify backend URL is `http://localhost:3001`
3. [ ] Check CORS configuration in `server/src/index.ts`
4. [ ] Restart backend server

---

## When Everything is Working ✨

All tests pass? Congratulations! You have:

✅ Real AI-powered advisor with Llama 3.2
✅ Interactive satellite map with geolocation
✅ Real database integration for NGOs and users
✅ Personalized dashboard with real statistics
✅ Type-safe, modern API architecture
✅ Multi-provider fallback system
✅ Production-ready error handling

**You're ready to**:
1. Deploy to production
2. Add real user data
3. Implement more features
4. Scale the application

---

## Next Steps After Verification

- [ ] Read REAL_DATA_SETUP.md for detailed configs
- [ ] Read ARCHITECTURE.md to understand the system
- [ ] Review IMPLEMENTATION_SUMMARY.md for what was added
- [ ] Consider cloud AI provider setup for production
- [ ] Plan Phase 2 features (real posts, events, etc.)
- [ ] Set up database backups
- [ ] Begin production deployment planning

---

**Last Verified**: [Date/Time]
**System Status**: ✅ Ready for Development/Production
