export type Point = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Track {
  id: number;
  title: string;
  tempo: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
