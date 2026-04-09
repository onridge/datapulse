export interface Context {
  req: any;
  res: any;
  userId: string | null;
  token: string | null;
}
