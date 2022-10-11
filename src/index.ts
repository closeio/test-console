import { LogLevel, LogTest, ConsoleMethods } from "./types";
import { getLogLevel, getTestLocation } from "./utils";
import { levels } from "./consts";

export interface PatchConsoleMethodsOptions {
  filenameRegex?: RegExp;
  getTestName?: () => string;
  threshold?: LogLevel;
}

const originalConsoleMethods: ConsoleMethods = {};

const patchConsoleMethods = (
  methods: (keyof ConsoleMethods)[],
  tests: LogTest[],
  {
    filenameRegex,
    getTestName,
    threshold = "ERROR",
  }: PatchConsoleMethodsOptions
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
            getTestLocation({ filenameRegex, getTestName })
          );
        }
      } catch (ex) {
        originalMethod(
          ...args,
          getTestLocation({ filenameRegex, getTestName })
        );
      }
    };
  });
};

export { patchConsoleMethods, LogLevel, LogTest };
