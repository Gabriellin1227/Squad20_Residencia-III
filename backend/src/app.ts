import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { vehicleRoutes } from "./routes/vehicleRoutes";
import { driverRoutes } from "./routes/driverRoutes";
import maintanceRoutes from "./routes/maintanceRoutes";
import notifRoutes from "./routes/notifRoutes";

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use("/vehicles", vehicleRoutes);
app.use("/drivers", driverRoutes);
app.use("/maintance", maintanceRoutes);
app.use("/notification", notifRoutes);

export default app;

// npm cache clean --force
