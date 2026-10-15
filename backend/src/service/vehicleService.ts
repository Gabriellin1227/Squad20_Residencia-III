import vehiclesModel from "../models/vehicleModel";
import vehicleSchema from "./validations/vehicleSchema";

const getAllVechicles = async () => {
  const allVehicles = await vehiclesModel.getAllVehicles();
  return {
    type: "success",
    message: allVehicles,
    status: 200
  }

}

export default { getAllVechicles };