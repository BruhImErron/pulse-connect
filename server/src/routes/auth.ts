import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { ok, err } from "../types";

const router = Router();
const prisma = new PrismaClient();

const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("name").trim().isLength({ min: 2, max: 50 }),
];

router.post(
  "/register",
  registerValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(
        err(
          "Validation failed",
          errors.array().map((e) => e.msg)
        )
      );
      return;
    }

    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name: string;
    };

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        res.status(409).json(err("Email already registered"));
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          location: true,
          country: true,
          bio: true,
          avatarUrl: true,
          interests: true,
          xpPoints: true,
        },
      });

      const userResponse = {
        ...user,
        avatarInitial: name.charAt(0).toUpperCase(),
        level: Math.floor((user.xpPoints || 0) / 100) + 1,
        interests: user.interests ? JSON.parse(user.interests) : [],
      };

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.status(201).json(ok({ user: userResponse, token }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err("Internal server error"));
    }
  }
);

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json(err("Email and password are required"));
    return;
  }

  try {
    const userWithPassword = await prisma.user.findUnique({ where: { email } });

    if (!userWithPassword || !(await bcrypt.compare(password, userWithPassword.password))) {
      res.status(401).json(err("Invalid credentials"));
      return;
    }

    const token = jwt.sign(
      { userId: userWithPassword.id, email: userWithPassword.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const user = await prisma.user.findUnique({
      where: { id: userWithPassword.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        location: true,
        country: true,
        bio: true,
        avatarUrl: true,
        interests: true,
        xpPoints: true,
      },
    });

    const userResponse = {
      id: user!.id,
      email: user!.email,
      name: user!.name,
      location: user!.location,
      country: user!.country,
      bio: user!.bio,
      avatarUrl: user!.avatarUrl,
      avatarInitial: user!.name.charAt(0).toUpperCase(),
      role: user!.role,
      level: Math.floor((user!.xpPoints || 0) / 100) + 1,
      xpPoints: user!.xpPoints,
      interests: user!.interests ? JSON.parse(user!.interests) : [],
    };

    res.json(
      ok({
        user: userResponse,
        token,
      })
    );
  } catch (e) {
    console.error(e);
    res.status(500).json(err("Internal server error"));
  }
});

router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json(err("Unauthorized"));
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        location: true,
        country: true,
        bio: true,
        avatarUrl: true,
        interests: true,
        xpPoints: true,
      },
    });

    if (!user) {
      res.status(404).json(err("User not found"));
      return;
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      location: user.location,
      country: user.country,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      avatarInitial: user.name.charAt(0).toUpperCase(),
      role: user.role,
      level: Math.floor((user.xpPoints || 0) / 100) + 1,
      xpPoints: user.xpPoints,
      interests: user.interests ? JSON.parse(user.interests) : [],
    };

    res.json(ok({ user: userResponse }));
  } catch {
    res.status(401).json(err("Invalid token"));
  }
});

router.patch("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json(err("Unauthorized"));
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { name, location, country, bio, avatarUrl, interests } = req.body as {
      name?: string;
      location?: string;
      country?: string;
      bio?: string;
      avatarUrl?: string;
      interests?: string[];
    };

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(country !== undefined && { country }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(interests !== undefined && { interests: JSON.stringify(interests) }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        location: true,
        country: true,
        bio: true,
        avatarUrl: true,
        interests: true,
        xpPoints: true,
      },
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      location: user.location,
      country: user.country,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      avatarInitial: user.name.charAt(0).toUpperCase(),
      role: user.role,
      level: Math.floor((user.xpPoints || 0) / 100) + 1,
      xpPoints: user.xpPoints,
      interests: user.interests ? JSON.parse(user.interests) : [],
    };

    res.json(ok({ user: userResponse }));
  } catch (e) {
    console.error(e);
    res.status(500).json(err("Failed to update profile"));
  }
});

export default router;