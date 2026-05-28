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

      // Fetch all activity types
      const [volunteerHours, donations, applications, posts, likes] = await Promise.all([
        prisma.volunteerHour.findMany({
          where: { userId },
          include: { ngo: { select: { name: true, location: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        prisma.donation.findMany({
          where: { userId },
          include: { ngo: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        prisma.ngoApplication.findMany({
          where: { userId },
          include: { ngo: { select: { name: true, location: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        prisma.post.findMany({
          where: { authorId: userId },
          select: { id: true, content: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.like.findMany({
          where: { userId },
          include: {
            post: {
              select: {
                id: true,
                content: true,
                author: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      // Combine and sort all activities by date
      const activities = [
        ...volunteerHours.map(vh => ({
          id: `volunteer-${vh.id}`,
          type: "volunteer" as const,
          title: vh.description || "Volunteer Hours Logged",
          description: `${vh.ngo.name} • ${vh.ngo.location}`,
          time: vh.createdAt.toISOString(),
          hours: vh.hours,
          ngo: vh.ngo.name,
        })),
        ...donations.map(d => ({
          id: `donation-${d.id}`,
          type: "donation" as const,
          title: `Donated ${d.currency} ${d.amount}`,
          description: `To ${d.ngo.name}`,
          time: d.createdAt.toISOString(),
          hours: null,
          ngo: d.ngo.name,
        })),
        ...applications.map(app => ({
          id: `application-${app.id}`,
          type: "application" as const,
          title: `Applied to ${app.ngo.name}`,
          description: `Role: ${app.role} • ${app.ngo.location}`,
          time: app.createdAt.toISOString(),
          hours: null,
          ngo: app.ngo.name,
        })),
        ...posts.map(p => ({
          id: `post-${p.id}`,
          type: "post" as const,
          title: "Shared a post",
          description: p.content.length > 50 ? p.content.substring(0, 50) + "..." : p.content,
          time: p.createdAt.toISOString(),
          hours: null,
          ngo: null,
        })),
        ...likes.map(l => ({
          id: `like-${l.id}`,
          type: "like" as const,
          title: "Liked a post",
          description: `By ${l.post.author.name}: ${l.post.content.length > 30 ? l.post.content.substring(0, 30) + "..." : l.post.content}`,
          time: l.createdAt.toISOString(),
          hours: null,
          ngo: null,
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      // Calculate activity stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weekHours = volunteerHours
        .filter(vh => vh.createdAt >= weekAgo)
        .reduce((sum, vh) => sum + vh.hours, 0);

      const monthHours = volunteerHours
        .filter(vh => vh.createdAt >= monthAgo)
        .reduce((sum, vh) => sum + vh.hours, 0);

      const totalHours = volunteerHours.reduce((sum, vh) => sum + vh.hours, 0);

      res.json(ok({
        activities: activities.slice(0, 20), // Return most recent 20 activities
        stats: {
          thisWeek: Math.round(weekHours * 10) / 10,
          thisMonth: Math.round(monthHours * 10) / 10,
          total: Math.round(totalHours * 10) / 10,
        },
      }));
    } catch (e) {
      console.error("Activity fetch error:", e);
      res.status(500).json(err("Failed to fetch activity data"));
    }
  }
);

export default router;