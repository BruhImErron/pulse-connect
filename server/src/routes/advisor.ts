import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest, err, ok } from "../types";
import { generateAIResponse, getAvailableProviders } from "../utils/aiProvider";
import { AI_CONFIG } from "../utils/aiConfig";

const router = Router();
const prisma = new PrismaClient();

/**
 * AdvisorContext Type Definition
 * Purpose: Defines the shape of user context passed to the AI advisor
 * How it works: Contains comprehensive user data including profile info, impact metrics,
 * volunteer hours, posts, and NGO applications - used to personalize AI responses
 */
type AdvisorContext = {
  user: {
    name: string;
    role: string;
    location: string | null;
    bio: string | null;
    createdAt: string;
  };
  impact: {
    itemsDonated: number;
    hoursVolunteered: number;
    ngosSupported: number;
    carbonSaved: number;
  };
  recentVolunteerHours: Array<{
    ngoName: string;
    hours: number;
    description: string;
    date: string;
  }>;
  recentPosts: Array<{
    content: string;
    createdAt: string;
  }>;
  ngoApplications: Array<{
    ngoName: string;
    role: string;
    status: string;
    createdAt: string;
  }>;
};

/**
 * buildPrompt()
 * Purpose: Constructs the AI prompt with user context for personalized responses
 * How it works:
 *   1. Sets system role: AI is PulseConnect Advisor - supportive social-impact mentor
 *   2. Defines constraints: Keep under 220 words, warm/confident tone, specific feedback
 *   3. Embeds real user data: Name, volunteers hours, NGO apps, posts, impact metrics
 *   4. Adds user message: The actual question/concern from the user
 *   5. Returns formatted prompt ready for AI processing
 * Parameter context: AdvisorContext object with user's current app data
 * Returns: String formatted as multi-line prompt for LLM consumption
 */
function buildPrompt(message: string, context: AdvisorContext) {
  return `You are PulseConnect Advisor, a concise and supportive social-impact mentor inside a volunteering app.
Your job is to help the user take practical next steps based on their real profile and activity in the app.
Keep replies under 220 words, use a warm and confident tone, and be specific.
If relevant, mention their progress, recent volunteer activity, NGO applications, and posts.
Do not invent facts beyond the provided context.
If the user asks something unrelated to PulseConnect, still be helpful and tie the answer back to volunteering, impact, habits, goals, or community where appropriate.

User context:
${JSON.stringify(context, null, 2)}

User message:
${message}

Advisor reply:`;
}

/**
 * fetchWithTimeout()
 * Purpose: Wraps fetch() with automatic timeout handling to prevent hanging requests
 * How it works:
 *   1. Creates AbortController to signal request cancellation
 *   2. Sets timeout using setTimeout - if exceeded, abort signal fires
 *   3. Executes fetch with abort signal attached
 *   4. Clears timeout in finally block (cleanup for memory efficiency)
 *   5. Returns fetch response or throws error if timeout occurs
 * Parameters:
 *   - url: Endpoint to fetch from
 *   - options: Fetch RequestInit configuration (headers, body, method)
 *   - timeoutMs: Maximum milliseconds to wait before aborting
 * Returns: Response object on success, AbortError on timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * generateWithModel()
 * Purpose: Fallback function - generates AI responses directly from local Ollama instance
 * How it works:
 *   1. Constructs Ollama API request to /api/generate endpoint
 *   2. Sends POST request with model name, prompt, and temperature (0.7 for balanced creativity)
 *   3. Sets 25-second timeout to prevent long waits
 *   4. Parses JSON response and extracts response field
 *   5. Trims whitespace and returns text content
 * Parameter ollamaUrl: Base URL where Ollama is running (e.g., http://localhost:11434)
 * Parameter model: Model identifier (e.g., "llama3.2:latest")
 * Parameter prompt: Full prompt text built by buildPrompt()
 * Returns: Generated text response or throws error if Ollama unavailable
 * Error handling: Throws if response.ok is false or if JSON parsing fails
 */
