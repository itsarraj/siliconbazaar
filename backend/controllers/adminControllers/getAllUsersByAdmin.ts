import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { id: { not: req.user!.id } },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(
    users.map((user) => ({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }))
  );
});

export default getAllUsers;
