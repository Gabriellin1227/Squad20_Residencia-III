import driverService from "../service/driver/driverService";
import { createHandler, idFrom } from "../utils/controllerUtils";

const handle = createHandler(
  "Não foi possível concluir a operação de motoristas",
);

export default {
  getAllDrivers: handle(() => driverService.getAllDrivers()),
  getDriverById: handle((req) => driverService.getDriverById(idFrom(req))),
  createDriver: handle((req) => driverService.createDriver(req.body)),
  updateDriver: handle((req) =>
    driverService.updateDriver(idFrom(req), req.body),
  ),
  deleteDriver: handle((req) => driverService.deleteDriver(idFrom(req))),
};
