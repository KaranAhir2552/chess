import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { env } from '@repo/backend-common/config';
import authRouter from './auth/routes.js';

const app = express();

const PORT = env.PORT || 4000;

app.use(express.json());

app.use('/auth', authRouter);
app.get('/health', (_, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server healthy',
  });
});

app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
});
