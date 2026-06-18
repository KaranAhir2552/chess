import { Router } from 'express';
import { login, register } from './cotroller.js';

const authRouter: Router = Router();

// Define your authentication routes here
authRouter.post('/login', login);

authRouter.post('/register', register);

export default authRouter;
