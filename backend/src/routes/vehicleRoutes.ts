import { Router } from "express";
import vehicleController from "../controller/vehicleController";

const router = Router();

router.get("/", vehicleController.getAllVehicle);
router.get("/:id", vehicleController.getVehicleById);
router.post("/", vehicleController.createVehicle);

export const vehicleRoutes = router;
export default vehicleRoutes;