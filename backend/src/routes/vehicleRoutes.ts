import { Router } from "express";
import vehicleController from "../controller/vehicleController";

const router = Router();

router.get("/vehicle", vehicleController.getAllVehicle);
router.get("/vehicle/:id", vehicleController.getVehicleById);

export const vehicleRoutes = router;
export default vehicleRoutes;