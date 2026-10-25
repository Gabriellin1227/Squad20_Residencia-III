import type { Request, Response } from "express";

export const idFrom = (req: Request, param = "id"): string => {
  const value = req.params[param];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
};

type ServiceResult = { message: unknown; status: number };

export const createHandler =
  (errorMessage: string) =>
  (operation: (req: Request) => Promise<ServiceResult>) =>
  async (req: Request, res: Response) => {
    try {
      const { message, status } = await operation(req);
      res.status(status).json({ message });
    } catch (err) {
      console.error(`${errorMessage}:`, err);
      res.status(500).json({ message: errorMessage });
    }
  };
