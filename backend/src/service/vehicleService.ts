import { UUID } from "node:crypto";
import vehiclesModel from "../models/vehicleModel";
import vehicleSchema from "./validations/vehicleSchema";

const getAllVechicles = async () => {
  const allVehicles = await vehiclesModel.getAllVehicles();
  return {
    type: "success",
    message: allVehicles,
    status: 200
  };
};

const getVehicleById = async (id: string) => {
  const vehicle = await vehiclesModel.getVehicleById(id);
  if (!vehicle) {
    return {
      type: "error",
      message: "Vehicle not found",
      status: 404
    };
  }
  return {
    type: "success",
    message: vehicle,
    status: 200
  };
};

export const vehicleService = { getAllVechicles, getVehicleById };
export default vehicleService;