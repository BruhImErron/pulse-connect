import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, err } from "../types";

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json(err("Unauthorized"));
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as {
      userId: string;
      email?: string;
    };

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch {
    res.status(401).json(err("Invalid token"));
  }
}