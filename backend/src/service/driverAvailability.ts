import type { Driver } from "../models/driverModel";

const todayInSaoPaulo = (now: Date): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export const withLicenseStatus = (driver: Driver, now = new Date()) => {
  const cnh_vencida = driver.validade_cnh < todayInSaoPaulo(now);
  const alerta_cnh = cnh_vencida ? "CNH vencida." : null;
  return { ...driver, cnh_vencida, alerta_cnh };
};
