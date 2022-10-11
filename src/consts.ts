import { LogLevel } from './types';

export const levels: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 3,
  ERROR: 4,
  CRITICAL: 5,
};
