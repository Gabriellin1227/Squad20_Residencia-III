import { Request, Response } from "express";
import driverService from "../service/driver/driverService";

const idFrom = (req: Request): string => {
  const id = req.params.id;
  return (Array.isArray(id) ? id[0] : id)?.trim() ?? "";
};

const handle = (operation: (req: Request) => Promise<{ message: unknown; status: number }>) =>
  async (req: Request, res: Response) => {
    try {
      const { message, status } = await operation(req);
      res.status(status).json({ message });
    } catch {
      res.status(500).json({ message: "Não foi possível concluir a operação de motoristas" });
    }
  };

export default {
  getAllDrivers: handle(() => driverService.getAllDrivers()),
  getDriverById: handle(req => driverService.getDriverById(idFrom(req))),
  createDriver: handle(req => driverService.createDriver(req.body)),
  updateDriver: handle(req => driverService.updateDriver(idFrom(req), req.body)),
  deleteDriver: handle(req => driverService.deleteDriver(idFrom(req))),
};