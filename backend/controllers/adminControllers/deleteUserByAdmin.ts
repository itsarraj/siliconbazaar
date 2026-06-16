import asyncHandler from "express-async-handler";
import { deleteUser, findUserById } from "../../lib/repositories.js";

const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    await deleteUser(user.id);
    res.status(200).json({ message: "User removed" });
  } else {
    const message = "User unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default deleteUserByAdmin;
