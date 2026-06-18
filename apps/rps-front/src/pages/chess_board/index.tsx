import React from 'react';
import { ChessBoard as Board } from 'react-chessboard-ui';
import 'react-chessboard-ui/dist/index.css';
import { GameApi } from '../../Services/ApiEndPoint';
import { postAPI } from '../../Services/BasicApi';
// import { socket } from '../../socket';

const ChessBoardPage: React.FC = () => {
  // useEffect(() => {
  //   socket.connect();
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const handleStartGame = () => {
    try {
      const response = postAPI<any>(GameApi.START, { timeControlType: 'BLITZ' });
      console.log('Start Game Response:', response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="border border-black h-screen flex items-center justify-center">
      {/* FEN: Forsyth Edwards Notation
                > Represents default starting position of chess game.
                > Has 6 parts: [Board] - rook, knight, bishop, queen, king, pawn -Small Letter (Black) and Capital Letter (White)
                               [Turn] - w (white) or b (black) - Active Turn
                               [Castling Rights] - KQkq (both sides can castle)
                               [En Passant Target Square] - - (no en passant target)
                               [Halfmove Clock] - 0 (no halfmoves)
                               [Fullmove Number] - 1 (first fullmove)
        */}
      <Board
        FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        onChange={(game) => console.log(game)}
        onEndGame={(data) => console.log('Game Ended', data)}
      />
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => handleStartGame()}
      >
        Play
      </button>
    </main>
  );
};

export default ChessBoardPage;
