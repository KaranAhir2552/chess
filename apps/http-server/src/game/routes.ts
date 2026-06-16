import { Router } from 'express';
import { joinQueue } from './cotroller.js';
import { protectedRouter } from '../middleware/protectedRoute.js';

const gameRouter: Router = Router();

// Define your authentication routes here
gameRouter.post('/join', protectedRouter, joinQueue);

export default gameRouter;
