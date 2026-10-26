import { authorize } from "../middleware/authorization";
import { Router } from "express";
import vehicleController from "../controller/vehicleController";

const router = Router();

router.get("/", authorize("veiculos:ler"), vehicleController.getAllVehicles);
router.get(
  "/:id/trips",
  authorize("veiculos:ler"),
  vehicleController.getVehicleTrips,
);
router.get("/:id", authorize("veiculos:ler"), vehicleController.getVehicleById);
router.get(
  "/km/:id",
  authorize("veiculos:ler"),
  vehicleController.getLastNotifKM,
);
router.post(
  "/",
  authorize("veiculos:gerenciar"),
  vehicleController.createVehicle,
);
router.put(
  "/:id",
  authorize("veiculos:gerenciar"),
  vehicleController.updateVehicle,
);
router.delete(
  "/:id",
  authorize("veiculos:gerenciar"),
  vehicleController.deleteVehicle,
);

export const vehicleRoutes = router;
export default vehicleRoutes;
