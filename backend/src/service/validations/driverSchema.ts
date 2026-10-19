import joi from "joi";


const date = joi.string().custom((value: string, helpers) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return helpers.error("any.invalid");
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    ? value : helpers.error("any.invalid");
}).messages({ "any.invalid": "validade_cnh deve ser uma data válida no formato YYYY-MM-DD" });

export const driverSchema = joi.object({
  nome: joi.string().trim().min(3).max(150).required(),
  cpf: joi.string().required(),
  cnh: joi.string().trim().pattern(/^\d{11}$/).required(),
  categoria: joi.string().trim().uppercase().valid("ACC", "A", "B", "C", "D", "E", "AB", "AC", "AD", "AE").required(),
  validade_cnh: date.required(),
  motorista_coringa: joi.boolean().strict(),
}).unknown(false);

export const driverIdSchema = joi.string().guid().required();
export default driverSchema;
