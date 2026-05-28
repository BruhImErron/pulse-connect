import { Router, Response, Request } from "express";
import { body, param, query, validationResult, ValidationError, AlternativeValidationError } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest, ok, err } from "../types";

const router = Router();
const prisma = new PrismaClient();

const validateRequest = (req: Request, res: Response, next: () => void) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array({ onlyFirstError: true }) as Array<ValidationError | AlternativeValidationError>;
    return res.status(400).json(
      err(
        "Validation failed",
        validationErrors.map((e) => {
          const field = "param" in e ? e.param : (e as any).location;
          return { field, message: e.msg };
        })
      )
    );
  }
  next();
};

type QueryValue = string | import("qs").ParsedQs | (string | import("qs").ParsedQs)[] | undefined;

const parseCoordinate = (value: QueryValue, min: number, max: number): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return null;
  const parsed = parseFloat(raw);
  if (Number.isNaN(parsed) || parsed < min || parsed > max) return null;
  return parsed;
};

/**
 * calculateDistance()
 * Purpose: Calculates great-circle distance between two geographic coordinates
 * How it works: Uses Haversine formula to compute shortest distance across Earth's surface
 *
 * Mathematical breakdown:
 *   1. Convert lat/lon differences from degrees to radians (multiply by π/180)
 *   2. Apply haversine function: sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlon/2)
 *   3. Compute central angle using inverse tangent: 2*atan2(√a, √(1-a))
 *   4. Multiply by Earth's radius (6371 km) to get distance
 *   5. Round to nearest km for UI display
 *
 * Parameters:
 *   - lat1, lon1: User's latitude and longitude
 *   - lat2, lon2: NGO's latitude and longitude
 *
 * Returns: Distance in kilometers (rounded to nearest integer)
 *
 * Use case: Determines how far each NGO is from user's geolocation for sorting
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in kilometers
  
  // Convert latitude/longitude differences to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  // Haversine formula: a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  // Central angle: c = 2 * atan2(√a, √(1-a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance = R * c, rounded to nearest km
  return Math.round(R * c);
}

/**
 * GET /
 * Purpose: Fetches list of NGOs with match scores, distance calculations, and user application status
 * How it works:
 *
 *   STEP 1: Extract user context
 *     - Get user's latitude/longitude from query parameters (or null if not provided)
 *     - Extract userId from authenticated request
 *
 *   STEP 2: Get user's NGO applications
 *     - Query database for all NGOs user has applied to
 *     - Map into Set for O(1) lookup performance
 *
 *   STEP 3: Fetch all NGOs from database
 *     - Select: Basic info (name, location, description), score, tags
 *     - Select: Geographic coordinates (latitude, longitude)
 *     - Select: Application counts (how many volunteers applied)
 *     - Select: Volunteer hours counts (engagement metric)
 *     - Order by base score descending (pre-sort for relevance)
 *
 *   STEP 4: Enrich NGO data
 *     - Calculate distance: Use Haversine formula if user location provided
 *     - Calculate matchScore: Base score (0-100) + 5 bonus if user already applied
 *     - Add isApplied flag: For UI to show if user has applications pending
 *     - Ensure tags are always an array (handle null/undefined)
 *
 *   STEP 5: Sort by match score
 *     - Primary sort: Match score descending (most relevant first)
 *     - This combines: Base NGO score + user history + distance bonus
 *
 *   STEP 6: Return sorted list
 *     - Return 200 OK with ngos array containing all enriched data
 *
 * Query parameters:
 *   - lat (optional): User's current latitude for distance calculation
 *   - lon (optional): User's current longitude for distance calculation
 *
 * Returns: Array of NGO objects with:
 *   - Basic data: id, name, location, country, description, tags
 *   - Scoring: score (base), matchScore (calculated), distance (km)
 *   - Engagement: application and volunteer hours counts
 *   - User status: isApplied (boolean)
 *
 * Error handling: Returns 500 if database query fails
 */
