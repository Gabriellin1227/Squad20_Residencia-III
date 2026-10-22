import { Router } from "express";
import notifController from "../controller/notifController";

const router = Router();

router.get("/", notifController.getAllNotif);
router.get("/:id", notifController.getNotifById);
router.post("/", notifController.createNotif);
router.put("/:id", notifController.updateNotif);
router.delete("/:id", notifController.deleteNotif);

export const notifRoutes = router;
export default notifRoutes;