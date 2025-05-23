import { Router } from 'express';
import { login, me, signup } from '../controllers/auth';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const authRoutes: Router = Router();
authRoutes.post('/login', errorHandler(login));
authRoutes.post('/signup', errorHandler(signup));
authRoutes.post('/me', [authMiddleware], errorHandler(me));

export default authRoutes;
