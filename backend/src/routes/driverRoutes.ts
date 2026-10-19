import { Router } from "express";
import driverController from "../controller/driverController";
import { validateCpf } from "../middleware/cpf";

const router = Router();

router.get("/driver", driverController.getAllDrivers);
router.get("/driver/:id", driverController.getDriverById);
router.post("/driver", validateCpf, driverController.createDriver);
router.put("/driver/:id", validateCpf, driverController.updateDriver);
router.delete("/driver/:id", driverController.deleteDriver);

export const driverRoutes = router;
export default driverRoutes;
