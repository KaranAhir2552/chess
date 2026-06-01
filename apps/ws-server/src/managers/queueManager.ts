import { Socket } from 'socket.io';

let waitingPlayer: Socket | null = null;

export const setWaitingPlayer = (socket: Socket) => {
  waitingPlayer = socket;
};

export const getWaitingPlayer = () => {
  return waitingPlayer;
};

export const clearWaitingPlayer = () => {
  waitingPlayer = null;
};
