import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../util/password.js";
import { serializeUser } from "../../lib/serializers.js";

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

  if (!user) {
    const message = "User is unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }

  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name || user.name,
      email: email || user.email,
      ...(password ? { password: await hashPassword(password) } : {}),
    },
  });

  res.status(201).json(serializeUser(updatedUser));
});

export default updateUserProfile;
