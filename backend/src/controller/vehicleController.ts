import { Request, Response } from "express";
import vehicleService from "../service/vehicles/vehicleService";
const testando = "hello world!"


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
      res.status(500).json({ message: "Não foi possível concluir a operação de veículos" });
    }
};

export default {
  getAllVehicles: handle(() => vehicleService.getAllVehicles()),
  getVehicleById: handle(req => vehicleService.getVehicleById(idFrom(req))),
  getLastNotifKM: handle(req => vehicleService.getLastNotifKM(idFrom(req))),
  createVehicle: handle(req => vehicleService.createVehicle(req.body)),
  updateVehicle: handle(req => vehicleService.updateVehicle(idFrom(req), req.body)),
  deleteVehicle: handle(req => vehicleService.deleteVehicle(idFrom(req))),
};