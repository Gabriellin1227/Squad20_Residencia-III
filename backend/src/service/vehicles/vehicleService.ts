import vehicleModel, { Vehicle } from "../../models/vehicleModel";
import vehicleSchema, {
  vehicleIdSchema,
} from "../../middleware/validations/schemas/vehicleSchema";
import { checkVehicleAvailability } from "./vehicleAvailability";

const success = (message: unknown, status = 200) => ({
  type: "success",
  message,
  status,
});
const error = (message: string, status: number) => ({
  type: "error",
  message,
  status,
});
const invalidId = (id: string) => !vehicleIdSchema.safeParse(id).success;
const notFound = () => error("Vehicle not found", 404);

const handleDuplicateKeyError = (cause: unknown) => {
  const dbError = cause as { code?: string; constraint?: string };
  if (dbError?.code !== "23505") throw cause;
  if (dbError.constraint === "veiculos_placa_key")
    return error("Placa já cadastrada", 409);
  throw cause;
};

const getAllVehicles = async () =>
  success(
    (await vehicleModel.getAllVehicles()).map((vehicle) =>
      checkVehicleAvailability(vehicle),
    ),
  );

const getVehicleById = async (id: string) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  const vehicle = await vehicleModel.getVehicleById(id);
  return vehicle ? success(checkVehicleAvailability(vehicle)) : notFound();
};

const getLastNotifKM = async (id: string) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  const vehicle = await vehicleModel.getLastNotifKM(id);
  return vehicle ? success(checkVehicleAvailability(vehicle)) : notFound();
};

const createVehicle = async (body: unknown) => {
  const validation = vehicleSchema.safeParse(body);
  if (!validation.success) return error(validation.error.message, 400);
  try {
    const createdVehicle = await vehicleModel.createVehicle(
      validation.data as Vehicle,
    );
    return success(checkVehicleAvailability(createdVehicle), 201);
  } catch (cause) {
    return handleDuplicateKeyError(cause);
  }
};

const updateVehicle = async (id: string, body: unknown) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  const validation = vehicleSchema.safeParse(body);
  if (validation.error) return error(validation.error.message, 400);
  try {
    const vehicle = await vehicleModel.updateVehicle(id, validation.data);
    return vehicle ? success(checkVehicleAvailability(vehicle)) : notFound();
  } catch (cause) {
    const dbError = cause as { code?: string; constraint?: string };
    if (dbError?.code !== "23505") throw cause;
    if (dbError.constraint === "veiculos_placa_key")
      return error("Placa já cadastrada", 409);
    throw cause;
  }
};

const deleteVehicle = async (id: string) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  return (await vehicleModel.deleteVehicle(id))
    ? success("Vehicle deleted successfully")
    : notFound();
};

export = {
  getAllVehicles,
  getVehicleById,
  getLastNotifKM,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
