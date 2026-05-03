import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

// Shared cookie options — must be identical when setting AND clearing the cookie
// SameSite=None + Secure=true is required for cross-origin cookies (Vercel → Render)
export const cookieOptions = {
  httpOnly: true,
  sameSite: ENV.NODE_ENV !== "development" ? "none" : "lax",
  secure: ENV.NODE_ENV !== "development",
};

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};