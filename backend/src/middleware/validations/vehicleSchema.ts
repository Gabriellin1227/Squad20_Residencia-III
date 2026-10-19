import joi from 'joi';

const vehicleSchema = joi.object({
  placa: joi.string().required(),
  modelo: joi.string().required(),
  tipo_combustivel: joi.string().required(),
  capacidade_maxima: joi.number().required(),
  teto_gasto_mensal: joi.number().allow(0).optional(),
  status: joi.string().valid('ativo', 'inativo').optional(),
  ativo: joi.boolean().optional(),
  deletado_em: joi.date().allow(null),
  criado_em: joi.date().optional(),
  atualizado_em: joi.date().optional()
}).min(1);

export default vehicleSchema;