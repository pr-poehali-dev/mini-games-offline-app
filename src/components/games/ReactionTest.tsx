import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ReactionTestProps {
  players: number;
}

export default function ReactionTest({ players }: ReactionTestProps) {
  const [state, setState] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [bestTimes, setBestTimes] = useState<number[]>(Array(players).fill(Infinity));

  useEffect(() => {
    if (state === 'ready') {
      const delay = 2000 + Math.random() * 3000;
      const timeout = setTimeout(() => {
        setState('go');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const startTest = () => {
    setState('ready');
    setReactionTime(0);
  };

  const handleClick = () => {
    if (state === 'ready') {
      setState('result');
      setReactionTime(-1);
    } else if (state === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setState('result');
      
      const newScores = [...scores, time];
      setScores(newScores);
      
      const newBestTimes = [...bestTimes];
      if (time < bestTimes[currentPlayer]) {
        newBestTimes[currentPlayer] = time;
        setBestTimes(newBestTimes);
      }
    }
  };

  const nextPlayer = () => {
    if (currentPlayer < players - 1) {
      setCurrentPlayer(currentPlayer + 1);
      setState('waiting');
    } else {
      setCurrentPlayer(0);
      setState('waiting');
    }
  };

  const resetAll = () => {
    setState('waiting');
    setCurrentPlayer(0);
    setScores([]);
    setBestTimes(Array(players).fill(Infinity));
  };

  const getAverageTime = (playerIndex: number) => {
    const playerScores = scores.filter((_, i) => i % players === playerIndex);
    if (playerScores.length === 0) return 0;
    return Math.round(playerScores.reduce((a, b) => a + b, 0) / playerScores.length);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-gameBlue bg-clip-text text-transparent">
            Тест реакции
          </h2>
          
          {players > 1 && (
            <div className="text-xl font-semibold mb-4">
              Игрок {currentPlayer + 1}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: players }, (_, i) => (
              <div key={i} className={`p-4 rounded-lg ${currentPlayer === i ? 'bg-primary' : 'bg-muted'}`}>
                <div className="text-sm text-muted-foreground">Игрок {i + 1}</div>
                <div className="text-xs text-muted-foreground mt-1">Лучшее</div>
                <div className="text-xl font-bold">
                  {bestTimes[i] === Infinity ? '-' : `${bestTimes[i]}мс`}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Среднее</div>
                <div className="text-sm font-bold">
                  {getAverageTime(i) === 0 ? '-' : `${getAverageTime(i)}мс`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          {state === 'waiting' && (
            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Нажмите кнопку, чтобы начать тест
              </p>
              <Button
                onClick={startTest}
                className="w-full py-8 text-xl bg-gradient-to-r from-green-500 to-gameBlue"
              >
                <Icon name="Play" size={28} className="mr-2" />
                Начать
              </Button>
            </div>
          )}

          {state === 'ready' && (
            <button
              onClick={handleClick}
              className="w-full aspect-square rounded-3xl bg-destructive hover:bg-destructive/80 transition-all duration-200 flex items-center justify-center text-4xl font-bold animate-pulse"
            >
              Ждите...
            </button>
          )}

          {state === 'go' && (
            <button
              onClick={handleClick}
              className="w-full aspect-square rounded-3xl bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center justify-center text-4xl font-bold animate-pulse-glow"
            >
              НАЖМИ!
            </button>
          )}

          {state === 'result' && (
            <div className="text-center space-y-6">
              {reactionTime === -1 ? (
                <div>
                  <div className="text-4xl font-bold text-destructive mb-4">
                    Слишком рано!
                  </div>
                  <p className="text-muted-foreground">Дождитесь зелёного цвета</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl font-bold text-primary mb-2">
                    {reactionTime}мс
                  </div>
                  <div className="text-lg text-muted-foreground mb-4">
                    {reactionTime < 200 && '⚡ Молниеносно!'}
                    {reactionTime >= 200 && reactionTime < 300 && '🚀 Отлично!'}
                    {reactionTime >= 300 && reactionTime < 400 && '👍 Хорошо'}
                    {reactionTime >= 400 && '🐢 Можно быстрее'}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {players > 1 && (
                  <Button onClick={nextPlayer} variant="outline" className="flex-1">
                    <Icon name="ArrowRight" size={20} className="mr-2" />
                    Следующий игрок
                  </Button>
                )}
                <Button onClick={startTest} className="flex-1 bg-gradient-to-r from-green-500 to-gameBlue">
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Ещё раз
                </Button>
              </div>
            </div>
          )}
        </div>

        {scores.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-sm font-medium mb-2">История попыток:</div>
            <div className="flex flex-wrap gap-2">
              {scores.map((score, i) => (
                <div key={i} className="px-3 py-1 bg-muted rounded-lg text-sm">
                  П{(i % players) + 1}: {score}мс
                </div>
              ))}
            </div>
            <Button onClick={resetAll} variant="outline" className="w-full mt-4">
              <Icon name="Trash2" size={16} className="mr-2" />
              Сбросить всё
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
