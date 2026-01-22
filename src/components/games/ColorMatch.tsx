import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ColorMatchProps {
  difficulty: 'easy' | 'medium' | 'hard';
}

const COLORS = [
  { name: 'Красный', hex: '#ef4444', text: 'Красный' },
  { name: 'Синий', hex: '#3b82f6', text: 'Синий' },
  { name: 'Зелёный', hex: '#22c55e', text: 'Зелёный' },
  { name: 'Жёлтый', hex: '#eab308', text: 'Жёлтый' },
  { name: 'Фиолетовый', hex: '#a855f7', text: 'Фиолетовый' },
  { name: 'Оранжевый', hex: '#f97316', text: 'Оранжевый' },
  { name: 'Розовый', hex: '#ec4899', text: 'Розовый' },
  { name: 'Голубой', hex: '#0ea5e9', text: 'Голубой' }
];

export default function ColorMatch({ difficulty }: ColorMatchProps) {
  const timeLimit = { easy: 10, medium: 7, hard: 5 }[difficulty];
  
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [textColor, setTextColor] = useState(COLORS[1]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(timeLimit);
    setIsPlaying(true);
    generateRound();
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const generateRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const text = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    const opts = shuffled.slice(0, 4);
    if (!opts.includes(target)) {
      opts[Math.floor(Math.random() * 4)] = target;
    }
    
    setTargetColor(target);
    setTextColor(text);
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const handleChoice = (color: typeof COLORS[0]) => {
    if (!isPlaying) return;
    
    if (color.hex === targetColor.hex) {
      setScore(score + 1);
      setTimeLeft(timeLeft + 1);
      generateRound();
    } else {
      setScore(Math.max(0, score - 1));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-gameOrange bg-clip-text text-transparent">
            Цветовой матч
          </h2>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Очки</div>
              <div className="text-3xl font-bold text-primary">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Рекорд</div>
              <div className="text-3xl font-bold text-gameOrange">{highScore}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Время</div>
              <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-destructive animate-pulse' : 'text-gameBlue'}`}>
                {timeLeft}с
              </div>
            </div>
          </div>

          {!isPlaying && score > 0 && (
            <div className="text-2xl font-bold text-primary mb-4">
              Игра окончена! Счёт: {score}
            </div>
          )}
        </div>

        {isPlaying ? (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-lg text-muted-foreground mb-4">
                Найдите цвет слова:
              </div>
              <div
                className="text-6xl font-bold mb-8"
                style={{ color: textColor.hex }}
              >
                {targetColor.text}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(color)}
                  className="p-8 rounded-2xl transition-all duration-200 hover:scale-105 border-4 border-transparent hover:border-primary"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="text-2xl font-bold text-white drop-shadow-lg">
                    {color.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Выберите цвет, которым написано слово, а не значение самого слова!
            </p>
            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-yellow-500 to-gameOrange text-lg py-6"
            >
              <Icon name="Play" size={24} className="mr-2" />
              {score > 0 ? 'Играть снова' : 'Начать игру'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
