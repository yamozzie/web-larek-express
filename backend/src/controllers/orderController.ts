import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { Joi } from 'celebrate';

import { BadRequestError } from '../errors/badRequestError';
import Product from '../models/productModel';

interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const orderSchema = Joi.object<IOrder>({
  payment: Joi.equal('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/)
    .required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().required(),
});

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const { error, value } = orderSchema.validate(req.body as IOrder)

    if (error) {
      return next(new BadRequestError(`Validation error: ${error.message}`))
    }

    const products = (
      await Product.find({
        _id: {
          $in: value.items.map(
            (item: string) => new mongoose.Types.ObjectId(item),
          ),
        },
      })
    ).filter((product) => !!product.price);

    if (products.length !== value.items.length) {
      return next(
        new BadRequestError(
          'Product data error: not all products are available now'
        )
      )
    }

    const totalPrice = products.reduce((acc, p) => acc + (p.price || 0), 0);
    if (value.total !== totalPrice) {
      return next(
        new BadRequestError(
          'Order data error: Order total is not equal products prices'
        )
      )
    }

    const orderId = faker.string.uuid();
    return res.status(200).json({ id: orderId, total: totalPrice });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
