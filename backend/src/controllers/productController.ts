import { Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import Product, { IProduct } from '../models/productModel';
import ConflictError from '../errors/conflictError';
import BadRequestError from '../errors/badRequestError';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.status(200).send({ items: products, total: products.length });
  } catch (error) {
    next(error);
  }
};

export const productSchema = Joi.object<IProduct>({
  title: Joi.string().min(3).max(30).required(),
  image: { fileName: Joi.string(), originalName: Joi.string() },
  category: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
});

export const productRouteValidator = celebrate({
  [Segments.BODY]: productSchema,
});

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;
    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });
    return res.status(201).send({ data: product });
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError(error.message));
    }

    if (error.name === 'ValidationError') {
      return next(new BadRequestError(`Validation error: ${error.message}`));
    }

    return next(error);
  }
};
