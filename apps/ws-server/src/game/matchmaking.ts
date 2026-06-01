import { Server, Socket } from 'socket.io';
import { Chess } from 'chess.js';

import { getWaitingPlayer, setWaitingPlayer, clearWaitingPlayer } from '../managers/queueManager';

import { rooms } from '../managers/roomManager';

import { generateRoomId } from '../utils/generateRoomId';

const handleFindGame = (io: Server, socket: Socket) => {
  const waitingPlayer = getWaitingPlayer();

  // Match found
  if (waitingPlayer && waitingPlayer.id !== socket.id) {
    const roomId = generateRoomId();

    socket.join(roomId);
    waitingPlayer.join(roomId);

    const game = new Chess();

    rooms[roomId] = {
      players: {
        white: waitingPlayer.id,
        black: socket.id,
      },
      game,
    };

    // White player
    waitingPlayer.emit('game-start', {
      roomId,
      color: 'white',
    });

    // Black player
    socket.emit('game-start', {
      roomId,
      color: 'black',
    });

    console.log(`Game started: ${roomId}`);

    clearWaitingPlayer();
  } else {
    setWaitingPlayer(socket);

    socket.emit('waiting');

    console.log(`${socket.id} waiting`);
  }
};

export default handleFindGame;
