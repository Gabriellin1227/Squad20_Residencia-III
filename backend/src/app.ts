import express from "express";
import cors from "cors";
import { vehicleRoutes } from "./routes/vehicleRoutes";
import { driverRoutes } from "./routes/driverRoutes";
import maintanceRoutes from "./routes/maintanceRoutes";
import notifRoutes from "./routes/notifRoutes";
import profileRoutes from "./routes/profileRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import alertRoutes from "./routes/alertRoutes";

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/vehicles", vehicleRoutes);
app.use("/drivers", driverRoutes);
app.use("/maintance", maintanceRoutes);
app.use("/notification", notifRoutes);
app.use("/perfis", profileRoutes);
app.use("/usuarios", userProfileRoutes);
app.use("/alerts", alertRoutes);

export default app;

// npm cache clean --force
