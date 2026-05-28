# PulseConnect - Real Data & AI Integration Setup Guide

This document outlines all the new integrations and real-data features implemented in PulseConnect.

## 🎯 What's New

### 1. **Llama AI Advisor with Multiple Provider Support**
   - Local: Ollama with llama3.2 model
   - Cloud: Groq AI API support
   - Cloud: Together.ai API support
   - Automatic fallback to next provider if one fails

### 2. **Interactive Satellite Map**
   - Real-time geolocation support
   - Satellite imagery via Esri/ArcGIS
   - Interactive markers with match scores
   - Distance calculation from user location

### 3. **Real API Data Integration**
   - NGOs fetched from database with geolocation
   - Impact statistics from real user data
   - Notifications from database
   - Real user authentication

## 📋 Configuration Guide

### Environment Variables

Create a `.env` file in the server directory with:

```plaintext
# Database
DATABASE_URL="file:./dev.db"

# Ollama Configuration (Local AI)
OLLAMA_URL="http://localhost:11434"

# Groq API Configuration (Optional)
GROQ_API_KEY="your-groq-api-key"

# Together.ai Configuration (Optional)
TOGETHER_API_KEY="your-together-api-key"

# AI Strategy: "local", "external", or "fallback"
AI_MODEL_STRATEGY="fallback"

# Server Port
PORT=3001
```

## 🚀 Getting Started

### 1. **Setup Local Ollama (Recommended for Development)**

If using Ollama locally:

```bash
# Install Ollama from https://ollama.ai
# Start Ollama service
ollama serve

# In another terminal, pull llama3.2
ollama pull llama3.2

# Verify it's running
curl http://localhost:11434/api/tags
```

### 2. **Setup Cloud AI Providers (Optional)**

#### Groq Cloud API
```bash
# Get API key from https://console.groq.com
# Add to .env:
GROQ_API_KEY="gsk_..."
```

#### Together.ai
```bash
# Get API key from https://www.together.ai
# Add to .env:
TOGETHER_API_KEY="..."
```

### 3. **Database Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed sample data (optional)
npm run db:seed
```

### 4. **Start Development Server**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 📍 How It Works

### AI Advisor Flow

```
User Message
    ↓
Build Context (user profile, impact, recent activity)
    ↓
Try Primary Provider (Ollama local)
    ↓ [if fails]
Try Secondary Provider (Groq)
    ↓ [if fails]
Try Tertiary Provider (Together.ai)
    ↓ [if fails]
Return Error Message
```

**Check AI Status:**
```bash
GET /advisor/status
# Response: { status: "operational", providers: ["ollama", "groq"] }
```

### NGO Map Features

**Real-Time Features:**
- **Geolocation**: Requests user's GPS location (with permission)
- **Distance Calculation**: Uses Haversine formula
- **Match Score**: Based on NGO score + user application history
- **Satellite Imagery**: Esri World Imagery tiles
- **Interactive Markers**: Click to select and view details

**API Endpoint:**
```bash
GET /ngos?lat=40.7128&lon=-74.0060
# Returns NGOs with calculated distances and match scores
```

## 🎨 Components Added

### InteractiveMap Component
Location: `src/components/InteractiveMap.tsx`

Features:
- Leaflet map integration
- Custom marker rendering with scores
- Popup information display
- Auto-fit bounds for multiple markers
- Legend and controls

Usage:
```tsx
<InteractiveMap
  markers={ngoData}
  center={{ lat: 20.5937, lng: 78.9629 }}
  zoom={5}
  selectedMarkerId={selectedId}
  onMarkerClick={handleClick}
/>
```

## 🔧 Utilities Added

### AI Provider System
Location: `server/src/utils/aiProvider.ts`

- `generateAIResponse()`: Main function with fallback support
- `generateWithOllama()`: Local Ollama integration
- `generateWithGroq()`: Groq API integration
- `generateWithTogether()`: Together.ai integration
- `getAvailableProviders()`: Current provider status

### AI Configuration
Location: `server/src/utils/aiConfig.ts`

Centralized configuration for all AI providers with models, timeouts, and API keys.

## 📡 API Endpoints Updated

### Advisor Routes
```
POST /advisor          - Get AI response (requires auth)
GET  /advisor/status   - Check available AI providers
```

### NGO Routes
```
GET  /ngos?lat=X&lon=Y    - Get NGOs with distances (requires auth)
POST /ngos/:id/apply       - Apply to volunteer (requires auth)
```

### Impact Routes (Existing)
```
GET  /impact           - Get user impact statistics (requires auth)
```

## 🗺️ Pages Updated

### NgoMap (`src/pages/NgoMap.tsx`)
- **Real Data**: Fetches NGOs from database with geolocation
- **Satellite Map**: Interactive Leaflet-based satellite map
- **Search**: Real-time NGO search and filtering
- **Distance**: Calculates and displays distance to user
- **Match Score**: Shows personalized NGO match percentage

### Dashboard (`src/pages/Dashboard.tsx`)
- **Real KPIs**: Impact statistics from API
- **Real Notifications**: User notifications from database
- **User Name**: Personalized greeting with actual username
- **Loading States**: Proper async data handling

### Advisor (`src/pages/Advisor.tsx`)
- **Real AI**: Connects to Ollama/Cloud AI
- **User Context**: AI considers user profile and activity
- **Provider Status**: Shows which AI provider is active

## 🔐 Security Features

- Rate limiting on auth endpoints
- Token-based authentication
- Helmet security headers
- CORS configuration
- Environment variable protection
- Query validation

## 📊 Feature Comparison

### Before
```
✗ Static mock data (hardcoded arrays)
✗ Placeholder map
✗ No real geolocation
✗ AI not functional
✗ No real notifications
```

### After
```
✓ Real database queries
✓ Interactive satellite map with geolocation
✓ Distance calculations
✓ Multi-provider AI with fallback
✓ Real-time notifications
✓ Proper error handling
✓ Loading states
✓ User personalization
```

## 🐛 Troubleshooting

### Ollama Not Connecting
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check logs
ollama serve

# Make sure it's accessible on the configured URL
```

### Map Not Showing
```bash
# Ensure leaflet is installed
npm list leaflet react-leaflet

# Check browser console for CSS errors
# Verify geolocation permission in browser
```

### NGOs Not Loading
```bash
# Check database has NGO records
npm run db:studio

# Verify API endpoint
curl http://localhost:3001/api/ngos -H "Authorization: Bearer <token>"
```

### AI Provider Fails
```bash
# Check available providers
curl http://localhost:3001/advisor/status

# Check environment variables
echo $OLLAMA_URL
echo $GROQ_API_KEY

# Check provider URLs and API keys
```

## 📈 Next Steps

Consider implementing:
1. **Real impact tracking**: Log volunteer hours to database
2. **Donation system**: Process real donations
3. **Event scheduling**: Calendar integration
4. **Social features**: Real messaging between users
5. **Advanced matching**: ML-based NGO matching algorithm
6. **Analytics dashboard**: Track community impact

## 🎓 Learning Resources

- **Ollama**: https://ollama.ai/
- **Leaflet Maps**: https://leafletjs.com/
- **Groq AI**: https://groq.com/
- **Together.ai**: https://www.together.ai/
- **Prisma ORM**: https://www.prisma.io/

## 📞 Support

For issues or questions:
1. Check environment variables are set correctly
2. Verify database is running
3. Check API endpoints in browser Network tab
4. Review server logs for errors
5. Ensure all dependencies are installed
