import { Request, Response } from "express";
import maintanceService from "../service/maintanceService";

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
      res.status(500).json({ message: "Não foi possível concluir a operação de Manuntenção" });
    }
};

export default {
  getAllMaintance: handle(() => maintanceService.getAllMaintance()),
  getMaintanceById: handle(req => maintanceService.getMaintanceById(idFrom(req))),
  createMaintance: handle(req => maintanceService.createMaintance(req.body)),
  updateMaintance: handle(req => maintanceService.updateMaintance(idFrom(req), req.body)),
  deleteMaintance: handle(req => maintanceService.deleteMaintance(idFrom(req))),
};