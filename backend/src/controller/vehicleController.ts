import { Request, Response } from "express";
import vehicleService from "../service/vehicleService";
import { create } from "node:domain";

const getAllVehicle = async (req: Request, res: Response) => {
  const { message, status } = await vehicleService.getAllVechicles();
  res.status(status).json({ message });
};

const getVehicleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cleanId = Array.isArray(id) ? id[0].trim() : id.trim();
  const { message, status } = await vehicleService.getVehicleById(cleanId);
  res.status(status).json({ message });
};

const createVehicle = async (req: Request, res: Response) => {
  const vehicle = req.body;
  const { type, message , status } = await vehicleService.createVehicle(vehicle);
  if (type) {
    return res.status(status).json({message});
  } else {
    return res.status(201).json({message});
  }
};

export default { 
  getAllVehicle,
  getVehicleById,
  createVehicle
};