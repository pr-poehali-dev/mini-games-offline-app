import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HangmanProps {
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
}

const WORDS = {
  easy: ['КОТ', 'ДОМ', 'ЛЕС', 'МЯЧ', 'СОК', 'РЕКА', 'МОРЕ', 'НЕБО', 'СТОЛ', 'ОКНО'],
  medium: ['МАШИНА', 'СОБАКА', 'ЯБЛОКО', 'ШКОЛА', 'ДОРОГА', 'ПИСЬМО', 'РАДУГА', 'КЛЮЧИК'],
  hard: ['КОСМОНАВТ', 'ПИРАМИДА', 'КОМПЬЮТЕР', 'ТЕЛЕФОН', 'ДИНОЗАВР', 'АКВАРИУМ', 'ЭСКАЛАТОР']
};

export default function Hangman({ difficulty, players }: HangmanProps) {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [scores, setScores] = useState({ wins: 0, losses: 0 });

  const MAX_MISTAKES = 6;
  const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (word && !gameOver) {
      const wordLetters = new Set(word.split(''));
      const guessedLetters = new Set([...guessed].filter(l => wordLetters.has(l)));
      
      if (guessedLetters.size === wordLetters.size) {
        setWon(true);
        setGameOver(true);
        setScores(s => ({ ...s, wins: s.wins + 1 }));
      } else if (mistakes >= MAX_MISTAKES) {
        setGameOver(true);
        setScores(s => ({ ...s, losses: s.losses + 1 }));
      }
    }
  }, [guessed, mistakes, word]);

  const resetGame = () => {
    const words = WORDS[difficulty];
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessed(new Set());
    setMistakes(0);
    setGameOver(false);
    setWon(false);
  };

  const handleGuess = (letter: string) => {
    if (gameOver || guessed.has(letter)) return;

    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);

    if (!word.includes(letter)) {
      setMistakes(mistakes + 1);
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, i) => (
      <div
        key={i}
        className="w-12 h-16 md:w-16 md:h-20 bg-muted rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold"
      >
        {guessed.has(letter) || gameOver ? letter : ''}
      </div>
    ));
  };

  const drawHangman = () => {
    const parts = ['👤', '🫱', '🫲', '🦵', '🦵'];
    return (
      <div className="text-6xl">
        {mistakes === 0 && '😊'}
        {mistakes === 1 && '😐'}
        {mistakes === 2 && '😟'}
        {mistakes === 3 && '😰'}
        {mistakes === 4 && '😨'}
        {mistakes === 5 && '😱'}
        {mistakes >= 6 && '💀'}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gameBlue to-gamePurple bg-clip-text text-transparent">
            Виселица
          </h2>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Победы</div>
              <div className="text-2xl font-bold text-green-500">{scores.wins}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Поражения</div>
              <div className="text-2xl font-bold text-destructive">{scores.losses}</div>
            </div>
          </div>

          <div className="mb-6">
            {drawHangman()}
            <div className="text-lg text-muted-foreground mt-2">
              Ошибок: {mistakes} / {MAX_MISTAKES}
            </div>
          </div>

          {gameOver && (
            <div className={`text-2xl font-bold mb-4 ${won ? 'text-green-500' : 'text-destructive'}`}>
              {won ? '🎉 Вы выиграли!' : `💀 Проиграли! Слово: ${word}`}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {renderWord()}
        </div>

        <div className="grid grid-cols-8 md:grid-cols-11 gap-2 mb-6">
          {ALPHABET.map(letter => (
            <Button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessed.has(letter) || gameOver}
              variant={guessed.has(letter) ? (word.includes(letter) ? 'default' : 'destructive') : 'outline'}
              className="text-sm md:text-base"
            >
              {letter}
            </Button>
          ))}
        </div>

        <Button onClick={resetGame} className="w-full bg-gradient-to-r from-gameBlue to-gamePurple">
          <Icon name="RotateCcw" size={20} className="mr-2" />
          Новая игра
        </Button>
      </Card>
    </div>
  );
}
