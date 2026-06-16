import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";

interface JwtPayload {
  id: string;
}

const userAuth = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        res.status(400).json({ message: "No token found" });
        return;
      }
      const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          authProvider: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        res.status(401).json({ message: "Unauthorized User Access" });
        return;
      }
      req.user = user;
      next();
    } catch {
      const message = "Unauthorized User Access";
      res.status(401).json({ message });
      throw new Error(message);
    }
  } else {
    res.status(401).json({ message: "No authorization token" });
  }
});

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    const message = "Unauthorized Admin Access";
    res.status(401).json({ message });
    throw new Error(message);
  }
};

export { userAuth, adminAuth };
