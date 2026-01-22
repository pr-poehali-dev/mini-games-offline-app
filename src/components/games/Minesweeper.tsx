import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MinesweeperProps {
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CellType {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function Minesweeper({ difficulty }: MinesweeperProps) {
  const config = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 10, cols: 10, mines: 20 },
    hard: { rows: 12, cols: 12, mines: 35 }
  }[difficulty];

  const [board, setBoard] = useState<CellType[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(config.mines);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    initBoard();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !gameOver && !won) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameOver, won]);

  const initBoard = () => {
    const newBoard: CellType[][] = Array(config.rows).fill(null).map(() =>
      Array(config.cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < config.mines) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWon(false);
    setFlagsLeft(config.mines);
    setTimer(0);
    setIsRunning(false);
  };

  const revealCell = (row: number, col: number) => {
    if (!isRunning) setIsRunning(true);
    if (gameOver || won || board[row][col].isRevealed || board[row][col].isFlagged) return;

    const newBoard = [...board];
    
    if (newBoard[row][col].isMine) {
      newBoard.forEach(r => r.forEach(c => { if (c.isMine) c.isRevealed = true; }));
      setBoard(newBoard);
      setGameOver(true);
      setIsRunning(false);
      return;
    }

    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) return;
      if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return;
      
      newBoard[r][c].isRevealed = true;
      
      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }
    };

    reveal(row, col);
    setBoard(newBoard);

    const revealedCount = newBoard.flat().filter(c => c.isRevealed).length;
    const totalSafeCells = config.rows * config.cols - config.mines;
    if (revealedCount === totalSafeCells) {
      setWon(true);
      setIsRunning(false);
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (!isRunning) setIsRunning(true);
    if (gameOver || won || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagsLeft(flagsLeft + (newBoard[row][col].isFlagged ? -1 : 1));
  };

  const getCellContent = (cell: CellType) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.isMine) return '💣';
    return cell.neighborMines > 0 ? cell.neighborMines : '';
  };

  const getNumberColor = (num: number) => {
    const colors = ['', 'text-gameBlue', 'text-green-500', 'text-gameOrange', 'text-gamePurple', 'text-gamePink', 'text-red-500', 'text-yellow-500', 'text-gray-500'];
    return colors[num] || '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gameOrange to-red-500 bg-clip-text text-transparent">
            Сапёр
          </h2>
          
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Мины</div>
              <div className="text-2xl font-bold">💣 {flagsLeft}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Время</div>
              <div className="text-2xl font-bold">⏱️ {timer}с</div>
            </div>
          </div>

          {gameOver && (
            <div className="text-2xl font-bold text-destructive mb-4">
              💥 Игра окончена!
            </div>
          )}
          {won && (
            <div className="text-2xl font-bold text-green-500 mb-4">
              🎉 Победа!
            </div>
          )}
        </div>

        <div className="overflow-x-auto mb-6">
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}>
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  disabled={gameOver || won}
                  className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base font-bold rounded transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed
                    ${cell.isRevealed
                      ? cell.isMine
                        ? 'bg-destructive'
                        : 'bg-muted/50'
                      : 'bg-muted hover:bg-muted/70'
                    } ${getNumberColor(cell.neighborMines)}`}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center mb-4">
          Левый клик - открыть | Правый клик - флажок
        </div>

        <Button onClick={initBoard} className="w-full bg-gradient-to-r from-gameOrange to-red-500">
          <Icon name="RotateCcw" size={20} className="mr-2" />
          Новая игра
        </Button>
      </Card>
    </div>
  );
}
