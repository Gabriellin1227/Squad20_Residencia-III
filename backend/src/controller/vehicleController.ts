import vehicleService from "../service/vehicles/vehicleService";
import { createHandler, idFrom } from "../utils/controllerUtils";

const handle = createHandler(
  "Não foi possível concluir a operação de manuntenções",
);

export default {
  getVehicleTrips: handle((req) => vehicleService.getVehicleTrips(idFrom(req))),
  getAllVehicles: handle(() => vehicleService.getAllVehicles()),
  getVehicleById: handle((req) => vehicleService.getVehicleById(idFrom(req))),
  getLastNotifKM: handle((req) => vehicleService.getLastNotifKM(idFrom(req))),
  createVehicle: handle((req) => vehicleService.createVehicle(req.body)),
  updateVehicle: handle((req) =>
    vehicleService.updateVehicle(idFrom(req), req.body),
  ),
  deleteVehicle: handle((req) => vehicleService.deleteVehicle(idFrom(req))),
};
