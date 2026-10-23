import z from "zod";
import { vehicleIdSchema } from "./vehicleSchema";

export const maintanceSchema = z.object({
  veiculo_id: vehicleIdSchema,
  tipo_manutencao: z.enum([
    "preventiva", "impeditiva"
  ]),
  data_inicio: z.coerce.date().optional(),
  data_fim: z.coerce.date().optional(),
  custo: z.number().positive("Teto de gasto não pode ser negativo").optional(),
  descricao: z.string().trim().optional(),
  status: z.enum([
    "ativo", "inativo"
  ]),
  criado_em: z.coerce.date().optional(),
  atualizado_em: z.coerce.date().optional(),
  km_realizado: z.number().positive("Teto de gasto não pode ser negativo").optional(),
  km_proxima: z.number().positive("Teto de gasto não pode ser negativo").optional()
}).strict();

export const maintanceIdSchema = z.string().uuid("UUID inválido");
export type MaintenaceInput = z.infer<typeof maintanceSchema>;

export default maintanceSchema;
/*

    veiculo_id
    tipo_manutencao 
    data_inicio 
    data_fim 
    custo 
    descricao 
    status 
*/
