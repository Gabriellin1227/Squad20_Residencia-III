import driverModel from "../../models/driverModel";
import vehicleModel from "../../models/vehicleModel";

const LICENSE_WARN_DAYS = 30;
const MAINTANCE_INTERVAL_KM = 10000;
const MAINTANCE_WARN_KM = 500;

export const getLicenseAlerts = async () => {
  const drivers = await driverModel.getDriverWLicenseExp(LICENSE_WARN_DAYS);
  return drivers.map((d) => ({
    ...d,
    severity:
      d.dias_restantes < 0
        ? "critica"
        : d.dias_restantes <= 7
          ? "alta"
          : "aviso",
  }));
};

export const getMaintanceAlerts = async () => {
  const vehicles = await vehicleModel.getNearMaintance(
    MAINTANCE_INTERVAL_KM,
    MAINTANCE_WARN_KM,
  );
  return vehicles.map((v) => ({
    ...v,
    severity: v.km_restantes <= 0 ? "critica" : "aviso",
  }));
};
