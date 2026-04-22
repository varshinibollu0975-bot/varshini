import { Point, Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const TRACKS: Track[] = [
  { id: 0, title: "DATA_STREAM_0x01", tempo: 120 },
  { id: 1, title: "MEMORY_LEAK_DETECTED", tempo: 95 },
  { id: 2, title: "KERNEL_PANIC_SEQ", tempo: 140 },
];
