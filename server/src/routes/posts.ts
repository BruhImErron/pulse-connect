import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest, ok, err } from "../types";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        author: {
          select: { id: true, name: true, location: true, bio: true },
        },
        _count: { select: { likes: true } },
      },
    });

    res.json(ok({ posts }));
  } catch (e) {
    console.error(e);
    res.status(500).json(err("Failed to fetch posts"));
  }
});

router.post(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const { content } = req.body as { content: string };

    if (!content?.trim() || content.length > 500) {
      res.status(400).json(err("Content must be between 1 and 500 characters"));
      return;
    }

    try {
      const post = await prisma.post.create({
        data: {
          content: content.trim(),
          authorId: req.user!.userId,
        },
        include: {
          author: {
            select: { id: true, name: true, location: true, bio: true },
          },
          _count: { select: { likes: true } },
        },
      });

      res.status(201).json(ok({ post }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Failed to create post"));
    }
  }
);

router.post(
  "/:postId/like",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const { postId } = req.params;

    try {
      const existing = await prisma.like.findUnique({
        where: { userId_postId: { userId: req.user!.userId, postId } },
      });

      if (existing) {
        await prisma.like.delete({
          where: { userId_postId: { userId: req.user!.userId, postId } },
        });
        res.json(ok({ liked: false }));
      } else {
        await prisma.like.create({
          data: { postId, userId: req.user!.userId },
        });
        res.json(ok({ liked: true }));
      }
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Failed to toggle like"));
    }
  }
);

export default router;