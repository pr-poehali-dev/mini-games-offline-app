import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MemoryGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
}

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎸', '🎹', '🎺', '🎻', '🎤', '🎧', '🎬', '🎼', '🏀', '⚽', '🏈', '⚾'];

export default function MemoryGame({ difficulty, players }: MemoryGameProps) {
  const pairCount = { easy: 6, medium: 8, hard: 12 }[difficulty];
  
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState<number[]>(Array(players).fill(0));
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(cards.map(c =>
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setScores(s => {
            const newScores = [...s];
            newScores[currentPlayer]++;
            return newScores;
          });
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(cards.map(c =>
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlipped([]);
          setCurrentPlayer((currentPlayer + 1) % players);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setGameOver(true);
    }
  }, [cards]);

  const initGame = () => {
    const selectedEmojis = EMOJIS.slice(0, pairCount);
    const gameCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlipped([]);
    setCurrentPlayer(0);
    setScores(Array(players).fill(0));
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || gameOver) return;
    
    const card = cards.find(c => c.id === id);
    if (card && (card.isFlipped || card.isMatched)) return;

    setCards(cards.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    setFlipped([...flipped, id]);
  };

  const getWinner = () => {
    const maxScore = Math.max(...scores);
    const winners = scores.reduce((acc, score, i) => {
      if (score === maxScore) acc.push(i);
      return acc;
    }, [] as number[]);
    
    if (winners.length === 1) {
      return `Игрок ${winners[0] + 1} победил!`;
    }
    return 'Ничья!';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gamePink to-purple-500 bg-clip-text text-transparent">
            Память
          </h2>
          
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            {Array.from({ length: players }, (_, i) => (
              <div
                key={i}
                className={`px-6 py-3 rounded-lg transition-all ${
                  currentPlayer === i && !gameOver
                    ? 'bg-gradient-to-r from-gamePurple to-gamePink scale-110'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm text-muted-foreground">Игрок {i + 1}</div>
                <div className="text-2xl font-bold">{scores[i]}</div>
              </div>
            ))}
          </div>

          <div className="text-lg text-muted-foreground mb-4">
            Ходов: {moves}
          </div>

          {gameOver && (
            <div className="text-2xl font-bold text-primary mb-4">
              🎉 {getWinner()}
            </div>
          )}
        </div>

        <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(pairCount * 2))}, minmax(0, 1fr))` }}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={gameOver}
              className={`aspect-square rounded-2xl text-4xl md:text-5xl font-bold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed
                ${card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-gamePurple to-gamePink'
                  : 'bg-muted hover:bg-muted/70'
                }
                ${card.isMatched ? 'opacity-50' : ''}
              `}
            >
              {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
            </button>
          ))}
        </div>

        <Button onClick={initGame} className="w-full bg-gradient-to-r from-gamePink to-purple-500">
          <Icon name="RotateCcw" size={20} className="mr-2" />
          Новая игра
        </Button>
      </Card>
    </div>
  );
}
