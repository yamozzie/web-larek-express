import { Router } from 'express';

import { createOrder } from '../controllers/orderController';
import { orderValidator } from '../middlewares/validators';

const router = Router();

router.post('/order', orderValidator, createOrder);

export default router;
