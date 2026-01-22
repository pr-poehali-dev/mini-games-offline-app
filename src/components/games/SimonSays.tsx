import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SimonSaysProps {
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
}

const COLORS = [
  { id: 0, name: 'Красный', color: 'bg-red-500', activeColor: 'bg-red-300' },
  { id: 1, name: 'Синий', color: 'bg-blue-500', activeColor: 'bg-blue-300' },
  { id: 2, name: 'Зелёный', color: 'bg-green-500', activeColor: 'bg-green-300' },
  { id: 3, name: 'Жёлтый', color: 'bg-yellow-500', activeColor: 'bg-yellow-300' }
];

export default function SimonSays({ difficulty, players }: SimonSaysProps) {
  const speed = { easy: 800, medium: 600, hard: 400 }[difficulty];
  
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState<number[]>(Array(players).fill(0));
  const [gameOver, setGameOver] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);

  const startGame = () => {
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setPlayerSequence([]);
    setIsPlaying(true);
    setGameOver(false);
    setScores(Array(players).fill(0));
    setCurrentPlayer(0);
    playSequence([firstColor]);
  };

  const playSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, speed));
      setActiveButton(null);
    }
    setIsShowingSequence(false);
  };

  const handleButtonClick = (colorId: number) => {
    if (!isPlaying || gameOver || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);
    
    setActiveButton(colorId);
    setTimeout(() => setActiveButton(null), 200);

    const currentIndex = playerSequence.length;
    
    if (colorId !== sequence[currentIndex]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScores = [...scores];
      newScores[currentPlayer]++;
      setScores(newScores);
      
      setTimeout(() => {
        const nextSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSequence);
        setPlayerSequence([]);
        
        if (players > 1) {
          setCurrentPlayer((currentPlayer + 1) % players);
        }
        
        playSequence(nextSequence);
      }, 1000);
    }
  };

  const getBestScore = () => Math.max(...scores);
  const getWinner = () => {
    const maxScore = getBestScore();
    return scores.findIndex(s => s === maxScore);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gamePink to-gameOrange bg-clip-text text-transparent">
            Саймон говорит
          </h2>
          
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            {Array.from({ length: players }, (_, i) => (
              <div
                key={i}
                className={`px-6 py-3 rounded-lg transition-all ${
                  currentPlayer === i && isPlaying && !gameOver
                    ? 'bg-gradient-to-r from-gamePink to-gameOrange scale-110'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm text-muted-foreground">Игрок {i + 1}</div>
                <div className="text-2xl font-bold">{scores[i]}</div>
              </div>
            ))}
          </div>

          {isPlaying && !gameOver && (
            <div className="text-lg font-semibold mb-2">
              {isShowingSequence ? (
                <span className="text-primary animate-pulse">Запоминайте...</span>
              ) : (
                <span className="text-gameOrange">
                  Повторите ({playerSequence.length} / {sequence.length})
                </span>
              )}
            </div>
          )}

          {gameOver && (
            <div className="text-2xl font-bold text-primary mb-4 animate-scale-in">
              {players > 1 
                ? `🏆 Победил игрок ${getWinner() + 1} со счётом ${getBestScore()}!`
                : `🎮 Ваш результат: ${scores[0]} уровней!`
              }
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => handleButtonClick(color.id)}
              disabled={!isPlaying || gameOver || isShowingSequence}
              className={`aspect-square rounded-2xl transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed ${
                activeButton === color.id ? color.activeColor : color.color
              } ${activeButton === color.id ? 'scale-110 shadow-2xl' : ''}`}
            >
              <span className="text-white font-bold text-xl drop-shadow-lg">
                {color.name}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {!isPlaying && (
            <Button
              onClick={startGame}
              className="w-full py-6 text-lg bg-gradient-to-r from-gamePink to-gameOrange"
            >
              <Icon name="Play" size={24} className="mr-2" />
              {gameOver ? 'Играть снова' : 'Начать игру'}
            </Button>
          )}

          {isPlaying && (
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Уровень: {sequence.length}
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {sequence.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < playerSequence.length ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {isPlaying && !isShowingSequence && !gameOver && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            💡 Запомните последовательность и повторите её
          </div>
        )}
      </Card>
    </div>
  );
}
