import z from "zod";

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "validade_cnh deve ser uma data válida no formato YYYY-MM-DD")
  .refine((value) => {
    if (value.startsWith("0000")) return false;
    // Garante que datas inexistentes ex: 2024-02-31 ou 2023-04-31 falhem
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "validade_cnh deve ser uma data válida no formato YYYY-MM-DD");

const todayInSaoPaulo = (now: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const value = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export { date, todayInSaoPaulo };