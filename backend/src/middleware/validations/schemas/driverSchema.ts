import { z } from "zod";
import { cpfSchema } from "../cpf";
import { date } from "../../../utils/dataUtils";
// Schema do Motorista
export const driverSchema = z
  .object({
    nome: z.string().trim().min(3).max(150),
    cpf: cpfSchema,
    cnh: z
      .string()
      .trim()
      .regex(/^\d{11}$/, "CNH deve conter exatamente 11 dígitos"),
    categoria: z.enum(["ACC", "A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"]),

    // Trata entrada em string/Data e converte para Date válida
    validade_cnh: date,
    motorista_coringa: z.boolean().optional(),
  })
  .strict(); // Corresponde ao .unknown(false) do Joi

// Schema de ID uuid
export const driverIdSchema = z.string().uuid("ID inválido");
// Inferência automática de type
export type DriverInput = z.infer<typeof driverSchema>;

export default driverSchema;
