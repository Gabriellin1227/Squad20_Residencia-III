import { Router } from "express";
import alertController from "../controller/alertController";

const router = Router();

router.get("/resume", alertController.getSummary);

export default router;
