import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import TicTacToe from '@/components/games/TicTacToe';
import Minesweeper from '@/components/games/Minesweeper';
import Hangman from '@/components/games/Hangman';
import MemoryGame from '@/components/games/MemoryGame';
import ColorMatch from '@/components/games/ColorMatch';
import ReactionTest from '@/components/games/ReactionTest';
import NumberGuesser from '@/components/games/NumberGuesser';
import SimonSays from '@/components/games/SimonSays';

type GameType = 'menu' | 'tictactoe' | 'minesweeper' | 'hangman' | 'memory' | 'color' | 'reaction' | 'number' | 'simon';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameConfig {
  id: GameType;
  name: string;
  icon: string;
  players: string;
  description: string;
  gradient: string;
}

const games: GameConfig[] = [
  {
    id: 'tictactoe',
    name: 'Крестики-нолики',
    icon: 'Grid3x3',
    players: '1-2 игрока',
    description: 'Классическая игра на 3×3 поле',
    gradient: 'from-gamePurple to-gamePink'
  },
  {
    id: 'minesweeper',
    name: 'Сапёр',
    icon: 'Bomb',
    players: '1 игрок',
    description: 'Найди все мины и открой клетки',
    gradient: 'from-gameOrange to-red-500'
  },
  {
    id: 'hangman',
    name: 'Виселица',
    icon: 'MessageSquare',
    players: '1-2 игрока',
    description: 'Угадай слово по буквам',
    gradient: 'from-gameBlue to-gamePurple'
  },
  {
    id: 'memory',
    name: 'Память',
    icon: 'Brain',
    players: '1-4 игрока',
    description: 'Найди все пары карточек',
    gradient: 'from-gamePink to-purple-500'
  },
  {
    id: 'color',
    name: 'Цветовой матч',
    icon: 'Palette',
    players: '1 игрок',
    description: 'Найди правильный цвет за время',
    gradient: 'from-yellow-500 to-gameOrange'
  },
  {
    id: 'reaction',
    name: 'Реакция',
    icon: 'Zap',
    players: '1-4 игрока',
    description: 'Проверь скорость реакции',
    gradient: 'from-green-500 to-gameBlue'
  },
  {
    id: 'number',
    name: 'Угадай число',
    icon: 'Hash',
    players: '1-2 игрока',
    description: 'Угадай загаданное число',
    gradient: 'from-gamePurple to-gameBlue'
  },
  {
    id: 'simon',
    name: 'Саймон говорит',
    icon: 'Lightbulb',
    players: '1-2 игрока',
    description: 'Повтори последовательность',
    gradient: 'from-gamePink to-gameOrange'
  }
];

export default function Index() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [players, setPlayers] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const startGame = (gameId: GameType) => {
    setSelectedGame(gameId);
    setShowSettings(true);
  };

  const confirmStart = () => {
    if (selectedGame) {
      setCurrentGame(selectedGame);
      setShowSettings(false);
    }
  };

  const backToMenu = () => {
    setCurrentGame('menu');
    setShowSettings(false);
    setSelectedGame(null);
  };

  if (showSettings && selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const maxPlayers = game?.players.includes('4') ? 4 : game?.players.includes('2') ? 2 : 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20 animate-scale-in">
          <div className="text-center space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${game?.gradient} flex items-center justify-center`}>
              <Icon name={game?.icon || 'Gamepad2'} size={40} className="text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">{game?.name}</h2>
              <p className="text-muted-foreground">{game?.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Сложность</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <Button
                      key={diff}
                      variant={difficulty === diff ? 'default' : 'outline'}
                      onClick={() => setDifficulty(diff)}
                      className="capitalize"
                    >
                      {diff === 'easy' ? 'Легко' : diff === 'medium' ? 'Средне' : 'Сложно'}
                    </Button>
                  ))}
                </div>
              </div>

              {maxPlayers > 1 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Количество игроков</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: maxPlayers }, (_, i) => i + 1).map((num) => (
                      <Button
                        key={num}
                        variant={players === num ? 'default' : 'outline'}
                        onClick={() => setPlayers(num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <Button onClick={confirmStart} className="flex-1 bg-gradient-to-r from-gamePurple to-gamePink">
                <Icon name="Play" size={20} className="mr-2" />
                Играть
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (currentGame !== 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <div className="container max-w-6xl mx-auto p-4">
          <Button 
            variant="outline" 
            onClick={backToMenu}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Главное меню
          </Button>
          
          {currentGame === 'tictactoe' && <TicTacToe difficulty={difficulty} players={players} />}
          {currentGame === 'minesweeper' && <Minesweeper difficulty={difficulty} />}
          {currentGame === 'hangman' && <Hangman difficulty={difficulty} players={players} />}
          {currentGame === 'memory' && <MemoryGame difficulty={difficulty} players={players} />}
          {currentGame === 'color' && <ColorMatch difficulty={difficulty} />}
          {currentGame === 'reaction' && <ReactionTest players={players} />}
          {currentGame === 'number' && <NumberGuesser difficulty={difficulty} players={players} />}
          {currentGame === 'simon' && <SimonSays difficulty={difficulty} players={players} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container max-w-7xl mx-auto p-4 md:p-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gamePurple to-gamePink flex items-center justify-center animate-pulse-glow">
              <Icon name="Gamepad2" size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gamePurple via-gamePink to-gameOrange bg-clip-text text-transparent">
            Мини-Игры
          </h1>
          <p className="text-xl text-muted-foreground">
            8 увлекательных игр для 1-4 игроков 🎮
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <Card
              key={game.id}
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => startGame(game.id)}
            >
              <div className="p-6 space-y-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center group-hover:animate-float`}>
                  <Icon name={game.icon} size={32} className="text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Users" size={14} />
                    <span>{game.players}</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-gamePurple to-gamePink hover:opacity-90 transition-opacity">
                  <Icon name="Play" size={18} className="mr-2" />
                  Играть
                </Button>
              </div>

              <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" size={20} className="text-gameOrange" />
                <span>Статистика сохраняется</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={20} className="text-gamePurple" />
                <span>Разные уровни сложности</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" size={20} className="text-gamePink" />
                <span>Мультиплеер</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
