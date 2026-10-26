import { Vehicle } from "../../models/vehicleModel";

const checkVehicleAvailability = (vehicle: Vehicle) => {
  const isAvailable =
    ["ativo", "Disponível"].includes(vehicle.status) &&
    vehicle.ativo &&
    !vehicle.deletado_em;
  const alerta_status = isAvailable ? null : "Veículo indisponível.";

  return { ...vehicle, isAvailable, alerta_status };
};

export { checkVehicleAvailability };
