import { LogLevel, LogTest, ConsoleMethods } from './types';
import { getLogLevel, getTestLocation } from './utils';
import { levels } from './consts';

export interface PatchConsoleMethodsOptions {
  filenameRegex?: RegExp;
  getTestName?: () => string;
  threshold?: LogLevel;
}

const originalConsoleMethods: ConsoleMethods = {};

// Pathes the global console methods requested with new methods that
// will suppress output when the args are matched by a test.
//
// If the args are not matched, then original console method will
// be called with the args, and information about where the
// console method originated from will also be printed.
const patchConsoleMethods = (
  methods: (keyof ConsoleMethods)[],
  tests: LogTest[],
  {
    filenameRegex,
    getTestName,
    threshold = 'ERROR',
  }: PatchConsoleMethodsOptions,
) => {
  const thresholdValue = levels[threshold];

  methods.forEach((consoleMethod) => {
    const originalMethod = global.console[consoleMethod];
    originalConsoleMethods[consoleMethod] = originalMethod;

    global.console[consoleMethod] = (...args) => {
      try {
        const logLevel = getLogLevel(tests, args);

        if (logLevel === null || levels[logLevel] >= thresholdValue) {
          originalMethod(
            ...args,
            getTestLocation({ filenameRegex, getTestName }),
          );
        }
      } catch (ex) {
        originalMethod(
          ...args,
          getTestLocation({ filenameRegex, getTestName }),
        );
      }
    };
  });
};

export { patchConsoleMethods, LogLevel, LogTest };
