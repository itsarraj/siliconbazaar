import asyncHandler from "express-async-handler";
import { findUsersExcept } from "../../lib/repositories.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await findUsersExcept(req.user!.id);

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
