import joi from "joi";
import { date } from "../../utils/dataUtils";


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
