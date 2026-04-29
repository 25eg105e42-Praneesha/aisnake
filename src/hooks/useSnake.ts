import { useState, useCallback, useEffect } from 'react';
import { useInterval } from './useInterval';

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 15 },
  { x: 10, y: 16 },
  { x: 10, y: 17 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

const getRandomFoodPosition = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export const useSnake = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Buffer direction to prevent rapid multiple keystrokes reversing into itself
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const pauseGame = () => {
    if (!isGameOver) {
      setIsPaused(prev => !prev);
    }
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (nextDirection) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(getRandomFoodPosition(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      setDirection(nextDirection);
      return newSnake;
    });
  }, [nextDirection, isGameOver, isPaused, food, score, highScore]);

  useInterval(moveSnake, isGameOver || isPaused ? null : GAME_SPEED);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        pauseGame();
        return;
      }

      setNextDirection(prev => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            return prev !== 'DOWN' ? 'UP' : prev;
          case 'ArrowDown':
          case 's':
          case 'S':
            return prev !== 'UP' ? 'DOWN' : prev;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            return prev !== 'RIGHT' ? 'LEFT' : prev;
          case 'ArrowRight':
          case 'd':
          case 'D':
            return prev !== 'LEFT' ? 'RIGHT' : prev;
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  return {
    snake,
    food,
    isGameOver,
    score,
    highScore,
    startGame,
    isPaused,
    GRID_SIZE,
  };
};
