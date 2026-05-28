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
      const notifications = await prisma.notification.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      res.json(ok({ notifications }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Failed to fetch notifications"));
    }
  }
);

router.patch(
  "/:id/read",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.notification.updateMany({
        where: { id, userId: req.user!.userId },
        data: { read: true },
      });

      res.json(ok({ updated: true }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Failed to mark as read"));
    }
  }
);

router.patch(
  "/read-all",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await prisma.notification.updateMany({
        where: { userId: req.user!.userId, read: false },
        data: { read: true },
      });

      res.json(ok({ updated: true }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Failed to mark all as read"));
    }
  }
);

export default router;