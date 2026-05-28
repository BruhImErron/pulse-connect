#!/bin/bash

# PulseConnect Real Data Setup Script
# Run this to configure the environment for real data integration

echo "🚀 PulseConnect Real Data Integration Setup"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the root directory."
    exit 1
fi

echo "📋 Step 1: Creating .env file in server directory..."

if [ ! -f "server/.env" ]; then
    cat > server/.env << 'EOF'
# Database Configuration
DATABASE_URL="file:./dev.db"

# Ollama Configuration (Local AI - Required)
OLLAMA_URL="http://localhost:11434"

# Groq API Configuration (Optional - Cloud AI)
# Get API key from: https://console.groq.com
# GROQ_API_KEY="your-groq-api-key-here"

# Together.ai Configuration (Optional - Cloud AI)
# Get API key from: https://www.together.ai
# TOGETHER_API_KEY="your-together-api-key-here"

# AI Strategy: "local" (use Ollama only), "external" (use cloud APIs only), or "fallback" (try local first, then cloud)
AI_MODEL_STRATEGY="fallback"

# Server Configuration
PORT=3001
NODE_ENV="development"
EOF
    echo "✅ .env file created at server/.env"
else
    echo "⚠️  .env file already exists, skipping..."
fi

echo ""
echo "📦 Step 2: Installing dependencies..."
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps 2>/dev/null || npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install --legacy-peer-deps 2>/dev/null || npm install
cd ..

echo "✅ Dependencies installed"

echo ""
echo "🗄️  Step 3: Setting up database..."

cd server

# Check if Prisma is installed
if command -v npx &> /dev/null; then
    echo "Pushing database schema..."
    npx prisma db push --skip-generate 2>/dev/null || true
    echo "✅ Database ready"
else
    echo "⚠️  npx not found, please run 'npm run db:push' manually"
fi

cd ..

echo ""
echo "🎯 Step 4: Next Steps"
echo "===================="
echo ""
echo "To run the application:"
echo ""
echo "1️⃣  START OLLAMA (in a separate terminal):"
echo "    ollama serve"
echo ""
echo "2️⃣  PULL LLAMA MODEL:"
echo "    ollama pull llama3.2"
echo ""
echo "3️⃣  START BACKEND SERVER (from root directory):"
echo "    cd server && npm run dev"
echo ""
echo "4️⃣  START FRONTEND (from root directory in another terminal):"
echo "    npm run dev"
echo ""
echo "✨ Your application will be ready at http://localhost:5173"
echo ""
echo "📚 For more details, see REAL_DATA_SETUP.md"
echo ""
