import { Chess } from 'chess.js';

export interface Room {
  players: {
    white: string;
    black: string;
  };

  game: Chess;
}
