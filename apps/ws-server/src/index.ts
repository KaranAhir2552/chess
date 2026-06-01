import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket: Socket) => {
  console.log('Player connected:', socket.id);
  socket.on('find-game', () => {
    // handleFindGame(io, socket);
  });
  socket.on('move', (data) => {
    // handleMove(io, socket, data);
  });
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    // if there is player is in waiting list and hit disconnect than, remove from waiting list also

    // const waitingPlayer = getWaitingPlayer();
    //       if (
    //         waitingPlayer?.id === socket.id
    //       ) {
    //         clearWaitingPlayer();
    //       }
  });
});

httpServer.listen(3000);