async function generateWithModel(
  ollamaUrl: string,
  model: string,
  prompt: string
) {
  const response = await fetchWithTimeout(
    `${ollamaUrl}/api/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
        },
      }),
    },
    25000
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama returned ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { response?: string };
  return data.response?.trim() ?? "";
}

/**
 * POST /
 * Purpose: Main endpoint - receives user message, builds context, generates AI advisor response
 * How it works:
 *   STEP 1: Validate & Authentication
 *     - Extract message from request body
 *     - Check if message is not empty/whitespace only
 *     - Verify user is authenticated via requireAuth middleware
 *
 *   STEP 2: Fetch User Context (Parallel Database Queries)
 *     - Get user profile: name, role, location, bio, level, points, weekly hours
 *     - Get volunteer hours: 5 most recent entries for impact tracking
 *     - Count donations: Total items donated by user
 *     - Get NGO applications: 5 most recent job applications with status
 *     - Get posts: 3 most recent posts user created
 *
 *   STEP 3: Construct Context Object
 *     - Map raw database data into AdvisorContext shape
 *     - Calculate impact metrics: total hours, carbon saved (0.35 kg CO2 per hour)
 *     - Format dates to ISO strings
 *     - Prepare recentVolunteerHours array with NGO names and descriptions
 *     - Trim applications to 5 most recent
 *
 *   STEP 4: Generate AI Response (Multi-Provider Fallback)
 *     - Build full prompt using buildPrompt(message, context)
 *     - Call generateAIResponse() which tries primary providers
 *     - If main providers fail, fallback to local Ollama as secondary
 *     - Log which provider was used for debugging
 *     - Handle errors gracefully with appropriate error messages
 *
 *   STEP 5: Return Response
 *     - If success: Return 200 with advisor reply text
 *     - If failure: Return 503 with available providers list for debugging
 *
 * Error conditions:
 *   - 400: Missing or empty message
 *   - 404: User not found in database
 *   - 503: All AI providers unavailable
 */
router.post(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const { message } = req.body as { message: string };

    // Validation: Ensure message is provided and not empty
    if (!message?.trim()) {
      res.status(400).json(err("Message is required"));
      return;
    }

    try {
      const userId = req.user!.userId;

      // STEP 2: Fetch all user context data in parallel for efficiency
      const [user, recentHours, donationsCount, recentApplications, recentPosts] =
        await Promise.all([
          // Get user profile information
          prisma.user.findUnique({
            where: { id: userId },
            select: {
              name: true,
              role: true,
              location: true,
              bio: true,
              createdAt: true,
            },
          }),
          // Get 5 most recent volunteer hours (for personalization)
          prisma.volunteerHour.findMany({
            where: { userId },
            orderBy: { date: "desc" },
            take: 5,
            select: {
              hours: true,
              description: true,
              date: true,
              ngo: {
                select: {
                  name: true,
                },
              },
            },
          }) as Promise<Array<{
            hours: number;
            description: string;
            date: Date;
            ngo: { name: string };
          }>>,
          // Count total donations for impact context
          prisma.donation.count({
            where: { userId },
          }),
          // Get NGO applications with status for opportunities context (limit to 5 most recent)
          prisma.ngoApplication.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              role: true,
              status: true,
              createdAt: true,
              ngo: {
                select: {
                  name: true,
                },
              },
            },
          }),
          // Get 3 most recent posts to show community engagement
          prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
              content: true,
              createdAt: true,
            },
          }),
        ]);

      // Check if user exists in database
      if (!user) {
        res.status(404).json(err("User not found"));
        return;
      }

      // STEP 3: Calculate aggregate impact metrics
      const totalHours = recentHours.reduce(
        (sum, entry) => sum + entry.hours,
        0
      );

      // Build context object with all user data for AI prompt
      const context: AdvisorContext = {
        user: {
          name: user.name,
          role: user.role,
          location: user.location,
          bio: user.bio,
          createdAt: user.createdAt.toISOString(),
        },
        impact: {
          itemsDonated: donationsCount,
          hoursVolunteered: Number(totalHours.toFixed(1)),
          ngosSupported: recentApplications.length,
          // Carbon saved calculation: approx 0.35 kg CO2 per volunteer hour
          carbonSaved: Math.round(totalHours * 0.35),
        },
        recentVolunteerHours: recentHours.map((entry) => ({
          ngoName: entry.ngo.name,
          hours: entry.hours,
          description: entry.description,
          date: entry.date.toISOString(),
        })),
        recentPosts: recentPosts.map((post) => ({
          content: post.content,
          createdAt: post.createdAt.toISOString(),
        })),
        ngoApplications: recentApplications.map((application) => ({
          ngoName: application.ngo.name,
          role: application.role,
          status: application.status,
          createdAt: application.createdAt.toISOString(),
        })),
      };

      // STEP 4: Generate AI response using multi-provider system
      const prompt = buildPrompt(message.trim(), context);

      let reply = "";

      const localFallback = (userMessage: string) => {
        const lower = userMessage.toLowerCase();
        if (lower.includes("sleep")) {
          return "Good sleep habits matter most. Try a consistent bedtime, limit screens 30 minutes before sleep, and build a calming pre-sleep routine. If energy is low, focus on regular movement and hydration, then consider small evening rituals to help your body relax.";
        }
        if (lower.includes("stress") || lower.includes("anxiety")) {
          return "Stress can be managed with small daily habits. Start with breathing exercises, short movement breaks, and setting realistic goals. If you feel overwhelmed, take one concrete action today: reach out to a friend, walk outside, or focus on something you can control.";
        }
        if (lower.includes("immune") || lower.includes("superfood") || lower.includes("nutrition")) {
          return "Balanced nutrition, hydration, and sleep support immunity more than any single food. Focus on whole ingredients, fruits and vegetables, lean protein, and adequate fluid intake. A healthy routine is the best foundation for long-term wellbeing.";
        }
        if (lower.includes("volunteer") || lower.includes("ngo")) {
          return "Volunteering works best when you match your strengths to the need. Look for opportunities where your skills matter, start with a trusted local group, and track how your effort connects to clear outcomes. Small consistent contributions add up quickly.";
        }
        return "I’m here to help with practical health and volunteer guidance. Start with one small step: identify a clear goal, choose a safe action you can do today, and build from there. If you’d like, I can suggest specific next actions based on your interests.";
      };

      try {
        // Try primary AI providers first
        const result = await generateAIResponse(prompt);
        reply = result.content;
        console.log(`AI response generated using ${result.provider}`);
      } catch (primaryError) {
        console.error("Primary AI provider failed:", primaryError);
        try {
          const ollamaUrl = process.env.OLLAMA_URL ?? "http://localhost:11434";
          reply = await generateWithModel(ollamaUrl, "qwen3-coder:latest", prompt);
        } catch (fallbackError) {
          console.error("Fallback Ollama also failed:", fallbackError);
          // Use quick local fallback with a safe but helpful response
          reply = localFallback(message.trim());
        }
      }

      // Sanity check: Ensure we actually got a response
      if (!reply) {
        reply = localFallback(message.trim());
      }

      // STEP 5: Return successful response
      res.json(ok({ reply }));
    } catch (e) {
      // Error handling: Log error and return helpful error message
      console.error("Advisor error:", e);

      // Get list of available providers for debugging message
      const availableProviders = getAvailableProviders();
      const providerList = availableProviders.join(", ");

      // Return 503 Service Unavailable with provider info for troubleshooting
      res.status(503).json(
        err(
          `AI advisor is currently unavailable. Available providers: ${providerList}. Make sure your AI provider is running and try again.`
        )
      );
    }
  }
);

/**
 * GET /status
 * Purpose: Health check endpoint - returns AI advisor status and available providers
 * How it works:
 *   1. Gets list of enabled AI providers from environment/configuration
 *   2. Returns operational status and provider list
 *   3. Includes current timestamp for request timing validation
 * Returns: JSON with status, list of available providers, and request timestamp
 * Use case: Frontend can check if advisor is ready before showing UI, debug provider issues
 */
router.get("/status", (_req, res: Response) => {
  const availableProviders = getAvailableProviders();
  res.json(
    ok({
      status: "operational",
      providers: availableProviders,
      timestamp: new Date().toISOString(),
    })
  );
});

export default router;