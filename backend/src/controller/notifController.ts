import { Request, Response } from "express";
import notifService from "../service/notifService";

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
  getAllNotif: handle(() => notifService.getAllNotif()),
  getNotifById: handle(req => notifService.getNotifById(idFrom(req))),
  createNotif: handle(req => notifService.createNotif(req.body)),
  updateNotif: handle(req => notifService.updateNotif(idFrom(req), req.body)),
  deleteNotif: handle(req => notifService.deleteNotif(idFrom(req))),
};