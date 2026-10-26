import { z } from "zod";
import vehicleSchema from "./vehicleSchema";

export const notifSchema = z
  .object({
    usuario_id: z.string(), // lembrar de mudar aq p userId do schema
    tipo_alerta: z.enum(["sistema", "email"]),
    mensagem: z.string().optional(),
    lida: z.boolean(),

    criada_em: z.coerce.date().optional(),
    veiculo_id: vehicleSchema,
    lida_em: z.coerce.date().optional(),
    ativo: z.boolean(),
  })
  .strict();

export const notifIdSchema = z.string().uuid("UUID invalido");
export type NotifInput = z.infer<typeof notifSchema>;

export default notifSchema;
