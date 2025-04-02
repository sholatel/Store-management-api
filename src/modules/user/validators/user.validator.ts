import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});