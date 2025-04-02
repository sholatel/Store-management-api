import { Router } from 'express';
import { protect, restrictTo } from '../../../middlewares/auth.middleware';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';


const router = Router();


router.post('/products', protect as any, validate(createProductSchema) as any, createProduct as any);
router.get('/products', getProducts as any);
router.get('/products/:productId', getProduct as any);
router.put('/products/:productId', protect as any, validate(updateProductSchema) as any, updateProduct as any);
router.delete('/products/:productId', protect as any, deleteProduct as any);

export default router;
