import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
  };
}

export const ok = <T>(data: T) => ({
  success: true as const,
  data,
});

export const err = (message: string, details?: unknown) => ({
  success: false as const,
  error: message,
  details,
});