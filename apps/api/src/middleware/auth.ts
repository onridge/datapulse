import { verifyToken } from "../utils/jwt";

import type { Request } from "express";

export const getUserFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  return verifyToken(token);
};
