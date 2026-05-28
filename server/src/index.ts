import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Route imports
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import ngosRoutes from "./routes/ngos";
import notificationsRoutes from "./routes/notifications";
import advisorRoutes from "./routes/advisor";
import impactRoutes from "./routes/impact";
import activityRoutes from "./routes/activity";

// Load environment variables from .env file
// Purpose: Securely manage API keys and configuration
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT ?? 3002;

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet: Sets HTTP security headers (prevents XSS, clickjacking, MIME-sniffing)
// How it works: Adds security headers like X-Frame-Options, X-Content-Type-Options
app.use(helmet());
app.disable("x-powered-by");

// Enable proxy trust in production if the app is deployed behind a reverse proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS: Controls which origins can access this API
// Purpose: Allow frontend (localhost:5173) to communicate with this backend (localhost:3001)
// How it works: Validates request origin against whitelist, sends CORS headers
app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  credentials: true, // Allow cookies/auth headers in cross-origin requests
}));

// Body Parser: Parses incoming JSON request bodies
// Purpose: Prevent DoS attacks by limiting payload size to 10KB
// How it works: Rejects requests larger than limit, throws error for protection
app.use(express.json({ limit: "10kb" }));

// =============================================================================
// RATE LIMITERS
// =============================================================================

/**
 * Auth Rate Limiter
 * Purpose: Prevent brute force attacks on authentication endpoints
 * How it works: Limits to 20 requests per 15 minutes per IP address
 * Window: 15 minutes, Max: 20 attempts per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many authentication attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General Rate Limiter
 * Purpose: Prevent DoS attacks on all API endpoints
 * How it works: Limits to 200 requests per 15 minutes per IP address
 * Window: 15 minutes, Max: 200 requests per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply specific rate limiter to auth routes (stricter limits)
app.use("/api/auth", authLimiter);

// Apply general rate limiter to all API routes
app.use(generalLimiter);

// =============================================================================
// API ROUTES
// =============================================================================

app.use("/api/auth", authRoutes);          // Authentication (login, register, profile)
app.use("/api/posts", postsRoutes);        // Social posts and interactions
app.use("/api/ngos", ngosRoutes);          // NGO data and applications
app.use("/api/notifications", notificationsRoutes); // User notifications
app.use("/api/advisor", advisorRoutes);    // AI advisor with multi-provider support
app.use("/api/impact", impactRoutes);      // User impact statistics
app.use("/api/activity", activityRoutes);  // User activity timeline

// Health check endpoint for monitoring
// Purpose: Verify server is running and responding correctly
// How it works: Returns status OK and current timestamp for health verification
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// =============================================================================
// SERVER START
// =============================================================================

/**
 * Start Express server
 * Purpose: Listen for incoming HTTP requests on specified port
 * How it works: Binds to PORT and logs startup message to console
 */
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}\n`);
});
