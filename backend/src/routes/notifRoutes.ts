import { authorize } from "../middleware/authorization";
import { Router } from "express";
import notifController from "../controller/notifController";

const router = Router();

router.get("/", authorize("notificacoes:ler"), notifController.getAllNotif);
router.get("/:id", authorize("notificacoes:ler"), notifController.getNotifById);
router.post(
  "/",
  authorize("notificacoes:gerenciar"),
  notifController.createNotif,
);
router.put(
  "/:id",
  authorize("notificacoes:gerenciar"),
  notifController.updateNotif,
);
router.delete(
  "/:id",
  authorize("notificacoes:gerenciar"),
  notifController.deleteNotif,
);

export const notifRoutes = router;
export default notifRoutes;
