import { Router } from 'express';

import { getProducts, createProduct, productRouteValidator } from '../controllers/productController';

const router = Router();

router.get('/product', getProducts);

router.post('/product', productRouteValidator, createProduct);

export default router;
