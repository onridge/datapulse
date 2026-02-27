import { IUser } from "../models/User";

export interface Context {
  user: { id: string } | null;
}
