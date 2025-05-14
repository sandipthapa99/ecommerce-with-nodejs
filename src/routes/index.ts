import { Router } from 'express';
import authRoutes from './auth';
import productsRoutes from './products';
import authMiddleware from '../middlewares/auth';

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', [authMiddleware], productsRoutes);
export default rootRouter;
