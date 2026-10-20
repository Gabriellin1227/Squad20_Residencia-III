import driverModel from "../models/driverModel";
import driverSchema, { driverIdSchema } from "../middleware/validations/driverSchema";
import { withLicenseStatus } from "./driverAvailability";

const success = (message: unknown, status = 200) => ({ type: "success", message, status });
const error = (message: string, status: number) => ({ type: "error", message, status });
const invalidId = (id: string) => driverIdSchema.validate(id).error;
const notFound = () => error("Motorista não encontrado", 404);

const documentConflict = (cause: unknown) => {
  const dbError = cause as { code?: string; constraint?: string };
  if (dbError?.code !== "23505") throw cause;
  if (dbError.constraint === "motoristas_cpf_key") return error("CPF já cadastrado", 409);
  if (dbError.constraint === "motoristas_cnh_key") return error("CNH já cadastrada", 409);
  throw cause;
};

const getAllDrivers = async () => success((await driverModel.getAllDrivers()).map(driver => withLicenseStatus(driver)));

const getDriverById = async (id: string) => {
  if (invalidId(id)) return error("ID de motorista inválido", 400);
  const driver = await driverModel.getDriverById(id);
  return driver ? success(withLicenseStatus(driver)) : notFound();
};

const createDriver = async (body: unknown) => {
  const validation = driverSchema.required().validate(body, { abortEarly: false });
  if (validation.error) return error(validation.error.message, 400);
  try {
    return success(withLicenseStatus(await driverModel.createDriver(validation.value)), 201);
  } catch (cause) {
    return documentConflict(cause);
  }
};

const updateDriver = async (id: string, body: unknown) => {
  if (invalidId(id)) return error("ID de motorista inválido", 400);
  const validation = driverSchema.required().validate(body, { abortEarly: false });
  if (validation.error) return error(validation.error.message, 400);
  try {
    const driver = await driverModel.updateDriver(id, validation.value);
    return driver ? success(withLicenseStatus(driver)) : notFound();
  } catch (cause) {
    return documentConflict(cause);
  }
};

const deleteDriver = async (id: string) => {
  if (invalidId(id)) return error("ID de motorista inválido", 400);
  return await driverModel.deleteDriver(id) ? success("Motorista excluído com sucesso") : notFound();
};

export const driverService = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver };
export default driverService;
