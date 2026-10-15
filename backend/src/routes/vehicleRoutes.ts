import { Router } from "express";
import vehicleController from "../controller/vehicleController";
import pool from "../db";

const router = Router();

router.get("/vehicle", vehicleController.getAllVehicle);

