import { Router } from 'express';
import { signup, login, getMe, verifyEmail } from '../controllers/user.controller';
import { protect } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { loginSchema, signupSchema } from '../validators/user.validator';

const router = Router();

router.post('/auth/signup', validate(signupSchema) as any, signup as any);
router.post('/auth/login', validate(loginSchema) as any, login as any);
router.get('/auth/verify-email', verifyEmail as any)

// Protected routes (require authentication)
router.get('/user/me', protect as any, getMe as any);

export default router;