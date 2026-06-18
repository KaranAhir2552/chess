import express from 'express';
import { env } from '@repo/backend-common/config';
import authRouter from './auth/routes.js';
import cors from 'cors';
import gameRouter from './game/routes.js';
const app = express();

const PORT = env.PORT || 4000;
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies/auth headers
  })
);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/game', gameRouter);
app.get('/health', (_, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server healthy',
  });
});

app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
});
