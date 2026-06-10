import { Router } from 'express';
import { join, register } from './cotroller.js';

const gameRouter: Router = Router();

// Define your authentication routes here
gameRouter.post('/join', join);

export default gameRouter;
