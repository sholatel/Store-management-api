import Joi from 'joi';

export const createStoreSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  location: Joi.string().required().min(5).max(100)
});
