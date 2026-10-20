import joi from "joi";

const date = joi.string().custom((value: string, helpers) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return helpers.error("any.invalid");
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    ? value : helpers.error("any.invalid");
}).messages({ "any.invalid": "validade_cnh deve ser uma data válida no formato YYYY-MM-DD" });

const todayInSaoPaulo = (now: Date): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export { date, todayInSaoPaulo };
