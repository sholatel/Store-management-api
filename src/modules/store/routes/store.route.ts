import { Router } from 'express';
import { protect } from '../../../middlewares/auth.middleware';
import { createStore, getStores, getStoreProducts } from '../controllers/store.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { createStoreSchema } from '../validators/store.validator';

const router = Router();

router.use(protect as any);
router.get('/stores', getStores as any);
router.get('/stores/:storeId/products', getStoreProducts as any);

// Protected routes
router.post('/stores' , validate(createStoreSchema) as any, createStore as any);

export default router;