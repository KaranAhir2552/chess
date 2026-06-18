import { io } from 'socket.io-client';
import { env } from '@repo/backend-common/config';

export const socket = io(env.WSPORT || 'http://localhost:4000', {
  autoConnect: false,
});
