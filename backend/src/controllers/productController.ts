import { Request, Response, NextFunction } from 'express';
import Product from '../models/productModel';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.send({ items: products, total: products.length });
  } catch (error) {
    next(error);
  }
};

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
    res.send({ data: product });
  } catch (error) {
    next(error);
  }
};
