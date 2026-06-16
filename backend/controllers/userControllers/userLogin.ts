import asyncHandler from "express-async-handler";
import { findUserByEmail } from "../../lib/repositories.js";
import getToken from "../../util/getToken.js";
import { matchPassword } from "../../util/password.js";
import { serializeUser } from "../../lib/serializers.js";

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    const message =
      user?.authProvider === "google"
        ? "This account uses Google sign-in. Please continue with Google."
        : "Invalid Email Address or Password";
    res.status(401).json({ message });
    throw new Error(message);
  }

  if (await matchPassword(password, user.password)) {
    res.status(200).json({
      ...serializeUser(user),
      token: getToken(user.id),
    });
  } else {
    const message = "Invalid Email Address or Password";
    res.status(401).json({ message });
    throw new Error(message);
  }
});

export default userLogin;
