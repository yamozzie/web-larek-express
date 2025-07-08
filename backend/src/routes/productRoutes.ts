import { Router } from 'express';

import { getProducts, createProduct } from '../controllers/productController';

const router = Router();

router.get('/product', getProducts);

router.post('/product', createProduct);

export default router;
