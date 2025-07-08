import {
  ErrorRequestHandler, Request, Response, NextFunction,
} from 'express';
import { Error as MongooseError } from 'mongoose';
import { BadRequestError } from '../errors/badRequestError';
import { ConflictError } from '../errors/conflictError';

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof MongooseError.ValidationError) {
    return next(new BadRequestError(err.message));
  }

  if (err instanceof Error && err.message.includes('E11000')) {
    return next(new ConflictError(err.message));
  }

  if ('statusCode' in err && typeof err.statusCode === 'number') {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: 'На сервере произошла ошибка' });
};
