import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface TicTacToeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
}

type Cell = 'X' | 'O' | null;

export default function TicTacToe({ difficulty, players }: TicTacToeProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const calculateWinner = (squares: Cell[]): Cell | 'Draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return squares.every(cell => cell !== null) ? 'Draw' : null;
  };

  const minimax = (squares: Cell[], depth: number, isMaximizing: boolean): number => {
    const result = calculateWinner(squares);
    
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getAIMove = (squares: Cell[]): number => {
    if (difficulty === 'easy') {
      const empty = squares.map((cell, i) => cell === null ? i : null).filter(i => i !== null) as number[];
      return empty[Math.floor(Math.random() * empty.length)];
    }

    if (difficulty === 'medium' && Math.random() < 0.5) {
      const empty = squares.map((cell, i) => cell === null ? i : null).filter(i => i !== null) as number[];
      return empty[Math.floor(Math.random() * empty.length)];
    }

    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
      else if (gameWinner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
      else setScores(s => ({ ...s, draws: s.draws + 1 }));
    } else {
      setIsXNext(!isXNext);
    }
  };

  useEffect(() => {
    if (!isXNext && players === 1 && !winner) {
      setTimeout(() => {
        const aiMove = getAIMove([...board]);
        handleClick(aiMove);
      }, 500);
    }
  }, [isXNext, players, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gamePurple to-gamePink bg-clip-text text-transparent">
            Крестики-нолики
          </h2>
          
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gamePurple">X: {scores.X}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground">Ничья: {scores.draws}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gamePink">O: {scores.O}</div>
            </div>
          </div>

          {winner ? (
            <div className="text-2xl font-bold mb-4">
              {winner === 'Draw' ? '🤝 Ничья!' : `🎉 Победил ${winner}!`}
            </div>
          ) : (
            <div className="text-xl text-muted-foreground">
              Ход: <span className="font-bold text-primary">{isXNext ? 'X' : 'O'}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner}
              className="aspect-square bg-muted hover:bg-muted/70 rounded-2xl text-6xl font-bold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {cell && (
                <span className={cell === 'X' ? 'text-gamePurple' : 'text-gamePink'}>
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button onClick={resetGame} className="w-full bg-gradient-to-r from-gamePurple to-gamePink">
          <Icon name="RotateCcw" size={20} className="mr-2" />
          Новая игра
        </Button>
      </Card>
    </div>
  );
}
