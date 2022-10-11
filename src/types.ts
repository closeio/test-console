export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type Matcher = string | RegExp;

export type ConsoleArgs = any[];

export interface LogTest {
  matcher: Matcher;
  level: LogLevel;
}

export type ConsoleMethod = (args: ConsoleArgs) => void;

export type ConsoleMethods = {
  debug?: ConsoleMethod;
  log?: ConsoleMethod;
  info?: ConsoleMethod;
  warn?: ConsoleMethod;
  error?: ConsoleMethod;
};
