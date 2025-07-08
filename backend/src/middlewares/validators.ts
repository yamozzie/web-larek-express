import { celebrate, Joi, Segments } from 'celebrate';

export const orderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(
      Joi.string().min(1).required(),
    ),
  }),
});
