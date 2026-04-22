import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    directionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted && !isGameOver) {
      setIsPaused(prev => !prev);
      return;
    }

    if (!hasStarted || isPaused || isGameOver) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
        if (currentDir !== 'DOWN') nextDirectionRef.current = 'UP';
        break;
      case 'ArrowDown':
        if (currentDir !== 'UP') nextDirectionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
        if (currentDir !== 'RIGHT') nextDirectionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
        if (currentDir !== 'LEFT') nextDirectionRef.current = 'RIGHT';
        break;
    }
  }, [hasStarted, isPaused, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver || !hasStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      directionRef.current = nextDirectionRef.current;
      const currentDir = directionRef.current;

      const newHead = { ...head };

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isPaused, isGameOver, hasStarted]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score Board */}
      <div className="flex justify-between w-full max-w-[400px] px-4 py-2 bg-black border-2 border-glitch-cyan shadow-glitch-cyan text-xl">
        <div className="text-glitch-cyan font-bold">
          SCORE:<span className="text-white ml-2">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-glitch-magenta font-bold">
          CYCLES:<span className="text-white ml-2">{Math.floor((INITIAL_SPEED - speed) / SPEED_INCREMENT)}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-glitch-dark border-4 border-glitch-cyan shadow-glitch-cyan overflow-hidden"
        style={{ 
          width: `${GRID_SIZE * 20}px`, 
          height: `${GRID_SIZE * 20}px`,
          backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute w-[20px] h-[20px] ${isHead ? 'bg-white' : 'bg-glitch-cyan'} border border-black`}
              style={{
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute w-[20px] h-[20px] bg-glitch-magenta border border-white flicker"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />

        {/* Overlays */}
        {!hasStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center flex-col z-20">
            <h2 className="text-glitch-cyan text-4xl font-bold mb-6 glitch-text" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-black border-2 border-glitch-magenta text-glitch-magenta hover:bg-glitch-magenta hover:text-black transition-colors text-2xl font-bold"
            >
              EXECUTE
            </button>
          </div>
        )}

        {isPaused && !isGameOver && hasStarted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <h2 className="text-glitch-magenta text-5xl font-bold glitch-text" data-text="THREAD_PAUSED">THREAD_PAUSED</h2>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/95 flex items-center justify-center flex-col z-20">
            <h2 className="text-white text-5xl font-bold mb-2 glitch-text" data-text="FATAL_EXCEPTION">FATAL_EXCEPTION</h2>
            <p className="text-glitch-cyan mb-8 text-2xl">ERR_CODE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-black border-2 border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-colors text-2xl font-bold"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="text-glitch-gray text-lg text-center mt-2">
        INPUT: <span className="text-glitch-cyan">ARROWS</span> // INTERRUPT: <span className="text-glitch-magenta">SPACE</span>
      </div>
    </div>
  );
};

export default SnakeGame;
