import { ConsoleArgs, Matcher, LogTest, LogLevel } from "./types";
import { format } from "util";

interface GetTestLocationArgs {
  filenameRegex?: RegExp;
  getTestName?: () => string;
}

// Returns a string with the test name and the lines in the stack trace that are in test files.
export const getTestLocation = ({
  filenameRegex,
  getTestName,
}: GetTestLocationArgs = {}) => {
  const testLines = getTestFileStackTraceLines(filenameRegex);

  if (getTestName) {
    let location = `In Test [${getTestName()}]`;

    if (testLines.length) {
      location += "\n" + testLines.join("\n");
    }

    return location;
  }

  return testLines.join("\n");
};

export const getLogLevel = (
  tests: LogTest[],
  consoleArgs: ConsoleArgs
): LogLevel | null => {
  const args = prepareArgs(consoleArgs);

  const matchingTest = tests.find(({ matcher }) => argsMatch(matcher, args));

  if (matchingTest) {
    return matchingTest.level;
  }

  return null;
};

// console.log (and friends) can take format strings and args, such as:
// console.log('Warning: Failed %s type: %s', 'prop', 'The prop ...')
// This method uses the same format method as the console methods and
// attempts to interpret the args as a foramt string and args. If it
// does, the formatted string (what is actually printed out) is passed
// to the level checker.
const prepareArgs = (args: ConsoleArgs): string[] => {
  const [formatString] = args;

  if (typeof formatString === "string") {
    const formatted = format(...args);

    if (formatted !== formatString) {
      return [formatted];
    }
  }

  return args.map(toString);
};

const argsMatch = (matcher: Matcher, args: string[]) =>
  args.some((arg) => argMatches(matcher, arg));

const argMatches = (matcher: Matcher, arg: string) => {
  if (typeof matcher === "string") {
    return arg.includes(matcher);
  }
  return matcher.test(arg);
};

// Look at the current stack trace and return any lines that are from a test file, this is to
// help identify which tests log messages are coming from. If a log message is triggered by
// something async, it may not have a a test file in its stack trace.
const getTestFileStackTraceLines = (
  filenameRegex = /\.test\.[jt]sx?/i
): string[] => {
  const stack = Error().stack || "";

  const stackLines = stack.split("\n");
  return stackLines.filter((line) => filenameRegex.test(line));
};

// Convert any kind of console.log arg to a string that can then be matched against.
const toString = (val: any): string => {
  // Try a simple null/undefined-safe toString
  const str = `${val}`;

  // That won't work for some kinds of objects, in that situation, JSON.stringify
  if (str === "[object Object]") {
    const stringified = JSON.stringify(val);

    // Some things will return undefined from stringify (such as functions) so we'll fallback
    // to the string representation in those instances. However, functions work properly with
    // the toString method above, so this should never happens.
    return stringified || str;
  }

  return str;
};
