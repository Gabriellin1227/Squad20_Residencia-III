import type { Driver } from "../models/driverModel";
import { todayInSaoPaulo } from "../utils/dataUtils";

export const withLicenseStatus = (driver: Driver, now = new Date()) => {
  const cnh_vencida = driver.validade_cnh < todayInSaoPaulo(now);
  const alerta_cnh = cnh_vencida ? "CNH vencida." : null;
  return { ...driver, cnh_vencida, alerta_cnh };
};
