import { Request, Response } from "express";
import vehicleService from "../service/vehicleService";

const getAllVehicle = async (req: Request, res: Response) => {
  const { message, status } = await vehicleService.getAllVechicles();
  res.status(status).json({ message });
}

export default { getAllVehicle };