router.get(
  "/",
  [
    query("lat").optional().isFloat({ min: -90, max: 90 }).withMessage("Latitude must be between -90 and 90"),
    query("lon").optional().isFloat({ min: -180, max: 180 }).withMessage("Longitude must be between -180 and 180"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 500 }).withMessage("Limit must be between 1 and 500"),
    query("search").optional().isString().withMessage("Search must be a string"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      // STEP 1: Extract user location and pagination params
      const userLat = parseCoordinate(req.query.lat, -90, 90);
      const userLon = parseCoordinate(req.query.lon, -180, 180);
      const page = parseInt(String(req.query.page || "1"));
      const limit = Math.min(parseInt(String(req.query.limit || "50")), 500); // Max 500 per page
      const search = String(req.query.search || "").trim();
      const offset = (page - 1) * limit;
      
      // STEP 2: Get user's NGO applications (if authenticated)
    let appliedNgoIds = new Set<string>();
    if ((req as any).user) {
      const userApplications = await prisma.ngoApplication.findMany({
        where: { userId: (req as any).user!.userId },
        select: { ngoId: true },
      });
      appliedNgoIds = new Set(userApplications.map(app => app.ngoId));
    }

    // STEP 3: Fetch NGOs with pagination and search
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { country: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ];
    }

    const [ngos, totalCount] = await Promise.all([
      prisma.ngo.findMany({
        where: whereClause,
        orderBy: { score: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          location: true,
          country: true,
          description: true,
          score: true,
          tags: true,
          latitude: true,
          longitude: true,
          _count: {
            select: { applications: true, volunteerHours: true },
          },
        },
      }),
      prisma.ngo.count({ where: whereClause })
    ]);

    // STEP 4: Enrich NGO data with distance and match scores
    const ngosWithDistance = ngos.map((ngo) => {
      const tagArray = Array.isArray(ngo.tags)
        ? ngo.tags
        : typeof ngo.tags === "string"
        ? ngo.tags.split(",").map((tag) => tag.trim())
        : [];

      // Calculate distance using Haversine formula (null if no user location)
      let distance: number | null = null;
      if (userLat !== null && userLon !== null) {
        distance = calculateDistance(
          Number(userLat),
          Number(userLon),
          Number(ngo.latitude),
          Number(ngo.longitude)
        );
      }
      
      // Determine if user is in Philippines (rough bounding box for Philippines)
      const isUserInPhilippines = userLat !== null && userLon !== null &&
        Number(userLat) >= 4.5 && Number(userLat) <= 21.5 &&
        Number(userLon) >= 116.0 && Number(userLon) <= 127.0;
      
      // Calculate distance-based score component (0-20 points)
      // Closer NGOs get higher scores: 20 points for <50km, decreasing to 0 for >500km
      let distanceScore = 0;
      if (distance !== null) {
        if (distance < 50) distanceScore = 20;
        else if (distance < 100) distanceScore = 15;
        else if (distance < 200) distanceScore = 10;
        else if (distance < 500) distanceScore = 5;
        // >500km gets 0 points
      }
      
      // Philippine localization bonus: +10 points for Philippine NGOs if user is in Philippines
      const philippineBonus = (isUserInPhilippines && ngo.country === 'Philippines') ? 10 : 0;
      
      // Application bonus: +5 points if user already applied
      const applicationBonus = appliedNgoIds.has(ngo.id) ? 5 : 0;
      
      // Final match score: Base NGO score + distance score + localization bonus + application bonus
      // Cap at 100 to keep consistent with UI expectations
      const matchScore = Math.min(100, ngo.score + distanceScore + philippineBonus + applicationBonus);
      
      return {
        ...ngo,
        tags: tagArray,
        distance,
        matchScore,
        // Flag if user has active application to this NGO
        isApplied: appliedNgoIds.has(ngo.id),
      };
    });

    // STEP 5: Sort NGOs by match score (best matches first)
    ngosWithDistance.sort((a, b) => b.matchScore - a.matchScore);

    // STEP 6: Return paginated and enriched NGO list
    res.json(ok({
      ngos: ngosWithDistance,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    }));
  } catch (e) {
    console.error("NGOs fetch error:", e);
    res.status(500).json(err("Failed to fetch NGOs"));
  }
});

/**
 * POST /:ngoId/apply
 * Purpose: Creates or updates user application to an NGO for a specific volunteer role
 * How it works:
 *
 *   STEP 1: Validation
 *     - Extract NGO ID from URL parameter
 *     - Extract desired role from request body
 *     - Return 400 error if role not provided
 *
 *   STEP 2: Upsert application (Create or Update)
 *     - Look for existing application with userId + ngoId combination
 *     - If exists: Update role and set status back to "pending"
 *     - If not exists: Create new application record with userId + ngoId
 *     - All applications start with "pending" status (needs NGO approval)
 *
 *   STEP 3: Return result
 *     - Return 200 OK with created/updated application object
 *
 * Request body:
 *   - role: String describing volunteer role (e.g., "Healthcare Worker", "Fundraiser")
 *
 * URL parameters:
 *   - ngoId: ID of NGO to apply to
 *
 * Returns: Application object with:
 *   - userId, ngoId, role, status ("pending"), createdAt/updatedAt timestamps
 *
 * Error conditions:
 *   - 400: Missing role in request body
 *   - 500: Database error during create/update
 *
 * Business logic:
 *   - User can apply multiple times (upsert handles re-applications)
 *   - Each application is independent per role
 *   - Applications require NGO approval before volunteer work begins
 */
router.post(
  "/:ngoId/apply",
  [
    param("ngoId").trim().notEmpty().withMessage("NGO ID is required"),
    body("role")
      .trim()
      .isLength({ min: 3, max: 60 })
      .withMessage("Role must be between 3 and 60 characters")
      .matches(/^[a-zA-Z0-9 .,'()\-]+$/)
      .withMessage("Role contains invalid characters"),
  ],
  requireAuth,
  validateRequest,
  async (req: AuthenticatedRequest, res: Response) => {
    const ngoId = String(req.params.ngoId).trim();
    const role = String(req.body.role).trim();

    try {
      // STEP 2: Upsert application (create if not exists, update if exists)
      const application = await prisma.ngoApplication.upsert({
        where: {
          // Unique constraint: one application per user per NGO
          userId_ngoId: { userId: req.user!.userId, ngoId },
        },
        // If application exists: update the role and reset status to pending
        update: { role, status: "pending" },
        // If application doesn't exist: create new record with default "pending" status
        create: {
          userId: req.user!.userId,
          ngoId,
          role,
        },
      });

      // STEP 3: Return created or updated application
      res.json(ok({ application }));
    } catch (e) {
      // Log error for debugging and return 500
      console.error(e);
      res.status(500).json(err("Failed to apply"));
    }
  }
);

export default router;