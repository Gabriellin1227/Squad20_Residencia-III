import maintanceService from "../service/maintanceService";
import { createHandler, idFrom } from "../utils/controllerUtils";

const handle = createHandler(
  "Não foi possível concluir a operação de manuntenções",
);

export default {
  getAllMaintance: handle(() => maintanceService.getAllMaintance()),
  getMaintanceById: handle((req) =>
    maintanceService.getMaintanceById(idFrom(req)),
  ),
  createMaintance: handle((req) => maintanceService.createMaintance(req.body)),
  updateMaintance: handle((req) =>
    maintanceService.updateMaintance(idFrom(req), req.body),
  ),
  deleteMaintance: handle((req) =>
    maintanceService.deleteMaintance(idFrom(req)),
  ),
};
