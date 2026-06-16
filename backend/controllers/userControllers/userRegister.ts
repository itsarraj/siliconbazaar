import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import getToken from "../../util/getToken.js";
import { hashPassword, matchPassword } from "../../util/password.js";
import { serializeUser } from "../../lib/serializers.js";

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400).json({ message: "User exists" });
    return;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      isAdmin: false,
      authProvider: "local",
    },
  });

  res.status(201).json({
    ...serializeUser(user),
    token: getToken(user.id),
  });
});

export default userRegister;
