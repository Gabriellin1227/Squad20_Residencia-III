import joi from 'joi';

const vehicleSchema = joi.object({
  id: joi.string().guid({ version: 'uuidv4' }).required(),
  placa: joi.string().required(),
  modelo: joi.string().required(),
  tipo_combustivel: joi.string().required(),
  capacidade_maxima: joi.number().required(),
  total_gasto_mensal: joi.number().allow(0).optional(),
  status: joi.string().valid('ativo', 'inativo').required(),
  ativo: joi.boolean().required(),
  deletado_em: joi.date().allow(null),
  criado_em: joi.date().required(),
  atualizado_em: joi.date().required()
}).min(1);

export default vehicleSchema;