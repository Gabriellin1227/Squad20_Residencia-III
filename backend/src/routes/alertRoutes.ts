import { authorize } from "../middleware/authorization";
import { Router } from "express";
import alertController from "../controller/alertController";

const router = Router();

router.get("/resume", authorize("manutencoes:ler"), alertController.getSummary);

export default router;
