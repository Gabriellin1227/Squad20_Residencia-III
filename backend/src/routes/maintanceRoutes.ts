import { authorize } from "../middleware/authorization";
import { Router } from "express";
import maintanceController from "../controller/maintanceController";

const router = Router();

router.get(
  "/",
  authorize("manutencoes:ler"),
  maintanceController.getAllMaintance,
);
router.get(
  "/:id",
  authorize("manutencoes:ler"),
  maintanceController.getMaintanceById,
);
router.post(
  "/",
  authorize("manutencoes:gerenciar"),
  maintanceController.createMaintance,
);
router.put(
  "/:id",
  authorize("manutencoes:gerenciar"),
  maintanceController.updateMaintance,
);
router.delete(
  "/:id",
  authorize("manutencoes:gerenciar"),
  maintanceController.deleteMaintance,
);

export const maintanceRoutes = router;
export default maintanceRoutes;
