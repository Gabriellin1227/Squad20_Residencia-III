import vehicleModel, { Vehicle } from "../models/vehicleModel";
import vehicleSchema, { vehicleIdSchema } from "../middleware/validations/vehicleSchema";
import { checkVehicleAvailability } from "./vehicleAvailability";


const success = (message: unknown, status = 200) => ({ type: "success", message, status });
const error = (message: string, status: number) => ({ type: "error", message, status });
const invalidId = (id: string) => vehicleIdSchema.validate(id).error;
const notFound = () => error("Vehicle not found", 404);

const getAllVehicles = async () => success(((await vehicleModel.getAllVehicles()).map(vehicle => checkVehicleAvailability(vehicle))));

const getVehicleById = async (id: string) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  const vehicle = await vehicleModel.getVehicleById(id);
  return vehicle ? success(checkVehicleAvailability(vehicle)) : notFound();
};

const createVehicle = async (body: unknown) => {
  const validation = vehicleSchema.required().validate(body, { abortEarly: false });
  if (validation.error) return error(validation.error.message, 400);
  try {
    return success(checkVehicleAvailability(await vehicleModel.createVehicle(validation.value)), 201);
  } catch (cause) {
    const dbError = cause as { code?: string; constraint?: string };
    if (dbError?.code !== "23505") throw cause;
    if (dbError.constraint === "veiculos_placa_key") return error("Placa já cadastrada", 409);
    throw cause;
  }
};

const updateVehicle = async (id: string, body: unknown) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  const validation = vehicleSchema.required().validate(body, { abortEarly: false });
  if (validation.error) return error(validation.error.message, 400);
  try {
    const vehicle = await vehicleModel.updateVehicle(id, validation.value);
    return vehicle ? success(checkVehicleAvailability(vehicle)) : notFound();
  } catch (cause) {
    const dbError = cause as { code?: string; constraint?: string };
    if (dbError?.code !== "23505") throw cause;
    if (dbError.constraint === "veiculos_placa_key") return error("Placa já cadastrada", 409);
    throw cause;
  }
};

const deleteVehicle = async (id: string) => {
  if (invalidId(id)) return error("Invalid vehicle ID", 400);
  return await vehicleModel.deleteVehicle(id) ? success("Vehicle deleted successfully") : notFound();
};

export = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
