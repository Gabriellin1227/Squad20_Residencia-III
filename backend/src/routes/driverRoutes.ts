import { Router } from "express";
import driverController from "../controller/driverController";
import { validateCpf } from "../middleware/cpf";

const router = Router();

router.get("/", driverController.getAllDrivers);
router.get("/:id", driverController.getDriverById);
router.post("/", validateCpf, driverController.createDriver);
router.put("/:id", validateCpf, driverController.updateDriver);
router.delete("/:id", driverController.deleteDriver);

export const driverRoutes = router;
export default driverRoutes;
