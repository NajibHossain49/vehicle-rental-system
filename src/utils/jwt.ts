import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

export const signToken = (payload: { id: number; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: number; role: string };
};
