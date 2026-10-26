import { z } from "zod";
import { vehicleIdSchema } from "./vehicleSchema";

export const maintanceSchema = z
  .object({
    veiculo_id: vehicleIdSchema,
    tipo_manutencao: z.enum(["preventiva", "impeditiva"]),
    data_inicio: z.coerce.date().optional(),
    data_fim: z.coerce.date().nullable().optional(),
    custo: z.number().nonnegative("Custo não pode ser negativo"),
    descricao: z.string().trim().nullable().optional(),
    status: z.enum(["Em Andamento", "Concluída", "Cancelada"]),
    km_realizado: z.number().int().nonnegative().nullable().optional(),
    km_proxima: z.number().int().nonnegative().nullable().optional(),
  })
  .strict()
  .refine(
    (value) =>
      !value.data_inicio ||
      !value.data_fim ||
      value.data_fim >= value.data_inicio,
    "Data final deve ser posterior ou igual à inicial",
  )
  .refine(
    (value) =>
      value.km_proxima == null ||
      value.km_realizado == null ||
      value.km_proxima > value.km_realizado,
    "Próxima quilometragem deve ser maior que a realizada",
  );
export const maintanceIdSchema = z.string().uuid("UUID inválido");
export type MaintenaceInput = z.infer<typeof maintanceSchema>;
export default maintanceSchema;
