import { Router } from "express";
import vehicleController from "../controller/vehicleController";

const router = Router();

router.get("/", vehicleController.getAllVehicles);
router.get("/:id", vehicleController.getVehicleById);
router.get("/km/:id", vehicleController.getLastNotifKM);
router.post("/", vehicleController.createVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

export const vehicleRoutes = router;
export default vehicleRoutes;
