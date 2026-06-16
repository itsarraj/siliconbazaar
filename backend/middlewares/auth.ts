import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { findUserById } from "../lib/repositories.js";
import type { SafeUser } from "../lib/types.js";

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
      const user = await findUserById(decoded.id);
      if (!user) {
        res.status(401).json({ message: "Unauthorized User Access" });
        return;
      }
      const { password: _password, ...safeUser } = user;
      req.user = safeUser as SafeUser;
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
