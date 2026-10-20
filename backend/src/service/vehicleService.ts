import { UUID } from "node:crypto";
import vehicleModel, { Vehicle } from "../models/vehicleModel";
import vehicleSchema from "../middleware/validations/vehicleSchema";

const getAllVechicles = async () => {
  const allVehicles = await vehicleModel.getAllVehicles();
  return {
    type: "success",
    message: allVehicles,
    status: 200
  };
};

const getVehicleById = async (id: string) => {
  const vehicle = await vehicleModel.getVehicleById(id);
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

const createVehicle = async (vehicle: Vehicle) => {
  const validateVehicle = vehicleSchema.validate(vehicle);
  if (validateVehicle.error) {
    return {
      type: "error",
      message: validateVehicle.error.details[0].message,
      status: 400
    };
  }
  const insertUUIDVehicle = await vehicleModel.createVehicle(vehicle);
  return {
    type: "success",
    message: `Vehicle created with ID: ${insertUUIDVehicle}`,
    status: 201
  };

};

export default { 
  getAllVechicles,
  getVehicleById,
  createVehicle 
};