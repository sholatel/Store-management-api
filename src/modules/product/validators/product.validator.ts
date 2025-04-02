import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  price: Joi.number().required().min(0),
  description: Joi.string().max(500),
  storeId: Joi.string().hex().length(24).required()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  price: Joi.number().min(0),
  description: Joi.string().max(500)
}).min(1); // At least one field required
