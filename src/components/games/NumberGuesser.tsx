import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface NumberGuesserProps {
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
}

export default function NumberGuesser({ difficulty, players }: NumberGuesserProps) {
  const maxNumber = { easy: 50, medium: 100, hard: 500 }[difficulty];
  const maxAttempts = { easy: 10, medium: 8, hard: 12 }[difficulty];
  
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<{ player: number; guess: number; hint: string }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>(Array(players).fill(0));

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  const resetGame = () => {
    setTarget(Math.floor(Math.random() * maxNumber) + 1);
    setGuess('');
    setAttempts([]);
    setCurrentPlayer(0);
    setGameOver(false);
    setWinner(null);
  };

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > maxNumber) {
      return;
    }

    let hint = '';
    if (num === target) {
      hint = '🎉 Угадал!';
      setWinner(currentPlayer);
      setGameOver(true);
      setScores(s => {
        const newScores = [...s];
        newScores[currentPlayer]++;
        return newScores;
      });
    } else if (num < target) {
      const diff = target - num;
      if (diff <= 5) hint = '🔥 Очень близко! Больше';
      else if (diff <= 15) hint = '📈 Больше';
      else hint = '⬆️ Намного больше';
    } else {
      const diff = num - target;
      if (diff <= 5) hint = '🔥 Очень близко! Меньше';
      else if (diff <= 15) hint = '📉 Меньше';
      else hint = '⬇️ Намного меньше';
    }

    const newAttempts = [...attempts, { player: currentPlayer, guess: num, hint }];
    setAttempts(newAttempts);
    setGuess('');

    if (!gameOver) {
      if (num !== target) {
        setCurrentPlayer((currentPlayer + 1) % players);
      }
      
      if (newAttempts.length >= maxAttempts && num !== target) {
        setGameOver(true);
      }
    }
  };

  const playerAttempts = (playerIndex: number) => {
    return attempts.filter(a => a.player === playerIndex).length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gamePurple to-gameBlue bg-clip-text text-transparent">
            Угадай число
          </h2>
          
          <p className="text-lg text-muted-foreground mb-4">
            Число от 1 до {maxNumber}
          </p>

          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            {Array.from({ length: players }, (_, i) => (
              <div
                key={i}
                className={`px-6 py-3 rounded-lg transition-all ${
                  currentPlayer === i && !gameOver
                    ? 'bg-gradient-to-r from-gamePurple to-gameBlue scale-110'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm text-muted-foreground">Игрок {i + 1}</div>
                <div className="text-xs text-muted-foreground mt-1">Побед: {scores[i]}</div>
                <div className="text-lg font-bold">Попыток: {playerAttempts(i)}</div>
              </div>
            ))}
          </div>

          <div className="text-lg font-semibold mb-2">
            Всего попыток: {attempts.length} / {maxAttempts}
          </div>

          {gameOver && winner !== null && (
            <div className="text-2xl font-bold text-primary mb-4 animate-scale-in">
              🎉 Игрок {winner + 1} победил!
            </div>
          )}

          {gameOver && winner === null && (
            <div className="text-2xl font-bold text-destructive mb-4">
              😔 Попытки закончились! Число было: {target}
            </div>
          )}
        </div>

        {!gameOver && (
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                Ход игрока {currentPlayer + 1}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  placeholder="Введите число"
                  min={1}
                  max={maxNumber}
                  className="text-center text-2xl h-14"
                />
                <Button
                  onClick={handleGuess}
                  className="px-8 bg-gradient-to-r from-gamePurple to-gameBlue"
                  disabled={!guess}
                >
                  <Icon name="Send" size={24} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {attempts.length > 0 && (
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            <div className="text-sm font-medium mb-2">История попыток:</div>
            {[...attempts].reverse().map((attempt, i) => (
              <div
                key={attempts.length - 1 - i}
                className={`p-3 rounded-lg ${
                  attempt.hint.includes('Угадал')
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : 'bg-muted'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    Игрок {attempt.player + 1}: {attempt.guess}
                  </span>
                  <span className="text-sm">{attempt.hint}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-gamePurple to-gameBlue"
        >
          <Icon name="RotateCcw" size={20} className="mr-2" />
          Новая игра
        </Button>
      </Card>
    </div>
  );
}
