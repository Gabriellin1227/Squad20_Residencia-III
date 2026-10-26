import { authorize } from "../middleware/authorization";
import { Router } from "express";
import driverController from "../controller/driverController";
import { validateCpf } from "../middleware/validations/cpf";

const router = Router();

router.get("/", authorize("motoristas:ler"), driverController.getAllDrivers);
router.get("/:id", authorize("motoristas:ler"), driverController.getDriverById);
router.post(
  "/",
  authorize("motoristas:gerenciar"),
  validateCpf,
  driverController.createDriver,
);
router.put(
  "/:id",
  authorize("motoristas:gerenciar"),
  validateCpf,
  driverController.updateDriver,
);
router.delete(
  "/:id",
  authorize("motoristas:gerenciar"),
  driverController.deleteDriver,
);

export const driverRoutes = router;
export default driverRoutes;
