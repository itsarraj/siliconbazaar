import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";

const getUserByAdmin = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    const message = "User unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default getUserByAdmin;
