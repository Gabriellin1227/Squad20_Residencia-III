import type { Driver } from "../../models/driverModel";
import { todayInSaoPaulo } from "../../utils/dataUtils";

export const withLicenseStatus = (driver: Driver, now = new Date()) => {
  const validade = driver.validade_cnh; // já vem como "YYYY-MM-DD"
  const cnh_vencida = validade < todayInSaoPaulo(now);
  const alerta_cnh = cnh_vencida ? "CNH vencida." : null;
  return { ...driver, cnh_vencida, alerta_cnh };
};
