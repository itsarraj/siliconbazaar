import asyncHandler from "express-async-handler";
import { serializeUser } from "../../lib/serializers.js";

const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json(serializeUser(req.user));
  } else {
    const message = "User is unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default getUserProfile;
