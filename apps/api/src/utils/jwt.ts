import jwt from "jsonwebtoken";

import { config } from "../config";

export interface JwtPayload {
  id: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
};
