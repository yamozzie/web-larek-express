import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { BadRequestError } from '../errors/badRequestError';
import Product from '../models/productModel';

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    if (!payment || !['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Неверный способ оплаты'));
    }
    if (!email || !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      return next(new BadRequestError('Некорректный email'));
    }
    if (!phone || typeof phone !== 'string') {
      return next(new BadRequestError('Некорректный телефон'));
    }
    if (!address || typeof address !== 'string') {
      return next(new BadRequestError('Некорректный адрес'));
    }
    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Массив товаров пуст или отсутствует'));
    }
    if (typeof total !== 'number' || Number.isNaN(total)) {
      return next(new BadRequestError('Некорректная сумма заказа'));
    }

    let objectIds;
    try {
      objectIds = items.map((id: string) => new mongoose.Types.ObjectId(id));
    } catch {
      return next(new BadRequestError('Некорректный id товара'));
    }

    const products = await Product.find({ _id: { $in: objectIds } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    const notForSale = products.find((p) => p.price == null);
    if (notForSale) {
      return next(new BadRequestError(`Товар "${notForSale.title}" не продаётся`));
    }

    const totalPrice = products.reduce((acc, p) => acc + (p.price || 0), 0);

    const orderId = faker.string.uuid();
    return res.status(201).json({ id: orderId, total: totalPrice });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
