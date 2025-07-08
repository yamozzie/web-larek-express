import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';

import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import NotFoundError from './errors/notFoundError';
import errorHandler from './middlewares/errorHandler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();
const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/weblarek' } = process.env;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('/', productRoutes);
app.use('/', orderRoutes);

app.use(errorLogger);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errors());
app.use(errorHandler);


mongoose.connect(DB_ADDRESS);

// eslint-disable-next-line no-console
app.listen(PORT, () => { console.log(`App is listening on port ${PORT}`); });
