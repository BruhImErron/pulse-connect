import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest, ok, err } from "../types";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      const [donations, hours, applications] = await Promise.all([
        prisma.donation.count({ where: { userId } }),
        prisma.volunteerHour.aggregate({
          where: { userId },
          _sum: { hours: true },
          _count: true,
        }),
        prisma.ngoApplication.count({ where: { userId } }),
      ]);

      const totalHours = hours._sum.hours ?? 0;
      const xpPoints = donations * 5 + totalHours * 10 + applications * 20;
      const level = Math.max(1, Math.min(50, Math.floor(xpPoints / 100) + 1));

      res.json(
        ok({
          itemsDonated: donations,
          hoursVolunteered: totalHours,
          ngosSupported: applications,
          carbonSaved: Math.round(totalHours * 0.35),
          currentStreak: 14,
          xpPoints,
          level,
        })
      );
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Failed to fetch impact data"));
    }
  }
);

export default router;