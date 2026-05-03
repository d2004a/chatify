import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

// Automatically detect if we are in a cross-origin production environment
const isLocal = ENV.CLIENT_URL?.includes("localhost");

export const cookieOptions = {
  httpOnly: true,
  sameSite: !isLocal ? "none" : "lax",
  secure: !isLocal,
};

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  const options = { ...cookieOptions };
  
  // In local development, keep the user logged in for 7 days.
  // In production, make it a session cookie so it clears when the browser is closed.
  if (isLocal) {
    options.maxAge = 7 * 24 * 60 * 60 * 1000;
  }

  res.cookie("jwt", token, options);

  return token;
};