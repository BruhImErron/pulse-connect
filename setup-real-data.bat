@echo off
REM PulseConnect Real Data Setup Script for Windows
REM Run this to configure the environment for real data integration

cls
echo.
echo 🚀 PulseConnect Real Data Integration Setup
echo ===========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this from the root directory.
    pause
    exit /b 1
)

echo 📋 Step 1: Creating .env file in server directory...
echo.

if not exist "server\.env" (
    (
        echo # Database Configuration
        echo DATABASE_URL="file:./dev.db"
        echo.
        echo # Ollama Configuration (Local AI - Required^)
        echo OLLAMA_URL="http://localhost:11434"
        echo.
        echo # Groq API Configuration (Optional - Cloud AI^)
        echo # Get API key from: https://console.groq.com
        echo # GROQ_API_KEY="your-groq-api-key-here"
        echo.
        echo # Together.ai Configuration (Optional - Cloud AI^)
        echo # Get API key from: https://www.together.ai
        echo # TOGETHER_API_KEY="your-together-api-key-here"
        echo.
        echo # AI Strategy: "local" (use Ollama only^), "external" (use cloud APIs only^), or "fallback" (try local first, then cloud^)
        echo AI_MODEL_STRATEGY="fallback"
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo NODE_ENV="development"
    ) > "server\.env"
    echo ✅ .env file created at server\.env
) else (
    echo ⚠️  .env file already exists, skipping...
)

echo.
echo 📦 Step 2: Installing dependencies...
echo.

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ⚠️  Some dependencies may have failed
)

echo.
echo Installing server dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ⚠️  Some dependencies may have failed
)
cd ..

echo ✅ Dependencies installed

echo.
echo 🗄️  Step 3: Setting up database...
echo.

cd server

echo Pushing database schema...
call npx prisma db push --skip-generate
if errorlevel 1 (
    echo ⚠️  Database setup may need manual configuration
)

cd ..

echo ✅ Database ready

echo.
echo 🎯 Step 4: Next Steps
echo ====================
echo.
echo To run the application:
echo.
echo 1️⃣  START OLLAMA (in PowerShell or Command Prompt^):
echo     ollama serve
echo.
echo 2️⃣  PULL LLAMA MODEL (in another terminal^):
echo     ollama pull llama3.2
echo.
echo 3️⃣  START BACKEND SERVER (from root directory^):
echo     cd server
echo     npm run dev
echo.
echo 4️⃣  START FRONTEND (from root directory in another terminal^):
echo     npm run dev
echo.
echo ✨ Your application will be ready at http://localhost:5173
echo.
echo 📚 For more details, see REAL_DATA_SETUP.md
echo.
pause
