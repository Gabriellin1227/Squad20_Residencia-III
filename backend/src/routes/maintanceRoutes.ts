import { Router } from "express";
import maintanceController from "../controller/maintanceController";

const router = Router();

router.get("/", maintanceController.getAllMaintance);
router.get("/:id", maintanceController.getMaintanceById);
router.post("/", maintanceController.deleteMaintance);
router.put("/:id", maintanceController.updateMaintance);
router.delete("/:id", maintanceController.deleteMaintance);